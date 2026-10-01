import { getSchoolData } from "@/lib/dataProvider";
import FeesPaymentClient from "./FeesPaymentClient";
import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `টিউশন ফি ও অনলাইন পেমেন্ট গাইডলাইন | ${schoolName}`,
    description: `${schoolName}-এর শ্রেণিভিত্তিক ভর্তি ও মাসিক ফি তালিকা। বিকাশ, নগদ, রকেট ও ব্যাংক অ্যাকাউন্টে ফি পরিশোধের বিস্তারিত নিয়মাবলী।`,
    openGraph: {
      title: `ফি ও পেমেন্ট গাইড | ${schoolName}`,
      description: `${schoolName} ফি কাঠামো ও ডিজিটাল পেমেন্ট নির্দেশিকা।`,
    }
  };
}

export default async function FeesPaymentPage() {
  const data = await getSchoolData();
  const feeStructure = data?.feeStructure || [];
  const paymentMethods = data?.paymentMethods || {};
  const schoolInfo = data?.schoolInfo || {};
  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* হেডার */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          <span>ফি ও ডিজিটাল পেমেন্ট সহায়িকা</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          টিউশন ফি ও পেমেন্ট নির্দেশিকা
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এ শিক্ষার্থীদের শিক্ষাবর্ষের সকল ফি কাঠামো, মাসিক বেতন এবং বিকাশ, নগদ ও ব্যাংকের মাধ্যমে ঘরে বসেই ফি পরিশোধের সহজ উপায়।
        </p>
      </div>

      <FeesPaymentClient 
        feeStructure={feeStructure} 
        paymentMethods={paymentMethods} 
        schoolInfo={schoolInfo} 
      />
    </main>
  );
}
