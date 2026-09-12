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
    // ৩. ভর্তি সেটিংস আপডেট
    else if (section === "admission") {
      data.admission = {
        externalLink: body.externalLink,
        showNavbarButton: body.showNavbarButton,
        instructions: body.instructions
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

    writeData(data);
    return NextResponse.json({ success: true, message: "সেটিংস সফলভাবে আপডেট হয়েছে!" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}