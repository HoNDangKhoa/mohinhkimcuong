import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    // Mọi host chứa ảnh hiển thị trên site đều phải khai báo ở đây,
    // nếu không Next.js Image Optimizer sẽ trả 400 và ảnh bị vỡ.
    remotePatterns: [
      // Ảnh nội dung do LOOM CMS phục vụ (giai đoạn chuyển tiếp)
      { protocol: "https", hostname: "cms.looms.vn", pathname: "/**" },
      { protocol: "https", hostname: "media.looms.vn", pathname: "/**" },

      // Domain chính của website
      { protocol: "https", hostname: "diamondmodel.vn", pathname: "/**" },
      { protocol: "https", hostname: "www.diamondmodel.vn", pathname: "/**" },

      // Ảnh cũ còn sót từ nền tảng Bizweb trước đây
      { protocol: "https", hostname: "bizweb.dktcdn.net", pathname: "/**" },
      { protocol: "http", hostname: "bizweb.dktcdn.net", pathname: "/**" },

      // Ảnh minh hoạ / chứng nhận bên thứ ba
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "tinnhiemmang.vn", pathname: "/**" },
    ],
  },
};

export default nextConfig;
