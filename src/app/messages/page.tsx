import { getSchoolData } from "@/lib/dataProvider";
import MessagesClient from "@/components/MessagesClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `বিদ্যালয় বাণী ও অনুপ্রেরণা | ${schoolName}`,
    description: `${schoolName}-এর সভাপতি ও প্রধান শিক্ষকের অনুপ্রেরণামূলক বাণী, দিকনির্দেশনা ও শুভেচ্ছা বার্তা।`,
    openGraph: {
      title: `বিদ্যালয় বাণী | ${schoolName}`,
      description: `${schoolName}-এর সভাপতি ও প্রধান শিক্ষকের মূল্যবান বাণী।`,
    }
  };
}

export default async function MessagesPage() {
  const data = await getSchoolData();
  return (
    <MessagesClient 
      initialMessages={data?.messages || []} 
      initialSchoolInfo={data?.schoolInfo} 
    />
  );
}
