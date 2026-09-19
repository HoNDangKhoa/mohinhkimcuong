import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ message: "Thiếu file." }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ message: "File vượt quá 12MB." }, { status: 400 });
  }

  const ext = path.extname(file.name || "").toLowerCase() || ".bin";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf", ".mp4", ".webm"].includes(ext) ? ext : ".bin";
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}${safeExt}`;
  const dir = path.join(process.cwd(), "public", "handover-media", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/handover-media/uploads/${filename}` });
}
