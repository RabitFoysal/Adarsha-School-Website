import { getSchoolData } from "@/lib/dataProvider";
import type { Metadata } from "next";
import { Radio, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `জরুরি সংবাদ ও ঘোষণা | ${schoolName}`,
    description: `${schoolName}-এর সর্বশেষ জরুরি সংবাদ, ছুটি, পরীক্ষা ও জরুরি নোটিশের সরাসরি আপডেট।`,
    openGraph: {
      title: `জরুরি সংবাদ | ${schoolName}`,
      description: `${schoolName}-এর সাম্প্রতিক জরুরি ঘোষণা ও সংবাদ।`,
    }
  };
}

export default async function NewsPage() {
  const data = await getSchoolData();
  const news = data?.news || [];
  const schoolInfo = data?.schoolInfo || {};
  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* হেডার */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>লাইভ নিউজ ফিড</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          জরুরি খবর ও নোটিশ সমূহ
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-red-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এর হোমপেজে প্রচারিত সকল স্ক্রলিং খবরের বিস্তারিত বিবরণ
        </p>
      </div>

      <div className="space-y-6">
        {news && news.length > 0 ? (
          news.map((item: any, idx: number) => (
            <article 
              key={item.id || idx} 
              className="bg-white p-6 sm:p-8 rounded-3xl border border-red-100/80 shadow-xs hover:shadow-md transition-all duration-300 border-l-4 border-l-red-500 relative"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span>জরুরি ঘোষণা</span>
                </span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">
                {item.title}
              </h2>
              
              {item.description && (
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              )}
            </article>
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">বর্তমানে কোনো জরুরি সংবাদ নেই</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              নতুন কোনো জরুরি বিজ্ঞপ্তি প্রকাশিত হলে এখানে প্রদর্শিত হবে।
            </p>
            <Link 
              href="/notices" 
              className="inline-flex items-center gap-2 mt-5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition"
            >
              <span>সকল নোটিশ দেখুন</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
