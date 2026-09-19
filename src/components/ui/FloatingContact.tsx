"use client";

import { CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useId, useRef, useState } from "react";
import { ADVISE_MODAL_OPEN_EVENT, openAdviseModal } from "@/lib/advise-modal";
import { submitContactToCms } from "@/lib/cms-contact";

const RING_TEXT = "ĐẶT LỊCH KTS TƯ VẤN • ĐẶT LỊCH KTS TƯ VẤN • ";

function ScheduleRing() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="pointer-events-none absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]"
      aria-hidden="true"
    >
      <defs>
        <path id="schedule-ring-path" d="M 60 60 m -42 0 a 42 42 0 1 1 84 0 a 42 42 0 1 1 -84 0" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(220,220,220,0)" strokeWidth="1.5" />
      <text
        className="fill-[#8b8b8b]"
        fontSize="9"
        fontFamily="var(--font-body)"
        letterSpacing="1.4"
      >
        <textPath href="#schedule-ring-path" startOffset="0%">
          {RING_TEXT}
        </textPath>
      </text>
    </svg>
  );
}

function FloatingScheduleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Đặt lịch tư vấn"
      className="fixed bottom-3 right-2 z-[60] h-[72px] w-[72px] md:bottom-6 md:right-6 md:h-[120px] md:w-[120px]"
    >
      <span className="relative block h-full w-full transition duration-300 ease-out hover:scale-[1.03]">
        <ScheduleRing />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#6c96a2] shadow-[0_10px_22px_rgba(0,0,0,0.14)]">
            <CalendarDaysIcon className="h-5 w-5 text-[#efbe73]" />
          </span>
        </span>
      </span>
    </button>
  );
}

function FloatingAdviseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const name = String(formData.get("fullname") || "").trim();
    const phone = String(formData.get("mobile") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const dateAdvise = String(formData.get("date_advise") || "").trim();
    const rawMessage = String(formData.get("message") || "").trim();
    const message = [
      dateAdvise ? `Ngày tư vấn mong muốn: ${dateAdvise}` : "",
      rawMessage ? `Nội dung: ${rawMessage}` : "Khách hàng cần đặt lịch kiến trúc sư tư vấn.",
    ].filter(Boolean).join("\n");

    setIsSubmitting(true);
    setNotice(null);

    try {
      await submitContactToCms({
        name,
        phone,
        email,
        subject: "Đặt lịch kiến trúc sư tư vấn",
        message,
        source: "consultation-popup",
      });
      setNotice({
        type: "success",
        text: "Đã nhận lịch tư vấn. Diamond Model sẽ liên hệ lại sớm nhất.",
      });
      formEl.reset();
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Không gửi được thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/35 px-4 py-6 backdrop-blur-[2px] md:px-6 md:py-10"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative mx-auto w-full max-w-[920px] overflow-hidden bg-white shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="relative flex items-center justify-center bg-[#6d97a5] px-12 py-4 text-center">
          <h2
            id={titleId}
            className="font-display text-[44px] font-semibold uppercase tracking-[0.01em] text-[#efbe73]"
          >
            CÙNG TRÒ CHUYỆN VỚI CHUYÊN GIA KIẾN TRÚC SƯ
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center text-white/35 transition hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <XMarkIcon className="h-9 w-9" />
          </button>
        </div>

        <div className="px-4 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-10 md:px-14 md:pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                placeholder="Tên của Bạn (*)"
                className="w-full border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  placeholder="Điện Thoại (*)"
                  className="w-full border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <input
                ref={dateInputRef}
                id="date_advise"
                name="date_advise"
                type="date"
                placeholder="Chọn Ngày Tư Vấn"
                className="w-full appearance-none border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 pr-10 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
              />
              <button
                type="button"
                aria-label="Chọn ngày tư vấn"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const input = dateInputRef.current;
                  if (!input) return;

                  const pickerInput = input as HTMLInputElement & { showPicker?: () => void };
                  if (typeof pickerInput.showPicker === "function") {
                    pickerInput.showPicker();
                    return;
                  }

                  input.focus();
                  input.click();
                }}
                className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#6d97a5]"
              >
                <CalendarDaysIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Nội dung"
                className="w-full resize-none border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none"
              />
            </div>

            <p id={descId} className="max-w-[680px] text-[13px] leading-6 text-[#4f4b46]/80">
              Chúng ta sẽ cùng nhau trò chuyện để hiểu hơn về phong cách sống của bạn.
              <br />
              Hãy chọn một thời điểm mà bạn thoải mái và hứng khởi nhất nhé.
            </p>

            {notice && (
              <p
                className={`text-[14px] leading-6 ${
                  notice.type === "success" ? "text-[#3f7a5f]" : "text-[#b84a4a]"
                }`}
                role="status"
              >
                {notice.text}
              </p>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#efbe73] px-6 py-4 text-[15px] font-medium uppercase tracking-[0.02em] text-[#2f2f2f] transition hover:bg-[#eab661] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d97a5]/40"
              >
                {isSubmitting ? "ĐANG GỬI..." : "ĐẶT LỊCH KIẾN TRÚC SƯ TƯ VẤN NGAY"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen: EventListener = () => setIsOpen(true);

    window.addEventListener(ADVISE_MODAL_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(ADVISE_MODAL_OPEN_EVENT, handleOpen);
  }, []);

  return (
    <>
      <FloatingScheduleButton onClick={openAdviseModal} />
      <FloatingAdviseModal open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
