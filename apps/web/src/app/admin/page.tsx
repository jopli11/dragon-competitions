import { Container } from "@/components/Container";

export default function AdminPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-4 text-sm text-foreground/70">
        Welcome to the Dragon Competitions admin area. This section is for monitoring raffles, orders, and draws.
      </p>
      
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
          <h2 className="text-sm font-semibold">Active Raffles</h2>
          <p className="mt-2 text-2xl font-bold">--</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
          <h2 className="text-sm font-semibold">Total Revenue</h2>
          <p className="mt-2 text-2xl font-bold">£0.00</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
          <h2 className="text-sm font-semibold">Pending Draws</h2>
          <p className="mt-2 text-2xl font-bold">--</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Recent Orders</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Raffle</th>
                <th className="px-6 py-3 font-semibold">Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              <tr>
                <td className="px-6 py-4 text-foreground/60" colSpan={4}>
                  No orders found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
