import { NextResponse } from "next/server";
import {
  deleteRecord,
  getCollectionRecords,
  upsertRecord,
} from "@/lib/cms-local-store";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";
import { revalidatePublicSite } from "@/lib/cms-revalidate";
import type { CmsContentRecord, CollectionKey } from "@/lib/cms-records";

const KEYS: CollectionKey[] = ["projects", "services", "articles", "pages"];

function isKey(value: string): value is CollectionKey {
  return KEYS.includes(value as CollectionKey);
}

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("collection") || "";
  if (!isKey(key)) return NextResponse.json({ message: "collection không hợp lệ" }, { status: 400 });
  return NextResponse.json({ data: await getCollectionRecords(key) });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { collection?: string; record?: CmsContentRecord }
    | null;
  const key = body?.collection || "";
  if (!isKey(key) || !body?.record?.slug || !body.record.title) {
    return NextResponse.json({ message: "Thiếu collection, title hoặc slug." }, { status: 400 });
  }

  const data = await upsertRecord(key, body.record);
  revalidatePublicSite();
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const key = params.get("collection") || "";
  const slug = params.get("slug") || "";
  if (!isKey(key) || !slug) {
    return NextResponse.json({ message: "Thiếu collection hoặc slug." }, { status: 400 });
  }

  const data = await deleteRecord(key, slug);
  revalidatePublicSite();
  return NextResponse.json({ data });
}
