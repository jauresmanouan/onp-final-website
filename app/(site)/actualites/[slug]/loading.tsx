import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoneAttente,
  SqueletteEnTete,
  SqueletteTexte,
} from "@/components/site/Squelettes";

/** Un article : en-tête compact, visuel en bandeau, puis le corps de texte. */
export default function Chargement() {
  return (
    <ZoneAttente libelle="Chargement de l'article">
      <SqueletteEnTete compact />

      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-14 lg:py-16">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="mt-8 h-5 w-full" />
        <Skeleton className="mt-2.5 h-5 w-4/5" />
        <div className="mt-8">
          <SqueletteTexte lignes={7} />
        </div>
      </div>
    </ZoneAttente>
  );
}
