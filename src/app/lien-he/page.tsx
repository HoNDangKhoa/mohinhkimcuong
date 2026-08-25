import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ContactForm from "@/components/contact/ContactForm";
import ContactCommitmentsSection from "@/components/contact/ContactCommitmentsSection";
import { DIAMOND_VN_COMPANY, DIAMOND_VN_CONTACT } from "@/lib/diamond-vn";
import { getCmsContactSettings, getCmsGeneralSettings } from "@/lib/cms-settings";
import { fetchCmsSeoSettings } from "@/lib/cms-seo";

export const dynamic = "force-dynamic";

const FALLBACK_DESCRIPTION =
  "Liên hệ Diamond Model Decor để được tư vấn thiết kế và thi công nội thất. Hotline: 0901 62 62 82";

export async function generateMetadata(): Promise<Metadata> {
  const [seoSettings, generalSettings] = await Promise.all([
    fetchCmsSeoSettings(),
    getCmsGeneralSettings(),
  ]);

  const siteName = generalSettings?.siteName || "Diamond Model";
  const description = seoSettings?.siteDescription || FALLBACK_DESCRIPTION;

  return {
    title: `Liên hệ | ${siteName}`,
    description,
    alternates: { canonical: "/lien-he" },
    openGraph: {
      title: `Liên hệ | ${siteName}`,
      description,
      url: "/lien-he",
      type: "website",
    },
  };
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfc4] text-[#5a8492] transition hover:border-[#5a8492] hover:text-[#3f6773]"
    >
      {children}
    </a>
  );
}

