export const DIAMOND_VN_COMPANY = {
  name: "Diamond Model",
  fullName: "CÔNG TY TNHH MÔ HÌNH KIM CƯƠNG",
  phone: "0901 62 62 82",
  phoneHref: "0901626282",
  email: "info@diamondmodel.vn",
  zalo: "https://zalo.me/0901626282",
  logo: "/diamondmodel/brand/logo-diamondmodel.png",
  zaloIcon: "/diamond-vn/brand/icon-zalo.svg",
  heroVideo: "/diamond-vn/home/diamond-vn-home-video.mp4",
  heroPoster: "/diamondmodel/home/hero-slide-1.png",
  heroSlides: [
    "/diamondmodel/home/hero-slide-1.png",
    "/diamondmodel/home/hero-slide-2.png",
    "/diamondmodel/home/hero-slide-3.png",
    "/diamondmodel/home/hero-slide-4.png",
  ],
  yearsBadge: "/diamond-vn/home/9_Years.svg",
  missionImage: "/diamondmodel/home/hero-slide-2.png",
  trustImage: "/diamondmodel/home/hero-slide-3.png",
  processDesktop: "/diamond-vn/home/diamond-vn-process-home-pc.svg",
  processMobile: "/diamond-vn/home/diamond-vn-process-home-mob.svg",
  processThumb: "/diamondmodel/home/hero-slide-4.png",
  statsBackground: "/diamondmodel/home/hero-slide-1.png",
  footerBadge: "/diamond-vn/brand/tinnhiemmang-cert.png",
  facebook: "https://facebook.com/diamondmodel",
  youtube: "https://www.youtube.com/embed/P4WI7VRvwdU",
  addresses: [
    {
      title: "DIAMOND MODEL HCM",
      lines: [
        "433/43 Lê Đức Thọ, F17, Q.Gò Vấp, TP. Hồ Chí Minh",
      ],
      phone: "0901 62 62 82",
      href: "0901626282",
    },
    {
      title: "DIAMOND MODEL XƯỞNG",
      lines: ["252 TL15 (Thạnh Lộc 15), P. Thạnh Lộc, Q.12"],
      phone: "0901 666 901",
      href: "0901666901",
    },
    {
      title: "DIAMOND MODEL LIÊN HỆ",
      lines: ["Email: info@diamondmodel.vn", "Website: www.diamondmodel.vn"],
      phone: "0901 62 62 82",
      href: "0901626282",
    },
  ],
  policies: [
    { label: "Chính sách bảo hành, bảo trì", href: "https://diamondmodel.vn/chinh-sach-bao-hanh-bao-tri" },
    { label: "Chính sách bảo mật", href: "https://diamondmodel.vn/chinh-sach-bao-mat" },
    {
      label: "Diamond Model trên Google News",
      href: "https://news.google.com/publications/CAAqBwgKMPfWtwswhPLOAw?hl=vi&gl=VN&ceid=VN:vi",
    },
  ],
} as const;

export const DIAMOND_VN_CONTACT = {
  introLabel: "liên hệ",
  introTitle: "DIAMOND MODEL – KHỞI TẠO GIÁ TRỊ SỐNG LÝ TƯỞNG",
  companyTitle: DIAMOND_VN_COMPANY.fullName,
  downloadUrl: "https://drive.google.com/file/d/1rTxiVb_7WqyLkfr1vvDWasnrhOVPmixb/view",
  socialTitle: "KÊNH MẠNG XÃ HỘI",
  hotlineLabel: "HOTLINE",
  serviceLabel: "PHẢN HỒI DỊCH VỤ",
  registerLabel: "ĐẶT LỊCH",
  registerTitle: "KIẾN TRÚC SƯ TƯ VẤN",
  formLabel: "form liên hệ",
  formLead:
    "Bạn vui lòng điền thông tin cần giải đáp / tư vấn vào form liên hệ bên dưới.\nĐội ngũ hỗ trợ của chúng tôi sẽ phản hồi cho bạn nhanh nhất có thể.",
  formNote: "Chúng tôi cam kết bảo mật tuyệt đối thông tin của Bạn.",
  commitmentsLabel: "6 điều",
  commitmentsTitle: "DIAMOND MODEL CAM KẾT",
  commitmentImage: "/diamond-vn/contact/cam-ket-01.svg",
  commitments: [
    "thiết kế độc bản",
    "Thi công tỉ mỉ",
    "quy trình chuyên nghiệp",
    "Dịch vụ trọn đời",
    "Giá thành tốt nhất",
    "nguyên vật liệu an toàn",
  ],
  serviceHotline: "093 8425800",
} as const;

