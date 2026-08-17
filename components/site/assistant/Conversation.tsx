"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, Square } from "lucide-react";
import NouvelleFenetre from "@/components/site/NouvelleFenetre";
import {
  lireFluxAssistant,
  ROUTE_ASSISTANT,
  type MessageAssistant,
  type SourceAssistant,
} from "@/lib/assistant/protocole";

/**
 * Questions d'entrée.
 *
 * Elles ne sont pas là pour meubler : une page de conversation vide ne dit
 * rien de ce qu'elle sait faire, et le visiteur qui ne sait pas quoi demander
 * repart. Les quatre couvrent les quatre natures de réponse — un chiffre, une
 * définition, un classement, un document — ce qui vaut démonstration.
 */
const SUGGESTIONS = [
  "Quelle est l'espérance de vie à la naissance en Côte d'Ivoire ?",
  "Que mesure l'indice DDMI ?",
  "Quels districts ont le meilleur capital humain ?",
  "Où trouver les notes sur le dividende démographique ?",
];

export default function Conversation() {
  const [messages, setMessages] = useState<MessageAssistant[]>([]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [etape, setEtape] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const champRef = useRef<HTMLTextAreaElement>(null);
  const filRef = useRef<HTMLDivElement>(null);
  const abandonRef = useRef<AbortController | null>(null);

  // Le fil reste collé au bas pendant que la réponse s'écrit, comme dans une
  // messagerie : sans cela, le texte pousse la page vers le bas et le lecteur
  // court après sa propre réponse.
  useEffect(() => {
    filRef.current?.scrollTo({
      top: filRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, etape]);

  // Le champ retrouve le curseur dès que la réponse est finie : la question
  // suivante s'écrit sans reprendre la souris.
  useEffect(() => {
    if (!enCours) champRef.current?.focus();
  }, [enCours]);

  async function demander(question: string) {
    const texte = question.trim();
    if (!texte || enCours) return;

    const historique: MessageAssistant[] = [
      ...messages,
      { role: "visiteur", texte },
    ];
    setMessages([...historique, { role: "assistant", texte: "" }]);
    setSaisie("");
    setErreur(null);
    setEnCours(true);
    setEtape("Recherche dans les données de l'Office");

    const abandon = new AbortController();
    abandonRef.current = abandon;

    try {
      const reponse = await fetch(ROUTE_ASSISTANT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historique }),
        signal: abandon.signal,
      });

      if (reponse.status === 404 || reponse.status === 501) {
        throw new Error(
          "L'assistant n'est pas encore branché sur les données de l'Office. La rubrique Nos chiffres et les publications restent consultables en attendant.",
        );
      }
      if (!reponse.ok || !reponse.body) {
        throw new Error(
          "La réponse n'a pas pu être obtenue. Réessayez dans un instant.",
        );
      }

      for await (const ev of lireFluxAssistant(reponse.body)) {
        if (ev.type === "texte") {
          setEtape(null);
          majDerniere((m) => ({ ...m, texte: m.texte + ev.valeur }));
        } else if (ev.type === "outil") {
          setEtape(ev.libelle);
        } else if (ev.type === "sources") {
          majDerniere((m) => ({ ...m, sources: ev.valeur }));
        } else if (ev.type === "erreur") {
          throw new Error(ev.message);
        } else if (ev.type === "fin") {
          break;
        }
      }
    } catch (e) {
      // Une interruption volontaire n'est pas un incident : la réponse
      // partielle reste à l'écran, sans message d'erreur par-dessus.
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setErreur(
          e instanceof Error ? e.message : "Une erreur inattendue est survenue.",
        );
        // Une bulle vide au bas du fil ne dit rien ; l'erreur, si.
        setMessages((liste) =>
          liste.at(-1)?.texte === "" ? liste.slice(0, -1) : liste,
        );
      }
    } finally {
      setEnCours(false);
      setEtape(null);
      abandonRef.current = null;
    }
  }

  function majDerniere(
    transformer: (m: MessageAssistant) => MessageAssistant,
  ) {
    setMessages((liste) => {
      const derniere = liste.at(-1);
      if (!derniere || derniere.role !== "assistant") return liste;
      return [...liste.slice(0, -1), transformer(derniere)];
    });
  }

  function recommencer() {
    abandonRef.current?.abort();
    setMessages([]);
    setErreur(null);
    setSaisie("");
  }

  const vide = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Le fil défile pour lui-même, le champ de saisie ne bouge jamais :
        * c'est ce qui distingue une conversation d'une page longue. Tant
        * qu'aucune question n'est posée, l'accueil se tient au milieu de la
        * hauteur disponible plutôt que collé en haut d'un grand vide. */}
      <div
        ref={filRef}
        className={`min-h-0 flex-1 overflow-y-auto scroll-smooth ${
          vide ? "flex items-center" : ""
        }`}
        aria-live="polite"
        aria-atomic="false"
      >
        {vide ? (
          <Accueil onChoisir={demander} />
        ) : (
          <div className="space-y-8 pb-4">
            {messages.map((m, i) =>
              m.role === "visiteur" ? (
                <Question key={i} texte={m.texte} />
              ) : (
                <Reponse key={i} message={m} />
              ),
            )}
            {etape && <Etape libelle={etape} />}
          </div>
        )}

        {erreur && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[15px] leading-relaxed text-foreground"
          >
            {erreur}
          </p>
        )}
      </div>

      <Champ
        ref={champRef}
        valeur={saisie}
        onChange={setSaisie}
        onEnvoyer={() => demander(saisie)}
        onArreter={() => abandonRef.current?.abort()}
        onRecommencer={vide ? undefined : recommencer}
        enCours={enCours}
      />
    </div>
  );
}