export default async function ContactPage() {
  const cmsContact = await getCmsContactSettings();
  const companyProfileUrl = cmsContact?.companyProfileUrl || DIAMOND_VN_CONTACT.downloadUrl;
  const companyProfileLabel = cmsContact?.companyProfileLabel || "Tải hồ sơ năng lực";
  const companyProfileNote = cmsContact?.companyProfileNote || "";

  return (
    <>
      <section className="ph-section-tight pb-10 pt-14">
        <div className="ph-container">
          <AnimatedSection>
            <p className="ph-eyebrow text-center">{DIAMOND_VN_CONTACT.introLabel}</p>
            <h1 className="ph-title mt-3 text-center">{DIAMOND_VN_CONTACT.introTitle}</h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="ph-section-tight pt-0">
        <div className="ph-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start">
            <AnimatedSection animation="fade-right">
              <div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <Image
                    src={DIAMOND_VN_COMPANY.logo}
                    alt={DIAMOND_VN_CONTACT.companyTitle}
                    width={240}
                    height={60}
                    className="h-auto w-[180px] shrink-0 object-contain sm:w-[220px] lg:w-[240px]"
                    loading="eager"
                  />

                  <div className="max-w-[560px]">
                    <h2 className="font-display text-[44px] font-semibold uppercase leading-[1.05] text-[#45413d]">
                      {DIAMOND_VN_CONTACT.companyTitle}
                    </h2>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-[#7f7a74]">
                      {DIAMOND_VN_CONTACT.socialTitle}
                    </p>

                    <a
                      href={companyProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-[8px] border border-[#e5d8c7] px-4 py-3 text-[13px] uppercase tracking-[0.08em] text-[#5a8492] transition hover:border-[#5a8492] hover:text-[#3f6773]"
                    >
                      <Image
                        src="/diamondmodel/brand/icon-diamondmodel-drop.png"
                        alt=""
                        width={16}
                        height={16}
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      {companyProfileLabel}
                    </a>
                    {companyProfileNote && (
                      <p className="mt-3 max-w-[420px] text-[13px] leading-6 text-[#7f7a74]">
                        {companyProfileNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="text-[12px] uppercase tracking-[0.16em] text-[#7f7a74]">Social:</span>
                  <SocialLink href={DIAMOND_VN_COMPANY.facebook} label="Facebook">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.07c0-6.63-5.37-12-12-12S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08v-3.46h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.96h-1.5c-1.49 0-1.96.92-1.96 1.87v2.25h3.33l-.53 3.46h-2.8v8.39C19.61 23.02 24 18.06 24 12.07z" />
                    </svg>
                  </SocialLink>
                  <SocialLink href={DIAMOND_VN_COMPANY.youtube} label="YouTube">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14c.5-1.88.5-5.81.5-5.81s0-3.93-.5-5.81z" />
                      <path d="M9.55 15.57V8.43L15.82 12l-6.27 3.57z" fill="#fff" />
                    </svg>
                  </SocialLink>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={150}>
              <div className="space-y-5">
                <a
                  href={`tel:${DIAMOND_VN_COMPANY.phoneHref}`}
                  className="block border-b border-[#d8cfc4] pb-5 text-[#4f4b46] transition hover:text-[#5a8492]"
                >
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#7f7a74]">
                    {DIAMOND_VN_CONTACT.hotlineLabel}
                  </p>
                  <strong className="mt-2 block font-heading text-[26px] font-semibold text-[#45413d] md:text-[30px]">
                    {DIAMOND_VN_COMPANY.phone}
                  </strong>
                </a>

                <a
                  href={`tel:${DIAMOND_VN_CONTACT.serviceHotline.replace(/\s/g, "")}`}
                  className="block border-b border-[#d8cfc4] pb-5 text-[#4f4b46] transition hover:text-[#5a8492]"
                >
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#7f7a74]">
                    {DIAMOND_VN_CONTACT.serviceLabel}
                  </p>
                  <strong className="mt-2 block font-heading text-[26px] font-semibold text-[#45413d] md:text-[30px]">
                    {DIAMOND_VN_CONTACT.serviceHotline}
                  </strong>
                </a>

                <a
                  href="#contact-form"
                  className="block border-b border-[#d8cfc4] pb-5 text-[#4f4b46] transition hover:text-[#5a8492]"
                >
                  <p className="text-[12px] uppercase tracking-[0.16em] text-[#7f7a74]">
                    {DIAMOND_VN_CONTACT.registerLabel}
                  </p>
                  <strong className="mt-2 block font-heading text-[26px] font-semibold text-[#45413d] md:text-[30px]">
                    {DIAMOND_VN_CONTACT.registerTitle}
                  </strong>
                </a>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {DIAMOND_VN_COMPANY.addresses.map((address, index) => (
              <article key={address.title} className="border border-[#e5d8c7] px-6 py-6">
                <h3 className="font-heading text-[18px] font-semibold uppercase text-[#45413d]">
                  {index === 0 ? (
                    <a
                      href="https://www.google.com/maps/place/C%C3%B4ng+ty+thi%E1%BA%BFt+k%E1%BA%BF+%26+thi+c%C3%B4ng+N%E1%BB%99i+th%E1%BA%A5t+Ph%E1%BB%91+Gia/@10.8118944,106.7032614,17z/data=!3m1!4b1!4m5!3m4!1s0x317529bf1ec5d007:0xc2440a643ea72a8c!8m2!3d10.8118891!4d106.7054501"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {address.title}
                    </a>
                  ) : (
                    address.title
                  )}
                </h3>
                <div className="mt-4 space-y-3 text-[14px] leading-7 text-[#5d5751]">
                  {address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    ĐT:{" "}
                    <a href={`tel:${address.href}`} className="text-[#5a8492]">
                      {address.phone}
                    </a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="ph-section-tight pt-0">
        <div className="ph-container">
          <AnimatedSection>
            <div className="text-center">
              <p className="ph-eyebrow">{DIAMOND_VN_CONTACT.formLabel}</p>
              <h2 className="ph-title mt-3">Liên hệ với Diamond Model</h2>
              <p className="mx-auto mt-5 max-w-[760px] whitespace-pre-line text-[15px] leading-7 text-[#5d5751]">
                {DIAMOND_VN_CONTACT.formLead}
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto mt-10 max-w-[920px]">
            <ContactForm />
          </div>
        </div>
      </section>

      <ContactCommitmentsSection />
    </>
  );
}

