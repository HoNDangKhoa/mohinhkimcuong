import type { Metadata, MetadataRoute } from "next";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";
import {
  ALL_ARTICLES,
  NEWS_COLLECTION,
  PROJECT_COLLECTION,
  SERVICE_COLLECTION,
  SITE_BUILD_DATE_ISO,
  SITE_PAGES,
  SITE_URL,
  type ArchiveCollection,
  type ArticleItem,
} from "@/lib/site-content";

const CMS_BASE_URL =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "https://cms.looms.vn";

const CMS_API_KEY =
  process.env.CMS_API_KEY ||
  process.env.NEXT_PUBLIC_CMS_API_KEY ||
  "";

const CMS_TIMEOUT_MS = 3500;
const SEO_REVALIDATE_SECONDS = 60 * 60;
const SITE_HOST = new URL(SITE_URL).hostname;
type CmsFetchCacheMode = "revalidate" | "no-store";

type CmsSitemapEntry = {
  url?: string | null;
  loc?: string | null;
  lastModified?: string | null;
  lastmod?: string | null;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"] | null;
  changefreq?: string | null;
  priority?: number | string | null;
};

type CmsSitemapResponse =
  | CmsSitemapEntry[]
  | {
      data?: CmsSitemapEntry[];
      urls?: CmsSitemapEntry[];
      entries?: CmsSitemapEntry[];
    };

type CmsPublicSettingsResponse = {
  values?: Record<string, string>;
};

export interface CmsSeoSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteUrl: string;
  defaultOgImage: string;
}

export interface CmsSeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type: "article" | "website";
  };
  schema: Record<string, unknown>;
}

function cmsUrl(path: string) {
  const url = new URL(path, CMS_BASE_URL.replace(/\/$/, ""));
  url.searchParams.set("siteUrl", SITE_URL);
  return url;
}

function cmsHeaders() {
  const headers: HeadersInit = {};
  if (CMS_API_KEY) headers["x-api-key"] = CMS_API_KEY;
  return headers;
}

function isThisSiteHost(hostname: string) {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  const own = SITE_HOST.replace(/^www\./, "").toLowerCase();
  return host === own;
}

function textBelongsToThisSite(text: string) {
  const lower = text.toLowerCase();
  const host = SITE_HOST.replace(/^www\./, "").toLowerCase();
  return Boolean(host) && lower.includes(host);
}

