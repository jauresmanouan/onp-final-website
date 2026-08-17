"use client";

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
import { useCSV, type CSVRow } from "./useCSV";
import { parseNumber } from "./transformCSV";
import ChartTooltip from "./ChartTooltip";
import { CHART_COLORS } from "./chartColors";
import EtatFigure from "./EtatFigure";

type Props = {
  csvFile: string;
  /** Colonne contenant les tranches d'âge (ex: "tranche") */
  ageKey: string;
  /** Colonne valeur hommes (peut être nb absolu ou %) */
  malesKey: string;
  /** Colonne valeur femmes */
  femalesKey: string;
  malesColor?: string;
  femalesColor?: string;
  malesLabel?: string;
  femalesLabel?: string;
  height?: number;
  /** Suffixe affiché dans le tooltip */
  valueSuffix?: string;
};

export default function PopulationPyramid({
  csvFile,
  ageKey,
  malesKey,
  femalesKey,
  malesColor = CHART_COLORS.hommes,
  femalesColor = CHART_COLORS.femmes,
  malesLabel = "Hommes",
  femalesLabel = "Femmes",
  height = 480,
  valueSuffix = "%",
}: Props) {
  const { data: rawData, isLoading, error } = useCSV<CSVRow>(csvFile);

  if (isLoading) return <PyramidSkeleton height={height} />;
  if (error || rawData.length === 0) {
    return (
      <EtatFigure
        variante={error ? "erreur" : "vide"}
        hauteur={height}
        quoi="La pyramide des âges"
      />
    );
  }

  // Préparer : hommes en valeurs négatives (gauche), femmes positives (droite)
  // Inverser l'ordre pour avoir 85+ en haut
  const chartData = rawData
    .map((row) => {
      const males = parseNumber(row[malesKey]) ?? 0;
      const females = parseNumber(row[femalesKey]) ?? 0;
      return {
        tranche: row[ageKey] ?? "",
        [malesLabel]: -males,
        [femalesLabel]: females,
        _malesAbs: males,
        _femalesAbs: females,
      };
    })
    .reverse();

  const max = Math.max(
    ...chartData.map((d) => Math.max(Math.abs(d[malesLabel] as number), d[femalesLabel] as number))
  );

  return (
    <ResponsiveContainer width="100%" height={height} >
      <BarChart
        data={chartData}
        layout="vertical"
        stackOffset="sign"
        margin={{ top: 8, right: 16, left: 16, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} strokeOpacity={0.25} horizontal={false} />
        <XAxis
          type="number"
          domain={[-max, max]}
          tickFormatter={(v) => `${Math.abs(v)}${valueSuffix}`}
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.4 }}
        />
        <YAxis
          type="category"
          dataKey="tranche"
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip
          content={
            <ChartTooltip
              valueSuffix={valueSuffix}
              valueFormatter={(v) => Math.abs(v).toLocaleString("fr-FR")}
            />
          }
          cursor={{ fill: CHART_COLORS.grid, fillOpacity: 0.1 }}
        />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          align="center"
          verticalAlign="top"
        />
        <Bar dataKey={malesLabel} fill={malesColor} stackId="stack" radius={[0, 0, 0, 0]} />
        <Bar dataKey={femalesLabel} fill={femalesColor} stackId="stack" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function PyramidSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full bg-muted/40 rounded animate-pulse flex items-center justify-center text-xs text-muted-foreground"
      style={{ height }}
    >
      Chargement de la pyramide…
    </div>
  );
}

