import { NextResponse } from "next/server";
import { deleteCategory, listCategories, upsertCategory } from "@/lib/cms-local-store";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";
import { revalidatePublicSite } from "@/lib/cms-revalidate";
import type { CmsCategoryRecord } from "@/lib/cms-records";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: await listCategories() });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { category?: CmsCategoryRecord } | null;
  if (!body?.category?.name || !body.category.slug) {
    return NextResponse.json({ message: "Thiếu name hoặc slug." }, { status: 400 });
  }
  const data = await upsertCategory(body.category);
  revalidatePublicSite();
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const categoryId = Number(new URL(request.url).searchParams.get("categoryId") || "");
  if (!categoryId) return NextResponse.json({ message: "Thiếu categoryId." }, { status: 400 });
  const data = await deleteCategory(categoryId);
  revalidatePublicSite();
  return NextResponse.json({ data });
}
