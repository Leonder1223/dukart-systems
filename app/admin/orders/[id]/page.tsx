import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { OrderPart, OrderUpdate } from "@prisma/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  if (role !== "ADMIN" && role !== "STAFF" && role !== "SUPERVISOR") {
    redirect("/dashboard");
  }

  const sessionUserId = session.user.id;

  const { id } = await params;

  async function updateOrderStatus(formData: FormData) {
    "use server";

    const status = formData.get("status") as string;

    await prisma.order.update({
      where: { id },
      data: {
        status: status as any,
      },
    });

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
  }

  async function updateOrderPrice(formData: FormData) {
    "use server";

    const priceValue = formData.get("price") as string;

    await prisma.order.update({
      where: { id },
      data: {
        finalPrice: priceValue ? Number(priceValue) : null,
      },
    });

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
  }

  async function addOrderUpdate(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const isVisibleToCustomer = formData.get("isVisibleToCustomer") === "on";

    if (!title || !message) return;

    await prisma.orderUpdate.create({
      data: {
        orderId: id,
        authorUserId: sessionUserId,
        title,
        message,
        isVisibleToCustomer,
      },
    });

    revalidatePath(`/admin/orders/${id}`);
  }

  async function addOrderPart(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const quantityValue = formData.get("quantity") as string;
    const unitPriceValue = formData.get("unitPrice") as string;
    const supplier = formData.get("supplier") as string;
    const isOrdered = formData.get("isOrdered") === "on";
    const isArrived = formData.get("isArrived") === "on";

    if (!name || !category) return;

    await prisma.orderPart.create({
      data: {
        orderId: id,
        name,
        category,
        quantity: quantityValue ? Number(quantityValue) : 1,
        unitPrice: unitPriceValue ? Number(unitPriceValue) : null,
        supplier: supplier || null,
        isOrdered,
        isArrived,
      },
    });

    revalidatePath(`/admin/orders/${id}`);
  }

    async function togglePartStatus(formData: FormData) {
    "use server";

    const partId = formData.get("partId") as string;
    const field = formData.get("field") as string;
    const value = formData.get("value") === "true";

    if (!partId || !field) return;

    if (field !== "isOrdered" && field !== "isArrived") return;

    await prisma.orderPart.update({
      where: { id: partId },
      data: {
        [field]: value,
      },
    });

    revalidatePath(`/admin/orders/${id}`);
  }

  async function deletePart(formData: FormData) {
    "use server";

    const partId = formData.get("partId") as string;
    if (!partId) return;

    await prisma.orderPart.delete({
      where: { id: partId },
    });

    revalidatePath(`/admin/orders/${id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      parts: true,
      updates: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{order.title}</h1>
          <p className="mt-3 text-slate-300">
            Auftrag {order.orderNumber} · {order.customer.firstName} {order.customer.lastName}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Auftragsdaten</h2>
            <div className="mt-6 space-y-3 text-slate-300">
              <p><span className="font-medium text-white">Status:</span> {order.status}</p>
              <p><span className="font-medium text-white">Preis:</span> {order.finalPrice ? `${order.finalPrice.toString()} €` : "-"}</p>
              <p><span className="font-medium text-white">Kunde:</span> {order.customer.firstName} {order.customer.lastName}</p>
              <p><span className="font-medium text-white">E-Mail:</span> {order.customer.email}</p>
              <p><span className="font-medium text-white">Telefon:</span> {order.customer.phone}</p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="text-lg font-semibold">Status ändern</h3>
              <form action={updateOrderStatus} className="mt-4 space-y-4">
                <select
                  name="status"
                  defaultValue={order.status}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  <option value="REQUEST_RECEIVED">Anfrage eingegangen</option>
                  <option value="CONSULTATION">Beratung</option>
                  <option value="PARTS_SELECTION">Teile auswählen</option>
                  <option value="AWAITING_CUSTOMER_CONFIRMATION">Warten auf Bestätigung</option>
                  <option value="PARTS_ORDERED">Teile bestellt</option>
                  <option value="PARTS_ARRIVED">Teile angekommen</option>
                  <option value="ASSEMBLY">Zusammenbau</option>
                  <option value="WINDOWS_DRIVERS_TESTS">Windows / Treiber / Tests</option>
                  <option value="COMPLETED">Fertig</option>
                  <option value="PICKED_UP">Abgeholt</option>
                  <option value="DELIVERED">Geliefert</option>
                  <option value="PAUSED">Pausiert</option>
                </select>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:scale-[1.02]"
                >
                  Status speichern
                </button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="text-lg font-semibold">Preis ändern</h3>
              <form action={updateOrderPrice} className="mt-4 space-y-4">
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={order.finalPrice?.toString() ?? ""}
                  placeholder="Preis eingeben"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:scale-[1.02]"
                >
                  Preis speichern
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold">Teile</h2>

            <form action={addOrderPart} className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Kategorie</label>
                <input
                  type="text"
                  name="category"
                  placeholder="z. B. gpu, cpu, ram"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Menge</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue="1"
                  min="1"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Einzelpreis</label>
                <input
                  type="number"
                  name="unitPrice"
                  step="0.01"
                  placeholder="z. B. 549.99"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Lieferant</label>
                <input
                  type="text"
                  name="supplier"
                  placeholder="z. B. Mindfactory"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" name="isOrdered" />
                Bereits bestellt
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" name="isArrived" />
                Bereits angekommen
              </label>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:scale-[1.02]"
                >
                  Teil hinzufügen
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-4">
              {order.parts.length > 0 ? (
                order.parts.map((part: OrderPart) => (
                  <div
                    key={part.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium text-white">{part.name}</p>
                        <p className="text-sm text-slate-400">{part.category}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Lieferant: {part.supplier || "-"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Menge: {part.quantity} · {part.unitPrice ? `${part.unitPrice.toString()} €` : "-"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                        <div className="flex flex-wrap gap-2">
                          <form action={togglePartStatus}>
                            <input type="hidden" name="partId" value={part.id} />
                            <input type="hidden" name="field" value="isOrdered" />
                            <input type="hidden" name="value" value={part.isOrdered ? "false" : "true"} />
                            <button
                              type="submit"
                              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                                part.isOrdered
                                  ? "bg-cyan-300 text-slate-950"
                                  : "bg-white/10 text-slate-300"
                              }`}
                            >
                              Bestellt: {part.isOrdered ? "Ja" : "Nein"}
                            </button>
                          </form>

                          <form action={togglePartStatus}>
                            <input type="hidden" name="partId" value={part.id} />
                            <input type="hidden" name="field" value="isArrived" />
                            <input type="hidden" name="value" value={part.isArrived ? "false" : "true"} />
                            <button
                              type="submit"
                              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                                part.isArrived
                                  ? "bg-green-300 text-slate-950"
                                  : "bg-white/10 text-slate-300"
                              }`}
                            >
                              Angekommen: {part.isArrived ? "Ja" : "Nein"}
                            </button>
                          </form>
                        </div>

                        <form action={deletePart}>
                          <input type="hidden" name="partId" value={part.id} />
                          <button
                            type="submit"
                            className="rounded-xl bg-red-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
                          >
                            Teil löschen
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Keine Teile vorhanden.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Neues Update</h2>

            <form action={addOrderUpdate} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Titel</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Nachricht</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" name="isVisibleToCustomer" defaultChecked />
                Für Kunden sichtbar
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:scale-[1.02]"
              >
                Update speichern
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Updates</h2>
            <div className="mt-6 space-y-4">
              {order.updates.length > 0 ? (
                order.updates.map((update: OrderUpdate) => (
                  <div
                    key={update.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-white">{update.title}</p>
                      <span className="text-xs text-slate-400">
                        {new Date(update.createdAt).toLocaleString("de-DE")}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-300">{update.message}</p>
                    <p className="mt-2 text-xs text-cyan-300">
                      Sichtbar für Kunde: {update.isVisibleToCustomer ? "Ja" : "Nein"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Noch keine Updates vorhanden.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
