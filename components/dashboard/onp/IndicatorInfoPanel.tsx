"use client";

import {
  X,
  BookOpen,
  Sigma,
  Ruler,
  Database,
  CalendarRange,
} from "lucide-react";
import { useEffect } from "react";
import { useIndicatorInfo } from "./IndicatorInfoContext";
import { getIndicator } from "./indicators";

/**
 * Panneau latéral qui affiche la fiche d'un indicateur (définition, formule,
 * unité, source, période) lorsqu'un IndicatorInfoButton est cliqué.
 */
export default function IndicatorInfoPanel() {
  const { selectedId, close } = useIndicatorInfo();
  const indicator = getIndicator(selectedId ?? undefined);
  const isOpen = !!indicator;

  // Fermer avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Overlay (mobile uniquement - discret pour ne pas masquer la donnée) */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[1px] transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panneau */}
      <aside
        role="dialog"
        aria-label="Définition de l'indicateur"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[380px] bg-card border-l border-border shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Indicateur
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {indicator && (
          <div className="overflow-y-auto h-[calc(100%-3.5rem)] p-5 space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground leading-snug">
                {indicator.label}
              </h2>
            </div>

            <Section icon={BookOpen} title="Définition">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {indicator.definition}
              </p>
            </Section>

            {indicator.formula && (
              <Section icon={Sigma} title="Méthode de calcul">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {indicator.formula}
                </p>
              </Section>
            )}

            {indicator.unit && (
              <Section icon={Ruler} title="Unité">
                <p className="text-sm text-foreground">{indicator.unit}</p>
              </Section>
            )}

            {indicator.source && (
              <Section icon={Database} title="Source">
                <p className="text-sm text-muted-foreground">
                  {indicator.source}
                </p>
              </Section>
            )}

            {indicator.period && (
              <Section icon={CalendarRange} title="Période">
                <p className="text-sm text-muted-foreground">
                  {indicator.period}
                </p>
              </Section>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="size-3.5 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
