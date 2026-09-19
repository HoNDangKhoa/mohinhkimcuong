/**
 * Hợp đồng cấu trúc CMS Diamond Model.
 * Khớp field website đang đọc trong cms-content.ts / cms-settings.ts / cms-seo.ts.
 * CMS thay thế LOOM chỉ cần trả đúng key + endpoint dưới đây.
 */

export type CmsFieldType =
  | "text"
  | "slug"
  | "textarea"
  | "richtext"
  | "image"
  | "video"
  | "url"
  | "boolean"
  | "select"
  | "date"
  | "tags"
  | "repeater"
  | "json";

export type CmsFieldSpec = {
  key: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  options?: string[];
  itemFields?: CmsFieldSpec[];
  note?: string;
};

export type CmsFormGroup = {
  id: string;
  label: string;
  fields: CmsFieldSpec[];
};

export type CmsListColumn = {
  key: string;
  label: string;
};

export type CmsFilterSpec = {
  key: string;
  label: string;
  type: "search" | "select" | "date-range" | "boolean";
  options?: string[];
};

export const CMS_CONTENT_STATUSES = ["draft", "review", "published", "archived"] as const;
export const CMS_LEAD_STATUSES = ["new", "processing", "done", "read"] as const;
export const CMS_LEAD_SOURCES = ["contact-page", "consultation-popup"] as const;

export const CMS_PROJECT_CATEGORIES = [
  "Sa bàn kiến trúc",
  "Mô hình kiến trúc",
  "Quy hoạch",
  "Chung cư cao cấp",
  "Biệt thự / nhà phố",
  "Nhà máy",
  "Nội thất",
] as const;

const SHARED_CONTENT_FIELDS: CmsFieldSpec[] = [
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "slug", label: "Slug URL", type: "slug", required: true, note: "Khớp /du-an/:slug, /dich-vu/:slug, /tin-tuc/:slug" },
  { key: "excerpt", label: "Tóm tắt", type: "textarea", note: "Card archive + meta description fallback" },
  { key: "content", label: "Nội dung HTML", type: "richtext", required: true },
  { key: "thumbnailUrl", label: "Ảnh thumbnail", type: "image" },
  { key: "heroImageUrl", label: "Ảnh hero", type: "image" },
  { key: "category", label: "Chuyên mục", type: "select" },
  { key: "tags", label: "Tags", type: "tags" },
  { key: "isFeatured", label: "Nổi bật trang chủ", type: "boolean" },
  { key: "publishedAt", label: "Ngày xuất bản", type: "date" },
  { key: "seoTitle", label: "SEO title", type: "text" },
  { key: "seoDescription", label: "SEO description", type: "textarea" },
  { key: "seoKeywords", label: "SEO keywords", type: "text" },
  { key: "canonicalUrl", label: "Canonical URL", type: "url" },
  { key: "indexable", label: "Indexable", type: "boolean" },
  { key: "sortOrder", label: "Thứ tự", type: "text" },
  { key: "categoryId", label: "categoryId", type: "text" },
];

const LIST_SHELL_ACTIONS = [
  "Đổi trạng thái hàng loạt",
  "Bản ghi mới",
  "Xuất Excel",
  "Làm mới trang",
] as const;

const SHARED_LIST_FILTERS: CmsFilterSpec[] = [
  { key: "q", label: "Tiêu đề / slug", type: "search" },
  { key: "status", label: "Trạng thái", type: "select", options: [...CMS_CONTENT_STATUSES] },
  { key: "featured", label: "Nổi bật", type: "boolean" },
  { key: "date", label: "Ngày đăng", type: "date-range" },
];

const SHARED_LIST_COLUMNS: CmsListColumn[] = [
  { key: "index", label: "STT" },
  { key: "status", label: "Trạng thái" },
  { key: "info", label: "Thông tin bản ghi" },
  { key: "category", label: "Chuyên mục" },
  { key: "featured", label: "Nổi bật" },
  { key: "updatedAt", label: "Cập nhật" },
  { key: "actions", label: "Thao tác" },
];

