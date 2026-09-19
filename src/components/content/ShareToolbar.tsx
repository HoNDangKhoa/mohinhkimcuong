"use client";

import { useMemo, useState } from "react";
import { DocumentDuplicateIcon, EnvelopeIcon, LinkIcon } from "@heroicons/react/24/outline";

function buildShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: LinkIcon,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkIcon,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: EnvelopeIcon,
    },
  ];
}

export default function ShareToolbar({ url, title }: { url: string; title: string }) {
  const shareLinks = useMemo(() => buildShareLinks(url, title), [title, url]);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-[18px] border border-[#e7ddd0] bg-white p-5 shadow-[0_12px_28px_rgba(25,35,38,0.06)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7c7469]">Chia sẻ</p>
      <div className="mt-4 grid gap-2">
        {shareLinks.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#e7ddd0] px-3 py-2 text-[13px] font-medium text-[#4f4b46] transition hover:border-[#6b95a2] hover:text-[#6b95a2]"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          );
        })}

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full border border-[#e7ddd0] px-3 py-2 text-[13px] font-medium text-[#4f4b46] transition hover:border-[#6b95a2] hover:text-[#6b95a2]"
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          {copied ? "Đã sao chép" : "Sao chép link"}
        </button>
      </div>
    </div>
  );
}
