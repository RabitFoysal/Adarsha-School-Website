import { NextResponse } from "next/server";
import { getSchoolData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSchoolData();
    return NextResponse.json({
      success: true,
      data: {
        schoolInfo: data.schoolInfo || {},
        teachers: data.teachers || [],
        staff: data.staff || [],
        committee: data.committee || [],
        dignitaries: data.dignitaries || [],
        notices: data.notices || [],
        news: data.news || [],
        messages: data.messages || [],
        blogs: data.blogs || [],
        directory: data.directory || [],
        importantLinks: data.importantLinks || [],
        layoutConfig: data.layoutConfig || [],
        gallery: data.gallery || [],
        admission: data.admission || {},
        heroBanner: data.heroBanner || {},
        stats: data.stats || {},
        themeColor: data.themeColor || "emerald",
        customColors: data.customColors || {},
        sidebarImage: data.sidebarImage || "",
        quickAccess: data.quickAccess || [],
        hotlines: data.hotlines || [],
        footerData: data.footerData || {},
        navbarLinks: data.navbarLinks || [],
        academicRoutines: data.academicRoutines || [],
        feeStructure: data.feeStructure || [],
        alumni: data.alumni || [],
        customPages: data.customPages || [],
        uiLabels: data.uiLabels || {},
      },
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "ডেটা লোড করতে ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
