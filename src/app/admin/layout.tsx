import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";
import { getAdminUser } from "@/lib/cms-local-store";

export const metadata: Metadata = {
  title: "Diamond Model CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") || "";
  if (pathname === "/admin/login") return children;

  const token = (await cookies()).get(sessionCookieName())?.value;
  const username = (await verifySessionToken(token)) || "admin";
  const user = await getAdminUser(username);

  return (
    <>
      <style>{`
        .cms-admin, .cms-admin h1, .cms-admin h2, .cms-admin h3 {
          font-family: ui-sans-serif, system-ui, sans-serif;
          letter-spacing: 0;
          text-transform: none;
        }
        .cms-admin { color: #111827; }
      `}</style>
      <AdminShell username={username} displayName={user.displayName} avatarUrl={user.avatarUrl}>
        {children}
      </AdminShell>
    </>
  );
}
