import { notFound } from "next/navigation";
import SettingsForm, { type SettingSection } from "@/components/admin/SettingsForm";
import { CMS_HOME_SECTIONS } from "@/lib/cms-admin-structure";
import { getLocalSettings } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AdminHomeSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const spec = CMS_HOME_SECTIONS.find((item) => item.id === section);
  if (!spec) notFound();
  const sections: SettingSection[] = [
    {
      title: spec.label,
      fields: spec.keys
        .filter((item) => item.key !== "isFeatured on services")
        .map((item) => ({
          key: item.key,
          label: item.label,
          type: item.type === "image" || item.type === "video" ? "image" : item.type === "json" || item.type === "textarea" ? (item.type === "json" ? "json" : "textarea") : "text",
        })),
    },
  ];
  return (
    <SettingsForm
      title={`Slogan ${spec.label}`}
      group="home"
      sections={sections}
      initial={await getLocalSettings("home")}
    />
  );
}
