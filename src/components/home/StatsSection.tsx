"use client";

import Image from "next/image";
import { useState } from "react";
import { DIAMOND_VN_VALUES } from "@/lib/diamond-vn";
import type { HomeStatsMetric, HomeStatsSettings } from "@/lib/cms-settings";
import { SectionHeading } from "./SharedComponents";

type LayoutItem = HomeStatsMetric & {
  className: string;
  sizeClass: string;
};

const DEFAULT_STATS_SETTINGS: HomeStatsSettings = {
  eyebrow: "Diamond Model đã thực hiện",
  title: "GIÁ TRỊ CHÚNG TÔI ĐÃ TRAO ĐI",
  defaultImage: "/diamond-vn/home/value-customer-01.webp",
  backgroundImage: "",
  metrics: DIAMOND_VN_VALUES.map((item) => ({ ...item })),
};

const BUBBLE_LAYOUT: Array<{
  metricIndex: number;
  className: string;
  sizeClass: string;
}> = [
  {
    metricIndex: 1,
    className:
      "left-0 top-[28%] sm:left-[3%] sm:top-[27%] lg:left-[4%] lg:top-[27%]",
    sizeClass: "h-[140px] w-[140px] sm:h-[176px] sm:w-[176px] lg:h-[192px] lg:w-[192px]",
  },
  {
    metricIndex: 0,
    className: "left-1/2 top-0 -translate-x-1/2",
    sizeClass: "h-[164px] w-[164px] sm:h-[198px] sm:w-[198px] lg:h-[200px] lg:w-[200px]",
  },
  {
    metricIndex: 2,
    className:
      "right-0 top-[34%] sm:right-[3%] sm:top-[34%] lg:right-[4%] lg:top-[34%]",
    sizeClass: "h-[140px] w-[140px] sm:h-[176px] sm:w-[176px] lg:h-[192px] lg:w-[192px]",
  },
  {
    metricIndex: 3,
    className:
      "bottom-[1%] left-[25%] sm:left-[29%] lg:left-[30%]",
    sizeClass: "h-[128px] w-[128px] sm:h-[160px] sm:w-[160px] lg:h-[168px] lg:w-[168px]",
  },
];

function buildValueLayout(metrics: HomeStatsMetric[]): LayoutItem[] {
  const normalizedMetrics = metrics.length ? metrics : DEFAULT_STATS_SETTINGS.metrics;

  return BUBBLE_LAYOUT.map((layout) => {
    const fallback = DEFAULT_STATS_SETTINGS.metrics[layout.metricIndex] || DEFAULT_STATS_SETTINGS.metrics[0];
    const metric = normalizedMetrics[layout.metricIndex] || fallback;

    return {
      value: metric.value || fallback.value,
      label: metric.label || fallback.label,
      image: metric.image || fallback.image,
      className: layout.className,
      sizeClass: layout.sizeClass,
    };
  });
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="text-[42px] font-semibold leading-none text-[#6b95a2] sm:text-[50px] lg:text-[58px]">{value}</div>
      <div className="whitespace-pre-line text-[12px] uppercase leading-tight text-[#6b95a2] sm:text-[13px]">
        {label}
      </div>
    </div>
  );
}

function ValueBubble({
  item,
  active,
  onActivate,
}: {
  item: LayoutItem;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${item.value} ${item.label}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={[
        "absolute z-20 inline-flex items-center justify-center rounded-full border text-center outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#6b95a2]/25",
        item.className,
        item.sizeClass,
        active
          ? "border-transparent bg-[#f0bc73] shadow-[0_18px_34px_rgba(139,104,53,0.18)]"
          : "border-[#d9d3c8] bg-white shadow-[0_16px_30px_rgba(52,44,34,0.08)] hover:border-[#cfc7bb]",
      ].join(" ")}
    >
      <Metric value={item.value} label={item.label} />
    </button>
  );
}

export default function StatsSection({ settings }: { settings?: HomeStatsSettings }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const stats = settings || DEFAULT_STATS_SETTINGS;
  const valueLayout = buildValueLayout(stats.metrics);
  const centerImage = activeImage || stats.defaultImage || DEFAULT_STATS_SETTINGS.defaultImage;

  return (
    <section
      id="stats"
      className="ph-section-surface"
      style={stats.backgroundImage ? {
        backgroundImage: `url(${stats.backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      } : undefined}
    >
      <div className="ph-container-wide">
        <SectionHeading eyebrow={stats.eyebrow} title={stats.title} />

        <div
          className="relative mx-auto mt-6 min-h-[430px] max-w-[1240px] overflow-visible sm:min-h-[500px] lg:mt-8 lg:min-h-[580px]"
          onMouseLeave={() => setActiveImage(null)}
        >
          <div className="absolute left-1/2 top-1/2 h-[264px] w-[264px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#f1ebe2] sm:h-[378px] sm:w-[378px] lg:h-[480px] lg:w-[480px]">
            {centerImage ? (
              <Image
                key={centerImage}
                src={centerImage}
                alt=""
                fill
                sizes="(max-width: 1024px) 264px, 480px"
                className="object-cover animate-fade-in"
                loading="eager"
                aria-hidden="true"
                quality={90}
              />
            ) : null}
          </div>

          <div className="absolute inset-0">
            {valueLayout.map((item) => (
              <ValueBubble
                key={item.label}
                item={item}
                active={activeImage === item.image}
                onActivate={() => setActiveImage(item.image)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

