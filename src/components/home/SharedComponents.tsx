import Image from "next/image";
import { CARD_TITLE_CLASS } from "@/components/ui/cardTypography";

export type ProjectCardItem = {
  title: string;
  image: string;
  meta1: string;
  meta2: string;
  meta2Type: "area" | "bedroom" | "scale";
};

export function SectionHeading({
  eyebrow,
  title,
  center = true,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "ph-section-header" : ""}>
      {eyebrow ? <p className="ph-eyebrow">{eyebrow}</p> : null}
      <h2 className="ph-title mt-3">{title}</h2>
    </div>
  );
}

export function MetaIcon({ type }: { type: "area" | "bedroom" | "scale" }) {
  const src =
    type === "area"
      ? "/diamond-vn/icons/area.svg"
      : type === "bedroom"
        ? "/diamond-vn/icons/pn-ico.svg"
        : "/diamond-vn/icons/scale.svg";

  return <Image src={src} alt="" width={16} height={16} className="h-4 w-4 shrink-0 opacity-[0.65]" loading="lazy" />;
}

export function ProjectCard({
  item,
  badge,
}: {
  item: ProjectCardItem;
  badge: string;
}) {
  const summary = `${item.meta1} · ${item.meta2}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e7ddd0] bg-white shadow-[0_12px_30px_rgba(25,35,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(25,35,38,0.1)]">
      <div className="relative aspect-[16/10] bg-[#f4eee4]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 458px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="eager"
          quality={90}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-[#f4eee4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b95a2]">
            {badge}
          </span>
          <span className="text-[12px] text-[#8a8277]">{item.meta1}</span>
          <span className="text-[12px] text-[#8a8277]">{item.meta2}</span>
        </div>
        <h3 className={`ph-clamp-2 mt-4 min-h-[3rem] ${CARD_TITLE_CLASS} text-[#4f4b46]`}>{item.title}</h3>
        <p className="ph-clamp-2 mt-2 min-h-[2.75rem] text-[14px] leading-[1.65] tracking-normal text-[#5d5751]">
          {summary}
        </p>
      </div>
    </article>
  );
}

export function VideoCard({ image, title, href }: { image: string; title: string; href?: string }) {
  const content = (
    <>
      <div className="relative overflow-hidden rounded-[8px] bg-black">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover opacity-[0.84]"
            loading="lazy"
            quality={90}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-2xl text-white">
            ▶
          </span>
        </div>
      </div>
      <h3 className={`ph-clamp-2 mt-3 min-h-[3rem] text-center ${CARD_TITLE_CLASS} text-[#4f4b46]`}>{title}</h3>
    </>
  );

  if (!href) {
    return <div className="w-[86vw] max-w-[520px] shrink-0 lg:w-[34%]">{content}</div>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block w-[86vw] max-w-[520px] shrink-0 lg:w-[34%]">
      {content}
    </a>
  );
}
