import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Download } from "lucide-react";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import PageHeader from "@/components/site/PageHeader";
import { getPublicationsParCategorie } from "@/lib/content";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Notes de politique, études et rapports de l'Office National de la Population de Côte d'Ivoire, en téléchargement libre.",
};

/** 6480 Ko devient « 6,3 Mo » ; en dessous du méga, on reste en kilo-octets. */
function poids(ko: number): string {
  return ko >= 1024
    ? `${(ko / 1024).toFixed(1).replace(".", ",")} Mo`
    : `${ko} Ko`;
}

export default async function PublicationsPage() {
  const groupes = await getPublicationsParCategorie();
  const total = groupes.reduce((n, g) => n + g.publications.length, 0);

  return (
    <>
      <PageHeader
        surtitre="Ressources"
        titre="Publications"
        chapeau={`Les ${total} documents publiés par l'Office, en téléchargement libre : notes de politique sur le dividende démographique, études de fond et rapports institutionnels.`}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20 space-y-16">
        {groupes.map((groupe) => (
          <section
            key={groupe.categorie}
            aria-labelledby={`cat-${groupe.categorie}`}
            data-apparition
          >
            <h2
              id={`cat-${groupe.categorie}`}
              className="font-display text-2xl font-bold tracking-tight"
            >
              {groupe.label}
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              {groupe.description}
            </p>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groupe.publications.map((p, i) => (
                <li key={p.slug} data-apparition data-apparition-retard={i * 70}>
                  {/* Deux gestes distincts, et non plus un seul : la carte
                    * entière ouvrait le PDF en téléchargement, si bien qu'on
                    * ne pouvait pas lire un document sans d'abord l'enregistrer.
                    * La couverture et le titre l'ouvrent maintenant dans la
                    * visionneuse du navigateur ; l'enregistrement reste
                    * possible, en bas, à qui le veut vraiment. */}
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    <a
                      href={p.fichier}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      {/* Ratio A4, comme la page rendue : la couverture entre
                       * entière dans le cadre, sans recadrage. */}
                      <div className="relative aspect-[1/1.414] overflow-hidden bg-muted">
                        <Image
                          src={p.apercu}
                          alt={`Couverture de « ${p.titre} »`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-1 text-[11px] font-semibold backdrop-blur">
                          PDF · {poids(p.poidsKo)}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                          {p.titre}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {p.resume}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          <BookOpen className="size-4" aria-hidden="true" />
                          Consulter
                          <NouvelleFenetre />
                          {p.annee ? (
                            <span className="font-normal text-muted-foreground">
                              · {p.annee}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </a>

                    <a
                      href={p.fichier}
                      download
                      className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      Télécharger le PDF
                      <span className="ml-auto tabular-nums">
                        {poids(p.poidsKo)}
                      </span>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
