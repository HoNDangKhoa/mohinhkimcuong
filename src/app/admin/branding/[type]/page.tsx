import { notFound } from "next/navigation";
import BrandingAssetForm from "@/components/admin/BrandingAssetForm";
import SettingsForm from "@/components/admin/SettingsForm";
import { getLocalSettings } from "@/lib/cms-local-store";

export const dynamic = "force-dynamic";

const SPECS = {
  logo: { title: "Logo", group: "general" as const, keyName: "site_logo", acceptHint: "Width: 121 px - Height: 60 px" },
  favicon: { title: "Favicon", group: "general" as const, keyName: "site_favicon" },
  video: { title: "Video mp4", group: "home" as const, keyName: "home_hero_video_url", extraKey: "home_hero_poster", extraLabel: "Poster" },
  slideshow: { title: "Slideshow", group: "home" as const, keyName: "home_hero_poster", extraKey: "home_hero_slides", extraLabel: "Slides JSON" },
};

export default async function AdminBrandingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (type === "social") {
    const [appearance, social] = await Promise.all([getLocalSettings("appearance"), getLocalSettings("social")]);
    return (
      <SettingsForm
        title="Mạng xã hội Footer"
        group="social"
        sections={[
          {
            title: "Liên kết mạng xã hội",
            fields: [
              { key: "facebook_url", label: "Facebook" },
              { key: "youtube_url", label: "YouTube" },
              { key: "zalo_url", label: "Zalo" },
              { key: "instagram_url", label: "Instagram" },
            ],
          },
        ]}
        initial={{
          facebook_url: social.facebook_url || appearance.social_facebook || "",
          youtube_url: social.youtube_url || appearance.social_youtube || "",
          zalo_url: social.zalo_url || appearance.social_zalo || "",
          instagram_url: social.instagram_url || appearance.social_instagram || "",
        }}
      />
    );
  }

  const spec = SPECS[type as keyof typeof SPECS];
  if (!spec) notFound();
  const initial = await getLocalSettings(spec.group);
  return (
    <BrandingAssetForm
      title={spec.title}
      group={spec.group}
      keyName={spec.keyName}
      extraKey={"extraKey" in spec ? spec.extraKey : undefined}
      extraLabel={"extraLabel" in spec ? spec.extraLabel : undefined}
      acceptHint={"acceptHint" in spec ? spec.acceptHint : undefined}
      initial={initial}
    />
  );
}
