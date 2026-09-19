"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CmsBreadcrumb, CmsButton, CmsCard, CmsInput, CmsToggle, cmsTd, cmsTh } from "@/components/admin/ui";
import type { CmsContentRecord, CollectionKey, ContentStatus } from "@/lib/cms-records";

const LABELS: Record<CollectionKey, { title: string; publicBase: string }> = {
  projects: { title: "Dự án", publicBase: "/du-an" },
  services: { title: "Dịch vụ", publicBase: "/dich-vu" },
  articles: { title: "Tin tức", publicBase: "/tin-tuc" },
  pages: { title: "Trang tĩnh", publicBase: "" },
};

export default function AdminListPage({
  collection,
  records: initial,
}: {
  collection: CollectionKey;
  records: CmsContentRecord[];
}) {
  const [records, setRecords] = useState(initial);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const copy = LABELS[collection];

  const rows = useMemo(() => {
    return records.filter((item) => {
      const haystack = `${item.title} ${item.slug}`.toLowerCase();
      return !query || haystack.includes(query.toLowerCase());
    });
  }, [records, query]);

  async function persist(record: CmsContentRecord) {
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, record }),
    });
  }

  async function togglePublish(record: CmsContentRecord) {
    const next = { ...record, status: (record.status === "published" ? "draft" : "published") as ContentStatus };
    setRecords((current) => current.map((item) => (item.slug === record.slug ? next : item)));
    await persist(next);
  }

  async function toggleNew(record: CmsContentRecord) {
    const next = { ...record, isFeatured: !record.isFeatured };
    setRecords((current) => current.map((item) => (item.slug === record.slug ? next : item)));
    await persist(next);
  }

  async function changeOrder(record: CmsContentRecord, sortOrder: number) {
    const next = { ...record, sortOrder };
    setRecords((current) => current.map((item) => (item.slug === record.slug ? next : item)));
    await persist(next);
  }

  async function remove(slug: string) {
    if (!confirm("Xóa bản ghi này?")) return;
    setRecords((current) => current.filter((item) => item.slug !== slug));
    setSelected((current) => current.filter((item) => item !== slug));
    await fetch(`/api/admin/content?collection=${collection}&slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
  }

  async function removeSelected() {
    if (!selected.length || !confirm(`Xóa ${selected.length} bản ghi đã chọn?`)) return;
    await Promise.all(selected.map((slug) => fetch(`/api/admin/content?collection=${collection}&slug=${encodeURIComponent(slug)}`, { method: "DELETE" })));
    setRecords((current) => current.filter((item) => !selected.includes(item.slug)));
    setSelected([]);
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý bài viết", copy.title]} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/content/${collection}/new`}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-amber-500 px-4 text-[13px] font-medium text-white hover:bg-amber-600"
        >
          <PlusIcon className="h-4 w-4" />
          Thêm mới
        </Link>
        <CmsButton type="button" variant="danger" onClick={() => void removeSelected()} disabled={!selected.length} className="gap-1.5">
          <TrashIcon className="h-4 w-4" />
          Xóa tất cả
        </CmsButton>
      </div>
      <CmsCard title={`Danh sách ${copy.title}`}>
        <div className="mb-4 max-w-sm">
          <div className="relative">
            <CmsInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm nhanh"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-[13px]">
            <thead>
              <tr>
                <th className={cmsTh}>
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && rows.every((item) => selected.includes(item.slug))}
                    onChange={(event) => setSelected(event.target.checked ? rows.map((item) => item.slug) : [])}
                  />
                </th>
                <th className={cmsTh}>STT</th>
                <th className={cmsTh}>Hình</th>
                <th className={cmsTh}>Tiêu đề</th>
                <th className={cmsTh}>New</th>
                <th className={cmsTh}>Lượt xem</th>
                <th className={cmsTh}>Hiển thị</th>
                <th className={cmsTh}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.slug} className="align-middle hover:bg-gray-50">
                  <td className={cmsTd}>
                    <input type="checkbox" checked={selected.includes(item.slug)} onChange={() => setSelected((current) => (current.includes(item.slug) ? current.filter((value) => value !== item.slug) : [...current, item.slug]))} />
                  </td>
                  <td className={cmsTd}>
                    <CmsInput
                      type="number"
                      value={item.sortOrder ?? index}
                      onChange={(event) => void changeOrder(item, Number(event.target.value))}
                      className="w-16 px-2 py-1.5"
                    />
                  </td>
                  <td className={cmsTd}>
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-gray-50">
                      {item.thumbnailUrl || item.heroImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnailUrl || item.heroImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className={cmsTd}>
                    <Link href={`/admin/content/${collection}/${item.slug}`} className="font-medium text-gray-900 hover:text-amber-600">
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-[12px] text-gray-400">/{item.slug}</p>
                  </td>
                  <td className={cmsTd}>
                    <CmsToggle checked={item.isFeatured} onChange={() => void toggleNew(item)} />
                  </td>
                  <td className={cmsTd}>{item.viewCount ?? 0}</td>
                  <td className={cmsTd}>
                    <CmsToggle checked={item.status === "published"} onChange={() => void togglePublish(item)} />
                  </td>
                  <td className={cmsTd}>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={collection === "pages" ? `/${item.slug}` : `${copy.publicBase}/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Xem
                      </Link>
                      <Link href={`/admin/content/${collection}/${item.slug}`} className="inline-flex items-center gap-1 text-amber-600 hover:underline">
                        <PencilSquareIcon className="h-4 w-4" />
                        Sửa
                      </Link>
                      <button type="button" onClick={() => void remove(item.slug)} className="inline-flex items-center gap-1 text-red-500 hover:underline">
                        <TrashIcon className="h-4 w-4" />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? <p className="mt-4 text-[13px] text-gray-400">Không có bản ghi.</p> : null}
      </CmsCard>
    </div>
  );
}
