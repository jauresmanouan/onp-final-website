import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import { LienFleche } from "@/components/site/LienNavigation";
import { getFAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Foire aux questions",
  description:
    "Questions fréquentes sur l'Office National de la Population de Côte d'Ivoire, sa création, ses partenaires et ses projets.",
};

export default async function FaqPage() {
  const questions = await getFAQ();

  return (
    <>
      <PageHeader
        surtitre="Aide"
        titre="Foire aux questions"
        chapeau="Ce qui revient le plus souvent au sujet de l'Office, de sa création à ses projets en cours."
      />

      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16 lg:py-20">
        {/* Chaque entrée est repliable nativement : pas de JavaScript, et la
         * page reste navigable au clavier comme à la recherche du navigateur. */}
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {questions.map((q, i) => (
            <details key={q.question} className="group bg-card" open={i === 0}>
              <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-medium leading-snug transition-colors hover:text-primary">
                {q.question}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <div className="space-y-4 px-5 pb-6 text-[15px] leading-relaxed text-muted-foreground">
                {q.reponse.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-6">
          <p className="text-[15px] text-muted-foreground">
            Vous n&apos;avez pas trouvé votre réponse ?
          </p>
          <LienFleche href="/contact">Nous écrire</LienFleche>
        </div>
      </div>
    </>
  );
}
