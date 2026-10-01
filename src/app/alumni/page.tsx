import { getSchoolData } from "@/lib/dataProvider";
import AlumniClient from "./AlumniClient";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `কৃতি শিক্ষার্থী ও অ্যালামনাই নেটওয়ার্ক | ${schoolName}`,
    description: `${schoolName}-এর বিশিষ্ট কৃতি প্রাক্তন শিক্ষার্থীবৃন্দের সাফল্য, হল অব ফেম এবং সাবেক শিক্ষার্থীদের অনলাইন নিবন্ধন কর্নার।`,
    openGraph: {
      title: `অ্যালামনাই ও হল অব ফেম | ${schoolName}`,
      description: `${schoolName} প্রাক্তন শিক্ষার্থী নেটওয়ার্ক।`,
    }
  };
}

export default async function AlumniPage() {
  const data = await getSchoolData();
  const alumni = data?.alumni || [];
  const schoolInfo = data?.schoolInfo || {};
  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* হেডার */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
          <span>প্রাক্তন শিক্ষার্থী নেটওয়ার্ক ও হল অব ফেম</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          কৃতি শিক্ষার্থী ও অ্যালামনাই অ্যাসোসিয়েশন
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এর সুবর্ণ ইতিহাসের অন্যতম অংশীদার আমাদের প্রাক্তন ছাত্র-ছাত্রীবৃন্দ। তাদের সাফল্য ও ভবিষ্যৎ প্রজন্মের সাথে অবিচ্ছেদ্য সেতুবন্ধন।
        </p>
      </div>

      <AlumniClient initialAlumni={alumni} schoolInfo={schoolInfo} />
    </main>
  );
}