export const DIAMOND_VN_NAV = [
  { label: "Giới thiệu", href: "#mission" },
  { label: "Thiết kế", href: "#design-apartment" },
  { label: "Thi công", href: "#construction" },
  { label: "Báo giá", href: "#consultation" },
  { label: "Quy trình", href: "#process" },
  { label: "Blog nhà đẹp", href: "#press" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

export const DIAMOND_VN_BENEFITS = [
  {
    title: "Thiết kế cá nhân hóa",
    description:
      "Thiết kế phù hợp với sở thích, phong cách sống của riêng bạn và gia đình. Nhưng vẫn tối ưu không gian sử dụng.",
  },
  {
    title: "Thi công tỉ mỉ",
    description:
      "Kiểm định nghiêm ngặt trong chi tiết, gói gọn tâm huyết trên từng sản phẩm hoàn thiện.",
  },
  {
    title: "Chất lượng & thẩm mỹ",
    description:
      "Đội ngũ thợ mộc lành nghề sẽ luôn hoàn thiện công trình một cách tỉ mỉ, độ thẩm mĩ cao gần với bản thiết kế nhất.",
  },
  {
    title: "Bảo trì trọn đời",
    description:
      "Tính vượt trội được thể hiện qua 2 lần chủ động bảo hành trong năm, bảo trì trọn đời.",
  },
] as const;

type ProjectItem = {
  title: string;
  image: string;
  meta1: string;
  meta2: string;
  meta2Type: "bedroom" | "scale";
};

type ProjectGroup = {
  id: string;
  eyebrow: string;
  title: string;
  badge: string;
  cta: string;
  items: readonly ProjectItem[];
};

export const DIAMOND_VN_PROJECTS = [
  {
    id: "design-apartment",
    eyebrow: "Dự án thực hiện",
    title: "SA BÀN DỰ ÁN",
    badge: "SA BÀN",
    cta: "Xem thêm",
    items: [
      {
        title: "Dự án Khu Đô thị Cồn Khương - Tỷ Lệ: 1/250",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/a39aed7d1551-1-c0a2cb09-c162-449a-9f51-36ac5b8552a9.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/250",
        meta2Type: "scale",
      },
      {
        title: "Dự án Vĩnh Long Center - Tỷ lệ: 1/75",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/37e96f52ffd1-z3405592631349-dce42b2c973b60f5eb21f1b3552e6d40.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/75",
        meta2Type: "scale",
      },
      {
        title: "Dự án Long Can Riverside - Tỷ lệ: 1/250",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/4e5cc2f668e1-z3405491448019-8a49460c5462993255daa7f0a1120d88.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/250",
        meta2Type: "scale",
      },
      {
        title: "Dự án Tổng Khu Công Nghiệp Hải Sơn - Tỷ lệ 1/1500",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/e6e513160913-z3405491488703-04d1a85b4e782e927285789ae68bbc3c-1.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/1500",
        meta2Type: "scale",
      },
    ],
  },
  {
    id: "design-townhouse",
    eyebrow: "Công trình tiêu biểu",
    title: "CÔNG TRÌNH KIẾN TRÚC",
    badge: "KIẾN TRÚC",
    cta: "Xem thêm",
    items: [
      {
        title: "Dự án khu dân cư Long Thượng Dragon - Tỷ lệ 1/250",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/ab192ae1e35c-z3405491426364-759c76c2a288e5ee0db693bd42115ffa.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/250",
        meta2Type: "scale",
      },
      {
        title: "Dự án Dragon Pearl Đức Hòa Long An - Tỷ lệ: 1/500",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/92261ff7b715-z3405544449439-7ab76ca3ffb981569f84083e43408401.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/500",
        meta2Type: "scale",
      },
      {
        title: "Dự Án Căn Hộ The Grand Manhattan - Tỷ lệ: 1/100",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/4775913d684a-z3405491478118-b256b2e0d7d84299333a25adfab52955-1.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/100",
        meta2Type: "scale",
      },
      {
        title: "Dự án Trường học Hoàng Việt Tp Buôn Ma Thuột - Tỷ lệ: 1/250",
        image: "https://cms.looms.vn/media/media-diamond-model/imports/bizweb/bba7210bed28-img-0734.jpg",
        meta1: "Mô hình kiến trúc",
        meta2: "Tỷ lệ: 1/250",
        meta2Type: "scale",
      },
    ],
  },
] as const satisfies readonly ProjectGroup[];

export const DIAMOND_VN_VALUES = [
  { label: "Khách hàng", value: "350+", image: "/diamond-vn/home/value-customer-01.webp" },
  { label: "Dự án thiết kế", value: "400+", image: "/diamond-vn/home/value-design-02.webp" },
  { label: "Dự án thi công", value: "380+", image: "/diamond-vn/home/value-build-03.webp" },
  { label: "Công trình tiêu biểu", value: "18", image: "/diamond-vn/home/value-special-04.webp" },
] as const;

export const DIAMOND_VN_VIDEOS = [
  {
    title: "Quy trình sản xuất tại xưởng Diamond Model Decor",
    image: "/diamond-vn/videos/BANNER-CHINH.jpg",
    href: "https://youtu.be/87aKui2Cl-g",
  },
  {
    title: "Quá trình thi công tại công trình",
    image: "/diamond-vn/videos/izPEwzhK04g-hqdefault.jpg",
    href: "https://youtu.be/izPEwzhK04g",
  },
  {
    title: "Trải nghiệm khách hàng Diamond Model",
    image: "/diamond-vn/videos/trai-nghiem-kh-video-thumb.jpg",
    href: "https://vimeo.com/803366386",
  },
] as const;

export const DIAMOND_VN_PRESS_LOGOS = [
  "/diamond-vn/press/logo-bao-tien-phong.jpg",
  "/diamond-vn/press/bao-24h-com-vn.jpg",
  "/diamond-vn/press/nguoi-dua-tin.jpg",
  "/diamond-vn/press/bao-xay-dung-1.jpg",
  "/diamond-vn/press/ha-noi-moi.png",
  "/diamond-vn/press/logo-tri-thuc-moi_2021_05_12.png",
] as const;

export const DIAMOND_VN_COMPLETED_LOGOS = [
  "/diamond-vn/completed/logo-20.png",
  "/diamond-vn/completed/logo-1.png",
  "/diamond-vn/completed/logo-2.png",
  "/diamond-vn/completed/logo-3.png",
  "/diamond-vn/completed/logo-4.png",
  "/diamond-vn/completed/logo-5.png",
  "/diamond-vn/completed/logo-6.png",
  "/diamond-vn/completed/logo-7.png",
  "/diamond-vn/completed/logo-8.png",
  "/diamond-vn/completed/logo-9.png",
  "/diamond-vn/completed/logo-10.png",
  "/diamond-vn/completed/logo-11.png",
  "/diamond-vn/completed/logo-12.png",
  "/diamond-vn/completed/logo-13.png",
  "/diamond-vn/completed/logo-14.png",
  "/diamond-vn/completed/logo-15.png",
  "/diamond-vn/completed/logo-16.png",
  "/diamond-vn/completed/logo-17.png",
  "/diamond-vn/completed/logo-18.png",
  "/diamond-vn/completed/logo-19.png",
] as const;

