import { DIAMOND_VN_BENEFITS, DIAMOND_VN_COMPANY, DIAMOND_VN_CONTACT } from "@/lib/diamond-vn";
import { getLocalSettings } from "@/lib/cms-local-store";
import { SITE_NAV_ITEMS } from "@/lib/site-nav";

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

export interface HomeTrustItem {
  title: string;
  description: string;
}

export interface HomeTrustSettings {
  title: string;
  image: string;
  items: HomeTrustItem[];
}

export interface HomeProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface HomeProcessSettings {
  eyebrow: string;
  title: string;
  image: string;
  ctaLabel: string;
  steps: HomeProcessStep[];
}

export interface CmsHomeSettings {
  heroSlides: HeroSlide[];
  mission: HomeMissionSettings;
  stats: HomeStatsSettings;
  trust: HomeTrustSettings;
  process: HomeProcessSettings;
}

interface PublicSettingsResponse {
  values?: Record<string, string>;
}

export interface CmsContactSettings {
  companyProfileUrl: string;
  companyProfileLabel: string;
  companyProfileNote: string;
  introTitle: string;
  formLead: string;
  phone: string;
  phoneHref: string;
  email: string;
  serviceHotline: string;
  commitmentsTitle: string;
  commitmentsLabel: string;
  commitmentImage: string;
  commitments: string[];
  addresses: Array<{ title: string; lines: string[]; phone: string; href: string }>;
}

export interface CmsAppearanceSettings {
  navItems: Array<{ label: string; href: string }>;
  footerMarquee: string;
  footerTagline: string;
  policies: Array<{ label: string; href: string }>;
  facebook: string;
  youtube: string;
  floatingCtaLabel: string;
  phone: string;
  phoneHref: string;
  email: string;
  fullName: string;
  addresses: Array<{ title: string; lines: string[]; phone: string; href: string }>;
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
  if (trimmed.startsWith("/media/media-diamond-model/media/")) {
    return `/handover-media/${trimmed.slice("/media/media-diamond-model/media/".length)}`;
  }
  if (trimmed.startsWith("https://media.looms.vn/media-diamond-model/")) {
    return `/handover-media/${trimmed.slice("https://media.looms.vn/media-diamond-model/".length)}`;
  }
  if (trimmed.startsWith("media-external/")) return `/handover-media-external/${trimmed.slice("media-external/".length)}`;
  if (trimmed.startsWith("media/")) return `/handover-media/${trimmed.slice("media/".length)}`;
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

const DEFAULT_HOME_TRUST: HomeTrustSettings = {
  title: "DIAMOND MODEL ĐEM ĐẾN CHO KHÁCH HÀNG",
  image: DIAMOND_VN_COMPANY.trustImage,
  items: DIAMOND_VN_BENEFITS.map((item) => ({ title: item.title, description: item.description })),
};

const DEFAULT_HOME_PROCESS: HomeProcessSettings = {
  eyebrow: "Quy trình thiết kế & thi công sa bàn",
  title: "QUY TRÌNH CHUYÊN NGHIỆP & RÕ RÀNG",
  image: DIAMOND_VN_COMPANY.processThumb,
  ctaLabel: "Đặt lịch KTS tư vấn",
  steps: [
    { step: "01", title: "Tư vấn & khảo sát", description: "Làm rõ mục tiêu trưng bày, tỷ lệ và phạm vi mô hình để chốt hướng triển khai." },
    { step: "02", title: "Thiết kế 3D phối cảnh", description: "Dựng hình trực quan giúp chủ đầu tư duyệt phương án nhanh và chính xác hơn." },
    { step: "03", title: "Thi công sa bàn", description: "Gia công, lắp ráp và hoàn thiện mô hình theo đúng bản vẽ, vật liệu và tiến độ." },
    { step: "04", title: "Bảo trì & bàn giao", description: "Kiểm tra sau bàn giao, hỗ trợ vận hành và xử lý phát sinh trong quá trình trưng bày." },
  ],
};

const DEFAULT_CONTACT: CmsContactSettings = {
  companyProfileUrl: DIAMOND_VN_CONTACT.downloadUrl,
  companyProfileLabel: "Tải hồ sơ năng lực",
  companyProfileNote: "",
  introTitle: DIAMOND_VN_CONTACT.introTitle,
  formLead: DIAMOND_VN_CONTACT.formLead,
  phone: DIAMOND_VN_COMPANY.phone,
  phoneHref: DIAMOND_VN_COMPANY.phoneHref,
  email: DIAMOND_VN_COMPANY.email,
  serviceHotline: DIAMOND_VN_CONTACT.serviceHotline,
  commitmentsTitle: DIAMOND_VN_CONTACT.commitmentsTitle,
  commitmentsLabel: DIAMOND_VN_CONTACT.commitmentsLabel,
  commitmentImage: DIAMOND_VN_CONTACT.commitmentImage,
  commitments: [...DIAMOND_VN_CONTACT.commitments],
  addresses: DIAMOND_VN_COMPANY.addresses.map((item) => ({ ...item, lines: [...item.lines] })),
};

function parseJsonArray<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

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
  const empty = {
    heroSlides: [] as HeroSlide[],
    mission: DEFAULT_HOME_MISSION,
    stats: DEFAULT_HOME_STATS,
    trust: DEFAULT_HOME_TRUST,
    process: DEFAULT_HOME_PROCESS,
  };

