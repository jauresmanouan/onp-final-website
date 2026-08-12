import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const PISTES = [
  { href: "/office", label: "L'Office", texte: "Missions, historique et organisation" },
  { href: "/actualites", label: "Actualités", texte: "Les activités de l'Office" },
  { href: "/publications", label: "Publications", texte: "Notes, études et rapports" },
  { href: "/dashboard", label: "Banque de données", texte: "Indicateurs et cartographie" },
];

/**
 * Page d'erreur 404. Elle reprend l'ossature du site plutôt qu'une page nue :
 * un visiteur perdu doit pouvoir repartir sans revenir en arrière.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-panel text-panel-foreground">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-24">
            <p className="font-display text-6xl lg:text-7xl font-bold tracking-tighter tabular-nums opacity-40">
              404
            </p>
            <h1 className="mt-4 font-display text-3xl lg:text-4xl font-bold tracking-tight">
              Cette page n&apos;existe pas
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-panel-foreground/85">
              L&apos;adresse demandée est introuvable. Elle a peut-être changé
              lors de la refonte du site, ou comporte une erreur de saisie.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
            >
              Retour à l&apos;accueil
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Vous cherchiez peut-être
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PISTES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <span className="font-semibold group-hover:text-primary transition-colors">
                    {p.label}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {p.texte}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Image
            src="/emblemes/armoiries-ci.svg"
            alt=""
            aria-hidden="true"
            width={120}
            height={120}
            className="mt-16 h-16 w-auto opacity-20"
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
