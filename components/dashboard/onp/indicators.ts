/**
 * Catalogue des indicateurs ONP.
 * Chaque entrée alimente le panneau d'information (à droite du dashboard) :
 * définition, méthode de calcul, unité, source et période.
 */

/** Onglets du dashboard ONP (cf. ONPDashboard). */
export type DashboardTab =
  | "vue-ensemble"
  | "districts"
  | "population"
  | "sante"
  | "dividende-demo";

export type IndicatorInfo = {
  id: string;
  label: string;
  definition: string;
  formula?: string;
  unit?: string;
  source?: string;
  period?: string;
  /** Onglet du dashboard où l'indicateur est présenté (pour la recherche/navigation). */
  tab?: DashboardTab;
};

export const ONP_INDICATORS: Record<string, IndicatorInfo> = {
  "population-totale": {
    id: "population-totale",
    label: "Population totale",
    definition:
      "Effectif total de la population résidente en Côte d'Ivoire à une date de référence donnée, issu des recensements généraux de la population et de l'habitation (RGPH).",
    formula:
      "Somme des personnes recensées sur l'ensemble du territoire à la date du recensement.",
    unit: "habitants",
    source: "ONP - RGPH 1975, 1988, 1998, 2014, 2021",
    period: "1975 – 2021",
  },
  "esperance-vie": {
    id: "esperance-vie",
    label: "Espérance de vie à la naissance",
    definition:
      "Nombre moyen d'années qu'un nouveau-né peut espérer vivre s'il est exposé tout au long de sa vie aux conditions de mortalité observées l'année considérée.",
    formula:
      "e₀ = Σ Lₓ / l₀, à partir de la table de mortalité du moment (Lₓ : années vécues entre x et x+n).",
    unit: "années",
    source: "ONP - RGPH et tables de mortalité",
    period: "1988 – 2021",
  },
  "mortalite-infantile": {
    id: "mortalite-infantile",
    label: "Mortalité infantile (1q0)",
    definition:
      "Probabilité, pour un enfant né vivant, de décéder avant son premier anniversaire.",
    formula:
      "1q0 = (Décès d'enfants de moins d'un an / Naissances vivantes de l'année) × 1 000",
    unit: "‰ (pour 1 000 naissances vivantes)",
    source: "EDS, MICS, ONP",
    period: "1994 – 2021",
  },
  "mortalite-maternelle": {
    id: "mortalite-maternelle",
    label: "Mortalité maternelle",
    definition:
      "Nombre de décès maternels (pendant la grossesse, l'accouchement ou dans les 42 jours suivants) rapporté aux naissances vivantes.",
    formula: "Ratio = (Décès maternels / Naissances vivantes) × 100 000",
    unit: "pour 100 000 naissances vivantes",
    source: "EDS, ONP",
    period: "1994 – 2021",
  },
  "mortalite-brute": {
    id: "mortalite-brute",
    label: "Taux brut de mortalité",
    definition:
      "Nombre total de décès enregistrés au cours d'une année rapporté à la population moyenne de la même année.",
    formula: "TBM = (Décès de l'année / Population moyenne) × 1 000",
    unit: "‰",
    source: "ONP - État civil et estimations RGPH",
    period: "1988 – 2021",
  },
  isf: {
    id: "isf",
    label: "Indice synthétique de fécondité (ISF)",
    definition:
      "Nombre moyen d'enfants qu'aurait une femme tout au long de sa vie féconde si elle connaissait, à chaque âge, les taux de fécondité observés l'année considérée.",
    formula:
      "ISF = Σ taux de fécondité par âge (15–49 ans), exprimé par femme.",
    unit: "enfants par femme",
    source: "EDS, RGPH, ONP",
    period: "1994 – 2021",
  },
  "ratio-espc": {
    id: "ratio-espc",
    label: "Ratio ESPC – population",
    definition:
      "Nombre d'établissements sanitaires de premier contact (ESPC) rapporté à la population, indicateur d'accessibilité de l'offre de soins de proximité.",
    formula: "Ratio = (Nombre d'ESPC / Population) × 10 000",
    unit: "ESPC pour 10 000 habitants",
    source: "Ministère de la Santé, ONP",
    period: "2010 – 2021",
  },
  "utilisation-services-sante": {
    id: "utilisation-services-sante",
    label: "Utilisation des services de santé",
    definition:
      "Part de la population ayant recours aux services de santé formels au cours d'une période de référence donnée.",
    formula:
      "Utilisation = (Personnes ayant consulté / Population totale) × 100",
    unit: "%",
    source: "EDS, MICS, Ministère de la Santé",
    period: "2010 – 2021",
  },
  ddmi: {
    id: "ddmi",
    label: "DDMI - Indice multi-dimensionnel du dividende démographique",
    definition:
      "Indice composite mesurant la position d'un territoire vis-à-vis de la capture du dividende démographique, à partir de quatre sous-indices (IDHE, ICDE, ISSP, IQCV).",
    formula:
      "DDMI = moyenne pondérée des sous-indices IDHE, ICDE, ISSP et IQCV, normalisés entre 0 et 1.",
    unit: "indice de 0 à 1",
    source: "ONP - Profil du dividende démographique",
    period: "2015 – 2020",
  },
  idhe: {
    id: "idhe",
    label: "IDHE - Indice de développement humain élargi",
    definition:
      "Extension de l'IDH classique intégrant des dimensions complémentaires liées au capital humain, à la santé et à l'éducation, dans une perspective de dividende démographique.",
    unit: "indice de 0 à 1",
    source: "ONP",
    period: "2015 – 2020",
  },
  icde: {
    id: "icde",
    label: "ICDE - Indice du cadre démo-économique",
    definition:
      "Mesure les conditions économiques et démographiques propices à la transformation du dividende démographique en croissance soutenue.",
    unit: "indice de 0 à 1",
    source: "ONP",
    period: "2015 – 2020",
  },
  issp: {
    id: "issp",
    label: "ISSP - Indice de stabilité sociale et politique",
    definition:
      "Mesure la stabilité sociale et politique d'un territoire, condition nécessaire à la valorisation effective du dividende démographique.",
    unit: "indice de 0 à 1",
    source: "ONP",
    period: "2015 – 2020",
  },
  iqcv: {
    id: "iqcv",
    label: "IQCV - Indice de qualité du cadre de vie",
    definition:
      "Évalue les conditions environnementales, urbaines et sociales qui structurent le cadre de vie des populations.",
    unit: "indice de 0 à 1",
    source: "ONP",
    period: "2015 – 2020",
  },
  isrt: {
    id: "isrt",
    label: "ISRT - Indice synthétique de résultats territoriaux",
    definition:
      "Indice agrégé des résultats territoriaux relatifs au dividende démographique, croisant développement humain, économie et stabilité.",
    unit: "indice de 0 à 1",
    source: "ONP",
    period: "2015 – 2020",
  },

  // ── Population - détails par sexe et structures ──
  "population-hommes": {
    id: "population-hommes",
    label: "Population - Hommes",
    definition:
      "Effectif total de la population masculine résidente en Côte d'Ivoire à une date de référence donnée.",
    formula:
      "Somme des hommes recensés sur l'ensemble du territoire à la date du recensement.",
    unit: "habitants",
    source: "ONP - RGP 1975, RGPH 1988, 1998, 2021",
    period: "1975 – 2021",
  },
  "population-femmes": {
    id: "population-femmes",
    label: "Population - Femmes",
    definition:
      "Effectif total de la population féminine résidente en Côte d'Ivoire à une date de référence donnée.",
    formula:
      "Somme des femmes recensées sur l'ensemble du territoire à la date du recensement.",
    unit: "habitants",
    source: "ONP - RGP 1975, RGPH 1988, 1998, 2021",
    period: "1975 – 2021",
  },
  "pyramide-ages": {
    id: "pyramide-ages",
    label: "Pyramide des âges",
    definition:
      "Représentation graphique de la structure par sexe et âge de la population. Chaque barre indique la part (%) de la tranche d'âge dans la population totale, à gauche pour les hommes, à droite pour les femmes.",
    formula:
      "Part = (Effectif de la tranche d'âge × sexe / Population totale) × 100",
    unit: "%",
    source: "ONP - RGPH",
    period: "1988 / 1998 / 2021",
  },
  "structure-age": {
    id: "structure-age",
    label: "Structure par grandes tranches d'âge",
    definition:
      "Répartition de la population entre trois grandes tranches d'âge (moins de 15 ans, 15–64 ans, 65 ans et plus), reflet de la transition démographique.",
    formula:
      "Part de chaque tranche = (Effectif de la tranche / Population totale) × 100",
    unit: "%",
    source: "ONP - RGP/RGPH 1975 → 2021",
    period: "1975 – 2021",
  },
  urbanisation: {
    id: "urbanisation",
    label: "Urbanisation",
    definition:
      "Répartition de la population entre milieux urbain et rural, mesure du rythme d'urbanisation du pays.",
    formula:
      "Taux d'urbanisation = (Population urbaine / Population totale) × 100",
    unit: "%",
    source: "ONP",
    period: "2010 – 2024",
  },

  // ── Santé - espérance de vie et mortalité par sexe ──
  "esperance-hommes": {
    id: "esperance-hommes",
    label: "Espérance de vie - Hommes",
    definition:
      "Nombre moyen d'années qu'un homme nouveau-né peut espérer vivre s'il est exposé tout au long de sa vie aux conditions de mortalité masculines observées.",
    formula:
      "e₀(H) = Σ Lₓ(H) / l₀(H), à partir de la table de mortalité masculine.",
    unit: "années",
    source: "ONP - RGPH et tables de mortalité",
    period: "1988 – 2021",
  },
  "esperance-femmes": {
    id: "esperance-femmes",
    label: "Espérance de vie - Femmes",
    definition:
      "Nombre moyen d'années qu'une femme nouveau-née peut espérer vivre si elle est exposée tout au long de sa vie aux conditions de mortalité féminines observées.",
    formula:
      "e₀(F) = Σ Lₓ(F) / l₀(F), à partir de la table de mortalité féminine.",
    unit: "années",
    source: "ONP - RGPH et tables de mortalité",
    period: "1988 – 2021",
  },
  "mortinf-hommes": {
    id: "mortinf-hommes",
    label: "Mortalité infantile - Hommes",
    definition:
      "Probabilité, pour un garçon né vivant, de décéder avant son premier anniversaire.",
    formula:
      "1q0(H) = (Décès de garçons de moins d'un an / Naissances vivantes masculines) × 1 000",
    unit: "‰",
    source: "EDS, MICS, ONP",
    period: "1994 – 2021",
  },
  "mortinf-femmes": {
    id: "mortinf-femmes",
    label: "Mortalité infantile - Femmes",
    definition:
      "Probabilité, pour une fille née vivante, de décéder avant son premier anniversaire.",
    formula:
      "1q0(F) = (Décès de filles de moins d'un an / Naissances vivantes féminines) × 1 000",
    unit: "‰",
    source: "EDS, MICS, ONP",
    period: "1994 – 2021",
  },
  "mortbrute-homme": {
    id: "mortbrute-homme",
    label: "Taux brut de mortalité - Hommes",
    definition:
      "Nombre total de décès masculins enregistrés au cours d'une année rapporté à la population masculine moyenne.",
    formula:
      "TBM(H) = (Décès masculins de l'année / Population masculine moyenne) × 1 000",
    unit: "‰",
    source: "ONP - État civil et estimations RGPH",
    period: "1988 – 2021",
  },
  "mortbrute-femme": {
    id: "mortbrute-femme",
    label: "Taux brut de mortalité - Femmes",
    definition:
      "Nombre total de décès féminins enregistrés au cours d'une année rapporté à la population féminine moyenne.",
    formula:
      "TBM(F) = (Décès féminins de l'année / Population féminine moyenne) × 1 000",
    unit: "‰",
    source: "ONP - État civil et estimations RGPH",
    period: "1988 – 2021",
  },

  // ── Services de santé ──
  "ratio-hopitaux": {
    id: "ratio-hopitaux",
    label: "Ratio Hôpitaux de référence – population",
    definition:
      "Nombre d'hôpitaux de référence (établissements sanitaires de second et troisième niveau) rapporté à la population, indicateur d'accessibilité de l'offre de soins spécialisés.",
    formula: "Ratio = (Nombre d'hôpitaux de référence / Population) × 100 000",
    unit: "hôpitaux pour 100 000 habitants",
    source: "Ministère de la Santé, ONP",
    period: "2010 – 2021",
  },

  // ── Évolution variation DDMI ──
  "evolution-ddmi": {
    id: "evolution-ddmi",
    label: "Évolution du DDMI national 2015 → 2020",
    definition:
      "Variation relative du DDMI national entre 2015 et 2020, reflétant la progression du pays dans la capture du dividende démographique.",
    formula: "Variation = ((DDMI 2020 − DDMI 2015) / DDMI 2015) × 100",
    unit: "%",
    source: "ONP - Profil du dividende démographique",
    period: "2015 – 2020",
  },

  // ── Indicateurs nationaux synthétiques DD (5 piliers) ──
  "indicateurs-nationaux-synthetiques": {
    id: "indicateurs-nationaux-synthetiques",
    label: "Indicateurs nationaux synthétiques (5 piliers)",
    definition:
      "Comparaison des cinq piliers du dividende démographique au niveau national entre deux périodes (2015–2017 et 2018–2020) : capital humain, cadre démo-économique, qualité du cadre de vie, stabilité sociale et politique, résultats territoriaux.",
    unit: "indice de 0 à 1",
    source: "ONP - indicateurs_national_diag.csv",
    period: "2015 – 2020",
  },
  "classement-districts": {
    id: "classement-districts",
    label: "Classement des districts",
    definition:
      "Classement des districts ivoiriens selon la valeur d'un indice du dividende démographique en 2020. Permet de visualiser les écarts territoriaux et de positionner chaque district par rapport à la moyenne nationale.",
    unit: "indice de 0 à 1",
    source: "ONP - Profil du dividende démographique",
    period: "2020",
  },

  // ── Districts ──
  "population-districts": {
    id: "population-districts",
    label: "Population par district",
    definition:
      "Effectif de population résidente par district administratif, issu du dernier recensement général (RGPH 2021).",
    unit: "habitants",
    source: "ONP - RGPH 2021",
    period: "2021",
  },
  "indicateurs-districts": {
    id: "indicateurs-districts",
    label: "Indicateurs synthétiques par district",
    definition:
      "Tableau récapitulatif des principaux indices de développement durable par district : dépendance économique, qualité du cadre de vie, transition de la pauvreté, capital humain, réseaux et territoires, dividende démographique.",
    unit: "indice de 0 à 1",
    source: "ONP - districts_snapshot_2021",
    period: "2021",
  },
};

