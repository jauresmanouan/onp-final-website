/**
 * Le disque qui fait passer d'une page à l'autre.
 *
 * Première version : la page d'arrivée se découpait elle-même en `clip-path`
 * depuis les coordonnées du bouton. Cela dépendait du moment exact où Next
 * montait la nouvelle route et où le navigateur la peignait — deux instants
 * qu'on ne maîtrise pas, et le mouvement passait à l'as.
 *
 * Ici le disque est un élément réel, posé dans `body` sur la page de départ,
 * pendant que le visiteur la regarde encore. Il grandit depuis le bouton
 * jusqu'à couvrir l'écran, et seulement ensuite la navigation part. Comme il
 * est accroché au `body` et non à l'arbre React, il survit au changement de
 * page : la page d'arrivée se peint dessous, puis le disque s'efface et la
 * découvre. Rien de tout cela ne dépend d'une frame précise.
 *
 * Il porte la couleur du fond d'arrivée, ce qui rend la jointure invisible :
 * on ne voit pas un voile se lever, on voit la page se remplir.
 */

const ID_VOILE = "onp-voile-transition";

/** Durée de la croissance, puis de l'effacement. */
const OUVERTURE_MS = 520;
const EFFACEMENT_MS = 380;

/**
 * Sécurité : si la page d'arrivée n'efface pas le disque elle-même — retour
 * arrière, route inattendue, erreur — il s'en va tout seul. Un voile resté
 * en place rendrait le site inutilisable.
 */
const SECOURS_MS = 2200;

/** D'où l'on venait, pour savoir de quelle couleur repartir. */
const CLE_DEPART = "onp:depart-conversation";

export function retenirDepart(chemin: string) {
  try {
    sessionStorage.setItem(CLE_DEPART, chemin);
  } catch {
    // Session indisponible : le retour se fera sur la couleur par défaut.
  }
}

/**
 * La couleur du disque au retour.
 *
 * Le tableau de bord est vert sur presque toute sa hauteur : un disque blanc
 * qui s'y efface fait un éclair, exactement ce qu'on cherchait à supprimer.
 * On reprend donc la teinte de la page vers laquelle on revient.
 */
export function couleurRetour(): string {
  try {
    const depart = sessionStorage.getItem(CLE_DEPART);
    if (depart?.startsWith("/dashboard")) return "var(--panel)";
  } catch {
    /* rien : la couleur par défaut convient */
  }
  return "var(--background)";
}

export function animationsReduites(): boolean {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Rayon nécessaire pour couvrir l'écran depuis un point donné. */
function rayonCouvrant(x: number, y: number): number {
  const l = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, l - x), Math.max(y, h - y));
}

/**
 * Fait grandir le disque depuis l'élément cliqué et rend la main quand
 * l'écran est couvert. La couleur est une valeur CSS : on passe le jeton du
 * fond d'arrivée, pas une teinte en dur, pour que les deux thèmes suivent.
 */
export function ouvrirVoile(
  depuis: HTMLElement | null,
  couleur: string,
): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();

  retirerVoile(true);

  const cadre = depuis?.getBoundingClientRect();
  const x = cadre ? cadre.left + cadre.width / 2 : window.innerWidth / 2;
  const y = cadre ? cadre.top + cadre.height / 2 : 0;
  const rayon = rayonCouvrant(x, y);

  const voile = document.createElement("div");
  voile.id = ID_VOILE;
  voile.setAttribute("aria-hidden", "true");
  Object.assign(voile.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: "2px",
    height: "2px",
    borderRadius: "9999px",
    background: couleur,
    // Au-dessus de tout, en-têtes collants compris.
    zIndex: "100",
    pointerEvents: "none",
    transform: "translate(-50%, -50%) scale(0)",
    willChange: "transform",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(voile);

  window.setTimeout(() => retirerVoile(), SECOURS_MS);

  const croissance = voile.animate(
    [
      { transform: "translate(-50%, -50%) scale(0)" },
      { transform: `translate(-50%, -50%) scale(${rayon})` },
    ],
    {
      duration: OUVERTURE_MS,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    },
  );

  return croissance.finished.then(() => undefined).catch(() => undefined);
}

/**
 * Efface le disque et le retire. Appelé par la page d'arrivée une fois
 * qu'elle est montée : c'est ce qui la découvre.
 */
export function retirerVoile(immediat = false) {
  if (typeof document === "undefined") return;
  const voile = document.getElementById(ID_VOILE);
  if (!voile) return;

  if (immediat || animationsReduites()) {
    voile.remove();
    return;
  }

  // L'identifiant part tout de suite : un second passage ne doit pas retomber
  // sur un disque déjà en train de disparaître.
  voile.removeAttribute("id");
  voile
    .animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: EFFACEMENT_MS,
      easing: "ease-out",
      fill: "forwards",
    })
    .finished.catch(() => undefined)
    .finally(() => voile.remove());
}
