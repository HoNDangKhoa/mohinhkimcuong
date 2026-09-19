"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";

async function uploadBlob(file: Blob, filename: string) {
  const body = new FormData();
  body.append("file", file, filename);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
  if (!response.ok || !data?.url) throw new Error(data?.message || "Không tải được file.");
  return data.url;
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) {
    return <div className="min-h-[320px] rounded-lg border border-gray-200 bg-white" />;
  }

  return (
    <Editor
      licenseKey="gpl"
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value}
      onEditorChange={(next) => onChange(next)}
      init={{
        height: 420,
        menubar: "file edit view insert format tools table help",
        branding: false,
        promotion: false,
        resize: true,
        base_url: "/tinymce",
        suffix: ".min",
        plugins:
          "code preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars accordion",
        toolbar_mode: "wrap",
        toolbar: [
          "code preview | undo redo | cut copy paste pastetext | searchreplace",
          "fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | removeformat",
          "alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | lineheight",
          "image media link table charmap | blocks | fullscreen",
        ].join(" | "),
        font_family_formats:
          "Arial=arial,helvetica,sans-serif; Georgia=georgia,serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace; Tahoma=tahoma,arial,helvetica,sans-serif; Verdana=verdana,geneva,sans-serif",
        font_size_formats: "10px 12px 13px 14px 16px 18px 24px 32px 48px",
        line_height_formats: "1 1.2 1.4 1.6 1.8 2",
        content_style:
          "body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.7; color: #1f2937; }",
        image_caption: true,
        automatic_uploads: true,
        file_picker_types: "image media",
        images_upload_handler: async (blobInfo) => uploadBlob(blobInfo.blob(), blobInfo.filename()),
        file_picker_callback: (callback, _value, meta) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = meta.filetype === "media" ? "video/*,audio/*" : "image/*";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const url = await uploadBlob(file, file.name);
            callback(url, { title: file.name });
          };
          input.click();
        },
      }}
    />
  );
}
