import { NextResponse } from "next/server";
import { getSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="school_cms_backup.json"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to download backup" }, { status: 500 });
  }
}