export function getIndicator(
  id: string | undefined,
): IndicatorInfo | undefined {
  if (!id) return undefined;
  return ONP_INDICATORS[id];
}

/**
 * Onglet du dashboard où chaque indicateur est présenté.
 * Sert à la barre de recherche pour router vers le bon onglet avant d'ouvrir
 * la fiche de l'indicateur. Les indicateurs non listés tombent sur "vue-ensemble".
 */
const INDICATOR_TAB: Record<string, DashboardTab> = {
  // Vue d'ensemble (KPIs nationaux synthétiques)
  "population-totale": "population",
  "esperance-vie": "sante",
  "mortalite-infantile": "sante",
  "mortalite-maternelle": "sante",
  "mortalite-brute": "sante",
  isf: "sante",
  "ratio-espc": "sante",
  "utilisation-services-sante": "sante",
  "ratio-hopitaux": "sante",
  // Population
  "population-hommes": "population",
  "population-femmes": "population",
  "pyramide-ages": "population",
  "structure-age": "population",
  urbanisation: "population",
  // Santé (par sexe)
  "esperance-hommes": "sante",
  "esperance-femmes": "sante",
  "mortinf-hommes": "sante",
  "mortinf-femmes": "sante",
  "mortbrute-homme": "sante",
  "mortbrute-femme": "sante",
  // Dividende démographique
  ddmi: "dividende-demo",
  idhe: "dividende-demo",
  icde: "dividende-demo",
  issp: "dividende-demo",
  iqcv: "dividende-demo",
  isrt: "dividende-demo",
  "evolution-ddmi": "dividende-demo",
  "indicateurs-nationaux-synthetiques": "dividende-demo",
  "classement-districts": "dividende-demo",
  // Districts
  "population-districts": "districts",
  "indicateurs-districts": "districts",
};

/** Onglet du dashboard associé à un indicateur (défaut : vue-ensemble). */
export function getIndicatorTab(id: string): DashboardTab {
  return INDICATOR_TAB[id] ?? "vue-ensemble";
}

/** Retire les accents et met en minuscules pour une recherche tolérante. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Recherche dans le catalogue d'indicateurs par libellé, identifiant et
 * définition. Retourne les fiches triées (libellé d'abord, puis définition).
 */
export function searchIndicators(query: string, limit = 8): IndicatorInfo[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const all = Object.values(ONP_INDICATORS);
  const scored = all
    .map((ind) => {
      const label = normalize(ind.label);
      const id = normalize(ind.id);
      const def = normalize(ind.definition);
      let score = 0;
      if (label.startsWith(q) || id.startsWith(q)) score = 3;
      else if (label.includes(q) || id.includes(q)) score = 2;
      else if (def.includes(q)) score = 1;
      return { ind, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.ind);
}
