"use client";

import Image from "next/image";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";
import { openAdviseModal } from "@/lib/advise-modal";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tư vấn & khảo sát",
    description: "Làm rõ mục tiêu trưng bày, tỷ lệ và phạm vi mô hình để chốt hướng triển khai.",
  },
  {
    step: "02",
    title: "Thiết kế 3D phối cảnh",
    description: "Dựng hình trực quan giúp chủ đầu tư duyệt phương án nhanh và chính xác hơn.",
  },
  {
    step: "03",
    title: "Thi công sa bàn",
    description: "Gia công, lắp ráp và hoàn thiện mô hình theo đúng bản vẽ, vật liệu và tiến độ.",
  },
  {
    step: "04",
    title: "Bảo trì & bàn giao",
    description: "Kiểm tra sau bàn giao, hỗ trợ vận hành và xử lý phát sinh trong quá trình trưng bày.",
  },
] as const;

export default function ProcessSection() {
  return (
    <section id="process" className="ph-section-surface scroll-mt-24">
      <div className="ph-container-wide">
        <div className="ph-process-header">
          <p className="ph-eyebrow">Quy trình thiết kế & thi công sa bàn</p>
          <h2 className="ph-process-title mt-3">QUY TRÌNH CHUYÊN NGHIỆP & RÕ RÀNG</h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-[#e7ddd0] bg-white shadow-[0_18px_40px_rgba(25,35,38,0.08)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={DIAMOND_VN_COMPANY.processThumb}
                alt="Quy trình thiết kế và thi công sa bàn Diamond Model"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
                quality={90}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PROCESS_STEPS.map((item) => (
              <article
                key={item.step}
                className="rounded-[24px] border border-[#e7ddd0] bg-white p-6 shadow-[0_12px_30px_rgba(25,35,38,0.06)]"
              >
                <span className="inline-flex rounded-full bg-[#f6efe5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b95a2]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-[24px] font-semibold leading-[1.1] text-[#4f4b46]">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-[#5d5751]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={openAdviseModal}
            className="ph-button inline-flex"
            aria-haspopup="dialog"
          >
            Đặt lịch KTS tư vấn
          </button>
        </div>
      </div>
    </section>
  );
}
