"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { CARD_TITLE_CLASS } from "@/components/ui/cardTypography";
import { COMPANY } from "@/lib/constants";

export default function VideoSection() {
  return (
    <section className="py-28 md:py-32 bg-cream-50 relative overflow-hidden" id="video">
      <div className="container-custom section-padding">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <p className="section-label mb-3">Năng lực của chúng tôi</p>
          <div className="gold-line-center mb-6" />
          <h2 className="section-title">
            Khám Phá <span className="text-primary-400">Diamond Model</span>
          </h2>
        </AnimatedSection>

        {/* Video embed  */}
        <AnimatedSection className="max-w-4xl mx-auto" delay={200}>
          <div className="relative aspect-video bg-dark-900 border border-cream-300/30 shadow-2xl overflow-hidden group">
            <iframe
              src={COMPANY.youtube}
              title="Diamond Model - Quy trình sản xuất mô hình kiến trúc"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </AnimatedSection>

        {/* Video thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
          {[
            { title: "Quy trình sản xuất tại xưởng", icon: "🏭" },
            { title: "Quá trình thi công tại công trình", icon: "🏗️" },
            { title: "Trải nghiệm khách hàng", icon: "⭐" },
          ].map((item, i) => (
            <AnimatedSection key={item.title} animation="fade-up" delay={300 + i * 100}>
              <div className="bg-cream-50 border border-cream-200 p-6 text-center group hover:border-gold-300/50 transition-all cursor-pointer card-lift">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className={`ph-clamp-2 mt-3 min-h-[3rem] ${CARD_TITLE_CLASS} text-dark-800 group-hover:text-primary-400 transition-colors`}>
                  {item.title}
                </h3>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
