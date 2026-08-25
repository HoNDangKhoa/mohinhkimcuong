import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleJsonLd,
  ArticleLayout,
  BreadcrumbJsonLd,
} from "@/components/content/PageLayouts";
import {
  PROJECT_ARTICLES,
  SITE_URL,
} from "@/lib/site-content";
import { getCmsArticleBySlug, getCmsRelatedArticles } from "@/lib/cms-content";
import { fetchCmsSeoMetadata, mapCmsSeoMetadataToNext } from "@/lib/cms-seo";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return PROJECT_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seo = await fetchCmsSeoMetadata("project", slug);
  const article = await getCmsArticleBySlug("du-an", slug);

  if (!article) {
    return {};
  }

  if (seo) {
    return mapCmsSeoMetadataToNext(seo);
  }

  return {
    title: `${article.title} | Dự án Diamond Model`,
    description: article.summary,
    alternates: { canonical: `/du-an/${article.slug}` },
    openGraph: {
      title: `${article.title} | Dự án Diamond Model`,
      description: article.summary,
      url: `/du-an/${article.slug}`,
      type: "article",
    },
  };
}

export default async function DuAnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getCmsArticleBySlug("du-an", slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/du-an" },
    { label: article.title, href: `/du-an/${article.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ArticleJsonLd article={article} url={`/du-an/${article.slug}`} />
      <ArticleLayout
        article={article}
        breadcrumbs={breadcrumbs}
        relatedItems={await getCmsRelatedArticles(article, "du-an")}
        shareUrl={`${SITE_URL}/du-an/${article.slug}`}
        ctaHref="/lien-he"
        ctaLabel="Đặt lịch tư vấn"
      />
    </>
  );
}
