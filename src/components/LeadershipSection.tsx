"use client";

import { useState } from "react";
import SafeImage from "@/components/SafeImage";
import demoData from "@/data/demoData.json";
import { 
  GraduationCap, 
  Award, 
  Landmark, 
  Sparkles, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Calendar,
  Briefcase,
  Globe
} from "lucide-react";

interface Dignitary {
  id: number;
  name: string;
  designation: string;
  roleBadge?: string;
  badgeColor?: "amber" | "blue" | "emerald" | "purple" | string;
  organization?: string;
  image?: string;
  bio?: string;
  quote?: string;
  degrees?: string[];
  achievements?: string[];
  affiliations?: string[];
  expertise?: string[];
  phone?: string;
  email?: string;
  tenure?: string;
  experience?: string;
  socialLinks?: string;
  order?: number;
}

const toSafeList = (val: any): string[] => {
  if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
  if (typeof val === "string") return val.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  return [];
};

export default function LeadershipSection({ dignitaries }: { dignitaries?: Dignitary[] }) {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [filterRole, setFilterRole] = useState<string>("all");

  const fallbackDignitaries = (demoData as any).dignitaries || [];
  const list: any[] = (dignitaries && Array.isArray(dignitaries) && dignitaries.length > 0)
    ? dignitaries 
    : fallbackDignitaries;

  if (!list || list.length === 0) return null;

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredList = list.filter((item: any) => {
    if (filterRole === "all") return true;
    if (filterRole === "president") return item?.designation?.includes("সভাপতি");
    if (filterRole === "headmaster") return item?.designation?.includes("প্রধান শিক্ষক") || item?.designation?.includes("অধ্যক্ষ");
    if (filterRole === "others") return !item?.designation?.includes("সভাপতি") && !item?.designation?.includes("প্রধান শিক্ষক");
    return true;
  });

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case "amber":
        return {
          badge: "bg-amber-50 text-amber-900 border-amber-200 ring-1 ring-amber-400/20",
          topBar: "from-amber-500 via-amber-600 to-orange-600",
          accentText: "text-amber-700",
          iconBg: "bg-amber-100 text-amber-800",
        };
      case "blue":
        return {
          badge: "bg-blue-50 text-blue-900 border-blue-200 ring-1 ring-blue-400/20",
          topBar: "from-blue-600 via-indigo-600 to-sky-600",
          accentText: "text-blue-700",
          iconBg: "bg-blue-100 text-blue-800",
        };
      case "emerald":
        return {
          badge: "bg-emerald-50 text-emerald-900 border-emerald-200 ring-1 ring-emerald-400/20",
          topBar: "from-emerald-600 via-teal-600 to-green-600",
          accentText: "text-emerald-700",
          iconBg: "bg-emerald-100 text-emerald-800",
        };
      case "purple":
        return {
          badge: "bg-purple-50 text-purple-900 border-purple-200 ring-1 ring-purple-400/20",
          topBar: "from-purple-600 via-violet-600 to-fuchsia-600",
          accentText: "text-purple-700",
          iconBg: "bg-purple-100 text-purple-800",
        };
      default:
        return {
          badge: "bg-slate-100 text-slate-800 border-slate-200",
          topBar: "from-slate-700 via-slate-800 to-zinc-900",
          accentText: "text-slate-800",
          iconBg: "bg-slate-100 text-slate-700",
        };
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300">
      {/* ১. প্রিমিয়াম হেডার ও ফিল্টার বার */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>নেতৃত্ব ও দিকনির্দেশনা</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              প্রতিষ্ঠান পরিচালনা ও সম্মানিত ব্যক্তিবর্গ
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              বিদ্যালয়ের সুযোগ্য গভর্নিং বডি ও প্রশাসনিক নেতৃত্বের দূরদর্শী দিকনির্দেশনা, শিক্ষাগত ডিগ্রি, মূল অবদান ও সামাজিক পরিচিতি।
            </p>
          </div>

          {/* ফিল্টার বাটন গ্রুপ (ডেস্কটপ ও মোবাইলে রেসপন্সিভ) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterRole("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                filterRole === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              সকল ({list.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRole("president")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                filterRole === "president"
                  ? "bg-white text-amber-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              সভাপতি
            </button>
            <button
              type="button"
              onClick={() => setFilterRole("headmaster")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                filterRole === "headmaster"
                  ? "bg-white text-blue-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              প্রধান শিক্ষক
            </button>
            <button
              type="button"
              onClick={() => setFilterRole("others")}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                filterRole === "others"
                  ? "bg-white text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              অন্যান্য ব্যক্তিবর্গ
            </button>
          </div>
        </div>
      </div>

      {/* ২. কার্ড গ্রিড এরিয়া */}
      <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40">
        {filteredList.map((person) => {
          const style = getBadgeStyle(person.badgeColor);
          const isExpanded = !!expandedCards[person.id];

          return (
            <div
              key={person.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* কার্ড টপ অ্যাকসেন্ট স্ট্রিপ */}
              <div className={`h-2.5 w-full bg-gradient-to-r ${style.topBar}`} />

              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col">
                {/* প্রোফাইল হেডার: ছবি + নাম + পদবি */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-3 ring-slate-100 shadow-sm shrink-0 bg-slate-100">
                    <SafeImage
                      src={person.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=Portrait"}
                      fallbackSrc="https://placehold.co/400x400/e2e8f0/1e293b?text=Portrait"
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="সক্রিয় নেতৃত্ব" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2.5 py-0.5 text-[11px] font-black rounded-lg border mb-1.5 ${style.badge}`}>
                      {person.roleBadge || person.designation}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                      {person.designation}
                    </p>
                    {person.organization && (
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {person.organization}
                      </p>
                    )}
                    {person.tenure && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>কার্যকাল: {person.tenure}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* কোটেশন বক্স (যদি থাকে) */}
                {person.quote && (
                  <div className="relative p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-700 italic text-xs sm:text-[13px] leading-relaxed flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>&ldquo;{person.quote}&rdquo;</span>
                  </div>
                )}

                {/* পূর্ব অভিজ্ঞতা ও কর্মজীবন (যদি থাকে) */}
                {person.experience && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">কর্মজীবন ও অভিজ্ঞতা: </span>
                      <span>{person.experience}</span>
                    </div>
                  </div>
                )}

                {/* সংক্ষিপ্ত পরিচয় (Bio) */}
                {person.bio && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {person.bio}
                  </p>
                )}

                {/* শিক্ষাগত যোগ্যতা / ডিগ্রি (Degrees) */}
                {(() => {
                  const degList = toSafeList(person.degrees);
                  if (degList.length === 0) return null;
                  return (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span>শিক্ষাগত ডিগ্রি ও যোগ্যতা</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {degList.map((deg, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50/80 text-blue-900 border border-blue-200/70"
                          >
                            {deg}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* বিশেষ অবদান ও কী কী করেছেন (Key Achievements) */}
                {(() => {
                  const achList = toSafeList(person.achievements);
                  if (achList.length === 0) return null;
                  return (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>বিশেষ অবদান ও প্রধান অর্জনসমূহ</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {achList.slice(0, isExpanded ? undefined : 2).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}

                {/* এক্সপ্যান্ডেবল সেকশন: অন্যান্য সংশ্লিষ্টতা ও বিশেষ দক্ষতা */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
                    {/* অন্যান্য সংশ্লিষ্টতা (Affiliations) */}
                    {(() => {
                      const affList = toSafeList(person.affiliations);
                      if (affList.length === 0) return null;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                            <Landmark className="w-4 h-4 text-emerald-600" />
                            <span>অন্যান্য দায়িত্ব ও সামাজিক সংশ্লিষ্টতা</span>
                          </div>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {affList.map((aff, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                <span>{aff}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    {/* বিশেষ দক্ষতা ও ক্ষেত্র (Expertise) */}
                    {(() => {
                      const expList = toSafeList(person.expertise);
                      if (expList.length === 0) return null;
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>বিশেষ অভিজ্ঞতা ও দক্ষতা</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {expList.map((exp, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-purple-50 text-purple-800 border border-purple-100"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* কার্ড ফুটার: যোগাযোগ ও এক্সপ্যান্ড টগল */}
              <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {person.phone && (
                    <a
                      href={`tel:${person.phone}`}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs transition"
                      title={`কল করুন: ${person.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs transition"
                      title={`ইমেইল পাঠান: ${person.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {person.socialLinks && (
                    <a
                      href={person.socialLinks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-xs transition"
                      title="সামাজিক যোগাযোগ প্রোফাইল"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(person.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl border border-blue-200/60 transition"
                >
                  <span>{isExpanded ? "সংক্ষেপ করুন" : "বিস্তারিত প্রোফাইল"}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
