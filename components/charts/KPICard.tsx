import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import IndicatorInfoButton from "@/components/dashboard/onp/IndicatorInfoButton";

type Trend = {
  direction: "up" | "down" | "flat";
  value: number;
  period?: string;
};

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  icon?: LucideIcon;
  trend?: Trend;
  /** Identifiant de l'indicateur dans le catalogue ONP_INDICATORS, pour afficher le panneau d'information. */
  indicatorId?: string;
};

export default function KPICard({ label, value, sublabel, trend, indicatorId }: Props) {
  return (
    <Card className="bg-tile border-tile-border text-tile-foreground">
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-tile-muted uppercase tracking-wide">
            {label}
          </p>
          {indicatorId && <IndicatorInfoButton indicatorId={indicatorId} />}
        </div>
        <div className="font-display text-3xl font-bold text-tile-foreground leading-tight">
          {value}
        </div>
        {sublabel && (
          <p className="text-xs text-tile-muted mt-1">{sublabel}</p>
        )}
        {trend && (
          <p
            className={`text-xs mt-1 font-medium ${
              trend.direction === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trend.direction === "down"
                ? "text-red-600 dark:text-red-400"
                : "text-muted-foreground"
            }`}
          >
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{" "}
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.period && <span className="text-muted-foreground">{trend.period}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
