"use server";

import { sendPartnerEnquiry } from "@/lib/postmark/client";

type PartnerEnquiryResult = { success: true } | { error: string };

export async function submitPartnerEnquiry(
  formData: FormData,
): Promise<PartnerEnquiryResult> {
  const businessName = (formData.get("businessName") as string | null)?.trim();
  const contactName = (formData.get("contactName") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim() || undefined;
  const websiteOrSocial =
    (formData.get("websiteOrSocial") as string | null)?.trim() || undefined;
  const campaignType = (formData.get("campaignType") as string | null)?.trim();
  const prizeDescription = (formData.get("prizeDescription") as string | null)?.trim();
  const prizeValueGbpRaw = (formData.get("prizeValueGbp") as string | null)?.trim();
  const message = (formData.get("message") as string | null)?.trim();

  if (
    !businessName ||
    !contactName ||
    !email ||
    !campaignType ||
    !prizeDescription ||
    !message
  ) {
    return { error: "Please fill in all required fields." };
  }

  // Light email shape check — Postmark/SES will hard-reject anything truly broken.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  let prizeValueGbp: number | undefined;
  if (prizeValueGbpRaw) {
    const parsed = Number(prizeValueGbpRaw);
    if (Number.isFinite(parsed) && parsed >= 0) {
      prizeValueGbp = parsed;
    }
  }

  try {
    await sendPartnerEnquiry({
      businessName,
      contactName,
      email,
      phone,
      websiteOrSocial,
      campaignType,
      prizeDescription,
      prizeValueGbp,
      message,
    });
    return { success: true };
  } catch (error) {
    console.error("Partner enquiry submission error:", error);
    return {
      error: "Failed to send your enquiry. Please try again later.",
    };
  }
}
