"use client";

import { useEffect, useState } from "react";
import { leadStatusLabel, statusClass } from "@/components/admin/status";
import { CmsBreadcrumb, CmsCard, CmsInput, CmsSelect, cmsTd, cmsTh } from "@/components/admin/ui";
import type { CmsLeadRecord, LeadStatus } from "@/lib/cms-records";

export default function AdminContactsPage() {
  const [leads, setLeads] = useState<CmsLeadRecord[]>([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");

  async function load() {
    const response = await fetch("/api/admin/contacts");
    const data = (await response.json()) as { data?: CmsLeadRecord[] };
    setLeads(data.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function changeStatus(id: string, status: LeadStatus) {
    await fetch("/api/admin/contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  const rows = leads.filter((item) => {
    const haystack = `${item.name} ${item.phone} ${item.email} ${item.message}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (source !== "all" && item.source !== source) return false;
    return true;
  });

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Thư liên hệ"]} />
      <CmsCard title="Inbox">
        <div className="mb-4 flex flex-wrap gap-3">
          <CmsInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tên, SĐT, email"
            className="min-w-[220px] flex-1"
          />
          <CmsSelect value={source} onChange={(event) => setSource(event.target.value)} className="w-48">
            <option value="all">Mọi nguồn</option>
            <option value="contact-page">contact-page</option>
            <option value="consultation-popup">consultation-popup</option>
          </CmsSelect>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className={cmsTh}>STT</th>
                <th className={cmsTh}>Trạng thái</th>
                <th className={cmsTh}>Khách hàng</th>
                <th className={cmsTh}>Nguồn</th>
                <th className={cmsTh}>Nội dung</th>
                <th className={cmsTh}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className="align-top hover:bg-gray-50">
                  <td className={cmsTd}>{index + 1}</td>
                  <td className={cmsTd}>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(item.status)}`}>
                      {leadStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className={cmsTd}>
                    <p className="font-medium text-stone-800">{item.name}</p>
                    <p className="text-[12px] text-stone-400">{item.phone || item.email || "—"}</p>
                  </td>
                  <td className={cmsTd}>{item.source}</td>
                  <td className={`max-w-[360px] whitespace-pre-wrap ${cmsTd}`}>{item.message}</td>
                  <td className={cmsTd}>
                    <CmsSelect value={item.status} onChange={(event) => void changeStatus(item.id, event.target.value as LeadStatus)}>
                      <option value="new">Mới</option>
                      <option value="read">Đã đọc</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="done">Đã xử lý</option>
                    </CmsSelect>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? <p className="mt-6 text-[13px] text-stone-400">Chưa có lead.</p> : null}
      </CmsCard>
    </div>
  );
}
