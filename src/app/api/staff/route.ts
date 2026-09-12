import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';
const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");
const readData = () => JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
const writeData = (data: any) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

export async function GET() {
  return NextResponse.json(readData().staff || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = readData();
    if (!data.staff) data.staff = [];

    if (body.id) {
      data.staff = data.staff.map((s: any) => s.id === body.id ? { ...s, name: body.name, designation: body.designation, image: body.image } : s);
    } else {
      data.staff.push({ id: Date.now(), name: body.name, designation: body.designation, image: body.image });
    }
    writeData(data);
    return NextResponse.json({ success: true, message: "সংরক্ষিত!" });
  } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const data = readData();
  data.staff = (data.staff || []).filter((s: any) => s.id !== id);
  writeData(data);
  return NextResponse.json({ success: true });
}