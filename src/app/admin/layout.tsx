"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { AdminDataProvider, useAdminData } from "@/context/AdminDataContext";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useAdminData();

  const logoUrl = data.schoolInfo?.logo || "https://placehold.co/100x100?text=Logo";
  const schoolName = data.schoolInfo?.name || "বিদ্যালয় অ্যাডমিন";

  const menuItems = [
    { href: "/admin", name: "📊 ড্যাশবোর্ড" },
    { href: "/admin/layout-settings", name: "🧱 লেআউট সেটিংস" },
    { href: "/admin/gallery", name: "📸 ক্যাম্পাস চিত্রশালা" },
    { href: "/admin/directory", name: "📁 তথ্য কেন্দ্র সেটিংস" },
    { href: "/admin/menu", name: "📋 মেনুবার লিঙ্ক সেটিংস" },
    { href: "/admin/footer", name: "🦶 ফুটার ম্যানেজমেন্ট" },
    { href: "/admin/custom-pages", name: "🧱 কাস্টম পেজ বিল্ডার" },
    { href: "/admin/blog", name: "📝 ব্লগ ম্যানেজমেন্ট" },
    { href: "/admin/news", name: "📰 স্ক্রলিং বার্তা" },
    { href: "/admin/notices", name: "📢 নোটিশ ম্যানেজমেন্ট" },
    { href: "/admin/academics", name: "📚 রুটিন ও সিলেবাস" },
    { href: "/admin/fees", name: "💳 ফি ও পেমেন্ট সেটিংস" },
    { href: "/admin/alumni", name: "🎓 অ্যালামনাই ও কৃতি শিক্ষার্থী" },
    { href: "/admin/messages", name: "💬 বাণী ম্যানেজমেন্ট" },
    { href: "/admin/teachers", name: "👨‍🏫 শিক্ষক ম্যানেজমেন্ট" },
    { href: "/admin/staff", name: "👥 কর্মচারী ম্যানেজমেন্ট" },
    { href: "/admin/committee", name: "💼 পরিচালনা পর্ষদ ম্যানেজমেন্ট" },
    { href: "/admin/dignitaries", name: "🏅 নেতৃত্ব ও বিশিষ্ট ব্যক্তিবর্গ" },
    { href: "/admin/about", name: "🏛️ প্রতিষ্ঠান পরিচিতি" },
    { href: "/admin/links", name: "🔗 সাইডবার লিংক ও হটলাইন" },
    { href: "/admin/seo", name: "🔍 এসইও (SEO) সেটিংস" },
    { href: "/admin/settings", name: "⚙️ সেটিংস ও বাটন ভাষা" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl z-10 shrink-0">
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
        <nav className="flex-1 p-4 space-y-1.5 mt-2 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                prefetch={true}
                className={`block px-4 py-2.5 rounded-lg transition-colors duration-150 border-l-4 font-medium text-sm ${
                  isActive 
                    ? "bg-gray-800 text-blue-400 border-blue-500 font-bold shadow-xs" 
                    : "text-gray-400 border-transparent hover:bg-gray-800/60 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-800 mt-2"><LogoutButton /></div>
        </nav>
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <Link href="/" className="block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
            ওয়েবসাইটে ফেরত যান
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen bg-slate-50">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminDataProvider>
  );
}
