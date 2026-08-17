import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { CHIFFRES } from "@/content/site/destinations";

const NAVIGATION = [
  { href: "/", label: "Accueil" },
  { href: CHIFFRES.href, label: CHIFFRES.nom },
  { href: "/dashboard#districts", label: "Districts" },
] as const;

const DONNEES = [
  { href: "/dashboard#vue-ensemble", label: "Vue d'ensemble" },
  { href: "/dashboard#districts", label: "Données par district" },
  { href: "/dashboard#population", label: "Pyramides des âges" },
  { href: "/dashboard#sante", label: "Indicateurs sanitaires" },
  { href: "/dashboard#dividende-demo", label: "Dividende démographique" },
] as const;

export default function ONPFooter() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 xl:px-40 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Identité */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/onp_logo_vf.png"
                alt="Logo de l'Office National de la Population"
                width={160}
                height={128}
                className="h-12 w-auto rounded-md object-contain"
              />
              <span className="font-display font-semibold text-sm">
                Office National de la Population
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              L&apos;ONP est l&apos;institution publique chargée de produire et
              de diffuser les statistiques démographiques officielles de la Côte
              d&apos;Ivoire, en appui aux politiques publiques.
            </p>
            <div className="flex flex-col gap-1.5 mt-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                Abidjan, Côte d&apos;Ivoire
              </p>
              <a
                href="mailto:contact@onp.ci"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                contact@onp.ci
              </a>
              <a
                href="tel:+22527222100000"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                +225 27 22 21 00 00
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-foreground mb-1">
              Navigation
            </h3>
            {NAVIGATION.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Données */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-foreground mb-1">
              Données
            </h3>
            {DONNEES.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Office National de la Population · Tous
            droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
