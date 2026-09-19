import { Bars3Icon, HomeIcon } from "@heroicons/react/24/outline";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const cmsTh = "border-b border-gray-200 bg-gray-50 px-3 py-3 font-medium text-gray-500";
export const cmsTd = "border-b border-gray-200 px-3 py-3 text-gray-600";

export function CmsBreadcrumb({ items }: { items: string[] }) {
  return (
    <p className="mb-4 flex flex-wrap items-center text-[13px] text-gray-400">
      <HomeIcon className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 ? <span className="mx-1.5">›</span> : null}
          {item}
        </span>
      ))}
    </p>
  );
}

export function CmsActionBar({
  onSave,
  onSaveStay,
  onReset,
  onExit,
  saving,
  sticky,
}: {
  onSave?: () => void;
  onSaveStay?: () => void;
  onReset?: () => void;
  onExit?: () => void;
  saving?: boolean;
  sticky?: boolean;
}) {
  return (
    <div
      className={`mb-5 flex flex-wrap gap-2 ${
        sticky ? "sticky top-[70px] z-10 -mx-5 border-b border-gray-200 bg-gray-50 px-5 py-3 lg:-mx-8 lg:px-8" : ""
      }`}
    >
      {onSave ? (
        <CmsButton type="button" disabled={saving} onClick={onSave}>
          {saving ? "Đang lưu…" : "Lưu"}
        </CmsButton>
      ) : null}
      {onSaveStay ? (
        <CmsButton type="button" variant="success" disabled={saving} onClick={onSaveStay}>
          Lưu tại trang
        </CmsButton>
      ) : null}
      {onReset ? (
        <CmsButton type="button" variant="secondary" onClick={onReset}>
          Làm lại
        </CmsButton>
      ) : null}
      {onExit ? (
        <CmsButton type="button" variant="danger" onClick={onExit}>
          Thoát
        </CmsButton>
      ) : null}
    </div>
  );
}

export function CmsPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-[13px] text-gray-400">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function CmsCard({
  title,
  actions,
  children,
  className = "",
}: {
  title?: string;
  locale?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
      {title ? (
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <div className="flex items-center gap-2 text-gray-800">
            <Bars3Icon className="h-4 w-4 text-amber-500" />
            <h2 className="text-[14px] font-semibold">{title}</h2>
          </div>
          {actions}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function CmsButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "success" | "danger" | "ghost" | "secondary";
}) {
  const styles = {
    primary: "bg-amber-500 text-white hover:bg-amber-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-500 hover:bg-gray-50",
  }[variant];

  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center justify-center rounded-md px-5 text-[13px] font-medium transition disabled:opacity-60 ${styles} ${className}`}
    />
  );
}

export function CmsField({
  label,
  hint,
  count,
  max,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  count?: number;
  max?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-medium text-gray-600">
        <span>
          {label}
          {hint ? <span className="ml-1 font-normal text-gray-400">{hint}</span> : null}
        </span>
        {typeof count === "number" && max ? (
          <span className={count > max ? "text-red-500" : "text-gray-400"}>
            {count}/{max} ký tự
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

const controlClass =
  "cms-input w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500";

export function CmsInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className || ""}`} />;
}

export function CmsTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlClass} min-h-28 ${props.className || ""}`} />;
}

export function CmsSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className || ""}`} />;
}

export function CmsBadge({
  tone = "gray",
  children,
}: {
  tone?: "gray" | "green" | "amber" | "blue" | "pink" | "purple" | "red";
  children: ReactNode;
}) {
  const styles = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    pink: "bg-rose-50 text-rose-700",
    purple: "bg-violet-50 text-violet-700",
    red: "bg-red-50 text-red-600",
  }[tone];

  return <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-medium ${styles}`}>{children}</span>;
}

export function CmsToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-[13px] text-gray-600">
      {label ? <span>{label}</span> : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-amber-500" : "bg-gray-200"
        }`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
