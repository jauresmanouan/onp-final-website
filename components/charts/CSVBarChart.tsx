"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCSV, type CSVRow } from "./useCSV";
import { wideToLong, parseNumber } from "./transformCSV";
import ChartTooltip from "./ChartTooltip";
import { CHART_COLORS } from "./chartColors";
import EtatFigure from "./EtatFigure";

type BarSeries = {
  key?: string;
  matchValue?: string;
  label: string;
  color: string;
};

type Props = {
  csvFile: string;
  layout: "long" | "wide";
  xKey?: string;
  seriesColumn?: string;
  xValues?: string[];
  series: BarSeries[];
  /** Quand 1 seule série : utilise une couleur différente par barre depuis CHART_COLORS.series */
  multicolorSingle?: boolean;
  stacked?: boolean;
  yUnit?: string;
  height?: number;
};

export default function CSVBarChart({
  csvFile,
  layout,
  xKey,
  seriesColumn,
  xValues,
  series,
  multicolorSingle = false,
  stacked = false,
  yUnit = "",
  height = 280,
}: Props) {
  const { data: rawData, isLoading, error } = useCSV<CSVRow>(csvFile);

  if (isLoading) return <ChartSkeleton height={height} />;
  if (error || rawData.length === 0) {
    return (
      <EtatFigure
        variante={error ? "erreur" : "vide"}
        hauteur={height}
        quoi="Ce graphique"
      />
    );
  }

  let chartData: Array<{ x: string; [k: string]: string | number }> = [];

  if (layout === "long" && xKey) {
    chartData = rawData.map((row) => {
      const point: { x: string; [k: string]: string | number } = { x: row[xKey] ?? "" };
      for (const s of series) {
        if (s.key) {
          const num = parseNumber(row[s.key]);
          if (num != null) point[s.label] = num;
        }
      }
      return point;
    });
  } else if (layout === "wide" && seriesColumn) {
    const wanted = new Set(series.map((s) => s.matchValue).filter(Boolean));
    const filteredRows = rawData.filter((row) => wanted.has(row[seriesColumn]));
    const transposed = wideToLong(filteredRows, seriesColumn, xValues);
    chartData = transposed.map((point) => {
      const renamed: { x: string; [k: string]: string | number } = { x: point.x };
      for (const s of series) {
        if (s.matchValue && point[s.matchValue] != null) {
          renamed[s.label] = point[s.matchValue];
        }
      }
      return renamed;
    });
  }

  const useMulticolor = multicolorSingle && series.length === 1;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} strokeOpacity={0.3} vertical={false} />
        <XAxis
          dataKey="x"
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.4 }}
        />
        <YAxis
          stroke={CHART_COLORS.axis}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}${yUnit}`}
        />
        <Tooltip
          content={<ChartTooltip valueSuffix={yUnit} />}
          cursor={{ fill: CHART_COLORS.grid, fillOpacity: 0.1 }}
        />
        {series.length > 1 && (
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
            align="left"
            verticalAlign="top"
          />
        )}
        {series.map((s) => (
          <Bar
            key={s.label}
            dataKey={s.label}
            name={s.label}
            fill={s.color}
            stackId={stacked ? "a" : undefined}
            radius={[0, 0, 0, 0]}
          >
            {useMulticolor &&
              chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS.series[i % CHART_COLORS.series.length]} />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full bg-muted/40 rounded animate-pulse flex items-center justify-center text-xs text-muted-foreground"
      style={{ height }}
    >
      Chargement…
    </div>
  );
}

