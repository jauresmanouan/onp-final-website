"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import {
  searchIndicators,
  getIndicatorTab,
  ONP_INDICATORS,
} from "@/components/dashboard/onp/indicators";
import { ASSISTANT, CHIFFRES } from "@/content/site/destinations";
// Les catalogues sont des modules de données : les importer ici met la liste
// des titres dans le paquet client, quelques kilo-octets pour une recherche
// qui répond sans aller-retour réseau. Le jour où le contenu viendra d'un
// CMS, c'est cette importation qui deviendra un appel.
import { ACTUALITES_RECENTES } from "@/content/site/actualites";
import { PUBLICATIONS } from "@/content/site/publications";

/**
 * Palette de commandes, appelée au clavier depuis n'importe quelle page.
 *
 * La recherche d'indicateurs existait, mais enfermée dans l'en-tête du tableau
 * de bord et absente sous 768 px. Elle devient ici un geste : ⌘K ou Ctrl+K
 * l'ouvre partout, du site comme du tableau de bord, et le bouton de l'en-tête
 * mobile y donne accès sans clavier.
 *
 * Elle ne coûte aucun pixel tant qu'on ne l'appelle pas — c'est tout son
 * intérêt sur des pages déjà denses.
 */

type Destination = {
  id: string;
  libelle: string;
  detail?: string;
  groupe:
    | "Indicateurs"
    | typeof CHIFFRES.nom
    | "Pages"
    | "Actualités"
    | "Publications";
  /** Ce que fait la sélection : naviguer, et parfois ouvrir une fiche. */
  aller: () => void;
};

const PAGES = [
  { href: "/", libelle: "Accueil" },
  { href: ASSISTANT.href, libelle: ASSISTANT.appel, detail: ASSISTANT.detail },
  { href: "/office", libelle: "L'Office", detail: "Missions, histoire, organisation" },
  { href: "/actualites", libelle: "Actualités" },
  { href: "/publications", libelle: "Publications" },
  { href: "/partenaires", libelle: "Partenaires" },
  { href: "/faq", libelle: "Questions fréquentes" },
  { href: "/contact", libelle: "Contact" },
];

const ONGLETS = [
  { hash: "vue-ensemble", libelle: "Vue d'ensemble" },
  { hash: "districts", libelle: "Districts", detail: "Carte et classements" },
  { hash: "population", libelle: "Population" },
  { hash: "sante", libelle: "Santé" },
  { hash: "dividende-demo", libelle: "Dividende démographique" },
];

