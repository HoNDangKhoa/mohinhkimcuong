import type { Metadata } from "next";
import {
  ArchiveLayout,
  BreadcrumbJsonLd,
  CollectionJsonLd,
} from "@/components/content/PageLayouts";
import { getCmsGeneralSettings } from "@/lib/cms-settings";
import { getArchivePageSeo } from "@/lib/cms-seo";
import { getCmsCollection } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

const FALLBACK_DESCRIPTION =
  "Tin tức và cảm hứng về mô hình kiến trúc, sa bàn, vật liệu và cách trình bày dự án, trình bày theo dạng blog chuẩn SEO.";

export async function generateMetadata(): Promise<Metadata> {
  const [archiveSeo, generalSettings] = await Promise.all([
    getArchivePageSeo("articles"),
    getCmsGeneralSettings(),
  ]);

  const siteName = generalSettings?.siteName || "Diamond Model";
  const title = archiveSeo.title || `Tin tức | ${siteName}`;
  const description = archiveSeo.description || FALLBACK_DESCRIPTION;

  return {
    title,
    description,
    keywords: archiveSeo.keywords.length ? archiveSeo.keywords : undefined,
    alternates: { canonical: "/tin-tuc" },
    openGraph: {
      title,
      description,
      url: "/tin-tuc",
      type: "website",
    },
  };
}

export default async function TinTucPage() {
  const collection = await getCmsCollection("tin-tuc");
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/tin-tuc" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CollectionJsonLd collection={collection} url="/tin-tuc" />
      <ArchiveLayout collection={collection} items={collection.items} breadcrumbs={breadcrumbs} />
    </>
  );
}
