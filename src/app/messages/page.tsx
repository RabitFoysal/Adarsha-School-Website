"use client";

import demoData from "@/data/demoData.json";
import { 
  Quote, 
  ShieldCheck, 
  Award, 
  Calendar, 
  School, 
  Share2,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function MessagesPage() {
  const { messages, schoolInfo } = demoData;
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleShare = (id: number) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/messages#msg-${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      
      {/* প্রিমিয়াম হেডার সেকশন */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-2xs">
          <Quote className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>দিকনির্দেশনা ও শুভেচ্ছা বার্তা</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          বিদ্যালয় বাণী ও অনুপ্রেরণা
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolInfo.name}-এর সম্মানিত সভাপতি এবং প্রতিষ্ঠান প্রধানের দিকনির্দেশনামূলক বাণী, যা শিক্ষার্থীদের মানবিক মূল্যবোধ ও ভবিষ্যতের আলোকিত পথ নির্দেশ করে।
        </p>
      </div>

      {/* প্রিমিয়াম বাণী কার্ডসমূহ */}
      <div className="space-y-12">
        {messages.map((msg: any, idx: number) => {
          const isPresident = idx === 0 || msg.designation.includes("সভাপতি");
          const badgeBg = isPresident
            ? "bg-amber-100 text-amber-900 border-amber-300/80"
            : "bg-blue-100 text-blue-900 border-blue-300/80";
          const ribbonColor = isPresident
            ? "bg-gradient-to-r from-amber-500 to-orange-500"
            : "bg-gradient-to-r from-blue-600 to-indigo-600";

          return (
            <article 
              key={msg.id} 
              id={`msg-${msg.id}`}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              {/* শীর্ষ আলংকারিক রিবন */}
              <div className={`h-2.5 w-full ${ribbonColor}`}></div>

              <div className="p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* প্রোফাইল ও পরিচিতি কলাম */}
                <div className="w-full lg:w-72 shrink-0 flex flex-col items-center text-center">
                  <div className="relative group">
                    {/* ফটো ফ্রেম */}
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg border-2 border-slate-200 relative bg-slate-100">
                      <img 
                        src={msg.image} 
                        alt={msg.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>

                    {/* প্রাতিষ্ঠানিক সিল / ব্যাজ */}
                    <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md border border-slate-200">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* নাম ও পদবি */}
                  <div className="mt-5 w-full">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <h3 className="text-xl font-black text-slate-900">{msg.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    </div>
                    
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${badgeBg} mb-3`}>
                      {msg.designation}
                    </span>

                    {/* প্রাতিষ্ঠানিক তথ্য */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 space-y-1.5 w-full">
                      <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
                        <School className="w-3.5 h-3.5 text-blue-600" />
                        <span>{schoolInfo.name}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>শিক্ষাবর্ষ: ২০২৬</span>
                      </div>
                    </div>

                    {/* শেয়ার বাটন */}
                    <button
                      onClick={() => handleShare(msg.id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-200 transition w-full justify-center cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedId === msg.id ? "লিংক কপি হয়েছে!" : "বাণী শেয়ার করুন"}</span>
                    </button>
                  </div>
                </div>

                {/* বাণী ও বক্তব্য কন্টেন্ট কলাম */}
                <div className="flex-1 w-full flex flex-col justify-between">
                  <div className="relative">
                    {/* উক্তি আইকন ব্যাকড্রপ */}
                    <div className="absolute -top-4 -left-2 text-slate-200/50 pointer-events-none select-none">
                      <Quote className="w-16 h-16 opacity-30 text-blue-600" />
                    </div>

                    <div className="relative z-10 pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-extrabold tracking-wider uppercase text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {isPresident ? "সভাপতির অভিভাষণ" : "প্রধান শিক্ষকের বার্তা"}
                        </span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-500 font-medium">অফিসিয়াল বাণী</span>
                      </div>

                      {/* বাণী টেক্সট */}
                      <blockquote className="text-slate-800 text-base sm:text-lg md:text-xl font-serif italic leading-relaxed text-justify relative pl-3 border-l-4 border-blue-500 bg-slate-50/50 p-4 rounded-r-xl">
                        "{msg.text}"
                      </blockquote>

                      {/* অতিরিক্ত দিকনির্দেশনা ও বিস্তারিত বক্তব্য */}
                      <div className="mt-5 text-slate-600 text-sm md:text-base leading-relaxed space-y-3">
                        <p>
                          আমাদের লক্ষ্য কেবল পুঁথিগত শিক্ষায় শিক্ষার্থীদের আবদ্ধ রাখা নয়; বরং তাদেরকে আধুনিক প্রযুক্তি, নৈতিকতা, সততা এবং মানবিক গুণাবলিতে সমৃদ্ধ করে তোলা। একটি সুশৃঙ্খল ও ভালোবাসাপূর্ণ পরিবেশেই একজন শিক্ষার্থীর মেধার সর্বোচ্চ বিকাশ ঘটে।
                        </p>
                        <p>
                          অভিভাবক ও শিক্ষকদের সম্মিলিত প্রয়াসেই আমরা তৈরি করছি আগামী দিনের সুনাগরিক। বিদ্যালয়ের সার্বিক অগ্রযাত্রায় সকলের আন্তরিক সহযোগিতা কামনা করি।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ফুটার সিগনেচার এরিয়া */}
                  <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>সুশাসন ও গুণগত শিক্ষার অঙ্গীকার</span>
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="text-xs text-slate-400 font-medium">শুভেচ্ছান্তে—</p>
                      <p className="text-sm font-bold text-slate-800">{msg.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{msg.designation}</p>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          );
        })}
      </div>

    </main>
  );
}
