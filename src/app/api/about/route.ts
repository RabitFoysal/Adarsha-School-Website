import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.aboutInfo || {}, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    data.aboutInfo = {
      ...(data.aboutInfo || {}),
      ...body,
    };

    // যদি ক্যাম্পাস ছবি আপডেট করা হয়, তবে হিরো ব্যানারের ছবি হিসেবেও সিঙ্ক রাখা যায়
    if (body.image) {
      if (!data.heroBanner) data.heroBanner = {};
      data.heroBanner.image = body.image;
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "প্রতিষ্ঠান পরিচিতি তথ্য সফলভাবে সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সংরক্ষণ ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
