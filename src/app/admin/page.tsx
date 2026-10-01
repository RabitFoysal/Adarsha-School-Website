"use client";

import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Users, 
  Bell, 
  Images, 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  Layers, 
  Database, 
  ExternalLink,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoaded } = useAdminData();

  const stats = [
    { title: "মোট নোটিশ", count: data.notices?.length || 0, href: "/admin/notices", icon: Bell, color: "text-rose-600 bg-rose-50" },
    { title: "শিক্ষকমণ্ডলী", count: data.teachers?.length || 0, href: "/admin/teachers", icon: Users, color: "text-blue-600 bg-blue-50" },
    { title: "চিত্রশালা ছবি", count: data.gallery?.length || 0, href: "/admin/gallery", icon: Images, color: "text-emerald-600 bg-emerald-50" },
    { title: "ব্লগ ও অনুচ্ছেদ", count: data.blogs?.length || 0, href: "/admin/blog", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      {/* ওয়েলকাম হেডার */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">কন্ট্রোল সেন্টার</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {data.schoolInfo?.name || "স্কুল ম্যানেজমেন্ট সিস্টেম"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ওয়েবসাইটের সকল তথ্য, নোটিশ, শিক্ষক তালিকা ও সেটিংস এখান থেকে নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition"
          >
            <span>লাইভ ওয়েবসাইট</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-100 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>সেটিংস</span>
          </Link>
        </div>
      </div>

      {/* স্ট্যাটাস কার্ডস গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition duration-300 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">{s.title}</span>
                <div className="text-3xl font-black text-slate-900">{isLoaded ? s.count : "..."}</div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* দ্রুত লিংক ও শর্টকাটস */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>দ্রুত অ্যাকশন</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/admin/notices" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold flex items-center justify-between">
              <span>নতুন নোটিশ দিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/admin/dignitaries" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold flex items-center justify-between">
              <span>নেতৃত্ব ও বিশিষ্ট ব্যক্তিত্ব</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/admin/teachers" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold flex items-center justify-between">
              <span>শিক্ষক যুক্ত করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/admin/gallery" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold flex items-center justify-between">
              <span>ক্যাম্পাস চিত্রশালা</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/admin/layout-settings" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition text-xs font-bold flex items-center justify-between">
              <span>হোমপেজ লেআউট সাজান</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/admin/seo" className="p-3 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition text-xs font-bold flex items-center justify-between">
              <span>🔍 এসইও (SEO) কনফিগারেশন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>ডেটা নিরাপত্তা ও ব্যাকআপ</span>
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার সকল ডাটা ক্লাউডে সুরক্ষিত রয়েছে। আপনি চাইলে যেকোনো সময় সম্পূর্ণ ডেটার একটি অফলাইন ব্যাকআপ ডাউনলোড করে রাখতে পারেন।
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition"
            >
              <span>ডাটাবেজ ও ব্যাকআপ সেন্টার</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
