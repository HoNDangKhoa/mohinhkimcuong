import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/ui/FloatingContact";
import { getCmsAboutPageSlug, getCmsGeneralSettings } from "@/lib/cms-settings";
import { buildSiteNavItems } from "@/lib/site-nav";

export default async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [generalSettings, aboutPageSlug] = await Promise.all([
    getCmsGeneralSettings(),
    getCmsAboutPageSlug(),
  ]);
  const logoSrc = generalSettings?.siteLogo || undefined;
  const footerBadgeSrc = generalSettings?.footerBadge || undefined;
  const navItems = buildSiteNavItems(aboutPageSlug);

  return (
    <>
      <Header logoSrc={logoSrc} navItems={navItems} />
      <main className="flex flex-col gap-[50px]">{children}</main>
      <Footer logoSrc={logoSrc} footerBadgeSrc={footerBadgeSrc} />
      <FloatingContact />
    </>
  );
}
