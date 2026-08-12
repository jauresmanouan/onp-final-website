"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCSV, type CSVRow } from "./useCSV";
import { parseNumber } from "./transformCSV";
import ChartTooltip from "./ChartTooltip";
import IndicatorInfoButton from "@/components/dashboard/onp/IndicatorInfoButton";

type Props = {
  /** Titre court affiché au-dessus du graphique */
  title: string;
  /** Identifiant de l'indicateur dans le catalogue ONP_INDICATORS, pour afficher le panneau d'information. */
  indicatorId?: string;
  /** Suffixe d'unité (ex: "%", "‰", " ans") affiché à côté de la valeur max sur Y */
  yUnitSymbol?: string;
  /** Couleur de la ligne (défaut bleu marine, comme la maquette ILO) */
  color?: string;
  /** Hauteur du graphique en px */
  height?: number;
  /** Optionnel : zone X mise en évidence (ex: période COVID) */
  highlightX?: { start: string; end: string };

  // ── Source de données (un seul des deux modes ci-dessous) ──
  csvFile: string;
  /** "long" : 1 ligne = 1 point. Préciser xKey + valueKey. */
  layout: "long" | "wide";
  xKey?: string;
  valueKey?: string;
  /** "wide" : 1 ligne = 1 série. Préciser seriesColumn + matchValue + xValues. */
  seriesColumn?: string;
  matchValue?: string;
  xValues?: string[];
  /** Format affiché sur l'axe X - par défaut, conserve la valeur brute. Ex: (v) => `'${v.slice(-2)}` */
  xTickFormatter?: (value: string) => string;
};

const DEFAULT_COLOR = "#22C55E";

export default function MiniTrendChart({
  title,
  indicatorId,
  yUnitSymbol = "",
  color = DEFAULT_COLOR,
  height = 150,
  highlightX,
  csvFile,
  layout,
  xKey,
  valueKey,
  seriesColumn,
  matchValue,
  xValues,
  xTickFormatter,
}: Props) {
  const { data: rawData, isLoading } = useCSV<CSVRow>(csvFile);

  // Construire chartData : [{ x: "1988", value: 55 }, ...]
  let chartData: Array<{ x: string; value: number }> = [];

  if (layout === "long" && xKey && valueKey) {
    chartData = rawData
      .map((row) => {
        const v = parseNumber(row[valueKey]);
        return v != null ? { x: row[xKey] ?? "", value: v } : null;
      })
      .filter((p): p is { x: string; value: number } => p !== null);
  } else if (layout === "wide" && seriesColumn && matchValue) {
    const targetRow = rawData.find((r) => r[seriesColumn] === matchValue);
    if (targetRow) {
      const cols =
        xValues ?? Object.keys(targetRow).filter((c) => c !== seriesColumn);
      chartData = cols
        .map((col) => {
          const v = parseNumber(targetRow[col]);
          return v != null ? { x: col, value: v } : null;
        })
        .filter((p): p is { x: string; value: number } => p !== null);
    }
  }

  const values = chartData.map((d) => d.value);
  const minY = values.length ? Math.min(...values) : 0;
  const maxY = values.length ? Math.max(...values) : 1;
  // Padding pour ne pas que le min/max touchent les bords
  const yPad = (maxY - minY) * 0.15 || 1;
  const yDomain: [number, number] = [
    Math.max(0, Math.floor(minY - yPad)),
    Math.ceil(maxY + yPad),
  ];

  const firstX = chartData[0]?.x ?? "";
  const lastX = chartData[chartData.length - 1]?.x ?? "";

  const lastIndex = chartData.length - 1;

  // Tick X qui aligne le 1er label à gauche et le dernier à droite, afin que les
  // années complètes (ex: 1975, 2021) ne soient pas tronquées aux extrémités.
  const renderXTick = (props: {
    x?: number;
    y?: number;
    payload?: { value: string };
  }) => {
    const { x = 0, y = 0, payload } = props;
    const raw = payload?.value ?? "";
    const label = xTickFormatter ? xTickFormatter(raw) : raw;
    const anchor =
      raw === firstX ? "start" : raw === lastX ? "end" : "middle";
    return (
      <text
        x={x}
        y={y}
        dy={12}
        textAnchor={anchor}
        fill="var(--chart-text)"
        fontSize={11}
      >
        {label}
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2 min-h-[2.5rem]">
        <h3 className="text-sm font-semibold text-tile-foreground leading-snug">
          {title}
        </h3>
        {indicatorId && (
          <IndicatorInfoButton
            indicatorId={indicatorId}
            className="mt-0.5 shrink-0"
          />
        )}
      </div>

      <div className="relative">
        {/* Étiquette de l'axe Y (max + unité) en haut à gauche */}
        <div className="absolute left-0 top-0 text-[11px] font-medium text-tile-muted z-10">
          {Math.round(yDomain[1])}
          {yUnitSymbol}
        </div>

        {isLoading || chartData.length === 0 ? (
          <div
            className="w-full bg-muted/30 rounded animate-pulse"
            style={{ height }}
          />
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData}
              margin={{ top: 18, right: 6, left: 0, bottom: 6 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                stroke="currentColor"
                strokeOpacity={0.08}
                vertical={false}
              />
              <XAxis
                dataKey="x"
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                ticks={[firstX, lastX]}
                interval={0}
                tick={renderXTick}
              />
              <YAxis
                domain={yDomain}
                ticks={[yDomain[0]]}
                stroke="currentColor"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--chart-text)" }}
                width={28}
              />
              {highlightX && (
                <ReferenceArea
                  x1={highlightX.start}
                  x2={highlightX.end}
                  fill="#EF4444"
                  fillOpacity={0.08}
                  stroke="none"
                />
              )}
              <Tooltip
                content={
                  <ChartTooltip
                    valueSuffix={yUnitSymbol}
                    labelFormatter={xTickFormatter}
                  />
                }
                cursor={{
                  stroke: "currentColor",
                  strokeOpacity: 0.25,
                  strokeDasharray: "3 3",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name={title}
                stroke={color}
                strokeWidth={2.5}
                dot={({ cx, cy, index }) =>
                  index === lastIndex ? (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={color}
                      stroke={color}
                    />
                  ) : (
                    <g key={`dot-empty-${index}`} />
                  )
                }
                activeDot={{ r: 5, fill: color, stroke: color, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
