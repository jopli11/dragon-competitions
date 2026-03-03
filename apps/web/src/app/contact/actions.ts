"use server";

import { sendContactFormEmail } from "@/lib/postmark/client";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "Please fill in all fields." };
  }

  try {
    await sendContactFormEmail({ name, email, subject, message });
    return { success: true };
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
