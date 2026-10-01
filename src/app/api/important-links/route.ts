import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.importantLinks || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (body.links && Array.isArray(body.links)) {
      data.importantLinks = body.links;
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "গুরুত্বপূর্ণ লিঙ্ক সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
