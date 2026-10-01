import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.staff || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.staff) data.staff = [];

    if (body.id) {
      data.staff = data.staff.map((s: any) =>
        s.id === body.id ? { ...s, ...body } : s
      );
    } else {
      const newStaff = {
        id: Date.now(),
        ...body,
        name: body.name,
        designation: body.designation,
        department: body.department || "প্রশাসনিক শাখা",
        phone: body.phone || "",
        email: body.email || "",
        qualification: body.qualification || "",
        joiningDate: body.joiningDate || "",
        bloodGroup: body.bloodGroup || "",
        order: Number(body.order) || (data.staff.length + 1),
        bio: body.bio || "",
        image: body.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=Staff",
      };
      data.staff.push(newStaff);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "কর্মচারী তথ্য সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.staff = (data.staff || []).filter((s: any) => s.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
