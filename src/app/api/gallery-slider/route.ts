import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { active } = await req.json();
    const data = await getSchoolData(true);

    if (!Array.isArray(data.layoutConfig)) {
      data.layoutConfig = [];
    }

    const itemIndex = data.layoutConfig.findIndex((c: any) => c.id === "gallery_slider");
    if (itemIndex > -1) {
      data.layoutConfig[itemIndex].active = Boolean(active);
    } else {
      data.layoutConfig.push({
        id: "gallery_slider",
        name: "ক্যাম্পাস চিত্রশালা স্লাইডার",
        active: Boolean(active),
      });
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "গ্যালারি স্লাইডার সেটিংস সংরক্ষিত হয়েছে", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
