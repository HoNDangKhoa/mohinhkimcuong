import type { Metadata } from "next";
import {
  CollectionJsonLd,
  ArchiveLayout,
  BreadcrumbJsonLd,
} from "@/components/content/PageLayouts";
import { getCmsGeneralSettings } from "@/lib/cms-settings";
import { getArchivePageSeo } from "@/lib/cms-seo";
import { getCmsCollection } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

const FALLBACK_DESCRIPTION =
  "Danh mục dự án sa bàn và mô hình kiến trúc Diamond Model được trình bày theo dạng blog/portfolio với các card chi tiết, phù hợp cho SEO và điều hướng nội dung.";

export async function generateMetadata(): Promise<Metadata> {
  const [archiveSeo, generalSettings] = await Promise.all([
    getArchivePageSeo("projects"),
    getCmsGeneralSettings(),
  ]);

  const siteName = generalSettings?.siteName || "Diamond Model";
  const title = archiveSeo.title || `Dự án | ${siteName}`;
  const description = archiveSeo.description || FALLBACK_DESCRIPTION;

  return {
    title,
    description,
    keywords: archiveSeo.keywords.length ? archiveSeo.keywords : undefined,
    alternates: { canonical: "/du-an" },
    openGraph: {
      title,
      description,
      url: "/du-an",
      type: "website",
    },
  };
}

export default async function DuAnPage() {
  const collection = await getCmsCollection("du-an");
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/du-an" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionJsonLd collection={collection} url="/du-an" />
      <ArchiveLayout collection={collection} items={collection.items} breadcrumbs={breadcrumbs} />
    </>
  );
}
