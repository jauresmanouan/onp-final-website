import { Skeleton } from "@/components/ui/skeleton";

/**
 * Pièces d'attente du site.
 *
 * Chacune reprend la géométrie du contenu qu'elle remplace, aux mêmes
 * marges et aux mêmes proportions. C'est ce qui évite le sursaut à
 * l'arrivée des données : la page ne se réorganise pas, elle se remplit.
 *
 * L'ensemble est marqué `aria-hidden` et annoncé une seule fois par le
 * conteneur : un lecteur d'écran n'a rien à faire d'une douzaine de barres
 * grises, il lui faut seulement savoir que la page charge.
 */

/** Enveloppe commune : annonce l'attente, masque le décor aux lecteurs. */
export function ZoneAttente({
  children,
  libelle = "Chargement du contenu",
}: {
  children: React.ReactNode;
  libelle?: string;
}) {
  return (
    <div aria-busy="true">
      <span role="status" className="sr-only">
        {libelle}
      </span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

/** En-tête de rubrique, sur le fond vert du panneau. */
export function SqueletteEnTete({ compact = false }: { compact?: boolean }) {
  return (
    <section className="bg-panel">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-14 lg:pt-12 lg:pb-16">
        <Skeleton className="h-3 w-48 bg-white/15" />
        <Skeleton className="mt-8 h-3 w-24 bg-white/15" />
        <Skeleton
          className={`mt-4 bg-white/20 ${compact ? "h-8 w-3/4" : "h-11 w-2/3"}`}
        />
        <Skeleton className="mt-5 h-4 w-full max-w-3xl bg-white/10" />
        <Skeleton className="mt-2.5 h-4 w-2/3 max-w-2xl bg-white/10" />
      </div>
    </section>
  );
}

/** Grille de cartes illustrées : actualités, publications, pistes. */
export function SqueletteCartes({
  nombre = 3,
  colonnes = "sm:grid-cols-2 lg:grid-cols-3",
  ratio = "aspect-[16/10]",
}: {
  nombre?: number;
  colonnes?: string;
  ratio?: string;
}) {
  return (
    <div className={`grid gap-6 ${colonnes}`}>
      {Array.from({ length: nombre }, (_, i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className={`${ratio} w-full rounded-xl`} />
          <Skeleton className="mt-4 h-3 w-24" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/** Bloc de paragraphes. La dernière ligne est courte, comme au composé. */
export function SqueletteTexte({ lignes = 4 }: { lignes?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lignes }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lignes - 1 ? "w-2/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/**
 * Rangée de mesures chiffrées, celle de l'ouverture.
 *
 * Les hauteurs suivent celles du contenu réel, ligne par ligne : le grand
 * chiffre et son unité, la précision en `text-lg`, puis les quatre mesures
 * (`text-3xl lg:text-4xl`, intitulé en `text-sm`, précision en `text-xs`).
 * Une ligne de squelette plus courte que son texte fait remonter tout ce qui
 * suit à l'arrivée des données, et l'ouverture entière semble sursauter.
 */
export function SqueletteChiffres() {
  return (
    <div>
      <Skeleton className="h-[clamp(4.5rem,15vw,11rem)] w-80 max-w-full bg-white/20" />
      <Skeleton className="mt-4 h-7 w-96 max-w-full bg-white/10" />
      <div className="mt-14 grid grid-cols-2 gap-y-8 border-t border-white/15 pt-8 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={i > 0 ? "lg:pl-8" : "lg:pr-8"}>
            <Skeleton className="h-9 w-24 bg-white/20 lg:h-10" />
            <Skeleton className="mt-1.5 h-5 w-20 bg-white/10" />
            <Skeleton className="mt-0.5 h-4 w-28 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
