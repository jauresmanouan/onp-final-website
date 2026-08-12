/**
 * Actualités de l'Office, reprises du site officiel onp.gouv.ci.
 *
 * Les textes et les images proviennent des pages d'origine ; chaque article
 * conserve la photographie qui l'accompagnait. Les dates ne sont renseignées
 * que lorsqu'une source les donne : `date: null` signifie que l'ancien site
 * n'en publiait pas, et l'affichage l'omet plutôt que d'en inventer une.
 */

export type Actualite = {
  slug: string;
  titre: string;
  /** Date ISO, ou null si la source n'en donne pas. */
  date: string | null;
  /** Organe de presse ou origine de la reprise. */
  source: string | null;
  chapeau: string;
  corps: string[];
  image: string;
  /** Texte alternatif de la photographie. */
  alt: string;
};

export const ACTUALITES: Actualite[] = [
  {
    slug: "revue-semestrielle-cp8",
    titre:
      "Revue semestrielle 2022 des plans de travail du 8e programme de coopération entre la Côte d'Ivoire et l'UNFPA",
    date: "2022-08-03",
    source: null,
    chapeau:
      "À Yamoussoukro, l'Office ouvre les travaux de la première revue semestrielle des plans de travail annuels du programme de coopération avec le Fonds des Nations Unies pour la Population.",
    corps: [
      "Dr HININ Moustapha, Directeur Général de l'Office National de la Population, a procédé le mercredi 3 août 2022 à Yamoussoukro, au nom de Madame le Ministre du Plan et du Développement, à l'ouverture des travaux de la première revue semestrielle 2022 des plans de travail annuels du 8e programme de coopération entre la Côte d'Ivoire et le Fonds des Nations Unies pour la Population.",
      "Cette revue a pour objectif d'analyser les progrès vers l'atteinte des résultats des différents produits du 8e programme pays, qui couvre la période 2021 à 2025, dans le cadre de la réalisation des objectifs nationaux et du Cadre de coopération des Nations Unies pour le développement durable.",
      "Ce 8e programme pays contribue à l'achèvement des engagements pris par la Côte d'Ivoire au Sommet de Nairobi en 2019, ainsi qu'à l'atteinte des Objectifs de développement durable portant sur la santé et le bien-être, l'égalité entre les sexes, la réduction des inégalités, la paix et les institutions efficaces, et les partenariats.",
    ],
    image: "/medias/onp/activites/revue-semestrielle-cp8.jpg",
    alt: "Ouverture de la revue semestrielle 2022 à Yamoussoukro",
  },
  {
    slug: "groupe-consultatif-pnd",
    titre: "Groupe consultatif du Plan National de Développement",
    date: "2022-06-15",
    source: null,
    chapeau:
      "La Côte d'Ivoire mobilise ses partenaires autour du Plan National de Développement 2021 à 2025, à Abidjan.",
    corps: [
      "Le Groupe consultatif consacré au Plan National de Développement 2021 à 2025 s'est tenu le 15 juin 2022 à l'Hôtel Ivoire d'Abidjan, sous le mot d'ordre d'une mobilisation de l'ensemble des partenaires du pays pour sa transformation économique et sociale.",
    ],
    image: "/medias/onp/activites/groupe-consultatif-pnd.jpeg",
    alt: "Affiche du Groupe consultatif du Plan National de Développement 2021-2025",
  },
  {
    slug: "budget-dividende-demographique",
    titre:
      "Vers l'élaboration d'un budget fonctionnel pour l'atteinte du dividende démographique",
    date: "2022-02-22",
    source: "AIP",
    chapeau:
      "Un atelier régional sur la budgétisation sensible au dividende démographique se tient à Grand-Bassam pour transformer le budget classique en budget fonctionnel.",
    corps: [
      "Un atelier régional sur la budgétisation sensible au dividende démographique se tient du lundi 21 au vendredi 25 février 2022 à Grand-Bassam, afin de transformer le budget classique en budget fonctionnel.",
    ],
    image: "/medias/onp/activites/budget-dividende-demographique.jpg",
    alt: "Atelier régional sur la budgétisation sensible au dividende démographique",
  },
  {
    slug: "semaine-population-poro",
    titre:
      "Semaine de la population 2021 : l'Office et ses partenaires en campagne dans la région du Poro",
    date: "2021-12-16",
    source: "Abidjan.net",
    chapeau:
      "L'Office conduit des activités de sensibilisation et de plaidoyer dans le nord du pays pour favoriser l'exploitation du dividende démographique.",
    corps: [
      "En vue de créer un environnement favorable à l'exploitation du dividende démographique et à la réalisation de l'agenda 2030 des Objectifs de développement, l'Office National de la Population organise des activités dans le nord du pays.",
    ],
    image: "/medias/onp/activites/semaine-population-poro.jpg",
    alt: "Campagne de sensibilisation dans la région du Poro",
  },
  {
    slug: "semaine-population-bouake",
    titre:
      "Semaine de la population 2021 à Bouaké, organisée avec le Fonds des Nations Unies pour la Population",
    date: "2021-10-14",
    source: null,
    chapeau:
      "L'édition 2021 s'est tenue du 9 au 14 octobre à Bouaké, autour du thème des défis et enjeux du dividende démographique en Côte d'Ivoire.",
    corps: [
      "L'Office National de la Population, en partenariat avec le Fonds des Nations Unies pour la Population, a organisé la Semaine de la Population, édition 2021, du 9 au 14 octobre 2021 à Bouaké, autour du thème « Défis et enjeux du dividende démographique en Côte d'Ivoire ».",
      "L'édition s'est articulée autour de la cérémonie de remise du bureau régional inter-agences des Nations Unies à Bouaké, d'une journée universitaire de formation et de sensibilisation sur les défis et enjeux du dividende démographique, et de consultations foraines en direction des populations de Bouaké.",
    ],
    image: "/medias/onp/activites/semaine-population-bouake-unfpa.jpg",
    alt: "Semaine de la population 2021 à Bouaké",
  },
  {
    slug: "bouake-accueille-semaine-population",
    titre: "Bouaké accueille la semaine de la population 2021",
    date: "2021-10-13",
    source: null,
    chapeau:
      "La cérémonie officielle de l'édition 2021 de la semaine de la population se tient à Bouaké.",
    corps: [
      "La ville de Bouaké abrite le mercredi 13 octobre 2021 la cérémonie officielle de l'édition 2021 de la semaine de la population, organisée par l'Office National de la Population en partenariat avec le Fonds des Nations Unies pour la Population.",
    ],
    image: "/medias/onp/activites/bouake-semaine-population.jpg",
    alt: "Cérémonie officielle de la semaine de la population à Bouaké",
  },
  {
    slug: "atelier-pilotage-politiques-publiques",
    titre:
      "Renforcement du pilotage des politiques publiques : un cadre intégré d'exploitation des données des recensements et enquêtes",
    date: null,
    source: null,
    chapeau:
      "L'Office organise une consultation nationale pour mettre en place un cadre intégré de valorisation et d'exploitation des données statistiques nationales.",
    corps: [
      "Dans le cadre de l'optimisation de l'exploitation des différentes sources de données existantes ou en cours de production, en vue de renforcer la disponibilité d'évidences pour un meilleur pilotage des politiques publiques, le Ministère du Plan et du Développement, à travers l'Office National de la Population, organise une consultation nationale pour la mise en place d'un cadre intégré de valorisation et d'exploitation des données.",
    ],
    image: "/medias/onp/activites/atelier-pilotage-politiques.jpg",
    alt: "Atelier sur le pilotage des politiques publiques",
  },
];

/** Les plus récentes d'abord ; les articles sans date ferment la liste. */
export const ACTUALITES_RECENTES = [...ACTUALITES].sort((a, b) => {
  if (!a.date) return 1;
  if (!b.date) return -1;
  return b.date.localeCompare(a.date);
});

export function getActualite(slug: string): Actualite | undefined {
  return ACTUALITES.find((a) => a.slug === slug);
}
