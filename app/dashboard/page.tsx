import type { Metadata } from "next";
import ONPDashboard from "@/components/dashboard/onp/ONPDashboard";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

export default function DashboardPage() {
  return <ONPDashboard />;
}
