import { NextResponse } from "next/server";
import { getSchoolData, saveSchoolData } from "@/lib/dataProvider";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getSchoolData(true);
    const { section } = body;

    // ১. স্কুলের সাধারণ তথ্য আপডেট
    if (section === "school_info") {
      data.schoolInfo = {
        ...data.schoolInfo,
        name: body.name !== undefined ? body.name : data.schoolInfo?.name,
        slogan: body.slogan !== undefined ? body.slogan : (data.schoolInfo?.slogan || "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ"),
        eiin: body.eiin !== undefined ? body.eiin : (data.schoolInfo?.eiin || "108420"),
        established: body.established !== undefined ? body.established : (data.schoolInfo?.established || "১৯৭৫"),
        logo: body.logo !== undefined ? body.logo : data.schoolInfo?.logo,
        copyright: body.copyright !== undefined ? body.copyright : data.schoolInfo?.copyright,
        contact: {
          ...data.schoolInfo?.contact,
          address: body.address !== undefined ? body.address : data.schoolInfo?.contact?.address,
          phone: body.phone !== undefined ? body.phone : data.schoolInfo?.contact?.phone,
          email: body.email !== undefined ? body.email : data.schoolInfo?.contact?.email,
        },
      };

      if (body.established && data.stats) {
        data.stats.established = body.established;
      }

      if (body.logo && typeof body.logo === "string" && body.logo.startsWith("/uploads/")) {
        try {
          const sourcePath = path.join(process.cwd(), "public", body.logo);
          const faviconPath = path.join(process.cwd(), "public", "favicon.ico");
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, faviconPath);
          }
        } catch {}
      }
    } 
    // ২. হিরো ব্যানার কন্ট্রোল
    else if (section === "hero_banner") {
      data.heroBanner = {
        image: body.image !== undefined ? body.image : data.heroBanner?.image,
        title: body.title !== undefined ? body.title : data.heroBanner?.title,
        subtitle: body.subtitle !== undefined ? body.subtitle : data.heroBanner?.subtitle,
        showText: body.showText !== undefined ? Boolean(body.showText) : true,
        showButton: body.showButton !== undefined ? Boolean(body.showButton) : true,
        opacity: body.opacity !== undefined ? Number(body.opacity) : 60,
        bgPosition: body.bgPosition || "center",
        textAlign: body.textAlign || "center",
      };
    } 
    // ৩. ভর্তি সেটিংস
    else if (section === "admission") {
      data.admission = {
        ...data.admission,
        isOpen: Boolean(body.isOpen !== false),
        showNavbarButton: Boolean(body.showNavbarButton !== false),
        buttonText: body.buttonText || "ভর্তি চলছে ২০২৬",
        applyButtonText: body.applyButtonText || "অনলাইনে আবেদন করুন",
        externalLink: body.externalLink !== undefined ? body.externalLink : "",
        closedNotice: body.closedNotice || "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম স্থগিত রয়েছে।",
        instructions: body.instructions !== undefined ? body.instructions : "",
      };
    }
    // ৪. লাইভ পরিসংখ্যান
    else if (section === "stats") {
      data.stats = {
        students: body.students,
        teachers: body.teachers,
        passRate: body.passRate,
        established: body.established,
      };
    }
    // ৫. থিম কালার
    else if (section === "theme_color") {
      data.themeColor = body.themeColor || "emerald";
    }
    // ৬. কাস্টম কালার
    else if (section === "custom_colors") {
      data.customColors = body.customColors;
    }
    // ৭. বাটন ও ইউআই লেবেল সেটিংস
    else if (section === "labels" || section === "ui_labels") {
      data.uiLabels = {
        ...(data.uiLabels || {}),
        noticesTitle: body.noticesTitle !== undefined ? body.noticesTitle : data.uiLabels?.noticesTitle,
        noticesSubtitle: body.noticesSubtitle !== undefined ? body.noticesSubtitle : data.uiLabels?.noticesSubtitle,
        teachersTitle: body.teachersTitle !== undefined ? body.teachersTitle : data.uiLabels?.teachersTitle,
        messagesTitle: body.messagesTitle !== undefined ? body.messagesTitle : data.uiLabels?.messagesTitle,
        blogsTitle: body.blogsTitle !== undefined ? body.blogsTitle : data.uiLabels?.blogsTitle,
        applyButton: body.applyButton !== undefined ? body.applyButton : data.uiLabels?.applyButton,
        readMore: body.readMore !== undefined ? body.readMore : (data.uiLabels?.readMore || "বিস্তারিত পড়ুন"),
        viewAll: body.viewAll !== undefined ? body.viewAll : (data.uiLabels?.viewAll || "সকল দেখুন"),
        quickAccessTitle: body.quickAccessTitle !== undefined ? body.quickAccessTitle : (data.uiLabels?.quickAccessTitle || "তাৎক্ষণিক সেবা ও পোর্টাল"),
      };
    }
    // ৮. গুগল ট্রান্সলেটর ও ভাষা সেটিংস
    else if (section === "translation" || section === "translator") {
      data.translationSettings = {
        enabled: body.enabled !== undefined ? Boolean(body.enabled) : true,
        defaultLanguage: body.defaultLanguage || "bn",
        showNavbarToggle: body.showNavbarToggle !== undefined ? Boolean(body.showNavbarToggle) : true,
        translationMethod: body.translationMethod || "google",
      };
      data.translationMethod = body.translationMethod || "google";
    }

    const saveRes = await saveSchoolData(data);
    return NextResponse.json({ message: "সেটিংস সফলভাবে আপডেট হয়েছে!", ...saveRes });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}
