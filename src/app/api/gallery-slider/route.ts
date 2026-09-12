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
    const { action, path: imgPath } = await request.json();
    const data = readData();

    if (!data.gallery) data.gallery = [];

    if (action === "add") {
      if (!data.gallery.includes(imgPath)) {
        data.gallery.push(imgPath);
      }
    } else if (action === "remove") {
      data.gallery = data.gallery.filter((p: string) => p !== imgPath);
    }

    writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}