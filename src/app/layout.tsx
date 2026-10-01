import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleTranslator from "@/components/GoogleTranslator";
import { getSchoolData } from "@/lib/dataProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// হেল্পার: মেটাডাটা ও রুট লেআউটে ওভারসাইজড Base64 ডেটা ইউআরআই ফিল্টার করা
function getSafeMediaUrl(url: any, fallback: string = "/favicon.ico"): string {
  if (!url || typeof url !== "string") return fallback;
  // ২ কেবি এর চেয়ে বড় base64 স্ট্রিং মেটাডাটা বা SSR ফ্লাইট পেলোডে রাখলে বিল্ড ও ISR ফেইল করে
  if (url.startsWith("data:") && url.length > 2048) {
    return fallback;
  }
  return url;
}

export async function generateMetadata(): Promise<Metadata> {
  let logo = "/favicon.ico";
  let schoolName = "বিদ্যালয় ম্যানেজমেন্ট সিস্টেম";
  let slogan = "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ";
  let address = "বাংলাদেশ";
  let eiin = "108420";
  let banner = "";
  let seo: any = {};

  try {
    const data = await getSchoolData();
    if (data?.schoolInfo?.logo) logo = getSafeMediaUrl(data.schoolInfo.logo, "/favicon.ico");
    if (data?.schoolInfo?.name) schoolName = data.schoolInfo.name;
    if (data?.schoolInfo?.slogan) slogan = data.schoolInfo.slogan;
    if (data?.schoolInfo?.eiin) eiin = data.schoolInfo.eiin;
    if (data?.schoolInfo?.contact?.address) address = data.schoolInfo.contact.address;
    if (data?.heroBanner?.image) banner = getSafeMediaUrl(data.heroBanner.image, "");
    if (data?.seoSettings) seo = data.seoSettings;
  } catch {
    // fallback
  }

  const title = (seo.metaTitle && seo.metaTitle.trim()) ? seo.metaTitle.trim() : schoolName;
  const description = (seo.metaDescription && seo.metaDescription.trim())
    ? seo.metaDescription.trim()
    : `${schoolName} (${eiin ? `EIIN: ${eiin}, ` : ""}${address}) - ${slogan}`;
  
  const shareImage = (seo.ogImage && seo.ogImage.trim()) 
    ? getSafeMediaUrl(seo.ogImage.trim(), banner || logo) 
    : (banner || logo);

  const keywordsList = (seo.keywords && typeof seo.keywords === "string" && seo.keywords.trim())
    ? seo.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : [
        schoolName,
        "বিদ্যালয়",
        "শিক্ষা প্রতিষ্ঠান",
        "ভর্তি তথ্য",
        "নোটিশ বোর্ড",
        "স্কুল ফলাফল",
        "শিক্ষক তালিকা",
        eiin ? `EIIN ${eiin}` : "School",
        address,
      ];

  const siteUrl = (seo.canonicalUrl && seo.canonicalUrl.trim()) 
    ? seo.canonicalUrl.trim() 
    : (process.env.APP_URL || "https://example.com");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${schoolName}`,
    },
    description: description,
    keywords: keywordsList,
    authors: [{ name: schoolName }],
    creator: schoolName,
    publisher: schoolName,
    alternates: {
      canonical: siteUrl,
    },
    verification: {
      google: (seo.googleVerification && seo.googleVerification.trim()) ? seo.googleVerification.trim() : undefined,
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
      googleBot: {
        index: seo.robotsIndex !== false,
        follow: seo.robotsFollow !== false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "bn_BD",
      title: title,
      description: description,
      siteName: schoolName,
      url: siteUrl,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: schoolName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [shareImage],
    },
    icons: {
      icon: [
        { url: logo, sizes: "any" },
      ],
      shortcut: [logo],
      apple: [logo],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialLogo = "/favicon.ico";
  let schoolData: any = null;

  try {
    schoolData = await getSchoolData();
    if (schoolData?.schoolInfo?.logo) {
      initialLogo = getSafeMediaUrl(schoolData.schoolInfo.logo, "/favicon.ico");
    }
  } catch {}

  const schoolName = schoolData?.schoolInfo?.name || "বিদ্যালয় ম্যানেজমেন্ট সিস্টেম";
  const schoolSlogan = schoolData?.schoolInfo?.slogan || "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ";
  const schoolAddress = schoolData?.schoolInfo?.contact?.address || "বাংলাদেশ";
  const schoolPhone = schoolData?.schoolInfo?.contact?.phone || "";
  const schoolEmail = schoolData?.schoolInfo?.contact?.email || "";
  const established = schoolData?.schoolInfo?.established || "";
  const heroImage = getSafeMediaUrl(schoolData?.heroBanner?.image, initialLogo);

  // Schema.org Structured Data (JSON-LD) for EducationalOrganization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": schoolName,
    "description": schoolSlogan,
    "url": typeof process !== "undefined" && process.env.APP_URL ? process.env.APP_URL : "https://example.com",
    "logo": initialLogo,
    "image": heroImage,
    "telephone": schoolPhone,
    "email": schoolEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": schoolAddress,
      "addressCountry": "BD"
    },
    ...(established ? { "foundingDate": established } : {})
  };

  const navData = schoolData ? {
    schoolInfo: {
      ...schoolData.schoolInfo,
      logo: schoolData.schoolInfo?.logo || initialLogo,
    },
    admission: schoolData.admission,
    navbarLinks: schoolData.navbarLinks,
    footerData: schoolData.footerData,
  } : null;

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href={initialLogo} />
        <link rel="shortcut icon" href={initialLogo} />
        <link rel="apple-touch-icon" href={initialLogo} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleTranslator />
        <Navbar initialData={navData} />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Footer initialData={navData} />
      </body>
    </html>
  );
}