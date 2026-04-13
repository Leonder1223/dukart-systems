"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Cpu, Wrench, ShieldCheck, Sparkles, Star, Users, ArrowRight, BadgeEuro, MessageCircle } from "lucide-react";

import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: "easeOut" as const,
    },
  }),
};

const hoverCard = {
  whileHover: { scale: 1.02, y: -6 },
  transition: {
    type: "tween" as const,
    duration: 0.16,
    ease: "easeOut" as const,
  },
};

const hoverCardSoft = {
  whileHover: { scale: 1.015, y: -4 },
  transition: {
    type: "tween" as const,
    duration: 0.16,
    ease: "easeOut" as const,
  },
};

export default function DukartSystemsWebsite() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("PC-Service & Reparatur");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewsData, setReviewsData] = useState<any[]>([]);

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  
  e.preventDefault();
  if (website) {
  return;
  }
  setLoading(true);
  setSuccess(false);
  setError("");

  try {
    const response = await fetch("https://leondukart.ipv64.de/webhook/dukart-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        contact,
        subject,
        message,
        website,
        source: "Dukart Systems Website",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Senden");
    }

    setSuccess(true);
    setName("");
    setContact("");
    setSubject("PC-Service & Reparatur");
    setMessage("");
  } catch (err) {
    setError("Die Anfrage konnte nicht gesendet werden.");
  } finally {
    setLoading(false);
  }
}

async function handleReviewSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setReviewLoading(true);
  setReviewSuccess(false);
  setReviewError("");

  try {
    const response = await fetch("https://leondukart.ipv64.de/webhook/dukart-review-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: reviewName,
        rating: reviewRating,
        text: reviewText,
        source: "Dukart Systems Review Form",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Senden");
    }

    setReviewSuccess(true);
    setReviewName("");
    setReviewRating("5");
    setReviewText("");
  } catch (err) {
    setReviewError("Die Bewertung konnte nicht gesendet werden.");
  } finally {
    setReviewLoading(false);
  }
}

useEffect(() => {
  fetch("https://leondukart.ipv64.de/webhook/dukart-review-list")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setReviewsData(data);
      } else if (data) {
        setReviewsData([data]);
      } else {
        setReviewsData([]);
      }
    })
    .catch(() => {
      setReviewsData([]);
    });
}, []);

  const services = [
    {
      icon: Cpu,
      title: "PC-Service & Reparatur",
      text: "Fehlerdiagnose, langsame PCs beschleunigen, Hardware-Probleme lösen und saubere Hilfe ohne komplizierte Erklärungen.",
      price: "ab 39€",
      details: "Ideal bei Abstürzen, langsamen Systemen, kaputten Komponenten oder allgemeiner PC-Hilfe.",
    },
    {
      icon: Sparkles,
      title: "Individuelle PC-Builds",
      text: "Gaming-, Office- und Allround-PCs passend zum Budget – mit ehrlicher Beratung, Teileauswahl und sauberem Zusammenbau.",
      price: "ab 99€",
      details: "Beratung, Zusammenbau, Einrichtung und optional Windows-Setup in einem Paket.",
    },
    {
      icon: Wrench,
      title: "Upgrade & Optimierung",
      text: "SSD, RAM, Kühlung oder Grafikkarte – wir holen mehr aus deinem aktuellen System heraus.",
      price: "ab 49€",
      details: "Perfekt, wenn dein PC nicht komplett neu sein muss, aber deutlich besser laufen soll.",
    },
    {
      icon: ShieldCheck,
      title: "Wartung & Support",
      text: "Regelmäßige Checks, Updates, Reinigung, Hilfe bei Problemen und langfristige Unterstützung im Alltag.",
      price: "auf Anfrage",
      details: "Auch als wiederkehrender Support für Privatkunden oder kleine Unternehmen geeignet.",
    },
  ];

  const highlights = [
    "Persönlicher Ansprechpartner",
    "Moderne, ehrliche Beratung",
    "Faire Preise ohne versteckte Kosten",
    "Für Privatkunden und kleine Unternehmen",
  ];

