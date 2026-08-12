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
    default: "ONP — Observatoire des Données de Population",
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

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

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
