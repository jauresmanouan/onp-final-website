import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

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
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
