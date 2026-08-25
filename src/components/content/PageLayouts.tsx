import Image from "next/image";
import Link from "next/link";
import { ArrowLongRightIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { ArticleItem, ArticleMeta, ArticleSection, ArchiveCollection } from "@/lib/site-content";
import { SITE_URL } from "@/lib/site-content";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";
import ShareToolbar from "@/components/content/ShareToolbar";
import { CARD_DESC_CLASS, CARD_TITLE_CLASS } from "@/components/ui/cardTypography";

type Crumb = {
  label: string;
  href: string;
};

type RichTextPart =
  | { type: "html"; html: string }
  | { type: "image"; src: string; alt: string; width: number; height: number };

const RICHTEXT_IMAGE_PATTERN = /<p\b[^>]*>\s*(<img\b[^>]*>)\s*<\/p>|(<img\b[^>]*>)/gi;
const ATTRIBUTE_PATTERN = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>/]+))/g;

function parseHtmlAttributes(html: string) {
  const attributes: Record<string, string> = {};
  let match: RegExpExecArray | null;

  while ((match = ATTRIBUTE_PATTERN.exec(html)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] || match[3] || match[4] || "";
  }

  return attributes;
}

function parseImageDimension(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const numericValue = Number.parseInt(value, 10);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallback;
}

function parseRichTextParts(contentHtml: string): RichTextPart[] {
  const parts: RichTextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = RICHTEXT_IMAGE_PATTERN.exec(contentHtml)) !== null) {
    const htmlBefore = contentHtml.slice(lastIndex, match.index).trim();
    if (htmlBefore) parts.push({ type: "html", html: htmlBefore });

    const imageHtml = match[1] || match[2] || "";
    const attributes = parseHtmlAttributes(imageHtml);
    if (attributes.src) {
      parts.push({
        type: "image",
        src: attributes.src,
        alt: attributes.alt || attributes.title || "",
        width: parseImageDimension(attributes.width, 1200),
        height: parseImageDimension(attributes.height, 750),
      });
    }

    lastIndex = RICHTEXT_IMAGE_PATTERN.lastIndex;
  }

  const htmlAfter = contentHtml.slice(lastIndex).trim();
  if (htmlAfter) parts.push({ type: "html", html: htmlAfter });

  return parts.length ? parts : [{ type: "html", html: contentHtml }];
}

function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const rootClass =
    tone === "dark"
      ? "flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-white/55"
      : "flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-[#8a8277]";
  const separatorClass = tone === "dark" ? "text-white/20" : "text-[#c9bfaf]";
  const currentClass = tone === "dark" ? "text-white" : "text-[#6b95a2]";
  const linkClass =
    tone === "dark" ? "transition hover:text-white" : "transition hover:text-[#6b95a2]";

  return (
    <nav aria-label="Breadcrumb" className={rootClass}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.href}-${item.label}`} className="inline-flex items-center gap-2">
            {isLast ? (
              <span className={currentClass}>{item.label}</span>
            ) : (
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            )}
            {isLast ? null : <span className={separatorClass}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}

function MetaPills({ meta }: { meta: ArticleMeta[] }) {
  const visibleMeta = meta.filter((item) => !["Chuyên mục", "Hạng mục"].includes(item.label));
  if (visibleMeta.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {visibleMeta.map((item) => (
        <span
          key={`${item.label}-${item.value}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#e4d9ca] bg-white px-3 py-1.5 text-[12px] text-[#5c564f]"
        >
          <span className="uppercase tracking-[0.1em] text-[#8a8277]">{item.label}</span>
          <span className="font-medium text-[#4f4b46]">{item.value}</span>
        </span>
      ))}
    </div>
  );
}

function SectionImage({
  image,
}: {
  image: NonNullable<ArticleSection["image"]>;
}) {
  return (
    <figure className="mt-5 overflow-hidden rounded-[18px] border border-[#ede2d3] bg-[#f8f2e8]">
      <div className="relative aspect-[16/10]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 860px"
          className="object-cover"
          quality={90}
        />
      </div>
      {image.caption ? <figcaption className="px-4 py-3 text-[13px] leading-6 text-[#6f675d]">{image.caption}</figcaption> : null}
    </figure>
  );
}

