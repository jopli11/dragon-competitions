"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledDraw = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const postmark = __importStar(require("postmark"));
const crypto = __importStar(require("node:crypto"));
const contentful_management_1 = require("contentful-management");
const params_1 = require("firebase-functions/params");
admin.initializeApp();
const db = admin.firestore();
// Define Secrets using the new params API
const runtimeConfig = (0, params_1.defineJsonSecret)("RUNTIME_CONFIG");
const postmarkToken = (0, params_1.defineSecret)("POSTMARK_SERVER_TOKEN");
const contentfulToken = (0, params_1.defineSecret)("CONTENTFUL_MANAGEMENT_TOKEN");
/**
 * Scheduled function to run every minute and check for ended raffles
 * that need a draw.
 */
exports.scheduledDraw = functions.runWith({
    secrets: [runtimeConfig, postmarkToken, contentfulToken]
}).pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
    // Access values via .value()
    const config = runtimeConfig.value();
    process.env.CONTENTFUL_SPACE_ID = config.contentful?.space_id;
    process.env.CONTENTFUL_ENVIRONMENT = config.contentful?.environment;
    process.env.POSTMARK_FROM_EMAIL = config.postmark?.from_email;
    process.env.ADMIN_NOTIFICATION_EMAIL = config.admin?.notification_email;
    // Secrets are also available in process.env automatically when bound
    // but we can also use .value() for clarity if needed.
    process.env.POSTMARK_SERVER_TOKEN = postmarkToken.value();
    process.env.CONTENTFUL_MANAGEMENT_TOKEN = contentfulToken.value();
    const now = admin.firestore.Timestamp.now();
    const rafflesToDraw = await db
        .collection("raffles")
        .where("endAt", "<=", now)
        .where("drawStatus", "==", "pending")
        .get();
    if (rafflesToDraw.empty) {
        return null;
    }
    for (const raffleDoc of rafflesToDraw.docs) {
        const data = raffleDoc.data();
        // Skip if drawType is 'live' - these are handled manually by admins
        if (data.drawType === "live") {
            console.log(`Skipping automated draw for ${raffleDoc.id} (drawType is 'live')`);
            continue;
        }
        await performDraw(raffleDoc);
    }
    return null;
});
async function performDraw(raffleDoc) {
    const raffleId = raffleDoc.id;
    const raffleData = raffleDoc.data();
    const totalTickets = raffleData.ticketsSold || 0;
    if (totalTickets === 0) {
        await raffleDoc.ref.update({
            drawStatus: "completed",
            drawResult: "no_tickets_sold",
        });
        // Even if no tickets sold, check if we should reoccur
        if (raffleData.isReoccurring) {
            await handleReoccurring(raffleId);
        }
        return;
    }
    try {
        await db.runTransaction(async (transaction) => {
            // 1. Select a winner using cryptographically secure randomness
            const randomBytes = crypto.randomBytes(4);
            const randomNumber = randomBytes.readUInt32BE(0);
            const winningTicketNumber = (randomNumber % totalTickets) + 1;
            // 2. Find the winning ticket/order
            const ticketQuery = await db
                .collection("raffles")
                .doc(raffleId)
                .collection("tickets")
                .where("ticketNumber", "==", winningTicketNumber)
                .limit(1)
                .get();
            if (ticketQuery.empty) {
                throw new Error(`Winning ticket #${winningTicketNumber} not found`);
            }
            const winningTicketDoc = ticketQuery.docs[0];
            const winningTicketData = winningTicketDoc.data();
            // 3. Record the draw result
            transaction.update(raffleDoc.ref, {
                drawStatus: "completed",
                winningTicketNumber,
                winnerEmail: winningTicketData.email,
                winnerOrderId: winningTicketData.orderId,
                drawnAt: admin.firestore.FieldValue.serverTimestamp(),
                drawAudit: {
                    seed: randomBytes.toString("hex"),
                    totalTickets,
                },
            });
            // 4. Send winner email
            await sendWinnerEmail(winningTicketData.email, raffleData.title, winningTicketNumber, totalTickets);
        });
        // 5. Handle Reoccurring Raffle
        if (raffleData.isReoccurring) {
            await handleReoccurring(raffleId);
        }
    }
    catch (error) {
        console.error(`Draw failed for raffle ${raffleId}:`, error);
    }
}
/**
 * Handles the reoccurring logic by creating a new raffle entry in Contentful.
 * This uses the Contentful Management API to duplicate the existing raffle
 * with updated dates.
 */
