import { getSchoolData } from "@/lib/dataProvider";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";
  const address = data?.schoolInfo?.contact?.address || "বাংলাদেশ";
  const phone = data?.schoolInfo?.contact?.phone || "";

  return {
    title: `যোগাযোগ ও ঠিকানা | ${schoolName}`,
    description: `${schoolName}-এর ঠিকানা: ${address}। যোগাযোগ নম্বর: ${phone}। সরাসরি বার্তা পাঠাতে যোগাযোগ পাতা ভিজিট করুন।`,
    openGraph: {
      title: `যোগাযোগ | ${schoolName}`,
      description: `${schoolName}-এর প্রাতিষ্ঠানিক ঠিকানা, ফোন নম্বর এবং সহায়তা কেন্দ্র।`,
    }
  };
}

export default async function ContactPage() {
  const data = await getSchoolData();
  const schoolInfo = data?.schoolInfo || {};
  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* পেজের হেডার */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>যোগাযোগ ও সহায়তা কেন্দ্র</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          আমাদের সাথে যোগাযোগ করুন
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এ ভর্তি, শিক্ষা কার্যক্রম কিংবা প্রশাসনিক যেকোনো বিষয়ে তথ্যের জন্য নির্দ্বিধায় যোগাযোগ করতে পারেন।
        </p>
      </div>

      <ContactClient initialSchoolInfo={schoolInfo} />
    </main>
  );
}
