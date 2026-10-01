import { NextRequest, NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json({
      alumni: data.alumni || [],
      alumniRegistrations: data.alumniRegistrations || []
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch alumni data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, member, registrationId } = body;
    const currentData = await getSchoolData();
    let alumni = currentData.alumni || [];
    let registrations = currentData.alumniRegistrations || [];

    if (action === "delete_member" && member?.id) {
      alumni = alumni.filter((m: any) => String(m.id) !== String(member.id));
    } else if (action === "save_member" && member) {
      if (member.id) {
        // Edit existing
        alumni = alumni.map((m: any) => String(m.id) === String(member.id) ? { ...m, ...member } : m);
      } else {
        // Add new
        const newMember = { ...member, id: Date.now() };
        alumni = [newMember, ...alumni];
      }
    } else if (action === "delete_registration" && registrationId) {
      registrations = registrations.filter((r: any) => String(r.id) !== String(registrationId));
    }

    const updatedData = {
      ...currentData,
      alumni,
      alumniRegistrations: registrations
    };

    await saveSchoolData(updatedData);

    return NextResponse.json({
      success: true,
      message: "অ্যালামনাই তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      alumni,
      alumniRegistrations: registrations
    });
  } catch (error) {
    console.error("Alumni update error:", error);
    return NextResponse.json({ error: "সংরক্ষণ করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
