"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Bouton d'accès au tableau de bord.
 * Affiche un spinner tant que la route /dashboard n'est pas prête :
 * useTransition reste "pending" pendant tout le chargement de la page.
 */
export default function DashboardCTA() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.push("/dashboard"))}
      disabled={isPending}
      aria-busy={isPending}
      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all duration-200 cursor-pointer disabled:cursor-wait disabled:hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
    >
      <span className={isPending ? "opacity-90" : undefined}>
        {isPending ? "Ouverture du tableau de bord" : "Accéder au tableau de bord"}
      </span>

      {/* Zone d'icône de largeur fixe : pas de saut de mise en page au clic */}
      <span className="relative h-4 w-4 shrink-0">
        {/* Flèche */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`absolute inset-0 transition-all duration-200 group-hover:translate-x-0.5 ${
            isPending ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>

        {/* Spinner : anneau à dégradé conique */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 transition-all duration-200 ${
            isPending ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.18)_140deg,#ffffff_340deg,#ffffff_360deg)] animate-spin [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))] [-webkit-mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-2px))]" />
        </span>
      </span>
    </button>
  );
}
