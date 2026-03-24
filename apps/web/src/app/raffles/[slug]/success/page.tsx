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
              Return to raffle
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
    return (
      <Container className="py-20 text-center">
        <AnimatedIn>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Finalising Order...</h1>
          <p className="mt-3 text-sm text-foreground/70">
            We've received your payment and are allocating your ticket numbers. This page will update automatically in a few seconds.
          </p>
          <meta httpEquiv="refresh" content="5" />
        </AnimatedIn>
      </Container>
    );
  }

  // 3. Handle oversold/refunded case
  if (orderData.status === "refunded_oversold") {
    return (
      <Container className="py-20 text-center">
        <AnimatedIn>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Raffle Sold Out</h1>
          <p className="mt-3 text-sm text-foreground/70 max-w-md mx-auto">
            I'm sorry, but this raffle sold out just as you were checking out. We have automatically issued a full refund to your original payment method.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link href="/raffles" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
              Browse other raffles
            </Link>
          </div>
        </AnimatedIn>
      </Container>
    );
  }

  return (
    <Container className="py-20 text-center">
      <AnimatedIn>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Payment Successful!
        </h1>
        <div className="mt-6 p-6 bg-foreground/5 rounded-2xl max-w-sm mx-auto">
          <p className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Your Tickets</p>
          <div className="mt-2 text-4xl font-black tracking-tighter">
            {orderData.ticketRange.start === orderData.ticketRange.end 
              ? `#${orderData.ticketRange.start}`
              : `#${orderData.ticketRange.start} - #${orderData.ticketRange.end}`}
          </div>
          <p className="mt-4 text-sm text-foreground/60">
            Order ID: <span className="font-mono text-xs">{session_id.slice(-12)}</span>
          </p>
        </div>
        <p className="mt-6 text-sm text-foreground/70">
          You will receive a confirmation email shortly. Good luck!
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/raffles"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Browse more raffles
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-foreground/60 hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </AnimatedIn>
    </Container>
  );
}
