"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import demoData from "@/data/demoData.json";
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  GraduationCap, 
  Calendar, 
  Award, 
  Users, 
  ArrowRight, 
  Building2, 
  BookOpen, 
  Download, 
  Quote, 
  ExternalLink, 
  PhoneCall, 
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  School
} from "lucide-react";

// ১. আধুনিক স্ক্রলিং ও ইন্টারেক্টিভ বার্তা কম্পোনেন্ট (Modern Smart Ticker)
function NewsTickerSection({ data }: { data: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0 || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [data, isPlaying]);

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const currentItem = data[currentIndex] || data[0];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-[73px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-11 gap-3">
        {/* টিকার ব্যাজ */}
        <div className="flex items-center gap-1.5 bg-rose-600 text-white px-3 py-1 rounded-md text-xs font-bold shrink-0 tracking-wider shadow-xs">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>জরুরি ঘোষণা</span>
        </div>

        {/* সংবাদ শিরোনাম */}
        <div className="flex-1 overflow-hidden">
          <Link 
            href="/news" 
            className="block text-xs md:text-sm text-slate-200 hover:text-amber-300 font-medium truncate transition"
          >
            <span className="text-amber-400 font-bold mr-2">#{currentIndex + 1}</span>
            {currentItem.title}
          </Link>
        </div>

        {/* টিকার কন্ট্রোল বাটন */}
        <div className="hidden sm:flex items-center gap-1 shrink-0 text-slate-400">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            aria-label="Previous Announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            aria-label={isPlaying ? "Pause Ticker" : "Play Ticker"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % data.length)}
            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            aria-label="Next Announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ২. প্রিমিয়াম ব্যানার ও হিরো সেকশন কম্পোনেন্ট
function BannerSection({ data, btnText, admission }: { data: any, btnText: string, admission?: any }) {
  if (!data) return null;
  const bgPosClass = data.bgPosition === "top" ? "bg-top" : data.bgPosition === "bottom" ? "bg-bottom" : "bg-center";

  let alignClass = "text-center items-center justify-center";
  if (data.textAlign === "left") {
    alignClass = "text-left items-start justify-start pl-4 md:pl-16";
  } else if (data.textAlign === "right") {
    alignClass = "text-right items-end justify-end pr-4 md:pr-16";
  }

  const isAdmissionOpen = admission?.isOpen !== false;

  return (
    <section className="relative min-h-[520px] md:min-h-[580px] flex items-center overflow-hidden bg-slate-950">
      {/* ব্যাকগ্রাউন্ড ইমেজ ও ডাইনামিক ওভারলে */}
      <div 
        className={`absolute inset-0 z-0 bg-cover ${bgPosClass} transition-all duration-700`} 
        style={{ backgroundImage: `url(${data.image || ""})` }}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-blue-950/60" 
          style={{ opacity: Math.max((data.opacity || 60) / 100, 0.65) }}
        ></div>
      </div>

      {/* টেক্সট ও কল-টু-অ্যাকশন কনটেন্ট */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex ${alignClass}`}>
        <div className="max-w-3xl space-y-6">
          {/* প্রাতিষ্ঠানিক ব্যাজ */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>আধুনিক পাঠদান • নৈতিকতা • প্রযুক্তিনির্ভর শিক্ষা</span>
          </div>

          {data.showText !== false && (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {data.title || "আদর্শ উচ্চ বিদ্যালয়ে স্বাগতম"}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed drop-shadow-xs max-w-2xl">
                {data.subtitle || "শিক্ষাই জাতির মেরুদণ্ড — জ্ঞান ও আদর্শের আলোয় আমরা গড়ে তুলছি আগামীর নেতৃত্বশীল প্রজন্ম।"}
              </p>
            </>
          )}

          {/* ডুয়াল অ্যাকশন বাটন */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* যদি এডমিন থেকে ভর্তি বাটন অন থাকে */}
            {isAdmissionOpen && data.showButton !== false && (
              admission?.externalLink ? (
                <a 
                  href={admission.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 text-sm md:text-base cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>{admission?.applyButtonText || btnText}</span>
                </a>
              ) : (
                <Link 
                  href="/admission-info" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>{admission?.applyButtonText || btnText}</span>
                </Link>
              )
            )}
            
            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-6 rounded-xl border border-white/20 backdrop-blur-xs transition duration-300 text-sm md:text-base"
            >
              <span>স্কুল পরিচিতি</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* ভর্তি বন্ধ থাকলে বিকল্প নোটিশ বাটন */}
            {!isAdmissionOpen && (
              <Link 
                href="/notices" 
                className="inline-flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold py-3.5 px-6 rounded-xl border border-amber-400/30 backdrop-blur-xs transition duration-300 text-sm md:text-base"
              >
                <span>সর্বশেষ নোটিশ বোর্ড</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ৩. কুইক অ্যাকশন সার্ভিস হাব (Quick Access Cards - User Journey Accelerator)
function QuickAccessSection({ admission }: { admission?: any }) {
  const isAdmissionOpen = admission?.isOpen !== false;

  const quickActions = [
    {
      title: isAdmissionOpen ? "ভর্তি তথ্য ও ফরম" : "ভর্তি সংক্রান্ত নোটিশ",
      tag: isAdmissionOpen ? (admission?.externalLink ? "অনলাইন আবেদন" : "ভর্তি চলছে") : "ভর্তি স্থগিত",
      description: isAdmissionOpen 
        ? "আবেদন প্রক্রিয়া, আসন সংখ্যা, যোগ্যতা ও ফি সংক্রান্ত বিস্তারিত" 
        : (admission?.closedNotice || "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম স্থগিত রয়েছে"),
      icon: GraduationCap,
      href: "/admission-info",
      color: isAdmissionOpen ? "from-blue-600 to-indigo-600" : "from-slate-600 to-slate-700",
      accentBorder: isAdmissionOpen ? "border-blue-200 hover:border-blue-500" : "border-slate-200 hover:border-slate-400",
      topBar: isAdmissionOpen ? "bg-gradient-to-r from-blue-600 to-indigo-600" : "bg-slate-400",
      textColor: isAdmissionOpen ? "text-blue-700" : "text-slate-700",
      tagBg: isAdmissionOpen ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-300"
    },
    {
      title: "নোটিশ ও রুটিন",
      tag: "সর্বশেষ প্রকাশনা",
      description: "পরীক্ষার সময়সূচি, ছুটি, বার্ষিক ক্যালেন্ডার ও অফিসিয়াল বিজ্ঞপ্তি",
      icon: Calendar,
      href: "/notices",
      color: "from-emerald-600 to-teal-600",
      accentBorder: "border-emerald-200 hover:border-emerald-500",
      topBar: "bg-gradient-to-r from-emerald-600 to-teal-600",
      textColor: "text-emerald-700",
      tagBg: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      title: "পরীক্ষার ফলাফল",
      tag: "মেধা তালিকা",
      description: "পাবলিক পরীক্ষা (JSC/SSC) ও বার্ষিক পরীক্ষার গ্রেডভিত্তিক ফলাফল",
      icon: Award,
      href: "/info/results",
      color: "from-amber-600 to-orange-600",
      accentBorder: "border-amber-200 hover:border-amber-500",
      topBar: "bg-gradient-to-r from-amber-600 to-orange-600",
      textColor: "text-amber-700",
      tagBg: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      title: "শিক্ষক ও কর্মকর্তা",
      tag: "অনুষদ পরিচিতি",
      description: "অভিজ্ঞ শিক্ষকমণ্ডলী ও দক্ষ প্রশাসনিক কর্মকর্তাদের ডিরেক্টরি",
      icon: Users,
      href: "/teachers",
      color: "from-indigo-600 to-purple-600",
      accentBorder: "border-indigo-200 hover:border-indigo-500",
      topBar: "bg-gradient-to-r from-indigo-600 to-purple-600",
      textColor: "text-indigo-700",
      tagBg: "bg-indigo-50 text-indigo-800 border-indigo-200"
    }
  ];

  return (
    <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`rounded-3xl border bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden group ${item.accentBorder}`}
            >
              <div className={`h-2 w-full ${item.topBar}`}></div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-2 transition duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.tagBg}`}>
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

                <div className={`mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-black ${item.textColor}`}>
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

// ৪. লাইভ পরিসংখ্যান কাউন্টার সেকশন কম্পোনেন্ট
function StatsCounterSection({ data }: { data: any }) {
  if (!data) return null;

  const statItems = [
    { 
      value: data.students || "১২৫০+", 
      label: "মোট সক্রিয় শিক্ষার্থী", 
      sublabel: "১ম থেকে ১০ম শ্রেণি",
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50 border-blue-100 ring-4 ring-blue-50/50" 
    },
    { 
      value: data.teachers || "৪৫+", 
      label: "দক্ষ শিক্ষক ও কর্মকর্তা", 
      sublabel: "উচ্চপ্রশিক্ষিত অনুষদ",
      icon: Award, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50 border-emerald-100 ring-4 ring-emerald-50/50" 
    },
    { 
      value: data.passRate || "৯৮.৫%", 
      label: "পাবলিক পরীক্ষায় পাশের হার", 
      sublabel: "ধারাবাহিক গৌরবময় ফলাফল",
      icon: GraduationCap, 
      color: "text-amber-600", 
      bg: "bg-amber-50 border-amber-100 ring-4 ring-amber-50/50" 
    },
    { 
      value: data.established || "১৯৭৫", 
      label: "ঐতিহ্য ও অভিজ্ঞতার বছর", 
      sublabel: "সুনামের সাথে চলমান",
      icon: Building2, 
      color: "text-purple-600", 
      bg: "bg-purple-50 border-purple-100 ring-4 ring-purple-50/50" 
    }
  ];

  return (
    <section className="bg-white py-10 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 group bg-slate-50/40"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3.5 transition group-hover:scale-110 ${item.bg}`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1">
                  {item.value}
                </h4>
                <p className="text-slate-700 font-bold text-xs md:text-sm">
                  {item.label}
                </p>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {item.sublabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ৫. তথ্য কেন্দ্র বা ডিরেক্টরি সেকশন
function InfoDirectorySection({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-700" />
            <span>বিদ্যালয় তথ্য কেন্দ্র (Academic Hub)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">একাডেমিক নির্দেশিকা, ভর্তি নিয়মাবলী ও পরীক্ষার পূর্ণাঙ্গ তথ্য সংকলন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((cat) => (
          <div key={cat.id} className="bg-slate-50/60 rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-all duration-300 flex flex-col justify-between">
            <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                {cat.title}
              </h4>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {cat.items?.length || 0}টি পাতা
              </span>
            </div>
            <div className="p-4 space-y-2">
              {cat.items && Array.isArray(cat.items) && cat.items.map((item: any) => (
                <Link 
                  key={item.id} 
                  href={`/info/${item.id}`} 
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/70 hover:border-blue-400 hover:bg-blue-50/30 text-slate-700 text-xs md:text-sm font-semibold transition group shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="group-hover:text-blue-700 transition">{item.name}</span>
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৬. স্মার্ট নোটিশ বোর্ড কম্পোনেন্ট (Smart Notice Hub)
function NoticesSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const latestNotices = data.slice(0, 4);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      {/* হেডার ও ফিল্টার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900">
              {labels.noticesTitle || "সর্বশেষ নোটিশ সমূহ"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {labels.noticesSubtitle || "বিদ্যালয়ের গুরুত্বপূর্ণ দাপ্তরিক নোটিশ ও জরুরি বিজ্ঞপ্তি"}
          </p>
        </div>

        <Link 
          href="/notices" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition shrink-0 border border-blue-100"
        >
          <span>সকল নোটিশ দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* নোটিশ তালিকা */}
      <div className="space-y-3.5">
        {latestNotices.map((notice, index) => (
          <div 
            key={notice.id} 
            className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 bg-white hover:bg-blue-50/25 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              {/* ক্যালেন্ডার ডেট ব্যাজ */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center shrink-0 w-16 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition duration-300 shadow-2xs">
                <span className="block text-[10px] uppercase font-bold text-slate-400 group-hover:text-blue-200">তারিখ</span>
                <span className="block text-sm font-black text-slate-900 group-hover:text-white leading-tight mt-0.5">
                  {notice.date.split(",")[0] || notice.date}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  {index === 0 ? (
                    <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      জরুরি
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                      দাপ্তরিক
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-semibold">বিজ্ঞপ্তি নং: #{notice.id}</span>
                </div>
                <h4 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                  {notice.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
              {notice.attachmentUrl && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Download className="w-3 h-3 text-slate-600" />
                  <span>PDF</span>
                </span>
              )}
              <Link 
                href="/notices" 
                className="text-xs font-bold text-blue-700 group-hover:bg-blue-600 group-hover:text-white bg-slate-100 px-3.5 py-1.5 rounded-xl transition duration-200 flex items-center gap-1"
              >
                <span>পড়ুন</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৭. বিদ্যালয় বাণী সেকশন কম্পোনেন্ট (Leadership Spotlight - বানি কার্ড)
function MessagesSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-100 mb-1">
            <Quote className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>দিকনির্দেশনামূলক বক্তব্য</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            {labels.messagesTitle || "বিদ্যালয় বাণী ও বার্তা"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">শ্রদ্ধেয় সভাপতি ও প্রধান শিক্ষকের দিকনির্দেশনা</p>
        </div>
        <Link 
          href="/messages" 
          className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition border border-blue-100"
        >
          সকল বাণী ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((msg, idx) => {
          const isPresident = idx === 0 || msg.designation.includes("সভাপতি");
          const cardGradient = isPresident 
            ? "from-amber-50/60 via-white to-amber-50/20 hover:border-amber-400" 
            : "from-blue-50/60 via-white to-indigo-50/20 hover:border-blue-400";
          const topBarGradient = isPresident 
            ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600" 
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600";
          const badgeStyle = isPresident
            ? "bg-amber-100 text-amber-900 border-amber-300"
            : "bg-blue-100 text-blue-900 border-blue-300";
          const portraitRing = isPresident
            ? "ring-4 ring-amber-200/80 shadow-md"
            : "ring-4 ring-blue-200/80 shadow-md";

          return (
            <div 
              key={msg.id} 
              className={`relative bg-gradient-to-br ${cardGradient} rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
            >
              {/* আলংকারিক টপ রিবন */}
              <div className={`h-2.5 w-full ${topBarGradient}`}></div>

              <div className="p-6 md:p-7 flex-1 flex flex-col justify-between relative">
                {/* ওয়াটারমার্ক কোটেশন আইকন */}
                <Quote className="absolute top-5 right-5 w-16 h-16 text-slate-300/30 pointer-events-none group-hover:text-blue-300/40 transition-colors" />

                <div>
                  {/* স্পটলাইট টপ লেবেল */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full border shadow-2xs ${badgeStyle}`}>
                      {isPresident ? <Award className="w-3.5 h-3.5 text-amber-700" /> : <GraduationCap className="w-3.5 h-3.5 text-blue-700" />}
                      <span>{isPresident ? "সভাপতির অভিভাষণ" : "প্রধান শিক্ষকের বার্তা"}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span>প্রাতিষ্ঠানিক বক্তব্য</span>
                    </span>
                  </div>

                  {/* ব্যক্তিত্ব প্রোফাইল */}
                  <div className="flex items-center gap-4 mb-4.5">
                    <div className="relative shrink-0">
                      <img 
                        src={msg.image} 
                        alt={msg.name} 
                        className={`w-20 h-20 rounded-2xl object-cover border border-white ${portraitRing} group-hover:scale-105 transition-transform duration-300`} 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs border border-slate-200">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-base md:text-lg group-hover:text-blue-700 transition tracking-tight">
                          {msg.name}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 mt-0.5">
                        {msg.designation}
                      </p>
                      <span className="inline-block text-[11px] font-medium text-slate-400 mt-0.5">
                        বিদ্যালয় পরিচালনা পর্ষদ
                      </span>
                    </div>
                  </div>

                  {/* বাণী কোটেশন টেক্সট বক্স */}
                  <div className="relative pl-4 pr-3 py-3.5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic line-clamp-3">
                      “{msg.text}”
                    </p>
                  </div>
                </div>

                {/* ফুটার লিঙ্ক বাটন */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    পূর্ণাঙ্গ দিকনির্দেশনা ও ভিশন
                  </span>
                  <Link 
                    href="/messages" 
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-black py-2 px-3.5 rounded-xl shadow-2xs transition-all duration-200 cursor-pointer"
                  >
                    <span>সম্পূর্ণ বক্তব্য পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ৮. ডাইনামিক ফটো গ্যালারি স্লাইডার কম্পোনেন্ট
function GallerySliderSection({ data }: { data: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">ক্যাম্পাস চিত্রশালা</h3>
          <p className="text-xs text-slate-500 mt-1">বিদ্যালয়ের ক্যাম্পাস ও বিভিন্ন সহশিক্ষা কার্যক্রমের স্থিরচিত্র</p>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {data.length}
        </div>
      </div>

      <div className="relative w-full h-[280px] sm:h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 group">
        <img 
          src={data[currentIndex]} 
          alt={`Campus Slide ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-500" 
        />
        
        {/* স্লাইডার নেভিগেশন বোতাম */}
        <button 
          onClick={handlePrev} 
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-slate-950/90 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold backdrop-blur-xs transition cursor-pointer shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext} 
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950/60 hover:bg-slate-950/90 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold backdrop-blur-xs transition cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* স্লাইড ইন্ডিকেটর ডটস */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ৯. হোমপেজে ব্লগ ও আর্টিকেল সেকশন কম্পোনেন্ট
function BlogSection({ data, labels }: { data: any[]; labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const latestBlogs = data.slice(0, 3);
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            {labels.blogsTitle || "ব্লগ ও সাম্প্রতিক প্রবন্ধ"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {labels.blogsSubtitle || "শিক্ষক ও শিক্ষার্থীদের মেধাভিত্তিক চিন্তাভাবনা"}
          </p>
        </div>
        <Link href="/blog" className="text-xs font-bold text-blue-700 hover:underline">
          সকল লেখা ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestBlogs.map((blog) => (
          <div 
            key={blog.id} 
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="h-44 overflow-hidden relative bg-slate-100">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-108 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
              <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                📅 {blog.date}
              </span>
            </div>
            <div className="p-4.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm md:text-base font-black text-slate-900 line-clamp-1 group-hover:text-blue-700 transition">
                  {blog.title}
                </h4>
                <p className="text-slate-600 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                  {blog.content}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">৩ মিনিট পাঠ</span>
                <Link 
                  href={`/blog/${blog.id}`} 
                  className="text-blue-700 hover:text-blue-800 text-xs font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ১০. শিক্ষকবৃন্দ সেকশন কম্পোনেন্ট (টিচার কার্ড)
function TeachersSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-100 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>অনুষদ সদস্যবৃন্দ</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            {labels.teachersTitle || "আমাদের সম্মানিত শিক্ষকবৃন্দ"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">অভিজ্ঞ, উচ্চশিক্ষিত ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী</p>
        </div>
        <Link 
          href="/teachers" 
          className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition border border-blue-100"
        >
          সকল শিক্ষক ➔
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {data.map((teacher) => {
          const isLeader = teacher.designation.includes("প্রধান শিক্ষক");
          const dept = teacher.designation.includes("গণিত") 
            ? "গণিত বিভাগ" 
            : teacher.designation.includes("ইংরেজি") 
            ? "ইংরেজি বিভাগ" 
            : teacher.designation.includes("বিজ্ঞান")
            ? "বিজ্ঞান বিভাগ"
            : teacher.designation.includes("বাংলা")
            ? "বাংলা বিভাগ"
            : "একাডেমিক বিভাগ";

          return (
            <div 
              key={teacher.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* শীর্ষ প্রিমিয়াম স্ট্রাইপ */}
              <div className={`h-2 w-full ${isLeader ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500"}`}></div>

              {/* শিক্ষক পোর্ট্রেট কন্টেইনার */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img 
                  src={teacher.image} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>
                
                {/* ফ্লোটিং ডিপার্টমেন্ট ও রোল ব্যাজ */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-md ${
                    isLeader 
                      ? "bg-amber-500 text-white" 
                      : "bg-slate-900/80 text-white"
                  }`}>
                    {isLeader ? "★ প্রধান শিক্ষক" : "শিক্ষক"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                    {dept}
                  </span>
                </div>

                {/* ছবি সংলগ্ন নাম ও পদবি */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm sm:text-base truncate group-hover:text-blue-200 transition">
                      {teacher.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-200 truncate mt-0.5 font-medium">
                    {teacher.designation}
                  </p>
                </div>
              </div>

              {/* কার্ড ফুটার তথ্য ও বাটন */}
              <div className="p-3.5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <School className="w-3 h-3 text-blue-600" />
                  <span>নিয়মিত অনুষদ</span>
                </span>
                <Link 
                  href="/teachers" 
                  className="inline-flex items-center gap-1 text-xs font-black text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 py-1.5 px-3 rounded-xl shadow-2xs transition-all duration-200"
                >
                  <span>প্রোফাইল</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ১১. ডান পাশের "গুরুত্বপূর্ণ লিঙ্ক" উইজেট কম্পোনেন্ট
function ImportantLinksWidget({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>গুরুত্বপূর্ণ লিংক</span>
        </h4>
      </div>
      <div className="p-4 space-y-2 bg-slate-50/50">
        {data.map((link) => (
          <a 
            key={link.id} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/60 hover:border-blue-400 hover:text-blue-700 text-slate-700 text-xs md:text-sm font-semibold transition group shadow-2xs"
          >
            <span className="truncate pr-2">{link.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ১২. ডান পাশের "জরুরি হটলাইন" উইজেট কম্পোনেন্ট (National Hotlines)
function HelpLineWidget() {
  const hotlines = [
    { number: "999", name: "জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)" },
    { number: "333", name: "সরকারি সেবা ও তথ্য বাতায়ন" },
    { number: "109", name: "নারী ও শিশু নির্যাতন প্রতিরোধ সেল" },
    { number: "106", name: "দুর্নীতি দমন কমিশন (দুদক)" }
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between">
        <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-white" />
          <span>জরুরি সরকারি হটলাইন</span>
        </h4>
      </div>
      <div className="p-4 space-y-2.5 bg-white">
        {hotlines.map((hl) => (
          <a 
            key={hl.number} 
            href={`tel:${hl.number}`}
            className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-100/80 hover:border-rose-300 hover:bg-rose-100/60 transition group cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-800 line-clamp-1 pr-2">{hl.name}</span>
            <span className="text-xs font-black text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
              📞 {hl.number}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ১৩. ডান পাশের "কাস্টম আপলোড করা হটলাইন ছবি/ব্যানার" উইজেট কম্পোনেন্ট
function SidebarImageWidget({ imageUrl }: { imageUrl: string }) {
  if (!imageUrl) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xs text-center">
      <img src={imageUrl} alt="Sidebar Banner" className="w-full object-contain rounded-xl" />
    </div>
  );
}

// মূল হোমপেজ কম্পোনেন্ট
export default function Home() {
  const [lang, setLang] = useState<string>("bn");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("site_lang") || "bn";
      setLang(saved);
      const handleLangChange = (e: any) => {
        if (e.detail) setLang(e.detail);
      };
      window.addEventListener("language-changed", handleLangChange);
      return () => window.removeEventListener("language-changed", handleLangChange);
    }
  }, []);

  const t = (bnText: string, enText: string) => (lang === "en" ? enText : bnText);

  const heroBanner = demoData?.heroBanner;
  const teachers = demoData?.teachers || [];
  const notices = demoData?.notices || [];
  const messages = demoData?.messages || [];
  const news = demoData?.news || [];
  const gallery = demoData?.gallery || [];
  const blogs = demoData?.blogs || [];
  const directory = demoData?.directory || [];
  const importantLinks = demoData?.importantLinks || [];
  const sidebarImage = demoData?.sidebarImage || "";
  const stats = demoData?.stats;
  const layoutConfig = demoData?.layoutConfig;
  const uiLabels = demoData?.uiLabels || {};
  const admission = demoData?.admission;

  const renderOrder = layoutConfig || [
    { id: "news_ticker", active: true },
    { id: "banner", active: true },
    { id: "stats_counter", active: true },
    { id: "info_directory", active: true },
    { id: "notices", active: true },
    { id: "messages", active: true },
    { id: "gallery_slider", active: true },
    { id: "blog_section", active: true },
    { id: "teachers", active: true },
    { id: "sidebar_links", active: true },
    { id: "sidebar_helpline", active: true },
    { id: "sidebar_image", active: true }
  ];

  const isTickerActive = renderOrder.find(s => s.id === "news_ticker" && s.active);
  const isBannerActive = renderOrder.find(s => s.id === "banner" && s.active);
  const sidebarOrder = renderOrder.filter(s => s.id.startsWith("sidebar_"));

  return (
    <main className="bg-slate-50/50 min-h-screen pb-16">
      {/* ১. স্মার্ট জরুরি টিকার */}
      {isTickerActive && <NewsTickerSection data={news} />}

      {/* ২. প্রিমিয়াম হিরো ব্যানার */}
      {isBannerActive && (
        <BannerSection 
          data={heroBanner} 
          btnText={uiLabels.applyButton || "ভর্তি তথ্য জানুন"} 
          admission={admission} 
        />
      )}

      {/* ৩. কুইক অ্যাক্সেস কার্ড (অভিভাবক ও শিক্ষার্থীদের জন্য তাৎক্ষণিক অ্যাকশন) */}
      <QuickAccessSection admission={admission} />

      {/* ৪. প্রধান কনটেন্ট ও সাইডবার গ্রিড */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* প্রধান কনটেন্ট কলাম (৩ কলাম) */}
        <div className="lg:col-span-3 space-y-8">
          {renderOrder.map((section: any) => {
            if (section.id === "news_ticker" || section.id === "banner" || section.id.startsWith("sidebar_")) return null;
            if (!section.active) return null;

            switch (section.id) {
              case "stats_counter":
                return <StatsCounterSection key="stats_counter" data={stats} />;
              case "notices":
                return <NoticesSection key="notices" data={notices} labels={uiLabels} />;
              case "info_directory":
                return <InfoDirectorySection key="info_directory" data={directory} />;
              case "messages":
                return <MessagesSection key="messages" data={messages} labels={uiLabels} />;
              case "gallery_slider":
                return <GallerySliderSection key="gallery_slider" data={gallery} />;
              case "blog_section":
                return <BlogSection key="blog_section" data={blogs} labels={uiLabels} />;
              case "teachers":
                return <TeachersSection key="teachers" data={teachers} labels={uiLabels} />;
              default:
                return null;
            }
          })}
        </div>

        {/* ডান সাইডবার উইজেট কলাম (১ কলাম) */}
        <aside className="lg:col-span-1 space-y-6 h-fit lg:sticky lg:top-28">
          {sidebarOrder.map((widget) => {
            if (!widget.active) return null;

            switch (widget.id) {
              case "sidebar_links":
                return <ImportantLinksWidget key="sidebar_links" data={importantLinks} />;
              case "sidebar_helpline":
                return <HelpLineWidget key="sidebar_helpline" />;
              case "sidebar_image":
                return <SidebarImageWidget key="sidebar_image" imageUrl={sidebarImage} />;
              default:
                return null;
            }
          })}
        </aside>
      </div>
    </main>
  );
}
