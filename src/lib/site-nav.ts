export type SiteNavItem = {
  label: string;
  href: string;
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Dự án", href: "/du-an" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export function buildSiteNavItems(aboutPageSlug?: string | null): SiteNavItem[] {
  const aboutHref = aboutPageSlug ? `/${aboutPageSlug.replace(/^\/+|\/+$/g, "")}` : "/gioi-thieu";

  return SITE_NAV_ITEMS.map((item) =>
    item.label === "Giới thiệu" ? { ...item, href: aboutHref } : item,
  );
}
