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
const BUSINESS_NOTIFICATION_EMAIL = "coastcompetitionsuk@gmail.com";
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
    process.env.POSTMARK_SERVER_TOKEN = postmarkToken.value();
    process.env.CONTENTFUL_MANAGEMENT_TOKEN = contentfulToken.value();
    const now = admin.firestore.Timestamp.now();
    // Fetch all raffles that are pending a draw
    const rafflesToDraw = await db
        .collection("raffles")
        .where("drawStatus", "==", "pending")
        .get();
    if (rafflesToDraw.empty) {
        return null;
    }
    for (const raffleDoc of rafflesToDraw.docs) {
        const data = raffleDoc.data();
        // 1. Check if it should be drawn
        const isExpired = data.endAt && data.endAt.toDate() <= now.toDate();
        const isSoldOut = data.ticketsSold >= (data.maxTickets || 0) && (data.maxTickets || 0) > 0;
        if (!isExpired && !isSoldOut) {
            continue; // Not ready for draw yet
        }
        // Defensive guard: a ticket purchase merge can flip drawStatus back to
        // "pending" on a raffle that was ALREADY drawn, which caused this function
        // to re-draw a brand-new winner (and email them) every time someone bought.
        // A raffle that already has a winner must never be auto-drawn again — only
        // reoccurring raffles get a fresh round, and those run as a new doc/slug.
        if (data.drawnAt || data.winningTicketNumber) {
            console.warn(`Raffle ${raffleDoc.id} already drawn (ticket #${data.winningTicketNumber}) but drawStatus="${data.drawStatus}". ` +
                `Restoring to "completed" and skipping re-draw.`);
            await raffleDoc.ref.update({ drawStatus: "completed" });
            continue;
        }
        // 2. If drawType is 'live', don't auto-draw — but sync sold-out status to Contentful
        if (data.drawType === "live") {
            if (isSoldOut && !data.contentfulArchived) {
                console.log(`Live-draw raffle ${raffleDoc.id} is sold out — syncing awaitingDraw to Contentful`);
                await markAwaitingDrawInContentful(raffleDoc.id);
                await raffleDoc.ref.update({ contentfulArchived: true });
            }
            continue;
        }
        console.log(`Triggering draw for ${raffleDoc.id} (Reason: ${isSoldOut ? 'Sold Out' : 'Expired'})`);
        await performDraw(raffleDoc);
    }
    return null;
});
/**
 * Resolves a winner's contact details from their order. Walks
 * orders/{orderId} → users/{uid}. Backwards-compat: legacy orders without a
 * uid, or users without a completed profile, fall through to email_only.
 *
 * Kept inline here (rather than imported from apps/web) because the functions
 * codebase is built and deployed independently.
 */
