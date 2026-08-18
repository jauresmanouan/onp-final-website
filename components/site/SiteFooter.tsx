import Link from "next/link";
import Image from "next/image";
import { getInstitution, getLiensInstitutionnels } from "@/lib/content";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import Signature from "@/components/site/Signature";
import { CHIFFRES } from "@/content/site/destinations";

const RUBRIQUES = [
  { href: "/office", label: "L'Office" },
  { href: "/actualites", label: "Actualités" },
  { href: "/publications", label: "Publications" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "Foire aux questions" },
  { href: CHIFFRES.href, label: CHIFFRES.nom },
];

export default async function SiteFooter() {
  const { identite, contact } = await getInstitution();
  const liens = await getLiensInstitutionnels();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/onp_logo_vf.png"
                alt=""
                width={160}
                height={128}
                className="h-12 w-auto object-contain"
              />
              <Image
                src="/emblemes/armoiries-ci.svg"
                alt="Armoiries de la République de Côte d'Ivoire"
                width={48}
                height={48}
                className="h-11 w-auto object-contain"
              />
            </div>
            <p className="mt-4 font-display font-semibold">{identite.nom}</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm leading-relaxed">
              {identite.baseline}. Établissement public national créé par le{" "}
              {identite.decret.toLowerCase()}, sous la tutelle du{" "}
              {identite.tutelleTechnique}.
            </p>
          </div>

          <nav aria-label="Rubriques du site">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Le site
            </h2>
            <ul className="mt-4 space-y-2.5">
              {RUBRIQUES.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sites institutionnels">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              République de Côte d&apos;Ivoire
            </h2>
            <ul className="mt-4 space-y-2.5">
              {liens.slice(0, 5).map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {l.nom}
                    <NouvelleFenetre />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {identite.nom} · {contact.ville}
            </p>
          </div>
          <Signature />

          <div className="flex items-center gap-4">
            <a
              href={contact.facebook}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Facebook
              <NouvelleFenetre />
            </a>
            <a
              href={contact.twitter}
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              X
              <NouvelleFenetre />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
