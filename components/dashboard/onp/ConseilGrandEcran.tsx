"use client";

import { useEffect, useState } from "react";
import { Monitor, X } from "lucide-react";

const CLE = "conseil-grand-ecran";

/**
 * Conseil adressé aux visiteurs sur petit écran.
 *
 * Le tableau de bord montre des cartes de districts, des pyramides des âges
 * et des séries à plusieurs courbes : sur un téléphone, ces figures tiennent
 * mais se lisent mal, et rien ne le disait. Le conseil arrive au-dessus du
 * contenu, se ferme d'un geste, et ne revient pas de la visite.
 *
 * Il n'empêche rien et ne recouvre rien : une page publique de données ne
 * doit pas se refuser à qui la consulte depuis un téléphone, seulement
 * l'avertir qu'elle donnera mieux ailleurs.
 */
export default function ConseilGrandEcran() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLE) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const fermer = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(CLE, "1");
    } catch {
      // Sans stockage, le conseil reviendra au prochain chargement
    }
  };

  if (!visible) return null;

  return (
    // `lg:hidden` plutôt qu'un test de la largeur en JavaScript : la requête
    // média suit la rotation de l'appareil sans une ligne de code, et le
    // conseil disparaît de lui-même si l'écran s'élargit.
    <aside
      role="note"
      className="lg:hidden mb-6 flex items-start gap-3 rounded-xl border border-tile-border bg-tile p-4 text-tile-foreground"
    >
      <Monitor className="mt-0.5 size-5 shrink-0 text-tile-foreground/70" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Mieux sur grand écran</p>
        <p className="mt-1 text-sm leading-relaxed text-tile-muted">
          Les indicateurs, les séries et les tendances s&apos;affichent ici.
          Quelques figures demandent plus de largeur — la carte des districts,
          les classements, le tableau de synthèse : tournez votre téléphone en
          mode paysage, ou ouvrez cette page sur un écran plus grand.
        </p>
      </div>

      <button
        type="button"
        onClick={fermer}
        aria-label="Fermer ce conseil"
        className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-tile-foreground/70 transition-colors hover:bg-tile-foreground/10 hover:text-tile-foreground cursor-pointer"
      >
        <X className="size-4" />
      </button>
    </aside>
  );
}
