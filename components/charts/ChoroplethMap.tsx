"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { geoIdentity, geoPath, type GeoGeometryObjects } from "d3-geo";
import { classOf } from "./mapScale";

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
  /**
   * Coupures entre classes, croissantes. Fournies, elles remplacent le
   * découpage linéaire du domaine : c'est ce qui permet une échelle par
   * quantiles. La rampe doit alors compter breaks.length + 1 couleurs.
   */
  breaks?: number[];
  /** Formatte la valeur affichée dans le tooltip */
  valueFormatter?: (value: number) => string;
  /** Formatte la valeur affichée sur la carte (au centroïde). Par défaut = valueFormatter */
  labelFormatter?: (value: number) => string;
  /** Affiche le nom + la valeur au centroïde de chaque zone */
  showLabels?: boolean;
  /** Hauteur du SVG en px */
  height?: number;
  /** Appelé au clic sur une zone : ouvre la fiche du district */
  onSelect?: (name: string) => void;
  /** Zone actuellement sélectionnée, mise en avant sur la carte */
  selectedName?: string | null;
  /** Zone mise en regard de la sélection, cerclée sans être soulevée */
  comparedName?: string | null;
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

/**
 * Districts sans valeur : la teinte suit le thème, donc elle n'est pas un
 * hex mais une variable CSS. Le calcul de contraste des étiquettes ne peut
 * pas la lire, d'où le traitement à part dans textColorFor.
 */
const NO_DATA_FILL = "var(--map-no-data)";

const WIDTH = 520;

function colorFor(
  value: number | null,
  [min, max]: [number, number],
  ramp: string[],
  breaks?: number[],
): string {
  if (value == null || !Number.isFinite(value)) return NO_DATA_FILL;
  if (breaks && breaks.length > 0) {
    return ramp[Math.min(ramp.length - 1, classOf(value, breaks))];
  }
  if (max <= min) return ramp[ramp.length - 1];
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const idx = Math.min(ramp.length - 1, Math.floor(t * ramp.length));
  return ramp[idx];
}

/** Couleur de texte lisible (blanc ou gris foncé) selon la luminance du fond. */
function textColorFor(fill: string): string {
  // Remplissage "aucune donnée" : sa clarté dépend du thème, on délègue au CSS
  if (fill === NO_DATA_FILL) return "var(--map-no-data-foreground)";
  const m = fill.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  // luminance perçue (sRGB)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0F172A" : "#FFFFFF"; // slate-900 sinon blanc
}

/**
 * Mise en avant d'une zone par un léger grossissement, plutôt que par un
 * contour rapporté : la forme du district reste la seule ligne à l'écran.
 * Le grossissement part du centroïde, donc la zone gonfle sur place au lieu
 * de glisser, et une ombre courte la décolle de ses voisines.
 */
function liftStyle(
  p: { cx: number; cy: number },
  isSelected: boolean,
  isHovered: boolean,
): CSSProperties {
  const scale = isSelected ? 1.07 : isHovered ? 1.025 : 1;

  // Montée vive, retombée plus longue et amortie : en quittant un district
  // pour un autre, la zone abandonnée redescend derrière la nouvelle au lieu
  // de claquer, ce qui donne un enchaînement continu plutôt que deux à-coups.
  const transition =
    scale === 1
      ? "transform 340ms cubic-bezier(0.33, 0, 0.15, 1), filter 300ms ease-out, fill 200ms ease-out"
      : "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), filter 180ms ease-out, fill 200ms ease-out";

  const base: CSSProperties = { transition };
  if (scale === 1 || !Number.isFinite(p.cx) || !Number.isFinite(p.cy)) {
    return base;
  }
  return {
    ...base,
    transformOrigin: `${p.cx}px ${p.cy}px`,
    transform: `scale(${scale})`,
    filter: isSelected
      ? "drop-shadow(0 1.5px 2.5px rgb(0 0 0 / 0.35))"
      : undefined,
  };
}

/** Halo porté par les étiquettes, à l'opposé de leur couleur de texte. */
function haloFor(textColor: string): string {
  if (textColor === "#FFFFFF") return "rgba(15,23,42,0.45)";
  if (textColor === "#0F172A") return "rgba(255,255,255,0.55)";
  return "var(--map-no-data)"; // cas thème : le halo reprend le fond
}

