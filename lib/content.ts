/**
 * Point d'accès unique au contenu éditorial du site.
 *
 * Les pages passent toutes par ces fonctions, jamais par les fichiers de
 * `content/site` directement. Les signatures sont asynchrones bien que la
 * source soit locale : c'est ce qui permettra de brancher Strapi en ne
 * réécrivant que ce module, sans toucher une seule page.
 *
 * Chaque fonction correspond à un type de contenu Strapi à venir :
 * actualite, partenaire, page institutionnelle.
 */

import {
  ACTUALITES,
  ACTUALITES_RECENTES,
  getActualite as findActualite,
  type Actualite,
} from "@/content/site/actualites";
import {
  PARTENAIRES,
  LIENS_INSTITUTIONNELS,
  type Partenaire,
} from "@/content/site/partenaires";
import {
  IDENTITE,
  PRESENTATION,
  MISSIONS,
  IMPULSIONS,
  HISTORIQUE,
  ORGANISATION,
  RESPONSABLES,
  DIRECTION,
  CONTACT,
} from "@/content/site/institution";

import {
  PUBLICATIONS,
  CATEGORIES,
  ORDRE_CATEGORIES,
  type Publication,
  type CategoriePublication,
} from "@/content/site/publications";

import { COORDONNEES, FAQ, type Question } from "@/content/site/contact";

export type {
  Actualite,
  Partenaire,
  Publication,
  CategoriePublication,
  Question,
};

export async function getCoordonnees() {
  return COORDONNEES;
}

export async function getFAQ(): Promise<Question[]> {
  return FAQ;
}

export async function getActualites(limite?: number): Promise<Actualite[]> {
  return limite ? ACTUALITES_RECENTES.slice(0, limite) : ACTUALITES_RECENTES;
}

export async function getActualite(slug: string): Promise<Actualite | null> {
  return findActualite(slug) ?? null;
}

export async function getActualiteSlugs(): Promise<string[]> {
  return ACTUALITES.map((a) => a.slug);
}

/** Publications groupées par catégorie, dans l'ordre d'affichage. */
export async function getPublicationsParCategorie(): Promise<
  { categorie: CategoriePublication; label: string; description: string; publications: Publication[] }[]
> {
  return ORDRE_CATEGORIES.map((categorie) => ({
    categorie,
    label: CATEGORIES[categorie].label,
    description: CATEGORIES[categorie].description,
    publications: PUBLICATIONS.filter((p) => p.categorie === categorie),
  })).filter((groupe) => groupe.publications.length > 0);
}

export async function getPublications(): Promise<Publication[]> {
  return PUBLICATIONS;
}

export async function getPartenaires(): Promise<Partenaire[]> {
  return PARTENAIRES;
}

export async function getLiensInstitutionnels() {
  return LIENS_INSTITUTIONNELS;
}

export async function getInstitution() {
  return {
    identite: IDENTITE,
    presentation: PRESENTATION,
    missions: MISSIONS,
    impulsions: IMPULSIONS,
    historique: HISTORIQUE,
    organisation: ORGANISATION,
    responsables: RESPONSABLES,
    direction: DIRECTION,
    contact: CONTACT,
  };
}
