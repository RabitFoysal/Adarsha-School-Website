import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.messages || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.messages) data.messages = [];

    if (body.id) {
      data.messages = data.messages.map((m: any) =>
        m.id === body.id
          ? {
              ...m,
              ...body,
              name: body.name || body.author || m.name || m.author,
              author: body.author || body.name || m.author || m.name,
              text: body.text || body.content || m.text || m.content,
              content: body.content || body.text || m.content || m.text,
              qualification: body.qualification !== undefined ? body.qualification : (m.qualification || ""),
              order: body.order !== undefined ? Number(body.order) : (m.order || 1),
            }
          : m
      );
    } else {
      const newMsg = {
        id: Date.now(),
        ...body,
        name: body.name || body.author,
        author: body.author || body.name,
        designation: body.designation,
        qualification: body.qualification || "",
        title: body.title || "বাণী",
        text: body.text || body.content,
        content: body.content || body.text,
        order: Number(body.order) || (data.messages.length + 1),
        image: body.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=Message",
      };
      data.messages.push(newMsg);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "বাণী সফলভাবে সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.messages = (data.messages || []).filter((m: any) => m.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "বাণী মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
