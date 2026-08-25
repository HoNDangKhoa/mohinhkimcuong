export type ContactSubmissionInput = {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  source: "contact-page" | "consultation-popup";
};

export async function submitContactToCms(input: ContactSubmissionInput) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message || "Không gửi được thông tin. Vui lòng thử lại.");
  }

  return response.json() as Promise<{ ok: true }>;
}
