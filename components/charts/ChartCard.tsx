import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import IndicatorInfoButton from "@/components/dashboard/onp/IndicatorInfoButton";

type Props = {
  title: string;
  subtitle?: string;
  source?: string;
  /** Slot d'actions affiché à droite du titre (ex: dropdown, bouton download) */
  actions?: ReactNode;
  /** Identifiant de l'indicateur dans le catalogue ONP_INDICATORS, pour afficher le panneau d'information. */
  indicatorId?: string;
  children: ReactNode;
  className?: string;
};

export default function ChartCard({
  title,
  subtitle,
  source,
  actions,
  indicatorId,
  children,
  className = "bg-tile text-tile-foreground border border-tile-border shadow-md hover:shadow-lg transition-shadow ring-1 ring-black/[0.02] dark:ring-white/[0.03]",
}: Props) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <CardTitle className="font-display text-base font-semibold text-tile-foreground">
              {title}
            </CardTitle>
            {indicatorId && <IndicatorInfoButton indicatorId={indicatorId} />}
          </div>
          {actions && <div className="shrink-0 flex items-center gap-1.5">{actions}</div>}
        </div>
        {subtitle && (
          <p className="text-xs text-tile-muted mt-0.5">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full">{children}</div>
        {source && (
          <p className="text-[11px] text-tile-muted text-right mt-3">
            {source}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
