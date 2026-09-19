import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  sessionCookieName,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/cms-auth";
import { clientIp, parseUserAgent } from "@/lib/cms-access";
import { addAccessLog, defaultAdminUser, listUsers, upsertAdminUser } from "@/lib/cms-local-store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const users = await listUsers();
  const user = users.find((item) => item.username === username);
  const credentials = getAdminCredentials();
  const hashedOk = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
  const envOk = username === credentials.username && password === credentials.password;
  const passwordOk = hashedOk || envOk;

  if (!passwordOk || user?.status === "locked") {
    return NextResponse.json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const profile = user || { ...defaultAdminUser(), username };
  const ua = parseUserAgent(request.headers.get("user-agent") || "");
  await upsertAdminUser({ ...profile, lastLoginAt: new Date().toISOString() });
  await addAccessLog({
    username,
    ip: clientIp(request),
    device: ua.device,
    browser: ua.browser,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName(), await createSessionToken(username), sessionCookieOptions());
  return response;
}
