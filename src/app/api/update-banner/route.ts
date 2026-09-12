import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, image, sidebarImage } = body;

    // ফাইল থেকে ডাটা রিড করা
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(fileData);

    // হিরো ব্যানার অবজেক্টটি আপডেট করা
    data.heroBanner = {
      title: title || data.heroBanner.title,
      subtitle: subtitle || data.heroBanner.subtitle,
      image: image || data.heroBanner.image
    };

    // সাইডবার ইমেজটি আপডেট করা (যদি নতুন ইমেজ পাঠায়)
    if (sidebarImage !== undefined) {
      data.sidebarImage = sidebarImage;
    }

    // ফাইলে নতুন ডাটা সেভ করা
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, message: "সেটিংস সফলভাবে আপডেট হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}