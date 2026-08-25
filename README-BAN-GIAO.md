# Bàn giao source website Diamond Model

**Bên giao:** Loom (Trần Hoàng Nhu) · **Bên nhận:** Công ty TNHH Mô Hình Kim Cương / Vinasoftware
**Ngày bàn giao:** 25/08/2026

---

## 1. Phạm vi bàn giao

| Hạng mục | Trạng thái |
|---|---|
| Toàn bộ source code giao diện website (Next.js) | ✅ Bàn giao |
| Toàn bộ hình ảnh, nội dung hiện có của website | ✅ Bàn giao (gói dữ liệu riêng) |
| Quyền kết nối API tới LOOM CMS trong thời gian chuyển tiếp | ✅ Có thời hạn — xem mục 4 |
| Source code hệ thống LOOM CMS | ❌ Không thuộc phạm vi |

> LOOM CMS là nền tảng dùng chung (multi-tenant) phục vụ nhiều khách hàng trên cùng một hệ thống, nên không thể tách riêng phần của một khách hàng để bàn giao. Nội dung như đã trao đổi ngày 24/08/2026.

---

## 2. Chạy trên máy local

Yêu cầu **Node.js 20 trở lên**.

```bash
npm install
cp .env.example .env.local     # rồi điền giá trị (xem mục 3)
npm run dev                    # http://localhost:3000
```

Build bản production:

```bash
npm run build
npm run start
```

---

## 3. Biến môi trường

Xem file `.env.example`. Hai nhóm chính:

- `SITE_URL` / `NEXT_PUBLIC_SITE_URL` — domain chính thức, dùng cho SEO, canonical URL, sitemap.
- `CMS_API_URL` / `CMS_API_KEY` — kết nối tới LOOM CMS để lấy nội dung động.

**Lưu ý bảo mật:** đặt `CMS_API_KEY` ở biến môi trường phía server (không phải `NEXT_PUBLIC_*`). Toàn bộ lệnh gọi CMS đều chạy ở Server Component hoặc route `/api/contact`, nên key không lộ ra trình duyệt.

---

## 4. Điều quan trọng nhất: website KHÔNG phụ thuộc sống còn vào CMS

Website được thiết kế theo mô hình **CMS-first, static-fallback**:

```
Trang được yêu cầu
   └─> gọi LOOM CMS (timeout 3.5 giây)
         ├─ có dữ liệu  -> hiển thị nội dung từ CMS
         └─ lỗi/hết hạn -> tự động dùng dữ liệu tĩnh trong src/lib/site-content.ts
```

Nghĩa là:

- Khi quyền truy cập API hết hạn (mặc định **30 ngày** kể từ ngày bàn giao), **website vẫn chạy bình thường**, không trắng trang, không lỗi 500.
- Nội dung sẽ hiển thị theo bản chụp tĩnh tại thời điểm bàn giao (`src/lib/site-content.ts` và `src/lib/diamond-vn.ts`).
- Khi bên nhận xây xong CMS riêng, chỉ cần trỏ `CMS_API_URL` sang hệ thống mới, miễn là đáp ứng đúng hợp đồng API ở mục 6.

Nếu cần gia hạn thêm thời gian kết nối, liên hệ Loom để điều chỉnh.

---

## 5. Cấu trúc thư mục

```
src/
├── app/            # Route (App Router) — mỗi thư mục là một trang
├── components/     # Component giao diện: home, layout, ui, contact, content
├── lib/            # Kết nối CMS + dữ liệu tĩnh dự phòng
│   ├── cms-content.ts    # Lấy dự án / dịch vụ / tin tức / trang tĩnh
│   ├── cms-settings.ts   # Lấy cấu hình: hero, logo, thông tin liên hệ
│   ├── cms-seo.ts        # Lấy SEO: title, description, sitemap, robots
│   ├── site-content.ts   # ⭐ DỮ LIỆU TĨNH DỰ PHÒNG (~50KB)
│   └── diamond-vn.ts     # Dữ liệu tĩnh bổ sung
├── hooks/          # Custom React hooks
public/             # Ảnh, font, file tĩnh
```

