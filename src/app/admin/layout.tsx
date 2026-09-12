"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import demoData from "@/data/demoData.json";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState(demoData.schoolInfo.logo);
  const [schoolName, setSchoolName] = useState(demoData.schoolInfo.name);

  useEffect(() => {
    fetch("/api/school-info", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.schoolInfo?.logo) setLogoUrl(data.schoolInfo.logo);
        if (data.schoolInfo?.name) setSchoolName(data.schoolInfo.name);
      })
      .catch(() => {});

    const handleSync = (e: any) => {
      if (e.detail?.logo) setLogoUrl(e.detail.logo);
      if (e.detail?.name) setSchoolName(e.detail.name);
    };

    window.addEventListener("school-info-updated", handleSync);
    return () => window.removeEventListener("school-info-updated", handleSync);
  }, []);

  const menuItems = [
    { href: "/admin", name: "📊 ড্যাশবোর্ড" },
    { href: "/admin/layout-settings", name: "🧱 লেআউট সেটিংস" },
    { href: "/admin/directory", name: "📁 তথ্য কেন্দ্র সেটিংস" },
    { href: "/admin/menu", name: "📋 মেনুবার লিঙ্ক সেটিংস" },
    { href: "/admin/custom-pages", name: "🧱 কাস্টম পেজ বিল্ডার" },
    { href: "/admin/media", name: "🖼️ মিডিয়া লাইব্রেরি" },
    { href: "/admin/blog", name: "📝 ব্লগ ম্যানেজমেন্ট" },
    { href: "/admin/news", name: "📰 স্ক্রলিং বার্তা" },
    { href: "/admin/notices", name: "📢 নোটিশ ম্যানেজমেন্ট" },
    { href: "/admin/messages", name: "💬 বাণী ম্যানেজমেন্ট" },
    { href: "/admin/teachers", name: "👨‍🏫 শিক্ষক ম্যানেজমেন্ট" },
    { href: "/admin/staff", name: "👥 কর্মচারী ম্যানেজমেন্ট" },
    { href: "/admin/committee", name: "💼 পরিচালনা পর্ষদ ম্যানেজমেন্ট" },
    { href: "/admin/settings", name: "⚙️ সেটিংস ও বাটন ভাষা" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-5 border-b border-gray-800 flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="School Logo" 
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-blue-500 bg-white shrink-0" 
          />
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate">{schoolName}</h2>
            <p className="text-[11px] text-blue-400 font-medium">অ্যাডমিন প্যানেল</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 mt-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`block px-4 py-2.5 rounded-lg transition duration-200 border-l-4 font-medium text-sm ${
                  isActive 
                    ? "bg-gray-800 text-blue-400 border-blue-500 font-bold" 
                    : "text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-800 mt-2"><LogoutButton /></div>
        </nav>
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <Link href="/" className="block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">ওয়েবসাইটে ফেরত যান</Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}