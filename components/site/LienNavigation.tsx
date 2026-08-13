"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Icone = "fleche" | "externe" | "retour";

const ICONES = {
  fleche: ArrowRight,
  externe: ArrowUpRight,
  retour: ArrowLeft,
} as const;

/**
 * Bascule entre l'icône du lien et l'anneau de chargement.
 *
 * `useLinkStatus` ne renseigne que depuis l'intérieur d'un `Link`, d'où ce
 * composant séparé. La zone garde une largeur fixe : sans elle, l'échange
 * d'icône décalait le libellé au moment du clic.
 *
 * Sur une route déjà préchargée, la navigation aboutit avant que l'anneau
 * n'ait le temps de paraître. C'est le comportement voulu : l'attente ne
 * s'annonce que lorsqu'il y a vraiment attente.
 */
export function Indicateur({ icone }: { icone: Icone }) {
  const { pending } = useLinkStatus();
  const Icone = ICONES[icone];

  return (
    <span className="relative size-4 shrink-0">
      <Icone
        aria-hidden="true"
        className={cn(
          "absolute inset-0 size-4 transition-all duration-200",
          pending ? "scale-75 opacity-0" : "scale-100 opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute inset-0 transition-all duration-200",
          pending ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
      >
        <Spinner className="size-4" />
      </span>
      {pending && (
        <span role="status" className="sr-only">
          Chargement de la page
        </span>
      )}
    </span>
  );
}

/**
 * Libellé du bouton pendant la navigation.
 *
 * L'anneau seul dit qu'il se passe quelque chose, pas ce qui se passe. Sur les
 * pages lourdes — le tableau de bord et ses séries — l'attente se compte en
 * secondes : le bouton l'annonce en toutes lettres. Les deux libellés sont
 * superposés dans la même case de grille, si bien que le bouton garde la
 * largeur du plus long des deux : il ne se déforme pas sous le curseur au
 * moment du clic.
 */
function LibelleBouton({
  children,
  libelleChargement,
}: {
  children: React.ReactNode;
  libelleChargement: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <span className="relative inline-grid place-items-center">
      <span
        className={cn(
          "col-start-1 row-start-1 transition-opacity duration-200",
          pending ? "opacity-0" : "opacity-100"
        )}
      >
        {children}
      </span>
      <span
        aria-hidden={!pending}
        className={cn(
          "col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-200",
          pending ? "opacity-100" : "opacity-0"
        )}
      >
        {libelleChargement}
      </span>
    </span>
  );
}

const VARIANTES = {
  accent:
    "rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]",
  primary:
    "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
  contour:
    "rounded-lg border border-white/25 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10",
} as const;

/** Appel à l'action plein, avec anneau de chargement pendant la navigation. */
export function BoutonLien({
  href,
  children,
  variante = "accent",
  // Flèche droite par défaut : la flèche inclinée annonce une sortie du site,
  // or la banque de données en fait partie.
  icone = "fleche",
  /** Libellé affiché pendant la navigation, pour les destinations lentes. */
  libelleChargement,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variante?: keyof typeof VARIANTES;
  icone?: Icone;
  libelleChargement?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        VARIANTES[variante],
        className
      )}
    >
      {libelleChargement ? (
        <LibelleBouton libelleChargement={libelleChargement}>
          {children}
        </LibelleBouton>
      ) : (
        children
      )}
      <Indicateur icone={icone} />
    </Link>
  );
}

/**
 * Lien de rubrique, celui qui se termine par une flèche. La flèche avance au
 * survol et cède la place à l'anneau pendant le chargement.
 */
export function LienFleche({
  href,
  children,
  icone = "fleche",
  className,
}: {
  href: string;
  children: React.ReactNode;
  icone?: Icone;
  className?: string;
}) {
  // Un lien de retour porte sa flèche à gauche : elle désigne le sens du
  // mouvement, elle ne peut pas suivre le libellé.
  const retour = icone === "retour";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold text-primary outline-none transition-all hover:gap-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
        className
      )}
    >
      {retour && <Indicateur icone={icone} />}
      {children}
      {!retour && <Indicateur icone={icone} />}
    </Link>
  );
}
