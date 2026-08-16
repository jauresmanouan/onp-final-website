"use client";

import { useMemo, useState } from "react";
import { useCSV } from "./useCSV";
import { parseNumber, formatFrench, formatCompactNumber } from "./transformCSV";
import ChoroplethMap from "./ChoroplethMap";
import FicheDistrict from "./FicheDistrict";
import { quantileScale, type MapScale } from "./mapScale";
import {
  MAP_PALETTES,
  DEFAULT_PALETTE_ID,
  getPalette,
} from "./mapPalettes";
import {
  DISTRICT_INDICATORS,
  getDistrictIndicator,
  type DistrictRow,
  type DistrictIndicatorKey,
} from "./districtIndicators";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Normalise les noms de districts du GeoJSON geoBoundaries (shapeName)
 * vers les noms utilisés dans les données ONP.
 */
const GEO_TO_ONP: Record<string, string> = {
  "District Autonome D'Abidjan": "Abidjan",
  "District Autonome De Yamoussoukro": "Yamoussoukro",
  Denguele: "Denguélé",
  "Sassandra-Marahoue": "Sassandra-Marahoué",
  "Valle Du Bandama": "Vallée du Bandama",
  Comoe: "Comoé",
};

const normalizeName = (raw: string) => GEO_TO_ONP[raw] ?? raw;

export default function DistrictChoropleth() {
  const { data, isLoading } = useCSV<DistrictRow>(
    "/data/onp/districts_snapshot_2021.csv",
  );
  const [indicator, setIndicator] = useState<DistrictIndicatorKey>("population");
  const [paletteId, setPaletteId] = useState<string>(DEFAULT_PALETTE_ID);
  const [selected, setSelected] = useState<string | null>(null);

  const current = getDistrictIndicator(indicator);
  const palette = getPalette(paletteId);

  // Map nom de district → valeur de l'indicateur sélectionné (hors "National")
  const { valueByName, domain } = useMemo(() => {
    const map = new Map<string, number>();
    const values: number[] = [];
    for (const row of data) {
      if (row.district === "National") continue;
      const v = parseNumber(row[indicator]);
      if (v != null) {
        map.set(row.district, v);
        values.push(v);
      }
    }
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 1;
    return { valueByName: map, domain: [min, max] as [number, number] };
  }, [data, indicator]);

  // Classes d'effectifs égaux : voir mapScale.ts pour le pourquoi.
  const scale = useMemo(
    () => quantileScale([...valueByName.values()], palette.ramp),
    [valueByName, palette.ramp],
  );

  const valueFormatter = (v: number) =>
    current.kind === "count" ? formatFrench(v) : v.toFixed(3);

  const legendFormatter = (v: number) =>
    current.kind === "count" ? formatCompactNumber(v) : v.toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      {/* Contrôles : indicateur + palette de couleurs */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--chart-text)" }}
          >
            Indicateur
          </span>
          <Select
            value={indicator}
            onValueChange={(v) => setIndicator(v as DistrictIndicatorKey)}
          >
            <SelectTrigger className="h-8 min-w-0 w-full sm:w-[260px] text-sm bg-tile text-tile-foreground border-tile-border">
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
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--chart-text)" }}
          >
            Couleurs
          </span>
          <Select value={paletteId} onValueChange={setPaletteId}>
            <SelectTrigger className="h-8 min-w-0 w-full sm:w-[220px] text-sm bg-tile text-tile-foreground border-tile-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAP_PALETTES.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-4 w-16 shrink-0 overflow-hidden rounded-sm border border-border/50">
                      {p.ramp.map((c) => (
                        <span
                          key={c}
                          className="flex-1"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span>{p.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
        {/* Carte */}
        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="h-[460px] w-full animate-pulse rounded-xl bg-muted/40" />
          ) : (
            <ChoroplethMap
              geoUrl="/data/onp/geo/districts_ci.geojson"
              geoKey="shapeName"
              normalizeName={normalizeName}
              valueByName={valueByName}
              domain={domain}
              colorRamp={scale.ramp}
              breaks={scale.breaks}
              valueFormatter={valueFormatter}
              labelFormatter={legendFormatter}
              onSelect={setSelected}
              selectedName={selected}
            />
          )}
        </div>

        {/* Légende */}
        {!isLoading && (
          <Legend
            scale={scale}
            label={current.label}
            formatter={legendFormatter}
          />
        )}
      </div>

      {/* Profil du district désigné, en panneau glissant par la droite */}
      <FicheDistrict
        district={selected}
        rows={data}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

/**
 * La légende porte la mesure : les classes ayant des amplitudes inégales
 * (voir mapScale.ts), ce sont ses bornes qui disent ce que vaut une teinte.
 * L'effectif de chaque classe est affiché en regard, ce qui rend visible la
 * concentration des districts au lieu de la laisser deviner sur la carte.
 */
function Legend({
  scale,
  label,
  formatter,
}: {
  scale: MapScale;
  label: string;
  formatter: (v: number) => string;
}) {
  const rows = scale.ramp
    .map((color, i) => ({
      color,
      count: scale.counts[i],
      bounds: scale.bounds[i],
    }))
    .reverse();

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 lg:w-52">
      <p className="text-xs font-semibold mb-1" style={{ color: "var(--chart-text)" }}>
        {label}
      </p>
      <p className="text-[11px] text-muted-foreground mb-3">
        Classes de même effectif
      </p>

      <div className="flex flex-col gap-1.5">
        {/* Clé par index : une rampe ré-échantillonnée peut répéter une teinte */}
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-3.5 w-6 shrink-0 rounded-sm border border-border/50"
              style={{ backgroundColor: row.color }}
            />
            <span
              className="text-[11px] tabular-nums flex-1"
              style={{ color: "var(--chart-text)" }}
            >
              {formatter(row.bounds[0])} – {formatter(row.bounds[1])}
            </span>
            <span
              className="text-[11px] tabular-nums text-muted-foreground"
              title={`${row.count} district${row.count > 1 ? "s" : ""}`}
            >
              {row.count}
            </span>
            {i === 0 && <span className="sr-only">valeurs les plus élevées</span>}
          </div>
        ))}

        <div className="flex items-center gap-2 mt-1">
          <span className="h-3.5 w-6 shrink-0 rounded-sm border border-border/50 bg-(--map-no-data)" />
          <span className="text-[11px]" style={{ color: "var(--chart-text)" }}>
            Indisponible
          </span>
        </div>
      </div>
    </div>
  );
}
