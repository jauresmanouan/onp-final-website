import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import { getPartenaires, getLiensInstitutionnels } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Agences des Nations Unies, bailleurs et centres de recherche qui accompagnent l'Office National de la Population de Côte d'Ivoire.",
};

export default async function PartenairesPage() {
  const [partenaires, liens] = await Promise.all([
    getPartenaires(),
    getLiensInstitutionnels(),
  ]);

  return (
    <>
      <PageHeader
        surtitre="Coopération"
        titre="Partenaires"
        chapeau="Agences des Nations Unies, bailleurs et centres de recherche soutiennent les travaux de l'Office sur la population, les migrations et le dividende démographique."
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partenaires.map((p, i) => (
            <li key={p.nom} data-apparition data-apparition-retard={i * 70}>
              <a
                href={p.site}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex h-full flex-col gap-5 rounded-xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Pastille claire : plusieurs logos sont des JPEG à fond
                 * blanc opaque, qu'aucun filtre de teinte ne peut adapter. */}
                <span className="flex h-20 items-center justify-center rounded-lg bg-white px-6">
                  <Image
                    src={p.logo}
                    alt=""
                    width={200}
                    height={80}
                    className="max-h-11 w-auto object-contain"
                  />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-display text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                    {p.nom}
                  </span>
                  <span className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.intitule}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Site officiel
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <section aria-labelledby="institutions-titre" className="mt-20">
          <h2
            id="institutions-titre"
            className="font-display text-2xl font-bold tracking-tight"
          >
            Institutions de la République
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            L&apos;Office travaille en lien avec les ministères dont les
            politiques sectorielles rencontrent les questions de population.
          </p>

          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {liens.map((l) => (
              <li key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="group-hover:text-primary transition-colors">
                    {l.nom}
                    <NouvelleFenetre />
                  </span>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 text-[15px] leading-relaxed text-muted-foreground">
          Les travaux menés avec ces partenaires sont documentés dans les{" "}
          <Link href="/publications" className="font-medium text-primary hover:underline">
            publications de l&apos;Office
          </Link>{" "}
          et dans ses{" "}
          <Link href="/actualites" className="font-medium text-primary hover:underline">
            actualités
          </Link>
          .
        </p>
      </div>
    </>
  );
}
