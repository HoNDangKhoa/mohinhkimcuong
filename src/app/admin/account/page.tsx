import { getAdminUser } from "@/lib/cms-local-store";
import AdminAccountForm from "@/components/admin/AdminAccountForm";
import { cookies } from "next/headers";
import { sessionCookieName, verifySessionToken } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const username = await verifySessionToken((await cookies()).get(sessionCookieName())?.value);
  const user = await getAdminUser(username);
  return <AdminAccountForm user={user} />;
}
