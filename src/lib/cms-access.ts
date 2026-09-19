import type { CmsAccessLog } from "@/lib/cms-records";

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "127.0.0.1";
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

export const BROWSER_LABELS = ["Chrome", "Microsoft Edge", "Internet Explorer", "Mozilla Firefox", "Safari"] as const;
export type BrowserLabel = (typeof BROWSER_LABELS)[number] | "Khác";

export function parseUserAgent(userAgent: string) {
  const ua = userAgent || "Unknown";
  const device = /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? "Điện thoại" : "Máy tính";
  return { device, browser: ua };
}

export function classifyBrowser(userAgent: string): BrowserLabel {
  const ua = userAgent || "";
  if (/Edg\//i.test(ua)) return "Microsoft Edge";
  if (/MSIE|Trident\//i.test(ua)) return "Internet Explorer";
  if (/Firefox\//i.test(ua)) return "Mozilla Firefox";
  if (/Chrome\//i.test(ua) || /CriOS\//i.test(ua) || /Chromium|Cursor\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua)) return "Safari";
  return "Khác";
}

export function formatAccessTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
  const day = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  return `${time} - ${day}`;
}

export function accessStats(logs: CmsAccessLog[], month: number, year: number) {
  const now = Date.now();
  const startOfMonth = new Date(year, month - 1, 1).getTime();
  const endOfMonth = new Date(year, month, 1).getTime();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const daysInMonth = new Date(year, month, 0).getDate();
  const byDay = Array.from({ length: daysInMonth }, () => 0);

  for (const log of logs) {
    const time = new Date(log.createdAt).getTime();
    if (Number.isNaN(time)) continue;
    if (time >= startOfMonth && time < endOfMonth) {
      byDay[new Date(log.createdAt).getDate() - 1] += 1;
    }
  }

  const monthLogs = logs.filter((log) => {
    const time = new Date(log.createdAt).getTime();
    return time >= startOfMonth && time < endOfMonth;
  });
  const onlineSince = now - 5 * 60 * 1000;
  const onlineKeys = new Set(
    logs
      .filter((log) => now - new Date(log.createdAt).getTime() <= 5 * 60 * 1000 && new Date(log.createdAt).getTime() >= onlineSince)
      .map((log) => `${log.ip}|${log.device}`),
  );

  const browsers = Object.fromEntries(BROWSER_LABELS.map((name) => [name, 0])) as Record<string, number>;
  for (const log of monthLogs) {
    const name = classifyBrowser(log.browser);
    browsers[name] = (browsers[name] || 0) + 1;
  }

  const desktop = monthLogs.filter((log) => log.device !== "Điện thoại").length;
  const phone = monthLogs.filter((log) => log.device === "Điện thoại").length;
  const deviceTotal = desktop + phone;
  const ipCounts = new Map<string, number>();
  for (const log of monthLogs) {
    ipCounts.set(log.ip || "::1", (ipCounts.get(log.ip || "::1") || 0) + 1);
  }

  return {
    online: onlineKeys.size,
    week: logs.filter((log) => new Date(log.createdAt).getTime() >= weekAgo).length,
    month: monthLogs.length,
    total: logs.length,
    byDay,
    browsers: [
      ...BROWSER_LABELS.map((name) => ({ name, count: browsers[name] || 0 })),
      ...(browsers.Khác ? [{ name: "Khác" as const, count: browsers.Khác }] : []),
    ],
    devices: {
      desktop,
      phone,
      desktopPercent: deviceTotal ? Math.round((desktop / deviceTotal) * 100) : 0,
      phonePercent: deviceTotal ? Math.round((phone / deviceTotal) * 100) : 0,
    },
    ips: [...ipCounts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 6)
      .map(([ip, count]) => ({ ip, count })),
  };
}
