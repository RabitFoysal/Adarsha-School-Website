import { getSchoolData } from "@/lib/dataProvider";
import TeachersClient from "@/components/TeachersClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `সম্মানিত শিক্ষকবৃন্দ | ${schoolName}`,
    description: `${schoolName}-এর অধ্যক্ষ, উপাধ্যক্ষ এবং অভিজ্ঞ শিক্ষকমণ্ডলীর পরিচিতি, পদবি ও বিষয়ভিত্তিক তালিকা।`,
    openGraph: {
      title: `শিক্ষকবৃন্দ | ${schoolName}`,
      description: `${schoolName}-এর দক্ষ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী।`,
    }
  };
}

export default async function TeachersPage() {
  const data = await getSchoolData();
  return (
    <TeachersClient 
      initialTeachers={data?.teachers || []} 
      initialSchoolInfo={data?.schoolInfo} 
    />
  );
}
