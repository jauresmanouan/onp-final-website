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
  getPublicationsParCategorie,
} from "@/lib/content";
import { Download } from "lucide-react";
import BandeauAnnonce from "@/components/site/BandeauAnnonce";
import ChiffreAnime from "@/components/site/ChiffreAnime";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import DateActualite from "@/components/site/DateActualite";
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

      <Suspense fallback={<AttentePublications />}>
        <Publications />
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
      <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
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

      <BoutonLien
        href={CHIFFRES.href}
        libelleChargement="Chargement des données…"
        className="mt-12"
      >
        {CHIFFRES.appel}
      </BoutonLien>
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
          {/* Le gabarit reprend la section entière, appel à l'action compris :
            * sans le bouton, la moitié basse de l'ouverture remontait de près
            * de cent pixels au moment où les chiffres arrivaient. */}
          <Skeleton className="h-8 w-2/3 max-w-xl bg-white/15 sm:h-9" />
          <div className="mt-12 lg:mt-16">
            <SqueletteChiffres />
          </div>
          <Skeleton className="mt-12 h-12 w-60 max-w-full rounded-lg bg-white/20" />
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
      {/* La section forte de la page : c'est la seule à respirer autant, et
        * la seule dont le titre monte jusqu'au quatrième corps. Les autres
        * se rangent sous elle — sans quoi cinq sections de même poids ne
        * laissent à l'œil aucun point de repos. */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28">
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
        className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28"
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
              className="mt-3 font-display text-3xl font-bold tracking-tight"
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
                  {/* Le composant partagé, qui affiche aussi l'organe de
                    * presse : les cartes de l'accueil taisaient la source que
                    * les mêmes cartes, dans la rubrique, donnent. */}
                  <DateActualite date={a.date} source={a.source} />
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

/* ── Publications ────────────────────────────────────────────────────
 * L'accueil poussait trois fois vers les chiffres et pas une seule fois vers
 * les documents, alors que le rapport en PDF est ce que vient chercher une
 * bonne part des visiteurs institutionnels — ministère, bailleur, presse.
 * Trois couvertures suffisent à dire qu'il y en a, et à ouvrir la rubrique.
 */

async function Publications() {
  // Une publication par famille plutôt que les trois premières du catalogue :
  // celles-ci sont toutes des notes de la même série, et l'accueil donnerait
  // à croire que l'Office ne publie que cela.
  const groupes = await getPublicationsParCategorie();
  const selection = groupes
    .slice(0, 3)
    .flatMap((g) => (g.publications[0] ? [{ ...g.publications[0], famille: g.label }] : []));

  return (
    <section
      aria-labelledby="publications-titre"
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div
          className="flex flex-wrap items-end justify-between gap-4"
          data-apparition
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Ressources
            </p>
            <h2
              id="publications-titre"
              className="mt-3 font-display text-3xl font-bold tracking-tight"
            >
              Notes, études et rapports
            </h2>
          </div>
          <LienFleche href="/publications">
            Toutes les publications
          </LienFleche>
        </div>

        {/* La couverture porte le lien, comme dans la rubrique : le document
          * se télécharge d'un clic, sans page intermédiaire. */}
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {selection.map((pub, i) => (
            <li key={pub.slug} data-apparition data-apparition-retard={i * 90}>
              <a
                href={pub.fichier}
                download
                className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[1/1.414] w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={pub.apercu}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {pub.famille}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                    {pub.titre}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <Download className="size-3" aria-hidden="true" />
                    PDF · {poidsPdf(pub.poidsKo)}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AttentePublications() {
  return (
    <section className="border-t border-border bg-background" aria-busy="true">
      <span role="status" className="sr-only">
        Chargement des publications
      </span>
      <div
        aria-hidden="true"
        className="mx-auto max-w-7xl px-6 lg:px-10 py-16"
      >
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-72 max-w-full" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i}>
              <Skeleton className="h-[7.5rem] w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 6480 Ko devient « 6,3 Mo » ; en dessous du méga, on reste en kilo-octets. */
function poidsPdf(ko: number): string {
  return ko >= 1024
    ? `${(ko / 1024).toFixed(1).replace(".", ",")} Mo`
    : `${ko} Ko`;
}

/* ── Nos chiffres ────────────────────────────────────────────────── */

function BanqueDeDonnees() {
  return (
    <section className="bg-background">
      {/* Le panneau porte déjà sa propre marge intérieure : la section qui
        * l'entoure se resserre, sinon deux respirations se cumulent. */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div
          data-apparition
          className="overflow-hidden rounded-2xl bg-panel text-panel-foreground"
        >
          <div className="grid gap-10 p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-12">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
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
      {/* La brève de la page : un mur de logos ne se lit pas, il se constate.
        * Des pastilles plus basses sur une seule ligne disent la même chose
        * en trois fois moins de hauteur. */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
        <div
          className="flex flex-wrap items-baseline justify-between gap-4"
          data-apparition
        >
          <h2
            id="partenaires-titre"
            className="font-display text-xl font-bold tracking-tight"
          >
            Partenaires
          </h2>
          <LienFleche href="/partenaires">Voir tous les partenaires</LienFleche>
        </div>

        {/* Les logos sont hétérogènes : plusieurs sont des JPEG à fond blanc
         * opaque. Une pastille claire les accueille tous et préserve leurs
         * couleurs dans les deux thèmes, là où un filtre de teinte
         * transformerait les JPEG en rectangles pleins. */}
        {/* Une apparition sur la bande entière plutôt qu'une par logo : huit
          * révélations décalées pour huit pastilles, c'est l'attention prise
          * en otage par le décor. */}
        <ul
          className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8"
          data-apparition
        >
          {partenaires.map((p) => (
            <li key={p.nom}>
              <a
                href={p.site}
                target="_blank"
                rel="noreferrer noopener"
                title={p.intitule}
                className="flex h-16 items-center justify-center rounded-lg border border-border bg-white px-3 transition-colors hover:border-primary/40"
              >
                <Image
                  src={p.logo}
                  alt={p.intitule ?? p.nom}
                  width={200}
                  height={80}
                  className="max-h-8 w-auto object-contain"
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
        className="mx-auto max-w-7xl px-6 lg:px-10 py-14"
      >
        <Skeleton className="h-6 w-32" />
        <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <Skeleton className="h-16 w-full rounded-lg" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
