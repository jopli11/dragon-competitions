import * as postmark from "postmark";
import { getRequiredEnv, getOptionalEnv } from "@/lib/env";

const serverToken = getOptionalEnv("POSTMARK_SERVER_TOKEN");
export const postmarkClient = serverToken ? new postmark.ServerClient(serverToken) : null;

export const FROM_EMAIL = getOptionalEnv("POSTMARK_FROM_EMAIL") || "noreply@dragoncompetitions.co.uk";

export async function sendPurchaseConfirmation({
  to,
  raffleTitle,
  ticketRange,
  orderId,
}: {
  to: string;
  raffleTitle: string;
  ticketRange: { start: number; end: number };
  orderId: string;
}) {
  if (!postmarkClient) {
    console.warn("Postmark not configured. Skipping email.");
    return;
  }

  const rangeStr =
    ticketRange.start === ticketRange.end
      ? `Ticket #${ticketRange.start}`
      : `Tickets #${ticketRange.start} - #${ticketRange.end}`;

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: to,
      Subject: `Confirmation: You're entered in ${raffleTitle}!`,
      TextBody: `Thank you for your purchase! You have been entered into the "${raffleTitle}" raffle. Your ticket numbers are: ${rangeStr}. Order ID: ${orderId}`,
      HtmlBody: `
        <h1>Entry Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p>You have been entered into the <strong>${raffleTitle}</strong> raffle.</p>
        <p><strong>Your ticket numbers:</strong> ${rangeStr}</p>
        <p>Order ID: ${orderId}</p>
        <p>Good luck!</p>
      `,
    });
  } catch (error) {
    console.error("Error sending purchase confirmation email:", error);
  }
}
