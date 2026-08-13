import type { NextConfig } from "next";

/**
 * En-têtes de sécurité.
 *
 * Le site n'en envoyait aucun. Ceux-ci ne changent rien au rendu et ferment
 * des portes que rien ne justifiait de laisser ouvertes sur un site public
 * d'institution.
 *
 * La politique de sécurité du contenu reste partielle à dessein : une
 * directive `script-src` complète demande de signer les scripts en ligne par
 * un nonce, ce qui suppose de rendre les pages à la demande. Les trois
 * directives posées ici ne dépendent pas des scripts et n'ont donc pas ce
 * coût : personne ne peut encadrer le site, en détourner les URL relatives,
 * ni y charger de greffon.
 */
const ENTETES = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
  },
  // Empêche le navigateur de deviner un type MIME, donc d'exécuter comme
  // script un fichier servi comme autre chose.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Pour les navigateurs qui ignorent frame-ancestors.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // L'URL complète ne fuit pas vers les sites tiers liés depuis les pages.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Le site ne demande ni caméra, ni micro, ni position : on le déclare.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Ignoré en clair, actif dès que le site est servi en HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:chemin*", headers: ENTETES }];
  },
};

export default nextConfig;
