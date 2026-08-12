/**
 * Partenaires techniques, financiers et scientifiques de l'Office,
 * repris de la rubrique Partenaires du site officiel.
 */

export type Partenaire = {
  nom: string;
  /** Nom développé, pour les sigles. */
  intitule?: string;
  logo: string;
  site?: string;
};

export const PARTENAIRES: Partenaire[] = [
  {
    nom: "UNFPA",
    intitule: "Fonds des Nations Unies pour la Population",
    logo: "/medias/onp/partenaires/unfpa.png",
    site: "https://www.unfpa.org/",
  },
  {
    nom: "UNICEF",
    intitule: "Fonds des Nations Unies pour l'Enfance",
    logo: "/medias/onp/partenaires/unicef.jpeg",
    site: "https://www.unicef.org/",
  },
  {
    nom: "OIM",
    intitule: "Organisation Internationale pour les Migrations",
    logo: "/medias/onp/partenaires/oim.jpg",
    site: "https://www.iom.int/",
  },
  {
    nom: "PNUD",
    intitule: "Programme des Nations Unies pour le Développement",
    logo: "/medias/onp/partenaires/pnud.png",
    site: "https://www.undp.org/",
  },
  {
    nom: "AFD",
    intitule: "Agence Française de Développement",
    logo: "/medias/onp/partenaires/afd.jpg",
    site: "https://www.afd.fr/",
  },
  {
    nom: "OCDE",
    intitule: "Organisation de Coopération et de Développement Économiques",
    logo: "/medias/onp/partenaires/ocde.jpg",
    site: "https://www.oecd.org/",
  },
  {
    nom: "PRB",
    intitule: "Population Reference Bureau",
    logo: "/medias/onp/partenaires/prb.jpg",
    site: "https://www.prb.org/",
  },
  {
    nom: "KAS",
    intitule: "Konrad-Adenauer-Stiftung",
    logo: "/medias/onp/partenaires/kas.png",
    site: "https://www.kas.de/",
  },
];

/** Sites publics ivoiriens référencés en pied de page du site officiel. */
export const LIENS_INSTITUTIONNELS = [
  { nom: "Présidence de la République", url: "https://www.presidence.ci/" },
  { nom: "Primature", url: "http://www.premierministre.ci/" },
  { nom: "Ministère du Plan et du Développement", url: "http://www.plan.gouv.ci/" },
  { nom: "Ministère de l'Économie et des Finances", url: "http://www.finances.gouv.ci/" },
  { nom: "Ministère de la Santé", url: "http://www.sante.gouv.ci/" },
  { nom: "Ministère de l'Intérieur", url: "http://www.interieur.gouv.ci/" },
  { nom: "Ministère de l'Emploi", url: "http://www.emploi.gouv.ci/" },
  { nom: "Ministère de l'Éducation Nationale", url: "http://www.education-ci.org/portail/" },
];
