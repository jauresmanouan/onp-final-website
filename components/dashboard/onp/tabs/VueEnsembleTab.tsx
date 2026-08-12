"use client";

import KPICard from "@/components/charts/KPICard";
import KPICarousel from "@/components/charts/KPICarousel";
import MiniTrendChart from "@/components/charts/MiniTrendChart";
import TrendsSection from "@/components/charts/TrendsSection";
import {
  Users,
  Heart,
  Baby,
  Activity,
  BarChart3,
  Globe,
  Layers,
  Shield,
} from "lucide-react";

/** Extrait l'année complète (4 chiffres) d'une étiquette ex: "RGP_1975" → "1975",
 *  "EDS_2011_2012" → "2012" (dernière année), "2015" → "2015". */
const yearFull = (v: string) => {
  const matches = v.match(/\d{4}/g);
  return matches ? matches[matches.length - 1] : v;
};
const ANNEES_3 = ["1988", "1998", "2021"];
const ANNEES_DD = ["2015", "2016", "2017", "2018", "2019", "2020"];

export default function VueEnsembleTab() {
  return (
    <>
      {/* KPIs sur une seule ligne avec défilement horizontal */}
      <KPICarousel itemWidth={260}>
        <KPICard
          indicatorId="population-totale"
          label="Population totale 2021"
          value="29,4M"
          sublabel="Recensement RGPH 2021"
          icon={Users}
        />
        <KPICard
          indicatorId="esperance-vie"
          label="Espérance de vie"
          value="61,2 ans"
          sublabel="Ensemble · 2021"
          icon={Heart}
        />
        <KPICard
          indicatorId="mortalite-infantile"
          label="Mortalité infantile"
          value="58,5‰"
          sublabel="Pour 1 000 naissances"
          icon={Baby}
        />
        <KPICard
          indicatorId="mortalite-maternelle"
          label="Mortalité maternelle"
          value="385"
          sublabel="Pour 100 000 naissances"
          icon={Activity}
        />
        <KPICard
          indicatorId="ddmi"
          label="DDMI National 2020"
          value="0,399"
          sublabel="Indice multi-dimensionnel"
          icon={BarChart3}
        />
        <KPICard
          indicatorId="idhe"
          label="IDHE National 2020"
          value="0,607"
          sublabel="Développement humain élargi"
          icon={Layers}
        />
        <KPICard
          indicatorId="icde"
          label="ICDE National 2020"
          value="0,142"
          sublabel="Cadre démo-économique"
          icon={Globe}
        />
        <KPICard
          indicatorId="issp"
          label="ISSP National 2020"
          value="0,616"
          sublabel="Stabilité sociale et politique"
          icon={Shield}
        />
      </KPICarousel>

      {/* Section "tendances" style ILO - fond vert clair pastel */}
      <TrendsSection
        title="Aperçu des tendances des indicateurs nationaux"
        tone="white"
        columns={3}
        description="Les indicateurs présentés couvrent la période 1975–2021 selon la disponibilité des recensements (RGP/RGPH) et des enquêtes démographiques (EDS, EIS). Les indices du dividende démographique (DDMI, IDHE, ICDE, ISSP) sont calculés au niveau national entre 2015 et 2020. Les détails par district et par indicateur sont disponibles dans l'onglet Thématiques."
        source="Source : RGPH 1975–2021, EDS 1994–2021, indicateurs DD 2015–2020 · Office National de la Population (ONP)"
      >
        <MiniTrendChart
          indicatorId="population-totale"
          title="Population totale (millions)"
          csvFile="/data/onp/population_totale_et_croissance.csv"
          layout="wide"
          seriesColumn="indicateur"
          matchValue="Population totale"
          xValues={["RGP_1975", "RGPH_1988", "RGPH_1998", "RGPH_2021"]}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="isf"
          title="Indice synthétique de fécondité"
          csvFile="/data/onp/sante_indice_synthetique_fecondite.csv"
          layout="wide"
          seriesColumn="indicateur"
          matchValue="ISF"
          xValues={ANNEES_3}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="esperance-vie"
          title="Espérance de vie à la naissance"
          yUnitSymbol=" ans"
          csvFile="/data/onp/sante_esperance_vie_naissance.csv"
          layout="wide"
          seriesColumn="sexe"
          matchValue="Total"
          xValues={ANNEES_3}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="mortalite-infantile"
          title="Mortalité infantile (1q0)"
          yUnitSymbol="‰"
          csvFile="/data/onp/sante_mortalite_infantile_1q0.csv"
          layout="wide"
          seriesColumn="sexe"
          matchValue="Total"
          xValues={ANNEES_3}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="mortalite-brute"
          title="Taux brut de mortalité"
          yUnitSymbol="‰"
          csvFile="/data/onp/sante_taux_brut_mortalite.csv"
          layout="wide"
          seriesColumn="categorie"
          matchValue="Ensemble"
          xValues={ANNEES_3}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="mortalite-maternelle"
          title="Mortalité maternelle (pour 100 000)"
          csvFile="/data/onp/sante_mortalite_maternelle.csv"
          layout="wide"
          seriesColumn="indicateur"
          matchValue="Rapport de Mortalité Maternelle"
          xValues={["EDS_1994", "EIS_2005", "EDS_2011_2012", "EDS_2021"]}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="ratio-espc"
          title="Ratio ESPC-population"
          csvFile="/data/onp/sante_services_sante_2010_2021.csv"
          layout="wide"
          seriesColumn="indicateur"
          matchValue="Ratio ESPC-population"
          xValues={[
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ]}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="utilisation-services-sante"
          title="Utilisation des services de santé"
          yUnitSymbol="%"
          csvFile="/data/onp/sante_services_sante_2010_2021.csv"
          layout="wide"
          seriesColumn="indicateur"
          matchValue="Taux d'utilisation des services de santé"
          xValues={[
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ]}
          xTickFormatter={yearFull}
        />

        {/* ── Indices du dividende démographique (National · 2015-2020) ── */}
        <MiniTrendChart
          indicatorId="ddmi"
          title="DDMI · Indice multi-dimensionnel"
          csvFile="/data/onp/indicateurs_DD_DDMI.csv"
          layout="wide"
          seriesColumn="district"
          matchValue="National"
          xValues={ANNEES_DD}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="idhe"
          title="IDHE · Capital humain élargi"
          csvFile="/data/onp/indicateurs_DD_IDHE.csv"
          layout="wide"
          seriesColumn="district"
          matchValue="National"
          xValues={ANNEES_DD}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="icde"
          title="ICDE · Cadre démo-économique"
          csvFile="/data/onp/indicateurs_DD_ICDE.csv"
          layout="wide"
          seriesColumn="district"
          matchValue="National"
          xValues={ANNEES_DD}
          xTickFormatter={yearFull}
        />

        <MiniTrendChart
          indicatorId="issp"
          title="ISSP · Stabilité sociale et politique"
          csvFile="/data/onp/indicateurs_DD_ISSP.csv"
          layout="wide"
          seriesColumn="district"
          matchValue="National"
          xValues={ANNEES_DD}
          xTickFormatter={yearFull}
        />
      </TrendsSection>
    </>
  );
}
