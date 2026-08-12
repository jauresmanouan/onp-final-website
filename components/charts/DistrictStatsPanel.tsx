"use client";

import { useEffect } from "react";
import { X, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useCSV } from "./useCSV";
import { formatFrench } from "./transformCSV";
import { DISTRICT_INDICATORS, type DistrictRow } from "./districtIndicators";
import {
  DD_SERIES,
  DD_YEARS,
  buildScoreStats,
  buildSerieStat,
  populationShare,
  districtKey,
  type SerieStat,
} from "./districtProfile";
import { CHART_COLORS } from "./chartColors";

type Props = {
  /** District sélectionné sur la carte ; null ferme le panneau. */
  district: string | null;
  /** Le cliché 2021, déjà chargé par la carte : on évite un second appel. */
  rows: DistrictRow[];
  onClose: () => void;
};

/**
 * Fiche d'un district : tout ce que les données ONP contiennent à son sujet,
 * soit le cliché 2021 (population et six scores, chacun situé par rapport aux
 * autres districts) et les six séries du dividende démographique 2015-2020.
 */
export default function DistrictStatsPanel({ district, rows, onClose }: Props) {
  const isOpen = district != null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[1px] transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-label={district ? `Statistiques du district ${district}` : "Statistiques du district"}
        aria-hidden={!isOpen}
        // Sort par la gauche : la droite reste réservée aux fiches de
        // définition des indicateurs, les deux panneaux peuvent coexister.
        className={`fixed left-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-card text-card-foreground border-r border-border shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            District
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Monté seulement à l'ouverture : les six CSV ne partent qu'au besoin */}
        {isOpen && <PanelBody district={district} rows={rows} />}
      </aside>
    </>
  );
}

function PanelBody({ district, rows }: { district: string; rows: DistrictRow[] }) {
  const scores = buildScoreStats(rows, district, DISTRICT_INDICATORS);
  const population = scores.find((s) => s.key === "population");
  const otherScores = scores.filter((s) => s.key !== "population");
  const share = populationShare(rows, district);
  const isKnown = rows.some((r) => districtKey(r.district) === districtKey(district));

  return (
    <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-5 space-y-6">
      <h2 className="font-display text-xl font-bold tracking-tight leading-snug">
        {district}
      </h2>

      {!isKnown ? (
        <p className="text-sm text-muted-foreground">
          Aucune donnée disponible pour ce district.
        </p>
      ) : (
        <>
          {population && (
            <section className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="size-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Population 2021
                </span>
              </div>
              <div className="font-display text-2xl font-bold tabular-nums">
                {formatFrench(population.value)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {share != null && `${share.toFixed(1)} % de la population nationale · `}
                {ordinal(population.rank)} district sur {population.total}
              </p>
            </section>
          )}

          <section>
            <SectionTitle>Indicateurs 2021</SectionTitle>
            <div className="space-y-3.5">
              {otherScores.map((score) => (
                <div key={score.key}>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-sm">{score.label}</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {score.value.toFixed(3)}
                    </span>
                  </div>
                  {/* Position du district sur l'échelle 0-1, moyenne repérée */}
                  <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${clamp(score.value * 100)}%`,
                        backgroundColor: CHART_COLORS.primary,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-muted-foreground">
                      Moyenne des districts : {score.average.toFixed(3)}
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {ordinal(score.rank)} / {score.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Dividende démographique 2015-2020</SectionTitle>
            <div className="space-y-3">
              {DD_SERIES.map((serie) => (
                <SerieRow key={serie.id} serie={serie} district={district} />
              ))}
            </div>
          </section>

          <p className="text-[11px] text-muted-foreground border-t border-border pt-3">
            Source : Office National de la Population, RGPH 2021 et indices du
            dividende démographique.
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Une série annuelle. Le hook CSV a son propre cache, donc les six fichiers
 * ne sont téléchargés qu'une fois pour toute la session.
 */
function SerieRow({
  serie,
  district,
}: {
  serie: (typeof DD_SERIES)[number];
  district: string;
}) {
  const { data, isLoading } = useCSV(serie.file);
  const stat = isLoading ? null : buildSerieStat(data, district, serie);

  if (isLoading) {
    return <div className="h-12 rounded-md bg-muted/50 animate-pulse" />;
  }
  if (!stat) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{stat.label}</span>
          <span className="text-[11px] text-muted-foreground truncate">
            {stat.fullLabel}
          </span>
        </div>
        <Sparkline stat={stat} />
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold tabular-nums">
          {stat.last?.toFixed(3) ?? "-"}
        </div>
        <Change value={stat.change} />
      </div>
    </div>
  );
}

/** Mini-courbe des six années, cadrée sur l'amplitude de la série. */
function Sparkline({ stat }: { stat: SerieStat }) {
  const known = stat.values.filter((v): v is number => v != null);
  if (known.length < 2) return null;

  const min = Math.min(...known);
  const max = Math.max(...known);
  const span = max - min || 1;
  const width = 120;
  const height = 20;

  const points = stat.values
    .map((v, i) => {
      if (v == null) return null;
      const x = (i / (DD_YEARS.length - 1)) * width;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter((p): p is string => p != null)
    .join(" ");

  const rising = (stat.last ?? 0) >= (stat.first ?? 0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="mt-1 overflow-visible"
      role="img"
      aria-label={`Évolution ${DD_YEARS[0]}-${DD_YEARS[DD_YEARS.length - 1]}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={rising ? CHART_COLORS.positive : CHART_COLORS.accent}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Change({ value }: { value: number | null }) {
  if (value == null) {
    return <span className="text-[11px] text-muted-foreground">-</span>;
  }
  const flat = Math.abs(value) < 0.05;
  const Icon = flat ? Minus : value > 0 ? TrendingUp : TrendingDown;
  const tone = flat
    ? "text-muted-foreground"
    : value > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-orange-600 dark:text-orange-400";

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${tone}`}>
      <Icon className="size-3" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)} %
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
      {children}
    </h3>
  );
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** 1er, 2e, 3e… */
function ordinal(rank: number): string {
  return rank === 1 ? "1er" : `${rank}e`;
}
