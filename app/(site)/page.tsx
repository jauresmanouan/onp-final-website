import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getChiffresCles } from "@/lib/siteStats";
import {
  getActualites,
  getAnnonce,
  getInstitution,
  getPartenaires,
} from "@/lib/content";
import BandeauAnnonce from "@/components/site/BandeauAnnonce";
import ChiffreAnime from "@/components/site/ChiffreAnime";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import { BoutonLien, LienFleche } from "@/components/site/LienNavigation";
import { CHIFFRES } from "@/content/site/destinations";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SqueletteCartes,
  SqueletteChiffres,
  SqueletteTexte,
} from "@/components/site/Squelettes";

export const metadata: Metadata = {
  title: "Office National de la Population",
  description:
    "L'Office National de la Population conçoit la politique de population de la Côte d'Ivoire, produit les projections démographiques et suit le dividende démographique.",
};

/**
 * Page d'accueil.
 *
 * Chaque section va chercher ses propres données et s'affiche dès qu'elles
 * arrivent, sans attendre les autres. La page était auparavant suspendue à un
 * `Promise.all` : la plus lente des cinq sources retenait l'ouverture, alors
 * que le grand chiffre du recensement n'a besoin que d'un fichier. Le jour où
 * le contenu viendra de Strapi, cette découpe fera la différence entre une
 * page qui se remplit et une page qui attend.
 */
export default function AccueilPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Annonce />
      </Suspense>

      <Suspense fallback={<AttenteOuverture />}>
        <Ouverture />
      </Suspense>

      <Suspense fallback={<AttenteOffice />}>
        <Office />
      </Suspense>

      <Suspense fallback={<AttenteActualites />}>
        <Actualites />
      </Suspense>

      <BanqueDeDonnees />

      <Suspense fallback={<AttentePartenaires />}>
        <Partenaires />
      </Suspense>
    </>
  );
}

/* ── Bandeau d'information ───────────────────────────────────────── */

async function Annonce() {
  const annonce = await getAnnonce();
  return annonce ? <BandeauAnnonce annonce={annonce} /> : null;
}

/* ── Ouverture ───────────────────────────────────────────────────────
 * Le site s'ouvre sur ce qu'il mesure. Le chiffre du recensement tient la
 * page, les autres se rangent dessous, et les armoiries restent en filigrane :
 * elles situent l'institution sans disputer la lecture.
 */

/** Fond commun à la section et à son attente, pour que rien ne saute. */
function CadreOuverture({ children }: { children: React.ReactNode }) {
  return (
    // Le retrait latéral n'arrive qu'aux très grandes largeurs : appliqué à
    // toutes les tailles, il ne laissait plus de place au chiffre sur
    // téléphone. Le conteneur interne garde l'alignement des autres sections.
    <section className="relative overflow-hidden bg-panel text-panel-foreground 2xl:px-24">
      <Image
        src="/emblemes/armoiries-ci.svg"
        alt=""
        aria-hidden="true"
        width={900}
        height={820}
        priority
        className="pointer-events-none absolute -right-16 top-1/2 hidden h-[130%] w-auto -translate-y-1/2 opacity-[0.07] md:block"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-14 lg:pt-20 lg:pb-16">
        {children}
      </div>
    </section>
  );
}