function rewriteLegacySiteUrl(value: string) {
  return value
    .replace(/^https?:\/\/(www\.)?mohinhkimcuong\.vn\/(diamond-vn|diamondmodel)\//i, "/$2/")
    .replace(/^https?:\/\/(www\.)?mohinhkimcuong\.vn\/?$/i, SITE_URL);
}

async function cmsFetch(path: string, cacheMode: CmsFetchCacheMode = "revalidate"): Promise<Response | null> {
  if (!CMS_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);

  try {
    const response = await fetch(cmsUrl(path), {
      headers: cmsHeaders(),
      ...(cacheMode === "no-store"
        ? { cache: "no-store" as const }
        : { next: { revalidate: SEO_REVALIDATE_SECONDS } }),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function cmsFetchJson<T>(path: string, cacheMode?: CmsFetchCacheMode): Promise<T | null> {
  const response = await cmsFetch(path, cacheMode);
  if (!response) return null;

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCmsSeoSettings(): Promise<CmsSeoSettings | null> {
  const { getLocalSettings } = await import("@/lib/cms-local-store");
  const [response, local] = await Promise.all([
    cmsFetchJson<CmsPublicSettingsResponse>("/api/public/settings/seo", "no-store"),
    getLocalSettings("seo"),
  ]);
  const values = { ...(response?.values || {}), ...local };
  if (!Object.keys(values).length) return null;

  const siteTitle = values.seo_title?.trim();
  const siteDescription = values.seo_description?.trim();
  const siteKeywords = parseKeywords(values.seo_keywords || "");
  const importedSiteUrl = rewriteLegacySiteUrl(values.seo_site_url?.trim() || "").replace(/\/+$/, "");
  let siteUrl = SITE_URL;
  try {
    if (importedSiteUrl && isThisSiteHost(new URL(importedSiteUrl).hostname)) {
      siteUrl = importedSiteUrl;
    }
  } catch {
    siteUrl = SITE_URL;
  }
  const defaultOgImage = rewriteLegacySiteUrl((values.seo_default_og_image || "").trim())
    .replace(/^\/media\/media-diamond-model\/media\//, "/handover-media/")
    .replace(/^media\//, "/handover-media/");

  if (
    !siteTitle &&
    !siteDescription &&
    !siteKeywords.length &&
    !siteUrl &&
    !defaultOgImage
  ) {
    return null;
  }

  return {
    siteTitle: siteTitle || "Diamond Model | Thiết kế và thi công nội thất",
    siteDescription: siteDescription || "",
    siteKeywords,
    siteUrl,
    defaultOgImage,
  };
}

export async function getArchivePageSeo(kind: "projects" | "services" | "articles") {
  const { getLocalSettings } = await import("@/lib/cms-local-store");
  const [globalSeo, local] = await Promise.all([fetchCmsSeoSettings(), getLocalSettings("seo")]);
  const prefix = `seo_page_${kind}`;
  const title = local[`${prefix}_title`]?.trim() || "";
  const description = local[`${prefix}_description`]?.trim() || globalSeo?.siteDescription || "";
  const keywords = parseKeywords(local[`${prefix}_keywords`] || "");
  return { title, description, keywords };
}

export function publicArticleMetadata(article: ArticleItem, path: string, suffix: string): Metadata {
  const title = article.seoTitle || `${article.title} | ${suffix}`;
  const description = article.seoDescription || article.summary;
  const keywords = parseKeywords(article.seoKeywords || "");
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: article.heroImage ? [article.heroImage] : undefined,
    },
  };
}

export async function fetchCmsSeoMetadata(
  type: "page" | "article" | "product" | "service" | "project",
  slug: string,
): Promise<CmsSeoMetadata | null> {
  return cmsFetchJson<CmsSeoMetadata>(`/api/seo/metadata/${encodeURIComponent(type)}/${encodeURIComponent(slug)}`);
}

export function mapCmsSeoMetadataToNext(metadata: CmsSeoMetadata): Metadata {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: metadata.canonical ? { canonical: metadata.canonical } : undefined,
    robots: {
      index: metadata.robots.index,
      follow: metadata.robots.follow,
    },
    openGraph: {
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      url: metadata.openGraph.url,
      images: metadata.openGraph.image ? [metadata.openGraph.image] : undefined,
      type: metadata.openGraph.type,
    },
  };
}

export async function fetchCmsSeoText(path: "/api/seo/robots.txt" | "/api/seo/llms.txt" | "/api/seo/llms-full.txt") {
  const response = await cmsFetch(path);
  const text = await response?.text();
  const trimmed = text?.trim() || "";
  if (!trimmed || !textBelongsToThisSite(trimmed)) return null;
  return trimmed;
}

export async function fetchCmsSitemap(): Promise<MetadataRoute.Sitemap | null> {
  const response = await cmsFetch("/api/seo/sitemap");
  const json = (await response?.json().catch(() => null)) as CmsSitemapResponse | null;
  const entries = Array.isArray(json) ? json : json?.data || json?.urls || json?.entries;

  if (!entries?.length) return null;

  const sitemap: MetadataRoute.Sitemap = [];

  entries.forEach((entry) => {
    const url = entry.url || entry.loc;
    if (!url) return;
    try {
      if (!isThisSiteHost(new URL(url).hostname)) return;
    } catch {
      return;
    }

    sitemap.push({
      url,
      lastModified: entry.lastModified || entry.lastmod || SITE_BUILD_DATE_ISO,
      changeFrequency: normalizeChangeFrequency(entry.changeFrequency || entry.changefreq),
      priority: normalizePriority(entry.priority),
    });
  });

  return sitemap.length ? sitemap : null;
}

export async function buildLocalSitemap(): Promise<MetadataRoute.Sitemap | null> {
  const { getStoredCollection } = await import("@/lib/cms-local-store");
  const [projects, services, articles] = await Promise.all([
    getStoredCollection("projects"),
    getStoredCollection("services"),
    getStoredCollection("articles"),
  ]);

  if (!projects.length && !services.length && !articles.length) return null;

  const staticEntries: MetadataRoute.Sitemap = SITE_PAGES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: SITE_BUILD_DATE_ISO,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const fromRecords = (
    records: Awaited<ReturnType<typeof getStoredCollection>>,
    prefix: "du-an" | "dich-vu" | "tin-tuc",
    priority: number,
  ): MetadataRoute.Sitemap =>
    records
      .filter((record) => record.status === "published" && record.slug && record.indexable !== false)
      .map((record) => ({
        url: absoluteUrl(`/${prefix}/${record.slug}`),
        lastModified: record.updatedAt || record.publishedAt || SITE_BUILD_DATE_ISO,
        changeFrequency: "monthly",
        priority,
      }));

  const aiIndexEntries: MetadataRoute.Sitemap = ["/llms.txt", "/llms-full.txt"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: SITE_BUILD_DATE_ISO,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return dedupeSitemap([
    ...staticEntries,
    ...fromRecords(projects, "du-an", 0.7),
    ...fromRecords(services, "dich-vu", 0.7),
    ...fromRecords(articles, "tin-tuc", 0.7),
    ...aiIndexEntries,
  ]);
}

export function buildFallbackRobotsTxt() {
  return [
    "# *",
    "User-agent: *",
    "Allow: /",
    "Disallow: /checkout",
    "Disallow: /success",
    "Disallow: /tracking",
    "Disallow: /api/",
    "Disallow: /admin",
    "",
    "# Googlebot",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "# GPTBot",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "# Google-Extended",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "# anthropic-ai",
    "User-agent: anthropic-ai",
    "Allow: /",
    "",
    "# ClaudeBot",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "# PerplexityBot",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "# Host",
    `Host: ${SITE_URL}`,
    "",
    "# Sitemaps",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  ].join("\n");
}

export function buildFallbackLlmsTxt() {
  return [
    `# ${DIAMOND_VN_COMPANY.name} (${SITE_HOST})`,
    "",
    "> Diamond Model thiết kế, thi công nội thất, sa bàn dự án và mô hình kiến trúc cho nhà ở, thương mại, quy hoạch và trưng bày.",
    "",
    "## Key Pages",
    ...SITE_PAGES.map(pageLine),
    "",
    "## Products / Services",
    ...collectionLines(SERVICE_COLLECTION, 6),
    "",
    "## Projects / Portfolio",
    ...collectionLines(PROJECT_COLLECTION, 6),
    "",
    "## Blog / Resources",
    ...collectionLines(NEWS_COLLECTION, 6),
    "",
    "## About",
    `- [Contact](${absoluteUrl("/lien-he")}): Tư vấn thiết kế, thi công, báo giá và đặt lịch làm việc với Diamond Model.`,
    `- [Email](mailto:${DIAMOND_VN_COMPANY.email}): ${DIAMOND_VN_COMPANY.email}`,
    `- [Hotline](tel:${DIAMOND_VN_COMPANY.phoneHref}): ${DIAMOND_VN_COMPANY.phone}`,
    `- [Facebook](${DIAMOND_VN_COMPANY.facebook}): Kênh cập nhật hình ảnh dự án và tư vấn nhanh.`,
  ].join("\n");
}

export function buildFallbackLlmsFullTxt() {
  return [
    buildFallbackLlmsTxt(),
    "",
    "## Full Content Index",
    ...ALL_ARTICLES.map((article) => articleLine(article)),
    "",
    "## Organization",
    `- Name: ${DIAMOND_VN_COMPANY.fullName}`,
    `- Website: ${SITE_URL}`,
    `- Email: ${DIAMOND_VN_COMPANY.email}`,
    `- Phone: ${DIAMOND_VN_COMPANY.phone}`,
    ...DIAMOND_VN_COMPANY.addresses.flatMap((address) => [
      `- ${address.title}: ${address.lines.join(", ")}`,
    ]),
  ].join("\n");
}

export function buildFallbackSitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = SITE_PAGES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: SITE_BUILD_DATE_ISO,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = ALL_ARTICLES.map((article) => ({
    url: absoluteUrl(articlePath(article)),
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: article.categoryHref === "/gioi-thieu" ? 0.9 : 0.7,
  }));

  const aiIndexEntries: MetadataRoute.Sitemap = ["/llms.txt", "/llms-full.txt"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: SITE_BUILD_DATE_ISO,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return dedupeSitemap([...staticEntries, ...articleEntries, ...aiIndexEntries]);
}

function collectionLines(collection: ArchiveCollection, limit: number) {
  return collection.items.slice(0, limit).map((article) => articleLine(article));
}

function pageLine(path: (typeof SITE_PAGES)[number]) {
  const labels: Record<(typeof SITE_PAGES)[number], string> = {
    "/": "Home",
    "/gioi-thieu": "Giới thiệu",
    "/du-an": "Dự án",
    "/dich-vu": "Dịch vụ",
    "/tin-tuc": "Tin tức",
    "/lien-he": "Liên hệ",
  };

  const descriptions: Record<(typeof SITE_PAGES)[number], string> = {
    "/": "Trang chủ Diamond Model với năng lực thiết kế, thi công nội thất, sa bàn và mô hình kiến trúc.",
    "/gioi-thieu": "Giới thiệu công ty, kinh nghiệm, quy trình và cam kết dịch vụ.",
    "/du-an": "Danh mục dự án sa bàn, mô hình kiến trúc và công trình đã thực hiện.",
    "/dich-vu": "Các gói dịch vụ từ tư vấn, thiết kế 3D, thi công đến bảo trì mô hình.",
    "/tin-tuc": "Kiến thức về sa bàn, vật liệu, mô hình kiến trúc và trình bày dự án.",
    "/lien-he": "Thông tin hotline, email, địa chỉ và form đặt lịch tư vấn.",
  };

  return `- [${labels[path]}](${absoluteUrl(path)}): ${descriptions[path]}`;
}

function articleLine(article: ArticleItem) {
  return `- [${article.title}](${absoluteUrl(articlePath(article))}): ${plainText(article.summary)}`;
}

function articlePath(article: ArticleItem) {
  if (article.slug === "gioi-thieu" || article.categoryHref === "/gioi-thieu") return "/gioi-thieu";
  return `${article.categoryHref}/${article.slug}`;
}

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function parseKeywords(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePriority(value: CmsSitemapEntry["priority"]) {
  const priority = typeof value === "string" ? Number(value) : value;
  return typeof priority === "number" && Number.isFinite(priority) ? priority : 0.7;
}

function normalizeChangeFrequency(value: CmsSitemapEntry["changeFrequency"] | CmsSitemapEntry["changefreq"]) {
  const allowed = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const;
  return allowed.find((item) => item === value) || "weekly";
}

function dedupeSitemap(entries: MetadataRoute.Sitemap) {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  entries.forEach((entry) => byUrl.set(entry.url, entry));
  return Array.from(byUrl.values());
}
