import Link from "next/link";
import {
  AdjustmentsHorizontalIcon,
  ChartBarSquareIcon,
  EnvelopeIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import AccessStatsPanel from "@/components/admin/AccessStatsPanel";
import { CmsBadge, CmsBreadcrumb, CmsCard } from "@/components/admin/ui";
import { listAccessLogs, listLeads } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

const SHORTCUTS = [
  { href: "/admin/settings", title: "Cấu hình website", note: "Xem chi tiết", tone: "bg-blue-500", Icon: AdjustmentsHorizontalIcon },
  { href: "/admin/account", title: "Tài khoản", note: "Xem chi tiết", tone: "bg-violet-500", Icon: UserCircleIcon },
  { href: "/admin/account/password", title: "Đổi mật khẩu", note: "Xem chi tiết", tone: "bg-orange-500", Icon: KeyIcon },
  { href: "/admin/contacts", title: "Thư liên hệ", note: "Xem chi tiết", tone: "bg-emerald-500", Icon: EnvelopeIcon },
];

export default async function AdminDashboardPage() {
  const [leads, logs] = await Promise.all([listLeads(), listAccessLogs()]);
  const newLeads = leads.filter((item) => item.status === "new").length;

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển"]} />
      <h1 className="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900">
        <ChartBarSquareIcon className="h-6 w-6 text-amber-500" />
        Bảng điều khiển
      </h1>
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SHORTCUTS.map((item) => (
          <Link key={item.title} href={item.href}>
            <CmsCard>
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-white ${item.tone}`}>
                  <item.Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-[13px] text-amber-600">{item.note}</p>
                </div>
              </div>
            </CmsCard>
          </Link>
        ))}
      </div>
      <AccessStatsPanel logs={logs} />
      <div className="mt-5">
        <CmsCard title="Thư liên hệ gần đây">
          <ul className="space-y-3 text-[13px]">
            {leads.slice(0, 8).map((lead) => (
              <li key={lead.id} className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-gray-400">{lead.message.slice(0, 80)}</p>
                </div>
                <CmsBadge tone={lead.status === "new" ? "blue" : lead.status === "done" ? "green" : "purple"}>{lead.status}</CmsBadge>
              </li>
            ))}
            {leads.length === 0 ? <p className="text-gray-400">Chưa có thư liên hệ.</p> : null}
          </ul>
        </CmsCard>
      </div>
      {newLeads > 0 ? <p className="mt-3 text-[12px] text-gray-400">{newLeads} thư liên hệ mới.</p> : null}
    </div>
  );
}
