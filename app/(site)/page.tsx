import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getChiffresCles } from "@/lib/siteStats";
import { getActualites, getInstitution, getPartenaires } from "@/lib/content";

export const metadata: Metadata = {
  title: "Office National de la Population",
  description:
    "L'Office National de la Population conçoit la politique de population de la Côte d'Ivoire, produit les projections démographiques et suit le dividende démographique.",
};

export default async function AccueilPage() {
  const [chiffres, actualites, partenaires, institution] = await Promise.all([
    getChiffresCles(),
    getActualites(3),
    getPartenaires(),
    getInstitution(),
  ]);
  const { identite, presentation, missions } = institution;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────
       * Construit sur la typographie, les emblèmes et les chiffres plutôt
       * que sur une photographie : un observatoire se présente par ce qu'il
       * mesure, et le fonds photographique disponible ne soutient pas un
       * plein écran.
       */}
      <section className="relative overflow-hidden bg-panel text-panel-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-white/5 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium">
                <Image
                  src="/emblemes/drapeau-ci.svg"
                  alt=""
                  width={18}
                  height={12}
                  className="h-3 w-auto rounded-[2px]"
                />
                République de Côte d&apos;Ivoire
              </p>

              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                {identite.baseline}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-panel-foreground/85">
                {presentation.chapeau}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  Consulter la banque de données
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link
                  href="/office"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  Découvrir l&apos;Office
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <Image
                src="/emblemes/armoiries-ci.svg"
                alt="Armoiries de la République de Côte d'Ivoire"
                width={320}
                height={320}
                className="mx-auto h-52 w-auto opacity-95 lg:h-72"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ─────────────────────────────────────── */}
      <section
        aria-labelledby="chiffres-titre"
        className="border-b border-border bg-background"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
          <h2 id="chiffres-titre" className="sr-only">
            La population ivoirienne en chiffres
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {chiffres.map((c) => (
              <div key={c.intitule} className="border-l-2 border-primary pl-5">
                <p className="font-display text-3xl lg:text-4xl font-bold tracking-tight tabular-nums">
                  {c.valeur}
                </p>
                <p className="mt-1.5 font-medium">{c.intitule}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-snug">
                  {c.precision}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'Office ──────────────────────────────────────────── */}
      <section aria-labelledby="office-titre" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                L&apos;institution
              </p>
              <h2
                id="office-titre"
                className="mt-3 font-display text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
              >
                Éclairer la décision publique par la connaissance de la
                population
              </h2>
              <Link
                href="/office"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Missions et organisation
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="space-y-5 text-[15px] leading-relaxed text-foreground/85">
              {presentation.corps.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>

          {/* Trois missions parmi les sept, présentées en cartes numérotées */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {missions.slice(0, 3).map((m, i) => (
              <article
                key={m.titre}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <p className="font-display text-2xl font-bold text-primary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-semibold leading-snug">{m.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {m.texte}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actualités ────────────────────────────────────────── */}
      <section aria-labelledby="actus-titre" className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                À la une
              </p>
              <h2
                id="actus-titre"
                className="mt-3 font-display text-3xl lg:text-4xl font-bold tracking-tight"
              >
                Les activités de l&apos;Office
              </h2>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Toutes les actualités
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {actualites.map((a) => (
              <article
                key={a.slug}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                <Link href={`/actualites/${a.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={a.image}
                      alt={a.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    {a.date && (
                      <time
                        dateTime={a.date}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        {formatDate(a.date)}
                      </time>
                    )}
                    <h3 className="mt-2 font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                      {a.titre}
                    </h3>
                    <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {a.chapeau}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banque de données ─────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="overflow-hidden rounded-2xl bg-panel text-panel-foreground">
            <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-14">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                  Les données démographiques, ouvertes à tous
                </h2>
                <p className="mt-5 max-w-xl leading-relaxed text-panel-foreground/85">
                  Pyramides des âges des recensements de 1988, 1998 et 2021,
                  indicateurs de santé, indices du dividende démographique et
                  cartographie par district. Les séries sont consultables en
                  ligne et téléchargeables au format CSV pour vos propres
                  analyses.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  Ouvrir la banque de données
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <Image
                src="/carte_ci.svg"
                alt=""
                width={420}
                height={420}
                className="mx-auto h-56 w-auto opacity-90 lg:h-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Partenaires ───────────────────────────────────────── */}
      <section aria-labelledby="partenaires-titre" className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <h2
            id="partenaires-titre"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Partenaires techniques, financiers et scientifiques
          </h2>
          {/* Les logos sont hétérogènes : plusieurs sont des JPEG à fond
           * blanc opaque. Une pastille claire les accueille tous et préserve
           * leurs couleurs dans les deux thèmes, là où un filtre de teinte
           * transformerait les JPEG en rectangles pleins. */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {partenaires.map((p) => (
              <a
                key={p.nom}
                href={p.site}
                target="_blank"
                rel="noreferrer noopener"
                title={p.intitule}
                className="flex h-16 w-36 items-center justify-center rounded-lg border border-border bg-white px-4 py-3 transition-shadow hover:shadow-md"
              >
                <Image
                  src={p.logo}
                  alt={p.intitule ?? p.nom}
                  width={160}
                  height={64}
                  className="max-h-9 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDate(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
}
