import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    const sliderConfig = data.layoutConfig?.find((c: any) => c.id === "gallery_slider");
    return NextResponse.json({
      success: true,
      gallery: data.gallery || [],
      sliderActive: sliderConfig ? sliderConfig.active : true,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "চিত্রশালার ডেটা লোড করতে ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await getSchoolData(true);

    if (body.gallery !== undefined) {
      data.gallery = body.gallery;
    }

    if (typeof body.sliderActive === "boolean") {
      if (!Array.isArray(data.layoutConfig)) {
        data.layoutConfig = [];
      }
      const itemIndex = data.layoutConfig.findIndex((c: any) => c.id === "gallery_slider");
      if (itemIndex > -1) {
        data.layoutConfig[itemIndex].active = body.sliderActive;
      } else {
        data.layoutConfig.push({
          id: "gallery_slider",
          name: "ফটো গ্যালারি স্লাইডার",
          active: body.sliderActive,
        });
      }
    }

    const saveRes = await saveSchoolData(data);

    return NextResponse.json({
      message: "ক্যাম্পাস চিত্রশালা সফলভাবে আপডেট করা হয়েছে",
      gallery: data.gallery,
      ...saveRes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
