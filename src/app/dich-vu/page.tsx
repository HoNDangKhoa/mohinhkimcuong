import type { Metadata } from "next";
import {
  ArchiveLayout,
  BreadcrumbJsonLd,
  CollectionJsonLd,
} from "@/components/content/PageLayouts";
import { getCmsGeneralSettings } from "@/lib/cms-settings";
import { fetchCmsSeoSettings } from "@/lib/cms-seo";
import { getCmsCollection } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

const FALLBACK_DESCRIPTION =
  "Danh mục dịch vụ Diamond Model gồm tư vấn sa bàn, thi công, thiết kế 3D phối cảnh và bảo trì mô hình, được trình bày theo dạng blog/portfolio rõ ràng.";

export async function generateMetadata(): Promise<Metadata> {
  const [seoSettings, generalSettings] = await Promise.all([
    fetchCmsSeoSettings(),
    getCmsGeneralSettings(),
  ]);

  const siteName = generalSettings?.siteName || "Diamond Model";
  const description = seoSettings?.siteDescription || FALLBACK_DESCRIPTION;

  return {
    title: `Dịch vụ | ${siteName}`,
    description,
    alternates: { canonical: "/dich-vu" },
    openGraph: {
      title: `Dịch vụ | ${siteName}`,
      description,
      url: "/dich-vu",
      type: "website",
    },
  };
}

export default async function DichVuPage() {
  const collection = await getCmsCollection("dich-vu");
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Dịch vụ", href: "/dich-vu" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionJsonLd collection={collection} url="/dich-vu" />
      <ArchiveLayout collection={collection} items={collection.items} breadcrumbs={breadcrumbs} />
    </>
  );
}
