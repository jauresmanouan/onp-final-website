"use client";

import { useState } from "react";
import KPICard from "@/components/charts/KPICard";
import KPICarousel from "@/components/charts/KPICarousel";
import ChartCard from "@/components/charts/ChartCard";
import IndicatorSwitcher from "@/components/charts/IndicatorSwitcher";
import DownloadCSVButton from "@/components/charts/DownloadCSVButton";
import ChartTooltip from "@/components/charts/ChartTooltip";
import FigureGrandEcran from "@/components/dashboard/onp/FigureGrandEcran";
import { useCSV } from "@/components/charts/useCSV";
import { parseNumber } from "@/components/charts/transformCSV";
import { CHART_COLORS } from "@/components/charts/chartColors";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Activity, Users, Globe } from "lucide-react";

// ── Métadonnées des 6 indices DD ──
const INDICES = [
  {
    value: "DDMI",
    label: "DDMI · Indice multi-dimensionnel",
    file: "/data/onp/indicateurs_DD_DDMI.csv",
  },
  {
    value: "ICDE",
    label: "ICDE · Cadre démo-économique",
    file: "/data/onp/indicateurs_DD_ICDE.csv",
  },
  {
    value: "IDHE",
    label: "IDHE · Développement humain élargi",
    file: "/data/onp/indicateurs_DD_IDHE.csv",
  },
  {
    value: "IQCV",
    label: "IQCV · Qualité du cadre de vie",
    file: "/data/onp/indicateurs_DD_IQCV.csv",
  },
  {
    value: "ISRT",
    label: "ISRT · Réseaux et territoires",
    file: "/data/onp/indicateurs_DD_ISRT.csv",
  },
  {
    value: "ISSP",
    label: "ISSP · Stabilité sociale et politique",
    file: "/data/onp/indicateurs_DD_ISSP.csv",
  },
] as const;

const ANNEES = ["2015", "2016", "2017", "2018", "2019", "2020"];

type DDRow = {
  district: string;
  "2015": string;
  "2016": string;
  "2017": string;
  "2018": string;
  "2019": string;
  "2020": string;
};