async function handleReoccurring(slug) {
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";
    if (!managementToken || !spaceId) {
        console.error("Contentful management credentials missing. Cannot reoccur raffle.");
        return;
    }
    try {
        const client = (0, contentful_management_1.createClient)({ accessToken: managementToken });
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);
        // 1. Find the existing entry in Contentful by slug
        const entries = await environment.getEntries({
            content_type: "raffle",
            "fields.slug.en-US": slug,
            limit: 1,
        });
        const originalEntry = entries.items[0];
        if (!originalEntry) {
            console.error(`Original raffle with slug ${slug} not found in Contentful.`);
            return;
        }
        // 2. Calculate new dates (e.g., same duration as original)
        const originalStart = new Date(originalEntry.fields.startAt["en-US"]);
        const originalEnd = new Date(originalEntry.fields.endAt["en-US"]);
        const durationMs = originalEnd.getTime() - originalStart.getTime();
        const newStart = new Date(); // Starts now
        const newEnd = new Date(newStart.getTime() + durationMs);
        // 3. Create the new entry (we can't easily "duplicate" via API, so we create new)
        // We keep most fields but update status and dates.
        const newFields = { ...originalEntry.fields };
        newFields.status["en-US"] = "live";
        newFields.startAt["en-US"] = newStart.toISOString();
        newFields.endAt["en-US"] = newEnd.toISOString();
        // Note: We might want to append a version or date to the title/slug if they must be unique,
        // but usually for reoccurring raffles, the old one is moved to 'ended' status.
        // Contentful unique validation on slug might trigger if we don't change it.
        // However, the original raffle's status is likely still 'live' in Contentful until manually changed,
        // or we can update it here.
        // Update original to 'ended'
        originalEntry.fields.status["en-US"] = "ended";
        await originalEntry.update();
        await originalEntry.publish();
        // Create new entry
        // To avoid slug collision, we might need a suffix, but let's assume the user manages slugs
        // or we append a timestamp.
        const timestamp = Math.floor(Date.now() / 1000);
        newFields.slug["en-US"] = `${slug}-${timestamp}`;
        newFields.title["en-US"] = `${newFields.title["en-US"]} (Round ${timestamp})`;
        const newEntry = await environment.createEntry("raffle", {
            fields: newFields,
        });
        await newEntry.publish();
        console.log(`Successfully reoccurred raffle ${slug} as ${newFields.slug["en-US"]}`);
    }
    catch (error) {
        console.error(`Error in handleReoccurring for ${slug}:`, error);
    }
}
async function sendWinnerEmail(email, raffleTitle, ticketNumber, totalTickets) {
    const serverToken = process.env.POSTMARK_SERVER_TOKEN;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || "noreply@coastcompetitions.co.uk";
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@coastcompetitions.co.uk";
    if (!serverToken) {
        console.warn("Postmark not configured in functions. Skipping winner email.");
        return;
    }
    const client = new postmark.ServerClient(serverToken);
    try {
        // 1. Send to Winner
        await client.sendEmail({
            From: fromEmail,
            To: email,
            Subject: `CONGRATULATIONS! You won the ${raffleTitle}!`,
            TextBody: `You are the winner of the "${raffleTitle}" raffle! Your winning ticket was #${ticketNumber}. We will contact you shortly to arrange your prize.`,
            HtmlBody: `
        <h1>You Won!</h1>
        <p>Congratulations!</p>
        <p>You are the winner of the <strong>${raffleTitle}</strong> raffle!</p>
        <p><strong>Winning ticket:</strong> #${ticketNumber}</p>
        <p>We will contact you shortly to arrange your prize delivery or cash alternative.</p>
      `,
        });
        // 2. Send to Admin
        await client.sendEmail({
            From: fromEmail,
            To: adminEmail,
            Subject: `[ADMIN] Draw Complete: ${raffleTitle}`,
            TextBody: `The draw for "${raffleTitle}" is complete. Winner: ${email}. Winning Ticket: #${ticketNumber}. Total entries: ${totalTickets}.`,
            HtmlBody: `
        <h1>Draw Completed</h1>
        <p>The automated draw for <strong>${raffleTitle}</strong> has finished.</p>
        <p><strong>Winner:</strong> ${email}</p>
        <p><strong>Winning Ticket:</strong> #${ticketNumber}</p>
        <p><strong>Total Entries:</strong> ${totalTickets}</p>
        <p>The raffle document in Firestore has been updated with the audit trail.</p>
      `,
        });
    }
    catch (error) {
        console.error("Error sending draw completion emails:", error);
    }
}
//# sourceMappingURL=index.js.map