export const CMS_COLLECTIONS = {
  projects: {
    id: "projects",
    label: "Dự án",
    menuGroup: "Nội dung website",
    sitePaths: ["/du-an", "/du-an/[slug]"],
    publicList: "GET /api/public/projects?limit=100",
    publicDetail: "GET /api/public/projects/:slug",
    actions: LIST_SHELL_ACTIONS,
    filters: [
      ...SHARED_LIST_FILTERS,
      { key: "category", label: "Chuyên mục", type: "select", options: [...CMS_PROJECT_CATEGORIES] },
    ] satisfies CmsFilterSpec[],
    columns: [
      ...SHARED_LIST_COLUMNS.slice(0, 4),
      { key: "client", label: "Khách hàng" },
      { key: "scale", label: "Tỷ lệ" },
      ...SHARED_LIST_COLUMNS.slice(4),
    ] satisfies CmsListColumn[],
    formGroups: [
      { id: "content", label: "Nội dung", fields: SHARED_CONTENT_FIELDS },
      {
        id: "project",
        label: "Thông tin dự án",
        fields: [
          { key: "client", label: "Khách hàng", type: "text" },
          { key: "location", label: "Địa điểm", type: "text" },
          { key: "area", label: "Diện tích", type: "text" },
          { key: "scale", label: "Tỷ lệ", type: "text", note: "Ví dụ 1/250 — hiện trên card trang chủ" },
          { key: "materials", label: "Vật liệu", type: "text" },
          { key: "completedAt", label: "Ngày hoàn thành", type: "date" },
          {
            key: "gallery",
            label: "Gallery",
            type: "repeater",
            itemFields: [
              { key: "mediaUrl", label: "Ảnh", type: "image", required: true },
              { key: "section", label: "Vùng", type: "select", options: ["hero", "gallery"] },
              { key: "altText", label: "Alt", type: "text" },
            ],
          },
        ],
      },
    ] satisfies CmsFormGroup[],
  },
  services: {
    id: "services",
    label: "Dịch vụ",
    menuGroup: "Nội dung website",
    sitePaths: ["/dich-vu", "/dich-vu/[slug]"],
    publicList: "GET /api/public/services?limit=100",
    publicDetail: "GET /api/public/services/:slug",
    actions: LIST_SHELL_ACTIONS,
    filters: SHARED_LIST_FILTERS,
    columns: SHARED_LIST_COLUMNS,
    formGroups: [{ id: "content", label: "Nội dung", fields: SHARED_CONTENT_FIELDS }],
  },
  articles: {
    id: "articles",
    label: "Tin tức",
    menuGroup: "Nội dung website",
    sitePaths: ["/tin-tuc", "/tin-tuc/[slug]"],
    publicList: "GET /api/public/articles?limit=100",
    publicDetail: "GET /api/public/articles/:slug",
    actions: LIST_SHELL_ACTIONS,
    filters: SHARED_LIST_FILTERS,
    columns: SHARED_LIST_COLUMNS,
    formGroups: [{ id: "content", label: "Nội dung", fields: SHARED_CONTENT_FIELDS }],
  },
  pages: {
    id: "pages",
    label: "Trang tĩnh",
    menuGroup: "Nội dung website",
    sitePaths: ["/gioi-thieu", "/[slug]"],
    publicList: "GET /api/public/pages?limit=100",
    publicDetail: "GET /api/public/pages/:slug",
    actions: LIST_SHELL_ACTIONS,
    filters: [
      { key: "q", label: "Tiêu đề / slug", type: "search" },
      { key: "status", label: "Trạng thái", type: "select", options: [...CMS_CONTENT_STATUSES] },
    ],
    columns: [
      { key: "index", label: "STT" },
      { key: "status", label: "Trạng thái" },
      { key: "info", label: "Thông tin trang" },
      { key: "slug", label: "Slug" },
      { key: "updatedAt", label: "Cập nhật" },
      { key: "actions", label: "Thao tác" },
    ],
    formGroups: [
      {
        id: "page",
        label: "Trang tĩnh",
        fields: [
          { key: "title", label: "Tiêu đề", type: "text", required: true },
          { key: "slug", label: "Slug", type: "slug", required: true },
          { key: "content", label: "Nội dung HTML", type: "richtext", required: true },
          { key: "ogImage", label: "OG / hero", type: "image" },
          { key: "seoTitle", label: "SEO title", type: "text" },
          { key: "seoDescription", label: "SEO description", type: "textarea" },
        ],
      },
    ],
  },
} as const;

