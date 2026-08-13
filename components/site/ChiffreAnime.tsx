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
 * Le chiffre est tiré vers sa valeur par un ressort critiquement amorti,
 * plutôt que posé sur une courbe de durée fixe.
 *
 * Une courbe en puissance atteignait quatre-vingt-dix pour cent de la valeur
 * dans le premier tiers du temps, puis se traînait : le nombre semblait figé
 * et sautait d'un cran de loin en loin. Le ressort, lui, ralentit sans
 * jamais s'arrêter, parce que sa vitesse décroît en même temps que la
 * distance restante. C'est le mouvement que fait une porte à fermeture douce.
 *
 * Critiquement amorti, il ne dépasse jamais la valeur, ce qui compte ici :
 * une population qui monte à 29,6 avant de redescendre à 29,4 serait un
 * contresens sur une donnée publique.
 */
type Ressort = { position: number; vitesse: number };

/**
 * Avance le ressort d'un pas de temps.
 *
 * `pulsation` fixe la vivacité : plus elle est haute, plus le chiffre rejoint
 * vite sa valeur. Le pas est plafonné, un onglet remis au premier plan après
 * une pause livrant un écart de plusieurs secondes qui ferait diverger le
 * calcul.
 */
function avanceRessort(
  r: Ressort,
  cible: number,
  pulsation: number,
  pas: number
): void {
  const dt = Math.min(pas, 1 / 30);
  const acceleration =
    -2 * pulsation * r.vitesse - pulsation * pulsation * (r.position - cible);
  r.vitesse += acceleration * dt;
  r.position += r.vitesse * dt;
}

/**
 * Raideur à donner au ressort pour qu'il arrive au bout dans le temps voulu.
 *
 * Sans ce calcul, la raideur serait la même pour tous les chiffres et chacun
 * se poserait à son heure : « 7 » a sept crans à parcourir, « 61,5 » en a six
 * cent quinze, si bien que le premier finissait en une seconde quand le
 * second en mettait deux et demie, les quatre mesures de l'ouverture arrivant
 * en ordre dispersé.
 *
 * Un ressort critiquement amorti lâché sans vitesse laisse une distance
 * (1 + u)·e^-u de sa course, u étant le produit de la pulsation par le temps.
 * On cherche donc le u qui laisse exactement un cran d'affichage, puis on en
 * déduit la pulsation. L'équation ne se renverse pas, mais elle décroît sans
 * détour : vingt bissections suffisent à la résoudre au millième.
 */
function pulsationPour(course: number, cran: number, duree: number): number {
  const reste = Math.min(cran / course, 0.9);
  let bas = 0;
  let haut = 40;
  for (let i = 0; i < 20; i++) {
    const u = (bas + haut) / 2;
    if ((1 + u) * Math.exp(-u) > reste) bas = u;
    else haut = u;
  }
  return ((bas + haut) / 2) / (duree / 1000);
}

/**
 * Réglage du flou de mouvement, en em par unité de vitesse relative, et son
 * plafond. Deux nombres à toucher pour l'accentuer ou l'effacer : au plafond,
 * le grand chiffre de l'ouverture est flouté d'environ cinq pixels, les
 * mesures du dessous d'un seul.
 */
const FLOU_FACTEUR = 0.024;
const FLOU_MAX = 0.028;

// Appeler useLayoutEffect au rendu serveur déclenche un avertissement React.
const useEffetAvantPeinture =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function ChiffreAnime({
  valeur,
  duree = 1800,
  className,
}: {
  valeur: string;
  /**
   * Temps que met le chiffre à se poser, en millisecondes. La raideur du
   * ressort en découle, si bien que deux chiffres d'ampleurs différentes
   * arrivent ensemble.
   */
  duree?: number;
  className?: string;
}) {
  const morceaux = useMemo(() => decoupe(valeur), [valeur]);
  const ref = useRef<HTMLSpanElement>(null);

  // Le serveur écrit la valeur finale : elle doit être dans la page pour qui
  // lit sans script, et pour les moteurs. Tant que l'hydratation n'a pas eu
  // lieu, elle est cachée par la feuille de style, faute de quoi elle
  // s'affichait pleine avant de retomber à zéro.
  const [affiche, setAffiche] = useState(valeur);
  const [phase, setPhase] = useState<"attente" | "fixe" | "anime" | "pose">(
    "attente"
  );
  // Flou de mouvement, en em : il suit la vitesse du ressort, donc s'efface
  // de lui-même à mesure que le chiffre ralentit. L'unité relative le met à
  // l'échelle du texte, le même flou en pixels noyant les petites mesures
  // pendant qu'il se voit à peine sur le grand chiffre.
  const [flou, setFlou] = useState(0);

  useEffetAvantPeinture(() => {
    if (!morceaux || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Rien à animer : le chiffre se découvre tel quel.
      setPhase("fixe");
      return;
    }
    setAffiche(compose(0, morceaux));
    setPhase("anime");
  }, [morceaux]);
  const anime = phase === "anime";

  useEffect(() => {
    if (!anime || !morceaux) return;
    const noeud = ref.current;
    if (!noeud) return;

    let image = 0;
    let precedent = 0;
    const r: Ressort = { position: 0, vitesse: 0 };

    // Le dernier cran d'affichage est celui qui traîne : la vitesse y est si
    // faible qu'il tenait l'écran un demi-tiers de seconde sans rien changer.
    // On s'arrête un cran avant et on pose la valeur exacte.
    const cran = Math.pow(10, -morceaux.decimales);
    const pulsation = pulsationPour(morceaux.cible, cran, duree);

    const avance = (t: number) => {
      if (!precedent) precedent = t;
      const pas = (t - precedent) / 1000;
      precedent = t;

      avanceRessort(r, morceaux.cible, pulsation, pas);

      const reste = Math.abs(morceaux.cible - r.position);
      if (reste < cran) {
        setAffiche(compose(morceaux.cible, morceaux));
        setFlou(0);
        setPhase("pose");
        return;
      }

      setAffiche(compose(r.position, morceaux));
      // La vitesse est rapportée à la course, sans quoi « 61,5 » serait
      // beaucoup plus flou que « 7 » pour un mouvement d'apparence égale.
      const allure = Math.abs(r.vitesse) / (morceaux.cible || 1);
      setFlou(Math.min(allure * FLOU_FACTEUR, FLOU_MAX));
      image = requestAnimationFrame(avance);
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
      <span
        aria-hidden="true"
        // La feuille de style cache cet attribut tant que le script n'a pas
        // repris la main. Sans script, la classe qui l'active n'existe pas
        // et le chiffre reste lisible.
        data-chiffre={phase === "attente" ? "attente" : undefined}
        className={phase === "pose" ? "rebond-chiffre" : undefined}
        style={flou > 0 ? { filter: `blur(${flou.toFixed(3)}em)` } : undefined}
      >
        {affiche}
      </span>
      <span className="sr-only">{valeur}</span>
    </span>
  );
}
