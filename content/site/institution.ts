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

/**
 * Le cadre institutionnel des questions de population, de l'indépendance à
 * la création de l'Office. Récit continu, tel que l'Office le publie.
 */
export const HISTORIQUE = {
  titre: "Du silence démographique à un observatoire national",
  chapo:
    "Pendant trente ans, la croissance démographique n'a pas été perçue comme une contrainte pesant sur le développement du pays. Il aura fallu une crise économique, plusieurs institutions successives et un rapport d'évaluation sévère pour qu'un office national voie le jour.",
  jalons: [
    {
      periode: "1960 à 1990",
      titre: "Une politique de population qui n'existe pas",
      texte:
        "De l'indépendance à la fin des années 1980, la Côte d'Ivoire ne développe pas de politique de population explicite. Les problèmes liés à la croissance démographique ne sont pas perçus comme une contrainte pesant sur le développement du pays.",
    },
    {
      periode: "1991",
      titre: "La démographie entre dans le débat public",
      texte:
        "À la faveur de la crise économique des années 1980 et des contraintes des programmes d'ajustement structurel, le Gouvernement affirme la nécessité d'une politique de population et en dessine les grandes lignes dans le cadre d'un Programme National de Développement des Ressources Humaines.",
    },
    {
      periode: "1997 à 2005",
      titre: "Le Conseil National de Population et le BUNAP",
      texte:
        "Une Politique Nationale de Population est adoptée en mars 1997. Pour sa mise en œuvre, un organe consultatif, le Conseil National de Population, est créé, doté d'un secrétariat technique permanent appelé Bureau National de la Population. Cette structure fonctionne jusqu'en 2005.",
    },
    {
      periode: "2006 à 2007",
      titre: "Une réorganisation, puis un constat d'échec",
      texte:
        "Le Bureau devient en 2006 la Direction Générale de la Population et du Renforcement des Capacités. Le rapport d'évaluation produit en 2007 met en relief un déficit de coordination et une faible capacité de mobilisation des ressources, ainsi que la difficulté de ces structures à doter les administrations nationales et locales de capacités d'analyse et de prévision des phénomènes démographiques.",
    },
    {
      periode: "2012",
      titre: "La création de l'Office National de la Population",
      texte:
        "Le retour de la paix crée les conditions de la reconstruction et d'une reprise économique inclusive. Le Plan National de Développement 2012-2015 reconnaît le handicap que représente une forte croissance démographique pour la satisfaction de la demande sociale. La volonté du Gouvernement de renforcer le cadre institutionnel, juridique et opérationnel de gestion des questions de population conduit à la création de l'Office.",
    },
  ],
  conclusion:
    "La création de l'Office est motivée par la volonté d'intégrer, beaucoup plus que par le passé, la dimension démographique dans l'ensemble des programmes de développement initiés par la Côte d'Ivoire, afin de promouvoir un développement inclusif.",
} as const;

/** Ancrage institutionnel, organes de décision et départements. */
export const ORGANISATION = {
  ancrage:
    "L'Office est placé sous deux tutelles : la tutelle administrative et technique du Ministère du Plan et du Développement, et la tutelle financière du Ministère en charge de l'Économie et des Finances.",
  organes: [
    {
      nom: "Le Conseil de Gestion",
      texte:
        "Pour respecter le caractère multisectoriel des questions de population, cet organe réunit les représentants de huit ministères techniques impliqués dans la mise en œuvre de la Politique Nationale de Population : Plan et Développement, Économie et Finances, Santé, Emploi et Affaires Sociales, Intérieur, Logement, Éducation Nationale, ainsi que Famille, Femme et Enfant.",
    },
    {
      nom: "La Direction Générale",
      texte:
        "Organe de contrôle, de gestion et de décision au quotidien, elle supervise l'ensemble des opérations de l'Office. Elle s'appuie sur quatre départements et neuf divisions, qui sont les centres de conception et de suivi des programmes et projets en matière de population.",
    },
  ],
  departements: [
    {
      sigle: "DPP",
      nom: "Département des Politiques et Programmes",
      texte:
        "Assiste et conseille les ministères techniques, les collectivités territoriales et les acteurs des questions de population dans l'élaboration et la mise en œuvre des politiques, plans et programmes.",
    },
    {
      sigle: "DERF",
      nom: "Département des Études, des Recherches et de la Formation",
      texte:
        "Améliore le système d'informations sur les questions de population et développe une expertise nationale en matière de population et développement.",
    },
    {
      sigle: "DRE",
      nom: "Département des Relations Extérieures",
      texte:
        "Facilite la mise en œuvre des politiques et programmes par l'établissement de partenariats stratégiques et la mobilisation des ressources.",
    },
    {
      sigle: "DAF",
      nom: "Département de l'Administration et des Finances",
      texte:
        "Assure la gestion administrative et financière et veille au respect des normes et procédures en la matière.",
    },
  ],
  equipe:
    "L'Office réunit une équipe pluridisciplinaire de démographes, de médecins, de sociologues et d'économistes, et met son savoir-faire à la disposition des acteurs locaux comme des acteurs économiques privés et publics.",
} as const;

/** Direction générale et chefs de département. */
export const RESPONSABLES = [
  {
    nom: "Dr HININ Moustapha",
    fonction: "Directeur Général",
    profil: "Statisticien économiste, expert en politiques publiques",
  },
  {
    nom: "TRAORE Clah Kouakou Guy Richmond",
    fonction: "Chef du Département des Politiques et Programmes",
    profil: "Ingénieur agro-économiste",
  },
  {
    nom: "Dr KRE Kouacou Émile",
    fonction: "Chef du Département des Études, Recherches et Formation",
    profil: "Médecin de santé publique",
  },
  {
    nom: "AHUA Marina",
    fonction: "Chef du Département de la Coopération et de la Communication",
    profil: "Économiste, diplômée en ingénierie commerciale",
  },
  {
    nom: "TOPPE N'Tchohoun Rémi",
    fonction: "Chef du Département de l'Administration et des Finances",
    profil: "Administrateur principal des services financiers",
  },
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
