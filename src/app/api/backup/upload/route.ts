import { NextResponse } from "next/server";
import { saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data || typeof data !== "object") {
      return NextResponse.json({ success: false, error: "Invalid backup data" }, { status: 400 });
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ success: Boolean(saveRes), message: "ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to restore backup" }, { status: 500 });
  }
}
