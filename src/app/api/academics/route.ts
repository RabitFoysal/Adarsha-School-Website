import { NextRequest, NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json(data.academicRoutines || []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch academics data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, item, items } = body;
    const currentData = await getSchoolData();
    let routines = currentData.academicRoutines || [];

    if (action === "set_all" && Array.isArray(items)) {
      routines = items;
    } else if (action === "delete" && item?.id) {
      routines = routines.filter((r: any) => String(r.id) !== String(item.id));
    } else if (item) {
      if (item.id) {
        // Edit
        routines = routines.map((r: any) => String(r.id) === String(item.id) ? { ...r, ...item } : r);
      } else {
        // Add new
        const newItem = {
          ...item,
          id: Date.now(),
          publishDate: item.publishDate || new Date().toISOString().split("T")[0]
        };
        routines = [newItem, ...routines];
      }
    }

    const updatedData = {
      ...currentData,
      academicRoutines: routines
    };

    await saveSchoolData(updatedData);

    return NextResponse.json({
      success: true,
      message: "একাডেমিক তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      academicRoutines: routines
    });
  } catch (error) {
    console.error("Academics update error:", error);
    return NextResponse.json({ error: "সংরক্ষণ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
