import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoneAttente,
  SqueletteEnTete,
  SqueletteCartes,
} from "@/components/site/Squelettes";

/** L'article en une occupe deux colonnes, les suivants forment la grille. */
export default function Chargement() {
  return (
    <ZoneAttente libelle="Chargement des actualités">
      <SqueletteEnTete />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-8 w-full" />
            <Skeleton className="mt-2 h-8 w-3/4" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-6 h-4 w-32" />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <SqueletteCartes nombre={6} />
        </div>
      </div>
    </ZoneAttente>
  );
}
