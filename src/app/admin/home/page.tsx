import SettingsForm, { type SettingSection } from "@/components/admin/SettingsForm";
import { CMS_HOME_SECTIONS } from "@/lib/cms-admin-structure";
import { getLocalSettings } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const initial = await getLocalSettings("home");
  const sections: SettingSection[] = CMS_HOME_SECTIONS.filter((section) => section.keys.some((item) => item.key !== "isFeatured on services")).map(
    (section) => ({
      title: section.label,
      fields: section.keys
        .filter((item) => item.key !== "isFeatured on services")
        .map((item) => ({
          key: item.key,
          label: item.label,
          type: item.type === "image" || item.type === "video" ? "image" : item.type === "json" || item.type === "textarea" ? (item.type === "json" ? "json" : "textarea") : "text",
        })),
    }),
  );

  return (
    <SettingsForm
      title="Trang chủ"
      group="home"
      sections={sections}
      initial={initial}
    />
  );
}
