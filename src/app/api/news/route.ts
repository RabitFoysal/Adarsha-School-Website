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
  return NextResponse.json(data.news || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();

    if (!data.news) data.news = [];

    // এডিট মোড
    if (body.id) {
      data.news = data.news.map((item: any) => 
        item.id === body.id ? { ...item, title: body.title, description: body.description } : item
      );
    } 
    // অ্যাড মোড
    else {
      const newNews = {
        id: Date.now(),
        title: body.title,
        description: body.description
      };
      data.news.push(newNews);
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
    data.news = data.news.filter((item: any) => item.id !== id);
    writeData(data);

    return NextResponse.json({ success: true, message: "ডিলিট করা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}