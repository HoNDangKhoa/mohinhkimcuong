"use client";

import { useState } from "react";
import MediaDropzone from "@/components/admin/MediaDropzone";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SeoAudit, { seoChecks } from "@/components/admin/SeoAudit";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsInput, CmsTextarea, CmsToggle } from "@/components/admin/ui";
import type { CmsSettingsGroupKey, CmsSettingsMap } from "@/lib/cms-records";

export type SettingField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "json" | "image" | "richtext" | "toggle";
  max?: number;
};

export type SettingSection = {
  title: string;
  fields: SettingField[];
  split?: boolean;
};

function seoMax(field: SettingField) {
  if (field.max) return field.max;
  if (!/^seo_/i.test(field.key)) return undefined;
  if (/title/i.test(field.key)) return 70;
  if (/keyword/i.test(field.key)) return 70;
  if (/description/i.test(field.key)) return 160;
  return undefined;
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: SettingField;
  value: string;
  onChange: (next: string) => void;
}) {
  if (field.type === "image") {
    return <MediaDropzone value={value} onChange={onChange} />;
  }
  if (field.type === "richtext") {
    return <RichTextEditor value={value} onChange={onChange} />;
  }
  if (field.type === "toggle") {
    return <CmsToggle label="Hiển thị" checked={value !== "0" && value !== "false"} onChange={(next) => onChange(next ? "1" : "0")} />;
  }
  if (field.type === "textarea" || field.type === "json") {
    return (
      <CmsTextarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={field.type === "json" ? "min-h-32 font-mono text-[12px]" : "min-h-28"}
      />
    );
  }
  return <CmsInput value={value} onChange={(event) => onChange(event.target.value)} />;
}

export default function SettingsForm({
  title,
  subtitle,
  group,
  fields,
  sections,
  initial,
  showSeoAudit,
}: {
  title: string;
  subtitle?: string;
  group: CmsSettingsGroupKey;
  fields?: SettingField[];
  sections?: SettingSection[];
  initial: CmsSettingsMap;
  showSeoAudit?: boolean;
}) {
  const [values, setValues] = useState<CmsSettingsMap>(initial);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const cards = sections?.length ? sections : [{ title, fields: fields || [] }];

  function setValue(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group, values }),
    });
    setSaving(false);
    setNotice(response.ok ? "Đã lưu tại trang." : "Không lưu được.");
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", title]} />
      <CmsActionBar
        sticky
        saving={saving}
        onSave={() => void save()}
        onReset={() => {
          setValues(initial);
          setNotice("");
        }}
      />
      {subtitle ? <p className="mb-4 text-[13px] text-stone-400">{subtitle}</p> : null}
      <div className="space-y-5">
        {cards.map((card) => {
          const mediaFields = card.fields.filter((field) => field.type === "image");
          const otherFields = card.fields.filter((field) => field.type !== "image");
          if (card.split && mediaFields.length) {
            return (
              <div key={card.title} className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <CmsCard title={card.title}>
                  <div className="grid gap-4 md:grid-cols-3">
                    {otherFields.map((field) => (
                      <CmsField
                        key={field.key}
                        label={`${field.label}:`}
                        count={values[field.key]?.length}
                        max={seoMax(field)}
                        className={field.type === "textarea" || field.type === "json" || field.type === "richtext" ? "md:col-span-3" : ""}
                      >
                        <FieldControl field={field} value={values[field.key] || ""} onChange={(next) => setValue(field.key, next)} />
                      </CmsField>
                    ))}
                  </div>
                </CmsCard>
                {mediaFields.map((field) => (
                  <CmsCard key={field.key} title={field.label}>
                    <FieldControl field={field} value={values[field.key] || ""} onChange={(next) => setValue(field.key, next)} />
                  </CmsCard>
                ))}
              </div>
            );
          }
          return (
            <CmsCard key={card.title} title={card.title}>
              <div className="grid gap-4 md:grid-cols-3">
                {card.fields.map((field) => (
                  <CmsField
                    key={field.key}
                    label={`${field.label}:`}
                    count={typeof values[field.key] === "string" && seoMax(field) ? values[field.key].length : undefined}
                    max={seoMax(field)}
                    className={
                      field.type === "textarea" ||
                      field.type === "json" ||
                      field.type === "image" ||
                      field.type === "richtext" ||
                      field.type === "toggle"
                        ? "md:col-span-3"
                        : ""
                    }
                  >
                    <FieldControl field={field} value={values[field.key] || ""} onChange={(next) => setValue(field.key, next)} />
                  </CmsField>
                ))}
              </div>
              {showSeoAudit && card.title === "Nội dung SEO" ? (
                <div className="mt-5">
                  <SeoAudit
                    checks={seoChecks({
                      seoTitle: values.seo_title || values.seoTitle,
                      seoDescription: values.seo_description || values.seoDescription,
                      seoKeywords: values.seo_keywords || values.seoKeywords,
                      ogImage: values.seo_default_og_image,
                      canonicalUrl: values.seo_site_url,
                      indexable: true,
                      slug: "/",
                    })}
                  />
                </div>
              ) : null}
            </CmsCard>
          );
        })}
        {notice ? <p className="text-[13px] text-stone-500">{notice}</p> : null}
      </div>
    </div>
  );
}
