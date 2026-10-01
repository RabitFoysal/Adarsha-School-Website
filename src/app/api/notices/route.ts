import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.notices || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);
    
    const today = new Date().toISOString().split("T")[0];

    if (!data.notices) data.notices = [];

    // এডিট মোড
    if (body.id) {
      data.notices = data.notices.map((notice: any) => 
        notice.id === body.id 
          ? { 
              ...notice, 
              title: body.title, 
              description: body.description, 
              imageUrl: body.imageUrl !== undefined ? body.imageUrl : notice.imageUrl, 
              attachmentUrl: body.attachmentUrl !== undefined ? body.attachmentUrl : notice.attachmentUrl 
            } 
          : notice
      );
    } 
    // নতুন তৈরির মোড
    else {
      const newNotice = {
        id: Date.now(),
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || "",
        attachmentUrl: body.attachmentUrl || "",
        date: body.date || today,
      };
      data.notices.unshift(newNotice);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "নোটিশ সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সমস্যা হয়েছে!" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.notices = (data.notices || []).filter((notice: any) => notice.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "নোটিশ মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "মুছে ফেলতে সমস্যা হয়েছে!" }, { status: 500 });
  }
}
