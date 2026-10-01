"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import demoData from "@/data/demoData.json";
import { 
  Users, 
  Search, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  Star,
  ArrowRight,
  School,
  BookOpen
} from "lucide-react";

export type Teacher = {
  id: number;
  name: string;
  designation: string;
  section?: string;
  customSectionName?: string;
  subject?: string;
  qualification?: string;
  order?: number;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  joiningDate?: string;
  indexNumber?: string;
  teacherId?: string;
  address?: string;
  speech?: string;
  isLeadership?: boolean;
  image: string;
  bio?: string;
};

const STANDARD_METADATA: Record<string, { title: string; subtitle: string; icon: string; badge: string; color: string }> = {
  college: {
    title: "কলেজ শাখা (উচ্চ মাধ্যমিক)",
    subtitle: "একাদশ ও দ্বাদশ শ্রেণির অ্যাকাডেমিক অনুষদ ও বিষয়ভিত্তিক প্রভাষকবৃন্দ",
    icon: "🎓",
    badge: "উচ্চ মাধ্যমিক অনুষদ",
    color: "from-blue-600 to-indigo-700"
  },
  high_school: {
    title: "মাধ্যমিক শাখা (হাই স্কুল)",
    subtitle: "ষষ্ঠ থেকে দশম শ্রেণির অভিজ্ঞ ও দায়িত্বশীল শিক্ষকমণ্ডলী",
    icon: "🏫",
    badge: "মাধ্যমিক অনুষদ",
    color: "from-teal-600 to-emerald-700"
  },
  primary: {
    title: "প্রাথমিক শাখা (প্রাইমারি)",
    subtitle: "শিশু শ্রেণি থেকে পঞ্চম শ্রেণি পর্যন্ত স্নেহময় ও দক্ষ শিক্ষকবৃন্দ",
    icon: "🎒",
    badge: "প্রাথমিক অনুষদ",
    color: "from-amber-500 to-orange-600"
  },
};

