import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleJsonLd,
  ArticleLayout,
  BreadcrumbJsonLd,
} from "@/components/content/PageLayouts";
import {
  SERVICE_ARTICLES,
  SITE_URL,
} from "@/lib/site-content";
import { getCmsArticleBySlug, getCmsRelatedArticles } from "@/lib/cms-content";
import { fetchCmsSeoMetadata, mapCmsSeoMetadataToNext } from "@/lib/cms-seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await fetchCmsSeoMetadata("service", slug);
  const article = await getCmsArticleBySlug("dich-vu", slug);

  if (!article) {
    return {};
  }

  if (seo) {
    return mapCmsSeoMetadataToNext(seo);
  }

  return {
    title: `${article.title} | Dịch vụ Diamond Model`,
    description: article.summary,
    alternates: { canonical: `/dich-vu/${article.slug}` },
    openGraph: {
      title: `${article.title} | Dịch vụ Diamond Model`,
      description: article.summary,
      url: `/dich-vu/${article.slug}`,
      type: "article",
    },
  };
}

export default async function DichVuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getCmsArticleBySlug("dich-vu", slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Dịch vụ", href: "/dich-vu" },
    { label: article.title, href: `/dich-vu/${article.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd article={article} url={`/dich-vu/${article.slug}`} />
      <ArticleLayout
        article={article}
        breadcrumbs={breadcrumbs}
        relatedItems={await getCmsRelatedArticles(article, "dich-vu")}
        shareUrl={`${SITE_URL}/dich-vu/${article.slug}`}
        ctaHref="/lien-he"
        ctaLabel="Đặt lịch tư vấn"
      />
    </>
  );
}
