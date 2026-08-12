import type { Metadata } from "next";
import Image from "next/image";
import DashboardCTA from "@/components/accueil/DashboardCTA";

export const metadata: Metadata = {
  title: "ONP — Office National de la Population",
  description:
    "Accédez aux données et indicateurs officiels de population de Côte d'Ivoire.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Image
            src="/onp_logo_vf.png"
            alt="Logo ONP"
            width={176}
            height={144}
            className="h-14 w-auto rounded-md object-contain"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Office National de la Population
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline">
              Observatoire Gouvernemental des Données de Population et du
              Dividende Démographique
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Données officielles · Côte d&apos;Ivoire
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Banque de données
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">
              démographiques
            </span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Explorez les indicateurs officiels de population de Côte
            d&apos;Ivoire — pyramides des âges, santé, dividende
            démographique — au niveau national et par district.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <DashboardCTA />
          </div>
        </div>

        {/* Feature cards */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: "🗺️",
              title: "Cartographie interactive",
              desc: "Visualisez les indicateurs par district sur une carte choroplèthe de la Côte d'Ivoire.",
            },
            {
              icon: "📊",
              title: "Indicateurs thématiques",
              desc: "Population, santé, dividende démographique — organisés par thématique et niveau géographique.",
            },
            {
              icon: "📥",
              title: "Données téléchargeables",
              desc: "Exportez les données au format CSV pour vos propres analyses et publications.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-2"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {f.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 px-6 py-5 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} Office National de la Population — Côte d&apos;Ivoire
      </footer>
    </div>
  );
}
