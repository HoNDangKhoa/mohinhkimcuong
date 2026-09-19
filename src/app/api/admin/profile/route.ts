import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getAdminUser, upsertAdminUser } from "@/lib/cms-local-store";
import type { CmsUserRecord } from "@/lib/cms-records";

function publicProfile(user: CmsUserRecord) {
  return {
    username: user.username,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birthday: user.birthday,
    address: user.address,
    avatarUrl: user.avatarUrl,
  };
}

export async function GET(request: Request) {
  const username = await requireAdmin(request);
  if (!username) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: publicProfile(await getAdminUser(username)) });
}

export async function PUT(request: Request) {
  const username = await requireAdmin(request);
  if (!username) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Partial<CmsUserRecord> | null;
  const current = await getAdminUser(username);
  const next = await upsertAdminUser({
    ...current,
    displayName: typeof body?.displayName === "string" ? body.displayName : current.displayName,
    email: typeof body?.email === "string" ? body.email : current.email,
    phone: typeof body?.phone === "string" ? body.phone : current.phone,
    gender: typeof body?.gender === "string" ? body.gender : current.gender,
    birthday: typeof body?.birthday === "string" ? body.birthday : current.birthday,
    address: typeof body?.address === "string" ? body.address : current.address,
    avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl : current.avatarUrl,
    username: current.username,
  });

  return NextResponse.json({ data: publicProfile(next) });
}
