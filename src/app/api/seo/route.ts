import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json({
      success: true,
      seoSettings: data.seoSettings || null,
      schoolInfo: data.schoolInfo || null,
      heroBanner: data.heroBanner || null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "তথ্য লোড ব্যর্থ হয়েছে!" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { seoSettings } = await req.json();

    if (!seoSettings || typeof seoSettings !== "object") {
      return NextResponse.json({ success: false, message: "সঠিক এসইও তথ্য প্রদান করুন!" }, { status: 400 });
    }

    await saveSchoolData({ seoSettings });

    return NextResponse.json({
      success: true,
      message: "এসইও সেটিংস সফলভাবে সংরক্ষিত ও লাইভ ওয়েবসাইটে কার্যকর হয়েছে!",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "সংরক্ষণ ব্যর্থ হয়েছে!" }, { status: 500 });
  }
}
