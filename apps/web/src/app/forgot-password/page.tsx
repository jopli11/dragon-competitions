"use client";

import { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";
import { auth } from "@/lib/firebase/client";
import { track } from "@/lib/analytics";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    track("auth_forgot_password_view");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || submitting) return;

    setSubmitting(true);
    track("auth_forgot_password_submit");

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: unknown) {
      // Swallow `auth/user-not-found` and `auth/invalid-email`-style errors so
      // the response is identical whether the account exists or not — that
      // prevents account enumeration via this endpoint. Real failures (e.g.
      // network) are logged but the user still sees the same success message
      // to avoid surfacing the existence of an account in the error path.
      const code = (err as { code?: string })?.code;
      if (code && !code.startsWith("auth/")) {
        console.error("sendPasswordResetEmail failed:", err);
      }
    } finally {
      // Always fire the "sent" event — analytics never reflects whether the
      // account existed, for the same enumeration-protection reason.
      track("auth_forgot_password_sent");
      setSent(true);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center py-20">
      <Container className="max-w-md">
        <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-10">
            <BrandSectionHeading>
              Reset your <GradientText>Password</GradientText>
            </BrandSectionHeading>
            <p className="mt-2 text-brand-midnight/40 font-bold uppercase tracking-widest text-[10px]">
              We&apos;ll email you a secure link
            </p>
          </div>

          {sent ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-brand-secondary/20 bg-brand-secondary/5 p-6 text-center">
                <p className="text-sm font-bold text-brand-midnight">
                  If an account exists for that email, a password reset link is on
                  its way.
                </p>
                <p className="mt-2 text-xs text-brand-midnight/60 font-medium">
                  Check your inbox (and spam folder). The link expires in 1 hour.
                </p>
              </div>
              <Link
                href="/login"
                className="block text-center text-xs font-bold uppercase tracking-widest text-brand-secondary hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-brand-primary/5 bg-brand-accent/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">
                  Heads up
                </p>
                <p className="mt-2 text-xs text-brand-midnight/70 font-medium leading-relaxed">
                  Your username is the email you signed up with. Enter that email
                  below and we&apos;ll send you a link to set a new password.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all"
                />
              </div>

              <BrandButton
                type="submit"
                fullWidth
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send reset link"}
              </BrandButton>

              <p className="text-center text-xs font-bold text-brand-midnight/40 uppercase tracking-widest">
                Remembered it?{" "}
                <Link
                  href="/login"
                  className="text-brand-secondary hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
