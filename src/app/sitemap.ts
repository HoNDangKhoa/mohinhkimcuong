import type { MetadataRoute } from "next";
import { buildFallbackSitemap, fetchCmsSitemap } from "@/lib/cms-seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await fetchCmsSitemap()) || buildFallbackSitemap();
}
