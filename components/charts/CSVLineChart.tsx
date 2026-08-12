"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCSV, type CSVRow } from "./useCSV";
import { wideToLong, parseNumber } from "./transformCSV";
import ChartTooltip from "./ChartTooltip";
import { CHART_COLORS } from "./chartColors";

type LineSeries = {
  /** Pour layout="long" : nom de la colonne */
  key?: string;
  /** Pour layout="wide" : valeur dans la colonne `seriesColumn` qui identifie la série */
  matchValue?: string;
  /** Label affiché dans la légende */
  label: string;
  color: string;
  dashed?: boolean;
  dotted?: boolean;
};

type Props = {
  csvFile: string;
  /** "long" : 1 ligne = 1 point. "wide" : 1 ligne = 1 série, à transposer. */
  layout: "long" | "wide";
  /** Pour layout="long" : nom de la colonne X */
  xKey?: string;
  /** Pour layout="wide" : nom de la colonne contenant les labels de série */
  seriesColumn?: string;
  /** Pour layout="wide" : ordre des colonnes utilisées comme axe X (par défaut toutes sauf seriesColumn) */
  xValues?: string[];
  series: LineSeries[];
  yLabel?: string;
  yUnit?: string;
  height?: number;
};

export default function CSVLineChart({
  csvFile,
  layout,
  xKey,
  seriesColumn,
  xValues,
  series,
  yUnit = "",
  height = 280,
}: Props) {
  const { data: rawData, isLoading, error } = useCSV<CSVRow>(csvFile);

  if (isLoading) return <ChartSkeleton height={height} />;
  if (error || rawData.length === 0) return <ChartError height={height} />;

  // Préparer les données selon le layout
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
    // Filtrer les lignes selon les matchValues demandées
    const wanted = new Set(series.map((s) => s.matchValue).filter(Boolean));
    const filteredRows = rawData.filter((row) => wanted.has(row[seriesColumn]));
    const transposed = wideToLong(filteredRows, seriesColumn, xValues);
    // Renommer matchValue → label
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

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} strokeOpacity={0.3} />
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
          cursor={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.5 }}
        />
        <Legend
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          align="left"
          verticalAlign="top"
        />
        {series.map((s) => (
          <Line
            key={s.label}
            type="monotone"
            dataKey={s.label}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            strokeDasharray={s.dashed ? "5 5" : s.dotted ? "2 4" : undefined}
            dot={{ r: 3, fill: s.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
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

function ChartError({ height }: { height: number }) {
  return (
    <div
      className="w-full bg-muted/30 rounded flex items-center justify-center text-xs text-muted-foreground"
      style={{ height }}
    >
      Aucune donnée disponible
    </div>
  );
}