async function Ouverture() {
  const [chiffres, institution] = await Promise.all([
    getChiffresCles(),
    getInstitution(),
  ]);
  const { identite, missions } = institution;
  const { principal } = chiffres;

  // Le nombre de missions complète les mesures tirées des CSV : il dit ce que
  // l'Office fait, là où les autres chiffres disent ce qu'il observe.
  const secondaires = [
    ...chiffres.secondaires,
    {
      valeur: String(missions.length),
      intitule: "Missions",
      precision: "Confiées par le décret de création",
    },
  ];

  return (
    <CadreOuverture>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold tracking-tight">
        {identite.baseline}
      </h1>

      {principal && (
        <div className="mt-12 lg:mt-16">
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <ChiffreAnime
              valeur={principal.valeur}
              duree={2200}
              className="font-display text-[clamp(4.5rem,15vw,11rem)] font-bold leading-[0.85] tracking-tighter tabular-nums"
            />
            <span className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-accent">
              {principal.unite}
            </span>
          </p>
          <p className="mt-4 text-lg text-panel-foreground/80">
            {principal.precision}
          </p>
        </div>
      )}

      {/* Les autres mesures, séparées par des filets */}
      <dl className="mt-14 grid grid-cols-2 gap-y-8 border-t border-white/15 pt-8 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
        {secondaires.map((c, i) => (
          <div key={c.intitule} className={i > 0 ? "lg:pl-8" : "lg:pr-8"}>
            <dd className="font-display text-3xl lg:text-4xl font-bold tracking-tight tabular-nums">
              <ChiffreAnime valeur={c.valeur} />
            </dd>
            <dt className="mt-1.5 text-sm font-medium">{c.intitule}</dt>
            <p className="mt-0.5 text-xs text-panel-foreground/65 leading-snug">
              {c.precision}
            </p>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <BoutonLien
          href={CHIFFRES.href}
          libelleChargement="Chargement des données…"
        >
          {CHIFFRES.appel}
        </BoutonLien>
      </div>
    </CadreOuverture>
  );
}

function AttenteOuverture() {
  return (
    <CadreOuverture>
      <div aria-busy="true">
        <span role="status" className="sr-only">
          Chargement des chiffres clés
        </span>
        <div aria-hidden="true">
          <Skeleton className="mt-4 h-8 w-2/3 max-w-xl bg-white/15" />
          <div className="mt-12 lg:mt-16">
            <SqueletteChiffres />
          </div>
        </div>
      </div>
    </CadreOuverture>
  );
}

/* ── L'Office ────────────────────────────────────────────────────── */

async function Office() {
  const { presentation, missions } = await getInstitution();

  return (
    <section aria-labelledby="office-titre" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div data-apparition>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              L&apos;institution
            </p>
            <h2
              id="office-titre"
              className="mt-3 font-display text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
            >
              Éclairer la décision publique par la connaissance de la population
            </h2>
            <LienFleche href="/office" className="mt-6">
              Missions et organisation
            </LienFleche>
          </div>

          <div
            data-apparition
            data-apparition-retard="120"
            className="space-y-5 text-[15px] leading-relaxed text-foreground/85"
          >
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
              data-apparition
              data-apparition-retard={i * 90}
              className="rounded-xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md"
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
  );
}

function AttenteOffice() {
  return (
    <section className="bg-background" aria-busy="true">
      <span role="status" className="sr-only">
        Chargement de la présentation
      </span>
      <div
        aria-hidden="true"
        className="mx-auto max-w-7xl px-6 lg:px-10 py-20"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-9 w-full" />
            <Skeleton className="mt-2.5 h-9 w-3/4" />
            <Skeleton className="mt-6 h-4 w-48" />
          </div>
          <SqueletteTexte lignes={6} />
        </div>
        <div className="mt-16">
          <SqueletteCartes nombre={3} colonnes="md:grid-cols-3" ratio="h-24" />
        </div>
      </div>
    </section>
  );
}

/* ── Actualités ──────────────────────────────────────────────────── */

async function Actualites() {
  const actualites = await getActualites(3);

  return (
    <section
      aria-labelledby="actus-titre"
      className="bg-muted/30 border-y border-border"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4" data-apparition>
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
          <LienFleche href="/actualites">Toutes les actualités</LienFleche>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {actualites.map((a, i) => (
            <article
              key={a.slug}
              data-apparition
              data-apparition-retard={i * 90}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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
  );
}

function AttenteActualites() {
  return (
    <section
      className="bg-muted/30 border-y border-border"
      aria-busy="true"
    >
      <span role="status" className="sr-only">
        Chargement des actualités
      </span>
      <div
        aria-hidden="true"
        className="mx-auto max-w-7xl px-6 lg:px-10 py-20"
      >
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-80 max-w-full" />
        <div className="mt-10">
          <SqueletteCartes nombre={3} colonnes="md:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}

/* ── Nos chiffres ────────────────────────────────────────────────── */

function BanqueDeDonnees() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div
          data-apparition
          className="overflow-hidden rounded-2xl bg-panel text-panel-foreground"
        >
          <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-14">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                Les données démographiques, ouvertes à tous
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-panel-foreground/85">
                Pyramides des âges des recensements de 1988, 1998 et 2021,
                indicateurs de santé, indices du dividende démographique et
                cartographie par district. Les séries sont consultables en ligne
                et téléchargeables au format CSV pour vos propres analyses.
              </p>
              <BoutonLien
                href={CHIFFRES.href}
                libelleChargement="Chargement des données…"
                className="mt-8"
              >
                {CHIFFRES.appel}
              </BoutonLien>
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
  );
}

/* ── Partenaires ─────────────────────────────────────────────────────
 * Un mur de logos ne dit rien à qui ne reconnaît pas les sigles. Le nom
 * complet reste en infobulle et en texte alternatif, le détail des
 * organisations étant donné sur la page Partenaires.
 */

async function Partenaires() {
  const partenaires = await getPartenaires();

  return (
    <section
      aria-labelledby="partenaires-titre"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div
          className="flex flex-wrap items-baseline justify-between gap-4"
          data-apparition
        >
          <h2
            id="partenaires-titre"
            className="font-display text-2xl font-bold tracking-tight"
          >
            Partenaires
          </h2>
          <LienFleche href="/partenaires">Voir tous les partenaires</LienFleche>
        </div>

        {/* Les logos sont hétérogènes : plusieurs sont des JPEG à fond blanc
         * opaque. Une pastille claire les accueille tous et préserve leurs
         * couleurs dans les deux thèmes, là où un filtre de teinte
         * transformerait les JPEG en rectangles pleins. */}
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {partenaires.map((p, i) => (
            <li key={p.nom} data-apparition data-apparition-retard={i * 55}>
              <a
                href={p.site}
                target="_blank"
                rel="noreferrer noopener"
                title={p.intitule}
                className="flex h-20 items-center justify-center rounded-xl border border-border bg-white px-5 transition-colors hover:border-primary/40"
              >
                <Image
                  src={p.logo}
                  alt={p.intitule ?? p.nom}
                  width={200}
                  height={80}
                  className="max-h-10 w-auto object-contain"
                />
                <NouvelleFenetre />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AttentePartenaires() {
  return (
    <section className="border-t border-border bg-background" aria-busy="true">
      <span role="status" className="sr-only">
        Chargement des partenaires
      </span>
      <div
        aria-hidden="true"
        className="mx-auto max-w-7xl px-6 lg:px-10 py-20"
      >
        <Skeleton className="h-7 w-40" />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <Skeleton className="h-20 w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    </section>
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
