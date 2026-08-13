"use client";

import { useEffect, useState } from "react";

type Entree = { id: string; label: string };

/**
 * Sommaire d'une page longue : il accompagne la descente et dit où l'on est.
 *
 * La rubrique en cours de lecture porte le même filet que la rubrique
 * courante de l'en-tête : un seul signe pour dire « je suis ici », qu'on soit
 * dans la navigation principale ou dans le sommaire d'une page.
 */
export default function SommairePage({
  entrees,
  titre = "Sur cette page",
}: {
  entrees: Entree[];
  titre?: string;
}) {
  const [actif, setActif] = useState<string>(entrees[0]?.id ?? "");

  useEffect(() => {
    const sections = entrees
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // On ne suit pas « la section visible » (il y en a souvent plusieurs) mais
    // la dernière dont le haut est passé sous l'en-tête : c'est celle que l'on
    // est en train de lire. En bas de page, la dernière l'emporte, sinon les
    // sections courtes de fin ne s'allumeraient jamais.
    const calculer = () => {
      const limite = 140; // hauteur de l'en-tête collant, avec un peu de marge
      const finDePage =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      let courante = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= limite) courante = section;
      }
      setActif(finDePage ? sections[sections.length - 1].id : courante.id);
    };

    calculer();
    window.addEventListener("scroll", calculer, { passive: true });
    window.addEventListener("resize", calculer);
    return () => {
      window.removeEventListener("scroll", calculer);
      window.removeEventListener("resize", calculer);
    };
  }, [entrees]);

  return (
    <nav aria-label="Sommaire" className="lg:w-52">
      <div className="lg:sticky lg:top-28">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {titre}
        </p>
        <ul className="mt-4 space-y-2.5">
          {entrees.map((e) => {
            const estActif = e.id === actif;
            return (
              <li key={e.id}>
                <a
                  href={`#${e.id}`}
                  aria-current={estActif ? "true" : undefined}
                  className={`relative inline-block pb-1 text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none ${
                    estActif
                      ? "text-primary font-medium after:scale-x-100 after:h-0.5"
                      : "text-foreground/75 hover:text-primary"
                  }`}
                >
                  {e.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
