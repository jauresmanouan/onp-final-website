/**
 * Coordonnées et foire aux questions, reprises du site officiel.
 *
 * Deux jeux de numéros y coexistaient : la page Contacts donne le format
 * ivoirien à dix chiffres en vigueur depuis 2021, la FAQ un ancien numéro
 * à huit chiffres. Ce sont les premiers qui sont retenus.
 */

export const COORDONNEES = {
  entite: "Direction Générale de l'Office National de la Population",
  adresse: "Cocody, II Plateaux, Rue J 11, lot n°347, îlot n°39",
  ville: "Abidjan, Côte d'Ivoire",
  adressePostale: "08 BP 2967 Abidjan 08",
  email: "info@onp.gouv.ci",
  telephones: [
    { libelle: "Standard", numero: "+225 27 22 41 97 80" },
    { libelle: "Secrétariat de la Direction Générale", numero: "+225 27 22 41 97 82" },
  ],
  numeroVert: "143",
  facebook: "https://www.facebook.com/onp.ci",
  twitter: "https://twitter.com/OnpCi",
} as const;

export type Question = { question: string; reponse: string[] };

export const FAQ: Question[] = [
  {
    question:
      "Qu'est-ce qui justifie la création d'une structure comme l'Office National de la Population ?",
    reponse: [
      "Le retour de la paix en Côte d'Ivoire, consécutif à la fin de la crise post-électorale en avril 2011, a créé les conditions de la reconstruction du pays et d'une reprise économique. C'est dans ce contexte que le Gouvernement, soucieux de positionner le développement humain et la population au centre de la croissance économique, s'est doté d'un Office National de la Population, à l'instar des grands pays émergents.",
      "Créé par le décret n°2012-161 du 9 février 2012 et placé sous la tutelle du Ministère du Plan et du Développement, l'Office a été rendu opérationnel dans le cadre de la mise en œuvre du Plan National de Développement 2012-2015, avec l'appui du Plan d'Investissement Public.",
      "Doté du statut d'établissement public national, il traduit l'engagement du Gouvernement de placer les questions de population au premier rang de l'agenda national de développement, et constitue un instrument de mutualisation des efforts pour capitaliser sur la démographie et le capital humain du pays.",
    ],
  },
  {
    question: "Quels ont été les premiers acquis de l'Office ?",
    reponse: [
      "Au cours de ses trois premières années d'existence, l'Office a conduit la formulation d'une nouvelle Politique Nationale de Population et obtenu un consensus national en faveur de la quête du dividende démographique.",
      "Les capacités des services de planification des ministères techniques ont été renforcées pour intégrer les questions de population dans les plans et programmes de développement, avec la participation de cinquante-deux planificateurs venus de vingt et un ministères.",
      "Plusieurs documents stratégiques nationaux ont été élaborés, parmi lesquels la Stratégie Nationale de Lutte contre la Traite des Personnes, la stratégie de développement de solutions durables pour les personnes déplacées internes et en situation d'apatridie, et le Profil genre de la Côte d'Ivoire.",
      "L'Office a également porté la représentation du pays sur les questions de population dans les enceintes internationales et mobilisé des ressources auprès de la Banque Mondiale, de l'UNFPA, de l'Agence Française de Développement, de la Banque Africaine de Développement et du Centre de développement de l'OCDE.",
    ],
  },
  {
    question:
      "Quels sont les partenaires techniques et financiers de l'Office ?",
    reponse: [
      "L'Office travaille avec le Fonds des Nations Unies pour la Population, le Programme des Nations Unies pour le Développement, la Banque Mondiale, l'UNICEF, ainsi qu'avec des structures de recherche nationales et internationales.",
    ],
  },
  {
    question: "Qu'est-ce que le projet SWEDD ?",
    reponse: [
      "Le projet pour l'autonomisation des femmes et le dividende démographique au Sahel vise à accroître la capacité régionale à renforcer l'autonomisation des femmes et des adolescentes, notamment par l'achèvement du cursus scolaire des filles et le renforcement de leurs compétences.",
      "Financé par la Banque Mondiale en coordination avec l'UNFPA et l'Organisation Ouest-Africaine de la Santé, il cible six pays : le Burkina Faso, la Côte d'Ivoire, le Mali, la Mauritanie, le Niger et le Tchad.",
    ],
  },
  {
    question: "Où se situe l'Office ?",
    reponse: [
      "L'Office est installé à Abidjan, dans la commune de Cocody, aux II Plateaux, Rue J 11, lot n°347, îlot n°39. Le courrier peut être adressé au 08 BP 2967 Abidjan 08.",
    ],
  },
];
