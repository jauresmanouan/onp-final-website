/**
 * Palettes de coloration pour les cartes choroplèthes.
 * Chaque palette est une rampe du plus faible (index 0) au plus fort.
 * Pour changer/ajouter une coloration : éditer ce fichier uniquement.
 */

export type MapPalette = {
  id: string;
  label: string;
  /** Rampe de couleurs, faible → fort */
  ramp: string[];
};

export const MAP_PALETTES: MapPalette[] = [
  {
    id: "green",
    label: "Vert",
    ramp: ["#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D"],
  },
  {
    id: "blue",
    label: "Bleu",
    ramp: ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8"],
  },
  {
    id: "teal",
    label: "Turquoise",
    ramp: ["#CCFBF1", "#99F6E4", "#5EEAD4", "#2DD4BF", "#14B8A6", "#0D9488", "#0F766E"],
  },
  {
    id: "orange",
    label: "Orange",
    ramp: ["#FFEDD5", "#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C", "#C2410C"],
  },
  {
    id: "purple",
    label: "Violet",
    ramp: ["#EDE9FE", "#DDD6FE", "#C4B5FD", "#A78BFA", "#8B5CF6", "#7C3AED", "#6D28D9"],
  },
  {
    id: "magma",
    label: "Magma (chaud)",
    ramp: ["#FCFDBF", "#FEC287", "#FB8761", "#E55064", "#A52C60", "#641A80", "#221150"],
  },
  {
    id: "diverging",
    label: "Divergente (rouge→vert)",
    ramp: ["#B91C1C", "#EF4444", "#FCA5A5", "#F1F5F9", "#86EFAC", "#22C55E", "#15803D"],
  },
  {
    id: "grayscale",
    label: "Niveaux de gris",
    ramp: ["#F1F5F9", "#E2E8F0", "#CBD5E1", "#94A3B8", "#64748B", "#475569", "#1E293B"],
  },
];

export const DEFAULT_PALETTE_ID = "green";

export function getPalette(id: string): MapPalette {
  return MAP_PALETTES.find((p) => p.id === id) ?? MAP_PALETTES[0];
}
