import { NextRequest, NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, batch, phone, email, occupation, currentAddress, message } = body;

    if (!name || !batch || !phone) {
      return NextResponse.json(
        { error: "নাম, ব্যাচ এবং মোবাইল নম্বর প্রদান করা আবশ্যক" },
        { status: 400 }
      );
    }

    const currentData = await getSchoolData();
    const registrations = currentData.alumniRegistrations || [];

    const newRegistration = {
      id: Date.now(),
      name: name.trim(),
      batch: batch.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      occupation: (occupation || "").trim(),
      currentAddress: (currentAddress || "").trim(),
      message: (message || "").trim(),
      submittedAt: new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const updatedData = {
      ...currentData,
      alumniRegistrations: [newRegistration, ...registrations],
    };

    await saveSchoolData(updatedData);

    return NextResponse.json({
      success: true,
      message: "আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে। বিদ্যালয় পরিবারের পক্ষ থেকে অভিনন্দন!",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("Alumni registration error:", error);
    return NextResponse.json(
      { error: "রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
