import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, image, sidebarImage } = body;

    const data = await getSchoolData(true);

    if (!data.heroBanner) data.heroBanner = {};
    data.heroBanner = {
      ...data.heroBanner,
      title: title !== undefined ? title : data.heroBanner.title,
      subtitle: subtitle !== undefined ? subtitle : data.heroBanner.subtitle,
      image: image !== undefined ? image : data.heroBanner.image,
    };

    if (sidebarImage !== undefined) {
      data.sidebarImage = sidebarImage;
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "ব্যানার সেটিংস সফলভাবে আপডেট হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}
