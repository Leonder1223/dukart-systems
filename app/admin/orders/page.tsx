import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Order, Customer } from "@prisma/client";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  if (role !== "ADMIN" && role !== "STAFF" && role !== "SUPERVISOR") {
    redirect("/dashboard");
  }

  const orders = await prisma.order.findMany({
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Aufträge</h1>
          <p className="mt-3 text-slate-300">
            Übersicht über alle aktuellen Aufträge.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-white/10 bg-white/5 text-sm text-slate-300">
                <tr>
                  <th className="px-6 py-4">Auftragsnummer</th>
                  <th className="px-6 py-4">Kunde</th>
                  <th className="px-6 py-4">Titel</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Preis</th>
                  <th className="px-6 py-4">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order: Order & { customer: Customer }) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 text-sm text-slate-200 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        {order.customer.firstName} {order.customer.lastName}
                      </td>
                      <td className="px-6 py-4">{order.title}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.finalPrice ? `${order.finalPrice.toString()} €` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.03]"
                        >
                          Öffnen
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      Noch keine Aufträge vorhanden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
