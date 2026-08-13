import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onp.ci";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ONP · Office National de la Population",
    template: "%s | ONP Côte d'Ivoire",
  },
  description:
    "Plateforme de données démographiques de l'Office National de la Population de Côte d'Ivoire. Indicateurs officiels, cartes territoriales et données téléchargeables.",
  icons: { icon: "/onp_logo_vf.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

/**
 * Script d'avant peinture.
 *
 * Il pose le thème, et signale que le JavaScript répond. Cette seconde
 * marque sert aux chiffres de l'accueil : le serveur écrit leur valeur
 * finale, pour qui lit sans script comme pour les moteurs, mais elle
 * s'affichait pleine une demi-seconde avant que l'hydratation ne la remette
 * à zéro pour la faire monter. La marque permet de la cacher d'ici là, sans
 * la retirer de la page. Sans script, la classe n'arrive jamais et la valeur
 * reste visible.
 */
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){r.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable}`}
    >
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
