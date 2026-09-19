import { notFound } from "next/navigation";
import SeoPageForm from "@/components/admin/SeoPageForm";
import { getLocalSettings } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  projects: "Dự án",
  services: "Dịch vụ",
  articles: "Tin tức",
};

export default async function AdminSeoTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const title = TYPES[type];
  if (!title) notFound();
  return <SeoPageForm type={type} title={title} initial={await getLocalSettings("seo")} />;
}
