import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  // আমরা নতুন 'blogs' ফোল্ডারটি তালিকায় যুক্ত করেছি
  const categories = ["banners", "teachers", "messages", "gallery", "blogs"];
  const media: Record<string, string[]> = {
    banners: [],
    teachers: [],
    messages: [],
    gallery: [],
    blogs: []
  };

  categories.forEach(cat => {
    const catDir = path.join(uploadsDir, cat);
    if (fs.existsSync(catDir)) {
      const files = fs.readdirSync(catDir);
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      media[cat] = imageFiles.map(file => `/uploads/${cat}/${file}`);
    }
  });

  return NextResponse.json(media);
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json({ success: false, message: "ফাইল পাথ দেওয়া হয়নি!" }, { status: 400 });
    }

    const absolutePath = path.join(process.cwd(), "public", filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return NextResponse.json({ success: true, message: "ছবিটি সফলভাবে ডিলিট হয়েছে!" });
    }

    return NextResponse.json({ success: false, message: "ছবিটি পাওয়া যায়নি!" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}