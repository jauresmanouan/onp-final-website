"use client";

import { Info } from "lucide-react";
import { useIndicatorInfo } from "./IndicatorInfoContext";
import { ONP_INDICATORS } from "./indicators";

type Props = {
  /** Identifiant de l'indicateur dans le catalogue ONP_INDICATORS */
  indicatorId: string;
  className?: string;
};

/**
 * Petit bouton "i" qui ouvre le panneau de définition d'un indicateur.
 * Si l'indicateur n'est pas catalogué, le bouton ne s'affiche pas.
 */
export default function IndicatorInfoButton({ indicatorId, className = "" }: Props) {
  const { selectedId, open } = useIndicatorInfo();
  const exists = !!ONP_INDICATORS[indicatorId];
  if (!exists) return null;

  const isActive = selectedId === indicatorId;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        open(indicatorId);
      }}
      aria-label="Voir la définition de l'indicateur"
      className={`inline-flex items-center justify-center size-5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors cursor-pointer ${
        isActive ? "text-primary border-primary/60" : ""
      } ${className}`}
    >
      <Info className="size-3" />
    </button>
  );
}
