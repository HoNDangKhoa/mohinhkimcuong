"use client";

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function MediaDropzone({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
    setBusy(false);
    if (!response.ok || !data?.url) {
      setError(data?.message || "Không tải được ảnh.");
      return;
    }
    onChange(data.url);
  }

  return (
    <div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
        className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-amber-400 bg-amber-50/40 px-4 py-8 text-center"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mb-4 max-h-28 object-contain" />
        ) : (
          <ArrowUpTrayIcon className="mb-3 h-6 w-6 text-amber-500" />
        )}
        <p className="text-[13px] text-gray-500">Kéo và thả hình vào đây</p>
        <p className="mt-1 text-[12px] text-gray-400">hoặc</p>
        <label className="mt-3 cursor-pointer">
          <input
            type="file"
            accept="image/*,.pdf,.mp4,.webm"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <span className="inline-flex h-9 items-center rounded-md bg-amber-500 px-5 text-[13px] font-medium text-white hover:bg-amber-600">
            {busy ? "Đang tải…" : "Chọn hình"}
          </span>
        </label>
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-400">
        Width: tự động - Height: tự động (jpg, jpeg, png, gif, webp, pdf, mp4)
      </p>
      {error ? <p className="mt-2 text-center text-[12px] text-red-500">{error}</p> : null}
    </div>
  );
}
