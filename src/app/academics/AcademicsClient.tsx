"use client";

import { useState, useMemo } from "react";
import { 
  Calendar, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  ExternalLink,
  CalendarDays,
  FileCheck
} from "lucide-react";

interface AcademicItem {
  id: string | number;
  title: string;
  category: "routine" | "exam" | "syllabus" | "calendar";
  classGrade?: string;
  sessionYear: string;
  publishDate: string;
  fileUrl?: string;
  description?: string;
}

const CATEGORIES = [
  { id: "all", label: "সকল একাডেমিক তথ্য", icon: BookOpen },
  { id: "routine", label: "ক্লাস রুটিন", icon: Clock },
  { id: "exam", label: "পরীক্ষার রুটিন", icon: FileCheck },
  { id: "syllabus", label: "সিলেবাস ও পাঠ্যপরিকল্পনা", icon: FileText },
  { id: "calendar", label: "ছুটি ও ক্যালেন্ডার", icon: CalendarDays },
];

export default function AcademicsClient({ 
  initialItems, 
  schoolInfo 
}: { 
  initialItems: AcademicItem[]; 
  schoolInfo: any;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const schoolName = schoolInfo?.name || "আমাদের বিদ্যাপীঠ";

  // Filter items
  const filteredItems = useMemo(() => {
    return (initialItems || []).filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesClass = selectedClass === "all" || (item.classGrade && item.classGrade.includes(selectedClass));
      const matchesSearch = 
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.classGrade && item.classGrade.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesClass && matchesSearch;
    });
  }, [initialItems, activeCategory, selectedClass, searchQuery]);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "routine":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue-600" />ক্লাস রুটিন</span>;
      case "exam":
        return <span className="bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5"><FileCheck className="w-3 h-3 text-amber-600" />পরীক্ষার রুটিন</span>;
      case "syllabus":
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5"><FileText className="w-3 h-3 text-emerald-600" />সিলেবাস</span>;
      case "calendar":
        return <span className="bg-purple-50 text-purple-800 border border-purple-200/60 font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5"><CalendarDays className="w-3 h-3 text-purple-600" />ছুটির ক্যালেন্ডার</span>;
      default:
        return <span className="bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-2.5 py-1 rounded-md text-xs">একাডেমিক</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* ক্যাটাগরি ট্যাব সিলেক্টর */}
      <div className="flex flex-wrap items-center gap-2 justify-center border-b border-slate-200 pb-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-700 text-white shadow-md shadow-blue-700/20 translate-y-[-1px]"
                  : "bg-white text-slate-600 hover:text-blue-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* সার্চ ইনপুট */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="রুটিন, সিলেবাস বা বিষয় খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
        </div>

        {/* শ্রেণি ফিল্টার */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition font-medium text-slate-700"
          >
            <option value="all">সকল শ্রেণি / বিভাগ</option>
            <option value="৬ষ্ঠ">৬ষ্ঠ শ্রেণি</option>
            <option value="৭ম">৭ম শ্রেণি</option>
            <option value="৮ম">৮ম শ্রেণি</option>
            <option value="৯ম">৯ম শ্রেণি</option>
            <option value="১০ম">১০ম শ্রেণি</option>
            <option value="প্রাতিষ্ঠানিক">প্রাতিষ্ঠানিক</option>
          </select>
        </div>
      </div>

      {/* আইটেম কার্ড গ্রিড */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* কার্ডের উপরের মেটা ট্যাগ */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(item.category)}
                    {item.classGrade && (
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {item.classGrade}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    শিক্ষাবর্ষ: {item.sessionYear}
                  </span>
                </div>

                {/* টাইটেল */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
                  {item.title}
                </h3>

                {/* বিবরণ */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
              </div>

              {/* অ্যাকশন বাটন ও প্রকাশের তারিখ */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>প্রকাশ: {item.publishDate}</span>
                </span>

                <div className="flex items-center gap-2">
                  {item.fileUrl ? (
                    <>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        title="ফাইলটি সরাসরি দেখুন"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>ভিউ</span>
                      </a>
                      <a
                        href={item.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs"
                        title="ফাইলটি ডাউনলোড করুন"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ডাউনলোড</span>
                      </a>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">ফাইল শীঘ্রই সংযুক্ত হবে</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">কোনো তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            আপনার অনুসন্ধান বা নির্বাচিত ক্যাটাগরির সাথে সামঞ্জস্যপূর্ণ কোনো রুটিন বা সিলেবাস এই মুহূর্তে নেই।
          </p>
          <button
            type="button"
            onClick={() => { setActiveCategory("all"); setSelectedClass("all"); setSearchQuery(""); }}
            className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 transition cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
}
