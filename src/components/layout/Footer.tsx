import Image from "next/image";
import { DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";

export default function Footer({
  logoSrc,
  footerBadgeSrc,
}: {
  logoSrc?: string;
  footerBadgeSrc?: string;
}) {
  const logo = logoSrc || DIAMOND_VN_COMPANY.logo;
  const footerBadge = footerBadgeSrc || DIAMOND_VN_COMPANY.footerBadge;

  return (
    <footer id="footer" className="bg-[#152238] pt-10 text-white">
      <div className="overflow-hidden border-b border-white/15 pb-8">
        <p className="text-center text-[16px] font-semibold uppercase">BẠN CẦN 1 ĐƠN VỊ NỘI THẤT CHUYÊN NGHIỆP?</p>
        <div className="mt-4 overflow-hidden whitespace-nowrap">
          <div className="ph-marquee inline-flex items-center gap-8 font-heading text-[34px] font-semibold uppercase text-white">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className="inline-flex items-center gap-8">
                <span className="text-[#f1cd8a]">TRÒ CHUYỆN CÙNG KIẾN TRÚC SƯ</span>
                <span>DIAMOND MODEL</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="ph-container pb-8 pt-9">
        <div className="text-center">
          <Image
            src={logo}
            alt="Diamond Model"
            width={180}
            height={44}
            className="mx-auto h-10 w-auto"
          />
        </div>

        <div className="mt-9 grid gap-7 text-center md:grid-cols-3">
          <div>
            <p className="text-[12px] uppercase text-white/70">Hotline</p>
            <a
              href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`}
              className="mt-2 block font-heading text-[34px] leading-none text-[#f1cd8a]"
            >
              {DIAMOND_VN_COMPANY.phone}
            </a>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-[14px] font-semibold uppercase">{DIAMOND_VN_COMPANY.fullName}</p>
          </div>
          <div>
            <p className="text-[12px] uppercase text-white/70">Email</p>
            <a href={`mailto:${DIAMOND_VN_COMPANY.email}`} className="mt-2 block text-[15px] text-white">
              {DIAMOND_VN_COMPANY.email}
            </a>
          </div>
        </div>

        <div className="mt-11 grid gap-8 md:grid-cols-3">
          {DIAMOND_VN_COMPANY.addresses.map((address, index) => (
            <div key={address.title} className="text-center md:text-left">
              <h3 className="font-semibold uppercase text-white">{address.title}</h3>
              <div className="mt-3 space-y-2 text-[14px] leading-7 text-white/90">
                {address.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p>
                  ĐT:{" "}
                  <a href={`tel:${address.href}`} className="text-white">
                    {address.phone}
                  </a>
                </p>
              </div>
              {index === 2 ? (
                <Image
                  src={footerBadge}
                  alt="Chứng nhận tín nhiệm mạng"
                  width={100}
                  height={100}
                  className="mx-auto mt-4 w-[100px] md:mx-0"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/15 pt-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] uppercase text-white/85">
            {DIAMOND_VN_COMPANY.policies.map((policy) => (
              <a key={policy.label} href={policy.href} target="_blank" rel="noreferrer">
                {policy.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-[12px] text-white/80">
              Copyright © 2026 Diamond Model Architecture & Interior. Web Design & Digital Marketing: Lead Digital
            </p>
            <div className="flex items-center gap-5 text-[12px] uppercase text-white">
              <a href={DIAMOND_VN_COMPANY.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={DIAMOND_VN_COMPANY.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <a href="#hero" aria-label="Lên đầu trang">
                ↑
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

