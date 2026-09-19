"use client";

import { useState } from "react";
import { CmsActionBar, CmsBreadcrumb, CmsButton, CmsCard, CmsField, CmsInput } from "@/components/admin/ui";

function randomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return [...bytes].map((byte) => chars[byte % chars.length]).join("");
}

export default function AdminPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
  }

  function fillGenerated() {
    const next = randomPassword();
    setNewPassword(next);
    setConfirmPassword(next);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    setSaving(false);
    if (!response.ok) {
      setError(data?.message || "Không đổi được mật khẩu.");
      return;
    }
    reset();
    setMessage("Đã đổi mật khẩu.");
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Thông tin tài khoản"]} />
      <CmsActionBar sticky saving={saving} onSave={() => void save()} onReset={reset} />
      {message ? <p className="mb-4 text-[13px] text-emerald-600">{message}</p> : null}
      {error ? <p className="mb-4 text-[13px] text-red-500">{error}</p> : null}
      <CmsCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto_1fr] lg:items-end">
          <CmsField label="Mật khẩu cũ:">
            <CmsInput type="password" placeholder="Mật khẩu cũ" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </CmsField>
          <CmsField label="Mật khẩu mới:">
            <CmsInput type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </CmsField>
          <CmsButton type="button" className="mb-0.5" onClick={fillGenerated}>
            Tạo mật khẩu
          </CmsButton>
          <CmsField label="Nhập lại mật khẩu mới:">
            <CmsInput type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </CmsField>
        </div>
      </CmsCard>
    </div>
  );
}
