import type { Metadata } from "next";
import ONPHeader from "@/components/dashboard/onp/ONPHeader";
import ONPFooter from "@/components/dashboard/onp/ONPFooter";
import RetourHaut from "@/components/site/RetourHaut";
import { CHIFFRES } from "@/content/site/destinations";
import PaletteCommandes from "@/components/site/PaletteCommandes";

export const metadata: Metadata = {
  title: CHIFFRES.nom,
  description:
    "Indicateurs nationaux de population de Côte d'Ivoire, données officielles de l'ONP.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <ONPHeader />
      <main className="flex-1 bg-panel text-panel-foreground">{children}</main>
      <ONPFooter />
      <RetourHaut />
      <PaletteCommandes />
    </div>
  );
}
