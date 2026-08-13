import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import { Indicateur } from "@/components/site/LienNavigation";
import DateActualite from "@/components/site/DateActualite";
import { getActualites } from "@/lib/content";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Ateliers, missions et activités de l'Office National de la Population de Côte d'Ivoire.",
};

export default async function ActualitesPage() {
  const actualites = await getActualites();
  const [une, ...suite] = actualites;

  return (
    <>
      <PageHeader
        surtitre="À la une"
        titre="Actualités"
        chapeau="Les ateliers, missions et rencontres qui rythment l'activité de l'Office et de ses partenaires."
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        {/* L'article le plus récent occupe toute la largeur */}
        {une && (
          <article className="group" data-apparition>
            <Link
              href={`/actualites/${une.slug}`}
              className="grid gap-8 lg:grid-cols-2 lg:items-center"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={une.image}
                  alt={une.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div>
                <DateActualite date={une.date} source={une.source} />
                <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {une.titre}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {une.chapeau}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Lire l&apos;article
                  <Indicateur icone="fleche" />
                </span>
              </div>
            </Link>
          </article>
        )}

        <div className="mt-16 grid gap-x-6 gap-y-12 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {suite.map((a, i) => (
            <article
              key={a.slug}
              data-apparition
              data-apparition-retard={i * 80}
              className="group"
            >
              <Link href={`/actualites/${a.slug}`} className="flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={a.image}
                    alt={a.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <DateActualite date={a.date} source={a.source} />
                  <h2 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors">
                    {a.titre}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {a.chapeau}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
