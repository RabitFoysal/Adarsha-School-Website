import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

const readData = () => {
  return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
};

const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export async function GET() {
  const data = readData();
  return NextResponse.json(data.layoutConfig || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // এটি নতুন লেআউটের অ্যারে গ্রহণ করবে
    const data = readData();
    
    data.layoutConfig = body;
    writeData(data);

    return NextResponse.json({ success: true, message: "লেআউট সফলভাবে আপডেট হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}