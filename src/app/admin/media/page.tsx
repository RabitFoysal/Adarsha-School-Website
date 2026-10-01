"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MediaRedirect() {
  const router = useRouter();

  useEffect(() => {
    // মিডিয়া লাইব্রেরির বিকল্প হিসেবে সরাসরি ক্যাম্পাস চিত্রশালায় রিডাইরেক্ট
    router.replace("/admin/gallery");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-gray-700">ক্যাম্পাস চিত্রশালায় নিয়ে যাওয়া হচ্ছে...</p>
      </div>
    </div>
  );
}
