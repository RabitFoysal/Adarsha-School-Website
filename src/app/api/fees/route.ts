import { NextRequest, NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json({
      feeStructure: data.feeStructure || [],
      paymentMethods: data.paymentMethods || {}
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch fees data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feeStructure, paymentMethods } = body;
    const currentData = await getSchoolData();

    const updatedData = {
      ...currentData,
      feeStructure: feeStructure !== undefined ? feeStructure : (currentData.feeStructure || []),
      paymentMethods: paymentMethods !== undefined ? paymentMethods : (currentData.paymentMethods || {})
    };

    await saveSchoolData(updatedData);

    return NextResponse.json({
      success: true,
      message: "ফি ও পেমেন্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
      feeStructure: updatedData.feeStructure,
      paymentMethods: updatedData.paymentMethods
    });
  } catch (error) {
    console.error("Fees update error:", error);
    return NextResponse.json({ error: "সংরক্ষণ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
