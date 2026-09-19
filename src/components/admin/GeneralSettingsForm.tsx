"use client";

import { useMemo, useState } from "react";
import SeoAudit, { seoChecks } from "@/components/admin/SeoAudit";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsInput, CmsSelect, CmsTextarea } from "@/components/admin/ui";
import type { CmsSettingsMap } from "@/lib/cms-records";

export type GeneralSettingsBundle = {
  general: CmsSettingsMap;
  contact: CmsSettingsMap;
  social: CmsSettingsMap;
  appearance: CmsSettingsMap;
  seo: CmsSettingsMap;
  analytics: CmsSettingsMap;
  booking: CmsSettingsMap;
};

type FormState = {
  companyName: string;
  hours: string;
  address: string;
  email: string;
  hotline: string;
  phone: string;
  zalo: string;
  zaloOa: string;
  website: string;
  fanpage: string;
  mailerHost: string;
  mailerPort: string;
  mailerEmail: string;
  mailerPassword: string;
  mailerSecure: string;
  mapsUrl: string;
  mapsIframe: string;
  googleAnalytics: string;
  webmaster: string;
  headJs: string;
  bodyJs: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoKeywordMain: string;
  siteUrl: string;
};

function readable(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "[]" || trimmed === "{}") return "";
  return trimmed;
}

function fromBundle(bundle: GeneralSettingsBundle): FormState {
  return {
    companyName: bundle.general.company_full_name || bundle.general.site_name || "",
    hours: readable(bundle.contact.company_hours || bundle.seo.seo_opening_hours || ""),
    address: bundle.contact.contact_address || "",
    email: bundle.contact.company_email || bundle.contact.contact_email || "",
    hotline: bundle.contact.company_phone || bundle.contact.contact_hotline || "",
    phone: bundle.contact.contact_phone || "",
    zalo: bundle.social.zalo_url || bundle.appearance.social_zalo || "",
    zaloOa: bundle.contact.zalo_oaid || "",
    website: bundle.seo.seo_site_url || "https://diamondmodel.vn",
    fanpage: bundle.social.facebook_url || bundle.appearance.social_facebook || "",
    mailerHost: bundle.booking.mailer_host || "smtp.gmail.com",
    mailerPort: bundle.booking.mailer_port || "587",
    mailerEmail: bundle.booking.mailer_email || bundle.booking.booking_notification_email || "",
    mailerPassword: bundle.booking.mailer_password || "",
    mailerSecure: bundle.booking.mailer_secure || "TLS",
    mapsUrl: bundle.contact.google_maps_url || "",
    mapsIframe: bundle.contact.google_maps_iframe || "",
    googleAnalytics: bundle.analytics.google_analytics_id || "",
    webmaster: bundle.analytics.google_site_verification || "",
    headJs: bundle.analytics.head_js || "",
    bodyJs: bundle.analytics.body_js || "",
    seoTitle: bundle.seo.seo_title || "",
    seoDescription: bundle.seo.seo_description || "",
    seoKeywords: bundle.seo.seo_keywords || "",
    seoKeywordMain: bundle.seo.seo_organization_name || "",
    siteUrl: bundle.seo.seo_site_url || "https://diamondmodel.vn",
  };
}

