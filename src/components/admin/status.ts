import type { ContentStatus, LeadStatus } from "@/lib/cms-records";

export function contentStatusLabel(status: ContentStatus) {
  switch (status) {
    case "published":
      return "Xuất bản";
    case "review":
      return "Chờ duyệt";
    case "draft":
      return "Nháp";
    case "archived":
      return "Lưu trữ";
  }
}

export function leadStatusLabel(status: LeadStatus) {
  switch (status) {
    case "new":
      return "Mới";
    case "processing":
      return "Đang xử lý";
    case "done":
      return "Đã xử lý";
    case "read":
      return "Đã đọc";
  }
}

export function statusClass(status: string) {
  if (status === "published" || status === "done") return "bg-green-50 text-green-700";
  if (status === "review" || status === "processing") return "bg-amber-50 text-amber-700";
  if (status === "new") return "bg-sky-50 text-sky-700";
  if (status === "read") return "bg-violet-50 text-violet-700";
  return "bg-gray-100 text-gray-600";
}
