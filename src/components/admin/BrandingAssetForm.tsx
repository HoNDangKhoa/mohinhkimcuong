"use client";

import { useState } from "react";
import MediaDropzone from "@/components/admin/MediaDropzone";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsTextarea, CmsToggle } from "@/components/admin/ui";

export default function BrandingAssetForm({
  title,
  group,
  keyName,
  extraKey,
  extraLabel,
  initial,
  acceptHint,
}: {
  title: string;
  group: "general" | "home" | "appearance";
  keyName: string;
  extraKey?: string;
  extraLabel?: string;
  initial: Record<string, string>;
  acceptHint?: string;
}) {
  const [values, setValues] = useState(initial);
  const [visible, setVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function save() {
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group, values }),
    });
    setSaving(false);
    setNotice(response.ok ? "Đã lưu." : "Không lưu được.");
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý hình ảnh - video", title]} />
      <CmsActionBar sticky saving={saving} onSave={() => void save()} onReset={() => setValues(initial)} />
      <CmsCard title={`Chi tiết ${title}`}>
        <MediaDropzone value={values[keyName] || ""} onChange={(url) => setValues((current) => ({ ...current, [keyName]: url }))} />
        {acceptHint ? <p className="mt-2 text-center text-[12px] text-gray-400">{acceptHint}</p> : null}
        {extraKey ? (
          <div className="mt-4">
            <CmsField label={extraLabel || extraKey}>
              <CmsTextarea
                value={values[extraKey] || ""}
                onChange={(event) => setValues((current) => ({ ...current, [extraKey]: event.target.value }))}
                className="min-h-28 font-mono text-[12px]"
              />
            </CmsField>
          </div>
        ) : null}
        <div className="mt-5 flex justify-end">
          <CmsToggle label="Hiển thị" checked={visible} onChange={setVisible} />
        </div>
        {notice ? <p className="mt-3 text-[13px] text-gray-500">{notice}</p> : null}
      </CmsCard>
    </div>
  );
}
