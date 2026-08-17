/**
 * Les destinations qui portaient plusieurs noms.
 *
 * Le tableau de bord s'appelait « Nos chiffres » dans l'en-tête, « Consulter
 * les chiffres » dans l'ouverture, « Ouvrir la banque de données » au milieu
 * de l'accueil, « Banque de données » en pied de page et « Tableau de bord »
 * une fois arrivé. Rien ne disait au visiteur que ces cinq portes menaient au
 * même endroit : il croyait avoir cinq ressources et n'en trouvait qu'une.
 *
 * Le nom est donc écrit ici, une fois. `appel` n'est pas un second nom : c'est
 * le même, précédé du verbe qui convient à un bouton.
 */
export const CHIFFRES = {
  href: "/dashboard",
  /** Le nom, partout : navigation, pieds de page, titre de la page elle-même. */
  nom: "Nos chiffres",
  /** Le nom sous forme d'action, pour les boutons. */
  appel: "Consulter nos chiffres",
  /** Ce qu'on y trouve, quand la place le permet. */
  detail: "Indicateurs, séries et cartographie par district",
  /** Le nom dans une phrase, sans majuscule d'intitulé. */
  dansLaPhrase: "nos chiffres",
} as const;

/**
 * La conversation, écrite ici pour la même raison que ci-dessus : elle est
 * appelée depuis les deux en-têtes et depuis la palette, et un nom recopié
 * trois fois finit toujours par diverger.
 *
 * Elle vit hors du site et hors du tableau de bord, sur une page nue : c'est
 * une adresse, pas une rubrique.
 */
export const ASSISTANT = {
  href: "/assistant",
  nom: "AI chat",
  appel: "Poser une question",
  detail: "Interroger les indicateurs et les documents en français",
} as const;
