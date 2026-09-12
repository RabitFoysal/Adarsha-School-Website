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
  return NextResponse.json(data.messages || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();

    if (!data.messages) data.messages = [];

    // এডিট মোড
    if (body.id) {
      data.messages = data.messages.map((msg: any) => 
        msg.id === body.id 
          ? { ...msg, name: body.name, designation: body.designation, text: body.text, image: body.image } 
          : msg
      );
    } 
    // অ্যাড মোড
    else {
      const newMessage = {
        id: Date.now(),
        name: body.name,
        designation: body.designation,
        text: body.text,
        image: body.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=No+Image"
      };
      data.messages.push(newMessage);
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
    data.messages = data.messages.filter((msg: any) => msg.id !== id);
    writeData(data);

    return NextResponse.json({ success: true, message: "ডিলিট করা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}