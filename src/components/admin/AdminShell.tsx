"use client";

import {
  ArrowPathIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronRightIcon,
  ClockIcon,
  LockClosedIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminIcon } from "@/components/admin/admin-icons";
import { ADMIN_NAV_GROUPS, isNavActive } from "@/components/admin/admin-nav";

export default function AdminShell({
  children,
  username,
  displayName,
  avatarUrl,
}: {
  children: React.ReactNode;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cacheMessage, setCacheMessage] = useState("");
  const greeting = displayName || username;

  const openGroups = useMemo(() => {
    return new Set(
      ADMIN_NAV_GROUPS.filter((group) => group.items.some((item) => isNavActive(pathname, item))).map((group) => group.id),
    );
  }, [pathname]);

  const [expanded, setExpanded] = useState<Set<string>>(openGroups);

  useEffect(() => {
    void fetch("/api/admin/access-logs", { method: "POST" });
  }, [pathname]);

  function toggleGroup(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function clearCache() {
    setMenuOpen(false);
    const response = await fetch("/api/admin/cache", { method: "POST" });
    setCacheMessage(response.ok ? "Đã xóa bộ nhớ tạm." : "Không xóa được bộ nhớ tạm.");
    router.refresh();
    window.setTimeout(() => setCacheMessage(""), 2500);
  }

  return (
    <div className="cms-admin min-h-screen bg-white text-gray-800">
      {mobileOpen ? (
        <button type="button" aria-label="Đóng menu" className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[250px] border-r border-gray-200 bg-white ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[70px] items-center gap-2 px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/diamondmodel/brand/logo-diamondmodel.png" alt="Diamond Model" className="h-9 w-auto object-contain" />
        </div>
        <nav className="space-y-1 overflow-y-auto px-3 pb-6" aria-label="CMS">
          {ADMIN_NAV_GROUPS.map((group) => {
            const opened = expanded.has(group.id) || group.items.some((item) => isNavActive(pathname, item));
            const single = group.items.length === 1;
            const only = group.items[0];
            if (single && only) {
              const active = isNavActive(pathname, only);
              return (
                <Link
                  key={group.id}
                  href={only.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] ${
                    active ? "bg-amber-500 font-semibold text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <AdminIcon name={only.icon || group.icon} className={`h-4 w-4 ${active ? "text-white" : "text-amber-500"}`} />
                  <span>{group.label}</span>
                </Link>
              );
            }
            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50"
                >
                  <AdminIcon name={group.icon} className="h-4 w-4 text-amber-500" />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronRightIcon className={`h-3.5 w-3.5 text-gray-300 transition ${opened ? "rotate-90" : ""}`} />
                </button>
                {opened ? (
                  <div className="mt-0.5 space-y-0.5 pl-2">
                    {group.items.map((item) => {
                      const active = isNavActive(pathname, item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] ${
                            active ? "bg-amber-500 font-semibold text-white" : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {item.icon ? (
                            <AdminIcon name={item.icon} className={`h-3.5 w-3.5 ${active ? "text-white" : "text-amber-400"}`} />
                          ) : null}
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-gray-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-50"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <p className="text-[14px] text-gray-700">Xin chào, {greeting}!</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="rounded-md p-2 text-gray-400 hover:bg-gray-50" aria-label="Về trang web chính" title="Về trang web chính">
              <ArrowPathIcon className="h-5 w-5" />
            </a>
            <Link href="/admin/contacts" className="relative rounded-md p-2 text-gray-400 hover:bg-gray-50" aria-label="Thông báo">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Link>
            <Link href="/lien-he" className="rounded-md p-2 text-gray-400 hover:bg-gray-50" aria-label="Liên hệ website" title="Liên hệ website">
              <PhoneIcon className="h-5 w-5" />
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="flex items-center gap-2 rounded-md py-1 pl-1 pr-3 hover:bg-gray-50"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-8 w-8 rounded-md object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-[12px] font-semibold text-white">
                    {greeting.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="hidden text-left text-[12px] leading-tight sm:block">
                  <span className="block text-gray-400">Nhà quản trị</span>
                  <span className="font-medium text-gray-700">{greeting}</span>
                </span>
              </button>
              {menuOpen ? (
                <>
                  <button type="button" className="fixed inset-0 z-20" aria-label="Đóng menu tài khoản" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-[13px] shadow-sm">
                    <Link
                      href="/admin/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4" />
                      Thông tin admin
                    </Link>
                    <Link
                      href="/admin/account/password"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      Đổi mật khẩu
                    </Link>
                    <Link
                      href="/admin/access-logs"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Lịch sử truy cập
                    </Link>
                    <button
                      type="button"
                      onClick={() => void clearCache()}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Xóa bộ nhớ tạm
                    </button>
                    <div className="my-1 border-t border-gray-200" />
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-gray-50"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </header>
        {cacheMessage ? (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-[13px] text-amber-700">{cacheMessage}</div>
        ) : null}
        <div className="min-h-[calc(100vh-70px)] bg-gray-50 px-5 py-5 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
