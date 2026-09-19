import GeneralSettingsForm from "@/components/admin/GeneralSettingsForm";
import { getLocalSettings } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

export default async function AdminGeneralSettingsPage() {
  const [general, contact, social, appearance, seo, analytics, booking] = await Promise.all([
    getLocalSettings("general"),
    getLocalSettings("contact"),
    getLocalSettings("social"),
    getLocalSettings("appearance"),
    getLocalSettings("seo"),
    getLocalSettings("analytics"),
    getLocalSettings("booking"),
  ]);

  return (
    <GeneralSettingsForm
      initial={{ general, contact, social, appearance, seo, analytics, booking }}
    />
  );
}
