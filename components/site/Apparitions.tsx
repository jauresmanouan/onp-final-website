"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fait paraître les éléments marqués `data-apparition` quand ils entrent
 * dans la vue.
 *
 * Un seul guetteur pour toute la page, plutôt qu'un composant enveloppant
 * chaque bloc : les pages restent des composants de serveur et se contentent
 * d'un attribut, sans passer par une frontière client à chaque carte.
 *
 * L'apparition n'a lieu qu'une fois. Un élément qui reparaîtrait à chaque
 * remontée finirait par lasser, et donnerait le sentiment que la page n'est
 * jamais stable.
 */
export default function Apparitions() {
  const pathname = usePathname();

  useEffect(() => {
    const marque = (el: Element) => el.setAttribute("data-vu", "");

    // Moins d'animations : tout est visible d'emblée, sans guetteur.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-apparition]").forEach(marque);
      return;
    }

    const guetteur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          const el = entree.target as HTMLElement;
          const retard = el.dataset.apparitionRetard;
          if (retard) el.style.transitionDelay = `${retard}ms`;
          marque(el);
          guetteur.unobserve(el);
        }
      },
      // Le seuil reste à zéro et c'est la marge basse qui retarde le
      // déclenchement. Exiger un pourcentage du bloc condamnait les plus
      // hauts : une rubrique de publications plus grande que l'écran n'aurait
      // jamais pu en montrer la part demandée, et serait restée invisible.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    const guette = (racine: ParentNode) => {
      racine
        .querySelectorAll("[data-apparition]:not([data-vu])")
        .forEach((el) => guetteur.observe(el));
    };
    guette(document);

    // Les sections de l'accueil arrivent en flux, après ce premier balayage :
    // sans cette surveillance, celles qui suivent l'ouverture resteraient
    // invisibles pour toujours.
    const veilleur = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const noeud of m.addedNodes) {
          if (noeud.nodeType !== 1) continue;
          const el = noeud as Element;
          if (el.matches("[data-apparition]:not([data-vu])")) guetteur.observe(el);
          guette(el);
        }
      }
    });
    veilleur.observe(document.body, { childList: true, subtree: true });

    return () => {
      guetteur.disconnect();
      veilleur.disconnect();
    };
  }, [pathname]);

  return null;
}
