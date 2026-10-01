import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read school info" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await getSchoolData(true);
    
    if (body.schoolInfo) {
      data.schoolInfo = { ...data.schoolInfo, ...body.schoolInfo };
    }

    if (body.footerData && typeof body.footerData === "object") {
      data.footerData = { ...data.footerData, ...body.footerData };
    }
    
    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ ...saveRes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update" }, { status: 500 });
  }
}
