import Image from "next/image";
import { DIAMOND_VN_BENEFITS, DIAMOND_VN_COMPANY } from "@/lib/diamond-vn";
import { CARD_DESC_CLASS, CARD_TITLE_CLASS } from "@/components/ui/cardTypography";

type Benefit = (typeof DIAMOND_VN_BENEFITS)[number];

const LEFT_COLUMN: Benefit[] = [DIAMOND_VN_BENEFITS[0], DIAMOND_VN_BENEFITS[2]];
const RIGHT_COLUMN: Benefit[] = [DIAMOND_VN_BENEFITS[1], DIAMOND_VN_BENEFITS[3]];

function TrustArrow({ reverse = false }: { reverse?: boolean }) {
  return (
    <Image
      src="/diamond-vn/icons/arrow_right_trust.svg"
      alt=""
      width={44}
      height={58}
      aria-hidden="true"
      className={["h-[58px] w-[44px] shrink-0 opacity-90", reverse ? "rotate-180" : ""].join(" ")}
      loading="lazy"
    />
  );
}

function TrustItem({ benefit, reverse = false }: { benefit: Benefit; reverse?: boolean }) {
  return (
    <article className="w-full max-w-[520px]">
      <h3 className={`ph-clamp-2 min-h-[3rem] ${CARD_TITLE_CLASS} text-white`}>
        {benefit.title}
      </h3>

      <div className="mt-4 flex items-center gap-4">
        {reverse ? <TrustArrow reverse /> : null}
        <span className="h-px flex-1 bg-white/30" />
        {!reverse ? <TrustArrow /> : null}
      </div>

      <p className={`mt-3 max-w-[520px] ${CARD_DESC_CLASS} text-white/90`}>{benefit.description}</p>
    </article>
  );
}

export default function TrustSection() {
  return (
    <section id="trust" className="ph-trust-section relative overflow-hidden text-white">
      <Image
        src={DIAMOND_VN_COMPANY.trustImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
        quality={85}
      />
      <div className="absolute inset-0 bg-[#10100f]/50" />

      <div className="ph-container-wide relative">
        <div className="mx-auto max-w-[1360px] pt-8 text-center lg:pt-4">
          <h2 className="font-display text-[44px] font-semibold uppercase leading-[1.05]">
            DIAMOND MODEL ĐEM ĐẾN CHO KHÁCH HÀNG
          </h2>
        </div>

        <div className="mt-12 grid gap-y-12 lg:mt-14 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-14">
          <div className="space-y-12 lg:space-y-14">
            {LEFT_COLUMN.map((benefit) => (
              <TrustItem key={benefit.title} benefit={benefit} />
            ))}
          </div>

          <div className="space-y-12 lg:space-y-14">
            {RIGHT_COLUMN.map((benefit) => (
              <TrustItem key={benefit.title} benefit={benefit} reverse />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