export const CMS_HOME_SECTIONS = [
  {
    id: "hero",
    label: "Hero",
    status: "cms",
    frontend: "HeroSection",
    keys: [
      { key: "home_hero_slides", label: "Slides", type: "json", note: "[{ type: image|video, url, poster, alt }]" },
      { key: "home_hero_poster", label: "Poster", type: "image" },
      { key: "home_hero_video_url", label: "Video hero", type: "video" },
    ],
  },
  {
    id: "mission",
    label: "Sứ mệnh",
    status: "cms",
    frontend: "MissionSection",
    keys: [
      { key: "home_mission_badge_image", label: "Badge", type: "image" },
      { key: "home_mission_script", label: "Eyebrow", type: "text" },
      { key: "home_mission_title", label: "Tiêu đề", type: "text" },
      { key: "home_mission_image", label: "Ảnh", type: "image" },
      { key: "home_mission_label", label: "Nhãn cột chữ", type: "text" },
      { key: "home_mission_paragraph_1", label: "Đoạn 1", type: "textarea" },
      { key: "home_mission_paragraph_2", label: "Đoạn 2", type: "textarea" },
      { key: "home_mission_paragraph_3", label: "Đoạn 3", type: "textarea" },
      { key: "home_mission_cta_label", label: "CTA", type: "text" },
      { key: "home_mission_cta_href", label: "CTA href", type: "url" },
      { key: "home_mission_cta_icon", label: "CTA icon", type: "image" },
    ],
  },
  {
    id: "trust",
    label: "Cam kết",
    status: "hardcode",
    frontend: "TrustSection",
    keys: [
      { key: "home_trust_title", label: "Tiêu đề", type: "text" },
      { key: "home_trust_image", label: "Ảnh nền", type: "image" },
      { key: "home_trust_items", label: "4 cam kết", type: "json", note: "[{ title, description }]" },
    ],
  },
  {
    id: "projects",
    label: "Dự án nổi bật",
    status: "cms",
    frontend: "ProjectsSection",
    keys: [
      { key: "home_projects_eyebrow", label: "Eyebrow", type: "text" },
      { key: "home_projects_title", label: "Tiêu đề", type: "text" },
      { key: "home_projects_cta", label: "CTA", type: "text" },
    ],
  },
  {
    id: "process",
    label: "Quy trình",
    status: "hardcode",
    frontend: "ProcessSection",
    keys: [
      { key: "home_process_eyebrow", label: "Eyebrow", type: "text" },
      { key: "home_process_title", label: "Tiêu đề", type: "text" },
      { key: "home_process_image", label: "Ảnh", type: "image" },
      { key: "home_process_desktop", label: "Ảnh desktop (LOOM)", type: "image" },
      { key: "home_process_mobile", label: "Ảnh mobile (LOOM)", type: "image" },
      { key: "home_process_thumb", label: "Ảnh thumb (LOOM)", type: "image" },
      { key: "home_process_steps", label: "4 bước", type: "json", note: "[{ step, title, description }]" },
      { key: "home_process_cta_label", label: "CTA", type: "text" },
    ],
  },
  {
    id: "stats",
    label: "Số liệu",
    status: "cms",
    frontend: "StatsSection",
    keys: [
      { key: "home_stats_eyebrow", label: "Eyebrow", type: "text" },
      { key: "home_stats_title", label: "Tiêu đề", type: "text" },
      { key: "home_stats_default_image", label: "Ảnh mặc định", type: "image" },
      { key: "home_stats_background", label: "Ảnh nền", type: "image" },
      { key: "home_stats_metrics", label: "Metrics", type: "json", note: "[{ value, label, image }]" },
      { key: "home_values", label: "home_values (LOOM alias)", type: "json" },
      { key: "home_completed_logos", label: "Logo đã hoàn thành", type: "json" },
      { key: "home_press_logos", label: "Logo báo chí", type: "json" },
      { key: "home_videos", label: "Video trang chủ", type: "json" },
    ],
  },
  {
    id: "services",
    label: "Carousel dịch vụ",
    status: "cms",
    frontend: "VideosSection",
    keys: [{ key: "isFeatured on services", label: "Lấy từ collection dịch vụ", type: "boolean" }],
  },
] as const;

