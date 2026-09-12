import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School CMS",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      {/* বডি ট্যাগ-এর ভেতরেও suppressHydrationWarning যোগ করা হলো */}
      <body className={inter.className} suppressHydrationWarning>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}