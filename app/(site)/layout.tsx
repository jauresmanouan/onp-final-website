import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Apparitions from "@/components/site/Apparitions";

/**
 * Ossature du site institutionnel. Le tableau de bord vit hors de ce groupe
 * de routes et garde son propre en-tête, plus dense, adapté à la lecture des
 * données : les deux univers se rejoignent par le lien Banque de données.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Lien d'évitement : au clavier, la première tabulation saute la
       * navigation, qui est identique d'une page à l'autre. */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {/* Guette les blocs à révéler, sur toutes les pages du site */}
      <Apparitions />
    </div>
  );
}