export const CMS_SETTING_GROUPS = {
  general: {
    endpoint: "GET /api/public/settings/general",
    fields: [
      { key: "site_logo", label: "Logo", type: "image" },
      { key: "site_favicon", label: "Favicon", type: "image" },
      { key: "footer_badge", label: "Badge tín nhiệm", type: "image" },
      { key: "site_name", label: "Tên site", type: "text" },
      { key: "company_full_name", label: "Tên pháp lý", type: "text" },
      { key: "site_description", label: "Mô tả site", type: "textarea" },
      { key: "frontend_about_page_slug", label: "Slug trang Giới thiệu", type: "slug" },
    ],
  },
  contact: {
    endpoint: "GET /api/public/settings/contact",
    fields: [
      { key: "company_profile_url", label: "Hồ sơ năng lực", type: "url" },
      { key: "company_profile_label", label: "Nhãn nút hồ sơ", type: "text" },
      { key: "company_profile_note", label: "Ghi chú hồ sơ", type: "textarea" },
      { key: "company_phone", label: "Hotline", type: "text" },
      { key: "company_email", label: "Email", type: "text" },
      { key: "contact_phone", label: "contact_phone (LOOM)", type: "text" },
      { key: "contact_hotline", label: "contact_hotline (LOOM)", type: "text" },
      { key: "contact_email", label: "contact_email (LOOM)", type: "text" },
      { key: "company_addresses", label: "Địa chỉ JSON", type: "json", note: "[{ title, lines, phone }]" },
      { key: "contact_address", label: "Địa chỉ text (LOOM)", type: "textarea" },
      { key: "google_maps_url", label: "Google Maps", type: "url" },
      { key: "contact_intro_title", label: "Tiêu đề /lien-he", type: "text" },
      { key: "contact_form_lead", label: "Lead form", type: "textarea" },
      { key: "contact_commitments", label: "6 cam kết", type: "json" },
    ],
  },
  appearance: {
    endpoint: "GET /api/public/settings/appearance",
    fields: [
      { key: "nav_items", label: "Menu", type: "json" },
      { key: "footer_marquee", label: "Marquee footer", type: "text" },
      { key: "footer_policies", label: "Chính sách footer", type: "json" },
      { key: "social_facebook", label: "Facebook", type: "url" },
      { key: "social_youtube", label: "YouTube", type: "url" },
      { key: "social_zalo", label: "Zalo", type: "url" },
      { key: "social_instagram", label: "Instagram", type: "url" },
      { key: "floating_cta_label", label: "CTA nổi", type: "text" },
    ],
  },
  seo: {
    endpoint: "GET /api/public/settings/seo",
    fields: [
      { key: "seo_title", label: "Title mặc định", type: "text" },
      { key: "seo_description", label: "Description mặc định", type: "textarea" },
      { key: "seo_keywords", label: "Keywords", type: "text" },
      { key: "seo_site_url", label: "Site URL", type: "url" },
      { key: "seo_default_og_image", label: "OG image mặc định", type: "image" },
      { key: "seo_organization_name", label: "Organization", type: "text" },
      { key: "seo_organization_logo", label: "Organization logo", type: "image" },
      { key: "seo_phone", label: "SEO phone", type: "text" },
      { key: "seo_email", label: "SEO email", type: "text" },
      { key: "seo_schema_type", label: "Schema type", type: "text" },
      { key: "seo_business_type", label: "Business type", type: "text" },
      { key: "seo_address_street", label: "Street", type: "text" },
      { key: "seo_address_city", label: "City", type: "text" },
      { key: "seo_address_region", label: "Region", type: "text" },
      { key: "seo_address_postal", label: "Postal", type: "text" },
      { key: "seo_address_country", label: "Country", type: "text" },
      { key: "seo_geo_lat", label: "Lat", type: "text" },
      { key: "seo_geo_lng", label: "Lng", type: "text" },
      { key: "seo_opening_hours", label: "Opening hours", type: "text" },
      { key: "seo_price_range", label: "Price range", type: "text" },
      { key: "seo_social_profiles", label: "Social profiles", type: "json" },
      { key: "seo_robots_txt", label: "robots.txt", type: "textarea" },
      { key: "seo_llms_summary", label: "llms summary", type: "textarea" },
      { key: "seo_llms_full_intro", label: "llms intro", type: "textarea" },
      { key: "seo_path_projects", label: "Path projects", type: "text" },
      { key: "seo_path_services", label: "Path services", type: "text" },
      { key: "seo_path_articles", label: "Path articles", type: "text" },
      { key: "seo_path_products", label: "Path products", type: "text" },
      { key: "seo_default_schema_article", label: "Default article schema", type: "json" },
      { key: "seo_default_schema_page", label: "Default page schema", type: "json" },
      { key: "seo_default_schema_product", label: "Default product schema", type: "json" },
    ],
  },
  social: {
    endpoint: "GET /api/public/settings/social",
    fields: [
      { key: "facebook_url", label: "Facebook", type: "url" },
      { key: "youtube_url", label: "YouTube", type: "url" },
      { key: "zalo_url", label: "Zalo", type: "url" },
      { key: "instagram_url", label: "Instagram", type: "url" },
    ],
  },
  analytics: {
    endpoint: "GET /api/public/settings/analytics",
    fields: [
      { key: "google_analytics_id", label: "GA ID", type: "text" },
      { key: "ga4_property_id", label: "GA4 property", type: "text" },
      { key: "google_site_verification", label: "Site verification", type: "text" },
      { key: "google_search_console_site_url", label: "Search Console URL", type: "url" },
      { key: "ga4_service_account_json", label: "GA4 service account", type: "textarea" },
    ],
  },
  booking: {
    endpoint: "GET /api/public/settings/booking",
    fields: [
      { key: "booking_notification_email", label: "Email nhận booking", type: "text" },
      { key: "booking_send_customer_email", label: "Gửi mail khách", type: "text" },
      { key: "booking_customer_confirmation_reply_email", label: "Reply-to", type: "text" },
      { key: "booking_lead_forward_user_ids", label: "Forward user IDs", type: "text" },
      { key: "booking_rules", label: "Booking rules", type: "json" },
    ],
  },
} as const;

