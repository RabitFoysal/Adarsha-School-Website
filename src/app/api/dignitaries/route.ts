import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  return NextResponse.json(data.dignitaries || [], {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.dignitaries) data.dignitaries = [];

    // Helper to format comma or newline separated string into array of strings
    const parseList = (val: any): string[] => {
      if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
      if (typeof val === "string") {
        return val
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    const degrees = parseList(body.degrees);
    const achievements = parseList(body.achievements);
    const affiliations = parseList(body.affiliations);
    const expertise = parseList(body.expertise);

    if (body.id) {
      data.dignitaries = data.dignitaries.map((d: any) =>
        d.id === body.id
          ? {
              ...d,
              ...body,
              degrees,
              achievements,
              affiliations,
              expertise,
              tenure: body.tenure !== undefined ? body.tenure : (d.tenure || ""),
              experience: body.experience !== undefined ? body.experience : (d.experience || ""),
              socialLinks: body.socialLinks !== undefined ? body.socialLinks : (d.socialLinks || ""),
              order: body.order !== undefined ? Number(body.order) : (d.order || 0),
            }
          : d
      );
    } else {
      const newDignitary = {
        id: Date.now(),
        name: body.name || "নতুন ব্যক্তিত্ব",
        designation: body.designation || "সম্মানিত সদস্য",
        roleBadge: body.roleBadge || body.designation || "বিশিষ্ট ব্যক্তিত্ব",
        badgeColor: body.badgeColor || "blue",
        organization: body.organization || data.schoolInfo?.name || "বিদ্যালয়",
        image: body.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
        bio: body.bio || "",
        quote: body.quote || "",
        degrees,
        achievements,
        affiliations,
        expertise,
        phone: body.phone || "",
        email: body.email || "",
        tenure: body.tenure || "",
        experience: body.experience || "",
        socialLinks: body.socialLinks || "",
        order: body.order !== undefined ? Number(body.order) : (data.dignitaries.length + 1),
      };
      data.dignitaries.push(newDignitary);
    }

    // Sort by order if set
    data.dignitaries.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "ব্যক্তিত্বের তথ্য সফলভাবে সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সংরক্ষণ ব্যর্থ হয়েছে" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.dignitaries = (data.dignitaries || []).filter((d: any) => d.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "ব্যক্তিত্বের তথ্য সফলভাবে মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "মুছে ফেলা ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
