/**
 * Bandeau d'information de la page d'accueil.
 *
 * Pour changer le message, éditer ce fichier. Changer aussi l'`id` : c'est
 * lui qui décide du réaffichage chez les visiteurs ayant fermé le bandeau
 * précédent. Un message corrigé sous le même identifiant resterait invisible
 * pour eux.
 *
 * `expire` retire le bandeau tout seul le jour venu, ce qui évite qu'une
 * annonce d'événement reste en ligne des mois après la date.
 */

export type TonAnnonce = "info" | "evenement" | "alerte";

export type Annonce = {
  /** Identifiant de version : le modifier réaffiche le bandeau à tous. */
  id: string;
  ton: TonAnnonce;
  /** Court préfixe en capitales, par exemple « Nouveau ». */
  etiquette: string;
  message: string;
  lien?: { href: string; label: string };
  /** Date ISO après laquelle le bandeau ne s'affiche plus. */
  expire?: string;
};

/** `null` retire complètement le bandeau du site. */
export const ANNONCE: Annonce | null = {
  id: "banque-donnees-2021",
  ton: "info",
  etiquette: "Données",
  message:
    "Les résultats du Recensement Général de la Population et de l'Habitat 2021 sont consultables et téléchargeables dans la banque de données.",
  lien: { href: "/dashboard", label: "Consulter" },
};
