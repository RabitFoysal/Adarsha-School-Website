import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaviconAndLogoSync from "@/components/FaviconAndLogoSync";
import demoData from "@/data/demoData.json";
import fs from "fs";
import path from "path";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let logo = "/favicon.ico";
  let schoolName = "School CMS";

  try {
    const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      const data = JSON.parse(fileData);
      if (data.schoolInfo?.logo) {
        logo = data.schoolInfo.logo;
      }
      if (data.schoolInfo?.name) {
        schoolName = data.schoolInfo.name;
      }
    }
  } catch {
    logo = demoData?.schoolInfo?.logo || "/favicon.ico";
    schoolName = demoData?.schoolInfo?.name || "School CMS";
  }

  return {
    title: {
      default: schoolName,
      template: `%s | ${schoolName}`,
    },
    description: `${schoolName} - আধুনিক ডায়নামিক বিদ্যালয় তথ্য ও পরিচালনা প্ল্যাটফর্ম`,
    icons: {
      icon: [{ url: logo, sizes: "any" }],
      shortcut: [logo],
      apple: [logo],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLogo = demoData?.schoolInfo?.logo || "/favicon.ico";

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href={initialLogo} />
        <link rel="shortcut icon" href={initialLogo} />
        <link rel="apple-touch-icon" href={initialLogo} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <FaviconAndLogoSync />
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}