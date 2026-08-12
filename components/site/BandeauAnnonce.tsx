"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Info, CalendarClock, TriangleAlert, ArrowRight } from "lucide-react";
import type { Annonce } from "@/content/site/annonces";

const TONS = {
  info: {
    icone: Info,
    fond: "bg-primary/10 border-primary/25",
    accent: "text-primary",
  },
  evenement: {
    icone: CalendarClock,
    fond: "bg-accent/10 border-accent/30",
    accent: "text-accent",
  },
  alerte: {
    icone: TriangleAlert,
    fond: "bg-destructive/10 border-destructive/30",
    accent: "text-destructive",
  },
} as const;

/**
 * Bandeau d'information. Le rendu est différé au montage : marqué comme
 * fermé côté client, il apparaîtrait puis disparaîtrait sous les yeux du
 * visiteur si le serveur l'avait déjà écrit dans la page.
 */
export default function BandeauAnnonce({ annonce }: { annonce: Annonce }) {
  const cle = `annonce-fermee:${annonce.id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(cle) !== "1") setVisible(true);
    } catch {
      // Navigation privée ou stockage refusé : on montre le bandeau
      setVisible(true);
    }
  }, [cle]);

  const fermer = () => {
    setVisible(false);
    try {
      localStorage.setItem(cle, "1");
    } catch {
      // Sans stockage, le bandeau reviendra au prochain chargement
    }
  };

  if (!visible) return null;

  const { icone: Icone, fond, accent } = TONS[annonce.ton];

  return (
    <div role="status" className={`border-b ${fond}`}>
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-6 py-3 lg:px-10">
        <Icone className={`mt-0.5 size-4 shrink-0 ${accent}`} aria-hidden="true" />

        <p className="flex-1 text-sm leading-relaxed">
          <span className={`font-semibold uppercase tracking-wide ${accent}`}>
            {annonce.etiquette}
          </span>
          <span className="mx-2 text-muted-foreground" aria-hidden="true">
            ·
          </span>
          {annonce.message}
          {annonce.lien && (
            <Link
              href={annonce.lien.href}
              className={`ml-2 inline-flex items-center gap-1 font-semibold hover:underline ${accent}`}
            >
              {annonce.lien.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </p>

        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer ce message"
          className="-mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
