"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { CmsBreadcrumb, CmsCard, CmsInput, cmsTd, cmsTh } from "@/components/admin/ui";
import { formatAccessTime } from "@/lib/cms-access";
import type { CmsAccessLog } from "@/lib/cms-records";

export default function AdminAccessLogsPage({ logs }: { logs: CmsAccessLog[] }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return logs;
    return logs.filter((item) => `${item.device} ${item.browser} ${item.ip} ${item.username}`.toLowerCase().includes(needle));
  }, [logs, query]);

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý lịch sử truy cập"]} />
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <CmsInput placeholder="Tìm kiếm nhanh" value={query} onChange={(event) => setQuery(event.target.value)} />
          <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <CmsCard title="Danh sách lịch sử truy cập">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead>
              <tr>
                {["Thiết bị", "Trình duyệt", "IP", "User", "Thời gian"].map((label) => (
                  <th key={label} className={cmsTh}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className={`${cmsTd} whitespace-nowrap font-medium text-gray-800`}>{log.device}</td>
                  <td className={`${cmsTd} max-w-[420px] break-all`}>{log.browser}</td>
                  <td className={`${cmsTd} whitespace-nowrap`}>{log.ip}</td>
                  <td className={`${cmsTd} whitespace-nowrap`}>{log.username}</td>
                  <td className={`${cmsTd} whitespace-nowrap`}>{formatAccessTime(log.createdAt)}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className={cmsTd} colSpan={5}>
                    Chưa có lịch sử truy cập.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </CmsCard>
    </div>
  );
}
