// Company info constants
export const COMPANY = {
  name: "Diamond Model",
  fullName: "CÔNG TY TNHH MÔ HÌNH KIM CƯƠNG",
  slogan: "Khởi Tạo Giá Trị Kiến Trúc",
  phone: "0901 62 62 82",
  phone2: "0901 666 901",
  email: "info@diamondmodel.vn",
  website: "www.diamondmodel.vn",
  logo: "/diamondmodel/brand/logo-diamondmodel.png",
  address: "433/43 Lê Đức Thọ, F17, Q.Gò Vấp, TP. Hồ Chí Minh",
  workshop: "252 TL15 (Thạnh Lộc 15), P. Thạnh Lộc, Q.12",
  googleMap:
    "https://www.google.com/maps/place/Diamond+Model",
  facebook: "https://facebook.com/diamondmodel",
  youtube: "https://www.youtube.com/embed/P4WI7VRvwdU",
  zalo: "https://zalo.me/0901626282",
} as const;

export const NAV_ITEMS = [
  { label: "Giới thiệu", href: "/gioi-thieu" },
  {
    label: "Dự án",
    href: "/du-an",
    children: [
      { label: "Quy Hoạch", href: "/du-an/quy-hoach" },
      { label: "Chung cư Cao cấp", href: "/du-an/chung-cu" },
      { label: "Biệt thự Nhà phố", href: "/du-an/biet-thu" },
      { label: "Nhà máy", href: "/du-an/nha-may" },
      { label: "Nội thất", href: "/du-an/noi-that" },
    ],
  },
  {
    label: "Dịch vụ",
    href: "/dich-vu",
    children: [
      { label: "Tư vấn Thiết kế", href: "/dich-vu/tu-van-thiet-ke" },
      { label: "Thi công Mô hình", href: "/dich-vu/thi-cong" },
      { label: "Bảo trì & Sửa chữa", href: "/dich-vu/bao-tri" },
    ],
  },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export const PROJECTS = [
  {
    id: 1,
    title: "Khu Đô thị Cồn Khương",
    scale: "1/250",
    category: "quy-hoach",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    slug: "khu-do-thi-con-khuong",
  },
  {
    id: 2,
    title: "Vĩnh Long Center",
    scale: "1/75",
    category: "chung-cu",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    slug: "vinh-long-center",
  },
  {
    id: 3,
    title: "Long Can Riverside",
    scale: "1/250",
    category: "quy-hoach",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    slug: "long-can-riverside",
  },
  {
    id: 4,
    title: "Khu Công Nghiệp Hải Sơn",
    scale: "1/1500",
    category: "nha-may",
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
    slug: "khu-cong-nghiep-hai-son",
  },
  {
    id: 5,
    title: "Long Thượng Dragon",
    scale: "1/250",
    category: "quy-hoach",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    slug: "long-thuong-dragon",
  },
  {
    id: 6,
    title: "Dragon Pearl Đức Hòa",
    scale: "1/500",
    category: "biet-thu",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    slug: "dragon-pearl-duc-hoa",
  },
  {
    id: 7,
    title: "Căn hộ The Grand Manhattan",
    scale: "1/100",
    category: "chung-cu",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
    slug: "can-ho-grand-manhattan",
  },
  {
    id: 8,
    title: "Trường học Hoàng Việt",
    scale: "1/250",
    category: "quy-hoach",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    slug: "truong-hoc-hoang-viet",
  },
] as const;

export const SERVICES = [
  {
    icon: "design",
    title: "Tư Vấn Thiết Kế",
    description:
      "Chỉ cần bạn gọi, chúng tôi sẽ tư vấn và hỗ trợ một cách chân thành nhất. Đội ngũ kiến trúc sư giàu kinh nghiệm sẵn sàng lắng nghe và hiện thực hóa ý tưởng của bạn.",
  },
  {
    icon: "build",
    title: "Thi Công Mô Hình",
    description:
      "Thi công dự án kiến trúc sa bàn là niềm tự hào của chúng tôi. Với xưởng sản xuất hiện đại, cam kết mang đến sự hài lòng tuyệt đối cho khách hàng.",
  },
  {
    icon: "service",
    title: "Dịch Vụ Trọn Gói",
    description:
      "Luôn trên tinh thần sẵn sàng, cùng đội ngũ làm việc tâm huyết. Từ thiết kế, thi công đến vận chuyển và lắp đặt hoàn thiện.",
  },
  {
    icon: "maintain",
    title: "Bảo Trì & Sửa Chữa",
    description:
      "Chúng tôi sẵn sàng hỗ trợ bảo trì, sửa chữa và nâng cấp những mô hình kiến trúc đã qua sử dụng với chất lượng như mới.",
  },
] as const;

export const STATS = [
  { number: 400, suffix: "+", label: "Khách hàng" },
  { number: 350, suffix: "+", label: "Dự án thiết kế" },
  { number: 380, suffix: "+", label: "Dự án thi công" },
  { number: 18, suffix: "", label: "Năm kinh nghiệm" },
] as const;
