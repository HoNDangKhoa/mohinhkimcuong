"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MediaDropzone from "@/components/admin/MediaDropzone";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SeoAudit, { seoChecks } from "@/components/admin/SeoAudit";
import {
  CmsActionBar,
  CmsBreadcrumb,
  CmsCard,
  CmsField,
  CmsInput,
  CmsSelect,
  CmsTextarea,
  CmsToggle,
} from "@/components/admin/ui";
import { CMS_CONTENT_STATUSES, CMS_PROJECT_CATEGORIES } from "@/lib/cms-admin-structure";
import { slugify, type CmsCategoryRecord, type CmsContentRecord, type CollectionKey, type ContentStatus } from "@/lib/cms-records";

const LABELS: Record<CollectionKey, string> = {
  projects: "Dự án",
  services: "Dịch vụ",
  articles: "Tin tức",
  pages: "Trang tĩnh",
};

const emptyRecord = (collection: CollectionKey): CmsContentRecord => ({
  status: "draft",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnailUrl: "",
  heroImageUrl: "",
  seoTitle: "",
  seoDescription: "",
  tags: [],
  category: collection === "projects" ? "Sa bàn kiến trúc" : collection === "articles" ? "Tin tức" : "Dịch vụ",
  isFeatured: false,
  publishedAt: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString(),
  client: "",
  location: "",
  area: "",
  scale: "",
  materials: "",
  completedAt: "",
  ogImage: "",
  seoKeywords: "",
  canonicalUrl: "",
  indexable: true,
  sortOrder: 0,
  viewCount: 0,
  categoryId: null,
  gallery: [],
});

