import * as postmark from "postmark";
import { getRequiredEnv, getOptionalEnv } from "@/lib/env";

const serverToken = getOptionalEnv("POSTMARK_SERVER_TOKEN");
export const postmarkClient = serverToken ? new postmark.ServerClient(serverToken) : null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
      TextBody: `Thank you for your purchase! You have been entered into the "${raffleTitle}" competition. Your ticket numbers are: ${rangeStr}. Order ID: ${orderId}`,
      HtmlBody: `
        <h1>Entry Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p>You have been entered into the <strong>${escapeHtml(raffleTitle)}</strong> competition.</p>
        <p><strong>Your ticket numbers:</strong> ${rangeStr}</p>
        <p>Order ID: ${escapeHtml(orderId)}</p>
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
        <p>A new purchase has been made for <strong>${escapeHtml(raffleTitle)}</strong>.</p>
        <p><strong>Customer:</strong> ${escapeHtml(to)}</p>
        <p><strong>Tickets:</strong> ${rangeStr}</p>
        <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending purchase emails:", error);
  }
}

export async function sendRefundConfirmation({
  to,
  raffleTitle,
  ticketRange,
  orderId,
  amountPence,
  currency = "GBP",
}: {
  to: string;
  raffleTitle: string;
  ticketRange?: { start: number; end: number } | null;
  orderId: string;
  amountPence: number;
  currency?: string;
}) {
  if (!postmarkClient) {
    console.warn("Postmark not configured. Skipping refund email.");
    return;
  }

  const amountStr = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amountPence / 100);

  const rangeStr = ticketRange
    ? ticketRange.start === ticketRange.end
      ? `Ticket #${ticketRange.start}`
      : `Tickets #${ticketRange.start} - #${ticketRange.end}`
    : "your tickets";

  try {
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: to,
      Subject: `Refund Confirmation - ${raffleTitle}`,
      TextBody: `Your order for "${raffleTitle}" (${rangeStr}) has been refunded for ${amountStr}. Funds typically appear in your account within 3-10 business days. Order ID: ${orderId}`,
      HtmlBody: `
        <h1>Refund Confirmed</h1>
        <p>Your order for <strong>${escapeHtml(raffleTitle)}</strong> has been refunded.</p>
        <p><strong>Refunded:</strong> ${amountStr}</p>
        <p><strong>Tickets:</strong> ${rangeStr}</p>
        <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
        <p>Funds typically appear back in your account within 3-10 business days, depending on your bank.</p>
        <p>If you have any questions, please reply to this email.</p>
      `,
    });

    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: ADMIN_EMAIL,
      Subject: `[ADMIN] Refund Processed: ${raffleTitle}`,
      TextBody: `Refund processed for "${raffleTitle}". Customer: ${to}. Amount: ${amountStr}. Tickets: ${rangeStr}. Order ID: ${orderId}`,
      HtmlBody: `
        <h1>Refund Processed</h1>
        <p>A refund has been issued for <strong>${escapeHtml(raffleTitle)}</strong>.</p>
        <p><strong>Customer:</strong> ${escapeHtml(to)}</p>
        <p><strong>Amount:</strong> ${amountStr}</p>
        <p><strong>Tickets voided:</strong> ${rangeStr}</p>
        <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending refund emails:", error);
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
        <p>The automated draw for <strong>${escapeHtml(raffleTitle)}</strong> has finished.</p>
        <p><strong>Winner:</strong> ${escapeHtml(winnerEmail)}</p>
        <p><strong>Winning Ticket:</strong> #${winningTicket}</p>
        <p><strong>Total Entries:</strong> ${totalTickets}</p>
        <p>The competition record has been updated with the audit trail.</p>
      `,
    });
  } catch (error) {
    console.error("Error sending admin draw notification:", error);
  }
}

export async function sendContactFormEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!postmarkClient) {
    console.warn("Postmark not configured. Skipping contact form email.");
    return;
  }

  try {
    // 1. Send to Admin
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: ADMIN_EMAIL,
      ReplyTo: email,
      Subject: `[CONTACT FORM] ${subject}`,
      TextBody: `New message from ${name} (${email}):\n\n${message}`,
      HtmlBody: `
        <h1>New Contact Form Message</h1>
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      `,
    });

    // 2. Send Confirmation to User
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: `We've received your message - Coast Competitions`,
      TextBody: `Hi ${name},\n\nThanks for reaching out! We've received your message regarding "${subject}" and our team will get back to you as soon as possible.\n\nBest regards,\nThe Coast Competitions Team`,
      HtmlBody: `
        <h1>Message Received</h1>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out! We've received your message regarding "<strong>${escapeHtml(subject)}</strong>" and our team will get back to you as soon as possible.</p>
        <p>Best regards,<br>The Coast Competitions Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending contact form emails:", error);
    throw error;
  }
}
