import type { Metadata } from "next";
import ONPHeader from "@/components/dashboard/onp/ONPHeader";
import ONPFooter from "@/components/dashboard/onp/ONPFooter";

export const metadata: Metadata = {
  title: "Tableau de bord",
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
    </div>
  );
}
