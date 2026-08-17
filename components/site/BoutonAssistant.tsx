"use client";

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
 * Le clic ouvre le disque avant de naviguer. C'est un `Link` malgré tout, et
 * non un bouton : il garde le préchargement de la route, le clic milieu, le
 * « ouvrir dans un nouvel onglet » et l'adresse en bas de la fenêtre. Le geste
 * n'est intercepté que pour un clic gauche ordinaire — un clic modifié part
 * tel quel, sans animation, ce qui est le comportement attendu.
 */
export default function BoutonAssistant({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={ASSISTANT.href}
      onClick={async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        // L'adresse quittée est retenue ici : c'est elle qui donnera sa
        // couleur au disque du retour.
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
