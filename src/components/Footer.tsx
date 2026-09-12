"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import demoData from "@/data/demoData.json";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  ArrowUp, 
  ShieldCheck, 
  GraduationCap 
} from "lucide-react";

export default function Footer() {
  const { schoolInfo } = demoData;
  const [logoUrl, setLogoUrl] = useState(schoolInfo.logo);
  const [schoolName, setSchoolName] = useState(schoolInfo.name);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      {/* প্রধান ৪-কলাম ফুটার গ্রিড */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* কলাম ১: বিদ্যালয় পরিচিতি ও আইডেন্টিটি */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt={schoolName} 
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-500/30 bg-white" 
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{schoolName}</h3>
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>EIIN: 108420 • স্থাপিত: ১৯৭৫</span>
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              আধুনিক শিক্ষা, প্রযুক্তি এবং নৈতিক মূল্যবোধের সমন্বয়ে আদর্শ ভবিষ্যৎ নাগরিক গড়ার প্রত্যয়ে আমাদের অগ্রযাত্রা অব্যাহত।
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>মডেল শিক্ষাপ্রতিষ্ঠান স্বীকৃতিপ্রাপ্ত</span>
              </span>
            </div>
          </div>

          {/* কলাম ২: জরুরি মেনু লিংক */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              দ্রুত লিঙ্ক সমূহ
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>বিদ্যালয় সম্পর্কিত তথ্য</span>
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>দাপ্তরিক নোটিশ বোর্ড</span>
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>সম্মানিত শিক্ষকবৃন্দ</span>
                </Link>
              </li>
              <li>
                <Link href="/admission-info" className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>ভর্তি প্রক্রিয়া ও নিয়মাবলী</span>
                </Link>
              </li>
              <li>
                <Link href="/committee" className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>ম্যানেজিং কমিটি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* কলাম ৩: একাডেমিক ও শিক্ষার্থী সেবা */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              একাডেমিক তথ্য
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/info/routine" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  <span>ক্লাস রুটিন ও পরীক্ষার সূচি</span>
                </Link>
              </li>
              <li>
                <Link href="/info/syllabus" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  <span>বার্ষিক পাঠ্যক্রম ও সিলেবাস</span>
                </Link>
              </li>
              <li>
                <Link href="/info/results" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  <span>পাবলিক ও বার্ষিক পরীক্ষার ফলাফল</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  <span>শিক্ষক ও শিক্ষার্থীদের প্রবন্ধ</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  <span>অভিভাবক মতামত ও হেল্পডেস্ক</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* কলাম ৪: অফিস ও সরাসরি যোগাযোগ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              অফিস ও যোগাযোগ
            </h4>
            <div className="space-y-3 text-xs">
              {schoolInfo.contact?.address && (
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{schoolInfo.contact.address}</span>
                </div>
              )}
              {schoolInfo.contact?.phone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${schoolInfo.contact.phone}`} className="hover:text-white transition">
                    {schoolInfo.contact.phone}
                  </a>
                </div>
              )}
              {schoolInfo.contact?.email && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${schoolInfo.contact.email}`} className="hover:text-white transition">
                    {schoolInfo.contact.email}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 text-slate-400 pt-1 border-t border-slate-900">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* বটম কপিরাইট বার */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            {schoolInfo.copyright || `© ${new Date().getFullYear()} ${schoolName}। সর্বস্বত্ব সংরক্ষিত।`}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <span>উপরে যান</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
