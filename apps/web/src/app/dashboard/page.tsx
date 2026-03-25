"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { useAuth } from "@/lib/auth-context";
import { BrandSectionHeading, GradientText, GlassCard } from "@/lib/styles";
import { getUserOrders, getUserWins, type UserOrder } from "@/lib/firebase/user-stats";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatGBPFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [wins, setWins] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<"entries" | "wins">("entries");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      if (user?.email) {
        setFetching(true);
        const [userOrders, userWins] = await Promise.all([
          getUserOrders(user.email),
          getUserWins(user.email)
        ]);
        setOrders(userOrders);
        setWins(userWins);
        setFetching(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading || fetching) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-brand-accent mx-auto rounded-xl" />
          <div className="h-64 w-full bg-brand-accent rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (!user) return null;

  const totalEntries = orders.reduce((acc, order) => acc + order.quantity, 0);

  return (
    <Container className="py-16 min-h-[70vh]">
      <div className="mb-12">
        <BrandSectionHeading>My <GradientText>Dashboard</GradientText></BrandSectionHeading>
        <p className="mt-2 text-sm text-brand-midnight/60 font-medium">
          Welcome back, <span className="text-brand-midnight font-bold">{user.displayName || user.email}</span>. Track your entries and see your wins.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <GlassCard className="p-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Total Entries</h2>
          <p className="mt-4 text-4xl font-black text-brand-midnight">{totalEntries}</p>
        </GlassCard>
        <GlassCard className="p-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Active Wins</h2>
          <p className="mt-4 text-4xl font-black text-brand-secondary">{wins.length}</p>
        </GlassCard>
        <GlassCard className="p-8">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Account Status</h2>
          <p className="mt-4 text-xl font-black text-green-600 uppercase tracking-tight">Verified Member</p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-primary/10 mb-8">
        <button
          onClick={() => setActiveTab("entries")}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            activeTab === "entries" 
              ? "border-brand-primary text-brand-primary" 
              : "border-transparent text-brand-midnight/40 hover:text-brand-midnight/60"
          }`}
        >
          My Entries
        </button>
        <button
          onClick={() => setActiveTab("wins")}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
            activeTab === "wins" 
              ? "border-brand-primary text-brand-primary" 
              : "border-transparent text-brand-midnight/40 hover:text-brand-midnight/60"
          }`}
        >
          My Wins {wins.length > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-[10px] text-white">{wins.length}</span>}
        </button>
      </div>

      {activeTab === "entries" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p className="text-brand-midnight/60 font-medium">You haven't entered any competitions yet.</p>
              <Link href="/raffles" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-8 text-sm font-bold text-white transition-all hover:scale-105 shadow-lg shadow-brand-primary/20">
                Enter a Raffle Now
              </Link>
            </GlassCard>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-brand-primary/10 bg-white shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-brand-accent/30 border-b border-brand-primary/5">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Competition</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Tickets</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Ticket Numbers</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Date</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-accent/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-brand-midnight uppercase tracking-tight">{order.raffleSlug.replace(/-/g, ' ')}</div>
                        <div className="text-[10px] font-mono text-brand-midnight/30">ID: {order.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-xs font-black text-brand-midnight">
                          {order.quantity}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-mono text-xs font-bold text-brand-secondary">
                          #{order.ticketRange.start} — #{order.ticketRange.end}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-brand-midnight/60 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right font-black text-brand-midnight">
                        {formatGBPFromPence(order.amountTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "wins" && (
        <div className="space-y-6">
          {wins.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent text-brand-midnight/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125V18.75m9 0a3 3 0 003-3V12a3 3 0 00-3-3h-15a3 3 0 00-3 3v3.75a3 3 0 003 3m9-3.375V9.75m0 0a3 3 0 116 0v3.75m-9-3.75a3 3 0 10-6 0v3.75" />
                </svg>
              </div>
              <p className="text-brand-midnight/60 font-medium">No wins yet. Your time will come!</p>
              <p className="mt-2 text-xs text-brand-midnight/40">Every ticket is a chance to win. Good luck!</p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {wins.map((win) => (
                <GlassCard key={win.raffleId} className="p-8 border-brand-secondary/20 bg-brand-secondary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20">
                      Winner
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight pr-16">{win.raffleTitle}</h3>
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Winning Ticket</p>
                      <p className="mt-1 text-3xl font-black text-brand-secondary">#{win.winningTicketNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Drawn On</p>
                      <p className="mt-1 text-sm font-bold text-brand-midnight">
                        {new Date(win.drawnAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
