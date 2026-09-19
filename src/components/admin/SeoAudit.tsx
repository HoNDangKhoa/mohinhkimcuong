import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export type SeoCheck = {
  label: string;
  ok: boolean;
  note?: string;
};

export function seoChecks(input: {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  indexable?: boolean;
  slug?: string;
}) {
  const title = (input.seoTitle || input.title || "").trim();
  const description = (input.seoDescription || "").trim();
  const keyword = (input.seoKeywords || "").split(",")[0]?.trim() || "";
  const slug = input.slug || "";
  return [
    { label: "Độ dài tiêu đề phù hợp (10 - 70 ký tự)", ok: title.length >= 10 && title.length <= 70 },
    { label: "Độ dài mô tả phù hợp (50 - 160 ký tự)", ok: description.length >= 50 && description.length <= 160 },
    { label: "Từ khóa xuất hiện trong tiêu đề", ok: Boolean(keyword && title.toLowerCase().includes(keyword.toLowerCase())) },
    { label: "Từ khóa xuất hiện trong mô tả", ok: Boolean(keyword && description.toLowerCase().includes(keyword.toLowerCase())) },
    { label: "Từ khóa xuất hiện trong URL", ok: Boolean(keyword && slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, "-"))) },
    { label: "OG image đã có", ok: Boolean(input.ogImage?.trim()) },
    { label: "Canonical URL đã có", ok: Boolean(input.canonicalUrl?.trim()) },
    { label: "Cho phép index", ok: input.indexable !== false },
  ] satisfies SeoCheck[];
}

export default function SeoAudit({ checks }: { checks: SeoCheck[]; compact?: boolean }) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {checks.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] ${
            item.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"
          }`}
        >
          {item.ok ? <CheckCircleIcon className="h-4 w-4 shrink-0" /> : <XCircleIcon className="h-4 w-4 shrink-0" />}
          {item.label}
        </div>
      ))}
    </div>
  );
}
