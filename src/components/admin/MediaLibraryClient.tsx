"use client";

import { useState } from "react";
import MediaDropzone from "@/components/admin/MediaDropzone";
import { CmsBreadcrumb, CmsCard } from "@/components/admin/ui";
import type { CmsMediaRecord } from "@/lib/cms-records";

export default function MediaLibraryClient({ items }: { items: CmsMediaRecord[] }) {
  const [uploaded, setUploaded] = useState<string[]>([]);

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Quản lý hình ảnh - video", "Thư viện media"]} />
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <CmsCard title="Tải lên">
          <MediaDropzone
            value=""
            onChange={(url) => {
              if (url) setUploaded((current) => [url, ...current]);
            }}
          />
        </CmsCard>
        <CmsCard title="Kho media">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {uploaded.map((url) => (
              <article key={url} className="overflow-hidden rounded-2xl border border-[#f3ead4]">
                <div className="aspect-[16/10] bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
                <p className="break-all p-3 text-[11px] text-stone-400">{url}</p>
              </article>
            ))}
            {items.map((item) => (
              <article key={item.mediaId} className="overflow-hidden rounded-2xl border border-[#f3ead4]">
                <div className="aspect-[16/10] bg-gray-50">
                  {item.mimeType.startsWith("image/") || item.mimeType.endsWith("svg") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt || item.title} className="h-full w-full object-cover" />
                  ) : (
                    <p className="flex h-full items-center justify-center px-4 text-center text-[12px] text-stone-400">
                      {item.mimeType}
                    </p>
                  )}
                </div>
                <div className="space-y-1 p-3 text-[11px] text-stone-400">
                  <p className="font-medium text-stone-800">{item.title || item.filename}</p>
                  <p>{item.folder || "/"}</p>
                  <p className="break-all">{item.url}</p>
                </div>
              </article>
            ))}
          </div>
        </CmsCard>
      </div>
    </div>
  );
}
