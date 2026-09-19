export interface HeroSlide {
  type: "image" | "video";
  url: string;
  poster?: string;
  alt?: string;
}

export interface HomeMissionSettings {
  badgeImage: string;
  script: string;
  title: string;
  image: string;
  label: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaIcon: string;
}

export interface HomeStatsMetric {
  value: string;
  label: string;
  image: string;
}

export interface HomeStatsSettings {
  eyebrow: string;
  title: string;
  defaultImage: string;
  backgroundImage: string;
  metrics: HomeStatsMetric[];
}

export interface CmsHomeSettings {
  heroSlides: HeroSlide[];
  mission: HomeMissionSettings;
  stats: HomeStatsSettings;
}

interface PublicSettingsResponse {
  values?: Record<string, string>;
}

export interface CmsContactSettings {
  companyProfileUrl: string;
  companyProfileLabel: string;
  companyProfileNote: string;
}

export interface CmsGeneralSettings {
  siteLogo: string;
  siteFavicon: string;
  footerBadge: string;
  siteName: string;
  aboutPageSlug: string;
}

const CMS_BASE_URL =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "https://cms.looms.vn";

const CMS_API_KEY =
  process.env.CMS_API_KEY ||
  process.env.NEXT_PUBLIC_CMS_API_KEY ||
  "";

const CMS_TIMEOUT_MS = 3500;

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
const ABOUT_DEMO_VALUE = "__demo";

const DEFAULT_HOME_MISSION: HomeMissionSettings = {
  badgeImage: "/diamond-vn/home/9_Years.svg",
  script: "Với Sứ Mệnh",
  title: "“KIẾN TẠO GIÁ TRỊ SA BÀN”",
  image: "/diamondmodel/home/hero-slide-2.png",
  label: "Với Diamond Model",
  paragraphs: [
    "Diamond Model tập trung vào sa bàn dự án, mô hình kiến trúc và phối cảnh trưng bày cho các công trình nhà ở, chung cư, khu đô thị và quy hoạch.",
    "Mỗi mô hình được triển khai theo hướng rõ tỷ lệ, sạch bề mặt và dễ đọc bố cục, để chủ đầu tư và khách hàng có thể hình dung nhanh tinh thần công trình trước khi bước vào giai đoạn thi công thực tế.",
    "Mục tiêu là tạo ra một sản phẩm trưng bày chỉn chu, chính xác và đủ nổi bật để phục vụ trình bày, bán hàng và phê duyệt phương án.",
  ],
  ctaLabel: "Về Diamond Model",
  ctaHref: "/gioi-thieu",
  ctaIcon: "/diamondmodel/brand/icon-diamondmodel-drop.png",
};

const DEFAULT_STATS_METRICS: HomeStatsMetric[] = [
  { label: "Khách hàng", value: "350+", image: "/diamond-vn/home/value-customer-01.webp" },
  { label: "Dự án thiết kế", value: "400+", image: "/diamond-vn/home/value-design-02.webp" },
  { label: "Dự án thi công", value: "380+", image: "/diamond-vn/home/value-build-03.webp" },
  { label: "Công trình\ntiêu biểu", value: "18", image: "/diamond-vn/home/value-special-04.webp" },
];

const DEFAULT_HOME_STATS: HomeStatsSettings = {
  eyebrow: "Diamond Model đã thực hiện",
  title: "GIÁ TRỊ CHÚNG TÔI ĐÃ TRAO ĐI",
  defaultImage: "/diamond-vn/home/value-customer-01.webp",
  backgroundImage: "",
  metrics: DEFAULT_STATS_METRICS,
};

const cmsBaseUrl = () => CMS_BASE_URL.replace(/\/$/, "");

function normalizeCmsAssetUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/media/")) return `${cmsBaseUrl()}${trimmed}`;
  return trimmed;
}

