"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { ASSISTANT } from "@/content/site/destinations";
import {
  animationsReduites,
  ouvrirVoile,
  retenirDepart,
} from "@/lib/assistant/ouverture";

/**
 * L'entrée vers la conversation, dans les deux en-têtes.
 *
 * Elle voisine la recherche sans s'y confondre : la palette mène à une fiche
 * qu'il faut savoir nommer, celle-ci à une question qu'on pose comme elle
 * vient.
 *
 * Le clic ouvre le disque, puis navigue. L'ordre compte : la route est donc
 * préchargée dès que le bouton est en place, sans quoi la navigation partait
 * une fois le disque ouvert et l'écran restait couvert le temps de la
 * réponse — assez longtemps, sur une route froide, pour que le minuteur de
 * secours découvre la page de départ avant l'arrivée de la conversation.
 *
 * C'est un `Link` malgré tout, et non un bouton : il garde le clic milieu, le
 * « ouvrir dans un nouvel onglet » et l'adresse en bas de la fenêtre. Le geste
 * n'est intercepté que pour un clic gauche ordinaire.
 */
export default function BoutonAssistant({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.prefetch(ASSISTANT.href);
  }, [router]);

  return (
    <Link
      href={ASSISTANT.href}
      onClick={async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        // L'adresse quittée est retenue ici : c'est elle qui dira, au retour,
        // où revenir et de quelle couleur.
        retenirDepart(pathname);
        if (animationsReduites()) return;
        e.preventDefault();
        await ouvrirVoile(e.currentTarget, "var(--chat)");
        router.push(ASSISTANT.href);
      }}
      title={ASSISTANT.appel}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className}`}
    >
      <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
      <span className="hidden text-sm font-medium xl:inline">
        {ASSISTANT.nom}
      </span>
      <span className="sr-only xl:hidden">{ASSISTANT.appel}</span>
    </Link>
  );
}