/** Ce que l'assistant sait, et les quatre portes d'entrée. */
function Accueil({ onChoisir }: { onChoisir: (q: string) => void }) {
  return (
    <div className="w-full py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Interroger les données de l&apos;Office
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Posez votre question en français. Les réponses sont construites à partir
        des indicateurs publiés par l&apos;Office, de ses rapports et de ses
        notes de politique, chaque chiffre avancé est accompagné de sa source.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onChoisir(s)}
              className="w-full rounded-xl border border-chat-border bg-chat-surface p-4 text-left text-sm leading-snug transition-colors hover:border-primary/40 hover:bg-chat-bulle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer sm:text-[15px]"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * La question du visiteur.
 *
 * Alignée à droite et resserrée : elle se distingue de la réponse sans qu'il
 * faille deux couleurs de bulles, et le regard retrouve d'un coup d'œil où
 * commence chaque échange.
 */
function Question({ texte }: { texte: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-chat-bulle px-4 py-2.5 text-[15px] leading-relaxed">
        {texte}
      </p>
    </div>
  );
}

/**
 * La réponse.
 *
 * Pas de bulle : c'est un texte de l'Office, il se lit comme le reste du site,
 * en pleine largeur de colonne. Le filet vertical suffit à le rattacher à la
 * question qui précède.
 */
function Reponse({ message }: { message: MessageAssistant }) {
  const paragraphes = message.texte.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="border-l-2 border-primary/25 pl-4 sm:pl-5">
      <div className="space-y-4 text-[15px] leading-relaxed">
        {paragraphes.map((p, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {p}
          </p>
        ))}
        {/* Le curseur d'écriture, tant que le premier mot n'est pas arrivé. */}
        {message.texte === "" && (
          <span className="inline-block h-4 w-2 animate-pulse rounded-sm bg-primary/40 align-middle" />
        )}
      </div>

      {message.sources && message.sources.length > 0 && (
        <Sources liste={message.sources} />
      )}
    </div>
  );
}