const reviews = reviewsData;

  const team = [
    {
      name: "Leon Dukart",
      role: "Technik, Beratung & Umsetzung",
      text: "Fokus auf PC-Service, individuelle Builds, saubere Problemlösung und moderne IT-Unterstützung mit echter Praxiserfahrung.",
    },
    {
      name: "Dein Cousin",
      role: "Mitgründer & Support",
      text: "Unterstützt bei Aufbau, Kundenkontakt, Umsetzung und dem gemeinsamen Ausbau von Dukart Systems.",
    },
  ];

  const faqs = [
    {
      question: "Für wen ist Dukart Systems gedacht?",
      answer: "Vor allem für Privatkunden und kleine Unternehmen, die schnelle, ehrliche und moderne Hilfe rund um PCs, Upgrades und Support suchen.",
    },
    {
      question: "Bietet ihr auch individuelle Gaming-PCs an?",
      answer: "Ja. Wir helfen bei der Auswahl der Teile, achten auf dein Budget und bauen den PC passend zu deinen Anforderungen zusammen.",
    },
    {
      question: "Kann ich mich auch nur für eine Beratung melden?",
      answer: "Ja, natürlich. Auch wenn du noch unsicher bist oder erst einmal wissen willst, was für dich Sinn macht, kannst du einfach anfragen.",
    },
    {
      question: "Gibt es auch langfristigen Support?",
      answer: "Ja. Neben einzelnen Aufträgen sind auch Wartung, Unterstützung bei Problemen und laufender Support möglich.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

      <section className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xl font-semibold tracking-wide">Dukart Systems</div>
            <div className="text-sm text-slate-400">PC-Service • Individuelle Builds • Support</div>
          </div>
          <div className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#leistungen" className="transition hover:text-cyan-300">Leistungen</a>
            <a href="#bewertungen" className="transition hover:text-cyan-300">Bewertungen</a>
            <a href="#team" className="transition hover:text-cyan-300">Team</a>
            <a href="#kontakt" className="transition hover:text-cyan-300">Kontakt</a>
          </div>
          <a
            href="#kontakt"
            className="rounded-2xl bg-white px-5 py-2 text-sm font-medium text-slate-950 shadow-lg transition hover:scale-105"
          >
            Anfrage starten
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <div className="mb-4 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300 shadow-lg shadow-cyan-500/10">
              Lokal. Persönlich. Modern.
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
              Starker PC-Service mit{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                richtig gutem Look
              </span>{" "}
              und ehrlicher Beratung.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Dukart Systems hilft bei PC-Builds, Reparaturen, Upgrades und langfristigem Support – modern, verständlich und professionell umgesetzt.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1">
              ✔️ Persönlicher Support
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1">
              ⚡ Schnelle Hilfe
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1">
              💻 Vor Ort & Remote
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#kontakt"
                className="group rounded-2xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 shadow-xl transition hover:scale-105"
              >
                Kostenlose Anfrage starten
                <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#kontakt"
                className="rounded-2xl border border-white/15 px-6 py-3 font-medium text-white transition hover:scale-105 hover:border-cyan-300 hover:text-cyan-300"
              >
                Direkt anfragen
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="relative"
          >
            <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-md">
              <div className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    custom={index + 1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    whileHover={hoverCardSoft.whileHover}
                    transition={hoverCardSoft.transition}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 will-change-transform transition-colors duration-150"
                  >
                    <div className="text-base font-semibold">{item}</div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                whileHover={hoverCardSoft.whileHover}
                transition={hoverCardSoft.transition}
                className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-cyan-100 shadow-lg shadow-cyan-500/10 will-change-transform"
              >
                <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Beliebt</div>
                <div className="mt-2 text-2xl font-bold">PC-Check & Beratung</div>
                <div className="mt-2 text-slate-200">Für langsame PCs, Upgrade-Wünsche oder den Start in einen neuen Build.</div>
                <div className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm">ab 39€</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="leistungen" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Leistungen</h2>
          <p className="mt-3 text-slate-300">
            Beim Scrollen kommen die Inhalte lebendig rein, beim Hovern öffnen sich mehr Details – genau so, wie du es wolltest.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                whileHover={hoverCard.whileHover}
                transition={hoverCard.transition}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl will-change-transform transition-colors duration-150 hover:border-cyan-300/40 hover:bg-white/10 hover:shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/0 via-cyan-400/0 to-cyan-400/10 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{service.text}</p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-cyan-200">
                    <BadgeEuro className="h-4 w-4" />
                    {service.price}
                  </div>

                  <div className="mt-4 max-h-0 overflow-hidden text-sm text-slate-200 opacity-0 transition-all duration-200 group-hover:max-h-24 group-hover:opacity-100">
                    {service.details}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-3xl font-bold sm:text-4xl mb-6"
        >
          Warum Dukart Systems?
        </motion.h2>
              
        <div className="grid gap-6 md:grid-cols-3">
              
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            whileHover={hoverCard.whileHover}
            transition={hoverCard.transition}
            className="rounded-2xl bg-white/5 p-6 border border-white/10 will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
          >
            <h3 className="font-semibold text-lg">Ehrliche Beratung</h3>
            <p className="mt-2 text-slate-300">
              Wir verkaufen dir nichts Unnötiges – nur das, was wirklich Sinn macht.
            </p>
          </motion.div>
              
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            whileHover={hoverCard.whileHover}
            transition={hoverCard.transition}
            className="rounded-2xl bg-white/5 p-6 border border-white/10 will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
          >
            <h3 className="font-semibold text-lg">Schnelle Umsetzung</h3>
            <p className="mt-2 text-slate-300">
              Kein wochenlanges Warten – wir kümmern uns schnell um dein Problem.
            </p>
          </motion.div>
              
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            whileHover={hoverCard.whileHover}
            transition={hoverCard.transition}
            className="rounded-2xl bg-white/5 p-6 border border-white/10 will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
          >
            <h3 className="font-semibold text-lg">Persönlicher Kontakt</h3>
            <p className="mt-2 text-slate-300">
              Kein Callcenter – du sprichst direkt mit uns.
            </p>
          </motion.div>
              
        </div>
      </section>

      <section id="team" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Das Team hinter Dukart Systems</h2>
          <p className="mt-3 text-slate-300">Persönlich, nahbar und trotzdem professionell – das schafft direkt Vertrauen.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              custom={index + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={hoverCard.whileHover}
              transition={hoverCard.transition}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
            >
              <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-semibold">{member.name}</h3>
              <div className="mt-1 text-cyan-300">{member.role}</div>
              <p className="mt-4 text-slate-300">{member.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="kontakt" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-bold sm:text-4xl">Kontakt</h2>
            <p className="mt-4 max-w-xl text-slate-300">
              Schreib uns für einen neuen PC, ein Upgrade, eine Reparatur oder eine allgemeine Anfrage. Schnell, direkt und ohne Umwege.
            </p>

            <div className="mt-8 space-y-4 text-slate-200">
              <div>
                <div className="text-sm text-slate-400">E-Mail</div>
                <div className="font-medium">kontakt@dukart-systems.de</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Telefon / WhatsApp</div>
                <div className="font-medium">+49 0000 000000</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Antwortzeit</div>
                <div className="font-medium">In der Regel sehr schnell</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" as const }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input
                  type="text"
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">E-Mail oder WhatsApp</label>
                <input
                  type="text"
                  placeholder="Wie können wir dich erreichen?"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Worum geht es?</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                >
                  <option>PC-Service & Reparatur</option>
                  <option>Individueller PC-Build</option>
                  <option>Upgrade & Optimierung</option>
                  <option>Wartung & Support</option>
                  <option>Allgemeine Anfrage</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Nachricht</label>
                <textarea
                  rows={5}
                  placeholder="Beschreibe kurz dein Anliegen"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                />
              </div>
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 shadow-xl transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Wird gesendet..." : "Anfrage absenden"}
              </button>
              
              {success && (
                <p className="text-sm text-green-400">
                  Anfrage erfolgreich gesendet.
                </p>
              )}
              
              {error && (
                <p className="text-sm text-red-400">
                  {error}
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Häufige Fragen</h2>
          <p className="mt-3 text-slate-300">Ein FAQ-Bereich macht die Seite vollständiger und nimmt Kunden direkt erste Unsicherheiten ab.</p>
        </motion.div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              custom={index + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{
                type: "tween",
                duration: 0.14,
                ease: "easeOut",
              }}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <p className="mt-3 text-slate-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="bewertungen" className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Bewertungen</h2>
          <p className="mt-3 text-slate-300">
            Echte freigegebene Bewertungen von Kunden.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={index}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                whileHover={hoverCard.whileHover}
                transition={hoverCard.transition}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl will-change-transform transition-colors duration-150 hover:border-cyan-300/30"
              >
                <div className="mb-4 flex gap-1 text-cyan-300">
                  {[...Array(Number(review.rating) || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-200">“{review.text}”</p>
                <div className="mt-5 text-sm font-semibold text-slate-400">
                  {review.name}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-300">
              Noch keine freigegebenen Bewertungen vorhanden.
            </div>
          )}
        </div>
      </section>

      <section id="bewertung-abgeben" className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <h2 className="text-3xl font-bold sm:text-4xl">Bewertung abgeben</h2>
          <p className="mt-3 text-slate-300">
            Du warst zufrieden? Dann freuen wir uns über deine Bewertung.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleReviewSubmit}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Name</label>
              <input
                type="text"
                placeholder="Dein Name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Sterne</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              >
                <option value="5">5 Sterne</option>
                <option value="4">4 Sterne</option>
                <option value="3">3 Sterne</option>
                <option value="2">2 Sterne</option>
                <option value="1">1 Stern</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Bewertung</label>
              <textarea
                rows={5}
                placeholder="Wie war deine Erfahrung mit Dukart Systems?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="w-full rounded-2xl bg-cyan-300 px-6 py-3 font-medium text-slate-950 shadow-xl transition hover:scale-[1.02] disabled:opacity-60"
            >
              {reviewLoading ? "Wird gesendet..." : "Bewertung absenden"}
            </button>

            {reviewSuccess && (
              <p className="text-sm text-green-400">
                Bewertung erfolgreich gesendet.
              </p>
            )}

            {reviewError && (
              <p className="text-sm text-red-400">
                {reviewError}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-400">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>© 2026 Dukart Systems. Alle Rechte vorbehalten.</div>
            <div className="flex flex-wrap gap-4">
              <a href="/impressum" className="transition hover:text-cyan-300">Impressum</a>
              <a href="/datenschutz" className="transition hover:text-cyan-300">Datenschutz</a>
              <a href="#kontakt" className="transition hover:text-cyan-300">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
      <a
        href="https://wa.me/4917670520673?text=Hallo%20Dukart%20Systems,%20ich%20habe%20eine%20Anfrage."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Per WhatsApp schreiben"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-3 rounded-full border border-green-400/30 bg-green-500/90 px-5 py-3 text-white shadow-2xl backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-green-500">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs text-white/80">Schnell erreichbar</div>
            <div className="text-sm font-semibold">Per WhatsApp schreiben</div>
          </div>
        </div>
      </a>
    </div>
  );
}