function toGroups(form: FormState): GeneralSettingsBundle {
  return {
    general: {
      company_full_name: form.companyName,
      site_name: form.companyName,
    },
    contact: {
      contact_address: form.address,
      company_email: form.email,
      contact_email: form.email,
      company_phone: form.hotline,
      contact_hotline: form.hotline,
      contact_phone: form.phone,
      company_hours: form.hours,
      zalo_oaid: form.zaloOa,
      google_maps_url: form.mapsUrl,
      google_maps_iframe: form.mapsIframe,
    },
    social: {
      facebook_url: form.fanpage,
      zalo_url: form.zalo,
    },
    appearance: {
      social_facebook: form.fanpage,
      social_zalo: form.zalo,
    },
    seo: {
      seo_title: form.seoTitle,
      seo_description: form.seoDescription,
      seo_keywords: form.seoKeywords,
      seo_organization_name: form.seoKeywordMain,
      seo_opening_hours: form.hours,
      seo_site_url: form.website || form.siteUrl,
    },
    analytics: {
      google_analytics_id: form.googleAnalytics,
      google_site_verification: form.webmaster,
      head_js: form.headJs,
      body_js: form.bodyJs,
    },
    booking: {
      mailer_host: form.mailerHost,
      mailer_port: form.mailerPort,
      mailer_email: form.mailerEmail,
      mailer_password: form.mailerPassword,
      mailer_secure: form.mailerSecure,
      booking_notification_email: form.mailerEmail,
    },
  };
}

function GooglePreview({ form }: { form: FormState }) {
  const host = (form.website || form.siteUrl).replace(/^https?:\/\//, "").replace(/\/$/, "") || "diamondmodel.vn";
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="mb-3 text-[13px] font-medium text-gray-700">Khi lên top, page này sẽ hiển thị theo dạng mẫu như sau:</p>
      <div className="max-w-[640px]">
        <p className="truncate text-[13px] text-gray-600">{host}</p>
        <p className="mt-1 line-clamp-1 text-[20px] leading-snug text-[#1a0dab]">{form.seoTitle || "SEO Title sẽ hiện ở đây"}</p>
        <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-gray-600">
          {form.seoDescription || "SEO Description sẽ hiện dưới tiêu đề trên Google."}
        </p>
      </div>
    </div>
  );
}

