"use client";

import { useEffect } from "react";
import { useIndicatorInfo } from "./IndicatorInfoContext";

/**
 * Pont entre la barre de recherche (rendue dans la navbar, hors du provider)
 * et le panneau d'information (dans le provider). Écoute l'événement global
 * `onp:open-indicator` et ouvre la fiche de l'indicateur correspondant.
 *
 * Doit être monté à l'intérieur de <IndicatorInfoProvider>.
 */
export default function IndicatorPanelBridge() {
  const { open } = useIndicatorInfo();

  useEffect(() => {
    const onOpenIndicator = (e: Event) => {
      const id = (e as CustomEvent<{ id: string; tab: string }>).detail?.id;
      if (id) open(id);
    };
    window.addEventListener("onp:open-indicator", onOpenIndicator);
    return () =>
      window.removeEventListener("onp:open-indicator", onOpenIndicator);
  }, [open]);

  return null;
}
