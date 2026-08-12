/**
 * Découpage en classes d'une série de valeurs pour une carte choroplèthe.
 *
 * Les effectifs de population ivoiriens sont très déséquilibrés : Abidjan
 * pèse trois fois le district suivant. Sur une échelle linéaire, la moitié
 * des classes reste vide et presque tous les districts se serrent dans les
 * deux premières, ce qui donne une carte d'une seule teinte plus Abidjan.
 * Un découpage par quantiles remplit chaque classe du même nombre de
 * districts et rend les écarts entre voisins de nouveau visibles.
 *
 * Contrepartie assumée : les classes n'ont plus la même amplitude, donc la
 * légende doit afficher les bornes réelles — c'est elle qui porte la mesure.
 */

export type MapScale = {
  /** Bornes de coupure, croissantes : classe i = [breaks[i-1], breaks[i]). */
  breaks: number[];
  /** Couleurs effectivement utilisées, une par classe. */
  ramp: string[];
  /** Nombre de valeurs dans chaque classe. */
  counts: number[];
  /** Bornes basse et haute de chaque classe, pour la légende. */
  bounds: [number, number][];
};

/** Quantile linéaire d'une série déjà triée. */
function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/**
 * Construit une échelle à classes d'effectifs égaux.
 * Si des valeurs se répètent, deux coupures peuvent tomber au même endroit :
 * les doublons sont retirés et la rampe est ré-échantillonnée en conséquence,
 * sinon on afficherait des classes vides dans la légende.
 */
export function quantileScale(values: number[], ramp: string[]): MapScale {
  const clean = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (clean.length === 0) {
    return { breaks: [], ramp: [ramp[ramp.length - 1]], counts: [0], bounds: [[0, 0]] };
  }

  const min = clean[0];
  const max = clean[clean.length - 1];

  const wanted = Math.min(ramp.length, clean.length);
  const rawBreaks: number[] = [];
  for (let i = 1; i < wanted; i++) {
    rawBreaks.push(quantile(clean, i / wanted));
  }

  // Coupures distinctes et strictement à l'intérieur du domaine
  const breaks = [...new Set(rawBreaks)].filter((b) => b > min && b < max);
  const classes = breaks.length + 1;

  // Ré-échantillonne la rampe sur le nombre de classes réellement obtenu,
  // en conservant ses deux extrémités.
  const usedRamp =
    classes === ramp.length
      ? ramp
      : Array.from({ length: classes }, (_, i) =>
          ramp[
            classes === 1
              ? ramp.length - 1
              : Math.round((i / (classes - 1)) * (ramp.length - 1))
          ],
        );

  const bounds: [number, number][] = [];
  const counts: number[] = [];
  for (let i = 0; i < classes; i++) {
    const lo = i === 0 ? min : breaks[i - 1];
    const hi = i === classes - 1 ? max : breaks[i];
    bounds.push([lo, hi]);
    counts.push(
      clean.filter((v) =>
        i === classes - 1 ? v >= lo && v <= hi : v >= lo && v < hi,
      ).length,
    );
  }

  return { breaks, ramp: usedRamp, counts, bounds };
}

/** Index de la classe d'une valeur, par recherche dans les coupures. */
export function classOf(value: number, breaks: number[]): number {
  let i = 0;
  while (i < breaks.length && value >= breaks[i]) i++;
  return i;
}
