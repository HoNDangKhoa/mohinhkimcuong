import { NextResponse } from "next/server";
import { getAdminCredentials, hashPassword, requireAdmin, verifyPassword } from "@/lib/cms-auth";
import { getAdminUser, upsertAdminUser } from "@/lib/cms-local-store";

export async function POST(request: Request) {
  const username = await requireAdmin(request);
  if (!username) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    currentPassword?: unknown;
    newPassword?: unknown;
    confirmPassword?: unknown;
  } | null;

  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Vui lòng nhập đủ mật khẩu." }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ message: "Mật khẩu mới phải từ 6 ký tự." }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ message: "Nhập lại mật khẩu không khớp." }, { status: 400 });
  }

  const user = await getAdminUser(username);
  const credentials = getAdminCredentials();
  const currentOk = user.passwordHash
    ? await verifyPassword(currentPassword, user.passwordHash)
    : currentPassword === credentials.password;

  if (!currentOk) {
    return NextResponse.json({ message: "Mật khẩu cũ không đúng." }, { status: 400 });
  }

  await upsertAdminUser({
    ...user,
    passwordHash: await hashPassword(newPassword),
  });

  return NextResponse.json({ ok: true });
}
