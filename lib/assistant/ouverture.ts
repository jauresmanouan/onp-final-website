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
 * Sécurité : si la page d'arrivée n'efface pas le disque elle-même — route
 * inattendue, erreur de rendu — il s'en va tout seul.
 *
 * Le délai est large à dessein. À 2,2 s il arbitrait les navigations lentes :
 * la route n'avait pas fini de répondre, le secours effaçait le disque et
 * découvrait la page de départ, puis la conversation arrivait d'un bloc. Ce
 * minuteur n'est pas là pour rattraper une lenteur, seulement pour qu'un
 * disque orphelin ne reste pas à l'écran.
 */
const SECOURS_MS = 8000;

/** Le minuteur du disque en cours, pour l'annuler quand il s'en va. */
let secours: number | null = null;

/** D'où l'on venait, pour savoir comment et de quelle couleur repartir. */
const CLE_DEPART = "onp:depart-conversation";

export function retenirDepart(chemin: string) {
  try {
    sessionStorage.setItem(CLE_DEPART, chemin);
  } catch {
    // Session indisponible : le retour se fera sur les valeurs par défaut.
  }
}

/**
 * L'adresse quittée, lue une seule fois.
 *
 * Elle est consommée, et non simplement lue : une clé qui survit ferait
 * repartir vers le départ de la fois précédente. Un `null` signifie qu'on
 * n'est pas venu par le bouton — palette, lien collé, rechargement — et qu'il
 * n'y a donc nulle part où revenir.
 */
export function consommerDepart(): string | null {
  try {
    const depart = sessionStorage.getItem(CLE_DEPART);
    sessionStorage.removeItem(CLE_DEPART);
    return depart;
  } catch {
    return null;
  }
}

/**
 * La couleur du disque pour une adresse donnée.
 *
 * Le tableau de bord est vert sur presque toute sa hauteur : un disque blanc
 * qui s'y efface fait un éclair, exactement ce qu'on cherchait à supprimer.
 */
export function couleurPour(chemin: string | null): string {
  return chemin?.startsWith("/dashboard") ? "var(--panel)" : "var(--background)";
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
    // Le disque arrête les clics. Il les laissait passer, si bien qu'un lien
    // resté visible sous un écran couvert pouvait lancer une seconde
    // navigation par-dessus la première. Sa suppression étant garantie des
    // deux côtés, plus le minuteur de secours, il n'y a plus de risque de
    // bloquer la page.
    pointerEvents: "auto",
    transform: "translate(-50%, -50%) scale(0)",
    willChange: "transform",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(voile);

  // Le minuteur précédent est remplacé, jamais laissé courir : sinon celui de
  // la transition d'avant venait effacer le disque de celle-ci en plein vol.
  if (secours !== null) window.clearTimeout(secours);
  secours = window.setTimeout(() => retirerVoile(), SECOURS_MS);

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

  if (secours !== null) {
    window.clearTimeout(secours);
    secours = null;
  }

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
