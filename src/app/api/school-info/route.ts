import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

export async function GET() {
  const fileData = fs.readFileSync(dataFilePath, "utf8");
  const data = JSON.parse(fileData);
  
  // শুধুমাত্র লোগো, স্কুলের নাম এবং ব্যানার ডাটা পাঠানো হচ্ছে
  return NextResponse.json({
    schoolInfo: data.schoolInfo,
    heroBanner: data.heroBanner
  });
}