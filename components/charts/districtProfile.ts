/**
 * Assemble le profil complet d'un district : le cliché 2021 (population et
 * six scores) et les six séries "dividende démographique" 2015-2020.
 *
 * Les deux sources ne s'accordent pas sur l'orthographe des districts
 * ("Gôh-Djiboua" côté séries, "Goh-Djiboua" côté cliché), d'où le
 * rapprochement sur une clé sans diacritiques.
 */

import { parseNumber } from "./transformCSV";
import type { CSVRow } from "./useCSV";
import type { DistrictRow } from "./districtIndicators";

/** Séries annuelles du dividende démographique, un fichier par indice. */
export const DD_SERIES = [
  {
    id: "ddmi",
    file: "/data/onp/indicateurs_DD_DDMI.csv",
    label: "DDMI",
    fullLabel: "Indice multi-dimensionnel du dividende démographique",
  },
  {
    id: "idhe",
    file: "/data/onp/indicateurs_DD_IDHE.csv",
    label: "IDHE",
    fullLabel: "Développement humain élargi",
  },
  {
    id: "icde",
    file: "/data/onp/indicateurs_DD_ICDE.csv",
    label: "ICDE",
    fullLabel: "Cadre démo-économique",
  },
  {
    id: "iqcv",
    file: "/data/onp/indicateurs_DD_IQCV.csv",
    label: "IQCV",
    fullLabel: "Qualité du cadre de vie",
  },
  {
    id: "isrt",
    file: "/data/onp/indicateurs_DD_ISRT.csv",
    label: "ISRT",
    fullLabel: "Réseaux et territoires",
  },
  {
    id: "issp",
    file: "/data/onp/indicateurs_DD_ISSP.csv",
    label: "ISSP",
    fullLabel: "Stabilité sociale et politique",
  },
] as const;

export const DD_YEARS = ["2015", "2016", "2017", "2018", "2019", "2020"];

/** Clé de rapprochement : sans accents, sans casse, sans séparateurs. */
export function districtKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export type ScoreStat = {
  key: string;
  label: string;
  value: number;
  /** Rang du district, 1 = valeur la plus élevée. */
  rank: number;
  /** Nombre de districts comparés. */
  total: number;
  /** Moyenne des districts, pour situer la valeur. */
  average: number;
};

export type SerieStat = {
  id: string;
  label: string;
  fullLabel: string;
  /** Valeurs annuelles, dans l'ordre de DD_YEARS ; null si absente. */
  values: (number | null)[];
  first: number | null;
  last: number | null;
  /** Variation relative entre la première et la dernière valeur, en %. */
  change: number | null;
};

/**
 * Classe les districts sur un indicateur et renvoie le rang du district visé.
 * Les rangs sont serrés : deux valeurs égales partagent le même rang.
 */
function rankOf(values: number[], value: number): number {
  return values.filter((v) => v > value).length + 1;
}

export function buildScoreStats(
  rows: DistrictRow[],
  district: string,
  indicators: readonly { key: string; label: string }[],
): ScoreStat[] {
  const key = districtKey(district);
  const target = rows.find((r) => districtKey(r.district) === key);
  if (!target) return [];

  return indicators.flatMap((indicator) => {
    const value = parseNumber(target[indicator.key as keyof DistrictRow]);
    if (value == null) return [];

    const all = rows
      .map((r) => parseNumber(r[indicator.key as keyof DistrictRow]))
      .filter((v): v is number => v != null);

    return [
      {
        key: indicator.key,
        label: indicator.label,
        value,
        rank: rankOf(all, value),
        total: all.length,
        average: all.reduce((sum, v) => sum + v, 0) / all.length,
      },
    ];
  });
}

export function buildSerieStat(
  rows: CSVRow[],
  district: string,
  serie: (typeof DD_SERIES)[number],
): SerieStat | null {
  const key = districtKey(district);
  const row = rows.find((r) => districtKey(r.district ?? "") === key);
  if (!row) return null;

  const values = DD_YEARS.map((year) => parseNumber(row[year]));
  const known = values.filter((v): v is number => v != null);
  if (known.length === 0) return null;

  const first = known[0];
  const last = known[known.length - 1];
  const change = first !== 0 ? ((last - first) / first) * 100 : null;

  return {
    id: serie.id,
    label: serie.label,
    fullLabel: serie.fullLabel,
    values,
    first,
    last,
    change,
  };
}

/** Part du district dans la population nationale, en %. */
export function populationShare(
  rows: DistrictRow[],
  district: string,
): number | null {
  const key = districtKey(district);
  let total = 0;
  let target: number | null = null;
  for (const row of rows) {
    const value = parseNumber(row.population);
    if (value == null) continue;
    total += value;
    if (districtKey(row.district) === key) target = value;
  }
  return target != null && total > 0 ? (target / total) * 100 : null;
}
