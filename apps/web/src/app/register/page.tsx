"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!auth) return;
    
    setLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError("Google sign-up failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center py-20">
      <Container className="max-w-md">
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
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all"
              />
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
              <Link href="/login" className="text-brand-secondary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
