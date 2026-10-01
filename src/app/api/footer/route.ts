import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";
import demoData from "@/data/demoData.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    const footerData = data.footerData || (demoData as any).footerData || {};
    return NextResponse.json({
      success: true,
      footerData,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to read footer data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await getSchoolData(true);

    if (body.footerData && typeof body.footerData === "object") {
      data.footerData = {
        ...(data.footerData || {}),
        ...body.footerData,
        quickLinks: Array.isArray(body.footerData.quickLinks)
          ? body.footerData.quickLinks
          : (data.footerData?.quickLinks || []),
        academicLinks: Array.isArray(body.footerData.academicLinks)
          ? body.footerData.academicLinks
          : (data.footerData?.academicLinks || []),
      };
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({
      success: true,
      message: "ফুটার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
      footerData: data.footerData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to update footer" }, { status: 500 });
  }
}
