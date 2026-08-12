"use client";

import { useState } from "react";
import { useCSV } from "@/components/charts/useCSV";
import ChartCard from "@/components/charts/ChartCard";
import DistrictChoropleth from "@/components/charts/DistrictChoropleth";
import DownloadCSVButton from "@/components/charts/DownloadCSVButton";
import {
  DISTRICT_INDICATORS,
  getDistrictIndicator,
  type DistrictIndicatorKey,
  type DistrictRow,
} from "@/components/charts/districtIndicators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { parseNumber, formatFrench } from "@/components/charts/transformCSV";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/components/charts/chartColors";
import ChartTooltip from "@/components/charts/ChartTooltip";
import IndicatorInfoButton from "@/components/dashboard/onp/IndicatorInfoButton";

export default function DistrictsTab() {
  const { data, isLoading } = useCSV<DistrictRow>(
    "/data/onp/districts_snapshot_2021.csv",
  );
  const [barIndicator, setBarIndicator] =
    useState<DistrictIndicatorKey>("population");
  const barCurrent = getDistrictIndicator(barIndicator);
  const isCount = barCurrent.kind === "count";

  // Districts triés (décroissant) selon l'indicateur sélectionné
  const ranked = [...data]
    .filter((d) => d.district !== "National")
    .map((d) => ({
      district: d.district,
      value: parseNumber(d[barIndicator]) ?? 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  // Min / max par colonne d'indicateur (hors ligne « National »)
  const SCORE_COLS: ScoreCol[] = [
    "dependance_eco",
    "qualite_cadre_vie",
    "transition_pauvrete",
    "capital_humain",
    "reseaux_territoires",
    "dividende_demo",
  ];

  const extremes = computeExtremes(data, SCORE_COLS);

  return (
    <>
      <ChartCard
        indicatorId="indicateurs-districts"
        title="Carte des districts"
        subtitle="Choroplèthe interactive des indicateurs de développement par district"
        source="Source : RGPH 2021"
        actions={
          <DownloadCSVButton csvFile="/data/onp/districts_snapshot_2021.csv" />
        }
      >
        <DistrictChoropleth />
      </ChartCard>

      <ChartCard
        indicatorId="population-districts"
        title={`${barCurrent.label} par district`}
        subtitle={
          isCount
            ? "Recensement 2021 · Top des districts par valeur"
            : "Snapshot 2021 · Indice (0 à 1) · Top des districts par valeur"
        }
        source="Source : RGPH 2021 · ONP"
        actions={
          <>
            <Select
              value={barIndicator}
              onValueChange={(v) =>
                setBarIndicator(v as DistrictIndicatorKey)
              }
            >
              <SelectTrigger className="h-8 w-[220px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISTRICT_INDICATORS.map((i) => (
                  <SelectItem key={i.key} value={i.key} className="text-sm">
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DownloadCSVButton csvFile="/data/onp/districts_snapshot_2021.csv" />
          </>
        }
      >
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={ranked}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              strokeOpacity={0.25}
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke={CHART_COLORS.axis}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.grid, strokeOpacity: 0.4 }}
              tickFormatter={(v) =>
                isCount ? `${(v / 1000).toFixed(0)}K` : v.toFixed(2)
              }
            />
            <YAxis
              type="category"
              dataKey="district"
              stroke={CHART_COLORS.axis}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v) =>
                    isCount ? formatFrench(v) : v.toFixed(3)
                  }
                />
              }
              cursor={{ fill: CHART_COLORS.grid, fillOpacity: 0.08 }}
            />
            <Bar
              dataKey="value"
              name={barCurrent.label}
              fill={CHART_COLORS.hommes}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="bg-tile text-tile-foreground border border-tile-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/[0.02] dark:ring-white/[0.03]">
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">
                  Indicateurs synthétiques par district
                </h3>
                <IndicatorInfoButton indicatorId="indicateurs-districts" />
              </div>
              {/* <p className="text-xs text-muted-foreground mt-0.5">
                Snapshot 2021 - Indices de développement durable (0 à 1)
              </p> */}
            </div>
            <DownloadCSVButton csvFile="/data/onp/districts_snapshot_2021.csv" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <Th>District</Th>
                  <Th align="right">Population</Th>
                  <Th align="right">Dép. éco.</Th>
                  <Th align="right">Cadre de vie</Th>
                  <Th align="right">Pauvreté</Th>
                  <Th align="right">Capital hum.</Th>
                  <Th align="right">Territoires</Th>
                  <Th align="right">Dividende dém.</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 text-center text-xs text-muted-foreground"
                    >
                      Chargement…
                    </td>
                  </tr>
                ) : (
                  data.map((row) => {
                    const isNational = row.district === "National";
                    return (
                      <tr
                        key={row.district}
                        className="border-b border-border/60 hover:bg-muted/40"
                      >
                        <td className="py-2.5 px-4 text-foreground font-medium">
                          {row.district}
                        </td>
                        <Td align="right">
                          {formatFrench(parseNumber(row.population) ?? 0)}
                        </Td>
                        {SCORE_COLS.map((col) => (
                          <Td
                            key={col}
                            align="right"
                            extreme={
                              isNational
                                ? undefined
                                : extremeOf(
                                    parseNumber(row[col]),
                                    extremes[col],
                                  )
                            }
                          >
                            {formatScore(row[col])}
                          </Td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function formatScore(value: string): string {
  const n = parseNumber(value);
  return n != null ? n.toFixed(2) : "-";
}

type Extreme = "min" | "max";

/** Colonnes numériques (indices 0–1) éligibles à la coloration min/max. */
type ScoreCol = Exclude<keyof DistrictRow, "district" | "population">;

/** Calcule la valeur min et max de chaque colonne, hors ligne « National ». */
function computeExtremes(
  data: DistrictRow[],
  cols: readonly ScoreCol[],
): Record<string, { min: number; max: number }> {
  const result: Record<string, { min: number; max: number }> = {};
  const districts = data.filter((d) => d.district !== "National");
  for (const col of cols) {
    const values = districts
      .map((d) => parseNumber(d[col]))
      .filter((n): n is number => n != null);
    if (values.length > 0) {
      result[col] = { min: Math.min(...values), max: Math.max(...values) };
    }
  }
  return result;
}

/** Détermine si une valeur correspond au min ou au max de sa colonne. */
function extremeOf(
  value: number | null,
  bounds: { min: number; max: number } | undefined,
): Extreme | undefined {
  if (value == null || bounds == null || bounds.min === bounds.max) {
    return undefined;
  }
  if (value === bounds.max) return "max";
  if (value === bounds.min) return "min";
  return undefined;
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  const cls =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";
  return (
    <th
      className={`py-2.5 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide ${cls}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  extreme,
}: {
  children: React.ReactNode;
  align?: "right" | "center" | "left";
  extreme?: Extreme;
}) {
  const cls =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";
  // Min en vert, max en orange
  const extremeCls =
    extreme === "min"
      ? "font-semibold text-emerald-600 dark:text-emerald-400"
      : extreme === "max"
        ? "font-semibold text-orange-600 dark:text-orange-400"
        : "";
  return (
    <td className={`py-2.5 px-4 text-sm tabular-nums ${cls} ${extremeCls}`}>
      {children}
    </td>
  );
}
