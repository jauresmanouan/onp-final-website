type Props = {
  className?: string;
  /** Hauteur en px ou string CSS */
  height?: number | string;
};

/**
 * Skeleton générique : un rectangle qui pulse doucement.
 * Utilisé pour signaler le chargement d'un graphique, KPI ou bloc.
 */
export default function Skeleton({ className = "", height }: Props) {
  return (
    <div
      className={`bg-muted/40 rounded animate-pulse ${className}`}
      style={height ? { height } : undefined}
      aria-hidden="true"
    />
  );
}