/** Sans accents ni casse : « santé » se trouve en tapant « sante ». */
const sansAccent = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export default function PaletteCommandes() {
  const router = useRouter();
  const pathname = usePathname();
  const [ouverte, setOuverte] = useState(false);
  const [requete, setRequete] = useState("");
  const [actif, setActif] = useState(0);
  const listeRef = useRef<HTMLDivElement>(null);

  // ⌘K sur Mac, Ctrl+K ailleurs. Le raccourci ferme aussi la palette : le même
  // geste, dans les deux sens.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOuverte((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // La page ne défile pas derrière la palette : sur un téléphone, le geste de
  // parcourir la liste emportait sinon la page avec lui.
  useEffect(() => {
    if (!ouverte) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = precedent;
    };
  }, [ouverte]);

  // Ouverture par le bouton de l'en-tête, qui n'a pas de clavier sous la main.
  useEffect(() => {
    const onOuvrir = () => setOuverte(true);
    window.addEventListener("onp:ouvrir-palette", onOuvrir);
    return () => window.removeEventListener("onp:ouvrir-palette", onOuvrir);
  }, []);

  const fermer = useCallback(() => {
    setOuverte(false);
    setRequete("");
    setActif(0);
  }, []);

  /**
   * Ouvre la fiche d'un indicateur. Hors du tableau de bord, il faut d'abord
   * s'y rendre : l'événement n'a d'auditeur qu'une fois le tableau monté.
   */
  const ouvrirIndicateur = useCallback(
    (id: string) => {
      const onglet = getIndicatorTab(id);
      const emettre = () =>
        window.dispatchEvent(
          new CustomEvent("onp:open-indicator", { detail: { id, tab: onglet } }),
        );

      if (pathname === "/dashboard") {
        emettre();
      } else {
        router.push(`/dashboard#${onglet}`);
        setTimeout(emettre, 400);
      }
    },
    [pathname, router],
  );

  const destinations = useMemo<Destination[]>(() => {
    const q = requete.trim();

    const indicateurs = (
      q ? searchIndicators(q, 6) : Object.values(ONP_INDICATORS).slice(0, 4)
    ).map<Destination>((ind) => ({
      id: `ind-${ind.id}`,
      libelle: ind.label,
      detail: ind.unit ?? ind.period,
      groupe: "Indicateurs",
      aller: () => ouvrirIndicateur(ind.id),
    }));

    const filtre = (texte: string) =>
      !q || sansAccent(texte).includes(sansAccent(q));

    // Les articles et les documents ne se proposent qu'à la demande : sans
    // requête, la palette doit ouvrir sur des repères, pas sur un catalogue.
    const articles = !q
      ? []
      : ACTUALITES_RECENTES.filter(
          (a) => filtre(a.titre) || filtre(a.chapeau),
        )
          .slice(0, 4)
          .map<Destination>((a) => ({
            id: `actu-${a.slug}`,
            libelle: a.titre,
            detail: a.date ?? undefined,
            groupe: "Actualités",
            aller: () => router.push(`/actualites/${a.slug}`),
          }));

    const documents = !q
      ? []
      : PUBLICATIONS.filter((p) => filtre(p.titre) || filtre(p.resume))
          .slice(0, 4)
          .map<Destination>((p) => ({
            id: `pub-${p.slug}`,
            libelle: p.titre,
            detail: "PDF",
            groupe: "Publications",
            // Le document s'ouvre en lecture, comme partout ailleurs sur le
            // site : on ne télécharge pas ce qu'on n'a pas encore vu.
            aller: () => window.open(p.fichier, "_blank", "noopener"),
          }));

    const onglets = ONGLETS.filter((o) => filtre(o.libelle)).map<Destination>(
      (o) => ({
        id: `tab-${o.hash}`,
        libelle: o.libelle,
        detail: o.detail,
        groupe: CHIFFRES.nom,
        aller: () => router.push(`/dashboard#${o.hash}`),
      }),
    );

    const pages = PAGES.filter((p) => filtre(p.libelle)).map<Destination>(
      (p) => ({
        id: `page-${p.href}`,
        libelle: p.libelle,
        detail: p.detail,
        groupe: "Pages",
        aller: () => router.push(p.href),
      }),
    );

    return [...indicateurs, ...onglets, ...pages, ...articles, ...documents];
  }, [requete, router, ouvrirIndicateur]);

  useEffect(() => setActif(0), [requete]);

  // La ligne active suit les flèches, y compris hors du champ visible.
  useEffect(() => {
    listeRef.current
      ?.querySelector('[data-actif="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [actif]);

  if (!ouverte) return null;

  const choisir = (d: Destination) => {
    d.aller();
    fermer();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return fermer();
    if (destinations.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActif((a) => (a + 1) % destinations.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((a) => (a - 1 + destinations.length) % destinations.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const d = destinations[actif];
      if (d) choisir(d);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] animate-in fade-in duration-150"
      onClick={fermer}
    >
      <div aria-hidden="true" className="fixed inset-0 bg-foreground/25 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recherche et navigation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Rechercher un indicateur, un article, un document…"
            aria-label="Rechercher"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            Échap
          </kbd>
        </div>

        <div ref={listeRef} className="max-h-[min(60vh,26rem)] overflow-y-auto py-2">
          {destinations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Rien ne correspond à « {requete.trim()} ».
            </p>
          ) : (
            destinations.map((d, i) => (
              <div key={d.id}>
                {/* L'intitulé de groupe n'apparaît qu'au changement de groupe */}
                {(i === 0 || destinations[i - 1].groupe !== d.groupe) && (
                  <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground first:pt-1">
                    {d.groupe}
                  </p>
                )}
                <button
                  type="button"
                  data-actif={i === actif}
                  onMouseMove={() => setActif(i)}
                  onClick={() => choisir(d)}
                  className={`flex w-full items-baseline gap-3 px-4 py-2 text-left transition-colors cursor-pointer ${
                    i === actif ? "bg-muted" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {d.libelle}
                  </span>
                  {d.detail && (
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {d.detail}
                    </span>
                  )}
                  {i === actif && (
                    <CornerDownLeft
                      className="size-3 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
