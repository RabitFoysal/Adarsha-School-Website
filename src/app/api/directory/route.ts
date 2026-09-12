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
  return NextResponse.json(data.directory || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    const { action } = body;

    if (!data.directory) data.directory = [];

    // ১. নতুন প্রধান ক্যাটাগরি যোগ করা / এডিট করা
    if (action === "add_category") {
      if (body.id) {
        // এডিট ক্যাটাগরি টাইটেল
        data.directory = data.directory.map((cat: any) => 
          cat.id === body.id ? { ...cat, title: body.title } : cat
        );
      } else {
        // নতুন ক্যাটাগরি তৈরি
        const newCategory = {
          id: Date.now(),
          title: body.title,
          items: []
        };
        data.directory.push(newCategory);
      }
    } 
    
    // ২. উপ-লিঙ্ক (Sub-item) যোগ করা / এডিট করা
    else if (action === "add_item") {
      if (body.id) {
        // উপ-লিঙ্ক এডিট করা (সব ক্যাটাগরি লুপ করে সঠিক আইডি চেক করছি)
        data.directory.forEach((cat: any) => {
          cat.items = cat.items.map((item: any) => 
            item.id === body.id ? { ...item, name: body.name, content: body.content } : item
          );
        });
      } else {
        const category = data.directory.find((cat: any) => cat.id === Number(body.categoryId));
        if (category) {
          const newItem = {
            id: Date.now() + Math.round(Math.random() * 1000),
            name: body.name,
            content: body.content
          };
          category.items.push(newItem);
        }
      }
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষণ সম্পন্ন!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const id = Number(searchParams.get("id"));

    const data = readData();

    if (action === "delete_category") {
      data.directory = data.directory.filter((cat: any) => cat.id !== id);
    } else if (action === "delete_item") {
      data.directory.forEach((cat: any) => {
        cat.items = cat.items.filter((item: any) => item.id !== id);
      });
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "মুছে ফেলা হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সমস্যা হয়েছে!" }, { status: 500 });
  }
}