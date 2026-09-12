import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import adminData from "@/data/adminData.json";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // পুরোনো পাসওয়ার্ড চেক করা
    if (oldPassword !== adminData.password) {
      return NextResponse.json({ success: false, message: "পুরোনো পাসওয়ার্ড সঠিক নয়!" }, { status: 400 });
    }

    // নতুন পাসওয়ার্ড আপডেট করা
    const newData = { ...adminData, password: newPassword };
    const filePath = path.join(process.cwd(), "src/data/adminData.json");
    
    // ফাইলে নতুন ডেটা সেভ করা
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return NextResponse.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}