import { NextResponse } from "next/server";
import { listLeads, updateLead } from "@/lib/cms-local-store";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";
import type { LeadStatus } from "@/lib/cms-records";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: await listLeads() });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { id?: string; status?: LeadStatus } | null;
  if (!body?.id || !body.status) {
    return NextResponse.json({ message: "Thiếu id hoặc status." }, { status: 400 });
  }
  const lead = await updateLead(body.id, { status: body.status });
  if (!lead) return NextResponse.json({ message: "Không tìm thấy lead." }, { status: 404 });
  return NextResponse.json({ data: lead });
}