export default function AdminFormPage({
  collection,
  initial,
  isNew,
  categories = [],
}: {
  collection: CollectionKey;
  initial?: CmsContentRecord;
  isNew?: boolean;
  categories?: CmsCategoryRecord[];
}) {
  const router = useRouter();
  const blank = emptyRecord(collection);
  const [record, setRecord] = useState<CmsContentRecord>(initial || blank);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const lockSlug = Boolean(initial && !isNew);
  const categoryType = collection === "projects" ? "project" : collection === "services" ? "service" : collection === "articles" ? "article" : "";
  const categoryOptions = categories.filter((item) => !categoryType || item.type === categoryType);

  function set<K extends keyof CmsContentRecord>(key: K, value: CmsContentRecord[K]) {
    setRecord((current) => ({ ...current, [key]: value }));
  }

  async function persist(stay = false) {
    if (!record.title.trim()) {
      setNotice("Nhập tiêu đề.");
      return;
    }
    const payload = {
      ...record,
      slug: record.slug.trim() || slugify(record.title),
      tags: Array.isArray(record.tags) ? record.tags : String(record.tags || "").split(",").map((item) => item.trim()).filter(Boolean),
    };
    setSaving(true);
    setNotice("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, record: payload }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setNotice(data?.message || "Không lưu được.");
      return;
    }
    setRecord(payload);
    if (stay) {
      setNotice("Đã lưu tại trang.");
      return;
    }
    router.push(`/admin/content/${collection}`);
    router.refresh();
  }

  async function remove() {
    if (!record.slug || !confirm("Xóa bản ghi này?")) return;
    const response = await fetch(`/api/admin/content?collection=${collection}&slug=${encodeURIComponent(record.slug)}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setNotice("Không xóa được.");
      return;
    }
    router.push(`/admin/content/${collection}`);
    router.refresh();
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý bài viết", LABELS[collection], isNew ? "Thêm mới" : "Chỉnh sửa"]} />
      <CmsActionBar
        saving={saving}
        onSave={() => void persist(false)}
        onSaveStay={() => void persist(true)}
        onReset={() => setRecord(initial || blank)}
        onExit={() => router.push(`/admin/content/${collection}`)}
      />

      <div className="space-y-5">
        <CmsCard title="Đường dẫn (URL không trùng tiêu đề)">
          <CmsField label="Thay đổi đường dẫn theo tiêu đề mới">
            <CmsInput value={record.slug} onChange={(event) => set("slug", event.target.value)} />
          </CmsField>
        </CmsCard>

        <CmsCard title="Nội dung tin tức">
          <div className="space-y-4">
            <CmsField label="Tiêu đề (vi):" count={record.title.length} max={120}>
              <CmsInput
                value={record.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setRecord((current) => ({
                    ...current,
                    title,
                    slug: lockSlug ? current.slug : slugify(title),
                  }));
                }}
              />
            </CmsField>
            <CmsField label="Mô tả (vi):">
              <CmsTextarea value={record.excerpt} onChange={(event) => set("excerpt", event.target.value)} />
            </CmsField>
            <CmsField label="Nội dung (vi):">
              <RichTextEditor value={record.content} onChange={(value) => set("content", value)} />
            </CmsField>
            <CmsField label="Tags">
              <CmsInput
                value={record.tags.join(", ")}
                onChange={(event) => set("tags", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
              />
            </CmsField>
            {collection === "projects" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <CmsField label="Khách hàng">
                  <CmsInput value={record.client || ""} onChange={(event) => set("client", event.target.value)} />
                </CmsField>
                <CmsField label="Địa điểm">
                  <CmsInput value={record.location || ""} onChange={(event) => set("location", event.target.value)} />
                </CmsField>
                <CmsField label="Tỷ lệ">
                  <CmsInput value={record.scale || ""} onChange={(event) => set("scale", event.target.value)} />
                </CmsField>
              </div>
            ) : null}
          </div>
        </CmsCard>

        <CmsCard title="Hình ảnh tin tức">
          <MediaDropzone
            value={record.thumbnailUrl || record.heroImageUrl}
            onChange={(url) => {
              set("thumbnailUrl", url);
              set("heroImageUrl", url);
              set("ogImage", url);
            }}
          />
          <div className="mt-5 flex items-center justify-between">
            <CmsField label="Số thứ tự">
              <CmsInput type="number" value={record.sortOrder ?? 0} onChange={(event) => set("sortOrder", Number(event.target.value))} className="max-w-40" />
            </CmsField>
            <CmsToggle label="Hiển thị" checked={record.status === "published"} onChange={(value) => set("status", value ? "published" : "draft")} />
          </div>
        </CmsCard>

        <CmsCard title="Xuất bản">
          <div className="grid gap-4 md:grid-cols-3">
            <CmsField label="Trạng thái">
              <CmsSelect value={record.status} onChange={(event) => set("status", event.target.value as ContentStatus)}>
                {CMS_CONTENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </CmsSelect>
            </CmsField>
            <CmsField label="Chuyên mục">
              {categoryOptions.length ? (
                <CmsSelect
                  value={record.category}
                  onChange={(event) => {
                    const name = event.target.value;
                    const match = categoryOptions.find((item) => item.name === name);
                    setRecord((current) => ({
                      ...current,
                      category: name,
                      categoryId: match?.categoryId ?? current.categoryId ?? null,
                    }));
                  }}
                >
                  {categoryOptions.map((item) => (
                    <option key={item.slug} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </CmsSelect>
              ) : collection === "projects" ? (
                <CmsSelect value={record.category} onChange={(event) => set("category", event.target.value)}>
                  {CMS_PROJECT_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </CmsSelect>
              ) : (
                <CmsInput value={record.category} onChange={(event) => set("category", event.target.value)} />
              )}
            </CmsField>
            <CmsField label="Ngày xuất bản">
              <CmsInput value={record.publishedAt} onChange={(event) => set("publishedAt", event.target.value)} />
            </CmsField>
          </div>
          <div className="mt-4">
            <CmsToggle label="Nổi bật trang chủ" checked={record.isFeatured} onChange={(value) => set("isFeatured", value)} />
          </div>
        </CmsCard>

        <CmsCard title="Nội dung SEO">
          <div className="space-y-4">
            <CmsField label="SEO Title (vi):" count={(record.seoTitle || "").length} max={70}>
              <CmsInput value={record.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
            </CmsField>
            <CmsField label="SEO Keywords (vi):" count={(record.seoKeywords || "").length} max={70}>
              <CmsInput value={record.seoKeywords || ""} onChange={(event) => set("seoKeywords", event.target.value)} />
            </CmsField>
            <CmsField label="SEO Description (vi):" count={(record.seoDescription || "").length} max={160}>
              <CmsTextarea value={record.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
            </CmsField>
            <CmsField label="Canonical URL">
              <CmsInput value={record.canonicalUrl || ""} onChange={(event) => set("canonicalUrl", event.target.value)} />
            </CmsField>
            <SeoAudit checks={seoChecks(record)} />
            {notice ? (
              <p className={`text-[13px] ${notice.includes("Đã lưu") ? "text-emerald-600" : "text-red-500"}`}>{notice}</p>
            ) : null}
            {lockSlug ? (
              <button type="button" onClick={() => void remove()} className="text-[13px] text-red-500 hover:underline">
                Xóa bản ghi
              </button>
            ) : null}
          </div>
        </CmsCard>
      </div>
    </div>
  );
}
