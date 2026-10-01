import { getSchoolData } from "@/lib/dataProvider";
import NoticesClient from "@/components/NoticesClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `সকল নোটিশ ও বিজ্ঞপ্তি | ${schoolName}`,
    description: `${schoolName}-এর অফিসিয়াল নোটিশ বোর্ড। পরীক্ষা, ফলাফল, ছুটি ও ভর্তি সংক্রান্ত সকল প্রাতিষ্ঠানিক বিজ্ঞপ্তি।`,
    openGraph: {
      title: `নোটিশ বোর্ড | ${schoolName}`,
      description: `${schoolName}-এর সাম্প্রতিক বিজ্ঞপ্তি ও দাপ্তরিক নোটিশ।`,
    }
  };
}

export default async function NoticesPage() {
  const data = await getSchoolData();
  return <NoticesClient initialNotices={data?.notices || []} />;
}