  try {
    const [response, local] = await Promise.all([
      cmsFetchSettings("/api/public/settings/home", { cache: "no-store" }),
      getLocalSettings("home"),
    ]);

    const loom = response ? ((await response.json()) as PublicSettingsResponse).values || {} : {};
    const values = { ...loom, ...local };
    const slides = parseHeroSlidesValue(values.home_hero_slides);
    const videoUrl = values.home_hero_video_url?.trim();
    const heroSlides =
      videoUrl && !slides.some((slide) => slide.url === normalizeCmsAssetUrl(videoUrl))
        ? [
            {
              type: "video" as const,
              url: normalizeCmsAssetUrl(videoUrl),
              poster: normalizeCmsAssetUrl(values.home_hero_poster || ""),
              alt: "Diamond Model",
            },
            ...slides,
          ]
        : slides;

    return {
      heroSlides,
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
        metrics: parseStatsMetrics(values.home_stats_metrics || values.home_values),
      },
      trust: {
        title: values.home_trust_title || DEFAULT_HOME_TRUST.title,
        image: normalizeCmsAssetUrl(values.home_trust_image || DEFAULT_HOME_TRUST.image),
        items: parseJsonArray(values.home_trust_items, DEFAULT_HOME_TRUST.items),
      },
      process: {
        eyebrow: values.home_process_eyebrow || DEFAULT_HOME_PROCESS.eyebrow,
        title: values.home_process_title || DEFAULT_HOME_PROCESS.title,
        image: normalizeCmsAssetUrl(
          values.home_process_image || values.home_process_desktop || values.home_process_thumb || DEFAULT_HOME_PROCESS.image,
        ),
        ctaLabel: values.home_process_cta_label || DEFAULT_HOME_PROCESS.ctaLabel,
        steps: parseJsonArray(values.home_process_steps, DEFAULT_HOME_PROCESS.steps),
      },
    };
  } catch {
    return empty;
  }
}

