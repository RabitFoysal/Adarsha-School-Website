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
  return NextResponse.json(data.notices || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    
    const today = new Date().toISOString().split('T')[0];

    if (!data.notices) data.notices = [];

    // এডিট মোড
    if (body.id) {
      data.notices = data.notices.map((notice: any) => 
        notice.id === body.id 
          ? { ...notice, title: body.title, description: body.description, imageUrl: body.imageUrl, attachmentUrl: body.attachmentUrl } 
          : notice
      );
    } 
    // নতুন তৈরির মোড
    else {
      const newNotice = {
        id: Date.now(),
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || "",
        attachmentUrl: body.attachmentUrl || "",
        date: today
      };
      data.notices.unshift(newNotice);
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষিত হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = readData();
    data.notices = data.notices.filter((notice: any) => notice.id !== id);
    writeData(data);

    return NextResponse.json({ success: true, message: "ডিলিট করা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}