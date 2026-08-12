import type { MetadataRoute } from "next";
import { getActualiteSlugs } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onp.ci";

/**
 * Plan du site. Les articles sont énumérés depuis la même source que les
 * pages : ajouter une actualité l'inscrit au plan sans autre intervention.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const maintenant = new Date();

  const rubriques = [
    { url: "", priority: 1 },
    { url: "/office", priority: 0.9 },
    { url: "/actualites", priority: 0.8 },
    { url: "/publications", priority: 0.8 },
    { url: "/partenaires", priority: 0.6 },
    { url: "/contact", priority: 0.6 },
    { url: "/faq", priority: 0.5 },
    { url: "/dashboard", priority: 0.9 },
  ].map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: maintenant,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const slugs = await getActualiteSlugs();
  const articles = slugs.map((slug) => ({
    url: `${SITE_URL}/actualites/${slug}`,
    lastModified: maintenant,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...rubriques, ...articles];
}