**Muốn sửa nội dung mà không cần CMS:** sửa trực tiếp `src/lib/site-content.ts` rồi build lại.

---

## 6. Hợp đồng API (để bên nhận tự dựng CMS thay thế)

Toàn bộ request đều là `GET`, kèm header `x-api-key: <API_KEY>`, trả về JSON dạng `{ data: [...] }`.

### Nội dung

| Endpoint | Trả về |
|---|---|
| `GET /api/public/projects?limit=100` | Danh sách dự án |
| `GET /api/public/projects/:slug` | Chi tiết một dự án |
| `GET /api/public/services?limit=100` | Danh sách dịch vụ |
| `GET /api/public/services/:slug` | Chi tiết một dịch vụ |
| `GET /api/public/articles?limit=100` | Danh sách tin tức |
| `GET /api/public/articles/:slug` | Chi tiết một tin tức |
| `GET /api/public/pages/:slug` | Trang tĩnh (vd: giới thiệu) |

### Cấu hình

| Endpoint | Trả về |
|---|---|
| `GET /api/public/settings/home` | Hero slides, khối sứ mệnh, khối số liệu |
| `GET /api/public/settings/general` | Logo, favicon, badge |
| `GET /api/public/settings/contact` | Thông tin liên hệ, hồ sơ năng lực |
| `GET /api/public/settings/seo` | Title, description, keywords mặc định |

### SEO

| Endpoint | Trả về |
|---|---|
| `GET /api/seo/sitemap` | Dữ liệu sinh sitemap.xml |
| `GET /api/seo/robots.txt` | Nội dung robots.txt |
| `GET /api/seo/metadata/:type/:slug` | SEO riêng từng trang |

### Gửi liên hệ

| Endpoint | Ghi chú |
|---|---|
| `POST /api/public/contacts` | Nhận form liên hệ. Website gọi qua route trung gian `/api/contact` để không lộ API key ra trình duyệt. |

### Cấu trúc một bản ghi nội dung

```ts
{
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;        // HTML
  thumbnailUrl?: string;
  heroImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  isFeatured?: boolean;    // dùng để ưu tiên hiển thị ở trang chủ
  category?: { name: string };
  publishedAt?: string;
  updatedAt?: string;
}
```

Riêng dự án (`projects`) có thêm: `client`, `location`, `area`, `scale`, `materials`, `completedAt`, và `gallery[]` dạng `{ mediaUrl, section: "hero" | "gallery", altText }`.

> Nếu CMS mới trả đúng cấu trúc trên, website chạy được ngay mà không cần sửa code.

---

## 7. Triển khai (deploy)

Đây là ứng dụng Next.js tiêu chuẩn, chạy được trên bất kỳ nền tảng nào hỗ trợ Node.js: Vercel, Netlify, hoặc VPS tự quản (PM2 / Docker).

Trên VPS tự quản:

```bash
npm ci
npm run build
npm run start        # mặc định cổng 3000, nên đặt sau Nginx reverse proxy
```

**Lưu ý về ảnh:** mọi domain chứa ảnh phải được khai báo trong `next.config.ts` (mục `images.remotePatterns`). Nếu sau này chuyển ảnh sang hệ thống lưu trữ riêng, nhớ thêm domain mới vào đây — thiếu bước này ảnh sẽ bị vỡ (lỗi 400 từ Image Optimizer).

---

## 8. Bàn giao kèm theo

- [ ] Gói dữ liệu nội dung (SQL + JSON): dự án, dịch vụ, tin tức, trang tĩnh, danh mục, cấu hình
- [ ] Gói hình ảnh: toàn bộ file media của website
- [ ] API key riêng cho giai đoạn chuyển tiếp
