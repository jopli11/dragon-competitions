import * as postmark from "postmark";
import { getRequiredEnv, getOptionalEnv } from "@/lib/env";

const serverToken = getOptionalEnv("POSTMARK_SERVER_TOKEN");
export const postmarkClient = serverToken ? new postmark.ServerClient(serverToken) : null;

export const FROM_EMAIL = getOptionalEnv("POSTMARK_FROM_EMAIL") || "noreply@coastcompetitions.co.uk";
export const ADMIN_EMAIL = getOptionalEnv("ADMIN_NOTIFICATION_EMAIL") || "admin@coastcompetitions.co.uk";

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
    // 1. Send to Customer
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

    // 2. Send to Admin
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: ADMIN_EMAIL,
      Subject: `[ADMIN] New Order: ${raffleTitle}`,
      TextBody: `New order received for "${raffleTitle}". Customer: ${to}. Tickets: ${rangeStr}. Order ID: ${orderId}`,
      HtmlBody: `
        <h1>New Order Received</h1>
        <p>A new purchase has been made for <strong>${raffleTitle}</strong>.</p>
        <p><strong>Customer:</strong> ${to}</p>
        <p><strong>Tickets:</strong> ${rangeStr}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending purchase emails:", error);
  }
}

export async function sendAdminDrawNotification({
  raffleTitle,
  winnerEmail,
  winningTicket,
  totalTickets,
}: {
  raffleTitle: string;
  winnerEmail: string;
  winningTicket: number;
  totalTickets: number;
}) {
  if (!postmarkClient) return;

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: ADMIN_EMAIL,
      Subject: `[ADMIN] Draw Complete: ${raffleTitle}`,
      TextBody: `The draw for "${raffleTitle}" is complete. Winner: ${winnerEmail}. Winning Ticket: #${winningTicket}. Total entries: ${totalTickets}.`,
      HtmlBody: `
        <h1>Draw Completed</h1>
        <p>The automated draw for <strong>${raffleTitle}</strong> has finished.</p>
        <p><strong>Winner:</strong> ${winnerEmail}</p>
        <p><strong>Winning Ticket:</strong> #${winningTicket}</p>
        <p><strong>Total Entries:</strong> ${totalTickets}</p>
        <p>The raffle document has been updated with the audit trail.</p>
      `,
    });
  } catch (error) {
    console.error("Error sending admin draw notification:", error);
  }
}
