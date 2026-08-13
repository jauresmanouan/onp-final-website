"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Chiffre qui monte de zéro jusqu'à sa valeur.
 *
 * Le composant reçoit la valeur déjà composée, « 61,5 ans » ou « ×1,9 », et
 * n'anime que sa partie nombre : le préfixe et l'unité restent en place, sans
 * quoi le multiplicateur apparaîtrait après coup et la ligne sauterait.
 *
 * Le nombre est reformaté à chaque image par `Intl`, jamais par découpage de
 * chaîne : la virgule décimale et l'espace des milliers restent ceux du
 * français, y compris pour les valeurs à sept chiffres qui viendront.
 */

type Morceaux = {
  prefixe: string;
  cible: number;
  decimales: number;
  suffixe: string;
};

/** « ×1,9 » devient { prefixe: "×", cible: 1.9, decimales: 1, suffixe: "" }. */
function decoupe(valeur: string): Morceaux | null {
  // Les separateurs de milliers du francais sont des espaces insecables,
  // fine ou normale : ils appartiennent au nombre, pas au suffixe.
  const ESPACES = "\\u0020\\u00A0\\u202F";
  const m = valeur.match(
    new RegExp(`^(\\D*)([\\d${ESPACES}]*\\d(?:[.,]\\d+)?)([\\s\\S]*)$`)
  );
  if (!m) return null;

  const [, prefixe, nombre, suffixe] = m;
  const normalise = nombre
    .replace(new RegExp(`[${ESPACES}]`, "g"), "")
    .replace(",", ".");
  const cible = Number.parseFloat(normalise);
  if (!Number.isFinite(cible)) return null;

  const point = normalise.indexOf(".");
  return {
    prefixe,
    cible,
    decimales: point === -1 ? 0 : normalise.length - point - 1,
    suffixe,
  };
}

function compose(n: number, m: Morceaux): string {
  const nombre = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: m.decimales,
    maximumFractionDigits: m.decimales,
  }).format(n);
  return `${m.prefixe}${nombre}${m.suffixe}`;
}

/**
 * Décélération marquée : la course est vive au départ et se traîne sur la fin,
 * si bien que les dernières unités se lisent une à une.
 */
const freine = (t: number) => 1 - Math.pow(1 - t, 5);

// Appeler useLayoutEffect au rendu serveur déclenche un avertissement React.
const useEffetAvantPeinture =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function ChiffreAnime({
  valeur,
  duree = 1800,
  className,
}: {
  valeur: string;
  /** Durée de la montée, en millisecondes. */
  duree?: number;
  className?: string;
}) {
  const morceaux = useMemo(() => decoupe(valeur), [valeur]);
  const ref = useRef<HTMLSpanElement>(null);

  // Le serveur écrit la valeur finale : elle doit être dans la page pour qui
  // lit sans script, et pour les moteurs.
  const [affiche, setAffiche] = useState(valeur);
  const [anime, setAnime] = useState(false);

  // Remise à zéro avant que le navigateur ne peigne : réglée dans un effet
  // ordinaire, la valeur finale s'afficherait une image avant de retomber.
  useEffetAvantPeinture(() => {
    if (!morceaux) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAffiche(compose(0, morceaux));
    setAnime(true);
  }, [morceaux]);

  useEffect(() => {
    if (!anime || !morceaux) return;
    const noeud = ref.current;
    if (!noeud) return;

    let image = 0;
    let debut = 0;

    const avance = (t: number) => {
      if (!debut) debut = t;
      const part = Math.min((t - debut) / duree, 1);
      setAffiche(compose(morceaux.cible * freine(part), morceaux));
      if (part < 1) image = requestAnimationFrame(avance);
    };

    // La montée n'a de sens que vue : lancée hors écran, elle serait finie
    // quand le lecteur arrive.
    const guetteur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        guetteur.disconnect();
        image = requestAnimationFrame(avance);
      },
      { threshold: 0.4 }
    );
    guetteur.observe(noeud);

    return () => {
      guetteur.disconnect();
      cancelAnimationFrame(image);
    };
  }, [anime, morceaux, duree]);

  if (!morceaux) return <span className={className}>{valeur}</span>;

  return (
    <span ref={ref} className={className}>
      {/* La valeur défile trop vite pour être annoncée : les technologies
       * d'assistance lisent le chiffre final, une fois. */}
      <span aria-hidden="true">{affiche}</span>
      <span className="sr-only">{valeur}</span>
    </span>
  );
}
