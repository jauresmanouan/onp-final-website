import { ReactNode } from "react";
import { Triangle } from "lucide-react";

type Props = {
  /** Titre principal de la section (ex: "Aperçu des tendances ONP") */
  title: string;
  /** Description longue affichée en bas (notes méthodologiques) */
  description?: string;
  /** Source des données (ex: "Source : RGPH 1988, 1998, 2021 · ONP") */
  source?: string;
  /** Lien optionnel "Récupérer les données" affiché à côté de la source */
  dataLink?: { label: string; href: string };
  /** Nombre de colonnes sur desktop (par défaut 4) */
  columns?: 2 | 3 | 4;
  /** Variante de fond. "green" (défaut) = vert clair pastel, "white" = fond blanc épuré, "neutral" = card classique */
  tone?: "green" | "blue" | "white" | "neutral";
  children: ReactNode;
};

const COLUMN_CLASSES: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

// Palette unifiée du dashboard ONP : tuiles posées sur le panneau de fond.
// Les tons sont volontairement identiques ; ils passent par les tokens de
// thème pour suivre le mode clair comme le mode sombre.
const TILE_CLASSES = "bg-tile text-tile-foreground border-tile-border shadow-sm";

const TONE_CLASSES: Record<NonNullable<Props["tone"]>, string> = {
  green: TILE_CLASSES,
  blue: TILE_CLASSES,
  white: TILE_CLASSES,
  neutral: TILE_CLASSES,
};

export default function TrendsSection({
  title,
  description,
  source,
  dataLink,
  columns = 4,
  tone = "green",
  children,
}: Props) {
  return (
    <section className={`rounded-2xl border ${TONE_CLASSES[tone]}`}>
      <div className="px-6 sm:px-8 py-7 sm:py-8 ">
        {/* Titre principal avec ▶ */}
        <div className="flex items-center gap-2 mb-7">
          <Triangle className="h-3 w-3 fill-current rotate-90 text-primary" />
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            {title}
          </h2>
        </div>

        {/* Grille de mini-charts */}
        <div className={`grid ${COLUMN_CLASSES[columns]} gap-x-6 gap-y-8`}>
          {children}
        </div>

        {/* Description + source */}
        {(description || source || dataLink) && (
          <div className="mt-8 pt-6 border-t border-tile-border space-y-2">
            {description && (
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                {description}
              </p>
            )}
            {(source || dataLink) && (
              <p className="text-xs sm:text-sm">
                {source && <span className="font-semibold">{source}</span>}
                {source && dataLink && <span className="opacity-60"> · </span>}
                {dataLink && (
                  <a
                    href={dataLink.href}
                    className="underline underline-offset-2 hover:text-primary transition-colors"
                  >
                    {dataLink.label}
                  </a>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
