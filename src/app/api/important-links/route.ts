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
  return NextResponse.json(data.importantLinks || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();

    if (!data.importantLinks) data.importantLinks = [];

    // যদি রিকোয়েস্টে ID থাকে, তবে এডিট হবে
    if (body.id) {
      data.importantLinks = data.importantLinks.map((link: any) => 
        link.id === body.id ? { ...link, title: body.title, url: body.url } : link
      );
    } 
    // ID না থাকলে নতুন তৈরি হবে
    else {
      const newLink = {
        id: Date.now(),
        title: body.title,
        url: body.url
      };
      data.importantLinks.push(newLink);
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "সফলভাবে সংরক্ষিত হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = readData();
    data.importantLinks = data.importantLinks.filter((link: any) => link.id !== id);
    writeData(data);

    return NextResponse.json({ success: true, message: "লিঙ্ক ডিলিট করা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}