import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site-content";
import { getCmsRelatedArticles, getCmsStaticPageBySlug } from "@/lib/cms-content";
import { fetchCmsSeoMetadata, mapCmsSeoMetadataToNext } from "@/lib/cms-seo";
import {
  ArticleJsonLd,
  ArticleLayout,
  BreadcrumbJsonLd,
} from "@/components/content/PageLayouts";

type StaticPageRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: StaticPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const [seo, article] = await Promise.all([
    fetchCmsSeoMetadata("page", slug),
    getCmsStaticPageBySlug(slug),
  ]);

  if (seo) return mapCmsSeoMetadataToNext(seo);
  if (!article) return {};

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/${slug}`,
      type: "article",
      images: article.heroImage ? [article.heroImage] : undefined,
    },
  };
}

export default async function CmsStaticPage({ params }: StaticPageRouteProps) {
  const { slug } = await params;
  const article = await getCmsStaticPageBySlug(slug);

  if (!article) notFound();

  const href = `/${slug}`;
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: article.title, href },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd article={article} url={href} />
      <ArticleLayout
        article={article}
        breadcrumbs={breadcrumbs}
        relatedItems={await getCmsRelatedArticles(article)}
        shareUrl={`${SITE_URL}${href}`}
        ctaHref="/lien-he"
        ctaLabel="Đặt lịch tư vấn"
      />
    </>
  );
}
