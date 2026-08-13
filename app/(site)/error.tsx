"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { BoutonLien } from "@/components/site/LienNavigation";

/**
 * Filet de sécurité des pages du site.
 *
 * Sans lui, une erreur de rendu renvoyait le visiteur sur la page d'erreur
 * par défaut de Next, hors charte et sans issue. Ici l'en-tête et le pied de
 * page restent en place, et deux sorties sont offertes : réessayer, ou
 * repartir de l'accueil.
 */
export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // La trace part dans la console du serveur comme du navigateur : sans
    // elle, seul le digest resterait, et il ne dit rien de la cause.
    console.error(error);
  }, [error]);

  return (
    <section className="bg-panel text-panel-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Erreur
        </p>
        <h1 className="mt-3 font-display text-3xl lg:text-4xl font-bold tracking-tight">
          Cette page n&apos;a pas pu s&apos;afficher
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-panel-foreground/85">
          Un incident est survenu pendant le chargement du contenu. Réessayez
          dans un instant ; si le problème persiste, écrivez-nous depuis la page
          de contact.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-panel-foreground/60">
            Référence de l&apos;incident : {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-panel cursor-pointer"
          >
            Réessayer
            <RotateCw className="size-4" aria-hidden="true" />
          </button>
          <BoutonLien href="/" variante="contour" icone="fleche">
            Retour à l&apos;accueil
          </BoutonLien>
        </div>
      </div>
    </section>
  );
}
