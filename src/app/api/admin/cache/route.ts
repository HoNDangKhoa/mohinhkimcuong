import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { revalidatePublicSite } from "@/lib/cms-revalidate";

export async function POST(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  revalidatePublicSite();
  return NextResponse.json({ ok: true });
}
