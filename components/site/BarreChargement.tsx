"use client";

import { useLinkStatus } from "next/link";

/**
 * Filet de progression en haut de l'écran, pendant qu'une page arrive.
 *
 * À placer dans un lien dont le libellé ne peut pas accueillir d'anneau : les
 * entrées du menu sont du texte serré, y glisser une icône décalerait toute la
 * barre de navigation au moment du clic. Le filet, lui, est en position fixe :
 * il vit dans le lien mais s'affiche en travers de la fenêtre.
 *
 * Il ne remplace pas les anneaux des appels à l'action, il couvre les liens
 * qui n'en ont pas. Sur une route déjà préchargée il ne paraît jamais, la
 * navigation étant terminée avant.
 */
export default function BarreChargement() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/15"
    >
      <span className="filet-progression block h-full w-2/5 bg-primary" />
    </span>
  );
}
