"use client";

import KPICard from "@/components/charts/KPICard";
import KPICarousel from "@/components/charts/KPICarousel";
import IndicatorSwitcher from "@/components/charts/IndicatorSwitcher";
import { CHART_COLORS } from "@/components/charts/chartColors";
import { Heart, Baby, Activity, Users } from "lucide-react";

const ANNEES_3 = ["1988", "1998", "2021"];
const SOURCE_RGPH = "Source : RGPH 1988, 1998, 2021 · ONP";
const ANNEES_SERVICES = [
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
];

export default function SanteView() {
  return (
    <>
      {/* KPIs santé */}
      <KPICarousel itemWidth={240}>
        <KPICard
          indicatorId="isf"
          label="ISF 2021"
          value="4,4"
          sublabel="Enfants par femme"
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
      </KPICarousel>

      {/* Groupe 1 - Indicateurs RGPH 1988-2021 (mêmes repères) */}
      <IndicatorSwitcher
        title="Indicateurs sanitaires nationaux"
        subtitle="Évolution selon les recensements · 1988–2021"
        defaultIndicatorId="esperance-vie"
        height={320}
        indicators={[
          {
            id: "esperance-vie",
            label: "Espérance de vie (Total)",
            unit: " ans",
            csvFile: "/data/onp/sante_esperance_vie_naissance.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Total",
            xValues: ANNEES_3,
            color: CHART_COLORS.hommes,
            source: SOURCE_RGPH,
          },
          {
            id: "isf",
            label: "Indice synthétique de fécondité",
            csvFile: "/data/onp/sante_indice_synthetique_fecondite.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "ISF",
            xValues: ANNEES_3,
            color: CHART_COLORS.adultes,
            source: SOURCE_RGPH,
          },
          {
            id: "mortalite-infantile",
            label: "Mortalité infantile (Total)",
            unit: "‰",
            csvFile: "/data/onp/sante_mortalite_infantile_1q0.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Total",
            xValues: ANNEES_3,
            color: CHART_COLORS.mortalite,
            source: SOURCE_RGPH,
          },
          {
            id: "mortalite-brute",
            label: "Taux brut de mortalité",
            unit: "‰",
            csvFile: "/data/onp/sante_taux_brut_mortalite.csv",
            layout: "wide",
            seriesColumn: "categorie",
            matchValue: "Ensemble",
            xValues: ANNEES_3,
            color: CHART_COLORS.seniors,
            source: SOURCE_RGPH,
          },
        ]}
      />

      {/* Groupe 2 - Indicateurs par sexe (sur les mêmes repères) */}
      <IndicatorSwitcher
        title="Indicateurs sanitaires par sexe"
        subtitle="Comparaison Hommes / Femmes · 1988–2021"
        defaultIndicatorId="esperance-hommes"
        height={300}
        indicators={[
          {
            id: "esperance-hommes",
            label: "Espérance de vie - Hommes",
            unit: " ans",
            csvFile: "/data/onp/sante_esperance_vie_naissance.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Hommes",
            xValues: ANNEES_3,
            color: CHART_COLORS.hommes,
            source: SOURCE_RGPH,
          },
          {
            id: "esperance-femmes",
            label: "Espérance de vie - Femmes",
            unit: " ans",
            csvFile: "/data/onp/sante_esperance_vie_naissance.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Femmes",
            xValues: ANNEES_3,
            color: CHART_COLORS.femmes,
            source: SOURCE_RGPH,
          },
          {
            id: "mortinf-hommes",
            label: "Mortalité infantile - Hommes",
            unit: "‰",
            csvFile: "/data/onp/sante_mortalite_infantile_1q0.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Hommes",
            xValues: ANNEES_3,
            color: CHART_COLORS.hommes,
            source: SOURCE_RGPH,
          },
          {
            id: "mortinf-femmes",
            label: "Mortalité infantile - Femmes",
            unit: "‰",
            csvFile: "/data/onp/sante_mortalite_infantile_1q0.csv",
            layout: "wide",
            seriesColumn: "sexe",
            matchValue: "Femmes",
            xValues: ANNEES_3,
            color: CHART_COLORS.femmes,
            source: SOURCE_RGPH,
          },
          {
            id: "mortbrute-homme",
            label: "Taux brut mortalité - Homme",
            unit: "‰",
            csvFile: "/data/onp/sante_taux_brut_mortalite.csv",
            layout: "wide",
            seriesColumn: "categorie",
            matchValue: "Homme",
            xValues: ANNEES_3,
            color: CHART_COLORS.hommes,
            source: SOURCE_RGPH,
          },
          {
            id: "mortbrute-femme",
            label: "Taux brut mortalité - Femme",
            unit: "‰",
            csvFile: "/data/onp/sante_taux_brut_mortalite.csv",
            layout: "wide",
            seriesColumn: "categorie",
            matchValue: "Femme",
            xValues: ANNEES_3,
            color: CHART_COLORS.femmes,
            source: SOURCE_RGPH,
          },
        ]}
      />

      {/* Groupe 3 - Mortalité maternelle (repères différents : EDS) */}
      <IndicatorSwitcher
        title="Mortalité maternelle"
        subtitle="Évolution sur la période 1994–2021"
        defaultIndicatorId="rmm"
        height={280}
        indicators={[
          {
            id: "rmm",
            infoId: "mortalite-maternelle",
            label: "Rapport de mortalité maternelle (pour 100 000)",
            chartType: "bar",
            csvFile: "/data/onp/sante_mortalite_maternelle.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Rapport de Mortalité Maternelle",
            xValues: ["EDS_1994", "EIS_2005", "EDS_2011_2012", "EDS_2021"],
            color: CHART_COLORS.mortalite,
            source: "Source : EDS 1994, EIS 2005, EDS 2011-2012, EDS 2021",
          },
        ]}
      />

      {/* Groupe 4 - Services de santé 2010-2021 */}
      <IndicatorSwitcher
        title="Services de santé"
        subtitle="Couverture sanitaire annuelle · 2010–2021"
        defaultIndicatorId="ratio-espc"
        height={300}
        indicators={[
          {
            id: "ratio-espc",
            label: "Ratio ESPC-population",
            csvFile: "/data/onp/sante_services_sante_2010_2021.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Ratio ESPC-population",
            xValues: ANNEES_SERVICES,
            color: CHART_COLORS.hommes,
            source: "Source : ONP · sante_services_sante_2010_2021.csv",
          },
          {
            id: "utilisation",
            infoId: "utilisation-services-sante",
            label: "Taux d'utilisation des services de santé",
            unit: "%",
            csvFile: "/data/onp/sante_services_sante_2010_2021.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Taux d'utilisation des services de santé",
            xValues: ANNEES_SERVICES,
            color: CHART_COLORS.adultes,
            source: "Source : ONP · sante_services_sante_2010_2021.csv",
          },
          {
            id: "ratio-hopitaux",
            label: "Ratio Hôpitaux Référence-Population",
            csvFile: "/data/onp/sante_services_sante_2010_2021.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Ratio Hopitaux Reference-Population",
            xValues: ANNEES_SERVICES,
            color: CHART_COLORS.seniors,
            source: "Source : ONP · sante_services_sante_2010_2021.csv",
          },
        ]}
      />
    </>
  );
}
