"use client";

import { Search } from "lucide-react";

/**
 * Déclencheur visible de la palette de commandes.
 *
 * Le raccourci ⌘K ne se devine pas, et sur un téléphone il n'existe pas : ce
 * bouton donne le même accès à la souris et au doigt. Il n'ouvre rien lui-même
 * — il émet l'événement que la palette écoute — ce qui évite de faire remonter
 * un état d'ouverture jusqu'aux deux en-têtes du site.
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
      title="Rechercher (⌘K)"
      className={`inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer ${className}`}
    >
      <Search className="size-4" aria-hidden="true" />
    </button>
  );
}
