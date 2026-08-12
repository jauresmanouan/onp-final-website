/**
 * Publications de l'Office, reprises de la rubrique Rapports du site
 * officiel. Les fichiers ont été rapatriés dans public/documents/onp
 * plutôt que liés vers l'ancien serveur, dont les URL sont fragiles.
 *
 * Le rapport d'activités 2019, présent dans le catalogue d'origine, n'est
 * plus servi par onp.gouv.ci : il ne figure pas ici tant que le fichier
 * n'est pas fourni, plutôt que d'annoncer un téléchargement impossible.
 */

export type CategoriePublication = "note" | "etude" | "rapport";

export type Publication = {
  slug: string;
  titre: string;
  categorie: CategoriePublication;
  /** Résumé court, rédigé à partir du titre et de l'objet du document. */
  resume: string;
  fichier: string;
  /** Première page du PDF, rendue au build par pdftoppm. */
  apercu: string;
  /** Poids en kilo-octets, affiché avant le téléchargement. */
  poidsKo: number;
  annee?: number;
};

export const CATEGORIES: Record<
  CategoriePublication,
  { label: string; description: string }
> = {
  note: {
    label: "Notes de politique",
    description:
      "Six notes consacrées aux conditions de réalisation du dividende démographique en Côte d'Ivoire.",
  },
  etude: {
    label: "Études et analyses",
    description:
      "Travaux de fond sur l'économie générationnelle et les conditions de vie des populations.",
  },
  rapport: {
    label: "Rapports",
    description: "Rapports institutionnels et profils nationaux.",
  },
};

export const PUBLICATIONS: Publication[] = [
  {
    slug: "note-politique-1",
    titre: "Réalisation du dividende démographique en Côte d'Ivoire",
    categorie: "note",
    resume:
      "Première note de la série : ce qu'est le dividende démographique et les conditions de sa réalisation en Côte d'Ivoire.",
    fichier: "/documents/onp/note-politique-1.pdf",
    apercu: "/documents/onp/apercus/note-politique-1.jpg",
    poidsKo: 1128,
  },
  {
    slug: "note-politique-2",
    titre:
      "Dividende démographique en Côte d'Ivoire : le potentiel d'émergence",
    categorie: "note",
    resume:
      "Ce que la transition démographique peut apporter à la trajectoire d'émergence du pays.",
    fichier: "/documents/onp/note-politique-2.pdf",
    apercu: "/documents/onp/apercus/note-politique-2.jpg",
    poidsKo: 1005,
  },
  {
    slug: "note-politique-3",
    titre:
      "Jeunesse, dividende démographique et marché du travail en Côte d'Ivoire",
    categorie: "note",
    resume:
      "L'arrivée des jeunes générations sur le marché du travail et les conditions de leur insertion.",
    fichier: "/documents/onp/note-politique-3.pdf",
    apercu: "/documents/onp/apercus/note-politique-3.jpg",
    poidsKo: 755,
  },
  {
    slug: "note-politique-4",
    titre: "Inégalité de genre et dividende démographique en Côte d'Ivoire",
    categorie: "note",
    resume:
      "Le rôle des inégalités entre les femmes et les hommes dans la capture du dividende démographique.",
    fichier: "/documents/onp/note-politique-4.pdf",
    apercu: "/documents/onp/apercus/note-politique-4.jpg",
    poidsKo: 989,
  },
  {
    slug: "note-politique-5",
    titre:
      "Dépendance économique en Côte d'Ivoire : le dilemme du financement",
    categorie: "note",
    resume:
      "Charges de dépendance, épargne et capacité d'investissement des ménages et de l'État.",
    fichier: "/documents/onp/note-politique-5.pdf",
    apercu: "/documents/onp/apercus/note-politique-5.jpg",
    poidsKo: 798,
  },
  {
    slug: "note-politique-6",
    titre: "Disparités spatiales en Côte d'Ivoire",
    categorie: "note",
    resume:
      "Les écarts de situation démographique et sociale entre les territoires du pays.",
    fichier: "/documents/onp/note-politique-6.pdf",
    apercu: "/documents/onp/apercus/note-politique-6.jpg",
    poidsKo: 2040,
  },
  {
    slug: "comptes-nationaux-transfert",
    titre:
      "Comptes nationaux de transfert : comprendre l'économie générationnelle",
    categorie: "etude",
    resume:
      "Brochure de présentation des comptes nationaux de transfert, qui mesurent comment les ressources circulent entre les générations.",
    fichier: "/documents/onp/comptes-nationaux-transfert.pdf",
    apercu: "/documents/onp/apercus/comptes-nationaux-transfert.jpg",
    poidsKo: 1283,
    annee: 2016,
  },
  {
    slug: "privations-multiples-enfants",
    titre:
      "Analyse des privations multiples des enfants en Côte d'Ivoire",
    categorie: "etude",
    resume:
      "Étude des privations cumulées touchant les enfants, au-delà de la seule mesure monétaire de la pauvreté.",
    fichier: "/documents/onp/privations-multiples-enfants.pdf",
    apercu: "/documents/onp/apercus/privations-multiples-enfants.jpg",
    poidsKo: 6480,
  },
  {
    slug: "profil-gouvernance-migrations-2019",
    titre:
      "République de Côte d'Ivoire : profil 2019 des indicateurs de gouvernance des migrations",
    categorie: "rapport",
    resume:
      "Profil national établi selon le cadre des indicateurs de gouvernance des migrations.",
    fichier: "/documents/onp/profil-gouvernance-migrations-2019.pdf",
    apercu: "/documents/onp/apercus/profil-gouvernance-migrations-2019.jpg",
    poidsKo: 1663,
    annee: 2019,
  },
];

/** Ordre d'affichage des sections. */
export const ORDRE_CATEGORIES: CategoriePublication[] = [
  "note",
  "etude",
  "rapport",
];
