"use client";

import { useEffect, useState } from "react";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsInput, CmsSelect, CmsToggle, cmsTd, cmsTh } from "@/components/admin/ui";
import { slugify, type CmsCategoryRecord } from "@/lib/cms-records";

const emptyCategory = (): CmsCategoryRecord => ({
  categoryId: Date.now(),
  name: "",
  slug: "",
  description: "",
  type: "project",
  parentId: null,
  sortOrder: 0,
  isActive: true,
  imageUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CmsCategoryRecord[]>([]);
  const [draft, setDraft] = useState<CmsCategoryRecord>(emptyCategory());
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/categories");
    const data = (await response.json()) as { data?: CmsCategoryRecord[] };
    setRows(data.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!draft.name.trim()) {
      setNotice("Nhập tên chuyên mục.");
      return;
    }
    setSaving(true);
    const payload = { ...draft, slug: draft.slug.trim() || slugify(draft.name) };
    const response = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: payload }),
    });
    setSaving(false);
    setNotice(response.ok ? "Đã lưu tại trang." : "Không lưu được.");
    setDraft(emptyCategory());
    await load();
  }

  async function remove(categoryId: number) {
    if (!confirm("Xóa chuyên mục này?")) return;
    await fetch(`/api/admin/categories?categoryId=${categoryId}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(item: CmsCategoryRecord) {
    await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: { ...item, isActive: !item.isActive } }),
    });
    await load();
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý bài viết", "Danh mục"]} />
      <CmsActionBar
        saving={saving}
        onSave={() => void save()}
        onReset={() => {
          setDraft(emptyCategory());
          setNotice("");
        }}
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <CmsCard title="Danh sách">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
              <thead>
                <tr>
                  <th className={cmsTh}>ID</th>
                  <th className={cmsTh}>Tiêu đề</th>
                  <th className={cmsTh}>Type</th>
                  <th className={cmsTh}>Hiển thị</th>
                  <th className={cmsTh}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.categoryId} className="hover:bg-gray-50">
                    <td className={cmsTd}>{item.categoryId}</td>
                    <td className={cmsTd}>
                      <p className="font-medium text-stone-800">{item.name}</p>
                      <p className="text-[12px] text-stone-400">{item.slug}</p>
                    </td>
                    <td className={cmsTd}>{item.type}</td>
                    <td className={cmsTd}>
                      <CmsToggle checked={item.isActive} onChange={() => void toggleActive(item)} />
                    </td>
                    <td className={cmsTd}>
                      <button type="button" className="mr-3 text-[#c39214] hover:underline" onClick={() => setDraft(item)}>
                        Sửa
                      </button>
                      <button type="button" className="text-red-500 hover:underline" onClick={() => void remove(item.categoryId)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CmsCard>
        <CmsCard title={draft.name ? "Sửa danh mục" : "Thêm mới"}>
          <div className="space-y-3">
            <CmsField label="Tên">
              <CmsInput
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: current.slug && current.slug !== slugify(current.name) ? current.slug : slugify(event.target.value),
                  }))
                }
              />
            </CmsField>
            <CmsField label="Slug">
              <CmsInput value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} />
            </CmsField>
            <CmsField label="Type">
              <CmsSelect value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}>
                <option value="project">project</option>
                <option value="service">service</option>
                <option value="article">article</option>
              </CmsSelect>
            </CmsField>
            <CmsField label="Thứ tự">
              <CmsInput
                type="number"
                value={draft.sortOrder}
                onChange={(event) => setDraft((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
              />
            </CmsField>
            {notice ? <p className="text-[13px] text-stone-500">{notice}</p> : null}
          </div>
        </CmsCard>
      </div>
    </div>
  );
}
