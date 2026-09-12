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
  return NextResponse.json(data.blogs || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    
    const today = new Date().toISOString().split('T')[0];

    if (!data.blogs) data.blogs = [];

    // এডিট মোড (তারিখ অপরিবর্তিত থাকবে)
    if (body.id) {
      data.blogs = data.blogs.map((blog: any) => 
        blog.id === body.id 
          ? { ...blog, title: body.title, content: body.content, author: body.author, image: body.image } 
          : blog
      );
    } 
    // নতুন তৈরি মোড
    else {
      const newBlog = {
        id: Date.now(),
        title: body.title,
        content: body.content,
        author: body.author || "অ্যাডমিন",
        image: body.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800",
        date: today
      };
      data.blogs.unshift(newBlog);
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
    data.blogs = data.blogs.filter((blog: any) => blog.id !== id);
    writeData(data);

    return NextResponse.json({ success: true, message: "ডিলিট করা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}