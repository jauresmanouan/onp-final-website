"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import type { Annonce } from "@/content/site/annonces";

const ACCENTS = {
  info: "text-primary",
  evenement: "text-accent",
  alerte: "text-destructive",
} as const;

/**
 * Bandeau d'information défilant.
 *
 * Le rendu est différé au montage : marqué comme fermé côté client, il
 * apparaîtrait puis disparaîtrait sous les yeux du visiteur si le serveur
 * l'avait déjà écrit dans la page.
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

  const accent = ACCENTS[annonce.ton];

  // Un message long doit défiler plus longtemps pour rester lisible.
  const duree = Math.max(24, Math.round(annonce.message.length / 4));

  const contenu = (
    <>
      <span className={`font-semibold uppercase tracking-wide ${accent}`}>
        {annonce.etiquette}
      </span>
      <span className="mx-2.5 text-muted-foreground" aria-hidden="true">
        ·
      </span>
      {annonce.message}
    </>
  );

  return (
    <div
      role="status"
      className="bandeau-defilant border-b border-border bg-muted/60"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-2.5 lg:px-10">
        {/* Pastille rouge : le halo pulse, le point reste net */}
        <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70" />
          <span className="relative inline-flex size-2.5 rounded-full bg-red-600" />
        </span>

        {/* La piste porte deux copies : la seconde masque le raccord */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="piste-defilante flex w-max items-center gap-16 whitespace-nowrap text-sm"
            style={{ ["--duree-defilement" as string]: `${duree}s` }}
          >
            <span className="flex items-center">{contenu}</span>
            <span className="flex items-center" aria-hidden="true">
              {contenu}
            </span>
          </div>
        </div>

        {annonce.lien && (
          <Link
            href={annonce.lien.href}
            className={`hidden shrink-0 items-center gap-1 text-sm font-semibold hover:underline sm:inline-flex ${accent}`}
          >
            {annonce.lien.label}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}

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
