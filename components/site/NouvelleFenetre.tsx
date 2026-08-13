/**
 * Mention réservée aux lecteurs d'écran, à placer dans un lien qui ouvre un
 * onglet. Rien ne signalait ce changement de contexte : l'utilisateur non
 * voyant se retrouvait sur un autre site sans avoir été prévenu, et sans que
 * le retour arrière fonctionne.
 */
export default function NouvelleFenetre() {
  return <span className="sr-only"> (nouvelle fenêtre)</span>;
}
