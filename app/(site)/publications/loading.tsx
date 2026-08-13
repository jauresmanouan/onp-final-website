import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoneAttente,
  SqueletteEnTete,
  SqueletteCartes,
} from "@/components/site/Squelettes";

/**
 * Les couvertures de PDF sont au format A4, nettement plus hautes que les
 * vignettes d'actualité : le squelette reprend ce ratio, sinon la grille
 * s'effondrerait de moitié à l'arrivée des images.
 */
export default function Chargement() {
  return (
    <ZoneAttente libelle="Chargement des publications">
      <SqueletteEnTete />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20 space-y-16">
        {Array.from({ length: 2 }, (_, i) => (
          <section key={i}>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
            <div className="mt-8">
              <SqueletteCartes nombre={3} ratio="aspect-[1/1.414]" />
            </div>
          </section>
        ))}
      </div>
    </ZoneAttente>
  );
}
