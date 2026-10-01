import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.news || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.news) data.news = [];

    if (body.id) {
      data.news = data.news.map((n: any) =>
        n.id === body.id ? { ...n, ...body } : n
      );
    } else {
      const newItem = {
        id: Date.now(),
        title: body.title,
        description: body.description || "",
      };
      data.news.unshift(newItem);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "জরুরি খবর সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.news = (data.news || []).filter((n: any) => n.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
