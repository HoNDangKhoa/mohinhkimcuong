"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";
import { SITE_NAV_ITEMS, type SiteNavItem } from "@/lib/site-nav";

const COMPACT_SCROLL_Y = 120;
const SCROLL_DIRECTION_DELTA = 4;

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6.6 4.7c.6-.6 1.5-.6 2.1 0l1.8 1.8c.5.5.6 1.2.3 1.8l-.8 1.5c1 1.9 2.5 3.4 4.4 4.4l1.5-.8c.6-.3 1.3-.2 1.8.3l1.8 1.8c.6.6.6 1.5 0 2.1l-1 1c-.9.9-2.2 1.2-3.4.8-5.1-1.6-8.9-5.4-10.5-10.5-.4-1.2-.1-2.5.8-3.4l1.2-.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="m20 20-4.6-4.6m2.1-5.2a7.3 7.3 0 1 1-14.6 0 7.3 7.3 0 0 1 14.6 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MenuLines() {
  return (
    <span className="flex w-16 flex-col gap-2" aria-hidden="true">
      <span className="block h-px w-full bg-current" />
      <span className="block h-px w-full bg-current" />
      <span className="block h-px w-full bg-current" />
    </span>
  );
}

function NavItem({
  item,
  className,
  tabIndex,
  onClick,
  active = false,
}: {
  item: SiteNavItem;
  className: string;
  tabIndex: number;
  onClick?: () => void;
  active?: boolean;
}) {
  const sharedProps = {
    className: `${className} ${active ? "text-[#f1cd8a]" : ""}`,
    tabIndex,
    onClick,
  };

  if (item.href.startsWith("/")) {
    return (
      <Link href={item.href} {...sharedProps}>
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} {...sharedProps}>
      {item.label}
    </a>
  );
}

export default function Header({
  logoSrc,
  navItems = SITE_NAV_ITEMS,
}: {
  logoSrc?: string;
  navItems?: SiteNavItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();
  const logo = logoSrc || DIAMOND_VN_COMPANY.logo;

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;
    let initialized = false;

    const updateCompactState = () => {
      frame = 0;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (!initialized) {
        initialized = true;
        setCompact(currentScrollY > COMPACT_SCROLL_Y);
      } else if (currentScrollY <= COMPACT_SCROLL_Y || delta < -SCROLL_DIRECTION_DELTA) {
        setCompact(false);
      } else if (delta > SCROLL_DIRECTION_DELTA) {
        setCompact(true);
      }

      lastScrollY = currentScrollY;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateCompactState);
    };

    frame = window.requestAnimationFrame(updateCompactState);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed right-0 top-0 z-50 h-16 overflow-hidden border-b border-white/10 bg-[#152238]/95 shadow-[0_6px_24px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-[width,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-16 lg:h-[76px] ${
          compact ? "w-[224px] sm:w-[284px] lg:w-[306px]" : "w-full"
        }`}
      >
        <div className="relative h-full w-full">
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              compact
                ? "invisible pointer-events-none -translate-y-2 opacity-0"
                : "visible translate-y-0 opacity-100 delay-100"
            }`}
            aria-hidden={compact}
          >
            <div className="ph-container flex h-full items-center justify-between">
              <Link href="/" className="shrink-0" aria-label="Trang chủ Diamond Model" tabIndex={compact ? -1 : 0}>
                <Image
                  src={logo}
                  alt="Diamond Model"
                  width={160}
                  height={40}
                  priority
                  className="h-9 w-auto lg:h-10"
                />
              </Link>

              <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu chính">
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    tabIndex={compact ? -1 : 0}
                    active={isActive(item.href)}
                    className="text-[16px] font-semibold uppercase tracking-[0.08em] text-white transition hover:text-[#f1cd8a]"
                  />
                ))}
              </nav>

              <div className="hidden items-center gap-3 lg:flex">
                <a
                  href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`}
                  tabIndex={compact ? -1 : 0}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efbf73] text-[#5b746f] transition hover:scale-105"
                  aria-label="Gọi Diamond Model"
                >
                  <PhoneIcon />
                </a>
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  tabIndex={compact ? -1 : 0}
                  className="flex h-14 w-14 items-center justify-center text-white/90 transition hover:text-[#f1cd8a]"
                  aria-label="Mở tìm kiếm"
                >
                  <SearchIcon />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                tabIndex={compact ? -1 : 0}
                className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
                aria-label="Mở menu"
                aria-expanded={menuOpen}
              >
                <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                  <span className="block h-0.5 w-full bg-current" />
                  <span className="block h-0.5 w-full bg-current" />
                  <span className="block h-0.5 w-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-end pr-5 transition-all duration-300 ease-out ${
              compact
                ? "visible translate-x-0 opacity-100 delay-150"
                : "invisible pointer-events-none translate-x-6 opacity-0"
            }`}
            aria-hidden={!compact}
          >
            <a
              href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`}
              className="mr-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#efbf73] text-[#5b746f] transition hover:scale-105 lg:h-14 lg:w-14"
              aria-label="Gọi Diamond Model"
              tabIndex={compact ? 0 : -1}
            >
              <PhoneIcon />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-12 w-20 items-center justify-center text-white/90 transition hover:text-[#f1cd8a] lg:h-14 lg:w-24"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              tabIndex={compact ? 0 : -1}
            >
              <MenuLines />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition ${
          searchOpen ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="ph-container mt-24 max-w-[760px]">
          <div className="rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[44px] uppercase leading-[1.05] text-[#4f4b46]">Tìm kiếm</h2>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-2xl text-[#6b95a2]"
                aria-label="Đóng tìm kiếm"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Nhập thông tin tìm kiếm"
              className="w-full rounded-[8px] border border-[#d8d2c8] px-4 py-3 text-[15px] outline-none placeholder:text-[#9d968d] focus:border-[#6b95a2]"
            />
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[55] bg-[rgba(76,105,114,0.96)] px-6 pb-10 pt-20 text-white transition ${
          menuOpen ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="absolute right-5 top-4 text-3xl"
          aria-label="Đóng menu"
        >
          ×
        </button>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              onClick={() => setMenuOpen(false)}
              active={isActive(item.href)}
              className="text-[16px] font-semibold uppercase tracking-[0.08em] leading-tight"
              tabIndex={0}
            />
          ))}
          <a href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`} className="mt-4 text-lg font-semibold text-[#f1cd8a]">
            {DIAMOND_VN_COMPANY.phone}
          </a>
        </div>
      </div>
    </>
  );
}

