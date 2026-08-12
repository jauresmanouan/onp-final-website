/**
 * Indicateurs cartographiables/graphables depuis districts_snapshot_2021.csv.
 * Source unique partagée par la carte choroplèthe et le bar chart.
 */

export type DistrictRow = {
  district: string;
  population: string;
  dependance_eco: string;
  qualite_cadre_vie: string;
  transition_pauvrete: string;
  capital_humain: string;
  reseaux_territoires: string;
  dividende_demo: string;
};

export const DISTRICT_INDICATORS = [
  { key: "population", label: "Population", kind: "count" },
  { key: "dividende_demo", label: "Dividende démographique", kind: "score" },
  { key: "capital_humain", label: "Capital humain", kind: "score" },
  { key: "qualite_cadre_vie", label: "Qualité du cadre de vie", kind: "score" },
  { key: "transition_pauvrete", label: "Transition de la pauvreté", kind: "score" },
  { key: "reseaux_territoires", label: "Réseaux & territoires", kind: "score" },
  { key: "dependance_eco", label: "Dépendance économique", kind: "score" },
] as const;

export type DistrictIndicatorKey = (typeof DISTRICT_INDICATORS)[number]["key"];

export function getDistrictIndicator(key: string) {
  return (
    DISTRICT_INDICATORS.find((i) => i.key === key) ?? DISTRICT_INDICATORS[0]
  );
}
