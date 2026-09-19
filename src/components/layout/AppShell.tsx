import { headers } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import { getCmsAboutPageSlug, getCmsAppearanceSettings, getCmsGeneralSettings } from "@/lib/cms-settings";
import { buildSiteNavItems } from "@/lib/site-nav";

export default async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") || "";
  if (pathname.startsWith("/admin")) return children;

  const [generalSettings, aboutPageSlug, appearance] = await Promise.all([
    getCmsGeneralSettings(),
    getCmsAboutPageSlug(),
    getCmsAppearanceSettings(),
  ]);
  const logoSrc = generalSettings?.siteLogo || undefined;
  const footerBadgeSrc = generalSettings?.footerBadge || undefined;
  const navItems = appearance.navItems.length ? appearance.navItems : buildSiteNavItems(aboutPageSlug);

  return (
    <>
      <Header logoSrc={logoSrc} navItems={navItems} phoneHref={appearance.phoneHref} />
      <main className="flex flex-col gap-[50px]">{children}</main>
      <Footer
        logoSrc={logoSrc}
        footerBadgeSrc={footerBadgeSrc}
        appearance={appearance}
      />
      <FloatingContact ctaLabel={appearance.floatingCtaLabel} />
    </>
  );
}
