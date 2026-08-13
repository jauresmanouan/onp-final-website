import {
  ZoneAttente,
  SqueletteEnTete,
  SqueletteTexte,
} from "@/components/site/Squelettes";

/**
 * Attente par défaut des pages du site. Chaque rubrique dont la forme diffère
 * nettement pose son propre `loading`, celui-ci sert de filet aux autres.
 *
 * L'en-tête et le pied de page restent en place pendant ce temps : ils sont
 * portés par la mise en page, que Next conserve d'une navigation à l'autre.
 */
export default function Chargement() {
  return (
    <ZoneAttente>
      <SqueletteEnTete />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <SqueletteTexte lignes={5} />
      </div>
    </ZoneAttente>
  );
}
