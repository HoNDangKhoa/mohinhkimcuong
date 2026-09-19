import AdminAccessLogsPage from "@/components/admin/AdminAccessLogsPage";
import { listAccessLogs } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AccessLogsPage() {
  const logs = await listAccessLogs();
  return <AdminAccessLogsPage logs={logs} />;
}
