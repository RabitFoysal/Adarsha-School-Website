import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';
const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");
const readData = () => JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
const writeData = (data: any) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

export async function GET() {
  const data = readData();
  return NextResponse.json({
    customPages: data.customPages || [],
    navbarLinks: data.navbarLinks || [],
    uiLabels: data.uiLabels || {}
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    const { action } = body;

    if (!data.navbarLinks) data.navbarLinks = [];

    // ক. নতুন মেনু লিঙ্ক যোগ করা
    if (action === "add_menu") {
      data.navbarLinks.push({
        id: Date.now(),
        name: body.name,
        url: body.url,
        parentId: body.parentId ? Number(body.parentId) : null,
        active: true // তৈরি করার সময় এটি একটিভ থাকবে
      });
    } 
    // খ. মেনু লিঙ্ক আপডেট করা (অন/অফ এবং প্যারেন্ট আইডি পরিবর্তন)
    else if (action === "update_menu") {
      data.navbarLinks = data.navbarLinks.map((link: any) => {
        if (link.id === body.id) {
          return {
            ...link,
            name: body.name !== undefined ? body.name : link.name,
            url: body.url !== undefined ? body.url : link.url,
            parentId: body.parentId !== undefined ? (body.parentId ? Number(body.parentId) : null) : link.parentId,
            active: body.active !== undefined ? body.active : link.active
          };
        }
        return link;
      });
    }
    // গ. ডাইনামিক কাস্টম পেজ
    else if (action === "save_page") {
      if (!data.customPages) data.customPages = [];
      if (body.id) {
        data.customPages = data.customPages.map((p: any) => 
          p.id === body.id ? { ...p, title: body.title, slug: body.slug, template: body.template, content: body.content, listItems: body.listItems || [] } : p
        );
      } else {
        data.customPages.push({ id: Date.now(), title: body.title, slug: body.slug, template: body.template, content: body.content, listItems: [] });
      }
    }
    // ঘ. কাস্টম পেজের মেম্বার লিস্ট এডিট
    else if (action === "save_page_item") {
      const page = data.customPages.find((p: any) => p.id === body.pageId);
      if (page) {
        if (!page.listItems) page.listItems = [];
        if (body.itemId) {
          page.listItems = page.listItems.map((item: any) => 
            item.id === body.itemId ? { ...item, name: body.name, designation: body.designation, image: body.image } : item
          );
        } else {
          page.listItems.push({ id: Date.now(), name: body.name, designation: body.designation, image: body.image });
        }
      }
    }
    // ঙ. কাস্টম পেজের মেম্বার ডিলিট
    else if (action === "delete_page_item") {
      const page = data.customPages.find((p: any) => p.id === body.pageId);
      if (page) {
        page.listItems = page.listItems.filter((item: any) => item.id !== body.itemId);
      }
    }
    // চ. UI লেবেল সেভ
    else if (action === "save_labels") {
      data.uiLabels = body.labels;
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষিত!" });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const data = readData();
  data.customPages = (data.customPages || []).filter((p: any) => p.id !== id);
  writeData(data);
  return NextResponse.json({ success: true });
}