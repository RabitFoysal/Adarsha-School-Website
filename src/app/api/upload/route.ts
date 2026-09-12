import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // যদি ক্যাটাগরি না বলা থাকে, তবে ডিফল্টভাবে 'gallery' ফোল্ডারে যাবে
    const category = searchParams.get("category") || "gallery"; 

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "কোনো ছবি পাওয়া যায়নি!" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // public/uploads/[category] ফোল্ডার তৈরি করা হচ্ছে
    const uploadDir = path.join(process.cwd(), "public", "uploads", category);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.name.split(".").pop();
    const filename = `${category}-${uniqueSuffix}.${extension}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${category}/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: "আপলোড হতে সমস্যা হয়েছে!" }, { status: 500 });
  }
}