export const CMS_LEAD_SPEC = {
  id: "contacts",
  label: "Liên hệ & lead",
  write: "POST /api/public/contacts",
  read: "GET /api/admin/contacts — chưa có, website mới ghi",
  sources: CMS_LEAD_SOURCES,
  statuses: CMS_LEAD_STATUSES,
  actions: ["Đổi trạng thái hàng loạt", "Xuất Excel", "Làm mới trang"],
  filters: [
    { key: "q", label: "Tên / SĐT / email", type: "search" },
    { key: "source", label: "Nguồn", type: "select", options: [...CMS_LEAD_SOURCES] },
    { key: "status", label: "Trạng thái", type: "select", options: [...CMS_LEAD_STATUSES] },
    { key: "date", label: "Ngày gửi", type: "date-range" },
  ] satisfies CmsFilterSpec[],
  columns: [
    { key: "index", label: "STT" },
    { key: "status", label: "Trạng thái" },
    { key: "name", label: "Khách hàng" },
    { key: "source", label: "Nguồn" },
    { key: "message", label: "Nội dung" },
    { key: "createdAt", label: "Ngày" },
    { key: "actions", label: "Thao tác" },
  ] satisfies CmsListColumn[],
  fields: [
    { key: "name", label: "Họ tên", type: "text", required: true },
    { key: "phone", label: "Điện thoại", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "subject", label: "Chủ đề", type: "text" },
    { key: "message", label: "Nội dung", type: "textarea", required: true },
    { key: "source", label: "Nguồn", type: "select", options: [...CMS_LEAD_SOURCES] },
  ] satisfies CmsFieldSpec[],
} as const;

export const CMS_SIDEBAR = [
  { id: "reports", label: "Báo cáo", children: ["Tổng quan"] },
  {
    id: "content",
    label: "Nội dung website",
    children: ["Dự án", "Dịch vụ", "Tin tức", "Trang tĩnh", "Chuyên mục"],
  },
  {
    id: "home",
    label: "Trang chủ",
    children: CMS_HOME_SECTIONS.map((section) => section.label),
  },
  { id: "leads", label: "Liên hệ & lead", children: ["Inbox", "Hồ sơ năng lực"] },
  { id: "appearance", label: "Giao diện", children: ["Thương hiệu", "Menu", "Footer", "CTA nổi"] },
  { id: "seo", label: "SEO", children: ["Cài đặt chung", "Metadata trang", "Sitemap / robots / llms"] },
  { id: "media", label: "Thư viện media", children: ["Ảnh", "Video", "PDF"] },
  { id: "system", label: "Quản trị hệ thống", children: ["Người dùng", "Vai trò", "Nhật ký", "API key"] },
] as const;

export const CMS_ROLES = [
  { id: "admin", label: "Super Admin", scope: "Toàn quyền" },
  { id: "editor", label: "Editor", scope: "CRUD nội dung + xuất bản" },
  { id: "seo", label: "SEO", scope: "Metadata, sitemap, OG" },
  { id: "sale", label: "Sale", scope: "Inbox lead + xem dự án/dịch vụ" },
  { id: "viewer", label: "Viewer", scope: "Chỉ đọc" },
] as const;
