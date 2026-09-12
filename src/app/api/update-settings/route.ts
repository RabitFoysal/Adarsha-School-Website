import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");

const readData = () => {
  return JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
};

const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    const { section } = body;

    // ১. স্কুলের সাধারণ তথ্য আপডেট
    if (section === "school_info") {
      data.schoolInfo = {
        ...data.schoolInfo,
        name: body.name,
        logo: body.logo,
        copyright: body.copyright,
        contact: {
          ...data.schoolInfo.contact,
          address: body.address
        }
      };

      // যদি লোকাল আপলোডেড লোগো হয়, তবে public/favicon.ico ও আপডেট করে দেওয়া হচ্ছে
      if (body.logo && typeof body.logo === "string" && body.logo.startsWith("/uploads/")) {
        try {
          const sourcePath = path.join(process.cwd(), "public", body.logo);
          const faviconPath = path.join(process.cwd(), "public", "favicon.ico");
          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, faviconPath);
          }
        } catch (copyErr) {
          console.error("Favicon sync error:", copyErr);
        }
      }
    } 
    // ২. হিরো ব্যানার কন্ট্রোল সেটিংস আপডেট
    else if (section === "hero_banner") {
      data.heroBanner = {
        image: body.image,
        title: body.title,
        subtitle: body.subtitle,
        showText: body.showText,
        showButton: body.showButton,
        opacity: Number(body.opacity),
        bgPosition: body.bgPosition,
        textAlign: body.textAlign
      };
    } 
    // ৩. ভর্তি সেটিংস ও আবেদন সফটওয়্যার লিঙ্ক আপডেট
    else if (section === "admission") {
      data.admission = {
        ...data.admission,
        isOpen: Boolean(body.isOpen !== false),
        showNavbarButton: Boolean(body.showNavbarButton !== false),
        buttonText: body.buttonText || "ভর্তি চলছে ২০২৬",
        applyButtonText: body.applyButtonText || "অনলাইনে আবেদন করুন",
        externalLink: body.externalLink || "",
        closedNotice: body.closedNotice || "বর্তমানে নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম স্থগিত রয়েছে। পরবর্তী বিজ্ঞপ্তির জন্য নোটিশ বোর্ডে নজর রাখুন।",
        instructions: body.instructions || ""
      };
    }
    // ৪. লাইভ পরিসংখ্যান আপডেট (নতুন)
    else if (section === "stats") {
      data.stats = {
        students: body.students,
        teachers: body.teachers,
        passRate: body.passRate,
        established: body.established
      };
    }
    // ৫. থিম কালার কন্ট্রোল আপডেট (নতুন)
    else if (section === "theme_color") {
      data.themeColor = body.themeColor || "emerald";
    }

    writeData(data);
    return NextResponse.json({ success: true, message: "সেটিংস সফলভাবে আপডেট হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}