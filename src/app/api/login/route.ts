import { NextResponse } from "next/server";
import adminData from "@/data/adminData.json";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  // আইডি ও পাসওয়ার্ড মিলছে কি না চেক করা
  if (username === adminData.username && password === adminData.password) {
    // মিললে একটি সিকিউর কুকি সেট করে দেওয়া (যা হ্যাক করা কঠিন)
    const response = NextResponse.json({ success: true });
    response.cookies.set("isLoggedIn", "true", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return response;
  }

  // না মিললে এরর পাঠানো
  return NextResponse.json({ success: false }, { status: 401 });
}