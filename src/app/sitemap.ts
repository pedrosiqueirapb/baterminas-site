import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/** Data fixa do build: evita informar ao Google uma "alteração" nova a cada rastreamento. */
const LAST_BUILD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: LAST_BUILD, images: [`${SITE_URL}/og-image.png`, `${SITE_URL}/logo.png`], changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacidade`, lastModified: LAST_BUILD, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/termos`, lastModified: LAST_BUILD, changeFrequency: "yearly", priority: 0.3 },
  ];
}
