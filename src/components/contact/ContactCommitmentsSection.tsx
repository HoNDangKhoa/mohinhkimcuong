import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CARD_TITLE_CLASS } from "@/components/ui/cardTypography";
import { DIAMOND_VN_CONTACT } from "@/lib/diamond-vn";

const LEFT_ITEMS = DIAMOND_VN_CONTACT.commitments.slice(0, 3);
const RIGHT_ITEMS = DIAMOND_VN_CONTACT.commitments.slice(3);

function CommitmentItem({ title }: { title: string }) {
  return (
    <article className="max-w-[420px]">
      <h3 className={`ph-clamp-2 min-h-[3rem] ${CARD_TITLE_CLASS} text-[#5a8492]`}>
        {title}
      </h3>
      <div className="mt-4 h-px w-full bg-[#d8cfc4]/80" />
    </article>
  );
}

export default function ContactCommitmentsSection() {
  return (
    <section className="ph-section-tight bg-transparent pb-24">
      <div className="ph-container">
        <AnimatedSection>
          <div className="text-center">
            <p className="ph-eyebrow">{DIAMOND_VN_CONTACT.commitmentsLabel}</p>
            <h2 className="ph-title mt-3">{DIAMOND_VN_CONTACT.commitmentsTitle}</h2>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)_minmax(0,1fr)] lg:gap-14">
          <div className="space-y-10">
            {LEFT_ITEMS.map((item) => (
              <CommitmentItem key={item} title={item} />
            ))}
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[360px]">
            <Image
              src={DIAMOND_VN_CONTACT.commitmentImage}
              alt="Diamond Model cam kết"
              fill
              sizes="(max-width: 1024px) 100vw, 360px"
              className="object-contain"
              loading="lazy"
              quality={90}
            />
          </div>

          <div className="space-y-10">
            {RIGHT_ITEMS.map((item) => (
              <CommitmentItem key={item} title={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

