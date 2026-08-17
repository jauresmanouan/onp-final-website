import type { Metadata } from "next";
import ONPDashboard from "@/components/dashboard/onp/ONPDashboard";
import { CHIFFRES } from "@/content/site/destinations";

export const metadata: Metadata = {
  title: CHIFFRES.nom,
};

export default function DashboardPage() {
  return <ONPDashboard />;
}
