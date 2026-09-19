import { NextResponse } from "next/server";
import { accessStats, clientIp, parseUserAgent } from "@/lib/cms-access";
import { requireAdmin } from "@/lib/cms-auth";
import { addAccessLog, listAccessLogs } from "@/lib/cms-local-store";

export async function GET(request: Request) {
  const username = await requireAdmin(request);
  if (!username) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const now = new Date();
  const month = Number(url.searchParams.get("month") || now.getMonth() + 1);
  const year = Number(url.searchParams.get("year") || now.getFullYear());
  const logs = await listAccessLogs();

  return NextResponse.json({
    data: logs,
    stats: accessStats(logs, month, year),
    month,
    year,
  });
}

export async function POST(request: Request) {
  const username = await requireAdmin(request);
  if (!username) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const ua = parseUserAgent(request.headers.get("user-agent") || "");
  const log = await addAccessLog({
    username,
    ip: clientIp(request),
    device: ua.device,
    browser: ua.browser,
  });

  return NextResponse.json({ data: log });
}
