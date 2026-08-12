/**
 * Contenu institutionnel de l'ONP.
 *
 * Repris du site officiel onp.gouv.ci et du portail du Ministère du Plan.
 * Rien n'est inventé ici : chaque texte a une source publique. Pour mettre
 * à jour le site, éditer ce fichier plutôt que les composants.
 */

export const IDENTITE = {
  nom: "Office National de la Population",
  sigle: "ONP",
  baseline: "Observatoire Population et Développement",
  sousTitre: "Un outil pour le suivi du dividende démographique",
  decret: "Décret n°2012-161 du 9 février 2012",
  statut: "Établissement public national",
  tutelleTechnique: "Ministère du Plan et du Développement",
  tutelleFinanciere: "Ministère de l'Économie et des Finances",
} as const;

/**
 * Présentation courte, telle qu'elle apparaît sur le portail du Ministère
 * du Plan. Rédigée en texte suivi, sans énumération.
 */
export const PRESENTATION = {
  chapeau:
    "L'Office National de la Population accompagne la Côte d'Ivoire dans la connaissance de sa population et dans la mise à profit de sa jeunesse pour son émergence économique.",
  corps: [
    "Créé par le décret n°2012-161 du 9 février 2012, l'Office National de la Population est un établissement public national placé sous la tutelle administrative et technique du Ministère du Plan et du Développement, et sous la tutelle financière du Ministère de l'Économie et des Finances.",
    "L'Office réalise, pour le compte des administrations publiques et privées, des collectivités territoriales et des partenaires au développement, des modèles et des prévisions démographiques. Il mène également des analyses, des études et des recherches sur les questions de démographie, de migrations et d'économie générationnelle.",
    "Ses travaux portent une attention particulière aux facteurs qui conditionnent le dividende démographique, le développement humain et le développement durable, ainsi qu'au suivi conjoncturel des mouvements de population en Côte d'Ivoire.",
  ],
} as const;

/** Les sept missions officielles, telles qu'énoncées par l'Office. */
export const MISSIONS = [
  {
    titre: "Concevoir la politique de population",
    texte:
      "Concevoir la politique du Gouvernement en matière de population et développement.",
  },
  {
    titre: "Coordonner le recensement et les études",
    texte:
      "Coordonner, en liaison avec l'Institut National de la Statistique, le Recensement Général de la Population et de l'Habitat, et conduire les études économiques, sociales et démographiques qui améliorent la connaissance des interrelations entre population et développement.",
  },
  {
    titre: "Articuler population et politiques sectorielles",
    texte:
      "Assurer une meilleure synergie de la politique du Gouvernement en matière de population avec les politiques sectorielles.",
  },
  {
    titre: "Accompagner les collectivités",
    texte:
      "Assister les collectivités décentralisées dans la prise en compte des questions de population au niveau local.",
  },
  {
    titre: "Développer l'expertise nationale",
    texte:
      "Favoriser le développement d'une expertise nationale en matière de population.",
  },
  {
    titre: "Coordonner les acteurs",
    texte:
      "Coordonner toutes les interventions entre le Gouvernement et les différents acteurs en matière de population et développement.",
  },
  {
    titre: "Promouvoir la prise en compte des questions de population",
    texte:
      "Promouvoir la prise en compte effective des questions de population dans les politiques, les programmes et les plans sectoriels.",
  },
] as const;

/** Les cinq impulsions stratégiques qui organisent l'activité de l'Office. */
export const IMPULSIONS = [
  "Coordonner la mise en œuvre de la Politique Nationale de Population.",
  "Développer des programmes et projets de mise en œuvre de la Politique Nationale de Population.",
  "Renforcer le dialogue avec les grappes sectorielles et les parties prenantes, notamment les ministères, les partenaires techniques et financiers, la société civile et les organisations non gouvernementales.",
  "Renforcer la communication pour le changement social et comportemental.",
  "Conduire le plaidoyer pour la prise en compte des questions de population dans la planification du développement aux niveaux national, sectoriel et décentralisé.",
] as const;

export const DIRECTION = {
  nom: "Dr HININ Moustapha",
  fonction: "Directeur Général",
  portrait: "/medias/onp/institution/directeur-general.jpg",
} as const;

export const CONTACT = {
  ville: "Abidjan, Côte d'Ivoire",
  facebook: "https://www.facebook.com/onp.ci",
  twitter: "https://twitter.com/OnpCi",
} as const;
