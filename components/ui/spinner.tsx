import { cn } from "@/lib/utils";

/**
 * Anneau de chargement.
 *
 * Il est peint en `currentColor` plutôt qu'en blanc : posé sur un bouton
 * clair du thème sombre, un anneau blanc disparaissait dans le fond. Il prend
 * donc la couleur du texte qui l'entoure, quel que soit le bouton.
 *
 * Le tracé vient d'un dégradé conique découpé en anneau par un masque
 * radial. Une bordure aurait donné quatre segments d'épaisseur inégale aux
 * petites tailles ; le dégradé garde une queue de comète régulière.
 */
export default function Spinner({
  className,
  epaisseur = 2,
}: {
  className?: string;
  /** Épaisseur du trait en pixels, à monter avec la taille de l'anneau. */
  epaisseur?: number;
}) {
  const trou = `calc(100% - ${epaisseur}px)`;

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-4 animate-spin rounded-full", className)}
      style={{
        background:
          "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, currentColor 15%, transparent) 140deg, currentColor 340deg, currentColor 360deg)",
        mask: `radial-gradient(farthest-side, transparent ${trou}, #000 ${trou})`,
        WebkitMask: `radial-gradient(farthest-side, transparent ${trou}, #000 ${trou})`,
      }}
    />
  );
}
