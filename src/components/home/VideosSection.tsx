"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { SERVICE_COLLECTION, type ArticleItem } from "@/lib/site-content";
import { CARD_DESC_CLASS, CARD_TITLE_CLASS } from "@/components/ui/cardTypography";
import { SectionHeading } from "./SharedComponents";
import { useCarouselInteraction } from "./useCarouselInteraction";

const AUTO_ADVANCE_MS = 3500;

function getSlidesPerView() {
  if (typeof window === "undefined") return 3;

  const width = window.innerWidth;
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

function getGapSize(slidesPerView: number) {
  if (slidesPerView >= 3) return 24;
  if (slidesPerView === 2) return 20;
  return 16;
}

function buildLoopedSlides<T>(slides: readonly T[], cloneCount: number) {
  if (cloneCount <= 0 || slides.length === 0) return [...slides];

  return [...slides.slice(-cloneCount), ...slides, ...slides.slice(0, cloneCount)];
}

type ServiceCard = ArticleItem;

function ServiceSlide({ item }: { item: ServiceCard }) {
  const href = `${item.categoryHref}/${item.slug}`.replace(/\/+/g, "/");
  const badge = item.tags[0] ?? item.categoryLabel;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#e7ddd0] bg-white shadow-[0_12px_30px_rgba(25,35,38,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(25,35,38,0.1)]"
    >
      <div className="relative aspect-[16/10] bg-[#f4eee4]">
        <Image
          src={item.heroImage}
          alt={item.heroAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 520px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="eager"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/8 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b95a2] shadow-sm">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#8a8277]">
          <span>{item.meta[0]?.value}</span>
          <span aria-hidden="true">•</span>
          <span>{item.meta[1]?.value}</span>
        </div>
        <h3 className={`ph-clamp-2 mt-3 min-h-[3rem] ${CARD_TITLE_CLASS} text-[#4f4b46] transition group-hover:text-[#6b95a2]`}>
          {item.title}
        </h3>
        <p className={`ph-clamp-2 mt-2 min-h-[2.75rem] ${CARD_DESC_CLASS} text-[#5d5751]`}>
          {item.summary}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6b95a2] transition group-hover:text-[#4f4b46]">
          Xem dịch vụ
          <ArrowLongRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function ServicesCarousel({ slidesPerView, items }: { slidesPerView: number; items: readonly ServiceCard[] }) {
  const services = items;
  const gapSize = getGapSize(slidesPerView);
  const cloneCount = Math.min(slidesPerView, services.length);
  const loopedSlides = useMemo(() => buildLoopedSlides(services, cloneCount), [cloneCount, services]);
  const [currentIndex, setCurrentIndex] = useState(() => cloneCount);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const { dragOffset, isDragging, pauseAuto, pauseUntilRef, bindDragHandlers } = useCarouselInteraction({
    onSwipeLeft: () => setCurrentIndex((index) => index + 1),
    onSwipeRight: () => setCurrentIndex((index) => index - 1),
  });

  useEffect(() => {
    if (services.length <= 1) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setCurrentIndex((index) => index + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [pauseUntilRef, services.length]);

  const activeSlide =
    ((currentIndex - cloneCount) % services.length + services.length) % services.length;

  const goToIndex = (nextIndex: number) => {
    if (services.length <= 1) return;
    pauseAuto();
    setTransitionEnabled(true);
    setCurrentIndex(nextIndex);
  };

  const handleTransitionEnd = () => {
    if (services.length <= 1) return;

    if (currentIndex >= cloneCount + services.length) {
      setTransitionEnabled(false);
      setCurrentIndex(cloneCount);
      window.requestAnimationFrame(() => setTransitionEnabled(true));
      return;
    }

    if (currentIndex < cloneCount) {
      setTransitionEnabled(false);
      setCurrentIndex(cloneCount + services.length - 1);
      window.requestAnimationFrame(() => setTransitionEnabled(true));
    }
  };

  const slideWidth = `calc((100% - ${(slidesPerView - 1) * gapSize}px) / ${slidesPerView})`;
  const slideStep = `((100% - ${(slidesPerView - 1) * gapSize}px) / ${slidesPerView} + ${gapSize}px)`;

  return (
    <div className="mt-12">
      <div
        className="overflow-hidden"
        style={{
          width: "calc(100% + (50vw - 50%))",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        <div
          {...bindDragHandlers}
          className="flex items-stretch select-none"
          style={{
            gap: `${gapSize}px`,
            transform: `translate3d(calc(-1 * ${currentIndex} * ${slideStep} + ${dragOffset}px), 0, 0)`,
            transition: isDragging || !transitionEnabled ? "none" : "transform 700ms ease-out",
            touchAction: "pan-y",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopedSlides.map((item, index) => {
            return (
              <div key={`${item.slug}-${index}`} className="shrink-0" style={{ width: slideWidth }}>
                <ServiceSlide item={item} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToIndex(currentIndex - 1)}
          aria-label="Trang trước"
          className="hidden h-10 w-10 items-center justify-center rounded-[8px] text-[#8e8e8e] transition hover:bg-[#f4efe7] hover:text-[#d5a24f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a24f]/40 md:inline-flex"
        >
          <ArrowLongLeftIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          {services.map((_, serviceIndex) => {
            const active = serviceIndex === activeSlide;

            return (
              <button
                key={`service-dot-${serviceIndex}`}
                type="button"
                onClick={() => goToIndex(cloneCount + serviceIndex)}
                aria-label={`Chuyển tới dịch vụ ${serviceIndex + 1}`}
                aria-current={active ? "true" : undefined}
                className={[
                  "h-2.5 w-2.5 rounded-[8px] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a24f]/40",
                  active
                    ? "border-[#d5a24f] bg-[#d5a24f] shadow-[0_0_0_3px_rgba(213,162,79,0.18)]"
                    : "border-[#eee4d6] bg-[#eee4d6] hover:border-[#d5a24f]/40 hover:bg-[#e8d7bc]",
                ].join(" ")}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => goToIndex(currentIndex + 1)}
          aria-label="Trang sau"
          className="hidden h-10 w-10 items-center justify-center rounded-[8px] text-[#8e8e8e] transition hover:bg-[#f4efe7] hover:text-[#d5a24f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a24f]/40 md:inline-flex"
        >
          <ArrowLongRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default function VideosSection({ items = SERVICE_COLLECTION.items }: { items?: ArticleItem[] }) {
  const [slidesPerView, setSlidesPerView] = useState(3);
  const displayItems = useMemo(() => {
    const featured = items.filter((item) => item.isFeatured);
    return featured.length ? featured : items;
  }, [items]);

  useEffect(() => {
    const updateSlidesPerView = () => setSlidesPerView(getSlidesPerView());

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  return (
    <section id="services" className="ph-section-surface scroll-mt-24">
      <div className="ph-container-wide">
        <SectionHeading eyebrow="Dịch vụ của chúng tôi" title="DỊCH VỤ NỔI BẬT" />
        <ServicesCarousel key={slidesPerView} slidesPerView={slidesPerView} items={displayItems} />
      </div>
    </section>
  );
}
