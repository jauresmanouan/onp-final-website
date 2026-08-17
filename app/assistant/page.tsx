import Conversation from "@/components/site/assistant/Conversation";

/**
 * La conversation.
 *
 * Le tableau de bord répond à qui sait déjà quel indicateur regarder ; les
 * publications, à qui accepte de lire quarante pages. Entre les deux, la
 * question posée en français n'avait pas de porte. C'est celle-ci.
 *
 * Une seule colonne, la largeur d'une page lue, et rien d'autre à l'écran.
 */
export default function AssistantPage() {
  return (
    <div className="entree-chat mx-auto flex h-full max-w-2xl flex-col px-4 sm:px-6">
      <Conversation />
    </div>
  );
}
