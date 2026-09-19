import {
  ABOUT_ARTICLE,
  NEWS_COLLECTION,
  PROJECT_COLLECTION,
  SERVICE_COLLECTION,
  type ArchiveCollection,
  type ArticleItem,
} from "@/lib/site-content";

export type CollectionKey = "projects" | "services" | "articles" | "pages";
export type ContentStatus = "draft" | "review" | "published" | "archived";
export type LeadStatus = "new" | "processing" | "done" | "read";
export type LeadSource = "contact-page" | "consultation-popup" | (string & {});
export type CmsSettingsGroupKey =
  | "home"
  | "general"
  | "contact"
  | "appearance"
  | "seo"
  | "social"
  | "analytics"
  | "booking";

export type CmsGalleryItem = {
  id?: number;
  projectId?: number;
  mediaUrl: string;
  mediaType?: "image" | "video";
  section: "hero" | "gallery";
  caption?: string;
  altText: string;
  width?: number | null;
  height?: number | null;
  sortOrder?: number;
  thumbnailUrl?: string | null;
  mimeType?: string | null;
};

export type CmsContentRecord = {
  sourceId?: number;
  status: ContentStatus;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  indexable?: boolean;
  tags: string[];
  category: string;
  categoryId?: number | null;
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
  createdAt?: string;
  client?: string;
  location?: string;
  area?: string;
  scale?: string;
  materials?: string;
  completedAt?: string;
  gallery?: CmsGalleryItem[];
  ogImage?: string;
  sortOrder?: number;
  viewCount?: number;
  metadata?: Record<string, unknown>;
  schemaType?: string;
  schemaData?: unknown;
  iconName?: string;
  authorId?: number | null;
};

export type CmsCategoryRecord = {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  type: "project" | "service" | "article" | "product" | (string & {});
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsMediaRecord = {
  mediaId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  folder: string;
  objectKey: string;
  url: string;
  title: string;
  description: string;
  createdAt: string;
};

export type CmsLeadRecord = {
  id: string;
  sourceId?: number;
  status: LeadStatus;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  replyContent?: string;
  source: LeadSource;
  createdAt: string;
};

export type CmsUserRecord = {
  username: string;
  role: "admin" | "editor" | "seo" | "sale" | "viewer";
  status: "active" | "locked";
  lastLoginAt: string;
  displayName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  avatarUrl?: string;
  passwordHash?: string;
};

export type CmsAccessLog = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  username: string;
  createdAt: string;
};

export type CmsSettingsMap = Record<string, string>;

export type CmsSettingRow = {
  key: string;
  value: string;
  group: string;
  description: string;
};

export type CmsLocalStore = {
  version: 2;
  source?: string;
  importedAt?: string;
  projects: CmsContentRecord[];
  services: CmsContentRecord[];
  articles: CmsContentRecord[];
  pages: CmsContentRecord[];
  categories: CmsCategoryRecord[];
  media: CmsMediaRecord[];
  gallery: CmsGalleryItem[];
  contacts: CmsLeadRecord[];
  users: CmsUserRecord[];
  accessLogs: CmsAccessLog[];
  settings: Record<CmsSettingsGroupKey, CmsSettingsMap>;
  settingRows: CmsSettingRow[];
};

export const EMPTY_STORE: CmsLocalStore = {
  version: 2,
  projects: [],
  services: [],
  articles: [],
  pages: [],
  categories: [],
  media: [],
  gallery: [],
  contacts: [],
  users: [],
  accessLogs: [],
  settings: {
    home: {},
    general: {},
    contact: {},
    appearance: {},
    seo: {},
    social: {},
    analytics: {},
    booking: {},
  },
  settingRows: [],
};

export const CMS_SETTINGS_GROUP_KEYS: CmsSettingsGroupKey[] = [
  "home",
  "general",
  "contact",
  "appearance",
  "seo",
  "social",
  "analytics",
  "booking",
];

export function collectionToSiteSlug(key: CollectionKey): "du-an" | "dich-vu" | "tin-tuc" | "gioi-thieu" {
  switch (key) {
    case "projects":
      return "du-an";
    case "services":
      return "dich-vu";
    case "articles":
      return "tin-tuc";
    case "pages":
      return "gioi-thieu";
  }
}

