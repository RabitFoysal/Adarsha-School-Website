import { NextResponse } from "next/server";
import { getAdminData, saveAdminData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();
    const admin = await getAdminData();

    if (admin.password !== oldPassword) {
      return NextResponse.json({ success: false, message: "পুরোনো পাসওয়ার্ড সঠিক নয়!" }, { status: 400 });
    }

    await saveAdminData({ username: admin.username, password: newPassword });
    return NextResponse.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে!" }, { status: 500 });
  }
}
