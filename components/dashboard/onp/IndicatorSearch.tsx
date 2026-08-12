"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  searchIndicators,
  getIndicatorTab,
  type IndicatorInfo,
} from "./indicators";

/**
 * Barre de recherche d'indicateurs (navbar ONP).
 * Filtre le catalogue ONP_INDICATORS et, à la sélection, navigue vers le bon
 * onglet du dashboard puis ouvre la fiche de l'indicateur via l'événement
 * global `onp:open-indicator` (écouté par ONPDashboard / IndicatorPanelBridge).
 */
export default function IndicatorSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchIndicators(query), [query]);

  // Fermer au clic extérieur
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Réinitialiser l'élément actif quand les résultats changent
  useEffect(() => setActive(0), [query]);

  const select = (ind: IndicatorInfo) => {
    const tab = getIndicatorTab(ind.id);
    const dispatch = () => {
      window.dispatchEvent(
        new CustomEvent("onp:open-indicator", {
          detail: { id: ind.id, tab },
        }),
      );
    };
    // Si on n'est pas sur le dashboard, y aller d'abord puis déclencher.
    if (pathname !== "/onp") {
      router.push(`/onp#${tab}`);
      // Laisser le dashboard se monter avant d'émettre l'événement.
      setTimeout(dispatch, 350);
    } else {
      dispatch();
    }
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const ind = results[active];
      if (ind) select(ind);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Rechercher un indicateur…"
          aria-label="Rechercher un indicateur"
          className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-80 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-muted-foreground">
              Aucun indicateur trouvé.
            </p>
          ) : (
            results.map((ind, i) => (
              <button
                key={ind.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => select(ind)}
                className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors cursor-pointer ${
                  i === active ? "bg-muted" : "hover:bg-muted/60"
                }`}
              >
                <span className="text-xs font-medium text-foreground leading-snug">
                  {ind.label}
                </span>
                {ind.unit && (
                  <span className="text-[11px] text-muted-foreground">
                    {ind.unit}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
