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
      await sendWinnerEmail(winningTicketData.email, raffleData.title, winningTicketNumber);
    });
  } catch (error) {
    console.error(`Draw failed for raffle ${raffleId}:`, error);
  }
}

async function sendWinnerEmail(email: string, raffleTitle: string, ticketNumber: number) {
  const serverToken = process.env.POSTMARK_SERVER_TOKEN;
  const fromEmail = process.env.POSTMARK_FROM_EMAIL || "noreply@dragoncompetitions.co.uk";

  if (!serverToken) {
    console.warn("Postmark not configured in functions. Skipping winner email.");
    return;
  }

  const client = new postmark.ServerClient(serverToken);

  try {
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
  } catch (error) {
    console.error("Error sending winner email:", error);
  }
}
