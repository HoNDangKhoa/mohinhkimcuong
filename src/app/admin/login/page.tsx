"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CmsButton, CmsField, CmsInput } from "@/components/admin/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(data?.message || "Đăng nhập thất bại.");
      return;
    }
    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="cms-admin grid min-h-screen bg-gray-50 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <form onSubmit={submit} className="mx-auto w-full max-w-[420px] rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/diamondmodel/brand/logo-diamondmodel.png"
              alt="Diamond Model"
              className="h-9 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-stone-800">Chào mừng trở lại</h1>
          <p className="mt-1 text-sm text-stone-400">Đăng nhập để quản lý nội dung website</p>
          <div className="mt-6 space-y-4">
            <CmsField label="Tên đăng nhập">
              <CmsInput value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </CmsField>
            <CmsField label="Mật khẩu">
              <CmsInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </CmsField>
          </div>
          {error ? <p className="mt-4 text-[13px] text-red-500">{error}</p> : null}
          <CmsButton type="submit" disabled={loading} className="mt-6 h-11 w-full">
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </CmsButton>
          {process.env.NODE_ENV !== "production" ? (
            <p className="mt-4 text-center text-[12px] text-stone-400">Mặc định local: admin / diamondmodel</p>
          ) : null}
        </form>
      </div>
      <div
        className="hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: "url(/diamondmodel/home/hero-slide-2.png)" }}
      />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
