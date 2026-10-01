import { getSchoolData } from "@/lib/dataProvider";
import AdmissionClient from "./AdmissionClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";
  const session = data?.admission?.buttonText || "নতুন শিক্ষাবর্ষ";

  return {
    title: `ভর্তি সংক্রান্ত তথ্য (${session}) | ${schoolName}`,
    description: `${schoolName}-এ ${session}-এর ভর্তি প্রক্রিয়া, প্রয়োজনীয় কাগজপত্র, আসন সংখ্যা ও অনলাইন আবেদন সংক্রান্ত তথ্য।`,
    openGraph: {
      title: `ভর্তি তথ্য | ${schoolName}`,
      description: `${schoolName} নতুন শিক্ষাবর্ষের ভর্তি তথ্য ও নির্দেশনাবলী।`,
    }
  };
}

export default async function AdmissionInfoPage() {
  const data = await getSchoolData();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <AdmissionClient initialData={data} />
    </main>
  );
}