export default function ChoroplethMap({
  geoUrl,
  geoKey,
  normalizeName,
  valueByName,
  domain,
  colorRamp = DEFAULT_RAMP,
  breaks,
  valueFormatter = (v) => v.toLocaleString("fr-FR"),
  labelFormatter,
  showLabels = true,
  height = 460,
  onSelect,
  selectedName = null,
  comparedName = null,
}: Props) {
  const fmtLabel = labelFormatter ?? valueFormatter;
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hovered, setHovered] = useState<{
    name: string;
    value: number | null;
    x: number;
    y: number;
  } | null>(null);

  /**
   * Les zones sont séparées par un liseré : en glissant d'un district au
   * suivant, le curseur passe une poignée de millisecondes sur le vide et
   * déclenche une sortie parasite. On diffère l'effacement, qu'une entrée
   * immédiate annule ; le survol enchaîne alors sans clignoter.
   */
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelLeave = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const enterZone = useCallback(
    (p: { name: string; value: number | null }, e: React.MouseEvent) => {
      cancelLeave();
      setHovered({ name: p.name, value: p.value, x: e.clientX, y: e.clientY });
    },
    [cancelLeave],
  );

  const moveZone = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setHovered((h) => (h ? { ...h, x: clientX, y: clientY } : h));
  }, []);

  const leaveZone = useCallback(() => {
    cancelLeave();
    leaveTimer.current = setTimeout(() => setHovered(null), 90);
  }, [cancelLeave]);

  useEffect(() => cancelLeave, [cancelLeave]);

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
      const fill = colorFor(value, domain, colorRamp, breaks);
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
  }, [geo, geoKey, normalizeName, valueByName, domain, colorRamp, breaks, height]);

  // Un SVG n'a pas de z-index : c'est l'ordre du document qui empile. La zone
  // agrandie passe donc en dernier, sinon ses voisines lui rognent les bords.
  const ordered = useMemo(() => {
    // Les deux zones en jeu passent devant : la comparée d'abord, la
    // sélectionnée par-dessus, puisque c'est elle qui se soulève.
    const devant = [comparedName, selectedName].filter(
      (n): n is string => n != null,
    );
    if (devant.length === 0) return paths;
    return [
      ...paths.filter((p) => !devant.includes(p.name)),
      ...devant.flatMap((n) => paths.filter((p) => p.name === n)),
    ];
  }, [paths, selectedName, comparedName]);

  // Le suivi du curseur pour l'infobulle change à chaque pixel parcouru.
  // Les tracés, eux, ne dépendent que de la zone survolée : on les mémoïse
  // sur ce seul nom, sinon les quatorze formes seraient reconstruites à
  // chaque mouvement de souris et l'animation en deviendrait saccadée.
  const hoveredName = hovered?.name ?? null;

  const shapes = useMemo(
    () => (
      <g>
        {ordered.map((p, i) => {
          const isSelected = selectedName === p.name;
          const isCompared = comparedName === p.name;
          return (
            <path
              key={p.key}
              // Les zones se posent l'une après l'autre, dans l'ordre du
              // fichier : quatorze fois trente millisecondes, la carte est
              // construite en moins d'une demi-seconde.
              className="zone-carte"
              d={p.d}
              fill={p.fill}
              // La zone mise en regard n'est pas soulevée : elle est cernée.
              // Deux reliefs à l'écran diraient deux sélections, alors qu'il
              // n'y en a qu'une, et un point de comparaison.
              stroke={isCompared ? "var(--chart-text)" : "var(--map-stroke)"}
              strokeWidth={isCompared ? 2 : 0.75}
              strokeDasharray={isCompared ? "3 2" : undefined}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={onSelect ? `Voir les statistiques de ${p.name}` : undefined}
              aria-pressed={onSelect ? isSelected : undefined}
              style={{
                ...liftStyle(p, isSelected, hoveredName === p.name),
                animationDelay: `${i * 30}ms`,
                cursor: "pointer",
                outline: "none",
              }}
              onClick={() => onSelect?.(p.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(p.name);
                }
              }}
              onMouseEnter={(e) => enterZone(p, e)}
              onMouseMove={moveZone}
              onMouseLeave={leaveZone}
            />
          );
        })}
      </g>
    ),
    [
      ordered,
      selectedName,
      comparedName,
      hoveredName,
      onSelect,
      enterZone,
      moveZone,
      leaveZone,
    ],
  );

  const labels = useMemo(
    () => (
      <g style={{ pointerEvents: "none" }}>
        {ordered.map((p) =>
          Number.isFinite(p.cx) && Number.isFinite(p.cy) ? (
            <text
              key={`label-${p.key}`}
              x={p.cx}
              y={p.cy}
              textAnchor="middle"
              fill={p.textColor}
              style={{
                paintOrder: "stroke",
                stroke: haloFor(p.textColor),
                strokeWidth: 2,
                strokeLinejoin: "round",
                // L'etiquette suit exactement le zoom de sa zone
                ...liftStyle(p, selectedName === p.name, hoveredName === p.name),
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
    ),
    [ordered, selectedName, hoveredName, fmtLabel],
  );

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
        {shapes}
        {showLabels && labels}
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
          {onSelect && (
            <div className="mt-1 text-[11px] text-muted-foreground">
              Cliquer pour voir toutes les statistiques
            </div>
          )}
        </div>
      )}
    </div>
  );
}
