import Image from "next/image";
import { DIAMOND_VN_PRESS_LOGOS } from "@/lib/diamond-vn";
import { SectionHeading } from "./SharedComponents";

export default function PressSection() {
  return (
    <section id="press" className="ph-section-tight scroll-mt-24">
      <div className="ph-container">
        <SectionHeading eyebrow="" title="BÁO CHÍ NÓI VỀ DIAMOND MODEL" />
        <div className="mt-12 grid grid-cols-2 items-center gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
          {DIAMOND_VN_PRESS_LOGOS.map((logo, index) => (
            <div key={logo} className="relative flex min-h-[72px] items-center justify-center px-3">
              <Image
                src={logo}
                alt={`Báo chí ${index + 1}`}
                width={180}
                height={44}
                className="max-h-[44px] w-auto object-contain opacity-[0.95]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
