const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** « 2022-08-03 » devient « 3 août 2022 ». */
export function formatDate(iso: string): string {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
}

/**
 * Date d'un article. Rien n'est affiché sans date : l'ancien site n'en
 * publiait pas pour tous les articles, et une date approximative vaut moins
 * que pas de date du tout sur un site institutionnel.
 */
export default function DateActualite({
  date,
  source,
  className = "",
}: {
  date: string | null;
  source?: string | null;
  className?: string;
}) {
  if (!date && !source) return null;

  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground ${className}`}>
      {date && <time dateTime={date}>{formatDate(date)}</time>}
      {date && source && <span aria-hidden="true">·</span>}
      {source && <span>{source}</span>}
    </p>
  );
}
