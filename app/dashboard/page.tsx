import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { OrderPart, OrderUpdate } from "@prisma/client";

const statusSteps = [
  "REQUEST_RECEIVED",
  "CONSULTATION",
  "PARTS_SELECTION",
  "AWAITING_CUSTOMER_CONFIRMATION",
  "PARTS_ORDERED",
  "PARTS_ARRIVED",
  "ASSEMBLY",
  "WINDOWS_DRIVERS_TESTS",
  "COMPLETED",
];

const statusLabels: Record<string, string> = {
  REQUEST_RECEIVED: "Anfrage eingegangen",
  CONSULTATION: "Beratung",
  PARTS_SELECTION: "Teile auswählen",
  AWAITING_CUSTOMER_CONFIRMATION: "Warten auf Bestätigung",
  PARTS_ORDERED: "Teile bestellt",
  PARTS_ARRIVED: "Teile angekommen",
  ASSEMBLY: "Zusammenbau",
  WINDOWS_DRIVERS_TESTS: "Windows, Treiber & Tests",
  COMPLETED: "Fertig",
  PICKED_UP: "Abgeholt",
  DELIVERED: "Geliefert",
  PAUSED: "Pausiert",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const order = await prisma.order.findFirst({
    include: {
      customer: true,
      parts: true,
      updates: {
        where: {
          isVisibleToCustomer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const currentStepIndex = statusSteps.indexOf(order?.status || "");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Kunden-Dashboard</h1>
          <p className="mt-3 text-slate-300">
            Willkommen im Kundenportal von Dukart Systems.
          </p>
        </div>

        {!order ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
            Aktuell ist noch kein Auftrag vorhanden.
          </div>
        ) : (
          <>
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-sm text-slate-400">Auftrag</p>
    <p className="mt-2 text-xl font-semibold">{order.orderNumber}</p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-sm text-slate-400">Status</p>
    <p className="mt-2 text-lg font-semibold leading-snug">
      {statusLabels[order.status] ?? order.status}
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-sm text-slate-400">Preis</p>
    <p className="mt-2 text-xl font-semibold">
      {order.finalPrice ? `${order.finalPrice} €` : "-"}
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    <p className="text-sm text-slate-400">Kunde</p>
    <p className="mt-2 text-lg font-semibold leading-snug">
      {order.customer.firstName} {order.customer.lastName}
    </p>
  </div>
<div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
  <h2 className="mb-6 text-2xl font-semibold">Fortschritt</h2>

  {/* Fortschrittsbalken */}
  <div className="relative mb-6 h-2 w-full rounded-full bg-white/10">
    <div
      className="h-2 rounded-full bg-cyan-400 transition-all"
      style={{
        width: `${
          currentStepIndex >= 0
            ? (currentStepIndex / (statusSteps.length - 1)) * 100
            : 0
        }%`,
      }}
    />
  </div>

  {/* Steps */}
  <div className="flex flex-wrap gap-3">
    {statusSteps.map((step, index) => {
      const isActive = index <= currentStepIndex;
      const isCurrent = index === currentStepIndex;

      return (
        <div
          key={step}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
            isActive
              ? "bg-cyan-400 text-slate-950"
              : "bg-white/10 text-slate-400"
          } ${isCurrent ? "ring-2 ring-cyan-200/40" : ""}`}
        >
          <span className="text-xs font-bold">
            {isActive ? "✔" : index + 1}
          </span>
          <span className="whitespace-nowrap">
            {statusLabels[step] ?? step}
          </span>
        </div>
      );
    })}
  </div>
</div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                <h2 className="text-2xl font-semibold">Auftragsdetails</h2>
                <div className="mt-6 space-y-3 text-slate-300">
                  <p>
                    <span className="font-medium text-white">Titel:</span> {order.title}
                  </p>
                  <p>
                    <span className="font-medium text-white">Beschreibung:</span>{" "}
                    {order.description || "-"}
                  </p>
                  <p>
                    <span className="font-medium text-white">Lieferung / Abholung:</span>{" "}
                    {order.fulfillmentType === "PICKUP"
  			? "Abholung"
 		        : order.fulfillmentType === "SHIPPING"
  			? "Versand"
  			: "-"}
                  </p>
                  <p>
                    <span className="font-medium text-white">
                      Voraussichtliche Fertigstellung:
                    </span>{" "}
                    {order.estimatedCompletionDate
                      ? new Date(order.estimatedCompletionDate).toLocaleDateString("de-DE")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-semibold">Letztes Update</h2>
                <div className="mt-6">
                  {order.updates.length > 0 ? (
                    <>
                      <p className="font-medium text-white">{order.updates[0].title}</p>
                      <p className="mt-2 text-slate-300">{order.updates[0].message}</p>
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(order.updates[0].createdAt).toLocaleString("de-DE")}
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-400">Noch kein Update vorhanden.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-semibold">Teile</h2>
                <div className="mt-6 space-y-4">
                  {order.parts.length > 0 ? (
                    order.parts.map((part: OrderPart) => (
                      <div
                        key={part.id}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{part.name}</p>
                            <p className="text-sm text-slate-400">{part.category}</p>
                          </div>
                          <div className="text-right text-sm text-slate-300">
                            <p>Bestellt: {part.isOrdered ? "Ja" : "Nein"}</p>
                            <p>Angekommen: {part.isArrived ? "Ja" : "Nein"}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Keine Teile vorhanden.</p>
                  )}
                </div>
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
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Noch keine sichtbaren Updates vorhanden.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
