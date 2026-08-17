"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

/**
 * Déclencheur visible de la palette de commandes.
 *
 * Le raccourci ⌘K ne se devine pas, et sur un téléphone il n'existe pas : ce
 * bouton donne le même accès à la souris et au doigt. Il n'ouvre rien lui-même
 * — il émet l'événement que la palette écoute — ce qui évite de faire remonter
 * un état d'ouverture jusqu'aux deux en-têtes du site.
 *
 * Là où la place le permet, il porte le raccourci en toutes lettres : c'est la
 * seule façon de l'apprendre à quelqu'un qui ne l'a jamais essayé, et cela
 * coûte deux caractères dans la barre.
 */
export default function BoutonPalette({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("onp:ouvrir-palette"))}
      aria-label="Rechercher un indicateur ou une rubrique"
      title="Rechercher"
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${className}`}
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <Raccourci />
    </button>
  );
}

/**
 * Le raccourci tel que le clavier du visiteur l'écrit : ⌘K sur un Mac, Ctrl K
 * ailleurs. Il n'apparaît qu'après le montage — la plateforme ne se lit que
 * dans le navigateur, et un rendu serveur qui trancherait se contredirait à
 * l'hydratation. Il s'efface sous 1024 px, où le clavier n'est pas acquis.
 */
function Raccourci() {
  const [touche, setTouche] = useState<string | null>(null);

  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform ?? "");
    setTouche(mac ? "⌘K" : "Ctrl K");
  }, []);

  if (!touche) return null;

  return (
    <kbd
      aria-hidden="true"
      className="hidden rounded border border-border px-1 py-0.5 font-sans text-[10px] leading-none lg:block"
    >
      {touche}
    </kbd>
  );
}
