import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSchoolData();
  const rawTeachers = data.teachers || [];
  
  const sortedTeachers = [...rawTeachers].sort((a: any, b: any) => {
    const orderA = a.order !== undefined ? Number(a.order) : 999;
    const orderB = b.order !== undefined ? Number(b.order) : 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id || 0) - (b.id || 0);
  });

  return NextResponse.json(sortedTeachers, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=29",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);

    if (!data.teachers) data.teachers = [];

    // বাল্ক রি-অর্ডার মোড
    if (body.bulkReorder && Array.isArray(body.teachers)) {
      data.teachers = body.teachers;
      const saveRes = await saveSchoolData(data);
      return NextResponse.json({ message: "শিক্ষকদের ক্রম সংরক্ষিত হয়েছে!", ...saveRes });
    }

    // একক শিক্ষক এডিট মোড
    if (body.id) {
      data.teachers = data.teachers.map((teacher: any) => {
        if (teacher.id === body.id) {
          const sec = body.section || teacher.section || "high_school";
          const isLead = sec === "administration" ? true : (body.isLeadership !== undefined ? Boolean(body.isLeadership) : teacher.isLeadership);

          return {
            ...teacher,
            name: body.name,
            designation: body.designation,
            section: sec,
            customSectionName: body.customSectionName !== undefined ? body.customSectionName : teacher.customSectionName,
            subject: body.subject !== undefined ? body.subject : teacher.subject,
            qualification: body.qualification !== undefined ? body.qualification : teacher.qualification,
            order: body.order !== undefined ? Number(body.order) : teacher.order,
            phone: body.phone !== undefined ? body.phone : teacher.phone,
            email: body.email !== undefined ? body.email : teacher.email,
            bloodGroup: body.bloodGroup !== undefined ? body.bloodGroup : teacher.bloodGroup,
            joiningDate: body.joiningDate !== undefined ? body.joiningDate : teacher.joiningDate,
            indexNumber: body.indexNumber !== undefined ? body.indexNumber : teacher.indexNumber,
            teacherId: body.teacherId !== undefined ? body.teacherId : teacher.teacherId,
            address: body.address !== undefined ? body.address : teacher.address,
            speech: body.speech !== undefined ? body.speech : teacher.speech,
            isLeadership: isLead,
            image: body.image || teacher.image,
            bio: body.bio !== undefined ? body.bio : teacher.bio,
          };
        }
        return teacher;
      });
    } 
    // নতুন শিক্ষক যুক্ত করার মোড
    else {
      const sec = body.section || "high_school";
      const isLead = sec === "administration" ? true : Boolean(body.isLeadership);

      const newTeacher = {
        id: Date.now(),
        name: body.name,
        designation: body.designation,
        section: sec,
        customSectionName: body.customSectionName || "",
        subject: body.subject || "",
        qualification: body.qualification || "",
        order: body.order ? Number(body.order) : 1,
        phone: body.phone || "",
        email: body.email || "",
        bloodGroup: body.bloodGroup || "",
        joiningDate: body.joiningDate || "",
        indexNumber: body.indexNumber || "",
        teacherId: body.teacherId || "",
        address: body.address || "",
        speech: body.speech || "",
        isLeadership: isLead,
        image: body.image || "https://placehold.co/400x400/e2e8f0/1e293b?text=Teacher",
        bio: body.bio || "",
      };
      data.teachers.push(newTeacher);
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "শিক্ষক তথ্য সংরক্ষিত হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সমস্যা হয়েছে!" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    const data = await getSchoolData(true);
    data.teachers = (data.teachers || []).filter((teacher: any) => teacher.id !== id);
    const saveRes = await saveSchoolData(data);

    return NextResponse.json({ message: "শিক্ষক তথ্য মুছে ফেলা হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সমস্যা হয়েছে!" }, { status: 500 });
  }
}
