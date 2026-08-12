import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
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

      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-16 lg:py-20 space-y-16">
        {groupes.map((groupe) => (
          <section key={groupe.categorie} aria-labelledby={`cat-${groupe.categorie}`}>
            <h2
              id={`cat-${groupe.categorie}`}
              className="font-display text-2xl font-bold tracking-tight"
            >
              {groupe.label}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {groupe.description}
            </p>

            <ul className="mt-7 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {groupe.publications.map((p) => (
                <li key={p.slug}>
                  {/* Le lien porte le document entier : toute la ligne est cliquable */}
                  <a
                    href={p.fichier}
                    download
                    className="group flex items-start gap-4 bg-card p-5 transition-colors hover:bg-muted/50"
                  >
                    <FileText
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium leading-snug group-hover:text-primary transition-colors">
                        {p.titre}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                        {p.resume}
                      </span>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        PDF · {poids(p.poidsKo)}
                        {p.annee ? ` · ${p.annee}` : ""}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 self-center rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors group-hover:border-primary group-hover:text-primary">
                      <Download className="size-3.5" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Télécharger</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
