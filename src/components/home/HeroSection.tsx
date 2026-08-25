"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/lib/cms-settings";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";

const HERO_AUTO_MS = 3000;

const fallbackSlides: HeroSlide[] = (DIAMOND_VN_COMPANY.heroSlides ?? [DIAMOND_VN_COMPANY.heroPoster]).map(
  (url) => ({ type: "image", url, alt: "Diamond Model hero" }),
);

export default function HeroSection({ slides: cmsSlides = [] }: { slides?: HeroSlide[] }) {
  const slides = cmsSlides.length > 0 ? cmsSlides : fallbackSlides;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, HERO_AUTO_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.url}-${index}`}
            className={[
              "absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <div className="relative h-full w-full">
              {slide.type === "video" ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={index === 0 ? "auto" : "metadata"}
                  poster={slide.poster || undefined}
                  aria-label={slide.alt || undefined}
                >
                  <source src={slide.url} />
                </video>
              ) : (
                <Image
                  src={slide.url}
                  alt={slide.alt || ""}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  quality={85}
                  unoptimized={/\.svg(\?.*)?$/i.test(slide.url)}
                  className="object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/35" />

      <a href="#mission" className="ph-scroll-indicator">
        <span className="ph-scroll-copy">
          <span>SCROLL</span>
          <span>DOWN</span>
        </span>
        <span className="ph-scroll-chevrons" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </a>
    </section>
  );
}
