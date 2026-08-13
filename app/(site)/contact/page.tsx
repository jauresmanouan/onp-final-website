import type { Metadata } from "next";
import { Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import PageHeader from "@/components/site/PageHeader";
import { LienFleche } from "@/components/site/LienNavigation";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import { getCoordonnees } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Coordonnées de l'Office National de la Population de Côte d'Ivoire : adresse à Cocody, téléphone, numéro vert et adresse électronique.",
};

export default async function ContactPage() {
  const c = await getCoordonnees();

  return (
    <>
      <PageHeader
        surtitre="Nous joindre"
        titre="Contact"
        chapeau="Pour toute demande d'information sur les travaux de l'Office, ses publications ou ses données."
      />

      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-6">
            <MapPin className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Adresse</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {c.entite}
              <br />
              {c.adresse}
              <br />
              {c.ville}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Adresse postale : {c.adressePostale}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <Phone className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Téléphone</h2>
            <ul className="mt-2 space-y-2.5">
              {c.telephones.map((t) => (
                <li key={t.numero} className="text-sm">
                  <span className="text-muted-foreground">{t.libelle}</span>
                  <br />
                  <a
                    href={`tel:${t.numero.replace(/\s/g, "")}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {t.numero}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <PhoneCall className="size-5 text-accent" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Numéro vert</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Appel gratuit depuis la Côte d&apos;Ivoire.
            </p>
            <a
              href={`tel:${c.numeroVert}`}
              className="mt-2 inline-block font-display text-3xl font-bold tracking-tight text-accent tabular-nums"
            >
              {c.numeroVert}
            </a>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold">Adresse électronique</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Écrivez-nous pour toute demande d&apos;information.
            </p>
            <a
              href={`mailto:${c.email}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {c.email}
            </a>
          </section>
        </div>

        <section className="mt-12 rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="font-semibold">Sur les réseaux</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={c.facebook}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              Facebook
              <NouvelleFenetre />
            </a>
            <a
              href={c.twitter}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              X
              <NouvelleFenetre />
            </a>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-[15px] text-muted-foreground">
            Votre question a peut-être déjà sa réponse.
          </p>
          <LienFleche href="/faq">Consulter la foire aux questions</LienFleche>
        </div>
      </div>
    </>
  );
}
