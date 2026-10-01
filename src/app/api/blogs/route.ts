import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.blogs || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.blogs) data.blogs = [];

    if (body.id) {
      data.blogs = data.blogs.map((b: any) =>
        b.id === body.id ? { ...b, ...body } : b
      );
    } else {
      const newBlog = {
        id: Date.now(),
        title: body.title,
        content: body.content,
        author: body.author || "বিদ্যালয় পরিবার",
        date: body.date || new Date().toISOString().split("T")[0],
        image: body.image || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
      };
      data.blogs.unshift(newBlog);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ success: Boolean(saveRes), message: "ব্লগ সংরক্ষিত হয়েছে!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.blogs = (data.blogs || []).filter((b: any) => b.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ success: Boolean(saveRes), message: "ব্লগ মুছে ফেলা হয়েছে!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
