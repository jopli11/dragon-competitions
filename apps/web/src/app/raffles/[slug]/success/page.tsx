import Link from "next/link";
import { Container } from "@/components/Container";
import { AnimatedIn } from "@/components/AnimatedIn";
import { stripe } from "@/lib/stripe/client";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect(`/raffles/${slug}`);
  }

  // 1. Verify session with Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (err) {
    console.error("Error retrieving Stripe session:", err);
    redirect(`/raffles/${slug}`);
  }

  if (session.payment_status !== "paid") {
    return (
      <Container className="py-20 text-center">
        <AnimatedIn>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Payment Pending</h1>
          <p className="mt-3 text-sm text-foreground/70">
            Your payment is still being processed. Please check your email for confirmation once it completes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href={`/raffles/${slug}`} className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
              Return to competition
            </Link>
          </div>
        </AnimatedIn>
      </Container>
    );
  }

  // 2. Fetch order details from Firestore
  // We might need to wait a few seconds for the webhook to finish, so we'll show a "Processing" state if not found
  const orderDoc = await adminDb.collection("orders").doc(session_id).get();
  const orderData = orderDoc.data();

  if (!orderData) {
    // Check if this session was created more than 2 minutes ago (webhook likely failed)
    const sessionCreated = session.created ? session.created * 1000 : Date.now();
    const ageMs = Date.now() - sessionCreated;
    const isStale = ageMs > 2 * 60 * 1000;

    return (
      <Container className="py-20 text-center">
        <AnimatedIn>
          {isStale ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">Processing Delayed</h1>
              <p className="mt-3 text-sm text-foreground/70 max-w-md mx-auto">
                Your payment was received but your ticket allocation is taking longer than expected. 
                Please check your email for a confirmation, or contact support if you don&apos;t receive one within 10 minutes.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  Check My Dashboard
                </Link>
                <Link href="/contact" className="text-sm font-medium text-foreground/50 hover:text-foreground underline">
                  Contact Support
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">Finalising Order...</h1>
              <p className="mt-3 text-sm text-foreground/70">
                We&apos;ve received your payment and are allocating your ticket numbers. This page will update automatically in a few seconds.
              </p>
              <meta httpEquiv="refresh" content="5" />
            </>
          )}
        </AnimatedIn>
      </Container>
    );
  }

  // 3. Handle oversold/refunded case
  if (orderData.status === "refunded_oversold" || orderData.status === "refunded_pass_reuse" || orderData.status === "refunded") {
    return (
      <Container className="py-20 text-center">
        <AnimatedIn>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Competition Sold Out</h1>
          <p className="mt-3 text-sm text-foreground/70 max-w-md mx-auto">
            I'm sorry, but this competition sold out just as you were checking out. We have automatically issued a full refund to your original payment method.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href="/raffles" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
              Browse other competitions
            </Link>
          </div>
        </AnimatedIn>
      </Container>
    );
  }

  const ticketCount = orderData.ticketRange.end - orderData.ticketRange.start + 1;

  return (
    <Container className="py-20 text-center">
      <AnimatedIn>
        <div className="max-w-lg mx-auto">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-10 w-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="mt-8 text-4xl font-black uppercase tracking-tight text-brand-midnight">
            You're In!
          </h1>
          <p className="mt-2 text-sm text-brand-midnight/50 font-medium">
            Payment confirmed. Good luck!
          </p>

          <div className="mt-10 rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-midnight/40">Your Tickets</p>
            <div className="mt-3 text-5xl font-black tracking-tighter text-brand-midnight">
              {orderData.ticketRange.start === orderData.ticketRange.end 
                ? `#${orderData.ticketRange.start}`
                : `#${orderData.ticketRange.start} — #${orderData.ticketRange.end}`}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-brand-secondary">{ticketCount}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-brand-midnight/30">{ticketCount === 1 ? 'Entry' : 'Entries'}</p>
              </div>
              <div className="h-8 w-px bg-brand-primary/10" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-brand-midnight/40 uppercase tracking-wider">Order</p>
                <p className="font-mono text-xs font-bold text-brand-midnight/60">{session_id.slice(-12)}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-brand-midnight/40 font-medium">
            A confirmation email with your ticket details is on its way.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/raffles"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full bg-linear-to-r from-brand-primary to-brand-secondary px-10 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-brand-primary/20 transition-all hover:scale-105"
            >
              Enter Another Competition
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border-2 border-brand-primary/10 bg-white px-10 text-sm font-black uppercase tracking-wider text-brand-midnight transition-all hover:border-brand-primary/30 hover:bg-brand-accent/20"
            >
              View My Dashboard
            </Link>
          </div>
        </div>
      </AnimatedIn>
    </Container>
  );
}