export default function TeachersClient({ initialTeachers, initialSchoolInfo }: { initialTeachers?: any[]; initialSchoolInfo?: any }) {
  const teachers: Teacher[] = initialTeachers !== undefined && initialTeachers !== null ? initialTeachers : (demoData.teachers || []);
  const schoolInfo = initialSchoolInfo !== undefined && initialSchoolInfo !== null ? initialSchoolInfo : demoData.schoolInfo;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // শিক্ষকদের সর্টিং এবং গ্রুপিং
  const { leadershipTeachers, categorizedSections, allSectionsList } = useMemo(() => {
    // ১. শুধুমাত্র যাদের ক্ষেত্রে প্রশাসন সিলেক্ট করা হয়েছে (section === "administration" বা isLeadership) তারা প্রশাসনে যাবে।
    // যার ক্ষেত্রে প্রশাসন সিলেক্ট করা হবে না সে কখনোই প্রশাসনে যাবে না।
    const leadership = teachers
      .filter((t) => t.section === "administration" || t.isLeadership === true)
      .sort((a, b) => {
        const orderA = a.order !== undefined ? Number(a.order) : 999;
        const orderB = b.order !== undefined ? Number(b.order) : 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.id || 0) - (b.id || 0);
      });

    // ২. সাধারণ শিক্ষকদের সেকশন অনুযায়ী ভাগ করা (প্রশাসনের শিক্ষকরা সাধারণ তালিকায় ডুপ্লিকেট হবে না)
    const generalTeachers = teachers.filter((t) => !leadership.includes(t));

    const sectionsMap: Record<string, Teacher[]> = {};

    generalTeachers.forEach((t) => {
      // সেকশনের কি নির্ধারণ (কাস্টম সেকশন হলে তার নাম ব্যবহার হবে)
      const secKey = (t.customSectionName && t.customSectionName.trim()) 
        ? t.customSectionName.trim() 
        : (t.section || "high_school");

      if (!sectionsMap[secKey]) {
        sectionsMap[secKey] = [];
      }
      sectionsMap[secKey].push(t);
    });

    // প্রতিটি সেকশনের ভেতর তাদের নিজস্ব ক্রম (Order in section) অনুযায়ী সাজানো
    // যেমন প্রাইমারিতে ১ থেকে শুরু, মাধ্যমিকে ১ থেকে শুরু, কাস্টম শাখায় ১ থেকে শুরু
    Object.keys(sectionsMap).forEach((secKey) => {
      sectionsMap[secKey].sort((a, b) => {
        const orderA = a.order !== undefined ? Number(a.order) : 999;
        const orderB = b.order !== undefined ? Number(b.order) : 999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || "").localeCompare(b.name || "", "bn");
      });
    });

    const knownKeys = ["college", "high_school", "primary"];
    const standardKeysInUse = knownKeys.filter((k) => sectionsMap[k]?.length);
    const customKeysInUse = Object.keys(sectionsMap).filter((k) => !knownKeys.includes(k) && k !== "administration");
    const allSecs = [...standardKeysInUse, ...customKeysInUse];

    return {
      leadershipTeachers: leadership,
      categorizedSections: sectionsMap,
      allSectionsList: allSecs
    };
  }, [teachers]);

  // সার্চ ফিল্টারিং হেল্পার
  const filterBySearch = (list: Teacher[]) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter((t) => 
      t.name?.toLowerCase().includes(term) ||
      t.designation?.toLowerCase().includes(term) ||
      t.subject?.toLowerCase().includes(term) ||
      t.qualification?.toLowerCase().includes(term) ||
      t.phone?.includes(term)
    );
  };

  const filteredLeadership = filterBySearch(leadershipTeachers);

  const getSectionInfo = (secKey: string) => {
    if (STANDARD_METADATA[secKey]) {
      return STANDARD_METADATA[secKey];
    }
    return {
      title: secKey.includes("শাখা") || secKey.includes("বিভাগ") ? secKey : `${secKey} বিভাগ`,
      subtitle: "অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলী",
      icon: "📁",
      badge: secKey,
      color: "from-purple-600 to-indigo-600"
    };
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 min-h-screen">
      
      {/* পেজের প্রিমিয়াম হেডার সেকশন */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>অনুষদ ও শিক্ষকমণ্ডলী</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          আমাদের নিবেদিতপ্রাণ শিক্ষকবৃন্দ
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolInfo.name}-এর দক্ষ, অভিজ্ঞ ও স্নেহশীল শিক্ষকমণ্ডলী যারা ভবিষ্যৎ প্রজন্ম গঠনে নিরলসভাবে জ্ঞান বিতরণ করে যাচ্ছেন।
        </p>

        {/* সার্চ বার */}
        <div className="mt-7 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিক্ষকের নাম, বিষয় বা পদবি দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 text-xs md:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm transition placeholder-slate-400 text-center"
            />
          </div>
        </div>

        {/* দ্রুত নেভিগেশন সেকশন ট্যাব */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              selectedTab === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs scale-105"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            🏛️ সকল শাখা
          </button>
          
          {leadershipTeachers.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTab("leadership")}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 border flex items-center gap-1.5 cursor-pointer ${
                selectedTab === "leadership"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs scale-105"
                  : "bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব ({leadershipTeachers.length})</span>
            </button>
          )}

          {allSectionsList.map((secKey) => {
            const info = getSectionInfo(secKey);
            const count = categorizedSections[secKey]?.length || 0;
            return (
              <button
                type="button"
                key={secKey}
                onClick={() => setSelectedTab(secKey)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 border flex items-center gap-1.5 cursor-pointer ${
                  selectedTab === secKey
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40"
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.title.split("(")[0].trim()}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ১. প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব (EXECUTIVE LEADERSHIP DYNAMIC SECTION)  */}
      {/* ফিক্সড ৩ জন নয় - যতজন অ্যাডমিন থাকবে ততজন সুন্দরভাবে সেন্টার এলাইন থাকবে */}
      {/* ২ জন থাকলে পাশাপাশি সেন্টার এলাইন, ১ জন থাকলে মাঝে সেন্টার এলাইন           */}
      {/* ========================================================================= */}
      {(selectedTab === "all" || selectedTab === "leadership") && filteredLeadership.length > 0 && (
        <section className="mb-16">
          
          {/* সেকশন হেডিং (সেন্টার্ড) */}
          <div className="text-center mb-8 border-b border-amber-200/80 pb-4 max-w-2xl mx-auto">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-md mx-auto mb-2.5">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <span>প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব</span>
              <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {filteredLeadership.length} জন
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              প্রতিষ্ঠানের সার্বিক পরিচালনা ও অ্যাকাডেমিক শৃঙ্খলায় নিয়োজিত শীর্ষ নেতৃত্ব
            </p>
          </div>

          {/* লিডারশিপ কার্ড গ্রিড - সম্পূর্ণ সেন্টার এলাইন্ড ফ্লেক্স র‍্যাপ */}
          <div className="flex flex-wrap items-stretch justify-center gap-6 max-w-5xl mx-auto">
            {filteredLeadership.map((leader) => (
              <div 
                key={leader.id} 
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-400 overflow-hidden flex flex-col items-center text-center justify-between group hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                {/* আলংকারিক টপ ব্যাজ (কার্ডে কোনো ক্রম প্রদর্শন হবে না) */}
                <div className="w-full flex items-center justify-center mb-4">
                  <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব</span>
                  </span>
                </div>

                {/* ছবি (সেন্টার) */}
                <div className="relative mb-4">
                  <img 
                    src={leader.image || "https://placehold.co/400x400?text=Leadership"} 
                    alt={leader.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-4 border-amber-400 shadow-xl group-hover:scale-105 transition duration-300 mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Leadership";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-md border-2 border-slate-900">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                {/* নাম ও পদবি */}
                <div className="space-y-1 mb-4 w-full">
                  <h3 className="text-lg font-black text-amber-300 tracking-tight">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-300">
                    {leader.designation}
                  </p>
                  {leader.subject && (
                    <p className="text-[11px] text-amber-400/90 font-medium">
                      বিষয়: {leader.subject}
                    </p>
                  )}
                  {leader.qualification && (
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      🎓 {leader.qualification}
                    </p>
                  )}
                </div>

                {/* অনুপ্রেরণামূলক উক্তি */}
                {leader.speech && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 text-xs text-slate-300 italic text-center w-full line-clamp-2">
                    “{leader.speech}”
                  </div>
                )}

                {/* যোগাযোগ ও অ্যাকশন বাটন */}
                <div className="w-full pt-3 border-t border-white/10 flex flex-col items-center gap-2">
                  {leader.phone && (
                    <div className="text-[11px] text-slate-300 flex items-center justify-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{leader.phone}</span>
                    </div>
                  )}

                  <Link 
                    href={`/teachers/${leader.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs py-2 px-4 rounded-xl transition duration-200 shadow-md mt-1"
                  >
                    <span>পূর্ণাঙ্গ প্রোফাইল</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ২. শাখাভিত্তিক শিক্ষকমণ্ডলী (SECTION-WISE GENERAL & CUSTOM TEACHERS)     */}
      {/* প্রতিটি শাখার জন্য নিজস্ব ক্রম ১ থেকে কার্যকর থাকবে, কার্ডে ক্রম দেখাবে না  */}
      {/* ========================================================================= */}
      {allSectionsList.map((secKey) => {
        if (selectedTab !== "all" && selectedTab !== secKey) return null;

        const rawList = categorizedSections[secKey] || [];
        const sectionTeachers = filterBySearch(rawList);
        if (sectionTeachers.length === 0 && searchTerm) return null;

        const info = getSectionInfo(secKey);

        return (
          <section key={secKey} className="mb-14">
            
            {/* সেকশনের স্বতন্ত্র সেন্টার্ড হেডিং */}
            <div className="text-center mb-8 border-b border-slate-200 pb-4 max-w-xl mx-auto">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-lg shadow-2xs mx-auto mb-2">
                {info.icon}
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
                <span>{info.title}</span>
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  {sectionTeachers.length} জন
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {info.subtitle}
              </p>
            </div>

            {/* শিক্ষকমণ্ডলীর কার্ড গ্রিড - সম্পূর্ণ সেন্টার এলাইন্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectionTeachers.map((teacher) => {
                return (
                  <div 
                    key={teacher.id} 
                    className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden group relative p-5"
                  >
                    {/* টপ কালার স্ট্রাইপ */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${info.color}`}></div>

                    <div className="w-full flex flex-col items-center">
                      
                      {/* সেকশন ব্যাজ (কার্ডে কোনো ক্রম নম্বর প্রদর্শন হবে না) */}
                      <div className="flex items-center justify-center gap-2 mb-3 mt-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {info.title.split("(")[0].trim()}
                        </span>
                      </div>

                      {/* বৃত্তাকার বা রাউন্ডেড ফটো (সেন্টার) */}
                      <div className="relative mb-3">
                        <img 
                          src={teacher.image || "https://placehold.co/400x400?text=Teacher"} 
                          alt={teacher.name} 
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-slate-100 group-hover:border-blue-500 shadow-md group-hover:scale-105 transition duration-300 mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Teacher";
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-xs border border-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* নাম (সেন্টার) */}
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight">
                        {teacher.name}
                      </h3>

                      {/* পদবি (সেন্টার) */}
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">
                        {teacher.designation}
                      </p>

                      {/* বিষয় (যদি দেওয়া থাকে) */}
                      {teacher.subject && (
                        <p className="text-xs text-slate-600 mt-1">
                          বিষয়: <span className="font-bold text-slate-800">{teacher.subject}</span>
                        </p>
                      )}

                      {/* শিক্ষাগত যোগ্যতা (যদি দেওয়া থাকে) */}
                      {teacher.qualification && (
                        <span className="inline-block text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md mt-2 font-medium">
                          🎓 {teacher.qualification}
                        </span>
                      )}

                      {/* সংক্ষিপ্ত বাণী বা উক্তি (যদি দেওয়া থাকে) */}
                      {teacher.speech && (
                        <p className="text-xs text-slate-500 italic mt-2.5 px-2 line-clamp-2">
                          "{teacher.speech}"
                        </p>
                      )}

                      {/* ফোন নম্বর (যদি দেওয়া থাকে) */}
                      {teacher.phone && (
                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
                          <Phone className="w-3 h-3 text-blue-500" />
                          <span>{teacher.phone}</span>
                        </div>
                      )}

                      {/* ইমেইল (যদি দেওয়া থাকে) */}
                      {teacher.email && (
                        <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-center gap-1">
                          <Mail className="w-3 h-3 text-blue-500" />
                          <span>{teacher.email}</span>
                        </div>
                      )}

                    </div>
                    
                    {/* বিস্তারিত প্রোফাইল দেখার সেন্টার্ড বাটন */}
                    <div className="w-full pt-4 mt-4 border-t border-slate-100">
                      <Link 
                        href={`/teachers/${teacher.id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition duration-200"
                      >
                        <span>বিস্তারিত দেখুন</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

            {sectionTeachers.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                এই শাখায় কোনো শিক্ষক পাওয়া যায়নি।
              </div>
            )}
          </section>
        );
      })}

      {/* অনুসন্ধান বা ফিল্টারে কিছুই না পেলে */}
      {searchTerm && filteredLeadership.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 max-w-md mx-auto shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-base text-slate-700">"{searchTerm}" দিয়ে কোনো শিক্ষক পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 mt-1">অনুগ্রহ করে ভিন্ন বানান বা বিষয়ের নাম দিয়ে অনুসন্ধান করুন।</p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-4 text-xs font-bold bg-blue-50 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-100 transition cursor-pointer"
          >
            সার্চ ক্লিয়ার করুন
          </button>
        </div>
      )}

    </main>
  );
}
