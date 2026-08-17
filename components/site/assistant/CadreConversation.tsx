"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ThemeToggle from "@/components/accueil/ThemeToggle";
import {
  animationsReduites,
  couleurRetour,
  ouvrirVoile,
  retirerVoile,
} from "@/lib/assistant/ouverture";

/**
 * Le cadre de la conversation, et ses deux mouvements.
 *
 * À l'arrivée, le disque ouvert par le bouton couvre encore l'écran : la page
 * se peint dessous, puis il s'efface et la découvre. Au départ, le même
 * disque repart de la croix et couvre l'écran avant que la navigation ne
 * s'engage. Le geste est le même dans les deux sens : un aller-retour, pas
 * deux pages qui se remplacent.
 *
 * Entre les deux, il n'y a que le logo — pour savoir à qui l'on parle — le
 * thème, et de quoi repartir.
 */
export default function CadreConversation({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const croixRef = useRef<HTMLButtonElement>(null);

  // Le disque part dès que la page est montée. Sur une arrivée sans disque —
  // palette, lien collé, rechargement — il n'y a rien à retirer et l'appel ne
  // fait rien.
  useEffect(() => {
    retirerVoile();
  }, []);

  const fermer = useCallback(async () => {
    const retour = () => {
      // Revenir d'où l'on vient plutôt que d'imposer l'accueil : la question
      // est souvent posée depuis le tableau de bord, au milieu d'une lecture.
      if (window.history.length > 1) router.back();
      else router.push("/");
    };

    if (animationsReduites()) {
      retour();
      return;
    }

    // Le disque prend la couleur de la page vers laquelle on revient, puis
    // c'est elle qui l'efface en arrivant — `RetraitVoile`, monté dans les
    // deux ossatures. Sans lui, le disque restait jusqu'à son minuteur de
    // secours et l'on regardait un écran uni pendant une seconde et demie.
    await ouvrirVoile(croixRef.current, couleurRetour());
    retour();
  }, [router]);

  // Échap ferme, comme tout ce qui s'ouvre par-dessus le site. Le champ de
  // saisie garde le focus : la touche doit rester atteignable en écrivant.
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [fermer]);

  return (
    <div className="flex h-dvh flex-col bg-chat">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 px-3 sm:px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src="/onp_logo_vf.png"
            alt=""
            width={160}
            height={128}
            priority
            className="h-7 w-auto shrink-0 object-contain"
          />
          <span className="truncate font-display text-sm font-semibold tracking-tight">
            ONP-AI Chat
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-0.5">
          <ThemeToggle />
          <button
            type="button"
            ref={croixRef}
            onClick={fermer}
            aria-label="Quitter la conversation"
            title="Quitter (Échap)"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-chat-bulle hover:text-foreground cursor-pointer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
