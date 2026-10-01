import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.committee || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.committee) data.committee = [];

    if (body.id) {
      data.committee = data.committee.map((c: any) =>
        c.id === body.id ? { ...c, ...body } : c
      );
    } else {
      const newMember = {
        id: Date.now(),
        ...body,
        name: body.name,
        designation: body.designation,
        role: body.role || body.designation,
        tenure: body.tenure || "২০২৪ - বর্তমান",
        qualification: body.qualification || "",
        occupation: body.occupation || "",
        phone: body.phone || "",
        email: body.email || "",
        address: body.address || "",
        order: Number(body.order) || (data.committee.length + 1),
        bio: body.bio || "",
        image: body.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=Committee",
      };
      data.committee.push(newMember);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "কমিটি সদস্য তথ্য সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.committee = (data.committee || []).filter((c: any) => c.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
