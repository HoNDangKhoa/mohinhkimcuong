import type { Metadata } from "next";
import localFont from "next/font/local";
import { Mulish } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getCmsGeneralSettings } from "@/lib/cms-settings";
import { fetchCmsSeoSettings } from "@/lib/cms-seo";
import { SITE_URL } from "@/lib/site-content";

const DEFAULT_TITLE = "Diamond Model | Thiết kế và thi công nội thất";
const DEFAULT_DESCRIPTION =
  "Thiết kế và thi công nội thất Diamond Model mang những nét đẹp tinh tế và hoàn toàn mới lạ đến với không gian sống cho gia đình bạn.";
const DEFAULT_KEYWORDS = [
  "diamond model",
  "thiết kế nội thất",
  "thi công nội thất",
  "diamondmodel.vn",
  "nội thất cao cấp",
];

const headingFont = localFont({
  src: [
    { path: "./fonts/svn-moneta/SVN-Moneta-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/svn-moneta/SVN-Moneta-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/svn-moneta/SVN-Moneta-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/svn-moneta/SVN-Moneta-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Mulish({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [seoSettings, generalSettings] = await Promise.all([
    fetchCmsSeoSettings(),
    getCmsGeneralSettings(),
  ]);

  const siteUrl = seoSettings?.siteUrl || SITE_URL;
  const title = seoSettings?.siteTitle || DEFAULT_TITLE;
  const description = seoSettings?.siteDescription || DEFAULT_DESCRIPTION;
  const keywords = seoSettings?.siteKeywords?.length
    ? seoSettings.siteKeywords
    : DEFAULT_KEYWORDS;
  const siteName = generalSettings?.siteName || "Diamond Model";
  const siteFavicon = generalSettings?.siteFavicon || "/diamondmodel/brand/icon-diamondmodel-drop.png";
  const defaultOgImage =
    seoSettings?.defaultOgImage || "/diamond-vn/home/banner-lf.jpg";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: siteFavicon,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName,
      images: [
        {
          url: defaultOgImage,
          alt: "Diamond Model Decor",
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: defaultOgImage,
          alt: "Diamond Model Decor",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