function ArticleBody({
  sections,
  contentHtml,
}: {
  sections: ArticleSection[];
  contentHtml?: string;
}) {
  if (contentHtml) {
    const richTextParts = parseRichTextParts(contentHtml);

    return (
      <section id={sections[0]?.id || "noi-dung"} className="scroll-mt-28">
        <div className="cms-richtext">
          {richTextParts.map((part, index) => {
            if (part.type === "image") {
              return (
                <figure key={`${part.src}-${index}`} className="cms-richtext-image">
                  <Image
                    src={part.src}
                    alt={part.alt}
                    width={part.width}
                    height={part.height}
                    sizes="(max-width: 1024px) 100vw, 860px"
                    className="mx-auto h-auto max-h-[82vh] w-auto max-w-full rounded-[18px]"
                    quality={90}
                    unoptimized={/\.svg(\?.*)?$/i.test(part.src)}
                  />
                </figure>
              );
            }

            return (
              <div
                key={`html-${index}`}
                dangerouslySetInnerHTML={{ __html: part.html }}
              />
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="font-display text-[44px] font-semibold uppercase leading-[1.05] text-[#4f4b46]">
            {section.title}
          </h2>
          <div className="mt-4 space-y-4 text-[15px] leading-8 text-[#5d5751]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {section.bullets && section.bullets.length > 0 ? (
            <ul className="mt-5 space-y-3 rounded-[18px] border border-[#ece0d0] bg-[#fffdfa] px-5 py-4 text-[15px] leading-7 text-[#5d5751]">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#6b95a2] shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {section.image ? <SectionImage image={section.image} /> : null}
        </section>
      ))}
    </div>
  );
}

function Toc({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="rounded-[18px] border border-[#e7ddd0] bg-white p-5 shadow-[0_12px_28px_rgba(25,35,38,0.06)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7c7469]">Nội dung</p>
      <ol className="mt-4 space-y-3 text-[14px] leading-6 text-[#4f4b46]">
        {sections.map((section, index) => (
          <li key={section.id} className="flex gap-3">
            <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3ece1] text-[11px] font-semibold text-[#6b95a2]">
              {index + 1}
            </span>
            <a href={`#${section.id}`} className="transition hover:text-[#6b95a2]">
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArticleLinkCard({ item, tone = "light" }: { item: ArticleItem; tone?: "light" | "dark" }) {
  const rootClass =
    tone === "dark"
      ? "group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/5 shadow-[0_18px_36px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
      : "group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e7ddd0] bg-white shadow-[0_12px_30px_rgba(25,35,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(25,35,38,0.1)]";
  const categoryClass =
    tone === "dark"
      ? "inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80"
      : "inline-flex rounded-full bg-[#f4eee4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b95a2]";
  const metaClass = tone === "dark" ? "inline-flex items-center gap-1 text-[12px] text-white/60" : "inline-flex items-center gap-1 text-[12px] text-[#8a8277]";
  const titleClass =
    tone === "dark"
      ? `ph-clamp-2 mt-3 min-h-[3rem] ${CARD_TITLE_CLASS} text-white transition group-hover:text-[#f1be7e]`
      : `ph-clamp-2 mt-3 min-h-[3rem] ${CARD_TITLE_CLASS} text-[#4f4b46] transition group-hover:text-[#6b95a2]`;
  const summaryClass =
    tone === "dark"
      ? `ph-clamp-2 mt-2 min-h-[2.75rem] ${CARD_DESC_CLASS} text-white/70`
      : `ph-clamp-2 mt-2 min-h-[2.75rem] ${CARD_DESC_CLASS} text-[#5d5751]`;
  const linkClass =
    tone === "dark"
      ? "mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#f1be7e] transition group-hover:text-white"
      : "mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b95a2] transition group-hover:text-[#4f4b46]";

  return (
    <Link
      href={`${item.categoryHref}/${item.slug}`.replace(/\/+/g, "/")}
      className={rootClass}
    >
      <div className="relative aspect-[16/10] bg-[#f4eee4]">
        <Image
          src={item.heroImage}
          alt={item.heroAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 420px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          quality={90}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={categoryClass}>{item.categoryLabel}</span>
          <span className={metaClass}>
            <CalendarDaysIcon className="h-4 w-4" />
            {item.dateLabel}
          </span>
          <span className={metaClass}>
            <ClockIcon className="h-4 w-4" />
            {item.readTime}
          </span>
        </div>
        <h3 className={titleClass}>
          {item.title}
        </h3>
        <p className={summaryClass}>{item.summary}</p>
        <span className={linkClass}>
          Xem chi tiết
          <ArrowLongRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function RelatedArticles({ items }: { items: ArticleItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="ph-section-surface pb-24">
      <div className="ph-container-wide">
        <div className="mx-auto max-w-[980px]">
          <p className="ph-eyebrow text-center">Tin liên quan</p>
          <div className="mt-3 text-center">
            <h2 className="ph-title">Xem thêm</h2>
          </div>
        </div>

        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
          {items.map((item) => (
            <ArticleLinkCard key={item.slug} item={item} tone="light" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleLayout({
  article,
  breadcrumbs,
  relatedItems,
  shareUrl,
  ctaHref = "/lien-he",
  ctaLabel = "Đặt lịch tư vấn",
}: {
  article: ArticleItem;
  breadcrumbs: Crumb[];
  relatedItems: ArticleItem[];
  shareUrl: string;
  ctaHref?: string;
  ctaLabel?: string;
  }) {
  return (
    <>
      <section className="bg-transparent pt-24 md:pt-28">
        <div className="ph-container">
          <Breadcrumbs items={breadcrumbs} />

          <header className="mx-auto mt-8 max-w-[980px] text-center">
            <p className="ph-eyebrow">{article.categoryLabel}</p>
            <h1 className="font-display mt-3 text-[44px] font-semibold uppercase leading-[1.05] text-[#6b95a2]">
              {article.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[820px] text-[16px] leading-8 text-[#5d5751] md:text-[18px]">
              {article.summary}
            </p>
            <MetaPills meta={article.meta} />
          </header>
        </div>
      </section>

      <section className="ph-section-surface pb-20 pt-12 md:pt-14">
        <div className="ph-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <article className="space-y-10">
              <figure className="overflow-hidden rounded-[18px] border border-[#ede2d3] bg-white shadow-[0_16px_40px_rgba(25,35,38,0.06)]">
                <div className="relative aspect-[16/9]">
                <Image
                  src={article.heroImage}
                  alt={article.heroAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 860px"
                  className="object-cover"
                  quality={90}
                />
                </div>
              </figure>

              <ArticleBody sections={article.sections} contentHtml={article.contentHtml} />

              <div className="rounded-[18px] border border-[#e7ddd0] bg-[#f8f2e8] p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7c7469]">Hành động tiếp theo</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-full bg-[#6b95a2] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#5c8794]"
                  >
                    {ctaLabel}
                  </Link>
                  <a
                    href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`}
                    className="inline-flex items-center justify-center rounded-full border border-[#d6cbb9] bg-white px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#4f4b46] transition hover:border-[#6b95a2] hover:text-[#6b95a2]"
                  >
                    Gọi {DIAMOND_VN_COMPANY.phone}
                  </a>
                </div>
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24">
              {article.sections.length > 0 ? <Toc sections={article.sections} /> : null}
              <ShareToolbar url={shareUrl} title={article.title} />
              {article.tags.length > 0 ? (
                <div className="rounded-[18px] border border-[#e7ddd0] bg-white p-5 shadow-[0_12px_28px_rgba(25,35,38,0.06)]">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7c7469]">Từ khóa</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full bg-[#f4eee4] px-3 py-1 text-[12px] font-medium text-[#4f4b46]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <RelatedArticles items={relatedItems} />
    </>
  );
}

export function ArchiveLayout({
  collection,
  items,
  breadcrumbs,
}: {
  collection: ArchiveCollection;
  items: ArticleItem[];
  breadcrumbs: Crumb[];
}) {
  return (
    <>
      <section className="bg-transparent pt-24 md:pt-28">
        <div className="ph-container-wide">
          <Breadcrumbs items={breadcrumbs} />

          <header className="mx-auto mt-10 max-w-[900px] text-center">
            <h1 className="font-display text-[44px] font-semibold uppercase leading-[1.05] text-[#45413d]">
              {collection.label}
            </h1>
            <p className="ph-clamp-2 mx-auto mt-4 max-w-[760px] text-[16px] leading-8 text-[#5d5751] md:text-[18px]">
              {collection.description}
            </p>
          </header>

        </div>
      </section>

      <section className="ph-section-surface pb-24">
        <div className="ph-container-wide">
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ArticleLinkCard key={item.slug} item={item} tone="light" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, SITE_URL).toString(),
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export function ArticleJsonLd({ article, url }: { article: ArticleItem; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: [new URL(article.heroImage, SITE_URL).toString()],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: DIAMOND_VN_COMPANY.fullName,
    },
    publisher: {
      "@type": "Organization",
      name: DIAMOND_VN_COMPANY.fullName,
      logo: {
        "@type": "ImageObject",
        url: new URL(DIAMOND_VN_COMPANY.logo, SITE_URL).toString(),
      },
    },
    mainEntityOfPage: new URL(url, SITE_URL).toString(),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export function CollectionJsonLd({
  collection,
  url,
}: {
  collection: ArchiveCollection;
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: new URL(url, SITE_URL).toString(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: collection.items.length,
      itemListElement: collection.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: new URL(`${collection.slug}/${item.slug}`, SITE_URL).toString(),
        name: item.title,
      })),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
