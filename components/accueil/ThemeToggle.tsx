"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Durée du fondu, à tenir avec celle de `.fondu-theme` dans globals.css. */
const FONDU_MS = 320;

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const minuteur = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Un fondu en cours au démontage laisserait la classe sur `html`, et toute
  // la page garderait une transition sur ses couleurs.
  useEffect(() => {
    return () => {
      if (minuteur.current !== null) window.clearTimeout(minuteur.current);
    };
  }, []);

  const toggle = () => {
    const next = !isDark;
    const racine = document.documentElement;

    const sobre = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!sobre) {
      // La classe autorise le fondu, la bascule de thème le déclenche, et le
      // minuteur le referme. Sans ce retrait, chaque couleur du site resterait
      // en transition permanente et les survols deviendraient pâteux.
      racine.classList.add("fondu-theme");
      if (minuteur.current !== null) window.clearTimeout(minuteur.current);
      minuteur.current = window.setTimeout(() => {
        racine.classList.remove("fondu-theme");
        minuteur.current = null;
      }, FONDU_MS);
    }

    setIsDark(next);
    racine.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
    >
      {mounted ? (
        // La clé change avec le thème : React remplace l'icône au lieu de la
        // muter, ce qui rejoue l'animation à chaque bascule.
        <span key={isDark ? "clair" : "sombre"} className="bascule-theme">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </span>
      ) : (
        <Moon className="h-4 w-4 opacity-0" />
      )}
    </button>
  );
}
