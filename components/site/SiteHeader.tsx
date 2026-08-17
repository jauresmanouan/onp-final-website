"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/accueil/ThemeToggle";
import { BoutonLien } from "@/components/site/LienNavigation";
import BarreChargement from "@/components/site/BarreChargement";
import BoutonPalette from "@/components/site/BoutonPalette";
import { IDENTITE } from "@/content/site/institution";
import { CHIFFRES } from "@/content/site/destinations";

const NAV = [
  { href: "/office", label: "L'Office" },
  { href: "/actualites", label: "Actualités" },
  { href: "/publications", label: "Publications" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

/**
 * En-tête du site institutionnel, distinct de celui du tableau de bord :
 * celui-ci porte l'identité de l'État et la navigation éditoriale, l'autre
 * reste dédié à la lecture des données. Le lien vers la banque de données
 * fait la passerelle entre les deux.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);

  // Le menu se referme dès que la page a changé. Le faire au clic de chaque
  // lien laissait le panneau ouvert derrière un retour navigateur, et le
  // refermait avant même que la page suivante ne soit prête.
  useEffect(() => {
    setOuvert(false);
  }, [pathname]);

  const estActif = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border">
      {/* Filet aux couleurs nationales */}
      <div aria-hidden="true" className="flex h-1">
        <span className="flex-1 bg-[#FF8200]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#009A44]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Image
              src="/onp_logo_vf.png"
              alt=""
              width={160}
              height={128}
              priority
              className="h-12 w-auto shrink-0 object-contain"
            />
            <span className="flex flex-col leading-tight min-w-0">
              {/* Le nom entier ne tient pas sur un téléphone à côté du logo,
               * du thème et du menu : le sigle prend le relais. */}
              <span className="font-display font-bold tracking-tight truncate">
                <span className="sm:hidden">{IDENTITE.sigle}</span>
                <span className="hidden sm:inline">{IDENTITE.nom}</span>
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                République de Côte d&apos;Ivoire
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={estActif(item.href) ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:after:h-0.5 motion-reduce:after:transition-none ${
                  estActif(item.href)
                    ? "text-primary after:scale-x-100 after:h-0.5"
                    : "text-foreground/80 hover:text-foreground focus-visible:text-foreground"
                }`}
              >
                {item.label}
                <BarreChargement />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <BoutonLien
              href={CHIFFRES.href}
              variante="primary"
              libelleChargement="Chargement…"
              className="hidden sm:inline-flex"
            >
              {CHIFFRES.nom}
            </BoutonLien>
            <BoutonPalette />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-expanded={ouvert}
              aria-controls="menu-mobile"
              aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {ouvert ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {ouvert && (
        <nav
          id="menu-mobile"
          className="lg:hidden border-t border-border bg-background px-6 py-3"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                estActif(item.href)
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:bg-muted"
              }`}
            >
              {item.label}
              <BarreChargement />
            </Link>
          ))}
          <BoutonLien
            href={CHIFFRES.href}
            variante="primary"
            libelleChargement="Chargement…"
            className="mt-2 flex w-full py-2.5"
          >
            {CHIFFRES.nom}
          </BoutonLien>
        </nav>
      )}
    </header>
  );
}
