"use client";

import { useState } from "react";
import ChartCard from "@/components/charts/ChartCard";
import IndicatorSwitcher from "@/components/charts/IndicatorSwitcher";
import PopulationPyramid from "@/components/charts/PopulationPyramid";
import CSVBarChart from "@/components/charts/CSVBarChart";
import DownloadCSVButton from "@/components/charts/DownloadCSVButton";
import KPICard from "@/components/charts/KPICard";
import KPICarousel from "@/components/charts/KPICarousel";
import { CHART_COLORS } from "@/components/charts/chartColors";
import { useCSV } from "@/components/charts/useCSV";
import {
  parseNumber,
  formatCompactNumber,
} from "@/components/charts/transformCSV";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";

const RECENSEMENTS = [
  {
    value: "2021",
    label: "RGPH 2021",
    file: "/data/onp/pyramide_ages_2021.csv",
  },
  {
    value: "1998",
    label: "RGPH 1998",
    file: "/data/onp/pyramide_ages_1998.csv",
  },
  {
    value: "1988",
    label: "RGPH 1988",
    file: "/data/onp/pyramide_ages_1988.csv",
  },
] as const;

type PyramideRow = {
  tranche: string;
  hommes: string;
  femmes: string;
  pct_hommes: string;
  pct_femmes: string;
};

export default function PopulationView() {
  const [selectedRgph, setSelectedRgph] = useState<string>("2021");
  const recensement =
    RECENSEMENTS.find((r) => r.value === selectedRgph) ?? RECENSEMENTS[0];

  const { data: pyramideData } = useCSV<PyramideRow>(recensement.file);
  const totalHommes = pyramideData.reduce(
    (acc, r) => acc + (parseNumber(r.hommes) ?? 0),
    0,
  );
  const totalFemmes = pyramideData.reduce(
    (acc, r) => acc + (parseNumber(r.femmes) ?? 0),
    0,
  );
  const total = totalHommes + totalFemmes;

  return (
    <>
      {/* KPIs basés sur le recensement sélectionné */}
      <KPICarousel itemWidth={240}>
        <KPICard
          indicatorId="population-totale"
          label="Population totale"
          value={formatCompactNumber(total, 2)}
          sublabel={recensement.label}
          icon={Users}
        />
        <KPICard
          indicatorId="population-hommes"
          label="Hommes"
          value={formatCompactNumber(totalHommes, 2)}
          sublabel={
            total > 0 ? `${((totalHommes / total) * 100).toFixed(1)}%` : ""
          }
        />
        <KPICard
          indicatorId="population-femmes"
          label="Femmes"
          value={formatCompactNumber(totalFemmes, 2)}
          sublabel={
            total > 0 ? `${((totalFemmes / total) * 100).toFixed(1)}%` : ""
          }
        />
      </KPICarousel>

      {/* Pyramide des âges avec sélecteur recensement */}
      <ChartCard
        indicatorId="pyramide-ages"
        title="Pyramide des âges"
        subtitle={`Part de chaque tranche d'âge (%) - Hommes à gauche, Femmes à droite · ${recensement.label}`}
        source={`Source : ${recensement.label} · ONP`}
        actions={
          <>
            <Select value={selectedRgph} onValueChange={setSelectedRgph}>
              <SelectTrigger className="h-8 text-xs w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECENSEMENTS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DownloadCSVButton csvFile={recensement.file} />
          </>
        }
      >
        <PopulationPyramid
          csvFile={recensement.file}
          ageKey="tranche"
          malesKey="pct_hommes"
          femalesKey="pct_femmes"
          height={520}
          valueSuffix="%"
        />
      </ChartCard>

      {/* Évolution de la population (multi-séries 1975-2021) */}
      <IndicatorSwitcher
        title="Évolution de la population (1975–2021)"
        subtitle="Selon les recensements RGP/RGPH"
        defaultIndicatorId="totale"
        height={300}
        indicators={[
          {
            id: "totale",
            infoId: "population-totale",
            label: "Population totale",
            csvFile: "/data/onp/population_totale_et_croissance.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Population totale",
            xValues: ["RGP_1975", "RGPH_1988", "RGPH_1998", "RGPH_2021"],
            color: CHART_COLORS.total,
            source: "Source : RGP 1975, RGPH 1988, 1998, 2021 · ONP",
          },
          {
            id: "hommes",
            infoId: "population-hommes",
            label: "Population - Hommes",
            csvFile: "/data/onp/population_totale_et_croissance.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Population totale - Hommes",
            xValues: ["RGP_1975", "RGPH_1988", "RGPH_1998", "RGPH_2021"],
            color: CHART_COLORS.hommes,
            source: "Source : RGP 1975, RGPH 1988, 1998, 2021 · ONP",
          },
          {
            id: "femmes",
            infoId: "population-femmes",
            label: "Population - Femmes",
            csvFile: "/data/onp/population_totale_et_croissance.csv",
            layout: "wide",
            seriesColumn: "indicateur",
            matchValue: "Population totale - Femmes",
            xValues: ["RGP_1975", "RGPH_1988", "RGPH_1998", "RGPH_2021"],
            color: CHART_COLORS.femmes,
            source: "Source : RGP 1975, RGPH 1988, 1998, 2021 · ONP",
          },
        ]}
      />

      {/* 2 graphiques côte à côte : structure âge + urbanisation */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartCard
          indicatorId="structure-age"
          title="Structure par âge"
          subtitle="Répartition par grandes tranches selon les recensements"
          source="Source : RGP 1975 → RGPH 2021"
          actions={
            <DownloadCSVButton csvFile="/data/onp/population_indice_structure_age.csv" />
          }
        >
          <CSVBarChart
            csvFile="/data/onp/population_indice_structure_age.csv"
            layout="long"
            xKey="recensement"
            stacked
            yUnit="%"
            series={[
              {
                key: "pct_moins_15_ans",
                label: "< 15 ans",
                color: CHART_COLORS.enfants,
              },
              {
                key: "pct_15_64_ans",
                label: "15–64 ans",
                color: CHART_COLORS.adultes,
              },
              {
                key: "pct_65_ans_et_plus",
                label: "65+ ans",
                color: CHART_COLORS.seniors,
              },
            ]}
            height={320}
          />
        </ChartCard>

        <ChartCard
          indicatorId="urbanisation"
          title="Urbanisation"
          subtitle="Répartition urbain/rural · 2010–2024"
          source="Source : ONP · charts/urbanisation.csv"
          actions={
            <DownloadCSVButton csvFile="/data/onp/charts/urbanisation.csv" />
          }
        >
          <CSVBarChart
            csvFile="/data/onp/charts/urbanisation.csv"
            layout="long"
            xKey="year"
            stacked
            yUnit="%"
            series={[
              { key: "urbain", label: "Urbain", color: CHART_COLORS.urbain },
              { key: "rural", label: "Rural", color: CHART_COLORS.rural },
            ]}
            height={320}
          />
        </ChartCard>
      </div>
    </>
  );
}
