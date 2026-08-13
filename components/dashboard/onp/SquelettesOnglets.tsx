import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Squelettes de chargement des onglets du tableau de bord.
 *
 * Chaque squelette reprend la structure — et surtout la hauteur — du contenu
 * qu'il remplace : un gabarit plus court que le vrai contenu ferait sauter la
 * page au moment du remplacement, ce qui se lit comme un flash. Les hauteurs
 * ci-dessous sont donc celles passées aux graphiques correspondants.
 */

const CARTE =
  "bg-tile text-tile-foreground border border-tile-border shadow-md ring-1 ring-black/[0.02] dark:ring-white/[0.03]";

function Bloc({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-muted/50 ${className}`} aria-hidden="true" />;
}

/** Gabarit d'un ChartCard : même chrome (titre, sous-titre, actions, source). */
function SqueletteCarte({
  hauteur,
  largeurActions,
  avecSource = true,
}: {
  hauteur: number;
  /** Largeur du bloc d'actions (sélecteur, téléchargement) s'il y en a un. */
  largeurActions?: string;
  avecSource?: boolean;
}) {
  return (
    <Card className={`${CARTE} animate-pulse`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <Bloc className="h-5 w-56 max-w-[60%]" />
          {largeurActions && <Bloc className={`h-8 shrink-0 ${largeurActions}`} />}
        </div>
        <Bloc className="mt-1.5 h-3 w-80 max-w-full" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full rounded-xl bg-muted/40" style={{ height: hauteur }} />
        {avecSource && <Bloc className="mt-3 ml-auto h-3 w-44" />}
      </CardContent>
    </Card>
  );
}

/** Bande de KPI : même gabarit que KPICarousel + KPICard. */
function SqueletteKPIs({ nombre }: { nombre: number }) {
  return (
    <div className="relative animate-pulse">
      <div className="flex gap-4 overflow-hidden pb-1">
        {Array.from({ length: nombre }, (_, i) => (
          <div key={i} className="min-w-0" style={{ flex: "1 0 240px" }}>
            <Card className={CARTE}>
              <CardContent>
                <Bloc className="mb-2 h-4 w-28" />
                <Bloc className="h-9 w-32" />
                <Bloc className="mt-1 h-3 w-24" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tableau des indicateurs par district : 14 lignes + en-tête. */
function SqueletteTableau({ lignes }: { lignes: number }) {
  return (
    <Card className={`${CARTE} animate-pulse`}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <Bloc className="h-5 w-72 max-w-[60%]" />
          <Bloc className="h-8 w-8 shrink-0" />
        </div>
        <div className="h-[37px] border-b border-border bg-muted/30" />
        {Array.from({ length: lignes }, (_, i) => (
          <div
            key={i}
            className="flex h-[41px] items-center gap-4 border-b border-border/60 px-4"
          >
            <Bloc className="h-3 w-40" />
            <Bloc className="ml-auto h-3 w-16" />
            <Bloc className="h-3 w-10" />
            <Bloc className="h-3 w-10" />
            <Bloc className="h-3 w-10" />
            <Bloc className="h-3 w-10" />
            <Bloc className="h-3 w-10" />
            <Bloc className="h-3 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Districts : carte choroplèthe, barres classées, tableau de synthèse. */
export function SqueletteDistricts() {
  return (
    <>
      {/* Choroplèthe : barre de sélecteurs (36) + carte (460) + panneau */}
      <SqueletteCarte hauteur={560} largeurActions="w-8" />
      <SqueletteCarte hauteur={360} largeurActions="w-[280px]" />
      <SqueletteTableau lignes={14} />
    </>
  );
}

/** Population : 3 KPI, pyramide (520), évolution (300), 2 barres (320). */
export function SquelettePopulation() {
  return (
    <>
      <SqueletteKPIs nombre={3} />
      <SqueletteCarte hauteur={520} largeurActions="w-[190px]" />
      <SqueletteCarte hauteur={300} largeurActions="w-[240px]" />
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <SqueletteCarte hauteur={320} largeurActions="w-8" />
        <SqueletteCarte hauteur={320} largeurActions="w-8" />
      </div>
    </>
  );
}

/** Santé : 4 KPI puis quatre sélecteurs d'indicateurs (320/300/280/300). */
export function SqueletteSante() {
  return (
    <>
      <SqueletteKPIs nombre={4} />
      <SqueletteCarte hauteur={320} largeurActions="w-[240px]" />
      <SqueletteCarte hauteur={300} largeurActions="w-[240px]" />
      <SqueletteCarte hauteur={280} largeurActions="w-[240px]" />
      <SqueletteCarte hauteur={300} largeurActions="w-[240px]" />
    </>
  );
}

/** Dividende démographique : 4 KPI, barres (340), évolution (300), rang (420). */
export function SqueletteDividende() {
  return (
    <>
      <SqueletteKPIs nombre={4} />
      <SqueletteCarte hauteur={340} largeurActions="w-8" />
      <SqueletteCarte hauteur={300} largeurActions="w-[240px]" />
      <SqueletteCarte hauteur={420} largeurActions="w-[300px]" />
    </>
  );
}
