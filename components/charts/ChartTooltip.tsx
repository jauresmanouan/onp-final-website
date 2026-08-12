"use client";

import { TooltipProps } from "recharts";

type Props = TooltipProps<number, string> & {
  valueSuffix?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
};

export default function ChartTooltip({
  active,
  payload,
  label,
  valueSuffix = "",
  valueFormatter,
  labelFormatter,
}: Props) {
  if (!active || !payload || payload.length === 0) return null;

  const displayLabel = labelFormatter && label != null ? labelFormatter(String(label)) : label;

  return (
    <div
      className="rounded-md border border-border bg-card shadow-md px-3 py-2 text-xs"
      style={{ color: "var(--chart-text)" }}
    >
      <p className="font-medium mb-1">{displayLabel}</p>
      <div className="space-y-0.5">
        {payload.map((entry, i) => {
          const value = entry.value;
          const formatted =
            typeof value === "number"
              ? valueFormatter
                ? valueFormatter(value)
                : value.toLocaleString("fr-FR")
              : String(value);
          return (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium tabular-nums">
                {formatted}
                {valueSuffix}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
