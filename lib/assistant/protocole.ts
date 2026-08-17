/**
 * Ce que la page de conversation attend du serveur.
 *
 * L'interface est écrite avant la route qui l'alimentera : ce fichier tient
 * lieu de contrat entre les deux. Tant que `/api/assistant` n'existe pas, la
 * page fonctionne et annonce simplement que l'assistant n'est pas branché ;
 * le jour où la route arrive, elle n'a qu'à émettre ces événements-là.
 *
 * Le transport est un flux d'événements ligne à ligne (`data: {json}\n\n`),
 * pas une réponse d'un bloc : une réponse longue met plusieurs secondes à
 * s'écrire, et attendre la fin pour afficher quoi que ce soit donnerait
 * l'impression que rien ne se passe.
 */

/** D'où vient ce qui a été affirmé. Une réponse sans source n'en est pas une. */
export type SourceAssistant = {
  /** Nom lisible : « Espérance de vie à la naissance », « Note de politique 3 ». */
  titre: string;
  /** Où le visiteur peut vérifier lui-même. */
  url?: string;
  nature: "indicateur" | "publication" | "actualite" | "page" | "donnees";
  /** Précision courte : la période, le millésime, la catégorie. */
  detail?: string;
};

/**
 * Les événements du flux.
 *
 * `outil` n'est pas décoratif : quand le modèle va chercher un chiffre dans
 * un CSV ou un passage dans un rapport, l'attente s'allonge, et dire ce qui
 * est en cours vaut mieux qu'un point qui clignote.
 */
export type EvenementAssistant =
  | { type: "texte"; valeur: string }
  | { type: "outil"; libelle: string }
  | { type: "sources"; valeur: SourceAssistant[] }
  | { type: "erreur"; message: string }
  | { type: "fin" };

/** Un tour de parole, tel qu'il est renvoyé au serveur à la question suivante. */
export type MessageAssistant = {
  role: "visiteur" | "assistant";
  texte: string;
  sources?: SourceAssistant[];
};

export const ROUTE_ASSISTANT = "/api/assistant";

/**
 * Lit le flux de la réponse et rend les événements un par un.
 *
 * Le découpage se fait sur la ligne vide qui sépare deux événements, et non
 * sur les morceaux que le réseau livre : un événement peut arriver coupé en
 * deux, ou deux événements dans le même paquet. Le tampon garde le reste.
 */
export async function* lireFluxAssistant(
  corps: ReadableStream<Uint8Array>,
): AsyncGenerator<EvenementAssistant> {
  const lecteur = corps.getReader();
  const decodeur = new TextDecoder();
  let tampon = "";

  while (true) {
    const { done, value } = await lecteur.read();
    if (done) break;
    tampon += decodeur.decode(value, { stream: true });

    let coupure: number;
    while ((coupure = tampon.indexOf("\n\n")) !== -1) {
      const bloc = tampon.slice(0, coupure);
      tampon = tampon.slice(coupure + 2);
      const ligne = bloc
        .split("\n")
        .find((l) => l.startsWith("data:"))
        ?.slice(5)
        .trim();
      if (!ligne) continue;
      try {
        yield JSON.parse(ligne) as EvenementAssistant;
      } catch {
        // Un fragment illisible ne doit pas interrompre la réponse entière.
      }
    }
  }
}