async function cmsFetchSettings(path: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);

  try {
    const headers = new Headers(init.headers);
    if (CMS_API_KEY) headers.set("x-api-key", CMS_API_KEY);

    const response = await fetch(`${cmsBaseUrl()}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });

    return response.ok ? response : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const normalizeHeroSlide = (value: unknown): HeroSlide | null => {
  if (!value || typeof value !== "object") return null;
  const slide = value as Partial<HeroSlide>;
  if (!slide.url || typeof slide.url !== "string") return null;

  const type = slide.type === "video" || isVideoUrl(slide.url) ? "video" : "image";

  return {
    type,
    url: normalizeCmsAssetUrl(slide.url),
    poster: typeof slide.poster === "string" ? normalizeCmsAssetUrl(slide.poster) : "",
    alt: typeof slide.alt === "string" ? slide.alt : "",
  };
};

const parseHeroSlidesValue = (rawValue?: string) => {
  if (!rawValue) return [];

  const parsed = JSON.parse(rawValue) as unknown;
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map(normalizeHeroSlide)
    .filter((slide): slide is HeroSlide => Boolean(slide));
};

const normalizeStatsMetric = (value: unknown): HomeStatsMetric | null => {
  if (!value || typeof value !== "object") return null;
  const metric = value as Partial<HomeStatsMetric>;
  if (!metric.value && !metric.label) return null;

  return {
    value: typeof metric.value === "string" ? metric.value : "",
    label: typeof metric.label === "string" ? metric.label : "",
    image: typeof metric.image === "string" ? normalizeCmsAssetUrl(metric.image) : "",
  };
};

const parseStatsMetrics = (rawValue?: string) => {
  if (!rawValue) return DEFAULT_STATS_METRICS;

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_STATS_METRICS;

    const metrics = parsed
      .map(normalizeStatsMetric)
      .filter((metric): metric is HomeStatsMetric => Boolean(metric));

    return metrics.length ? metrics : DEFAULT_STATS_METRICS;
  } catch {
    return DEFAULT_STATS_METRICS;
  }
};

export async function getCmsHeroSlides(): Promise<HeroSlide[]> {
  const settings = await getCmsHomeSettings();
  return settings.heroSlides;
}

export async function getCmsHomeSettings(): Promise<CmsHomeSettings> {
  try {
    const response = await cmsFetchSettings("/api/public/settings/home", {
      cache: "no-store",
    });

    if (!response) {
      return { heroSlides: [], mission: DEFAULT_HOME_MISSION, stats: DEFAULT_HOME_STATS };
    }

    const data = (await response.json()) as PublicSettingsResponse;
    const values = data.values || {};

    return {
      heroSlides: parseHeroSlidesValue(values.home_hero_slides),
      mission: {
        badgeImage: normalizeCmsAssetUrl(values.home_mission_badge_image || DEFAULT_HOME_MISSION.badgeImage),
        script: values.home_mission_script || DEFAULT_HOME_MISSION.script,
        title: values.home_mission_title || DEFAULT_HOME_MISSION.title,
        image: normalizeCmsAssetUrl(values.home_mission_image || DEFAULT_HOME_MISSION.image),
        label: values.home_mission_label || DEFAULT_HOME_MISSION.label,
        paragraphs: [
          values.home_mission_paragraph_1 || DEFAULT_HOME_MISSION.paragraphs[0],
          values.home_mission_paragraph_2 || DEFAULT_HOME_MISSION.paragraphs[1],
          values.home_mission_paragraph_3 || DEFAULT_HOME_MISSION.paragraphs[2],
        ].filter(Boolean),
        ctaLabel: values.home_mission_cta_label || DEFAULT_HOME_MISSION.ctaLabel,
        ctaHref: values.home_mission_cta_href || DEFAULT_HOME_MISSION.ctaHref,
        ctaIcon: normalizeCmsAssetUrl(values.home_mission_cta_icon || DEFAULT_HOME_MISSION.ctaIcon),
      },
      stats: {
        eyebrow: values.home_stats_eyebrow || DEFAULT_HOME_STATS.eyebrow,
        title: values.home_stats_title || DEFAULT_HOME_STATS.title,
        defaultImage: normalizeCmsAssetUrl(values.home_stats_default_image || DEFAULT_HOME_STATS.defaultImage),
        backgroundImage: normalizeCmsAssetUrl(values.home_stats_background || DEFAULT_HOME_STATS.backgroundImage),
        metrics: parseStatsMetrics(values.home_stats_metrics),
      },
    };
  } catch {
    return { heroSlides: [], mission: DEFAULT_HOME_MISSION, stats: DEFAULT_HOME_STATS };
  }
}

export async function getCmsContactSettings(): Promise<CmsContactSettings | null> {
  try {
    const response = await cmsFetchSettings("/api/public/settings/contact", {
      cache: "no-store",
    });

    if (!response) return null;

    const data = (await response.json()) as PublicSettingsResponse;
    const values = data.values || {};

    return {
      companyProfileUrl: normalizeCmsAssetUrl(values.company_profile_url || ""),
      companyProfileLabel: values.company_profile_label || "",
      companyProfileNote: values.company_profile_note || "",
    };
  } catch {
    return null;
  }
}

export async function getCmsGeneralSettings(): Promise<CmsGeneralSettings | null> {
  try {
    const response = await cmsFetchSettings("/api/public/settings/general", {
      cache: "no-store",
    });

    if (!response) return null;

    const data = (await response.json()) as PublicSettingsResponse;
    const values = data.values || {};

    return {
      siteLogo: normalizeCmsAssetUrl(values.site_logo || ""),
      siteFavicon: normalizeCmsAssetUrl(values.site_favicon || ""),
      footerBadge: normalizeCmsAssetUrl(values.footer_badge || ""),
      siteName: values.site_name || "",
      aboutPageSlug: values.frontend_about_page_slug || ABOUT_DEMO_VALUE,
    };
  } catch {
    return null;
  }
}

export async function getCmsAboutPageSlug(): Promise<string | null> {
  const generalSettings = await getCmsGeneralSettings();
  const slug = generalSettings?.aboutPageSlug?.trim();

  if (!slug || slug === ABOUT_DEMO_VALUE) return null;
  return slug.replace(/^\/+|\/+$/g, "");
}
