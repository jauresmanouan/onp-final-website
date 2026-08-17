"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { retirerVoile } from "@/lib/assistant/ouverture";

/**
 * Lève le disque de transition à l'arrivée.
 *
 * La conversation le faisait pour elle-même, mais rien ne le faisait au
 * retour : en quittant le chat, le disque couvrait l'écran et y restait
 * jusqu'à son minuteur de secours, une seconde et demie de blanc avant que la
 * page ne reparaisse. Ce composant est le pendant, monté dans les deux
 * ossatures : dès que la page d'arrivée est peinte, le disque s'efface et la
 * découvre.
 *
 * Il écoute aussi les changements d'adresse : un disque oublié par une
 * navigation inattendue ne survit pas à la page suivante. En temps normal il
 * n'y a rien à retirer et l'appel ne coûte rien.
 */
export default function RetraitVoile() {
  const pathname = usePathname();

  useEffect(() => {
    retirerVoile();
  }, [pathname]);

  return null;
}
