import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.layoutConfig || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (Array.isArray(body.layoutConfig)) {
      data.layoutConfig = body.layoutConfig;
    }
    if (body.sidebarImage !== undefined) {
      data.sidebarImage = body.sidebarImage;
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "লেআউট কনফিগারেশন সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
