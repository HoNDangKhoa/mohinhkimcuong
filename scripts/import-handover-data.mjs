import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = process.env.HANDOVER_DATA_DIR
  ? path.resolve(process.env.HANDOVER_DATA_DIR)
  : path.resolve(ROOT, "..", "diamondmodel-data-2026-08-26");
const JSON_DIR = path.join(DATA_DIR, "data", "json-selfcontained");
const MEDIA_SRC = path.join(DATA_DIR, "media");
const MEDIA_DEST = path.join(ROOT, "public", "handover-media");
const MEDIA_EXT_SRC = path.join(DATA_DIR, "media-external");
const MEDIA_EXT_DEST = path.join(ROOT, "public", "handover-media-external");
const STORE_PATH = path.join(ROOT, "data", "cms-local.json");

const SETTING_GROUPS = ["home", "general", "contact", "appearance", "seo", "social", "analytics", "booking"];

function readJson(name) {
  const file = path.join(JSON_DIR, name);
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8"));
}

function rewriteMediaUrl(value) {
  if (typeof value !== "string") return value;
  return value
    .replaceAll("/media/media-diamond-model/media/", "/handover-media/")
    .replaceAll("https://media.looms.vn/media-diamond-model/", "/handover-media/")
    .replaceAll("https://mohinhkimcuong.vn/diamond-vn/", "/diamond-vn/")
    .replaceAll("https://mohinhkimcuong.vn/diamondmodel/", "/diamondmodel/")
    .replaceAll("https://www.mohinhkimcuong.vn", "https://diamondmodel.vn")
    .replaceAll("https://mohinhkimcuong.vn", "https://diamondmodel.vn")
    .replace(/(^|["'\s(])media-external\//g, "$1/handover-media-external/")
    .replace(/(^|["'\s(])media\//g, "$1/handover-media/");
}

function rewriteDeep(value) {
  if (typeof value === "string") return rewriteMediaUrl(value);
  if (Array.isArray(value)) return value.map(rewriteDeep);
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "__mediaUrlMap" || key === "tenantId") continue;
      next[key] = rewriteDeep(item);
    }
    return next;
  }
  return value;
}

function asText(value) {
  if (value == null) return "";
  return typeof value === "string" ? value : String(value);
}

function asTags(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function mapStatus(status, isPublished) {
  if (typeof isPublished === "boolean") return isPublished ? "published" : "draft";
  if (status === "published" || status === "review" || status === "draft" || status === "archived") return status;
  return "draft";
}

function parseContactAddresses(raw) {
  if (!raw?.trim()) return "";
  const blocks = raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const addresses = blocks.map((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const title = lines[0] || "Văn phòng";
    const last = lines[lines.length - 1] || "";
    const phoneLike = /[\d][\d\s.]{7,}/.test(last) && !/[A-Za-zÀ-ỹ]{6,}/.test(last);
    const phone = phoneLike ? last : "";
    const addrLines = phoneLike ? lines.slice(1, -1) : lines.slice(1);
    return {
      title,
      lines: addrLines.length ? addrLines : last ? [last] : [],
      phone,
      href: phone.replace(/\s/g, ""),
    };
  });
  return JSON.stringify(addresses);
}

if (!existsSync(JSON_DIR)) {
  console.error(`Không thấy gói data: ${JSON_DIR}`);
  process.exit(1);
}

const categories = rewriteDeep(readJson("categories.json"));
const gallery = rewriteDeep(readJson("project_gallery.json"));
const projectsRaw = rewriteDeep(readJson("projects.json"));
const servicesRaw = rewriteDeep(readJson("services.json"));
const articlesRaw = rewriteDeep(readJson("articles.json"));
const pagesRaw = rewriteDeep(readJson("pages.json"));
const contactsRaw = rewriteDeep(readJson("contacts.json"));
const mediaRaw = rewriteDeep(readJson("media.json"));
const settingsRaw = rewriteDeep(readJson("settings.json"));

const categoryById = Object.fromEntries(categories.map((item) => [item.categoryId, item]));
const galleryByProject = {};
for (const item of gallery) {
  const list = galleryByProject[item.projectId] || [];
  list.push({
    id: item.id,
    projectId: item.projectId,
    mediaUrl: asText(item.mediaUrl),
    mediaType: item.mediaType || "image",
    section: item.section || "gallery",
    caption: asText(item.caption),
    altText: asText(item.altText),
    width: item.width ?? null,
    height: item.height ?? null,
    sortOrder: item.sortOrder ?? 0,
    thumbnailUrl: item.thumbnailUrl || null,
    mimeType: item.mimeType || null,
  });
  galleryByProject[item.projectId] = list;
}

function mapContent(item, { sourceId, content, extra = {} }) {
  const category = categoryById[item.categoryId];
  return {
    sourceId,
    status: mapStatus(item.status, item.isPublished),
    title: asText(item.title),
    slug: asText(item.slug),
    excerpt: asText(item.excerpt),
    content: asText(content),
    thumbnailUrl: asText(item.thumbnailUrl),
    heroImageUrl: asText(item.heroImageUrl || item.thumbnailUrl || item.ogImage),
    seoTitle: asText(item.seoTitle),
    seoDescription: asText(item.seoDescription),
    seoKeywords: asText(item.seoKeywords),
    canonicalUrl: asText(item.canonicalUrl),
    indexable: item.indexable !== false,
    tags: asTags(item.tags),
    category: category?.name || asText(item.metadata?.categoryLabel),
    categoryId: item.categoryId ?? null,
    isFeatured: Boolean(item.isFeatured),
    publishedAt: asText(item.publishedAt || item.updatedAt || item.createdAt),
    updatedAt: asText(item.updatedAt || item.createdAt),
    createdAt: asText(item.createdAt),
    ogImage: asText(item.ogImage),
    sortOrder: item.sortOrder ?? 0,
    viewCount: item.viewCount ?? 0,
    metadata: item.metadata && typeof item.metadata === "object" ? item.metadata : {},
    schemaType: asText(item.schemaType),
    schemaData: item.schemaData ?? null,
    authorId: item.authorId ?? null,
    ...extra,
  };
}

const projects = projectsRaw.map((item) =>
  mapContent(item, {
    sourceId: item.projectId,
    content: item.description,
    extra: {
      client: asText(item.client),
      location: asText(item.location),
      area: asText(item.area),
      scale: asText(item.scale),
      materials: asText(item.materials),
      completedAt: asText(item.completedAt),
      gallery: galleryByProject[item.projectId] || [],
    },
  }),
);

const services = servicesRaw.map((item) =>
  mapContent(item, {
    sourceId: item.serviceId,
    content: item.content,
    extra: { iconName: asText(item.iconName) },
  }),
);

const articles = articlesRaw.map((item) =>
  mapContent(item, {
    sourceId: item.articleId,
    content: item.content,
  }),
);

const pages = pagesRaw.map((item) =>
  mapContent(item, {
    sourceId: item.pageId,
    content: item.content,
    extra: { category: "Trang tĩnh" },
  }),
);

const contacts = contactsRaw.map((item) => ({
  id: `lead-${item.contactId}`,
  sourceId: item.contactId,
  status: item.status || "new",
  name: asText(item.name),
  phone: asText(item.phone),
  email: asText(item.email),
  subject: asText(item.subject),
  message: asText(item.message),
  replyContent: asText(item.replyContent),
  source: asText(item.source) || "contact-page",
  createdAt: asText(item.createdAt),
}));

const media = mediaRaw.map((item) => ({
  mediaId: item.mediaId,
  filename: asText(item.filename),
  originalName: asText(item.originalName),
  mimeType: asText(item.mimeType) || "application/octet-stream",
  size: item.size ?? 0,
  width: item.width ?? null,
  height: item.height ?? null,
  alt: asText(item.alt),
  folder: asText(item.folder),
  objectKey: asText(item.objectKey),
  url: item.objectKey ? `/handover-media/${item.objectKey}` : rewriteMediaUrl(asText(item.url)),
  title: asText(item.title),
  description: asText(item.description),
  createdAt: asText(item.createdAt),
}));

const settings = Object.fromEntries(SETTING_GROUPS.map((group) => [group, {}]));
const settingRows = settingsRaw.map((item) => {
  const group = SETTING_GROUPS.includes(item.group) ? item.group : item.group;
  const value = rewriteMediaUrl(asText(item.value));
  if (SETTING_GROUPS.includes(group)) settings[group][item.key] = value;
  return {
    key: item.key,
    value,
    group: asText(item.group),
    description: asText(item.description),
  };
});

settings.appearance.social_facebook = settings.appearance.social_facebook || settings.social.facebook_url || "";
settings.appearance.social_youtube = settings.appearance.social_youtube || settings.social.youtube_url || "";
settings.appearance.social_zalo = settings.appearance.social_zalo || settings.social.zalo_url || "";
settings.appearance.social_instagram = settings.appearance.social_instagram || settings.social.instagram_url || "";
settings.contact.company_phone = settings.contact.company_phone || settings.contact.contact_hotline || settings.contact.contact_phone || "";
settings.contact.company_email = settings.contact.company_email || settings.contact.contact_email || "";
settings.contact.company_addresses = settings.contact.company_addresses || parseContactAddresses(settings.contact.contact_address);
settings.home.home_process_image = settings.home.home_process_image || settings.home.home_process_desktop || "";
settings.home.home_stats_metrics = settings.home.home_stats_metrics || settings.home.home_values || "";
settings.seo.seo_page_projects_title = settings.seo.seo_page_projects_title || "Dự án | Diamond Model";
settings.seo.seo_page_services_title = settings.seo.seo_page_services_title || "Dịch vụ | Diamond Model";
settings.seo.seo_page_articles_title = settings.seo.seo_page_articles_title || "Tin tức | Diamond Model";
settings.seo.seo_site_url = settings.seo.seo_site_url || "https://diamondmodel.vn";

const contactEmail = settings.contact.company_email || settings.contact.contact_email || "info@diamondmodel.vn";
if (!/diamondmodel\.vn/i.test(settings.booking.booking_notification_email || "")) {
  settings.booking.booking_notification_email = contactEmail;
}
if (!/diamondmodel\.vn/i.test(settings.booking.mailer_email || "")) {
  settings.booking.mailer_email = contactEmail;
}
settings.booking.mailer_password = "";

let existing = {};
try {
  existing = JSON.parse(readFileSync(STORE_PATH, "utf8"));
} catch {
  existing = {};
}

mkdirSync(path.dirname(STORE_PATH), { recursive: true });
if (existsSync(MEDIA_SRC)) {
  mkdirSync(path.dirname(MEDIA_DEST), { recursive: true });
  cpSync(MEDIA_SRC, MEDIA_DEST, { recursive: true });
}
if (existsSync(MEDIA_EXT_SRC)) {
  mkdirSync(path.dirname(MEDIA_EXT_DEST), { recursive: true });
  cpSync(MEDIA_EXT_SRC, MEDIA_EXT_DEST, { recursive: true });
}

const store = {
  version: 2,
  source: "diamondmodel-data-2026-08-26",
  importedAt: new Date().toISOString(),
  projects,
  services,
  articles,
  pages,
  categories: categories.map((item) => ({
    categoryId: item.categoryId,
    name: asText(item.name),
    slug: asText(item.slug),
    description: asText(item.description),
    type: item.type || "project",
    parentId: item.parentId ?? null,
    sortOrder: item.sortOrder ?? 0,
    isActive: item.isActive !== false,
    imageUrl: asText(item.imageUrl),
    createdAt: asText(item.createdAt),
    updatedAt: asText(item.updatedAt),
  })),
  media,
  gallery: Object.values(galleryByProject).flat(),
  contacts,
  users: Array.isArray(existing.users) ? existing.users : [],
  accessLogs: Array.isArray(existing.accessLogs) ? existing.accessLogs : [],
  settings,
  settingRows,
};

writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      dataDir: DATA_DIR,
      store: STORE_PATH,
      media: MEDIA_DEST,
      mediaExternal: MEDIA_EXT_DEST,
      counts: {
        projects: projects.length,
        services: services.length,
        articles: articles.length,
        pages: pages.length,
        categories: store.categories.length,
        media: media.length,
        gallery: store.gallery.length,
        contacts: contacts.length,
        settings: settingRows.length,
      },
    },
    null,
    2,
  ),
);
