import { CloudOff, Minus } from "lucide-react";

/**
 * Ce qu'une figure affiche quand elle n'a rien à montrer.
 *
 * Trois cas coexistaient dans le tableau de bord, chacun avec son gris et sa
 * formule : un pavé « Aucune donnée disponible » dans les graphiques, un vide
 * muet dans les mini-tendances, une phrase centrée ailleurs. Le tout dans la
 * même page, sans qu'aucun ne distingue les deux situations qui comptent.
 *
 * Car ce sont bien deux choses différentes : « il n'y a rien à montrer » est
 * un fait sur les données, « le fichier n'est pas arrivé » est une panne. La
 * première se constate, la seconde se retente — et le visiteur qui ne sait
 * pas laquelle il a sous les yeux ne sait pas s'il doit recharger la page.
 *
 * La forme reprend celle de l'invitation des petits écrans : trait pointillé,
 * une phrase, rien de criard. Un manque ne s'annonce pas en rouge.
 */
export default function EtatFigure({
  variante,
  hauteur,
  /** Ce qui manque, nommé s'il y a lieu : « Cette série », « La carte ». */
  quoi = "Cette figure",
  compact = false,
}: {
  variante: "vide" | "erreur";
  /** Hauteur réservée : celle de la figure absente, pour ne pas replier la carte. */
  hauteur?: number;
  quoi?: string;
  compact?: boolean;
}) {
  const erreur = variante === "erreur";
  const Icone = erreur ? CloudOff : Minus;

  return (
    <div
      role="status"
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-tile-border text-center ${
        compact ? "px-3 py-4" : "px-5 py-8"
      }`}
      style={hauteur ? { height: hauteur } : undefined}
    >
      <Icone className="size-4 shrink-0 text-tile-muted" aria-hidden="true" />
      <p
        className={`text-tile-muted ${compact ? "text-[11px]" : "text-xs"} leading-relaxed`}
      >
        {erreur ? (
          <>
            {quoi} n&apos;a pas pu être chargée.
            {!compact && " Rechargez la page pour réessayer."}
          </>
        ) : (
          <>{quoi} n&apos;a pas de données à cette échelle.</>
        )}
      </p>
    </div>
  );
}
