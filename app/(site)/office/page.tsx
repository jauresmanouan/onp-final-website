import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import { getInstitution } from "@/lib/content";

export const metadata: Metadata = {
  title: "L'Office",
  description:
    "Missions, historique, organisation et direction de l'Office National de la Population de Côte d'Ivoire, établissement public créé par le décret n°2012-161 du 9 février 2012.",
};

/** Sommaire latéral : les ancres de la page, dans l'ordre de lecture. */
const SOMMAIRE = [
  { id: "presentation", label: "Présentation" },
  { id: "missions", label: "Missions" },
  { id: "impulsions", label: "Impulsions stratégiques" },
  { id: "historique", label: "Historique" },
  { id: "organisation", label: "Organisation" },
  { id: "direction", label: "Direction" },
];

export default async function OfficePage() {
  const {
    identite,
    presentation,
    missions,
    impulsions,
    historique,
    organisation,
    responsables,
    direction,
  } = await getInstitution();

  return (
    <>
      <PageHeader
        surtitre="L'institution"
        titre="L'Office"
        chapeau={presentation.chapeau}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* Sommaire, collé en haut sur grand écran */}
          <nav aria-label="Sommaire" className="lg:w-52">
            {/* Le bloc entier reste collé, titre compris : seule la liste
             * l'était, et l'intitulé « Sur cette page » disparaissait au
             * premier défilement, laissant des liens sans en-tête. */}
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sur cette page
              </p>
              <ul className="mt-4 space-y-2.5">
                {SOMMAIRE.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm text-foreground/75 hover:text-primary transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl space-y-20">
            {/* ── Présentation ─────────────────────────────── */}
            <section id="presentation" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Présentation
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-foreground/85">
                {presentation.corps.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>

              <dl className="mt-8 grid gap-x-8 gap-y-5 rounded-xl border border-border bg-muted/40 p-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Statut
                  </dt>
                  <dd className="mt-1 text-sm">{identite.statut}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Texte de création
                  </dt>
                  <dd className="mt-1 text-sm">{identite.decret}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tutelle technique
                  </dt>
                  <dd className="mt-1 text-sm">{identite.tutelleTechnique}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tutelle financière
                  </dt>
                  <dd className="mt-1 text-sm">{identite.tutelleFinanciere}</dd>
                </div>
              </dl>
            </section>

            {/* ── Missions ─────────────────────────────────── */}
            <section id="missions" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Missions
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Le décret de création confie sept missions à l&apos;Office.
              </p>
              <div className="mt-8 space-y-px overflow-hidden rounded-xl border border-border">
                {missions.map((m, i) => (
                  <article
                    key={m.titre}
                    className="flex gap-5 bg-card p-6 not-last:border-b not-last:border-border"
                  >
                    <span className="font-display text-lg font-bold text-primary tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold leading-snug">{m.titre}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {m.texte}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* ── Impulsions ───────────────────────────────── */}
            <section id="impulsions" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Impulsions stratégiques
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                L&apos;activité de l&apos;Office s&apos;organise autour de cinq
                impulsions.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {impulsions.map((texte, i) => (
                  <div
                    key={texte.slice(0, 30)}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <span className="font-display text-sm font-bold text-accent tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed">{texte}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Historique ───────────────────────────────── */}
            <section id="historique" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Historique
              </h2>
              <p className="mt-2 text-lg font-medium text-foreground/90">
                {historique.titre}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {historique.chapo}
              </p>

              {/* Chronologie : le filet vertical porte la continuité du récit */}
              <ol className="mt-10 space-y-9 border-l border-border pl-7">
                {historique.jalons.map((j) => (
                  <li key={j.periode} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[calc(1.75rem+4.5px)] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background"
                    />
                    <p className="font-display text-sm font-bold text-primary tabular-nums">
                      {j.periode}
                    </p>
                    <h3 className="mt-1 font-semibold leading-snug">{j.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {j.texte}
                    </p>
                  </li>
                ))}
              </ol>

              <p className="mt-8 border-l-2 border-accent pl-5 text-[15px] leading-relaxed">
                {historique.conclusion}
              </p>
            </section>

            {/* ── Organisation ─────────────────────────────── */}
            <section id="organisation" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Organisation
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-foreground/85">
                {organisation.ancrage}
              </p>

              <div className="mt-8 space-y-5">
                {organisation.organes.map((o) => (
                  <div key={o.nom} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold">{o.nom}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {o.texte}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="mt-12 font-display text-lg font-bold tracking-tight">
                Les quatre départements
              </h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {organisation.departements.map((d) => (
                  <div key={d.sigle} className="rounded-xl border border-border bg-card p-5">
                    <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 font-display text-xs font-bold text-primary">
                      {d.sigle}
                    </span>
                    <h4 className="mt-3 text-sm font-semibold leading-snug">{d.nom}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {d.texte}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[15px] leading-relaxed text-foreground/85">
                {organisation.equipe}
              </p>
            </section>

            {/* ── Direction ────────────────────────────────── */}
            <section id="direction" className="scroll-mt-28" data-apparition>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
                Direction
              </h2>

              <div className="mt-8 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
                <Image
                  src={direction.portrait}
                  alt={`Portrait de ${direction.nom}`}
                  width={220}
                  height={220}
                  className="size-28 shrink-0 rounded-xl object-cover object-top"
                />
                <div>
                  <p className="font-display text-lg font-bold tracking-tight">
                    {direction.nom}
                  </p>
                  <p className="mt-0.5 text-sm text-primary font-medium">
                    {direction.fonction}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {responsables[0].profil}
                  </p>
                </div>
              </div>

              <h3 className="mt-10 font-display text-lg font-bold tracking-tight">
                Les chefs de département
              </h3>
              <ul className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
                {responsables.slice(1).map((r) => (
                  <li key={r.nom} className="bg-card p-5">
                    <p className="font-semibold">{r.nom}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {r.fonction}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.profil}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
