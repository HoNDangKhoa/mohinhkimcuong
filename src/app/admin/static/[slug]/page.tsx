import { notFound } from "next/navigation";
import AdminFormPage from "@/components/admin/AdminFormPage";
import SettingsForm from "@/components/admin/SettingsForm";
import { getCollectionRecords, getLocalSettings, listCategories } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AdminStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "footer") {
    const initial = await getLocalSettings("appearance");
    return (
      <SettingsForm
        title="Footer"
        group="appearance"
        sections={[
          {
            title: "Nội dung Footer",
            fields: [
              { key: "footer_marquee", label: "Nội dung (vi)", type: "richtext" },
              { key: "footer_policies", label: "Chính sách footer", type: "json" },
              { key: "floating_cta_label", label: "CTA nổi", type: "text" },
            ],
          },
        ]}
        initial={initial}
      />
    );
  }
  if (slug === "gioi-thieu") {
    const general = await getLocalSettings("general");
    const aboutSlug = general.frontend_about_page_slug || "gioi-thieu";
    const pages = await getCollectionRecords("pages");
    const record =
      pages.find((item) => item.slug === aboutSlug) ||
      pages.find((item) => item.slug.includes("gioi-thieu") || item.slug.includes("diamond-model")) ||
      pages[0];
    const categories = await listCategories();
    if (!record) notFound();
    return <AdminFormPage collection="pages" initial={record} categories={categories} />;
  }
  notFound();
}
