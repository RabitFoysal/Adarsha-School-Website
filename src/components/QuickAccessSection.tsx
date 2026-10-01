"use client";

import Link from "next/link";
import demoData from "@/data/demoData.json";
import { 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Award, 
  ArrowRight,
  BookOpen,
  FileText,
  Users
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  Calendar,
  CreditCard,
  Award,
  BookOpen,
  FileText,
  Users
};

export default function QuickAccessSection({ 
  data, 
  admission 
}: { 
  data?: any[]; 
  admission?: any;
}) {
  const isAdmissionOpen = admission?.isOpen !== false;
  const rawList = data && data.length > 0 ? data : (demoData as any).quickAccess || [];

  const quickActions = rawList.map((item: any) => {
    // If it's the admission card, adjust dynamically based on admission state
    if (item.id === "admission") {
      return {
        ...item,
        title: isAdmissionOpen ? item.title || "ভর্তি তথ্য ও ফরম" : "ভর্তি সংক্রান্ত নোটিশ",
        tag: isAdmissionOpen 
          ? (admission?.externalLink ? "অনলাইন আবেদন" : item.tag || "ভর্তি চলছে") 
          : "ভর্তি স্থগিত",
        description: isAdmissionOpen 
          ? (item.description || "আবেদন প্রক্রিয়া, আসন সংখ্যা, যোগ্যতা ও ফি সংক্রান্ত বিস্তারিত") 
          : (admission?.closedNotice || "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম স্থগিত রয়েছে"),
        color: isAdmissionOpen ? item.color || "from-blue-600 to-indigo-600" : "from-slate-600 to-slate-700",
        topBar: isAdmissionOpen ? item.topBar || "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-slate-400",
        textColor: isAdmissionOpen ? item.textColor || "text-blue-700" : "text-slate-700",
        tagBg: isAdmissionOpen 
          ? (item.tagBg || "bg-blue-50 text-blue-800 border-blue-200") 
          : "bg-slate-100 text-slate-600 border-slate-300",
        icon: ICON_MAP[item.iconName] || GraduationCap
      };
    }

    return {
      ...item,
      icon: ICON_MAP[item.iconName] || Calendar
    };
  });

  if (quickActions.length === 0) return null;

  return (
    <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((item: any, idx: number) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href || "#"}
              className={`rounded-3xl border bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group ${item.accentBorder || "border-slate-200 hover:border-blue-400"}`}
            >
              <div className={`h-2 w-full ${item.topBar || "bg-blue-600"}`}></div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color || "from-blue-600 to-indigo-600"} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-2 transition duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.tagBg || "bg-slate-50 text-slate-800 border-slate-200"}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className={`mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-black ${item.textColor || "text-blue-700"}`}>
                  <span>সরাসরি প্রবেশ করুন</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
