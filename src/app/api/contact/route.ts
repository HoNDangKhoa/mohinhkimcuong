import { addLead } from "@/lib/cms-local-store";
import type { LeadSource } from "@/lib/cms-records";

const CMS_BASE_URL =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "https://cms.looms.vn";

const CMS_API_KEY =
  process.env.CMS_API_KEY ||
  process.env.NEXT_PUBLIC_CMS_API_KEY ||
  "";

const CMS_TIMEOUT_MS = 3500;

type ContactRequestBody = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  source?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cmsUrl(path: string) {
  return `${CMS_BASE_URL.replace(/\/$/, "")}${path}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactRequestBody | null;
  if (!body) {
    return Response.json({ message: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const name = asString(body.name);
  const message = asString(body.message);

  if (!name || !message) {
    return Response.json(
      { message: "Vui lòng nhập họ tên và nội dung cần tư vấn." },
      { status: 400 },
    );
  }

  const rawSource = asString(body.source);
  const source: LeadSource = rawSource === "consultation-popup" ? "consultation-popup" : "contact-page";
  const payload = {
    name,
    email: asString(body.email),
    phone: asString(body.phone),
    subject: asString(body.subject) || "Liên hệ từ website Diamond Model",
    message,
    source,
  };

  await addLead(payload);

  if (!CMS_API_KEY) {
    return Response.json({ ok: true });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_TIMEOUT_MS);

  try {
    await fetch(cmsUrl("/api/public/contacts"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CMS_API_KEY,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    // Lead đã lưu local inbox.
  } finally {
    clearTimeout(timeout);
  }

  return Response.json({ ok: true });
}
