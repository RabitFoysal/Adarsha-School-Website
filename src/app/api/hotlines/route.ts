import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.hotlines || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (body.hotlines && Array.isArray(body.hotlines)) {
      data.hotlines = body.hotlines;
    } else if (body.number && body.name) {
      if (!data.hotlines) data.hotlines = [];
      if (body.id) {
        data.hotlines = data.hotlines.map((h: any) =>
          h.id === body.id ? { ...h, ...body } : h
        );
      } else {
        data.hotlines.push({
          id: Date.now(),
          number: body.number,
          name: body.name,
        });
      }
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "সরকারি হটলাইন সফলভাবে সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.hotlines = (data.hotlines || []).filter((h: any) => h.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "হটলাইন মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
