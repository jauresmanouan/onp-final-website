import type { CSVRow } from "./useCSV";

/**
 * Parse un nombre formaté à la française :
 * - "29 372 000" → 29372000
 * - "4,4" → 4.4
 * - "58,5%" → 58.5
 * - "61,2 ans" → 61.2
 */
export function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const str = String(value).trim();
  if (!str) return null;
  const cleaned = str
    .replace(/\s+/g, "")
    .replace(/[%‰]/g, "")
    .replace(/[a-zA-Z]/g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * Transforme un CSV "wide" (1ère col = label série, autres cols = axe X) en format Recharts.
 *
 * @example
 * Input rows:  [{ sexe: "Hommes", "1988": "53.6", "1998": "49.2", "2021": "59.2" }, ...]
 * Output:      [{ x: "1988", Hommes: 53.6, Femmes: 57.2, Total: 55.0 }, ...]
 */
export function wideToLong(
  rows: CSVRow[],
  seriesColumn: string,
  xValues?: string[],
): Array<{ x: string; [series: string]: string | number }> {
  if (rows.length === 0) return [];

  const allColumns = Object.keys(rows[0]);
  const valueColumns = xValues ?? allColumns.filter((c) => c !== seriesColumn);

  return valueColumns.map((col) => {
    const point: { x: string; [k: string]: string | number } = { x: col };
    for (const row of rows) {
      const seriesName = row[seriesColumn];
      const num = parseNumber(row[col]);
      if (seriesName && num != null) {
        point[seriesName] = num;
      }
    }
    return point;
  });
}

/**
 * Format compact pour grands nombres :
 * 29372000 → "29.4M"
 * 1245670 → "1.25M"
 * 422000 → "422K"
 */
export function formatCompactNumber(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(fractionDigits) + "Md";
  if (abs >= 1_000_000)
    return (value / 1_000_000).toFixed(fractionDigits) + "M";
  if (abs >= 1_000) return (value / 1_000).toFixed(0) + "K";
  return value.toFixed(0);
}

/**
 * Format un nombre en notation française : 29372000 → "29 372 000"
 */
export function formatFrench(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return Math.round(value).toLocaleString("fr-FR");
}
