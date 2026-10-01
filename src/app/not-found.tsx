import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
          ৪০৪
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            আপনি যে পাতাটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল।
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
