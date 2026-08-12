/**
 * Couleurs sémantiques fixes pour les séries de graphiques.
 * Palette principale : green-500 + orange-500 (charte).
 * Couleurs additionnelles utilisées seulement si plus de 2 séries.
 */
export const CHART_COLORS = {
  // ── Charte principale ────────────────────────────
  primary: "#22C55E", // green-500
  accent: "#F97316", // orange-500

  // ── Sexes (charte : green/orange) ────────────────
  hommes: "#22C55E", // green-500
  femmes: "#F97316", // orange-500
  total: "#64748B", // slate-500 (neutre)
  ensemble: "#22C55E",

  // ── Tranches d'âge (gradients) ───────────────────
  enfants: "#22C55E", // green-500
  adultes: "#3B82F6", // blue-500 (couleur additionnelle pour différencier)
  seniors: "#F97316", // orange-500

  // ── Sémantique ───────────────────────────────────
  positive: "#22C55E", // green-500
  negative: "#EF4444", // red-500
  neutral: "#64748B", // slate-500

  mortalite: "#EF4444", // red-500 (sémantique conservée pour mortalité)
  reduction: "#22C55E",

  // ── Urbain/Rural ─────────────────────────────────
  urbain: "#22C55E", // green-500
  rural: "#F97316", // orange-500

  // ── Séries génériques (ordre de priorité) ────────
  series: [
    "#22C55E", // green-500   - primaire
    "#F97316", // orange-500  - secondaire
    "#3B82F6", // blue-500
    "#A855F7", // purple-500
    "#EAB308", // yellow-500
    "#06B6D4", // cyan-500
    "#EC4899", // pink-500
    "#84CC16", // lime-500
  ],

  // ── Éléments d'axes/grilles (lisibles sur cartes slate-300) ──
  grid: "#64748B", // slate-500 (lignes de grille)
  axis: "#064E3B", // emerald-900 (axes + labels, contraste sur slate-300)
} as const;