export function siteSlugToCollection(slug: "du-an" | "dich-vu" | "tin-tuc"): Exclude<CollectionKey, "pages"> {
  switch (slug) {
    case "du-an":
      return "projects";
    case "dich-vu":
      return "services";
    case "tin-tuc":
      return "articles";
  }
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function metaValue(item: ArticleItem, label: string) {
  return item.meta.find((entry) => entry.label === label)?.value || "";
}

export function articleToRecord(item: ArticleItem, status: ContentStatus = "published"): CmsContentRecord {
  return {
    status,
    title: item.title,
    slug: item.slug,
    excerpt: item.summary,
    content: item.contentHtml || item.sections.map((section) => `<h2>${section.title}</h2>${section.paragraphs.map((p) => `<p>${p}</p>`).join("")}`).join(""),
    thumbnailUrl: item.heroImage,
    heroImageUrl: item.heroImage,
    seoTitle: item.title,
    seoDescription: item.summary,
    tags: item.tags,
    category: item.categoryLabel,
    isFeatured: Boolean(item.isFeatured),
    publishedAt: item.publishedAt,
    updatedAt: item.publishedAt,
    client: metaValue(item, "Khách hàng"),
    location: metaValue(item, "Địa điểm"),
    area: metaValue(item, "Diện tích") || metaValue(item, "Quy mô"),
    scale: metaValue(item, "Tỷ lệ"),
    materials: metaValue(item, "Vật liệu"),
    completedAt: item.publishedAt,
    ogImage: item.heroImage,
  };
}

export function recordToArticleItem(
  record: CmsContentRecord,
  collection: "du-an" | "dich-vu" | "tin-tuc" | "gioi-thieu",
  fallback?: ArticleItem,
): ArticleItem {
  const base =
    fallback ||
    (collection === "gioi-thieu"
      ? ABOUT_ARTICLE
      : fallbackCollection(collection).items[0] || ABOUT_ARTICLE);

  const publishedAt = record.publishedAt || record.updatedAt || base.publishedAt;
  const categoryHref = collection === "gioi-thieu" ? `/${record.slug}` : `/${collection}`;
  const categoryLabel = record.category || metadataString(record.metadata, "categoryLabel") || base.categoryLabel;
  const content = record.content || base.contentHtml || "";
  const summary = record.excerpt || record.seoDescription || base.summary;
  const metadataMeta = metadataPairs(record.metadata);
  const heroFromGallery = record.gallery?.find((item) => item.section === "hero" && item.mediaUrl)?.mediaUrl
    || record.gallery?.find((item) => item.mediaUrl)?.mediaUrl
    || "";

  const meta =
    metadataMeta.length
      ? metadataMeta
      : collection === "du-an"
        ? [
            { label: "Chuyên mục", value: categoryLabel },
            record.client ? { label: "Khách hàng", value: record.client } : null,
            record.location ? { label: "Địa điểm", value: record.location } : null,
            record.area ? { label: "Diện tích", value: record.area } : null,
            record.scale ? { label: "Tỷ lệ", value: record.scale } : null,
            record.materials ? { label: "Vật liệu", value: record.materials } : null,
            { label: "Cập nhật", value: formatDisplayDate(record.completedAt || publishedAt) },
          ].filter((item): item is { label: string; value: string } => Boolean(item))
        : [
            { label: "Chuyên mục", value: categoryLabel },
            { label: "Đăng ngày", value: formatDisplayDate(publishedAt) },
          ];

  return {
    ...base,
    slug: record.slug || base.slug,
    categoryLabel,
    categoryHref,
    title: record.title || base.title,
    summary,
    heroImage: localizeMediaUrl(record.heroImageUrl || record.thumbnailUrl || record.ogImage || heroFromGallery || base.heroImage),
    heroAlt: metadataString(record.metadata, "heroAlt") || record.title || base.heroAlt,
    publishedAt,
    dateLabel: metadataString(record.metadata, "dateLabel") || formatDisplayDate(publishedAt),
    meta,
    tags: record.tags || [],
    isFeatured: Boolean(record.isFeatured),
    seoTitle: record.seoTitle || record.title,
    seoDescription: record.seoDescription || summary,
    seoKeywords: record.seoKeywords,
    contentHtml: content,
    sections: [{ id: "noi-dung", title: "Nội dung", paragraphs: [summary] }],
    relatedSlugs: metadataStringList(record.metadata, "relatedSlugs") || base.relatedSlugs,
  };
}

export function fallbackCollection(collection: "du-an" | "dich-vu" | "tin-tuc"): ArchiveCollection {
  switch (collection) {
    case "du-an":
      return PROJECT_COLLECTION;
    case "dich-vu":
      return SERVICE_COLLECTION;
    case "tin-tuc":
      return NEWS_COLLECTION;
  }
}

export function fallbackRecords(key: CollectionKey): CmsContentRecord[] {
  if (key === "pages") return [articleToRecord(ABOUT_ARTICLE)];
  const collection = fallbackCollection(collectionToSiteSlug(key) as "du-an" | "dich-vu" | "tin-tuc");
  return collection.items.map((item) => articleToRecord(item));
}

function localizeMediaUrl(value: string) {
  if (!value) return value;
  if (value.startsWith("/media/media-diamond-model/media/")) {
    return `/handover-media/${value.slice("/media/media-diamond-model/media/".length)}`;
  }
  if (value.startsWith("https://media.looms.vn/media-diamond-model/")) {
    return `/handover-media/${value.slice("https://media.looms.vn/media-diamond-model/".length)}`;
  }
  if (value.startsWith("media-external/")) return `/handover-media-external/${value.slice("media-external/".length)}`;
  if (value.startsWith("media/")) return `/handover-media/${value.slice("media/".length)}`;
  return value;
}

function metadataString(metadata: Record<string, unknown> | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

function metadataStringList(metadata: Record<string, unknown> | undefined, key: string) {
  const value = metadata?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function metadataPairs(metadata: Record<string, unknown> | undefined) {
  const value = metadata?.meta;
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { label?: unknown; value?: unknown };
      if (typeof row.label !== "string" || typeof row.value !== "string" || !row.value) return null;
      return { label: row.label, value: row.value };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

function formatDisplayDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Đang cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function recordsToCollection(
  key: Exclude<CollectionKey, "pages">,
  records: CmsContentRecord[],
): ArchiveCollection {
  const siteSlug = collectionToSiteSlug(key) as "du-an" | "dich-vu" | "tin-tuc";
  const fallback = fallbackCollection(siteSlug);
  const published = records.filter((item) => item.status === "published" || item.status === "review");
  const source = [...published].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const items = source.map((item, index) =>
    recordToArticleItem(item, siteSlug, fallback.items[index % fallback.items.length] || fallback.items[0]),
  );
  const featured = items.find((item) => item.isFeatured) || items[0];

  return {
    ...fallback,
    heroImage: items[0]?.heroImage || fallback.heroImage,
    heroAlt: items[0]?.heroAlt || fallback.heroAlt,
    featuredSlug: featured?.slug || fallback.featuredSlug,
    items,
  };
}
