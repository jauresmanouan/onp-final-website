"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Check } from "lucide-react";
import VueEnsembleTab from "./tabs/VueEnsembleTab";
import { IndicatorInfoProvider } from "./IndicatorInfoContext";
import IndicatorInfoPanel from "./IndicatorInfoPanel";
import IndicatorPanelBridge from "./IndicatorPanelBridge";
import ConseilGrandEcran from "./ConseilGrandEcran";
import { CHIFFRES } from "@/content/site/destinations";
import {
  SqueletteDistricts,
  SquelettePopulation,
  SqueletteSante,
  SqueletteDividende,
} from "./SquelettesOnglets";

// Chaque onglet a son propre squelette, taillé à la hauteur de son contenu :
// un gabarit générique plus court faisait sauter la page au chargement.
const DistrictsTab = dynamic(() => import("./tabs/DistrictsTab"), {
  loading: SqueletteDistricts,
});
const PopulationView = dynamic(() => import("./thematiques/PopulationView"), {
  loading: SquelettePopulation,
});
const SanteView = dynamic(() => import("./thematiques/SanteView"), {
  loading: SqueletteSante,
});
const DividendeDemoView = dynamic(
  () => import("./thematiques/DividendeDemoView"),
  { loading: SqueletteDividende },
);

const THEMATIQUES = [
  { value: "population", label: "Population" },
  { value: "sante", label: "Santé" },
  { value: "dividende-demo", label: "Dividende démographique" },
] as const;

const TAB_VALUES = [
  "vue-ensemble",
  "districts",
  "population",
  "sante",
  "dividende-demo",
] as const;

type TabValue = (typeof TAB_VALUES)[number];

function isValidTab(v: string): v is TabValue {
  return (TAB_VALUES as readonly string[]).includes(v);
}

export default function ONPDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>("vue-ensemble");
  const [openThematique, setOpenThematique] = useState(false);

  // Synchroniser l'onglet avec le hash de l'URL (#districts, #population, etc.)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (isValidTab(hash)) setActiveTab(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Mettre à jour le hash quand l'onglet change (sans déclencher de scroll)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = `#${activeTab}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [activeTab]);

  // Recherche d'indicateur (barre de la navbar) : basculer sur le bon onglet.
  // L'ouverture de la fiche est gérée par IndicatorPanelBridge (dans le provider).
  useEffect(() => {
    const onOpenIndicator = (e: Event) => {
      const tab = (e as CustomEvent<{ id: string; tab: string }>).detail?.tab;
      if (tab && isValidTab(tab)) setActiveTab(tab);
    };
    window.addEventListener("onp:open-indicator", onOpenIndicator);
    return () =>
      window.removeEventListener("onp:open-indicator", onOpenIndicator);
  }, []);

  const isThematique = THEMATIQUES.some((t) => t.value === activeTab);
  const currentThematique = THEMATIQUES.find((t) => t.value === activeTab);

  return (
    <IndicatorInfoProvider>
      <div className="max-w-7xl mx-auto px-6 lg:px-20 xl:px-40 py-8">
        <ConseilGrandEcran />

        {/* Titre de page */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-panel-foreground">
            {CHIFFRES.nom}
          </h1>
          <p className="text-sm text-panel-foreground/80 mt-1">
            Indicateurs nationaux de population - Côte d&apos;Ivoire · 1975–2021
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
          className="space-y-6"
        >
          {/* Sur téléphone les trois onglets et le nom de la thématique
            * dépassent la largeur : la barre défile plutôt que de pousser la
            * page à défiler de côté. */}
          <TabsList className="h-9 gap-1 bg-panel text-panel-foreground max-w-full justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsTrigger
              value="vue-ensemble"
              className="text-xs text-panel-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Vue d&apos;ensemble
            </TabsTrigger>
            <TabsTrigger
              value="districts"
              className="text-xs text-panel-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              Districts
            </TabsTrigger>

            {/* "Thématiques" comme dropdown - styling aligné avec TabsTrigger */}
            <Popover open={openThematique} onOpenChange={setOpenThematique}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  data-state={isThematique ? "active" : "inactive"}
                  className="inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] cursor-pointer text-panel-foreground data-[state=active]:shadow-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Thématiques
                  {currentThematique && (
                    <span className="hidden sm:inline opacity-80">
                      · {currentThematique.label}
                    </span>
                  )}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1">
                {THEMATIQUES.map((t) => {
                  const isActive = activeTab === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        setActiveTab(t.value);
                        setOpenThematique(false);
                      }}
                      className={`grid w-full grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-left transition-colors cursor-pointer ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        {isActive && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          </TabsList>

          <TabsContent value="vue-ensemble" className="space-y-6">
            <VueEnsembleTab />
          </TabsContent>
          <TabsContent value="districts" className="space-y-6">
            <DistrictsTab />
          </TabsContent>
          <TabsContent value="population" className="space-y-6">
            <PopulationView />
          </TabsContent>
          <TabsContent value="sante" className="space-y-6">
            <SanteView />
          </TabsContent>
          <TabsContent value="dividende-demo" className="space-y-6">
            <DividendeDemoView />
          </TabsContent>
        </Tabs>
      </div>
      <IndicatorInfoPanel />
      <IndicatorPanelBridge />
    </IndicatorInfoProvider>
  );
}
