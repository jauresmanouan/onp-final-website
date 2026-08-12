import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import DateActualite from "@/components/site/DateActualite";
import { getActualite, getActualites, getActualiteSlugs } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

/** Prérend une page par article : le contenu est statique par nature. */
export async function generateStaticParams() {
  const slugs = await getActualiteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getActualite(slug);
  if (!a) return { title: "Article introuvable" };

  return {
    title: a.titre,
    description: a.chapeau,
    openGraph: {
      title: a.titre,
      description: a.chapeau,
      images: [a.image],
      type: "article",
      ...(a.date ? { publishedTime: a.date } : {}),
    },
  };
}

export default async function ActualitePage({ params }: Props) {
  const { slug } = await params;
  const article = await getActualite(slug);
  if (!article) notFound();

  const autres = (await getActualites()).filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        surtitre="Actualité"
        titre={article.titre}
        fil={[{ href: "/actualites", label: "Actualités" }]}
        compact
      />

      <article className="mx-auto max-w-3xl px-6 lg:px-10 py-14 lg:py-16">
        <DateActualite date={article.date} source={article.source} />

        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={article.image}
            alt={article.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>

        <p className="mt-8 text-lg leading-relaxed font-medium text-foreground/90">
          {article.chapeau}
        </p>

        <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-foreground/85">
          {article.corps.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        <Link
          href="/actualites"
          className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          <ArrowLeft className="size-4" />
          Toutes les actualités
        </Link>
      </article>

      {autres.length > 0 && (
        <section
          aria-labelledby="autres-titre"
          className="border-t border-border bg-muted/30"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="autres-titre"
                className="font-display text-2xl font-bold tracking-tight"
              >
                À lire également
              </h2>
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Toutes les actualités
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {autres.map((a) => (
                <article key={a.slug} className="group">
                  <Link href={`/actualites/${a.slug}`} className="flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={a.image}
                        alt={a.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4">
                      <DateActualite date={a.date} source={a.source} />
                      <h3 className="mt-2 font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                        {a.titre}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
