import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as postmark from "postmark";
import * as crypto from "node:crypto";

admin.initializeApp();

const db = admin.firestore();

/**
 * Scheduled function to run every minute and check for ended raffles
 * that need a draw.
 */
export const scheduledDraw = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();

    // 1. Find raffles that have ended but haven't been drawn yet
    // Note: In a real app, you might want to query Contentful for end dates
    // or keep a mirrored 'endAt' in Firestore for easier querying.
    // For this implementation, we assume 'raffles' collection has 'endAt'.
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

async function performDraw(raffleDoc: admin.firestore.QueryDocumentSnapshot) {
  const raffleId = raffleDoc.id;
  const raffleData = raffleDoc.data();
  const totalTickets = raffleData.ticketsSold || 0;

  if (totalTickets === 0) {
    await raffleDoc.ref.update({
      drawStatus: "completed",
      drawResult: "no_tickets_sold",
    });
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
  } catch (error) {
    console.error(`Draw failed for raffle ${raffleId}:`, error);
  }
}

async function sendWinnerEmail(email: string, raffleTitle: string, ticketNumber: number, totalTickets: number) {
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
  } catch (error) {
    console.error("Error sending draw completion emails:", error);
  }
}
