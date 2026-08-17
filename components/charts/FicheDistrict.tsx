"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
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
  type ScoreStat,
  type SerieStat,
} from "./districtProfile";
import { CHART_COLORS } from "./chartColors";

/**
 * Profil d'un district, en panneau glissant par la gauche.
 *
 * Le parti graphique est de ne rien encadrer. Chaque indice se lit sur un rail
 * d'un pixel où deux repères suffisent : un point pour le district, un trait
 * pour la moyenne des quatorze. La barre remplie d'avant disait « 0,41 sur 1 »,
 * une échelle dont personne n'a l'intuition ; le point dit « au-dessus » ou
 * « en dessous des autres », qui est la seule question qu'on se pose devant
 * une carte.
 *
 * Le panneau reste monté en permanence, rangé hors champ : c'est ce qui lui
 * permet de glisser aussi bien à l'ouverture qu'à la fermeture. Seul son
 * contenu attend d'être demandé, pour ne pas télécharger six séries annuelles
 * que personne ne regarde.
 */
export default function FicheDistrict({
  district,
  compare,
  rows,
  onClose,
  onCompare,
}: {
  /** District désigné sur la carte ; null referme le panneau. */
  district: string | null;
  /** District mis en regard, ou null. */
  compare: string | null;
  rows: DistrictRow[];
  onClose: () => void;
  onCompare: (district: string | null) => void;
}) {
  const ouvert = district != null;

  // Échap désigne le retour en arrière partout ailleurs sur le site ; ici il
  // désélectionne le district, comme le clic sur la croix.
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ouvert, onClose]);

  return (
    <>
      {/* Voile sur les écrans où le panneau recouvre la carte : il dit que le
       * reste attend, et referme d'un geste. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[1px] transition-opacity lg:hidden ${
          ouvert ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label={
          district ? `Profil du district ${district}` : "Profil de district"
        }
        aria-hidden={!ouvert}
        // Sort par la gauche : la droite reste réservée aux fiches de
        // définition des indicateurs, les deux panneaux peuvent coexister.
        className={`fixed left-0 top-0 bottom-0 z-50 w-full overflow-y-auto border-r border-border bg-card px-6 py-6 text-card-foreground shadow-xl transition-transform duration-200 ease-out sm:w-[360px] motion-reduce:transition-none ${
          ouvert ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {ouvert && (
          <Contenu
            district={district}
            compare={compare}
            rows={rows}
            onClose={onClose}
            onCompare={onCompare}
          />
        )}
      </aside>
    </>
  );
}

function Contenu({
  district,
  compare,
  rows,
  onClose,
  onCompare,
}: {
  district: string;
  compare: string | null;
  rows: DistrictRow[];
  onClose: () => void;
  onCompare: (district: string | null) => void;
}) {
  const scores = buildScoreStats(rows, district, DISTRICT_INDICATORS);
  const population = scores.find((s) => s.key === "population");
  const indices = scores.filter((s) => s.key !== "population");
  const share = populationShare(rows, district);

  // Les valeurs du district mis en regard, rangées par indice pour que chaque
  // rail retrouve la sienne sans reparcourir la liste.
  const enRegard = new Map<string, number>(
    compare
      ? buildScoreStats(rows, compare, DISTRICT_INDICATORS).map((s) => [
          s.key,
          s.value,
        ])
      : [],
  );

  // Les autres districts, pour le choix de la comparaison.
  const autres = rows
    .map((r) => r.district)
    .filter((n) => n !== "National" && districtKey(n) !== districtKey(district))
    .sort((a, b) => a.localeCompare(b, "fr"));
  const connu = rows.some(
    (r) => districtKey(r.district) === districtKey(district),
  );

  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            District
          </p>
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight">
            {district}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche"
          className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </header>

      {!connu ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Aucune donnée pour ce district.
        </p>
      ) : (
        <>
          {population && (
            <div className="mt-5">
              <p className="font-display text-3xl font-bold leading-none tabular-nums">
                {formatFrench(population.value)}
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                habitants en 2021
                {share != null && ` · ${share.toFixed(1)} % du pays`}
                {` · ${rang(population.rank)} sur ${population.total}`}
              </p>
            </div>
          )}

          <Comparaison
            autres={autres}
            compare={compare}
            onCompare={onCompare}
          />

          <Titre>Indices 2021</Titre>
          <div className="space-y-3.5">
            {indices.map((score) => (
              <Rail
                key={score.key}
                score={score}
                enRegard={enRegard.get(score.key) ?? null}
              />
            ))}
          </div>
          <Repere compare={compare} />

          <Titre>
            Dividende démographique
            <span className="ml-1.5 font-normal normal-case tracking-normal">
              {DD_YEARS[0]} à {DD_YEARS[DD_YEARS.length - 1]}
            </span>
          </Titre>
          <div className="space-y-2.5">
            {DD_SERIES.map((serie) => (
              <Serie
                key={serie.id}
                serie={serie}
                district={district}
                compare={compare}
              />
            ))}
          </div>

          <p className="mt-6 border-t border-border/60 pt-3 text-[10px] leading-relaxed text-muted-foreground">
            RGPH 2021 et indices du dividende démographique · ONP
          </p>
        </>
      )}
    </>
  );
}

function Titre({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-7 mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  );
}

/**
 * Un indice sur son rail : le point situe le district, le trait la moyenne
 * des districts. Les indices allant tous de 0 à 1, le rail est cette échelle.
 */
function Rail({
  score,
  enRegard,
}: {
  score: ScoreStat;
  /** Valeur du district mis en regard sur le même indice, ou null. */
  enRegard: number | null;
}) {
  const position = borne(score.value * 100);
  const moyenne = borne(score.average * 100);
  const auDessus = score.value >= score.average;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-xs text-foreground/85">
          {score.label}
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums">
          {score.value.toFixed(3)}
          {enRegard != null && (
            <span className="ml-1.5 font-normal text-muted-foreground">
              contre {enRegard.toFixed(3)}
            </span>
          )}
        </span>
      </div>

      <div className="relative mt-2 h-2">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <span
          aria-hidden="true"
          className="absolute top-0 h-2 w-px bg-foreground/35"
          style={{ left: `${moyenne}%` }}
        />
        {/* Le district mis en regard : un cercle vide, qui se distingue du
         * point plein sans lui disputer l'œil. */}
        {enRegard != null && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/70 bg-card"
            style={{ left: `${borne(enRegard * 100)}%` }}
          />
        )}
        <span
          aria-hidden="true"
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${position}%`,
            backgroundColor: auDessus
              ? CHART_COLORS.positive
              : CHART_COLORS.accent,
          }}
        />
      </div>

      {/* Les deux chiffres que le rail montre sans les dire : la moyenne
       * qu'il repère d'un trait, et le rang qui en découle. */}
      <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">
        moy. {score.average.toFixed(3)} · {rang(score.rank)}/{score.total}
      </p>
    </div>
  );
}

/** Dit une fois ce que valent les repères, plutôt qu'à chaque ligne. */
function Repere({ compare }: { compare: string | null }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-foreground/60" />
        ce district
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-px bg-foreground/35" />
        moyenne des districts
      </span>
      {compare && (
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full border border-foreground/70 bg-card" />
          {compare}
        </span>
      )}
    </p>
  );
}

/**
 * Choix du district mis en regard.
 *
 * Un `select` natif plutôt qu'une liste dessinée : quatorze noms, un choix,
 * aucune raison d'inventer un objet là où le système en a déjà un — et il
 * s'ouvre en roue sur téléphone, ce qu'aucune liste maison ne fait aussi bien.
 */
function Comparaison({
  autres,
  compare,
  onCompare,
}: {
  autres: string[];
  compare: string | null;
  onCompare: (district: string | null) => void;
}) {
  return (
    <label className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
      <span className="shrink-0">Comparer à</span>
      <select
        value={compare ?? ""}
        onChange={(e) => onCompare(e.target.value || null)}
        className="min-w-0 flex-1 cursor-pointer rounded-md border border-border bg-transparent px-2 py-1 text-[11px] text-foreground outline-none transition-colors hover:border-foreground/40 focus-visible:border-ring"
      >
        <option value="">aucun district</option>
        {autres.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Une série annuelle sur une ligne : sigle, courbe des six années, valeur
 * d'arrivée, variation sur la période. L'intitulé complet reste en infobulle —
 * six intitulés en clair dans une colonne de 360 pixels noieraient les
 * chiffres qu'ils accompagnent.
 */
function Serie({
  serie,
  district,
  compare,
}: {
  serie: (typeof DD_SERIES)[number];
  district: string;
  compare: string | null;
}) {
  const { data, isLoading } = useCSV(serie.file);
  const stat = isLoading ? null : buildSerieStat(data, district, serie);
  // Le fichier est déjà là : la seconde série ne coûte qu'une lecture de plus.
  const statRegard =
    isLoading || !compare ? null : buildSerieStat(data, compare, serie);

  if (isLoading) {
    return <div className="h-5 animate-pulse rounded bg-muted/50" />;
  }
  if (!stat) return null;

  const stable = stat.change == null || Math.abs(stat.change) < 0.05;

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-10 shrink-0 text-[11px] font-semibold"
        title={stat.fullLabel}
      >
        {stat.label}
      </span>
      <Courbe stat={stat} enRegard={statRegard} />
      <span className="w-10 shrink-0 text-right text-[11px] font-medium tabular-nums">
        {stat.last?.toFixed(3) ?? "–"}
        {statRegard && (
          <span className="block font-normal text-muted-foreground">
            {statRegard.last?.toFixed(3) ?? "–"}
          </span>
        )}
      </span>
      <span
        className={`w-12 shrink-0 text-right text-[10px] tabular-nums ${
          stable
            ? "text-muted-foreground"
            : stat.change! > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-orange-600 dark:text-orange-400"
        }`}
      >
        {stat.change == null
          ? "–"
          : `${stat.change > 0 ? "+" : ""}${stat.change.toFixed(1)} %`}
      </span>
    </div>
  );
}

/**
 * Courbe de six points. En comparaison, les deux séries partagent le même
 * cadrage — sans quoi deux courbes également ascendantes paraîtraient
 * identiques alors que l'une progresse dix fois plus que l'autre.
 */
function Courbe({
  stat,
  enRegard,
}: {
  stat: SerieStat;
  enRegard: SerieStat | null;
}) {
  const connues = [...stat.values, ...(enRegard?.values ?? [])].filter(
    (v): v is number => v != null,
  );
  if (connues.length < 2) return <span className="flex-1" />;

  const min = Math.min(...connues);
  const max = Math.max(...connues);
  const amplitude = max - min || 1;
  const largeur = 64;
  const hauteur = 14;

  const tracer = (valeurs: (number | null)[]) =>
    valeurs
      .map((v, i) => {
        if (v == null) return null;
        const x = (i / (DD_YEARS.length - 1)) * largeur;
        const y = hauteur - ((v - min) / amplitude) * hauteur;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .filter((p): p is string => p != null)
      .join(" ");

  const points = tracer(stat.values);
  const monte = (stat.last ?? 0) >= (stat.first ?? 0);

  return (
    <svg
      viewBox={`0 0 ${largeur} ${hauteur}`}
      className="h-3.5 flex-1 overflow-visible"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Évolution ${DD_YEARS[0]} à ${DD_YEARS[DD_YEARS.length - 1]}`}
    >
      {enRegard && (
        <polyline
          points={tracer(enRegard.values)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="2 2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={monte ? CHART_COLORS.positive : CHART_COLORS.accent}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const borne = (n: number) => Math.min(100, Math.max(0, n));

/** 1er, 2e, 3e… */
const rang = (n: number) => (n === 1 ? "1er" : `${n}e`);
