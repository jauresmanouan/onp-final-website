"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { BoutonLien } from "@/components/site/LienNavigation";

/**
 * Filet de sécurité du tableau de bord.
 *
 * Le site avait le sien, pas la page qui porte le plus de code client : une
 * exception dans un graphique, un CSV malformé, et le visiteur tombait sur
 * l'écran d'erreur par défaut de Next — en anglais, hors charte, sans issue.
 *
 * La frontière est posée à l'intérieur de l'ossature du tableau de bord :
 * l'en-tête, ses rubriques et le pied de page restent en place, si bien que
 * l'incident ne coûte pas la navigation. Le rechargement passe par `reset`,
 * qui refait un rendu sans rejouer toute la page.
 */
export default function ErreurDashboard({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sans la trace, il ne reste que le digest, qui ne dit rien de la cause.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-20 xl:px-40 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Erreur
      </p>
      <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-panel-foreground">
        Les données n&apos;ont pas pu s&apos;afficher
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-panel-foreground/85">
        Un incident est survenu pendant la construction des graphiques. Les
        fichiers restent téléchargeables depuis la rubrique Publications, et
        vous pouvez réessayer dès maintenant.
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-panel-foreground/60">
          Référence de l&apos;incident : {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel cursor-pointer"
        >
          Réessayer
          <RotateCw className="size-4" aria-hidden="true" />
        </button>
        <BoutonLien href="/" variante="contour" icone="fleche">
          Retour à l&apos;accueil
        </BoutonLien>
      </div>
    </div>
  );
}
