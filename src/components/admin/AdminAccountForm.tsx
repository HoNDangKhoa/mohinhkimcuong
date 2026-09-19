"use client";

import { useState } from "react";
import MediaDropzone from "@/components/admin/MediaDropzone";
import { CmsActionBar, CmsBreadcrumb, CmsCard, CmsField, CmsInput, CmsSelect } from "@/components/admin/ui";
import type { CmsUserRecord } from "@/lib/cms-records";

type ProfileForm = {
  username: string;
  displayName: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  address: string;
  avatarUrl: string;
};

function fromUser(user: CmsUserRecord): ProfileForm {
  return {
    username: user.username || "admin",
    displayName: user.displayName || user.username || "admin",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "Nam",
    birthday: user.birthday || "",
    address: user.address || "",
    avatarUrl: user.avatarUrl || "",
  };
}

export default function AdminAccountForm({ user }: { user: CmsUserRecord }) {
  const [form, setForm] = useState<ProfileForm>(fromUser(user));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function patch(key: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMessage(response.ok ? "Đã lưu thông tin admin." : "Không lưu được thông tin.");
  }

  return (
    <div>
      <CmsBreadcrumb items={["Bảng điều khiển", "Thông tin tài khoản"]} />
      <CmsActionBar sticky saving={saving} onSave={() => void save()} onReset={() => setForm(fromUser(user))} />
      {message ? <p className="mb-4 text-[13px] text-emerald-600">{message}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.7fr]">
        <CmsCard title="Thông tin admin">
          <div className="grid gap-4 sm:grid-cols-2">
            <CmsField label="Tài khoản: *">
              <CmsInput value={form.username} readOnly />
            </CmsField>
            <CmsField label="Họ tên: *">
              <CmsInput value={form.displayName} onChange={(event) => patch("displayName", event.target.value)} />
            </CmsField>
            <CmsField label="Email:">
              <CmsInput type="email" placeholder="Email" value={form.email} onChange={(event) => patch("email", event.target.value)} />
            </CmsField>
            <CmsField label="Điện thoại:">
              <CmsInput placeholder="Điện thoại" value={form.phone} onChange={(event) => patch("phone", event.target.value)} />
            </CmsField>
            <CmsField label="Giới tính:">
              <CmsSelect value={form.gender} onChange={(event) => patch("gender", event.target.value)}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </CmsSelect>
            </CmsField>
            <CmsField label="Ngày sinh:">
              <CmsInput type="date" value={form.birthday} onChange={(event) => patch("birthday", event.target.value)} />
            </CmsField>
            <CmsField label="Địa chỉ:" className="sm:col-span-2">
              <CmsInput placeholder="Địa chỉ" value={form.address} onChange={(event) => patch("address", event.target.value)} />
            </CmsField>
          </div>
        </CmsCard>
        <CmsCard title="Hình ảnh">
          <MediaDropzone value={form.avatarUrl} onChange={(url) => patch("avatarUrl", url)} />
          <p className="mt-2 text-center text-[11px] text-gray-400">Width: 100 px - Height: 100 px (jpg, gif, png, jpeg, JPG, PNG, JPEG, Png, GIF)</p>
        </CmsCard>
      </div>
    </div>
  );
}
