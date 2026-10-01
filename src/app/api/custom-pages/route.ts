import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";
import demoData from "@/data/demoData.json";

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json({
    customPages: data.customPages || [],
    navbarLinks: data.navbarLinks || [],
    uiLabels: data.uiLabels || {}
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData();
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
    // খ.২ মেনু লিঙ্ক ডিলিট করা
    else if (action === "delete_menu") {
      data.navbarLinks = (data.navbarLinks || []).filter((link: any) => link.id !== body.id);
    }
    // খ.৩ মেনু লিঙ্ক রি-অর্ডার করা
    else if (action === "reorder_menu") {
      if (Array.isArray(body.navbarLinks)) {
        data.navbarLinks = body.navbarLinks;
      }
    }
    // খ.৪ মেনু লিঙ্ক স্ট্যান্ডার্ড রিসেট করা
    else if (action === "reset_menu") {
      data.navbarLinks = (demoData as any).navbarLinks || [];
    }
    // গ. ডাইনামিক কাস্টম পেজ
    else if (action === "save_page") {
      if (!data.customPages) data.customPages = [];
      const pageId = body.id ? Number(body.id) : Date.now();
      const pagePayload = {
        id: pageId,
        title: body.title || "শিরোনামহীন পৃষ্ঠা",
        slug: body.slug || `page-${pageId}`,
        template: body.template || "text",
        content: body.content || "",
        image: body.image || "",
        imageSize: body.imageSize || "medium",
        imagePosition: body.imagePosition || "top",
        imageCaption: body.imageCaption || "",
        pdfUrl: body.pdfUrl || "",
        pdfMode: body.pdfMode || "button",
        pdfName: body.pdfName || "",
        listItems: body.listItems || [],
        updatedAt: new Date().toISOString()
      };

      const existingIndex = data.customPages.findIndex((p: any) => p.id === pageId);
      if (existingIndex !== -1) {
        data.customPages[existingIndex] = {
          ...data.customPages[existingIndex],
          ...pagePayload,
          listItems: data.customPages[existingIndex].listItems || pagePayload.listItems
        };
      } else {
        data.customPages.push(pagePayload);
      }

      await saveSchoolData(data);
      return NextResponse.json({ 
        success: true, 
        message: body.id ? "পেজটি সফলভাবে আপডেট হয়েছে!" : "নতুন পেজ তৈরি হয়েছে!",
        page: pagePayload 
      });
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

    await saveSchoolData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষিত!" });
  } catch (error) { 
    return NextResponse.json({ success: false }, { status: 500 }); 
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const data = await getSchoolData();
    data.customPages = (data.customPages || []).filter((p: any) => p.id !== id);
    await saveSchoolData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
