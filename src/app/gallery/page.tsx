import { getSchoolData } from "@/lib/dataProvider";
import GalleryClient from "./GalleryClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";
  return {
    title: `ক্যাম্পাস চিত্রশালা | ${schoolName}`,
    description: `${schoolName} এর ক্যাম্পাস, ক্রীড়া, সাংস্কৃতিক ও একাডেমিক কার্যক্রমের ছবির গ্যালারি।`,
  };
}

export default async function GalleryPage() {
  const data = await getSchoolData();
  const gallery = data?.gallery || [];
  const schoolName = data?.schoolInfo?.name || "আমাদের বিদ্যাপীঠ";

  return <GalleryClient initialGallery={gallery} schoolName={schoolName} />;
}