async function getWinnerContact(orderId, fallbackEmail) {
    const emailOnly = {
        email: fallbackEmail,
        uid: null,
        firstName: null,
        lastName: null,
        mobile: null,
        source: "email_only",
    };
    if (!orderId)
        return emailOnly;
    const orderSnap = await db.collection("orders").doc(orderId).get();
    if (!orderSnap.exists)
        return emailOnly;
    const orderData = orderSnap.data() || {};
    const uid = orderData.uid;
    const email = orderData.email || fallbackEmail;
    if (!uid)
        return { ...emailOnly, email };
    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists)
        return { ...emailOnly, email, uid };
    const userData = userSnap.data() || {};
    if (!userData.profileCompletedAt)
        return { ...emailOnly, email, uid };
    return {
        email,
        uid,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        mobile: userData.mobile || null,
        source: "users_doc",
    };
}
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
        const drawResult = await db.runTransaction(async (transaction) => {
            let winningTicketNumber;
            let winningTicketData = null;
            let attempts = 0;
            const maxAttempts = 10;
            while (attempts < maxAttempts) {
                attempts++;
                const randomBytes = crypto.randomBytes(4);
                const randomNumber = randomBytes.readUInt32BE(0);
                winningTicketNumber = (randomNumber % totalTickets) + 1;
                const ticketRef = db
                    .collection("raffles")
                    .doc(raffleId)
                    .collection("tickets")
                    .doc(winningTicketNumber.toString());
                const ticketDoc = await transaction.get(ticketRef);
                if (ticketDoc.exists) {
                    const data = ticketDoc.data();
                    if (data?.status === "voided") {
                        console.log(`Ticket #${winningTicketNumber} is voided, re-drawing...`);
                        continue;
                    }
                    winningTicketData = {
                        email: data?.email,
                        orderId: data?.orderId,
                    };
                }
                else {
                    const orderQuery = await db
                        .collection("orders")
                        .where("raffleSlug", "==", raffleId)
                        .get();
                    const winningOrderDoc = orderQuery.docs.find(doc => {
                        const range = doc.data().ticketRange;
                        return range && range.start <= winningTicketNumber && range.end >= winningTicketNumber;
                    });
                    if (winningOrderDoc) {
                        const orderData = winningOrderDoc.data();
                        if (orderData.status === "refunded" || orderData.status === "refunded_oversold" || orderData.status === "refunded_pass_reuse") {
                            console.log(`Order ${winningOrderDoc.id} for ticket #${winningTicketNumber} is refunded, re-drawing...`);
                            continue;
                        }
                        winningTicketData = {
                            email: orderData.email,
                            orderId: winningOrderDoc.id,
                        };
                    }
                }
                if (winningTicketData) {
                    transaction.update(raffleDoc.ref, {
                        drawStatus: "completed",
                        winningTicketNumber,
                        winnerEmail: winningTicketData.email,
                        winnerOrderId: winningTicketData.orderId,
                        drawnAt: admin.firestore.FieldValue.serverTimestamp(),
                        drawAudit: {
                            seed: randomBytes.toString("hex"),
                            totalTickets,
                            attempts,
                        },
                    });
                    const raffleTitle = raffleData.title || raffleId;
                    return {
                        email: winningTicketData.email,
                        orderId: winningTicketData.orderId,
                        title: raffleTitle,
                        ticket: winningTicketNumber,
                    };
                }
            }
            throw new Error(`Failed to find a valid winner after ${maxAttempts} attempts`);
        });
        console.log(`Draw complete for ${raffleId}. Winner: ${drawResult.email}, Ticket: #${drawResult.ticket}`);
        // Resolve contact details (first/last/mobile) from users/{uid}. Persist
        // them to the admin-only draw_audit doc — the public raffles doc only
        // gets the non-PII profileSource flag. Done outside the transaction
        // because firestore transactions can't safely perform out-of-band reads.
        let contact = {
            email: drawResult.email,
            uid: null,
            firstName: null,
            lastName: null,
            mobile: null,
            source: "email_only",
        };
        try {
            contact = await getWinnerContact(drawResult.orderId, drawResult.email);
            await Promise.all([
                raffleDoc.ref.update({ winnerProfileSource: contact.source }),
                db.collection("draw_audit").doc(`${raffleId}_auto`).set({
                    raffleSlug: raffleId,
                    drawType: "auto",
                    winnerEmail: contact.email,
                    winnerFirstName: contact.firstName,
                    winnerLastName: contact.lastName,
                    winnerMobile: contact.mobile,
                    winnerProfileSource: contact.source,
                    winningTicketNumber: drawResult.ticket,
                    winnerOrderId: drawResult.orderId,
                    confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
                    totalTicketsSold: totalTickets,
                }),
            ]);
        }
        catch (enrichError) {
            // Non-fatal — the winner is already recorded; admin still has email.
            console.warn(`Failed to enrich winner profile for ${raffleId}:`, enrichError?.message || enrichError);
        }
        // Send emails (outside the transaction)
        console.log(`Sending winner notification email to ${drawResult.email}...`);
        try {
            await sendWinnerEmail(drawResult.email, drawResult.title, drawResult.ticket, totalTickets, contact);
            console.log(`Winner email sent successfully for ${raffleId}`);
        }
        catch (emailError) {
            console.error(`CRITICAL: Failed to send winner email for ${raffleId}:`, emailError.message, emailError.statusCode, JSON.stringify(emailError));
        }
        // Handle post-draw CMS sync
        if (raffleData.isReoccurring) {
            await handleReoccurring(raffleId);
        }
        else {
            const freshDoc = await raffleDoc.ref.get();
            const fresh = freshDoc.data();
            const maskedEmail = maskEmail(fresh?.winnerEmail || "");
            await archiveRaffleInContentful(raffleId, {
                winnerDisplayName: maskedEmail,
                winnerTicketNumber: fresh?.winningTicketNumber,
                drawDate: new Date().toISOString(),
            });
        }
    }
    catch (error) {
        console.error(`Draw failed for raffle ${raffleId}:`, error.message, error.stack);
    }
}
function maskEmail(email) {
    if (!email || !email.includes("@"))
        return "Anonymous";
    const [local, domain] = email.split("@");
    const visible = local.slice(0, 3);
    return `${visible}***@${domain}`;
}
function getContentfulClient() {
    const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const environmentId = process.env.CONTENTFUL_ENVIRONMENT || "master";
    if (!managementToken || !spaceId) {
        return null;
    }
    return { managementToken, spaceId, environmentId };
}
async function getContentfulEntry(slug) {
    const config = getContentfulClient();
    if (!config) {
        console.error("Contentful management credentials missing.");
        return null;
    }
    const client = (0, contentful_management_1.createClient)({ accessToken: config.managementToken });
    const space = await client.getSpace(config.spaceId);
    const environment = await space.getEnvironment(config.environmentId);
    const entries = await environment.getEntries({
        content_type: "raffle",
        "fields.slug.en-US": slug,
        limit: 1,
    });
    return entries.items[0] || null;
}
/**
 * Sets a raffle's Contentful status to "awaitingDraw" when a live-draw
 * raffle sells out. The admin will manually draw and update to "ended".
 */