export default function DividendeDemoView() {
  return (
    <>
      <KPIsNationaux />
      <IndicateursNationauxSynthetiques />
      <EvolutionNationaleParIndice />
      <ClassementDistricts />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// 1. KPIs : DDMI 2020, tendance, IDHE 2020, ICDE 2020
// ──────────────────────────────────────────────────────────────────
function KPIsNationaux() {
  const { data: ddmi } = useCSV<DDRow>("/data/onp/indicateurs_DD_DDMI.csv");
  const { data: idhe } = useCSV<DDRow>("/data/onp/indicateurs_DD_IDHE.csv");
  const { data: icde } = useCSV<DDRow>("/data/onp/indicateurs_DD_ICDE.csv");

  const ddmiNat = ddmi.find((r) => r.district === "National");
  const idheNat = idhe.find((r) => r.district === "National");
  const icdeNat = icde.find((r) => r.district === "National");

  const ddmi2015 = parseNumber(ddmiNat?.["2015"]);
  const ddmi2020 = parseNumber(ddmiNat?.["2020"]);
  const variation =
    ddmi2015 != null && ddmi2020 != null && ddmi2015 !== 0
      ? ((ddmi2020 - ddmi2015) / ddmi2015) * 100
      : null;

  return (
    <KPICarousel itemWidth={240}>
      <KPICard
        indicatorId="ddmi"
        label="DDMI National 2020"
        value={ddmi2020 != null ? ddmi2020.toFixed(3) : "-"}
        sublabel="Indice multi-dimensionnel (0 à 1)"
        icon={Activity}
      />
      <KPICard
        indicatorId="evolution-ddmi"
        label="Évolution 2015 → 2020"
        value={
          variation != null
            ? `${variation > 0 ? "+" : ""}${variation.toFixed(1)}%`
            : "-"
        }
        sublabel="Variation du DDMI national"
        icon={TrendingUp}
      />
      <KPICard
        indicatorId="idhe"
        label="IDHE National 2020"
        value={parseNumber(idheNat?.["2020"])?.toFixed(3) ?? "-"}
        sublabel="Développement humain élargi"
        icon={Users}
      />
      <KPICard
        indicatorId="icde"
        label="ICDE National 2020"
        value={parseNumber(icdeNat?.["2020"])?.toFixed(3) ?? "-"}
        sublabel="Cadre démo-économique"
        icon={Globe}
      />
    </KPICarousel>
  );
}

// ──────────────────────────────────────────────────────────────────
// 2. Bar chart groupé : 5 indicateurs × 2 périodes (2015-2017 vs 2018-2020)
// ──────────────────────────────────────────────────────────────────
type DiagRow = {
  indicateur: string;
  "2015_2017": string;
  "2018_2020": string;
};

function IndicateursNationauxSynthetiques() {
  const { data, isLoading } = useCSV<DiagRow>(
    "/data/onp/indicateurs_national_diag.csv",
  );

  const chartData = data.map((r) => ({
    x: r.indicateur,
    "2015–2017": parseNumber(r["2015_2017"]) ?? 0,
    "2018–2020": parseNumber(r["2018_2020"]) ?? 0,
  }));

  return (
    <ChartCard
      indicatorId="indicateurs-nationaux-synthetiques"
      title="Indicateurs nationaux synthétiques"
      subtitle="5 piliers du dividende démographique - 2 périodes"
      source="Source : indicateurs_national_diag.csv · ONP"
      actions={
        <DownloadCSVButton csvFile="/data/onp/indicateurs_national_diag.csv" />
      }
    >
      <FigureGrandEcran quoi="Ces cinq piliers comparés">
        {isLoading || chartData.length === 0 ? (
          <div className="h-[340px] bg-muted/30 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="x"
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.4 }}
                angle={-25}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, "dataMax + 0.1"]}
              />
              <Tooltip
                content={<ChartTooltip valueFormatter={(v) => v.toFixed(3)} />}
                cursor={{ fill: CHART_COLORS.grid, fillOpacity: 0.1 }}
              />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
                align="left"
                verticalAlign="top"
              />
              <Bar
                dataKey="2015–2017"
                fill={CHART_COLORS.adultes}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="2018–2020"
                fill={CHART_COLORS.hommes}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </FigureGrandEcran>
    </ChartCard>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3. IndicatorSwitcher : 6 indices DD au niveau National (2015-2020)
// ──────────────────────────────────────────────────────────────────
function EvolutionNationaleParIndice() {
  return (
    <IndicatorSwitcher
      title="Évolution nationale par indice"
      subtitle="Indices du dividende démographique · 2015–2020"
      defaultIndicatorId="DDMI"
      height={300}
      indicators={INDICES.map((idx) => ({
        id: idx.value,
        infoId: idx.value.toLowerCase(),
        label: idx.label,
        csvFile: idx.file,
        layout: "wide" as const,
        seriesColumn: "district",
        matchValue: "National",
        xValues: ANNEES,
        color: CHART_COLORS.hommes,
        source: `Source : ${idx.value} National 2015–2020 · ONP`,
      }))}
    />
  );
}

// ──────────────────────────────────────────────────────────────────
// 4. Bar horizontal : classement des districts pour un indice donné (2020)
// ──────────────────────────────────────────────────────────────────
function ClassementDistricts() {
  const [selectedIndex, setSelectedIndex] = useState<string>("DDMI");
  const current = INDICES.find((i) => i.value === selectedIndex) ?? INDICES[0];

  const { data, isLoading } = useCSV<DDRow>(current.file);

  const ranking = data
    .filter((r) => r.district !== "National")
    .map((r) => ({
      district: r.district,
      value: parseNumber(r["2020"]) ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const nationalValue = parseNumber(
    data.find((r) => r.district === "National")?.["2020"],
  );

  return (
    <ChartCard
      indicatorId="classement-districts"
      title="Classement des districts en 2020"
      subtitle={`Score de l'indice sélectionné par district${
        nationalValue != null ? ` · National : ${nationalValue.toFixed(3)}` : ""
      }`}
      source={`Source : ${current.value} 2020 · ONP`}
      actions={
        <>
          <Select value={selectedIndex} onValueChange={setSelectedIndex}>
            <SelectTrigger className="h-8 text-xs min-w-0 w-full sm:w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDICES.map((idx) => (
                <SelectItem
                  key={idx.value}
                  value={idx.value}
                  className="text-xs"
                >
                  {idx.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DownloadCSVButton csvFile={current.file} />
        </>
      }
    >
      <FigureGrandEcran quoi="Ce classement par district">
        {isLoading || ranking.length === 0 ? (
          <div className="h-[420px] bg-muted/30 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={ranking}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                strokeOpacity={0.25}
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 1]}
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.4 }}
                tickFormatter={(v) => v.toFixed(1)}
              />
              <YAxis
                type="category"
                dataKey="district"
                stroke={CHART_COLORS.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                content={<ChartTooltip valueFormatter={(v) => v.toFixed(3)} />}
                cursor={{ fill: CHART_COLORS.grid, fillOpacity: 0.08 }}
              />
              <Bar
                dataKey="value"
                name={current.value}
                fill={CHART_COLORS.hommes}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </FigureGrandEcran>
    </ChartCard>
  );
}
