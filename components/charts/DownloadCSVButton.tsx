"use client";

import { Download } from "lucide-react";

type Props = {
  /** Chemin vers le fichier CSV servi par /public (ex: /data/onp/sante_*.csv) */
  csvFile: string;
  /** Nom proposé au téléchargement (par défaut : nom du fichier) */
  filename?: string;
  /** Si true : texte "CSV" seul, sinon "Télécharger" */
  compact?: boolean;
};

export default function DownloadCSVButton({
  csvFile,
  filename,
  compact = true,
}: Props) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = csvFile;
    link.download = filename ?? csvFile.split("/").pop() ?? "data.csv";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Télécharger les données au format CSV"
      className="inline-flex items-center gap-1.5 h-7 px-2 text-xs font-medium text-tile-foreground border border-tile-border rounded-md cursor-pointer transition-colors hover:border-tile-foreground/50 hover:bg-tile-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <Download className="h-3.5 w-3.5" />
      {compact ? "CSV" : "Télécharger"}
    </button>
  );
}
