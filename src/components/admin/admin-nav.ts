import type { AdminIconName } from "@/components/admin/admin-icons";

export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
  icon?: AdminIconName;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  icon: AdminIconName;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "reports",
    label: "Bảng điều khiển",
    icon: "dashboard",
    items: [{ href: "/admin", label: "Bảng điều khiển", exact: true, icon: "dashboard" }],
  },
  {
    id: "content",
    label: "Quản lý bài viết",
    icon: "posts",
    items: [
      { href: "/admin/content/projects", label: "Dự án", icon: "projects" },
      { href: "/admin/content/articles", label: "Tin tức", icon: "articles" },
      { href: "/admin/content/services", label: "Dịch vụ", icon: "services" },
      { href: "/admin/categories", label: "Danh mục", icon: "categories" },
    ],
  },
  {
    id: "pages",
    label: "Quản lý trang tĩnh",
    icon: "pages",
    items: [
      { href: "/admin/home/mission", label: "Slogan sứ mệnh", icon: "mission" },
      { href: "/admin/home/trust", label: "Slogan cam kết", icon: "trust" },
      { href: "/admin/home/projects", label: "Slogan dự án", icon: "homeProjects" },
      { href: "/admin/home/process", label: "Slogan quy trình", icon: "process" },
      { href: "/admin/home/stats", label: "Slogan số liệu", icon: "stats" },
      { href: "/admin/static/gioi-thieu", label: "Giới thiệu", icon: "about" },
      { href: "/admin/static/footer", label: "Footer", icon: "footer" },
    ],
  },
  {
    id: "media",
    label: "Quản lý hình ảnh - video",
    icon: "media",
    items: [
      { href: "/admin/branding/logo", label: "Logo", icon: "logo" },
      { href: "/admin/branding/video", label: "Video mp4", icon: "video" },
      { href: "/admin/branding/favicon", label: "Favicon", icon: "favicon" },
      { href: "/admin/branding/slideshow", label: "Slideshow", icon: "slideshow" },
      { href: "/admin/branding/social", label: "Mạng xã hội Footer", icon: "social" },
      { href: "/admin/media", label: "Thư viện media", icon: "library" },
    ],
  },
  {
    id: "seo",
    label: "Quản lý SEO page",
    icon: "seo",
    items: [
      { href: "/admin/seo/projects", label: "Dự án", icon: "projects" },
      { href: "/admin/seo/services", label: "Dịch vụ", icon: "services" },
      { href: "/admin/seo/articles", label: "Tin tức", icon: "articles" },
    ],
  },
  {
    id: "system",
    label: "Thiết lập thông tin",
    icon: "settings",
    items: [{ href: "/admin/settings", label: "Thiết lập thông tin", exact: true, icon: "settings" }],
  },
  {
    id: "leads",
    label: "Thư liên hệ",
    icon: "contacts",
    items: [{ href: "/admin/contacts", label: "Thư liên hệ", icon: "contacts" }],
  },
];

export const ADMIN_NAV = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

export function isNavActive(pathname: string, item: AdminNavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
