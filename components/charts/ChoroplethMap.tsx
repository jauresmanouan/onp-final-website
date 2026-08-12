"use client";

import { useEffect, useMemo, useState } from "react";
import { geoIdentity, geoPath, type GeoGeometryObjects } from "d3-geo";

// Types GeoJSON minimaux (évite la dépendance @types/geojson)
type GeoFeature = {
  type: "Feature";
  geometry: GeoGeometryObjects;
  properties: Record<string, unknown> | null;
};
type FeatureCollection = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

/**
 * Carte choroplèthe générique.
 * Charge un GeoJSON, cadre automatiquement toutes les zones avec
 * geoMercator().fitSize() (aucun réglage manuel de scale/center) et colore
 * chaque zone selon une valeur indexée par nom métier.
 */

export type ChoroplethDatum = {
  /** Nom métier de la zone (ex: "Abidjan") */
  name: string;
  /** Valeur de l'indicateur, ou null si indisponible */
  value: number | null;
};

type Props = {
  /** URL du fichier GeoJSON (dans /public) */
  geoUrl: string;
  /** Nom de la propriété GeoJSON identifiant la zone (ex: "shapeName") */
  geoKey: string;
  /** Normalise le nom brut du GeoJSON vers le nom métier utilisé dans `valueByName` */
  normalizeName: (rawName: string) => string;
  /** Valeur de l'indicateur indexée par nom métier */
  valueByName: Map<string, number>;
  /** Bornes [min, max] de l'échelle de couleur */
  domain: [number, number];
  /** Rampe de couleur : du plus faible au plus fort */
  colorRamp?: string[];
  /** Formatte la valeur affichée dans le tooltip */
  valueFormatter?: (value: number) => string;
  /** Formatte la valeur affichée sur la carte (au centroïde). Par défaut = valueFormatter */
  labelFormatter?: (value: number) => string;
  /** Affiche le nom + la valeur au centroïde de chaque zone */
  showLabels?: boolean;
  /** Hauteur du SVG en px */
  height?: number;
};

const DEFAULT_RAMP = [
  "#DCFCE7", // green-100
  "#BBF7D0", // green-200
  "#86EFAC", // green-300
  "#4ADE80", // green-400
  "#22C55E", // green-500
  "#16A34A", // green-600
  "#15803D", // green-700
];

const NO_DATA_FILL = "#E2E8F0"; // slate-200

const WIDTH = 520;

function colorFor(
  value: number | null,
  [min, max]: [number, number],
  ramp: string[],
): string {
  if (value == null || !Number.isFinite(value)) return NO_DATA_FILL;
  if (max <= min) return ramp[ramp.length - 1];
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const idx = Math.min(ramp.length - 1, Math.floor(t * ramp.length));
  return ramp[idx];
}

/** Couleur de texte lisible (blanc ou gris foncé) selon la luminance du fond. */
function textColorFor(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  // luminance perçue (sRGB)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0F172A" : "#FFFFFF"; // slate-900 sinon blanc
}

export default function ChoroplethMap({
  geoUrl,
  geoKey,
  normalizeName,
  valueByName,
  domain,
  colorRamp = DEFAULT_RAMP,
  valueFormatter = (v) => v.toLocaleString("fr-FR"),
  labelFormatter,
  showLabels = true,
  height = 460,
}: Props) {
  const fmtLabel = labelFormatter ?? valueFormatter;
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hovered, setHovered] = useState<{
    name: string;
    value: number | null;
    x: number;
    y: number;
  } | null>(null);

  // Charge le GeoJSON une fois
  useEffect(() => {
    let cancelled = false;
    fetch(geoUrl)
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        if (!cancelled) setGeo(data);
      })
      .catch(() => {
        if (!cancelled) setGeo(null);
      });
    return () => {
      cancelled = true;
    };
  }, [geoUrl]);

  // Génère le path d2 pour chaque feature, cadré automatiquement sur l'ensemble.
  const paths = useMemo(() => {
    if (!geo || !geo.features.length) return [];
    // geoIdentity (plan cartésien) + reflectY : pour une petite zone comme la
    // Côte d'Ivoire, c'est visuellement équivalent à Mercator mais sans les
    // artefacts de topologie sphérique (rectangle parasite, polygone inversé)
    // que geoMercator produit sur certains anneaux de ce jeu de données.
    const projection = geoIdentity()
      .reflectY(true)
      .fitSize([WIDTH, height], geo as never);
    const pathGen = geoPath(projection);
    return geo.features.map((feature: GeoFeature, i: number) => {
      const rawName = (feature.properties?.[geoKey] as string) ?? "";
      const name = normalizeName(rawName);
      const value = valueByName.get(name) ?? null;
      const fill = colorFor(value, domain, colorRamp);
      const [cx, cy] = pathGen.centroid(feature);
      return {
        d: pathGen(feature) ?? "",
        name,
        value,
        fill,
        textColor: textColorFor(fill),
        cx,
        cy,
        key: `${rawName}-${i}`,
      };
    });
  }, [geo, geoKey, normalizeName, valueByName, domain, colorRamp, height]);

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "auto" }}
        role="img"
        aria-label="Carte choroplèthe des districts"
      >
        <g>
          {paths.map((p) => (
            <path
              key={p.key}
              d={p.d}
              fill={p.fill}
              stroke="#FFFFFF"
              strokeWidth={0.75}
              style={{ transition: "fill 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) =>
                setHovered({
                  name: p.name,
                  value: p.value,
                  x: e.clientX,
                  y: e.clientY,
                })
              }
              onMouseMove={(e) =>
                setHovered((h) =>
                  h ? { ...h, x: e.clientX, y: e.clientY } : h,
                )
              }
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </g>

        {/* Étiquettes au centroïde : nom du district + valeur de l'indicateur */}
        {showLabels && (
          <g style={{ pointerEvents: "none" }}>
            {paths.map((p) =>
              Number.isFinite(p.cx) && Number.isFinite(p.cy) ? (
                <text
                  key={`label-${p.key}`}
                  x={p.cx}
                  y={p.cy}
                  textAnchor="middle"
                  fill={p.textColor}
                  style={{
                    paintOrder: "stroke",
                    stroke:
                      p.textColor === "#FFFFFF"
                        ? "rgba(15,23,42,0.45)"
                        : "rgba(255,255,255,0.55)",
                    strokeWidth: 2,
                    strokeLinejoin: "round",
                  }}
                >
                  <tspan x={p.cx} dy="-0.1em" fontSize={9} fontWeight={600}>
                    {p.name}
                  </tspan>
                  {p.value != null && (
                    <tspan x={p.cx} dy="1.1em" fontSize={8.5} fontWeight={700}>
                      {fmtLabel(p.value)}
                    </tspan>
                  )}
                </text>
              ) : null,
            )}
          </g>
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <div className="font-semibold" style={{ color: "var(--chart-text)" }}>
            {hovered.name}
          </div>
          <div style={{ color: "var(--chart-text)" }}>
            {hovered.value != null
              ? valueFormatter(hovered.value)
              : "Donnée indisponible"}
          </div>
        </div>
      )}
    </div>
  );
}