export async function getCmsContactSettings(): Promise<CmsContactSettings> {
  try {
    const [response, local] = await Promise.all([
      cmsFetchSettings("/api/public/settings/contact", { cache: "no-store" }),
      getLocalSettings("contact"),
    ]);
    const loom = response ? ((await response.json()) as PublicSettingsResponse).values || {} : {};
    const values = { ...loom, ...local };

    const phone = values.company_phone || values.contact_hotline || values.contact_phone || DEFAULT_CONTACT.phone;
    return {
      companyProfileUrl: normalizeCmsAssetUrl(values.company_profile_url || DEFAULT_CONTACT.companyProfileUrl),
      companyProfileLabel: values.company_profile_label || DEFAULT_CONTACT.companyProfileLabel,
      companyProfileNote: values.company_profile_note || DEFAULT_CONTACT.companyProfileNote,
      introTitle: values.contact_intro_title || DEFAULT_CONTACT.introTitle,
      formLead: values.contact_form_lead || DEFAULT_CONTACT.formLead,
      phone,
      phoneHref: phone.replace(/\s/g, ""),
      email: values.company_email || values.contact_email || DEFAULT_CONTACT.email,
      serviceHotline: values.contact_service_hotline || values.contact_hotline || DEFAULT_CONTACT.serviceHotline,
      commitmentsTitle: values.contact_commitments_title || DEFAULT_CONTACT.commitmentsTitle,
      commitmentsLabel: values.contact_commitments_label || DEFAULT_CONTACT.commitmentsLabel,
      commitmentImage: normalizeCmsAssetUrl(values.contact_commitment_image || DEFAULT_CONTACT.commitmentImage),
      commitments: parseJsonArray(values.contact_commitments, DEFAULT_CONTACT.commitments),
      addresses: parseContactAddresses(values.company_addresses || values.contact_address, DEFAULT_CONTACT.addresses),
    };
  } catch {
    return DEFAULT_CONTACT;
  }
}

export async function getCmsGeneralSettings(): Promise<CmsGeneralSettings | null> {
  try {
    const [response, local] = await Promise.all([
      cmsFetchSettings("/api/public/settings/general", { cache: "no-store" }),
      getLocalSettings("general"),
    ]);
    const loom = response ? ((await response.json()) as PublicSettingsResponse).values || {} : {};
    const values = { ...loom, ...local };
    if (!Object.keys(values).length) return null;

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

function parseContactAddresses(
  raw: string | undefined,
  fallback: CmsContactSettings["addresses"],
): CmsContactSettings["addresses"] {
  if (raw?.trim().startsWith("[")) return parseJsonArray(raw, fallback);
  if (!raw?.trim()) return fallback;

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

  return addresses.length ? addresses : fallback;
}

export async function getCmsAppearanceSettings(): Promise<CmsAppearanceSettings> {
  const contact = await getCmsContactSettings();
  const [local, social, general] = await Promise.all([
    getLocalSettings("appearance"),
    getLocalSettings("social"),
    getLocalSettings("general"),
  ]);

  return {
    navItems: parseJsonArray(local.nav_items, SITE_NAV_ITEMS.map((item) => ({ ...item }))),
    footerMarquee: local.footer_marquee || "TRÒ CHUYỆN CÙNG KIẾN TRÚC SƯ",
    footerTagline: local.footer_tagline || "BẠN CẦN 1 ĐƠN VỊ NỘI THẤT CHUYÊN NGHIỆP?",
    policies: parseJsonArray(local.footer_policies, DIAMOND_VN_COMPANY.policies.map((item) => ({ ...item }))),
    facebook: local.social_facebook || social.facebook_url || DIAMOND_VN_COMPANY.facebook,
    youtube: local.social_youtube || social.youtube_url || DIAMOND_VN_COMPANY.youtube,
    floatingCtaLabel: local.floating_cta_label || "ĐẶT LỊCH KTS TƯ VẤN",
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.email,
    fullName: general.company_full_name || DIAMOND_VN_COMPANY.fullName,
    addresses: contact.addresses,
  };
}

export async function getCmsAboutPageSlug(): Promise<string | null> {
  const generalSettings = await getCmsGeneralSettings();
  const slug = generalSettings?.aboutPageSlug?.trim();

  if (!slug || slug === ABOUT_DEMO_VALUE) return null;
  return slug.replace(/^\/+|\/+$/g, "");
}
