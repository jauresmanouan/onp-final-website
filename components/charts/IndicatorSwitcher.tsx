"use client";

import { useState } from "react";
import ChartCard from "./ChartCard";
import CSVLineChart from "./CSVLineChart";
import CSVBarChart from "./CSVBarChart";
import DownloadCSVButton from "./DownloadCSVButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHART_COLORS } from "./chartColors";

type IndicatorOption = {
  id: string;
  label: string;
  /** Suffixe d'unité affiché sur l'axe Y et dans le tooltip */
  unit?: string;
  /** Type de graphique pour cet indicateur */
  chartType?: "line" | "bar";
  /** Source de données */
  csvFile: string;
  layout: "wide" | "long";
  // Mode wide
  seriesColumn?: string;
  matchValue?: string;
  xValues?: string[];
  // Mode long
  xKey?: string;
  valueKey?: string;
  /** Couleur de la série (défaut primary) */
  color?: string;
  /** Source à afficher en bas du chart */
  source?: string;
  /**
   * Identifiant dans le catalogue ONP_INDICATORS (panneau d'info).
   * Si absent, on utilise `id`.
   */
  infoId?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  indicators: IndicatorOption[];
  /** Indicateur sélectionné par défaut (id) */
  defaultIndicatorId?: string;
  height?: number;
  className?: string;
};

export default function IndicatorSwitcher({
  title,
  subtitle,
  indicators,
  defaultIndicatorId,
  height = 300,
  className,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>(
    defaultIndicatorId ?? indicators[0]?.id ?? ""
  );
  const selected = indicators.find((i) => i.id === selectedId) ?? indicators[0];

  if (!selected) return null;

  const color = selected.color ?? CHART_COLORS.hommes;
  const seriesLabel = selected.label;

  const series = [
    selected.layout === "wide"
      ? { matchValue: selected.matchValue, label: seriesLabel, color }
      : { key: selected.valueKey, label: seriesLabel, color },
  ];

  const ChartComp = selected.chartType === "bar" ? CSVBarChart : CSVLineChart;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      source={selected.source}
      indicatorId={selected.infoId ?? selected.id}
      className={className}
      actions={
        <>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="h-8 text-xs min-w-0 w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((ind) => (
                <SelectItem key={ind.id} value={ind.id} className="text-xs">
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DownloadCSVButton csvFile={selected.csvFile} />
        </>
      }
    >
      <ChartComp
        key={selected.id}
        csvFile={selected.csvFile}
        layout={selected.layout}
        xKey={selected.xKey}
        seriesColumn={selected.seriesColumn}
        xValues={selected.xValues}
        yUnit={selected.unit ?? ""}
        height={height}
        multicolorSingle={selected.chartType === "bar"}
        series={series as never}
      />
    </ChartCard>
  );
}
