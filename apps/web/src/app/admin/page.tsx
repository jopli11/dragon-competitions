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

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  refunded: "bg-gray-200 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded_oversold: "bg-orange-100 text-orange-700",
  refunded_pass_reuse: "bg-orange-100 text-orange-700",
};

type TicketRange = {
  start: number;
  end: number;
};

type AdminOrder = {
  id: string;
  amountTotal?: number;
  amountPence?: number;
  ticketRange?: TicketRange;
  quantity?: number;
  email?: string;
  raffleSlug?: string;
  status?: string;
  dnaTransactionId?: string;
  dnaRefundId?: string;
  createdAt?: string;
  refundedAt?: string;
};

type AdminRaffle = {
  id: string;
  slug?: string;
  title?: string;
  ticketsSold?: number;
  totalTickets?: number;
  endAt?: string;
  drawStatus?: string;
  status?: string;
  isSoldOut?: boolean;
};

type AdminWinner = {
  id: string;
  name?: string;
  prize?: string;
  date?: string;
  ticket?: number;
};

type AdminStats = {
  activeRaffles: number;
  totalRevenuePence: number;
  pendingDraws: number;
  recentOrders: AdminOrder[];
  orders: AdminOrder[];
  raffles: AdminRaffle[];
  winners?: AdminWinner[];
};

type TicketLookupResult = {
  found?: boolean;
  ticketNumber?: number;
  error?: string;
};

type ConfirmWinnerResult = {
  success: boolean;
  message: string;
};

