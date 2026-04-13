export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <a href="/" className="text-sm text-cyan-300 transition hover:text-cyan-200">
          ← Zurück zur Startseite
        </a>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <h1 className="text-4xl font-bold">Impressum</h1>

          <div className="mt-8 space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white">Angaben gemäß § 5 TMG</h2>
              <p className="mt-3 leading-7">
                <strong className="text-white">Dukart Systems</strong><br />
                Leon Dukart<br />
                [Straße und Hausnummer]<br />
                [PLZ Ort]<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Kontakt</h2>
              <p className="mt-3 leading-7">
                E-Mail: kontakt@dukart-systems.de<br />
                Telefon: [Telefonnummer eintragen]
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
