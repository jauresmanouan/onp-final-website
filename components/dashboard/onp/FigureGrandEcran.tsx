import { RotateCw } from "lucide-react";

/**
 * Figure qui demande de la largeur.
 *
 * Le tableau de bord montre presque tout sur un téléphone : les indicateurs,
 * les séries, les tendances. Restent quelques figures que la largeur d'un
 * écran de poche rend illisibles — la carte des districts, les classements
 * qui portent quatorze noms en ordonnée, le tableau à huit colonnes. Plutôt
 * que de les tasser, on les remplace par une invitation : tourner l'appareil
 * suffit le plus souvent, l'écran large fait le reste.
 *
 * Le seuil est posé en CSS et non en JavaScript : la bascule suit la rotation
 * de l'appareil d'elle-même, sans rendu intermédiaire ni saut de mise en page.
 * Au-delà de `sm` (640 px) — ce que dépasse la quasi-totalité des téléphones
 * en paysage — la figure reprend sa place.
 *
 * L'en-tête de la carte, lui, reste visible : titre, source et téléchargement
 * du CSV demeurent accessibles depuis le téléphone.
 */
export default function FigureGrandEcran({
  /** Ce dont on prive le visiteur, nommé dans l'invitation. */
  quoi,
  /** Classes de placement de l'invitation (marges dans une carte sans padding). */
  className = "",
  children,
}: {
  quoi: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-sm:hidden">{children}</div>

      <div
        role="note"
        className={`sm:hidden flex flex-col items-center gap-3 rounded-xl border border-dashed border-tile-border px-5 py-8 text-center ${className}`}
      >
        <RotateCw
          aria-hidden="true"
          className="size-6 text-tile-muted"
        />
        <p className="text-sm font-semibold text-tile-foreground">
          {quoi} demande un écran plus large
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-tile-muted">
          Tournez votre téléphone en mode paysage pour l&apos;afficher, ou
          ouvrez cette page sur un écran plus grand.
        </p>
      </div>
    </>
  );
}
