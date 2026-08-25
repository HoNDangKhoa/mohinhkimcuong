"use client";

import { useState, type FormEvent } from "react";
import { submitContactToCms } from "@/lib/cms-contact";
import { DIAMOND_VN_CONTACT } from "@/lib/diamond-vn";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    try {
      await submitContactToCms({
        ...formData,
        source: "contact-page",
      });
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      setNotice({
        type: "success",
        text: "Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ phản hồi sớm nhất.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Không gửi được thông tin. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border-0 border-b border-[#1f1f1f] bg-transparent px-0 pb-2 pt-1 text-[15px] text-[#4f4b46] placeholder:text-[#4f4b46]/80 focus:border-[#6d97a5] focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Tên của Bạn (*)
        </label>
        <input
          id="contact-name"
          name="your-name"
          type="text"
          required
          autoComplete="name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          className={inputClass}
          placeholder="Tên của Bạn (*)"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        <div>
          <label htmlFor="contact-phone" className="sr-only">
            Điện Thoại (*)
          </label>
          <input
            id="contact-phone"
            name="your-mobile"
            type="tel"
            required
            autoComplete="tel"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            className={inputClass}
            placeholder="Điện Thoại (*)"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="sr-only">
            Email (*)
          </label>
          <input
            id="contact-email"
            name="your-email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className={inputClass}
            placeholder="Email (*)"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="sr-only">
          Tiêu Đề (*)
        </label>
        <input
          id="contact-subject"
          name="your-subject"
          type="text"
          required
          value={formData.subject}
          onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
          className={inputClass}
          placeholder="Tiêu Đề (*)"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          Nội Dung (*)
        </label>
        <textarea
          id="contact-message"
          name="your-message"
          required
          rows={6}
          value={formData.message}
          onChange={(event) => setFormData({ ...formData, message: event.target.value })}
          className={`${inputClass} min-h-[150px] resize-none pt-2`}
          placeholder="Nội Dung (*)"
        />
      </div>

      <input type="hidden" name="url" value="" />

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

      <p className="max-w-[760px] text-[13px] leading-6 text-[#4f4b46]/80">
        <span className="font-medium">Ghi chú:</span> {DIAMOND_VN_CONTACT.formNote}
      </p>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#efbe73] px-6 py-4 text-[15px] font-medium uppercase tracking-[0.02em] text-[#2f2f2f] transition hover:bg-[#eab661] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d97a5]/40"
        >
          {isSubmitting ? "ĐANG GỬI..." : "GỬI NGAY"}
        </button>
      </div>
    </form>
  );
}
