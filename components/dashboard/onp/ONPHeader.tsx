"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/accueil/ThemeToggle";
import IndicatorSearch from "./IndicatorSearch";
import BoutonPalette from "@/components/site/BoutonPalette";

const NAV: { href: string; label: string }[] = [];

export default function ONPHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 xl:px-40 h-14 flex items-center justify-between gap-3 md:grid md:grid-cols-3">
        {/* Gauche - Logo + nom */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 justify-self-start">
          <Image
            src="/onp_logo_vf.png"
            alt="Logo de l'Office National de la Population"
            width={160}
            height={128}
            priority
            className="h-12 w-auto rounded-md object-contain"
          />
          {/* Sur téléphone, le nom entier déborde la barre : le sigle prend le
           * relais, le nom complet revient dès qu'il y a la place. */}
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-display font-semibold text-sm truncate">
              <span className="sm:hidden">ONP</span>
              <span className="hidden sm:inline">
                Office National de la Population
              </span>
            </span>
            {/* <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Observatoire Gouvernemental des Données de Population et du
              Dividende Démographique
            </span> */}
          </div>
        </Link>

        {/* Centre - Navigation */}
        <nav className="flex items-center gap-1 justify-self-center">
          {NAV.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Droite - Recherche + ThemeToggle */}
        <div className="flex items-center gap-2 justify-self-end">
          <div className="hidden md:block">
            <IndicatorSearch />
          </div>
          {/* Sous 768 px, le champ cède la place à la palette : même recherche,
            * en plein écran, sans disputer la barre au logo. */}
          <BoutonPalette className="md:hidden" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
