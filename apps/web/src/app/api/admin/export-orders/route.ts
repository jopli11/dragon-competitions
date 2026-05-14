import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

async function verifyAdmin(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    const email = decoded.email;
    if (!email) return null;

    const adminDoc = await adminDb.collection("admin_users").doc(email).get();
    if (!adminDoc.exists || adminDoc.data()?.isAdmin !== true) return null;

    return email;
  } catch {
    return null;
  }
}

function csvEscape(value: unknown): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

type TimestampLike = { toDate: () => Date };
function isTimestampLike(v: unknown): v is TimestampLike {
  return (
    typeof v === "object" &&
    v !== null &&
    "toDate" in v &&
    typeof (v as { toDate?: unknown }).toDate === "function"
  );
}

function asDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (isTimestampLike(value)) {
    const d = value.toDate();
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function toISO(value: unknown): string {
  return asDate(value)?.toISOString() ?? "";
}

const COLUMNS = [
  "orderId",
  "createdAt",
  "completedAt",
  "refundedAt",
  "failedAt",
  "status",
  "email",
  "uid",
  "raffleSlug",
  "quantity",
  "ticketStart",
  "ticketEnd",
  "amountPence",
  "amountGBP",
  "currency",
  "paymentMethod",
  "cardPanStarred",
  "dnaTransactionId",
  "dnaRefundId",
  "provider",
  "quizPassId",
  "isTestOrder",
] as const;

/**
 * GET /api/admin/export-orders
 *
 * Returns a CSV of orders for downstream reporting.
 *
 * Query params (all optional):
 *   raffleSlug         - restrict to a single raffle
 *   status             - completed | refunded | pending | failed | refunded_oversold | refunded_pass_reuse
 *   from               - ISO date (inclusive) lower bound on createdAt
 *   to                 - ISO date (inclusive) upper bound on createdAt
 *   includeTestOrders  - "true" to include DNA sandbox orders (default excludes them)
 *
 * To avoid requiring composite Firestore indexes, at most one of
 * (raffleSlug, status) is applied server-side; the remaining filters,
 * date-range trimming, and sort are performed in memory.
 */
export async function GET(req: NextRequest) {
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl;
  const raffleSlug = url.searchParams.get("raffleSlug")?.trim() || null;
  const statusParam = url.searchParams.get("status")?.trim() || null;
  const status = statusParam && statusParam !== "all" ? statusParam : null;
  const fromStr = url.searchParams.get("from")?.trim() || null;
  const toStr = url.searchParams.get("to")?.trim() || null;
  const includeTestOrders = url.searchParams.get("includeTestOrders") === "true";

  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;
  if (from && Number.isNaN(from.getTime())) {
    return NextResponse.json({ error: "Invalid 'from' date" }, { status: 400 });
  }
  if (to && Number.isNaN(to.getTime())) {
    return NextResponse.json({ error: "Invalid 'to' date" }, { status: 400 });
  }

  try {
    let query: FirebaseFirestore.Query = adminDb.collection("orders");
    if (raffleSlug) {
      query = query.where("raffleSlug", "==", raffleSlug);
    } else if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();

    type Row = { createdAt: Date | null; record: Record<string, unknown> };
    const rows: Row[] = [];
    let totalRevenuePence = 0;
    let completedCount = 0;
    let refundedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() as Record<string, unknown>;

      if (!includeTestOrders && data.isTestOrder === true) continue;
      if (raffleSlug && status && data.status !== status) continue;

      const createdAt = asDate(data.createdAt);
      if (from && createdAt && createdAt < from) continue;
      if (to && createdAt && createdAt > to) continue;

      const amountPence =
        typeof data.amountTotal === "number"
          ? data.amountTotal
          : typeof data.amountPence === "number"
            ? data.amountPence
            : 0;

      const ticketRange = data.ticketRange as { start?: number; end?: number } | undefined;

      if (data.status === "completed") {
        totalRevenuePence += amountPence;
        completedCount += 1;
      } else if (
        data.status === "refunded" ||
        data.status === "refunded_oversold" ||
        data.status === "refunded_pass_reuse"
      ) {
        refundedCount += 1;
      }

      rows.push({
        createdAt,
        record: {
          orderId: doc.id,
          createdAt: toISO(data.createdAt),
          completedAt: toISO(data.completedAt),
          refundedAt: toISO(data.refundedAt),
          failedAt: toISO(data.failedAt),
          status: data.status ?? "",
          email: data.email ?? "",
          uid: data.uid ?? "",
          raffleSlug: data.raffleSlug ?? "",
          quantity: data.quantity ?? 0,
          ticketStart: ticketRange?.start ?? "",
          ticketEnd: ticketRange?.end ?? "",
          amountPence,
          amountGBP: (amountPence / 100).toFixed(2),
          currency: data.currency ?? "GBP",
          paymentMethod: data.paymentMethod ?? "",
          cardPanStarred: data.cardPanStarred ?? "",
          dnaTransactionId: data.dnaTransactionId ?? "",
          dnaRefundId: data.dnaRefundId ?? "",
          provider: data.provider ?? "",
          quizPassId: data.quizPassId ?? "",
          isTestOrder: data.isTestOrder === true ? "true" : "false",
        },
      });
    }

    rows.sort((a, b) => {
      const at = a.createdAt?.getTime() ?? 0;
      const bt = b.createdAt?.getTime() ?? 0;
      return bt - at;
    });

    const lines: string[] = [];
    lines.push(COLUMNS.join(","));
    for (const row of rows) {
      lines.push(COLUMNS.map((c) => csvEscape(row.record[c])).join(","));
    }
    lines.push("");
    lines.push(
      `# Exported by ${adminEmail} at ${new Date().toISOString()}`,
    );
    lines.push(
      `# Filters: ${JSON.stringify({
        raffleSlug,
        status,
        from: fromStr,
        to: toStr,
        includeTestOrders,
      })}`,
    );
    lines.push(`# Orders exported: ${rows.length}`);
    lines.push(`# Completed orders: ${completedCount}`);
    lines.push(`# Refunded orders: ${refundedCount}`);
    lines.push(
      `# Completed gross revenue: GBP ${(totalRevenuePence / 100).toFixed(2)}`,
    );

    // Prepend UTF-8 BOM so Excel renders non-ASCII (e.g. £) correctly.
    const csv = "\ufeff" + lines.join("\r\n");

    const stamp = new Date().toISOString().slice(0, 10);
    const slugPart = raffleSlug ? raffleSlug : "all";
    const statusPart = status ? `-${status}` : "";
    const filename = `orders-${slugPart}${statusPart}-${stamp}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error("Error exporting orders:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
