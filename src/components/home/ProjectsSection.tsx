import Link from "next/link";
import { DIAMOND_VN_PROJECTS } from "@/lib/diamond-vn";
import type { ArticleItem } from "@/lib/site-content";
import { ProjectCard, type ProjectCardItem, SectionHeading } from "./SharedComponents";

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function articleHref(item: ArticleItem) {
  const base = item.categoryHref || "/du-an";
  return `${base}/${item.slug}`.replace(/\/{2,}/g, "/");
}

function matchProject(title: string, items: ArticleItem[]) {
  const needle = normalizeTitle(title);
  return items.find((item) => normalizeTitle(item.title) === needle);
}

function toGroupCards(items: ArticleItem[]) {
  return DIAMOND_VN_PROJECTS.map((group) => ({
    id: group.id,
    eyebrow: group.eyebrow,
    title: group.title,
    badge: group.badge,
    cta: group.cta,
    items: group.items.map((item): ProjectCardItem => {
      const article = matchProject(item.title, items);
      return {
        title: article?.title || item.title,
        image: article?.heroImage || item.image,
        meta1: item.meta1,
        meta2: item.meta2,
        meta2Type: item.meta2Type,
        href: article ? articleHref(article) : "/du-an",
      };
    }),
  }));
}

export default function ProjectsSection({ items = [] }: { items?: ArticleItem[] }) {
  const groups = toGroupCards(items);

  return (
    <div className="flex flex-col gap-[50px]">
      {groups.map((group) => (
        <section key={group.id} id={group.id} className="ph-section-surface scroll-mt-24">
          <div className="ph-container-wide">
            <SectionHeading eyebrow={group.eyebrow} title={group.title} />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <ProjectCard key={`${group.id}-${item.title}`} item={item} badge={group.badge} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/du-an" className="ph-button inline-flex">
                {group.cta}
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
