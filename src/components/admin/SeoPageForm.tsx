"use client";

import { useState } from "react";
import SeoAudit, { seoChecks } from "@/components/admin/SeoAudit";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsInput, CmsTextarea } from "@/components/admin/ui";

export default function SeoPageForm({
  type,
  title,
  initial,
}: {
  type: string;
  title: string;
  initial: Record<string, string>;
}) {
  const prefix = `seo_page_${type}`;
  const [titleValue, setTitleValue] = useState(initial[`${prefix}_title`] || "");
  const [keywords, setKeywords] = useState(initial[`${prefix}_keywords`] || "");
  const [description, setDescription] = useState(initial[`${prefix}_description`] || "");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function save() {
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group: "seo",
        values: {
          [`${prefix}_title`]: titleValue,
          [`${prefix}_keywords`]: keywords,
          [`${prefix}_description`]: description,
        },
      }),
    });
    setSaving(false);
    setNotice(response.ok ? "Đã lưu." : "Không lưu được.");
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý SEO page", title]} />
      <CmsActionBar sticky saving={saving} onSave={() => void save()} onReset={() => {
        setTitleValue(initial[`${prefix}_title`] || "");
        setKeywords(initial[`${prefix}_keywords`] || "");
        setDescription(initial[`${prefix}_description`] || "");
      }} />
      <CmsCard title="Nội dung SEO">
        <div className="space-y-4">
          <CmsField label="SEO Title (vi):" count={titleValue.length} max={70}>
            <CmsInput value={titleValue} onChange={(event) => setTitleValue(event.target.value)} />
          </CmsField>
          <CmsField label="SEO Keywords (vi):" count={keywords.length} max={70}>
            <CmsInput value={keywords} onChange={(event) => setKeywords(event.target.value)} />
          </CmsField>
          <CmsField label="SEO Description (vi):" count={description.length} max={160}>
            <CmsTextarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </CmsField>
          <SeoAudit
            checks={seoChecks({
              seoTitle: titleValue,
              seoKeywords: keywords,
              seoDescription: description,
              slug: type,
              indexable: true,
            })}
          />
          {notice ? <p className="text-[13px] text-gray-500">{notice}</p> : null}
        </div>
      </CmsCard>
    </div>
  );
}