/** Les références, sous la réponse, dans l'ordre où elles ont servi. */
function Sources({ liste }: { liste: SourceAssistant[] }) {
  return (
    <div className="mt-5 border-t border-chat-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Sources
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {liste.map((s, i) => {
          const contenu = (
            <>
              <span className="font-medium">{s.titre}</span>
              {s.detail && (
                <span className="text-muted-foreground"> · {s.detail}</span>
              )}
            </>
          );
          return (
            <li key={`${s.titre}-${i}`}>
              {s.url ? (
                <a
                  href={s.url}
                  target={s.url.endsWith(".pdf") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-chat-border bg-chat-surface px-3 py-1.5 text-[13px] transition-colors hover:border-primary/40 hover:bg-chat-bulle"
                >
                  {contenu}
                  {s.url.endsWith(".pdf") && <NouvelleFenetre />}
                </a>
              ) : (
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-chat-border bg-chat-bulle/60 px-3 py-1.5 text-[13px]">
                  {contenu}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Ce que l'assistant est en train de faire.
 *
 * Aller chercher une valeur dans un fichier prend quelques secondes ; nommer
 * l'opération vaut mieux qu'une animation qui tourne sans rien dire, et cela
 * montre au passage que la réponse n'est pas inventée.
 */
function Etape({ libelle }: { libelle: string }) {
  return (
    <p className="flex items-center gap-2.5 pl-4 text-[13px] text-muted-foreground sm:pl-5">
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-pulse rounded-full bg-primary/50"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      {libelle}…
    </p>
  );
}

/**
 * Le champ de saisie.
 *
 * Il grandit avec le texte jusqu'à une limite, puis défile : une question de
 * dix lignes ne doit pas chasser la conversation de l'écran. Entrée envoie,
 * Maj+Entrée passe à la ligne — la convention de toutes les messageries, et
 * la seule que le visiteur essaiera sans y penser.
 */
function Champ({
  ref,
  valeur,
  onChange,
  onEnvoyer,
  onArreter,
  onRecommencer,
  enCours,
}: {
  ref: React.RefObject<HTMLTextAreaElement | null>;
  valeur: string;
  onChange: (v: string) => void;
  onEnvoyer: () => void;
  onArreter: () => void;
  onRecommencer?: () => void;
  enCours: boolean;
}) {
  useEffect(() => {
    const champ = ref.current;
    if (!champ) return;
    champ.style.height = "auto";
    champ.style.height = `${Math.min(champ.scrollHeight, 200)}px`;
  }, [valeur, ref]);

  return (
    <div className="shrink-0 bg-chat pt-3 sm:pt-4">
      <div className="rounded-3xl border border-chat-border bg-chat-surface p-1.5 shadow-sm transition-colors focus-within:border-primary/40 sm:p-2">
        <div className="flex items-end gap-2">
          <label htmlFor="question" className="sr-only">
            Votre question
          </label>
          <textarea
            id="question"
            ref={ref}
            rows={1}
            value={valeur}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onEnvoyer();
              }
            }}
            placeholder="Posez une question…"
            // 16 px au minimum sur téléphone : en dessous, iOS zoome sur le
            // champ dès la première frappe et ne revient jamais en arrière.
            className="max-h-[200px] min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-base leading-relaxed outline-none placeholder:text-muted-foreground sm:text-[15px]"
          />

          {enCours ? (
            <button
              type="button"
              onClick={onArreter}
              aria-label="Interrompre la réponse"
              className="mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-chat-bulle text-foreground transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer sm:size-10"
            >
              <Square className="size-3.5 fill-current" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onEnvoyer}
              disabled={!valeur.trim()}
              aria-label="Envoyer la question"
              className="mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer disabled:cursor-not-allowed sm:size-10"
            >
              <ArrowUp className="size-4.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Sur téléphone la mise en garde tient sur deux lignes et le bouton
        * passerait dessous : les deux se placent donc au centre, en colonne,
        * et ne reprennent leur ligne qu'à partir de 640 px. */}
      <div className="flex flex-col items-center gap-2 px-1 py-2.5 sm:flex-row sm:justify-between sm:gap-4 sm:py-3">
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-left sm:text-xs">
          Les réponses peuvent comporter des erreurs. Vérifiez les chiffres
          auprès des sources citées.
        </p>
        {onRecommencer && (
          <button
            type="button"
            onClick={onRecommencer}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Nouvelle conversation
          </button>
        )}
      </div>
    </div>
  );
}
