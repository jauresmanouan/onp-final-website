"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

export type CSVRow = Record<string, string>;

type UseCSVResult<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
};

// ── Cache module-level ────────────────────────────────────────────
// Évite de re-télécharger un même CSV à chaque montage de composant.
// Même fichier CSV = même promesse partagée jusqu'au reload de la page.
const dataCache = new Map<string, unknown[]>();
const inflightCache = new Map<string, Promise<unknown[]>>();

async function fetchAndParse<T>(file: string): Promise<T[]> {
  const res = await fetch(file);
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${file}`);
  const text = await res.text();
  const cleaned = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  return new Promise<T[]>((resolve, reject) => {
    Papa.parse<T>(cleaned, {
      header: true,
      skipEmptyLines: true,
      delimitersToGuess: [",", ";", "\t"],
      complete: (result) => {
        const rows = (result.data as T[]).filter((row) =>
          Object.values(row as object).some((v) => v !== "" && v != null),
        );
        resolve(rows);
      },
      error: (err: Error) => reject(err),
    });
  });
}

/**
 * Hook qui charge un CSV depuis le dossier /public et le parse.
 * Utilise un cache module-level : un même fichier n'est téléchargé qu'une fois.
 *
 * @example
 * const { data } = useCSV<{ year: string; value: string }>("/data/onp/charts/population_evolution.csv");
 */
export function useCSV<T = CSVRow>(file: string): UseCSVResult<T> {
  // État initial synchrone si le cache est déjà rempli - évite tout flash de loading
  const cached = dataCache.get(file) as T[] | undefined;
  const [data, setData] = useState<T[]>(cached ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(!cached);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Si déjà en cache, rien à faire
    const cachedData = dataCache.get(file) as T[] | undefined;
    if (cachedData) {
      setData(cachedData);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Réutiliser une requête déjà en vol pour le même fichier
    let promise = inflightCache.get(file) as Promise<T[]> | undefined;
    if (!promise) {
      promise = fetchAndParse<T>(file);
      inflightCache.set(file, promise as Promise<unknown[]>);
    }

    promise
      .then((rows) => {
        dataCache.set(file, rows as unknown[]);
        inflightCache.delete(file);
        if (cancelled) return;
        setData(rows);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        inflightCache.delete(file);
        if (cancelled) return;
        setError(err);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return { data, isLoading, error };
}
