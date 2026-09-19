import type { MetadataRoute } from "next";
import { buildFallbackSitemap, buildLocalSitemap, fetchCmsSitemap } from "@/lib/cms-seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await buildLocalSitemap()) || (await fetchCmsSitemap()) || buildFallbackSitemap();
}
