import { NextResponse } from "next/server";
import { getAdminData } from "@/lib/dataProvider";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const admin = await getAdminData();

    const cleanUsername = String(username || "").trim();
    const cleanPassword = String(password || "").trim();
    const targetUsername = String(admin.username || "admin").trim();
    const targetPassword = String(admin.password || "password123").trim();

    // Check credentials (case-insensitive for username, exact match for password)
    const isUsernameMatch = cleanUsername.toLowerCase() === targetUsername.toLowerCase();
    const isPasswordMatch = cleanPassword === targetPassword;

    if (isUsernameMatch && isPasswordMatch) {
      const response = NextResponse.json({ success: true, message: "লগইন সফল!" });
      
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      };

      response.cookies.set("admin_session", "authenticated", cookieOptions);
      response.cookies.set("isLoggedIn", "true", cookieOptions);

      return response;
    }

    return NextResponse.json({ success: false, message: "ব্যবহারকারী নাম অথবা পাসওয়ার্ড ভুল!" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" }, { status: 500 });
  }
}
