import type { Metadata } from "next";
import CadreConversation from "@/components/site/assistant/CadreConversation";
import { ASSISTANT } from "@/content/site/destinations";

export const metadata: Metadata = {
  title: ASSISTANT.appel,
  description:
    "Interrogez en français les indicateurs, les rapports et les notes de politique de l'Office National de la Population de Côte d'Ivoire.",
  // Une conversation n'a rien à indexer : la page est vide sans question.
  robots: { index: false, follow: true },
};

/**
 * Coquille de la conversation.
 *
 * Elle est délibérément hors du site comme du tableau de bord : ni menu, ni
 * fil d'Ariane, ni pied de page. Une page de conversation est un endroit où
 * l'on écrit, et tout ce qui entoure le champ dispute son attention. Le cadre
 * et ses deux mouvements sont dans un composant client ; il ne reste ici que
 * ce qui doit rester au serveur, les métadonnées.
 */
export default function AssistantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <CadreConversation>{children}</CadreConversation>;
}