async function markAwaitingDrawInContentful(slug) {
    try {
        const entry = await getContentfulEntry(slug);
        if (!entry) {
            console.error(`Raffle ${slug} not found in Contentful for awaitingDraw sync.`);
            return;
        }
        entry.fields.status["en-US"] = "awaitingDraw";
        const updated = await entry.update();
        await updated.publish();
        console.log(`Contentful: ${slug} status set to awaitingDraw`);
    }
    catch (error) {
        console.error(`Error setting awaitingDraw for ${slug}:`, error);
    }
}
/**
 * Archives a raffle in Contentful by setting status to "ended" and
 * optionally populating winner display fields (for auto draws).
 */
async function archiveRaffleInContentful(slug, winnerData) {
    try {
        const entry = await getContentfulEntry(slug);
        if (!entry) {
            console.error(`Raffle ${slug} not found in Contentful for archival.`);
            return;
        }
        entry.fields.status["en-US"] = "ended";
        if (winnerData) {
            entry.fields.winnerDisplayName = { "en-US": winnerData.winnerDisplayName };
            entry.fields.winnerTicketNumber = { "en-US": winnerData.winnerTicketNumber };
            entry.fields.drawDate = { "en-US": winnerData.drawDate };
        }
        const updated = await entry.update();
        await updated.publish();
        console.log(`Contentful: ${slug} archived as ended${winnerData ? " with winner data" : ""}`);
    }
    catch (error) {
        console.error(`Error archiving raffle ${slug} in Contentful:`, error);
    }
}
/**
 * Handles the reoccurring logic by creating a new raffle entry in Contentful.
 * This uses the Contentful Management API to duplicate the existing raffle
 * with updated dates.
 */
