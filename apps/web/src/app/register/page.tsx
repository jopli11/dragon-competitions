"use client";

import { useState, Suspense } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { saveUserProfile } from "@/app/profile/actions";
import {
  buildDisplayName,
  validateProfileInput,
} from "@/lib/firebase/user-profile";

type FieldKey = "firstName" | "lastName" | "mobile";

function RegisterContent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<FieldKey | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/";
  // Security: Ensure redirect is a relative path starting with / and not //
  const redirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setErrorField(null);
      return;
    }

    if (!agreedToTerms || !confirmAge) {
      setError("You must agree to the terms and confirm you are 18+.");
      setErrorField(null);
      return;
    }

    // Validate the profile fields up-front so we don't create an orphan auth
    // account if e.g. the mobile number is malformed.
    const validationError = validateProfileInput({ firstName, lastName, mobile });
    if (validationError) {
      setError(validationError.message);
      setErrorField(validationError.field);
      return;
    }

    setLoading(true);
    setError("");
    setErrorField(null);
    track("auth_register_email_submit");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();

      const saveResult = await saveUserProfile(idToken, {
        firstName,
        lastName,
        mobile,
      });

      if (!saveResult.success) {
        // Auth account exists but profile didn't save — send the user to the
        // dedicated profile page to retry rather than leaving them stranded.
        track("auth_register_failure");
        console.warn("Profile save failed during register:", saveResult.error);
        router.push(
          `/profile/complete?redirect=${encodeURIComponent(redirect)}`
        );
        router.refresh();
        return;
      }

      // Mirror displayName into the client Firebase Auth user so the dashboard
      // greeting and any other `user.displayName` reads update immediately
      // (the server action also mirrors via Admin SDK, but the client cache
      // wouldn't otherwise refresh until the next token rotation).
      try {
        await updateProfile(cred.user, {
          displayName: buildDisplayName(firstName, lastName),
        });
      } catch (mirrorErr) {
        console.warn("Failed to mirror displayName on client:", mirrorErr);
      }

      track("auth_register_success");
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      track("auth_register_failure");
      const message =
        err instanceof Error ? err.message : "Failed to create account.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!auth) return;

    setLoading(true);
    setError("");
    setErrorField(null);
    track("auth_register_google_submit");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additional = getAdditionalUserInfo(result);
      track("auth_register_success");

      if (additional?.isNewUser) {
        // First-time Google sign-up — Google gives us a displayName and email
        // but no mobile. Route through profile completion (which pre-fills the
        // split displayName) before returning to the original destination.
        router.push(
          `/profile/complete?redirect=${encodeURIComponent(redirect)}`
        );
      } else {
        // Returning Google user who happened to click the register button —
        // treat as a normal login.
        router.push(redirect);
      }
      router.refresh();
    } catch (err: unknown) {
      track("auth_register_failure");
      setError("Google sign-up failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: FieldKey | null) =>
    `w-full bg-brand-accent/30 border rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
      field && errorField === field
        ? "border-red-400 focus:ring-red-400/20"
        : "border-brand-primary/5 focus:ring-brand-secondary/20"
    }`;

  return (
    <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12">
      <div className="text-center mb-10">
        <BrandSectionHeading>Join the <GradientText>Coast</GradientText></BrandSectionHeading>
        <p className="mt-2 text-brand-midnight/40 font-bold uppercase tracking-widest text-[10px]">
          Create your account to start winning
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-brand-primary/10 rounded-2xl py-4 px-6 text-brand-midnight font-bold text-sm shadow-sm transition-all hover:bg-brand-accent/20 hover:border-brand-primary/20 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-7.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-brand-primary/5"></div>
          <span className="shrink mx-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/20">
            Or email
          </span>
          <div className="grow border-t border-brand-primary/5"></div>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
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
              className={inputClass("firstName")}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
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
              className={inputClass("lastName")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="mobile" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
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
            className={inputClass("mobile")}
          />
          <p className="text-[10px] text-brand-midnight/40 ml-4">
            We&apos;ll only use this to reach winners — never for marketing.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
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
            className={inputClass(null)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
            Password
          </label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={inputClass(null)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={inputClass(null)}
          />
        </div>

        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmAge}
              onChange={(e) => setConfirmAge(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-brand-primary/10 text-brand-secondary focus:ring-brand-secondary/20"
              required
            />
            <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest leading-tight group-hover:text-brand-midnight/60 transition-colors">
              I confirm I am 18 years of age or older
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-brand-primary/10 text-brand-secondary focus:ring-brand-secondary/20"
              required
            />
            <span className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-widest leading-tight group-hover:text-brand-midnight/60 transition-colors">
              I have read and agree to the{" "}
              <Link href="/terms" className="text-brand-secondary underline">
                Terms and Conditions
              </Link>
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold text-center">{error}</p>
        )}

        <BrandButton type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </BrandButton>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-xs font-bold text-brand-midnight/40 uppercase tracking-widest">
          Already have an account?{" "}
          <Link href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-brand-secondary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center py-20">
      <Container className="max-w-md">
        <Suspense fallback={
          <div className="bg-white rounded-[2.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-12 animate-pulse">
            <div className="h-8 w-48 bg-brand-accent mx-auto rounded-lg mb-10" />
            <div className="space-y-6">
              <div className="h-12 w-full bg-brand-accent rounded-2xl" />
              <div className="h-12 w-full bg-brand-accent rounded-2xl" />
              <div className="h-12 w-full bg-brand-accent rounded-2xl" />
            </div>
          </div>
        }>
          <RegisterContent />
        </Suspense>
      </Container>
    </div>
  );
}
