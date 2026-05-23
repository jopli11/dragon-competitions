"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";
import { useAuth } from "@/lib/auth-context";
import { track } from "@/lib/analytics";
import { saveUserProfile } from "@/app/profile/actions";
import {
  getUserProfile,
  splitDisplayName,
} from "@/lib/firebase/user-profile";

type FieldKey = "firstName" | "lastName" | "mobile";

function ProfileCompleteContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/dashboard";
  const redirect =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/dashboard";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<FieldKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent("/profile/complete")}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const existing = await getUserProfile(user.uid);
      if (cancelled) return;
      if (existing) {
        setFirstName(existing.firstName);
        setLastName(existing.lastName);
        setMobile(existing.mobile);
      } else {
        const split = splitDisplayName(user.displayName);
        setFirstName(split.firstName);
        setLastName(split.lastName);
      }
      setHydrated(true);
      track("profile_complete_view");
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setErrorField(null);
    track("profile_complete_submit");

    try {
      const idToken = await user.getIdToken();
      const result = await saveUserProfile(idToken, {
        firstName,
        lastName,
        mobile,
      });

      if (!result.success) {
        track("profile_complete_failure");
        setError(result.error);
        setErrorField(result.field ?? null);
        return;
      }

      track("profile_complete_success");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      track("profile_complete_failure");
      console.error("Profile save error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12 animate-pulse">
        <div className="h-8 w-48 bg-brand-accent mx-auto rounded-lg mb-10" />
        <div className="space-y-6">
          <div className="h-12 w-full bg-brand-accent rounded-2xl" />
          <div className="h-12 w-full bg-brand-accent rounded-2xl" />
          <div className="h-12 w-full bg-brand-accent rounded-2xl" />
        </div>
      </div>
    );
  }

  const inputClass = (field: FieldKey) =>
    `w-full bg-brand-accent/30 border rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
      errorField === field
        ? "border-red-400 focus:ring-red-400/20"
        : "border-brand-primary/5 focus:ring-brand-secondary/20"
    }`;

  return (
    <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12">
      <div className="text-center mb-10">
        <BrandSectionHeading>
          Complete your <GradientText>Profile</GradientText>
        </BrandSectionHeading>
        <p className="mt-2 text-brand-midnight/40 font-bold uppercase tracking-widest text-[10px]">
          So we can contact you if you win
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              required
              disabled={!hydrated || saving}
              className={inputClass("firstName")}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              disabled={!hydrated || saving}
              className={inputClass("lastName")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="mobile"
            className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4"
          >
            UK Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            autoComplete="tel"
            inputMode="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="07700 900000"
            required
            disabled={!hydrated || saving}
            className={inputClass("mobile")}
          />
          <p className="text-[10px] text-brand-midnight/40 ml-4">
            We&apos;ll only use this to reach winners — never for marketing.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold text-center">{error}</p>
        )}

        <BrandButton type="submit" fullWidth size="lg" disabled={!hydrated || saving}>
          {saving ? "Saving..." : "Save & Continue"}
        </BrandButton>
      </form>
    </div>
  );
}

export default function ProfileCompletePage() {
  return (
    <div className="min-h-[80vh] flex items-center py-20">
      <Container className="max-w-md">
        <Suspense
          fallback={
            <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12 animate-pulse">
              <div className="h-8 w-48 bg-brand-accent mx-auto rounded-lg mb-10" />
              <div className="space-y-6">
                <div className="h-12 w-full bg-brand-accent rounded-2xl" />
                <div className="h-12 w-full bg-brand-accent rounded-2xl" />
                <div className="h-12 w-full bg-brand-accent rounded-2xl" />
              </div>
            </div>
          }
        >
          <ProfileCompleteContent />
        </Suspense>
      </Container>
    </div>
  );
}
