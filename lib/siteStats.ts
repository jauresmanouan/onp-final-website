import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Chiffres clés de la page d'accueil, lus au rendu depuis les CSV publiés.
 *
 * Ils portent tous sur la population. Le nombre de districts couverts et le
 * nombre de missions y figuraient aussi : ils décrivaient l'outil et
 * l'institution, pas le pays, et n'apprenaient rien à qui ouvre la page.
 *
 * Ils viennent des mêmes fichiers que le tableau de bord plutôt que d'une
 * liste de constantes : une correction de données se répercute d'elle-même
 * sur la vitrine, et l'accueil ne peut pas annoncer un chiffre que la
 * banque de données contredirait.
 */

export type ChiffreCle = {
  valeur: string;
  intitule: string;
  precision: string;
};

/**
 * Le chiffre d'ouverture, traité en très grand : la valeur et son unité sont
 * séparées pour pouvoir les composer à deux tailles différentes.
 */
export type ChiffrePrincipal = {
  valeur: string;
  unite: string;
  precision: string;
};

const DATA_DIR = path.join(process.cwd(), "public", "data", "onp");

async function readCsv(file: string): Promise<Record<string, string>[]> {
  const raw = await readFile(path.join(DATA_DIR, file), "utf8");
  const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const [head, ...lines] = text.trim().split(/\r?\n/);
  const cols = head.split(",").map((c) => c.trim());
  return lines.map((line) => {
    const cells = line.split(",");
    return Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? "").trim()]));
  });
}

const num = (v: string | undefined): number | null => {
  if (!v) return null;
  const n = Number.parseFloat(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

export async function getChiffresCles(): Promise<{
  principal: ChiffrePrincipal | null;
  secondaires: ChiffreCle[];
}> {
  const [population, esperance, fecondite, ages] = await Promise.all([
    readCsv("population_totale_et_croissance.csv"),
    readCsv("sante_esperance_vie_naissance.csv"),
    readCsv("sante_indice_synthetique_fecondite.csv"),
    readCsv("population_indice_structure_age.csv"),
  ]);

  const chiffres: ChiffreCle[] = [];

  const totale = population.find((r) => r.indicateur === "Population totale");
  const habitants = num(totale?.["RGPH_2021"]);
  const principal: ChiffrePrincipal | null =
    habitants != null
      ? {
          valeur: (habitants / 1_000_000).toFixed(1).replace(".", ","),
          unite: "millions",
          precision: "d'habitants recensés en 2021",
        }
      : null;

  // Les deux sexes sont publiés séparément : l'ensemble est leur moyenne
  const hommes = num(esperance.find((r) => r.sexe === "Hommes")?.["2021"]);
  const femmes = num(esperance.find((r) => r.sexe === "Femmes")?.["2021"]);
  if (hommes != null && femmes != null) {
    const moyenne = (hommes + femmes) / 2;
    chiffres.push({
      valeur: `${moyenne.toFixed(1).replace(".", ",")} ans`,
      intitule: "Espérance de vie",
      precision: "À la naissance, ensemble, 2021",
    });
  }

  // Deux mesures qui portent le mandat de l'Office : ce que la population
  // fait — sa fécondité — et ce qu'elle est — sa jeunesse. Ce sont les deux
  // termes du dividende démographique, que le tableau de bord détaille.
  const isf = num(fecondite.find((r) => r.indicateur === "ISF")?.["2021"]);
  if (isf != null) {
    chiffres.push({
      valeur: isf.toFixed(1).replace(".", ","),
      intitule: "Enfants par femme",
      precision: "Indice synthétique de fécondité, 2021",
    });
  }

  // La dernière ligne du fichier est le recensement le plus récent.
  const dernierRecensement = ages[ages.length - 1];
  const jeunes = num(dernierRecensement?.pct_moins_15_ans);
  if (jeunes != null) {
    chiffres.push({
      valeur: `${jeunes.toFixed(1).replace(".", ",")} %`,
      intitule: "Moins de 15 ans",
      precision: `Part de la population, ${dernierRecensement.recensement}`,
    });
  }

  if (habitants != null) {
    const precedent = num(totale?.["RGPH_1998"]);
    if (precedent != null && precedent > 0) {
      const facteur = habitants / precedent;
      chiffres.push({
        valeur: `×${facteur.toFixed(1).replace(".", ",")}`,
        intitule: "Depuis 1998",
        precision: "Population multipliée en vingt-trois ans",
      });
    }
  }

  return { principal, secondaires: chiffres };
}
