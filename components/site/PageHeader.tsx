import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  surtitre: string;
  titre: string;
  chapeau?: string;
  /** Fil d'Ariane, l'accueil étant ajouté automatiquement en tête. */
  fil?: { href: string; label: string }[];
  /**
   * Titre d'article : la taille de rubrique écraserait la page, et le fil
   * d'Ariane déborderait sur plusieurs lignes.
   */
  compact?: boolean;
};

/**
 * En-tête commun aux pages intérieures. Il reprend le fond du panneau pour
 * que le passage d'une rubrique à l'autre reste continu, et porte le fil
 * d'Ariane, qui situe la page dans le site.
 */
export default function PageHeader({
  surtitre,
  titre,
  chapeau,
  fil = [],
  compact = false,
}: Props) {
  return (
    <section className="bg-panel text-panel-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-14 lg:pt-12 lg:pb-16">
        <nav aria-label="Fil d'Ariane" className="text-xs text-panel-foreground/70">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-panel-foreground transition-colors">
                Accueil
              </Link>
            </li>
            {fil.map((f) => (
              <li key={f.href} className="flex items-center gap-1.5">
                <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
                <Link href={f.href} className="hover:text-panel-foreground transition-colors">
                  {f.label}
                </Link>
              </li>
            ))}
            <li className="flex min-w-0 items-center gap-1.5" aria-current="page">
              <ChevronRight className="size-3 shrink-0 opacity-60" aria-hidden="true" />
              <span className="max-w-[20rem] truncate text-panel-foreground">
                {titre}
              </span>
            </li>
          </ol>
        </nav>

        {/* Surtitre, titre et chapeau montent l'un après l'autre : le
          * regard suit l'ordre de lecture au lieu de tout recevoir d'un
          * bloc. Le fil d'Ariane, lui, reste immobile — c'est un repère, pas
          * une entrée en matière. */}
        <div className="entree-titre">
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {surtitre}
        </p>
        <h1
          className={`mt-3 font-display font-bold tracking-tight leading-[1.15] ${
            compact
              ? "max-w-4xl text-2xl sm:text-3xl lg:text-4xl"
              : "text-4xl lg:text-5xl"
          }`}
        >
          {titre}
        </h1>
        {chapeau && (
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-panel-foreground/85">
            {chapeau}
          </p>
        )}
        </div>
      </div>
    </section>
  );
}