function OrderStatusBadge({ status }: { status?: string }) {
  const s = status || "unknown";
  const style = STATUS_STYLES[s] || "bg-gray-100 text-gray-600";
  const label = s.replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${style}`}>
      {label}
    </span>
  );
}

function RefundModal({
  order,
  reason,
  onReasonChange,
  loading,
  error,
  onCancel,
  onConfirm,
}: {
  order: AdminOrder;
  reason: string;
  onReasonChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const amount = order.amountTotal ?? order.amountPence ?? 0;
  const [confirmText, setConfirmText] = useState("");
  const canConfirm = confirmText === "REFUND";
  const ticketStr = order.ticketRange
    ? order.ticketRange.start === order.ticketRange.end
      ? `Ticket #${order.ticketRange.start}`
      : `Tickets #${order.ticketRange.start} - #${order.ticketRange.end}`
    : `${order.quantity || 0} tickets`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-9990 flex items-center justify-center bg-brand-midnight/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-red-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-700">
            Dangerous Action
          </div>
          <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-brand-midnight">Confirm Refund</h2>
          <p className="mt-2 text-sm font-bold text-red-700">
            This refunds the customer through DNA Payments and voids their tickets. This cannot be undone.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl bg-brand-accent/30 p-5 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-midnight/50 font-medium">Order</span>
            <span className="font-mono text-xs font-bold text-brand-midnight">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-midnight/50 font-medium">Customer</span>
            <span className="font-bold text-brand-midnight text-xs break-all text-right">{order.email || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-midnight/50 font-medium">Raffle</span>
            <span className="font-bold text-brand-midnight">{order.raffleSlug}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-midnight/50 font-medium">Tickets</span>
            <span className="font-bold text-brand-midnight">{ticketStr}</span>
          </div>
          <div className="flex justify-between border-t border-brand-primary/10 pt-3">
            <span className="text-brand-midnight/50 font-medium">Refund Amount</span>
            <span className="text-lg font-black text-brand-midnight">{formatGBPFromPence(amount)}</span>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">
            Reason (optional, internal)
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="e.g. customer request, duplicate purchase..."
            rows={2}
            className="w-full bg-white border border-brand-primary/10 rounded-2xl px-4 py-3 text-sm text-brand-midnight font-medium focus:border-brand-primary focus:outline-none resize-none"
            disabled={loading}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-red-700 mb-2">
            Type REFUND to enable this action
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="REFUND"
            className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 font-mono text-sm font-bold text-brand-midnight outline-none transition-colors focus:border-red-500"
            disabled={loading}
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest text-brand-midnight/60 hover:text-brand-midnight transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !canConfirm}
            className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
          >
            {loading ? "Processing..." : `Refund ${formatGBPFromPence(amount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "raffles" | "orders" | "winners" | "settings">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lookupSlug, setLookupSlug] = useState("");
  const [lookupTicket, setLookupTicket] = useState("");
  const [lookupResult, setLookupResult] = useState<TicketLookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmResult, setConfirmResult] = useState<ConfirmWinnerResult | null>(null);

  const [orderFilter, setOrderFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "completed" | "refunded" | "pending" | "failed">("all");
  const [refundOrder, setRefundOrder] = useState<AdminOrder | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

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
          setStats(result.data as AdminStats);
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

  async function handleExportTickets(raffleSlug: string) {
    setExportLoading(raffleSlug);
    try {
      const user = auth?.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/export-tickets?raffleSlug=${encodeURIComponent(raffleSlug)}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${raffleSlug}-tickets.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export tickets. Please try again.");
    } finally {
      setExportLoading(null);
    }
  }

  async function handleLookupTicket() {
    if (!lookupSlug || !lookupTicket) return;
    setLookupLoading(true);
    setLookupResult(null);
    try {
      const user = auth?.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      const res = await fetch(
        `/api/admin/lookup-ticket?raffleSlug=${encodeURIComponent(lookupSlug)}&ticketNumber=${encodeURIComponent(lookupTicket)}`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      const data = (await res.json()) as TicketLookupResult;
      setLookupResult(data);
    } catch (err) {
      console.error("Lookup error:", err);
      setLookupResult({ error: "Lookup failed" });
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleConfirmWinner() {
    if (!lookupSlug || !lookupResult?.found) return;
    const confirmed = window.confirm(
      `Confirm ticket #${lookupResult.ticketNumber} as the winner of "${lookupSlug}"?\n\nThe server will independently verify the ticket owner. This cannot be undone.`
    );
    if (!confirmed) return;

    setConfirmLoading(true);
    setConfirmResult(null);
    try {
      const user = auth?.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/admin/confirm-live-winner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raffleSlug: lookupSlug,
          ticketNumber: lookupResult.ticketNumber,
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setConfirmResult({ success: true, message: data.message });
      } else {
        setConfirmResult({ success: false, message: data.error || "Failed to confirm winner" });
      }
    } catch (err) {
      console.error("Confirm winner error:", err);
      setConfirmResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleRefund() {
    if (!refundOrder || refundLoading) return;

    setRefundLoading(true);
    setRefundError(null);
    try {
      const user = auth?.currentUser;
      if (!user) {
        setRefundError("Not authenticated.");
        return;
      }
      const idToken = await user.getIdToken();

      const res = await fetch("/api/admin/refund-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: refundOrder.id,
          reason: refundReason.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { error?: string; dnaRefundId?: string };
      if (!res.ok) {
        setRefundError(data.error || "Refund failed");
        return;
      }

      setStats((prev) => {
        if (!prev) return prev;
        const updateOrder = (o: AdminOrder): AdminOrder =>
          o.id === refundOrder.id
            ? {
                ...o,
                status: "refunded",
                refundedAt: new Date().toISOString(),
                dnaRefundId: data.dnaRefundId,
              }
            : o;
        return {
          ...prev,
          orders: (prev.orders || []).map(updateOrder),
          recentOrders: (prev.recentOrders || []).map(updateOrder),
        };
      });

      setRefundOrder(null);
      setRefundReason("");
    } catch (err) {
      setRefundError(err instanceof Error ? err.message : "Network error");
    } finally {
      setRefundLoading(false);
    }
  }

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
                {stats.raffles.slice(0, 3).map((raffle) => (
                  <div key={raffle.id} className="flex items-center justify-between p-4 rounded-2xl bg-brand-accent/20">
                    <div>
                      <div className="font-bold text-sm text-brand-midnight">{raffle.title}</div>
                      <div className="text-[10px] text-brand-midnight/40 font-bold uppercase tracking-wider">
                        {raffle.ticketsSold || 0} / {raffle.totalTickets || 0} tickets
                      </div>
                    </div>
                    <div className="h-1.5 w-20 bg-brand-accent rounded-full overflow-hidden">
                      <div className="h-full bg-brand-secondary" style={{ width: `${((raffle.ticketsSold || 0) / (raffle.totalTickets || 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Orders View */}
            <div className="rounded-[2.5rem] border border-brand-primary/5 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-brand-primary/5">
                    <div>
                      <div className="font-bold text-sm text-brand-midnight">{order.email}</div>
                      <div className="text-[10px] text-brand-midnight/40 font-bold uppercase tracking-wider">{order.raffleSlug}</div>
                    </div>
                    <div className="font-black text-brand-secondary">{formatGBPFromPence(order.amountTotal || 0)}</div>
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
                {stats.raffles.map((raffle) => (
                  <tr key={raffle.id}>
                    <td className="px-8 py-4">
                      <div className="font-bold text-brand-midnight">{raffle.title}</div>
                      <div className="text-[10px] font-mono text-brand-midnight/40">{raffle.slug}</div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-midnight">{raffle.ticketsSold || 0}</span>
                        <span className="text-brand-midnight/20">/</span>
                        <span className="text-brand-midnight/40">{raffle.totalTickets || 0}</span>
                      </div>
                      <div className="mt-1.5 h-1 w-24 bg-brand-accent rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-secondary" 
                          style={{ width: `${((raffle.ticketsSold || 0) / (raffle.totalTickets || 1)) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-4 font-medium text-brand-midnight">
                      {raffle.endAt ? new Date(raffle.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        raffle.drawStatus === "completed" ? "bg-gray-100 text-gray-700" :
                        raffle.status === "awaitingDraw" ? "bg-amber-100 text-amber-700" :
                        raffle.isSoldOut ? "bg-red-100 text-red-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {raffle.drawStatus === "completed" ? "Drawn" :
                         raffle.status === "awaitingDraw" ? "Awaiting Draw" :
                         raffle.isSoldOut ? "Sold Out" :
                         raffle.status || "Live"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right space-x-2">
                      {(raffle.isSoldOut || raffle.drawStatus === "completed") && (
                        <button
                          onClick={() => handleExportTickets(raffle.slug || raffle.id)}
                          disabled={exportLoading === (raffle.slug || raffle.id)}
                          className="text-brand-primary font-bold text-xs hover:underline disabled:opacity-50"
                        >
                          {exportLoading === (raffle.slug || raffle.id) ? "Exporting..." : "Export Tickets"}
                        </button>
                      )}
                      <button
                        onClick={() => { setLookupSlug(raffle.slug || raffle.id); setActiveTab("settings"); }}
                        className="text-brand-primary font-bold text-xs hover:underline"
                      >
                        Lookup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                placeholder="Filter by email, order ID, or raffle..."
                className="w-full bg-white border border-brand-primary/10 rounded-2xl px-6 py-3 text-sm text-brand-midnight font-medium focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-1 bg-brand-accent/30 p-1 rounded-2xl">
              {(["all", "completed", "refunded", "pending", "failed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    orderStatusFilter === status
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-brand-midnight/50 hover:text-brand-midnight"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[920px]">
                <thead className="bg-brand-accent/30 border-b border-brand-primary/5">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Order</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Raffle</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Tickets</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-midnight/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {(() => {
                    const allOrders = stats.orders || stats.recentOrders || [];
                    const filtered = allOrders.filter((o) => {
                      if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
                      if (orderFilter) {
                        const q = orderFilter.toLowerCase();
                        return (
                          (o.email || "").toLowerCase().includes(q) ||
                          (o.id || "").toLowerCase().includes(q) ||
                          (o.raffleSlug || "").toLowerCase().includes(q)
                        );
                      }
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-brand-midnight/40 text-sm font-medium">
                            No orders match your filters.
                          </td>
                        </tr>
                      );
                    }

                    return filtered.map((order) => {
                      const amount = order.amountTotal ?? order.amountPence ?? 0;
                      const isRefundable = order.status === "completed" && !!order.dnaTransactionId;
                      const isRefunded = order.status === "refunded";
                      return (
                        <tr key={order.id} className={`hover:bg-brand-accent/5 transition-colors ${isRefunded ? "opacity-70" : ""}`}>
                          <td className="px-6 py-4">
                            <div className="font-mono text-[11px] font-bold text-brand-midnight">{order.id.slice(0, 8)}...{order.id.slice(-4)}</div>
                            <div className="text-[10px] text-brand-midnight/40 mt-0.5">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-brand-midnight text-xs break-all">{order.email || "—"}</td>
                          <td className="px-6 py-4 font-medium text-brand-midnight text-xs">{order.raffleSlug || "—"}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-brand-secondary">{order.quantity || 0}</div>
                            {order.ticketRange && (
                              <div className="text-[10px] font-mono text-brand-midnight/40 mt-0.5">
                                #{order.ticketRange.start}-#{order.ticketRange.end}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-black text-brand-midnight text-right">{formatGBPFromPence(amount)}</td>
                          <td className="px-6 py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isRefundable ? (
                              <button
                                onClick={() => { setRefundOrder(order); setRefundReason(""); setRefundError(null); }}
                                className="text-red-600 font-bold text-xs hover:underline"
                              >
                                Refund
                              </button>
                            ) : isRefunded ? (
                              <span className="text-[10px] font-bold text-brand-midnight/30 uppercase tracking-wider" title={order.refundedAt ? `Refunded ${new Date(order.refundedAt).toLocaleString("en-GB")}` : ""}>
                                Refunded
                              </span>
                            ) : (
                              <span className="text-[10px] text-brand-midnight/20">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {refundOrder && (
            <RefundModal
              order={refundOrder}
              reason={refundReason}
              onReasonChange={setRefundReason}
              loading={refundLoading}
              error={refundError}
              onCancel={() => { if (!refundLoading) { setRefundOrder(null); setRefundError(null); } }}
              onConfirm={handleRefund}
            />
          )}
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
                {(stats.winners || []).map((winner) => (
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
          {/* Ticket Lookup Tool */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-2">Ticket Lookup</h3>
            <p className="text-xs text-brand-midnight/50 mb-6">Look up the owner of a specific ticket number. Use this after a live draw to identify the winner.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Raffle Slug</label>
                  <select
                    value={lookupSlug}
                    onChange={(e) => setLookupSlug(e.target.value)}
                    className="w-full bg-white border border-brand-primary/10 rounded-2xl px-6 py-4 text-brand-midnight font-medium"
                  >
                    <option value="">Select raffle...</option>
                    {stats.raffles.map((r) => (
                      <option key={r.id} value={r.slug || r.id}>{r.title || r.id}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Ticket Number</label>
                  <input
                    type="number"
                    min={1}
                    value={lookupTicket}
                    onChange={(e) => setLookupTicket(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full bg-white border border-brand-primary/10 rounded-2xl px-6 py-4 text-brand-midnight font-medium"
                  />
                </div>
              </div>
              <BrandButton size="sm" onClick={handleLookupTicket} disabled={lookupLoading || !lookupSlug || !lookupTicket}>
                {lookupLoading ? "Looking up..." : "Lookup Ticket"}
              </BrandButton>

              {lookupResult && (
                <div className={`mt-4 rounded-2xl p-6 ${lookupResult.found ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  {lookupResult.found ? (
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-widest text-green-700">Ticket #{lookupResult.ticketNumber} Owner</div>
                      <div className="text-lg font-black text-brand-midnight">{lookupResult.email}</div>
                      <div className="text-xs text-brand-midnight/50">Order: {lookupResult.orderId} &middot; Status: {lookupResult.status}</div>

                      <div className="pt-3 border-t border-green-200">
                        <BrandButton
                          size="sm"
                          onClick={handleConfirmWinner}
                          disabled={confirmLoading || confirmResult?.success}
                        >
                          {confirmLoading ? "Confirming..." : confirmResult?.success ? "Winner Confirmed" : "Confirm as Live Draw Winner"}
                        </BrandButton>
                        <p className="mt-2 text-[10px] text-brand-midnight/40">
                          This records the winner in Firestore so it appears on their dashboard.
                        </p>
                      </div>

                      {confirmResult && (
                        <div className={`mt-2 rounded-xl p-4 text-sm font-bold ${confirmResult.success ? "bg-brand-secondary/10 text-brand-secondary" : "bg-red-100 text-red-700"}`}>
                          {confirmResult.message}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-red-700">{lookupResult.message || lookupResult.error || "Ticket not found"}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Site Settings */}
          <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-6">Site Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Support Email</label>
                <input type="email" defaultValue="coastcompetitionsuk@gmail.com" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Admin Notification Email</label>
                <input type="email" defaultValue="coastcompetitionsuk@gmail.com" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium" />
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
