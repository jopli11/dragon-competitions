"use client";

import { Container } from "@/components/Container";
import { withAdminAuth } from "@/components/withAdminAuth";
import { BrandSectionHeading, GradientText, BrandButton } from "@/lib/styles";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/client";

function formatGBPFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "raffles" | "orders" | "winners" | "settings">("overview");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = auth?.currentUser;
        if (!user) {
          console.error("No authenticated user found");
          setLoading(false);
          return;
        }

        const idToken = await user.getIdToken();
        const { fetchAdminDashboardData } = await import("./actions");
        const result = await fetchAdminDashboardData(idToken);
        if (result && result.success) {
          setStats(result.data);
        } else {
          console.error("Failed to fetch admin data:", result?.error);
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Container className="py-16 min-h-[60vh]">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-64 bg-brand-accent rounded-xl" />
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="h-32 bg-brand-accent rounded-3xl" />
            <div className="h-32 bg-brand-accent rounded-3xl" />
            <div className="h-32 bg-brand-accent rounded-3xl" />
          </div>
        </div>
      </Container>
    );
  }

  if (!stats) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "raffles", label: "Raffles" },
    { id: "orders", label: "Orders" },
    { id: "winners", label: "Winners" },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <Container className="py-16 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <BrandSectionHeading>Admin <GradientText>Dashboard</GradientText></BrandSectionHeading>
          <p className="mt-2 text-sm text-brand-midnight/60 font-medium">
            Manage your competitions, track orders, and announce winners.
          </p>
        </div>
        <div className="flex gap-3">
          <BrandButton variant="outline" size="sm">Sync Contentful</BrandButton>
          <BrandButton size="sm">New Raffle</BrandButton>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-brand-primary/10 mb-10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab.id 
                ? "border-brand-primary text-brand-primary" 
                : "border-transparent text-brand-midnight/40 hover:text-brand-midnight/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === "overview" && (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Active Raffles</h2>
              <p className="mt-4 text-4xl font-black text-brand-midnight">{stats.activeRaffles}</p>
            </div>
            <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Total Revenue</h2>
              <p className="mt-4 text-4xl font-black text-brand-secondary">
                {formatGBPFromPence(stats.totalRevenuePence)}
              </p>
            </div>
            <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40">Pending Draws</h2>
              <p className="mt-4 text-4xl font-black text-brand-coral">{stats.pendingDraws}</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Quick Raffles View */}
            <div className="rounded-[2.5rem] border border-brand-primary/5 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-6">Live Raffles</h3>
              <div className="space-y-4">
                {stats.raffles.slice(0, 3).map((raffle: any) => (
                  <div key={raffle.id} className="flex items-center justify-between p-4 rounded-2xl bg-brand-accent/20">
                    <div>
                      <div className="font-bold text-sm text-brand-midnight">{raffle.title}</div>
                      <div className="text-[10px] text-brand-midnight/40 font-bold uppercase tracking-wider">
                        {raffle.ticketsSold} / {raffle.totalTickets} tickets
                      </div>
                    </div>
                    <div className="h-1.5 w-20 bg-brand-accent rounded-full overflow-hidden">
                      <div className="h-full bg-brand-secondary" style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Orders View */}
            <div className="rounded-[2.5rem] border border-brand-primary/5 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-brand-primary/5">
                    <div>
                      <div className="font-bold text-sm text-brand-midnight">{order.email}</div>
                      <div className="text-[10px] text-brand-midnight/40 font-bold uppercase tracking-wider">{order.raffleSlug}</div>
                    </div>
                    <div className="font-black text-brand-secondary">{formatGBPFromPence(order.amountTotal)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "raffles" && (
        <section>
          <div className="overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-accent/30 border-b border-brand-primary/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Raffle</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Tickets Sold</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">End Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {stats.raffles.map((raffle: any) => (
                  <tr key={raffle.id}>
                    <td className="px-8 py-4">
                      <div className="font-bold text-brand-midnight">{raffle.title}</div>
                      <div className="text-[10px] font-mono text-brand-midnight/40">{raffle.slug}</div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-midnight">{raffle.ticketsSold}</span>
                        <span className="text-brand-midnight/20">/</span>
                        <span className="text-brand-midnight/40">{raffle.totalTickets}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-24 bg-brand-accent rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-secondary" 
                          style={{ width: `${(raffle.ticketsSold / raffle.totalTickets) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-4 font-medium text-brand-midnight">
                      {new Date(raffle.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-700">
                        {raffle.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="text-brand-primary font-bold text-xs hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section>
          <div className="overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-accent/30 border-b border-brand-primary/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Order ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Email</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Raffle</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Tickets</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-8 py-4 font-mono text-[10px] text-brand-midnight/60">{order.id}</td>
                    <td className="px-8 py-4 font-medium text-brand-midnight">{order.email}</td>
                    <td className="px-8 py-4 font-medium text-brand-midnight">{order.raffleSlug}</td>
                    <td className="px-8 py-4 font-bold text-brand-secondary text-center">{order.quantity}</td>
                    <td className="px-8 py-4 font-bold text-brand-midnight text-right">{formatGBPFromPence(order.amountTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "winners" && (
        <section>
          <div className="overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-accent/30 border-b border-brand-primary/5">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Winner</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Prize</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {(stats.winners || []).map((winner: any) => (
                  <tr key={winner.id}>
                    <td className="px-8 py-4 font-bold text-brand-midnight">{winner.name}</td>
                    <td className="px-8 py-4 font-medium text-brand-midnight">{winner.prize}</td>
                    <td className="px-8 py-4 font-medium text-brand-midnight/60">{winner.date}</td>
                    <td className="px-8 py-4 font-black text-brand-secondary text-right">#{winner.ticket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-8">
          <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-6">Site Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Support Email</label>
                <input type="email" defaultValue="support@coastcompetitions.co.uk" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Admin Notification Email</label>
                <input type="email" defaultValue="admin@coastcompetitions.co.uk" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium" />
              </div>
              <BrandButton size="sm">Save Settings</BrandButton>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default withAdminAuth(AdminPage);