async function handleReoccurring(slug) {
    const config = getContentfulClient();
    if (!config) {
        console.error("Contentful management credentials missing. Cannot reoccur raffle.");
        return;
    }
    try {
        const client = (0, contentful_management_1.createClient)({ accessToken: config.managementToken });
        const space = await client.getSpace(config.spaceId);
        const environment = await space.getEnvironment(config.environmentId);
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
        const originalStart = new Date(originalEntry.fields.startAt["en-US"]);
        const originalEnd = new Date(originalEntry.fields.endAt["en-US"]);
        const durationMs = originalEnd.getTime() - originalStart.getTime();
        const newStart = new Date();
        const newEnd = new Date(newStart.getTime() + durationMs);
        const newFields = { ...originalEntry.fields };
        newFields.status["en-US"] = "live";
        newFields.startAt["en-US"] = newStart.toISOString();
        newFields.endAt["en-US"] = newEnd.toISOString();
        // Clear winner fields for the new round
        delete newFields.winnerDisplayName;
        delete newFields.winnerTicketNumber;
        delete newFields.drawDate;
        delete newFields.discountActive;
        delete newFields.discountPercent;
        delete newFields.discountLabel;
        delete newFields.freeEntryMaxPerUser;
        // Archive original as ended
        originalEntry.fields.status["en-US"] = "ended";
        await originalEntry.update();
        await originalEntry.publish();
        // Create new entry with unique slug
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
async function sendWinnerEmail(email, raffleTitle, ticketNumber, totalTickets, contact) {
    const serverToken = process.env.POSTMARK_SERVER_TOKEN;
    const fromEmail = process.env.POSTMARK_FROM_EMAIL || BUSINESS_NOTIFICATION_EMAIL;
    const adminEmails = Array.from(new Set([
        process.env.ADMIN_NOTIFICATION_EMAIL,
        BUSINESS_NOTIFICATION_EMAIL,
    ].filter((recipient) => Boolean(recipient))));
    console.log(`sendWinnerEmail called: to=${email}, raffle=${raffleTitle}, ticket=#${ticketNumber}, from=${fromEmail}, adminTo=${adminEmails.join(",")}, hasToken=${!!serverToken}, profileSource=${contact.source}`);
    if (!serverToken) {
        console.error("POSTMARK_SERVER_TOKEN is empty/undefined. Cannot send winner email.");
        throw new Error("Postmark not configured");
    }
    const client = new postmark.ServerClient(serverToken);
    // Send to Winner
    console.log(`Sending winner congratulations to ${email}...`);
    const winnerResult = await client.sendEmail({
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
    console.log(`Winner email sent: MessageID=${winnerResult.MessageID}, To=${winnerResult.To}`);
    // Send to Admin — include enriched contact details so they can call/text
    // the winner directly. When the profile is missing (legacy users), flag it
    // prominently so the admin knows to do email-only outreach.
    const winnerName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
    const contactHtml = contact.source === "users_doc"
        ? `
      <p><strong>Name:</strong> ${winnerName || "(profile incomplete)"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${contact.mobile || "(not provided)"}</p>
    `
        : `
      <p><strong>Email:</strong> ${email}</p>
      <p style="padding:8px 12px;background:#fff3cd;border:1px solid #ffeeba;border-radius:6px;color:#856404;">
        ⚠ This winner registered before we collected contact details. Reach out by email — no mobile on file.
      </p>
    `;
    const contactText = contact.source === "users_doc"
        ? `Name: ${winnerName || "(profile incomplete)"}\nEmail: ${email}\nMobile: ${contact.mobile || "(not provided)"}`
        : `Email: ${email}\n[WARN] Legacy account — no first/last/mobile on file. Email outreach only.`;
    console.log(`Sending admin notification to ${adminEmails.join(", ")}...`);
    const adminResult = await client.sendEmail({
        From: fromEmail,
        To: adminEmails.join(","),
        Subject: `[ADMIN] Draw Complete: ${raffleTitle}`,
        TextBody: `The draw for "${raffleTitle}" is complete.\n\nWinning Ticket: #${ticketNumber}\nTotal Entries: ${totalTickets}\n\n${contactText}`,
        HtmlBody: `
      <h1>Draw Completed</h1>
      <p>The automated draw for <strong>${raffleTitle}</strong> has finished.</p>
      <p><strong>Winning Ticket:</strong> #${ticketNumber}</p>
      <p><strong>Total Entries:</strong> ${totalTickets}</p>
      <h2 style="margin-top:24px;">Winner contact</h2>
      ${contactHtml}
      <p style="margin-top:24px;color:#666;font-size:12px;">The raffle document in Firestore has been updated with the audit trail.</p>
    `,
    });
    console.log(`Admin email sent: MessageID=${adminResult.MessageID}, To=${adminResult.To}`);
}
//# sourceMappingURL=index.js.map