export default function GeneralSettingsForm({ initial }: { initial: GeneralSettingsBundle }) {
  const blank = useMemo(() => fromBundle(initial), [initial]);
  const [form, setForm] = useState<FormState>(blank);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groups: toGroups(form) }),
    });
    setSaving(false);
    setNotice(response.ok ? "Đã lưu cấu hình chung." : "Không lưu được.");
  }

  const checks = seoChecks({
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    seoKeywords: form.seoKeywords,
    canonicalUrl: form.website || form.siteUrl,
    ogImage: "",
    indexable: true,
    slug: "/",
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <CmsBreadcrumb items={["Bảng điều khiển", "Thiết lập thông tin"]} />
      <CmsActionBar sticky saving={saving} onSave={() => void save()} onReset={() => { setForm(blank); setNotice(""); }} />

      <div className="space-y-5">
        <CmsCard title="Cấu hình mailer">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CmsField label="Host:">
              <CmsInput value={form.mailerHost} onChange={(event) => set("mailerHost", event.target.value)} />
            </CmsField>
            <CmsField label="Port:">
              <CmsInput value={form.mailerPort} onChange={(event) => set("mailerPort", event.target.value)} />
            </CmsField>
            <CmsField label="Secure:">
              <CmsSelect value={form.mailerSecure} onChange={(event) => set("mailerSecure", event.target.value)}>
                <option value="TLS">TLS</option>
                <option value="SSL">SSL</option>
                <option value="NONE">None</option>
              </CmsSelect>
            </CmsField>
            <CmsField label="Email:">
              <CmsInput type="email" value={form.mailerEmail} onChange={(event) => set("mailerEmail", event.target.value)} />
            </CmsField>
            <CmsField label="Password:" className="xl:col-span-2">
              <CmsInput type="password" value={form.mailerPassword} onChange={(event) => set("mailerPassword", event.target.value)} autoComplete="new-password" />
            </CmsField>
          </div>
        </CmsCard>

        <CmsCard title="Thông tin chung">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CmsField label="Tiêu đề (vi):" className="xl:col-span-3">
              <CmsInput value={form.companyName} onChange={(event) => set("companyName", event.target.value)} />
            </CmsField>
            <CmsField label="Giờ làm việc:">
              <CmsInput value={form.hours} onChange={(event) => set("hours", event.target.value)} />
            </CmsField>
            <CmsField label="Địa chỉ:" className="md:col-span-2">
              <CmsInput value={form.address} onChange={(event) => set("address", event.target.value)} />
            </CmsField>
            <CmsField label="Email:">
              <CmsInput value={form.email} onChange={(event) => set("email", event.target.value)} />
            </CmsField>
            <CmsField label="Hotline:">
              <CmsInput value={form.hotline} onChange={(event) => set("hotline", event.target.value)} />
            </CmsField>
            <CmsField label="Điện thoại:">
              <CmsInput value={form.phone} onChange={(event) => set("phone", event.target.value)} />
            </CmsField>
            <CmsField label="Zalo:">
              <CmsInput value={form.zalo} onChange={(event) => set("zalo", event.target.value)} />
            </CmsField>
            <CmsField label="OAID Zalo:">
              <CmsInput value={form.zaloOa} onChange={(event) => set("zaloOa", event.target.value)} />
            </CmsField>
            <CmsField label="Website:">
              <CmsInput value={form.website} onChange={(event) => set("website", event.target.value)} />
            </CmsField>
            <CmsField label="Fanpage:" className="xl:col-span-3">
              <CmsInput value={form.fanpage} onChange={(event) => set("fanpage", event.target.value)} />
            </CmsField>
            <CmsField label="Tọa độ google map:" className="xl:col-span-3">
              <CmsInput value={form.mapsUrl} onChange={(event) => set("mapsUrl", event.target.value)} />
            </CmsField>
            <CmsField label="Tọa độ google map iframe:" className="xl:col-span-3">
              <CmsTextarea value={form.mapsIframe} onChange={(event) => set("mapsIframe", event.target.value)} className="min-h-28 font-mono text-[12px]" />
            </CmsField>
            <CmsField label="Google analytics:" className="xl:col-span-3">
              <CmsTextarea value={form.googleAnalytics} onChange={(event) => set("googleAnalytics", event.target.value)} className="min-h-24 font-mono text-[12px]" />
            </CmsField>
            <CmsField label="Google Webmaster Tool:" className="xl:col-span-3">
              <CmsTextarea value={form.webmaster} onChange={(event) => set("webmaster", event.target.value)} className="min-h-24 font-mono text-[12px]" />
            </CmsField>
            <CmsField label="Head JS:" className="xl:col-span-3">
              <CmsTextarea value={form.headJs} onChange={(event) => set("headJs", event.target.value)} className="min-h-24 font-mono text-[12px]" />
            </CmsField>
            <CmsField label="Body JS:" className="xl:col-span-3">
              <CmsTextarea value={form.bodyJs} onChange={(event) => set("bodyJs", event.target.value)} className="min-h-24 font-mono text-[12px]" />
            </CmsField>
          </div>
        </CmsCard>

        <CmsCard title="Nội dung SEO">
          <div className="space-y-4">
            <CmsField label="SEO Title (vi):" count={form.seoTitle.length} max={70}>
              <CmsInput value={form.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
            </CmsField>
            <CmsField label="SEO Keywords (vi):" count={form.seoKeywords.length} max={70}>
              <CmsInput value={form.seoKeywords} onChange={(event) => set("seoKeywords", event.target.value)} />
            </CmsField>
            <CmsField label="SEO Description (vi):" count={form.seoDescription.length} max={160}>
              <CmsTextarea value={form.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
            </CmsField>
            <CmsField label="Keyword chính (vi):" count={form.seoKeywordMain.length} max={100}>
              <CmsInput value={form.seoKeywordMain} onChange={(event) => set("seoKeywordMain", event.target.value)} />
            </CmsField>
            <GooglePreview form={form} />
            <SeoAudit checks={checks} />
          </div>
        </CmsCard>

        {notice ? <p className="text-[13px] text-gray-500">{notice}</p> : null}
      </div>
    </form>
  );
}
