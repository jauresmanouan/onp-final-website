"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/accueil/ThemeToggle";
import { IDENTITE } from "@/content/site/institution";

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
              <span className="font-display font-bold tracking-tight truncate">
                {IDENTITE.nom}
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
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  estActif(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Banque de données
              <ArrowUpRight className="size-4" />
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-expanded={ouvert}
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
          className="lg:hidden border-t border-border bg-background px-6 py-3"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOuvert(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                estActif(item.href)
                  ? "text-primary bg-primary/10"
                  : "text-foreground/80 hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOuvert(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Banque de données
            <ArrowUpRight className="size-4" />
          </Link>
        </nav>
      )}
    </header>
  );
}
