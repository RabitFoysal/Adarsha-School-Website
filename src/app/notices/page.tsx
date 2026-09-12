"use client";

import { useState, useMemo } from "react";
import demoData from "@/data/demoData.json";
import { 
  Bell, 
  Search, 
  Calendar, 
  Download, 
  FileText
} from "lucide-react";

export default function NoticesPage() {
  const { notices } = demoData;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNotices = useMemo(() => {
    return (notices || []).filter((notice: any) => {
      const matchesSearch = 
        notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.date?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedCategory === "all") return matchesSearch;
      if (selectedCategory === "exam") return matchesSearch && (notice.title.includes("পরীক্ষা") || notice.description.includes("পরীক্ষা"));
      if (selectedCategory === "admission") return matchesSearch && (notice.title.includes("ভর্তি") || notice.description.includes("ভর্তি"));
      if (selectedCategory === "general") return matchesSearch && !notice.title.includes("পরীক্ষা") && !notice.title.includes("ভর্তি");
      return matchesSearch;
    });
  }, [notices, searchTerm, selectedCategory]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* পেজের প্রিমিয়াম হেডার */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
          <Bell className="w-3.5 h-3.5 text-blue-600" />
          <span>অফিসিয়াল নোটিশ বোর্ড</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          বিদ্যালয়ের বিজ্ঞপ্তি ও নোটিশ
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          বিদ্যালয়ের সকল সাম্প্রতিক দাপ্তরিক নোটিশ, পরীক্ষার সময়সূচি ও রেজাল্ট সংক্রান্ত তথ্য
        </p>
      </div>

      {/* সার্চ ও ক্যাটাগরি ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* সার্চ বক্স */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নোটিশ অনুসন্ধান করুন..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
          />
        </div>

        {/* ক্যাটাগরি ফিল্টার */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            সকল ({notices?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("exam")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "exam"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            পরীক্ষা
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("admission")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "admission"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ভর্তি
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("general")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "general"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            সাধারণ
          </button>
        </div>
      </div>

      {/* নোটিশ সমূহের তালিকা */}
      <div className="space-y-6">
        {filteredNotices.map((notice: any) => (
          <div 
            key={notice.id} 
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col gap-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs self-start">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>প্রকাশকাল: {notice.date}</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">স্মারক নং: {notice.id}/২০২৬</span>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 leading-snug">
                {notice.title}
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {notice.description}
              </p>
            </div>

            {/* নোটিশ স্ক্যান ইমেজ যদি থাকে */}
            {notice.imageUrl && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-3 max-w-xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>সংযুক্ত নোটিশ কপি:</span>
                </p>
                <img 
                  src={notice.imageUrl} 
                  alt={notice.title} 
                  className="w-full object-contain max-h-[500px] rounded-lg border border-slate-200" 
                />
              </div>
            )}

            {/* ডাউনলোড অ্যাকশন */}
            {notice.attachmentUrl && (
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <a 
                  href={notice.attachmentUrl} 
                  download
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-xs text-xs md:text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>ফাইল ডাউনলোড করুন (PDF/Word)</span>
                </a>
              </div>
            )}
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-base text-slate-700">কোনো নোটিশ পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">ভিন্ন শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।</p>
          </div>
        )}
      </div>

    </main>
  );
}
