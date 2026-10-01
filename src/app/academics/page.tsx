import { getSchoolData } from "@/lib/dataProvider";
import AcademicsClient from "./AcademicsClient";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `একাডেমিক ক্যালেন্ডার, সিলেবাস ও রুটিন | ${schoolName}`,
    description: `${schoolName}-এর ক্লাস রুটিন, পরীক্ষার সময়সূচি, বিষয়ভিত্তিক সিলেবাস ও বাৎসরিক ছুটির ক্যালেন্ডার ডাউনলোড করুন।`,
    openGraph: {
      title: `একাডেমিক কর্নার | ${schoolName}`,
      description: `${schoolName}-এর রুটিন, সিলেবাস ও ছুটির ক্যালেন্ডার।`,
    }
  };
}

export default async function AcademicsPage() {
  const data = await getSchoolData();
  const routines = data?.academicRoutines || [];
  const schoolInfo = data?.schoolInfo || {};
  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* হেডার */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>একাডেমিক হাব ও সময়সূচি</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          ক্লাস রুটিন, সিলেবাস ও ক্যালেন্ডার
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এর সকল শ্রেণির নিয়মিত ক্লাস রুটিন, আসন্ন পরীক্ষার সূচি, বিষয়ভিত্তিক পাঠ্যপরিকল্পনা এবং বাৎসরিক ছুটির তালিকা একনজরে দেখুন ও ডাউনলোড করুন।
        </p>
      </div>

      <AcademicsClient initialItems={routines} schoolInfo={schoolInfo} />
    </main>
  );
}
