import { NextResponse } from "next/server";
import { getLocalSettings, isSettingsGroup, saveLocalSettings } from "@/lib/cms-local-store";
import { revalidatePublicSite } from "@/lib/cms-revalidate";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";
import type { CmsSettingsMap } from "@/lib/cms-records";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const group = new URL(request.url).searchParams.get("group") || "";
  if (!isSettingsGroup(group)) return NextResponse.json({ message: "group không hợp lệ" }, { status: 400 });
  return NextResponse.json({ values: await getLocalSettings(group) });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { group?: string; values?: CmsSettingsMap; groups?: Partial<Record<string, CmsSettingsMap>> }
    | null;

  if (body?.groups) {
    const saved: Record<string, CmsSettingsMap> = {};
    for (const [group, values] of Object.entries(body.groups)) {
      if (!isSettingsGroup(group) || !values) continue;
      saved[group] = await saveLocalSettings(group, values);
    }
    revalidatePublicSite();
    return NextResponse.json({ values: saved });
  }

  const group = body?.group || "";
  if (!isSettingsGroup(group) || !body?.values) {
    return NextResponse.json({ message: "Thiếu group hoặc values." }, { status: 400 });
  }
  const values = await saveLocalSettings(group, body.values);
  revalidatePublicSite();
  return NextResponse.json({ values });
}
