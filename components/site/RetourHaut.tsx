"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Retour en haut de page.
 *
 * Les pages du site et les onglets du tableau de bord se lisent sur plusieurs
 * écrans de hauteur ; revenir aux repères du haut — le sommaire, les onglets,
 * la barre de recherche — demandait une longue remontée. Le bouton n'apparaît
 * qu'une fois la première hauteur d'écran franchie : tant que l'en-tête est
 * visible, il n'a rien à offrir.
 *
 * Il se place sous les panneaux latéraux (`z-30` contre leur `z-50`) : une
 * fiche de district ouverte doit le recouvrir, pas l'inverse.
 */
export default function RetourHaut() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const calculer = () => setVisible(window.scrollY > window.innerHeight);
    calculer();
    window.addEventListener("scroll", calculer, { passive: true });
    window.addEventListener("resize", calculer);
    return () => {
      window.removeEventListener("scroll", calculer);
      window.removeEventListener("resize", calculer);
    };
  }, []);

  const remonter = () => {
    // Le réglage système « réduire les animations » vaut aussi pour un
    // défilement de plusieurs milliers de pixels.
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={remonter}
      aria-label="Revenir en haut de la page"
      // `hidden` supprimerait la transition : le bouton reste dans le flux et
      // s'efface, en devenant inatteignable au clic comme au clavier.
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      /* Orange plein : posé tantôt sur le panneau vert du tableau de bord,
       * tantôt sur le fond clair du site, il lui faut une couleur qui ne
       * dépende d'aucun des deux. C'est celle des appels à l'action. */
      className={`fixed bottom-6 right-6 z-30 inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-3"
      }`}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
}
