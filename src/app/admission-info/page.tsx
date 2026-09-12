"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import demoData from "@/data/demoData.json";
import { 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Phone, 
  Mail, 
  HelpCircle,
  Calendar,
  AlertCircle,
  Bell,
  ArrowRight
} from "lucide-react";

export default function AdmissionInfoPage() {
  const { admission: initialAdmission, schoolInfo: initialSchoolInfo } = demoData;
  const [admission, setAdmission] = useState<any>(initialAdmission || {
    isOpen: true,
    showNavbarButton: true,
    buttonText: "ভর্তি চলছে ২০২৬",
    applyButtonText: "অনলাইনে আবেদন করুন",
    externalLink: "",
    closedNotice: "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম স্থগিত রয়েছে। পরবর্তী বিজ্ঞপ্তির জন্য নোটিশ বোর্ডে নজর রাখুন।"
  });
  const [schoolInfo, setSchoolInfo] = useState<any>(initialSchoolInfo);

  useEffect(() => {
    fetch("/api/school-info", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.admission) setAdmission(data.admission);
        if (data.schoolInfo) setSchoolInfo(data.schoolInfo);
      })
      .catch(() => {});

    const handleSync = (e: any) => {
      if (e.detail?.admission) setAdmission(e.detail.admission);
      if (e.detail?.schoolInfo) setSchoolInfo(e.detail.schoolInfo);
    };

    window.addEventListener("school-info-updated", handleSync);
    return () => window.removeEventListener("school-info-updated", handleSync);
  }, []);

  const requirements = [
    "শিক্ষার্থীর সাম্প্রতিক তোলা ২ কপি পাসপোর্ট সাইজ রঙিন ছবি",
    "পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র (টি.সি) ও প্রশংসাপত্র",
    "অনলাইন জন্ম নিবন্ধন সনদের ডিজিটাল সত্যায়িত ফটোকপি",
    "পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) স্পষ্ট ফটোকপি"
  ];

  const isAdmissionOpen = admission?.isOpen !== false;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
        
        {/* টপ ব্যাজ ও শিরোনাম */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className={`inline-flex items-center gap-2 border text-xs font-bold px-4 py-1.5 rounded-full mb-4 ${
            isAdmissionOpen 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            <GraduationCap className={`w-4 h-4 ${isAdmissionOpen ? "text-emerald-600" : "text-rose-600"}`} />
            <span>{isAdmissionOpen ? (admission?.buttonText || "ভর্তি সেশন ২০২৩-২০২৪ শিক্ষাবর্ষ") : "ভর্তি কার্যক্রম সাময়িক স্থগিত"}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {schoolInfo.name} - এ ভর্তি সংক্রান্ত তথ্য
          </h1>
          <p className="text-slate-500 text-sm mt-3">
            অভিভাবক ও শিক্ষার্থীদের জন্য অনলাইন ও অফলাইনে ভর্তি সংক্রান্ত সকল দিকনির্দেশনা
          </p>
        </div>

        {/* যদি এডমিন থেকে ভর্তি বাটন ও প্রক্রিয়া চালু থাকে */}
        {isAdmissionOpen ? (
          admission?.externalLink ? (
            <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-center shadow-xl">
              <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-3">
                <GraduationCap className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-xl md:text-2xl font-black mb-2">অনলাইন ভর্তি আবেদন ফরম</h2>
              <p className="text-blue-100 text-xs md:text-sm max-w-xl mx-auto mb-6">
                আমাদের স্কুলের অফিসিয়াল ভর্তি পোর্টালে সরাসরি তথ্য প্রদান করে আপনার সন্তানের ভর্তি আবেদন সম্পন্ন করুন
              </p>
              <a 
                href={admission.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm md:text-base py-3.5 px-8 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{admission?.applyButtonText || "সরাসরি আবেদন ফরম পূরণ করুন"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="mb-10 p-6 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base">ভর্তি আবেদন সরাসরি অফিস থেকে গ্রহণ করা হচ্ছে</h3>
                <p className="text-xs text-blue-700 mt-1">বিদ্যালয়ের অফিস চলাকালীন সময়ে এসে সরাসরি ভর্তি ফরম সংগ্রহ ও জমা দিতে পারেন।</p>
              </div>
            </div>
          )
        ) : (
          /* যদি এডমিন থেকে ভর্তি বন্ধ করা থাকে */
          <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-rose-900">
                  ভর্তি কার্যক্রম বর্তমানে বন্ধ রয়েছে
                </h2>
                <p className="text-rose-700 text-sm mt-2 leading-relaxed">
                  {admission?.closedNotice || "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম সম্পন্ন হয়েছে বা সাময়িকভাবে বন্ধ আছে। পরবর্তী সেশনের বিজ্ঞপ্তি কিংবা মেধা তালিকার জন্য বিদ্যালয়ের নোটিশ বোর্ডে লক্ষ্য রাখুন।"}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link 
                    href="/notices" 
                    className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>নোটিশ বোর্ড দেখুন</span>
                  </Link>
                  <Link 
                    href="/" 
                    className="inline-flex items-center gap-1.5 bg-white text-slate-700 border border-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 transition"
                  >
                    <span>হোমপেজে ফিরে যান</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* প্রয়োজনীয় কাগজপত্র ও যোগ্যতা */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>ভর্তির জন্য প্রয়োজনীয় কাগজপত্র:</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs md:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* এডিটেবল ভর্তি সংক্রান্ত নির্দেশনা */}
        <div className="border-t border-slate-200 pt-8 mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>ভর্তি নির্দেশনাবলী ও নিয়মসমূহ:</span>
          </h2>
          <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            {admission?.instructions || "প্রতিদিন সকাল ৯টা হতে দুপুর ২টা পর্যন্ত বিদ্যালয় অফিসে যোগাযোগ করা যাবে।"}
          </div>
        </div>

        {/* হেল্পডেস্ক যোগাযোগ */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>ভর্তি সংক্রান্ত যেকোনো প্রয়োজনে যোগাযোগ করুন</span>
            </h3>
            <p className="text-xs text-amber-800/80 mt-1">অফিস চলাকালীন সময়ে আমাদের হেল্পলাইনে সরাসরি ফোন করতে পারেন</p>
          </div>
          {schoolInfo?.contact?.phone && (
            <a 
              href={`tel:${schoolInfo.contact.phone}`}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition shadow-xs shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{schoolInfo.contact.phone}</span>
            </a>
          )}
        </div>

      </div>
    </main>
  );
}
