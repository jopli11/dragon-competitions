import * as postmark from "postmark";
import { getOptionalEnv } from "@/lib/env";
import { TRUSTPILOT_REVIEW_URL } from "@/lib/trustpilot";

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

export const FROM_EMAIL = getOptionalEnv("POSTMARK_FROM_EMAIL") || "coastcompetitionsuk@gmail.com";
export const ADMIN_EMAIL = getOptionalEnv("ADMIN_NOTIFICATION_EMAIL") || "coastcompetitionsuk@gmail.com";

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
      TextBody: `Thank you for your purchase! You have been entered into the "${raffleTitle}" competition. Your ticket numbers are: ${rangeStr}. Order ID: ${orderId}\n\nEnjoyed your checkout experience? We'd really appreciate a quick review on Trustpilot: ${TRUSTPILOT_REVIEW_URL}`,
      HtmlBody: `
        <h1>Entry Confirmation</h1>
        <p>Thank you for your purchase!</p>
        <p>You have been entered into the <strong>${escapeHtml(raffleTitle)}</strong> competition.</p>
        <p><strong>Your ticket numbers:</strong> ${rangeStr}</p>
        <p>Order ID: ${escapeHtml(orderId)}</p>
        <div style="margin: 24px 0; padding: 20px; border-radius: 12px; background: #f5fffd; border: 1px solid #d7f3ef;">
          <h2 style="margin: 0 0 8px; font-size: 18px;">How did we do?</h2>
          <p style="margin: 0 0 16px;">If checkout was smooth, we'd be grateful if you could leave Coast Competitions a quick review on Trustpilot.</p>
          <a href="${TRUSTPILOT_REVIEW_URL}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #35B1AB; color: #ffffff; font-weight: 700; text-decoration: none;">Leave a Trustpilot review</a>
        </div>
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

export async function sendPartnerEnquiry({
  businessName,
  contactName,
  email,
  phone,
  websiteOrSocial,
  campaignType,
  prizeDescription,
  prizeValueGbp,
  message,
}: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  websiteOrSocial?: string;
  campaignType: string;
  prizeDescription: string;
  prizeValueGbp?: number;
  message: string;
}) {
  if (!postmarkClient) {
    console.warn("Postmark not configured. Skipping partner enquiry email.");
    return;
  }

  const prizeValueLabel =
    typeof prizeValueGbp === "number" ? `£${prizeValueGbp.toLocaleString("en-GB")}` : "—";

  const adminTextLines = [
    `New B2B enquiry from ${businessName}`,
    ``,
    `Contact: ${contactName} <${email}>`,
    phone ? `Phone: ${phone}` : null,
    websiteOrSocial ? `Website / Social: ${websiteOrSocial}` : null,
    `Campaign type: ${campaignType}`,
    `Approx. prize value: ${prizeValueLabel}`,
    ``,
    `Prize / product:`,
    prizeDescription,
    ``,
    `Message:`,
    message,
  ].filter(Boolean);

  try {
    // 1. Admin notification — distinct subject so it stands out from regular support tickets.
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: ADMIN_EMAIL,
      ReplyTo: email,
      Subject: `[B2B ENQUIRY] ${businessName} – ${campaignType}`,
      TextBody: adminTextLines.join("\n"),
      HtmlBody: `
        <h1>New B2B Enquiry</h1>
        <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;"><strong>Business</strong></td><td>${escapeHtml(businessName)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><strong>Contact</strong></td><td>${escapeHtml(contactName)} &lt;${escapeHtml(email)}&gt;</td></tr>
          ${phone ? `<tr><td style="padding:4px 12px 4px 0;"><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>` : ""}
          ${websiteOrSocial ? `<tr><td style="padding:4px 12px 4px 0;"><strong>Website / Social</strong></td><td>${escapeHtml(websiteOrSocial)}</td></tr>` : ""}
          <tr><td style="padding:4px 12px 4px 0;"><strong>Campaign type</strong></td><td>${escapeHtml(campaignType)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><strong>Approx. value</strong></td><td>${escapeHtml(prizeValueLabel)}</td></tr>
        </table>
        <h2 style="margin-top:24px;">Prize / product</h2>
        <p style="white-space:pre-wrap;">${escapeHtml(prizeDescription)}</p>
        <h2 style="margin-top:24px;">Message</h2>
        <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
      `,
    });

    // 2. Confirmation to submitter.
    await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: `We've received your enquiry – Coast Competitions`,
      TextBody: `Hi ${contactName},\n\nThanks for getting in touch about a collaboration with Coast Competitions. We've received your enquiry for ${businessName} and we'll review it shortly. If it looks like a good fit, we'll come back to you with next steps.\n\nBest regards,\nThe Coast Competitions Team`,
      HtmlBody: `
        <h1>Enquiry Received</h1>
        <p>Hi ${escapeHtml(contactName)},</p>
        <p>Thanks for getting in touch about a collaboration with Coast Competitions. We&rsquo;ve received your enquiry for <strong>${escapeHtml(businessName)}</strong> and we&rsquo;ll review it shortly.</p>
        <p>If it looks like a good fit, we&rsquo;ll come back to you with next steps.</p>
        <p>Best regards,<br>The Coast Competitions Team</p>
      `,
    });
  } catch (error) {
    console.error("Error sending partner enquiry emails:", error);
    throw error;
  }
}
