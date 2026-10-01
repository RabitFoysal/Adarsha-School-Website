"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/HomeClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">ওয়েবসাইট লোড হচ্ছে...</p>
      </div>
    </div>
  ),
});

export default function HomeClientWrapper({ initialData }: { initialData?: any }) {
  return <HomeClient initialData={initialData} />;
}
