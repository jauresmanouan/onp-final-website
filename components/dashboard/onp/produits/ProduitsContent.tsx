"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, Calendar } from "lucide-react";

type Produit = {
  id: string;
  title: string;
  description: string;
  category: "Rapport" | "Annuaire" | "Note" | "Étude";
  format: "PDF" | "Excel" | "ZIP";
  size: string;
  date: string;
  year: string;
  href: string;
};

const PRODUITS: Produit[] = [
  {
    id: "1",
    title: "Rapport principal - RGPH 2021",
    description:
      "Recensement général de la population et de l'habitation 2021. Résultats définitifs et analyse approfondie.",
    category: "Rapport",
    format: "PDF",
    size: "12,4 Mo",
    date: "Décembre 2024",
    year: "2024",
    href: "#",
  },
  {
    id: "2",
    title: "Annuaire statistique démographique 2023",
    description:
      "Compilation annuelle des indicateurs démographiques nationaux et régionaux.",
    category: "Annuaire",
    format: "PDF",
    size: "5,8 Mo",
    date: "Juin 2024",
    year: "2024",
    href: "#",
  },
  {
    id: "3",
    title: "Note d'analyse - Dividende démographique",
    description:
      "Étude prospective sur le potentiel du dividende démographique en Côte d'Ivoire.",
    category: "Note",
    format: "PDF",
    size: "1,2 Mo",
    date: "Mars 2024",
    year: "2024",
    href: "#",
  },
  {
    id: "4",
    title: "Indicateurs de développement par district",
    description:
      "Données détaillées sur les indices DDMI, IQCV, ICDE, IDHE, ISSP, ISRT par district administratif.",
    category: "Étude",
    format: "Excel",
    size: "3,1 Mo",
    date: "Février 2024",
    year: "2024",
    href: "#",
  },
  {
    id: "5",
    title: "Évolution des indicateurs sanitaires 1988–2021",
    description:
      "Espérance de vie, mortalité infantile et maternelle, fécondité - analyse temporelle.",
    category: "Rapport",
    format: "PDF",
    size: "4,7 Mo",
    date: "Novembre 2023",
    year: "2023",
    href: "#",
  },
  {
    id: "6",
    title: "Pyramides des âges 1988 / 1998 / 2021",
    description:
      "Comparaison structurée de la pyramide des âges sur trois recensements.",
    category: "Étude",
    format: "PDF",
    size: "2,3 Mo",
    date: "Septembre 2023",
    year: "2023",
    href: "#",
  },
  {
    id: "7",
    title: "Note méthodologique - RGPH 2021",
    description:
      "Détails de la méthodologie utilisée pour le recensement 2021 et plan de sondage.",
    category: "Note",
    format: "PDF",
    size: "0,9 Mo",
    date: "Mai 2023",
    year: "2023",
    href: "#",
  },
  {
    id: "8",
    title: "Données ouvertes RGPH 2021",
    description:
      "Microdonnées anonymisées du recensement 2021 - usage académique et recherche.",
    category: "Étude",
    format: "ZIP",
    size: "85 Mo",
    date: "Avril 2023",
    year: "2023",
    href: "#",
  },
];

const CATEGORIES = ["Toutes", "Rapport", "Annuaire", "Note", "Étude"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const ANNEES = ["Toutes", "2024", "2023", "2022"] as const;

const CATEGORY_VARIANT: Record<
  Produit["category"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  Rapport: "default",
  Annuaire: "secondary",
  Note: "outline",
  Étude: "outline",
};

export default function ProduitsContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Toutes");
  const [year, setYear] = useState<string>("Toutes");

  const filtered = PRODUITS.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Toutes" || p.category === category;
    const matchesYear = year === "Toutes" || p.year === year;
    return matchesSearch && matchesCategory && matchesYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-20 xl:px-40 py-8">
      {/* Titre de page */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Nos produits
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Documents, rapports et notes diffusés par l&apos;Office National de la
          Population.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as CategoryFilter)}
        >
          <SelectTrigger className="h-9 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-9 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANNEES.map((y) => (
              <SelectItem key={y} value={y} className="text-xs">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des produits */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Aucun produit ne correspond à votre recherche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display font-semibold text-base text-foreground leading-snug">
                        {p.title}
                      </h3>
                      <Badge
                        variant={CATEGORY_VARIANT[p.category]}
                        className="text-[10px] shrink-0"
                      >
                        {p.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {p.date}
                        </span>
                        <span className="font-mono">
                          {p.format} · {p.size}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs gap-1.5"
                        asChild
                      >
                        <a href={p.href}>
                          <Download className="h-3.5 w-3.5" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-6 text-center">
        {filtered.length} document{filtered.length > 1 ? "s" : ""} trouvé
        {filtered.length > 1 ? "s" : ""} sur {PRODUITS.length}
      </p>
    </div>
  );
}
