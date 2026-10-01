"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Check, 
  Copy, 
  AlertCircle, 
  Receipt, 
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info
} from "lucide-react";

interface FeeItem {
  id: string | number;
  grade: string;
  admissionFee: string;
  sessionFee: string;
  monthlyTuition: string;
  examFee: string;
  remarks?: string;
}

interface PaymentMethods {
  bkashNumber?: string;
  bkashType?: string;
  nagadNumber?: string;
  nagadType?: string;
  rocketNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  bankRouting?: string;
  feeNotice?: string;
}

export default function FeesPaymentClient({
  feeStructure,
  paymentMethods,
  schoolInfo
}: {
  feeStructure: FeeItem[];
  paymentMethods: PaymentMethods;
  schoolInfo: any;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const fees = feeStructure || [];
  const pm = paymentMethods || {};
  const schoolName = schoolInfo?.name || "বিদ্যালয়";

  return (
    <div className="space-y-12">
      {/* ১. শ্রেণিভিত্তিক ফি চার্ট সেকশন */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">শ্রেণিভিত্তিক ফি কাঠামো</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              বর্তমান শিক্ষাবর্ষে সকল শ্রেণির জন্য নির্ধারিত ফি ও মাসিক বেতনের বিবরণী
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>কর্তৃপক্ষ কর্তৃক অনুমোদিত</span>
          </span>
        </div>

        {/* রেসপনসিভ টেবিল */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">শ্রেণি / বিভাগ</th>
                <th className="py-4 px-4 text-right">ভর্তি ফি</th>
                <th className="py-4 px-4 text-right">সেশন ফি</th>
                <th className="py-4 px-4 text-right">মাসিক বেতন</th>
                <th className="py-4 px-4 text-right">পরীক্ষা ফি</th>
                <th className="py-4 px-6 text-center">মন্তব্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {fees.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.grade}</td>
                  <td className="py-4 px-4 text-right text-slate-600">{item.admissionFee}</td>
                  <td className="py-4 px-4 text-right text-slate-600">{item.sessionFee}</td>
                  <td className="py-4 px-4 text-right font-bold text-blue-700">{item.monthlyTuition}</td>
                  <td className="py-4 px-4 text-right text-slate-600">{item.examFee}</td>
                  <td className="py-4 px-6 text-center text-xs text-slate-400">{item.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* জরুরি নোট */}
        {pm.feeNotice && (
          <div className="p-4 sm:p-5 bg-amber-50/70 border-t border-amber-100 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{pm.feeNotice}</p>
          </div>
        )}
      </section>

      {/* ২. মোবাইল ব্যাংকিং ও ডিজিটাল পেমেন্ট গাইডলাইন */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>মোবাইল ব্যাংকিং পদ্ধতি</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">বিকাশ, নগদ ও রকেটের মাধ্যমে ফি পরিশোধ</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">ঘরে বসেই সহজে ও নিরাপদে আপনার সন্তানের স্কুলের বেতন পরিশোধ করুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* বিকাশ কার্ড */}
          <div className="bg-white rounded-3xl border border-pink-200/80 shadow-xs p-6 relative overflow-hidden group hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black text-pink-600 text-lg flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pink-600"></span>
                <span>বিকাশ (bKash)</span>
              </span>
              <span className="text-[11px] font-bold bg-pink-50 text-pink-700 px-2.5 py-1 rounded-md border border-pink-100">
                {pm.bkashType || "মার্চেন্ট পেমেন্ট"}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">বিকাশ নম্বর</span>
                <span className="text-base font-black text-slate-900">{pm.bkashNumber || "01700-000000"}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(pm.bkashNumber || "01700-000000", "bkash")}
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-pink-600 transition cursor-pointer shadow-2xs"
                title="নম্বরটি কপি করুন"
              >
                {copiedKey === "bkash" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mb-2">ধাপে ধাপে পেমেন্ট নিয়ম:</h4>
            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>বিকাশ অ্যাপে প্রবেশ করে <b>Payment</b> নির্বাচন করুন</li>
              <li>মার্চেন্ট নম্বরে উপরের নম্বরটি প্রবেশ করান</li>
              <li>টাকার পরিমাণ লিখুন</li>
              <li>রেফারেন্সে <b>শিক্ষার্থীর রোল ও শ্রেণি</b> লিখুন (যেমন: 12-Class8)</li>
              <li>পিন নম্বর দিয়ে পেমেন্ট নিশ্চিত করে ট্রানজেকশন আইডি সংরক্ষণ করুন</li>
            </ol>
          </div>

          {/* নগদ কার্ড */}
          <div className="bg-white rounded-3xl border border-orange-200/80 shadow-xs p-6 relative overflow-hidden group hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black text-orange-600 text-lg flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-600"></span>
                <span>নগদ (Nagad)</span>
              </span>
              <span className="text-[11px] font-bold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-100">
                {pm.nagadType || "মার্চেন্ট পেমেন্ট"}
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">নগদ নম্বর</span>
                <span className="text-base font-black text-slate-900">{pm.nagadNumber || "01800-000000"}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(pm.nagadNumber || "01800-000000", "nagad")}
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-orange-600 transition cursor-pointer shadow-2xs"
                title="নম্বরটি কপি করুন"
              >
                {copiedKey === "nagad" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mb-2">ধাপে ধাপে পেমেন্ট নিয়ম:</h4>
            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>নগদ অ্যাপে প্রবেশ করে <b>Merchant Pay</b> নির্বাচন করুন</li>
              <li>মার্চেন্ট নম্বরে উপরের নম্বরটি প্রবেশ করান</li>
              <li>টাকার পরিমাণ লিখুন</li>
              <li>কাউন্টার নম্বর: <b>1</b> এবং রেফারেন্সে <b>রোল নম্বর</b> দিন</li>
              <li>পিন নম্বর দিয়ে ট্যাপ করে ধরে রাখুন</li>
            </ol>
          </div>

          {/* রকেট কার্ড */}
          <div className="bg-white rounded-3xl border border-purple-200/80 shadow-xs p-6 relative overflow-hidden group hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black text-purple-600 text-lg flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>রকেট (Rocket)</span>
              </span>
              <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100">
                বিল পে / মার্চেন্ট
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">রকেট নম্বর / বিলার আইডি</span>
                <span className="text-base font-black text-slate-900">{pm.rocketNumber || "01900-000000"}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(pm.rocketNumber || "01900-000000", "rocket")}
                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-purple-600 transition cursor-pointer shadow-2xs"
                title="নম্বরটি কপি করুন"
              >
                {copiedKey === "rocket" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <h4 className="text-xs font-bold text-slate-800 mb-2">ধাপে ধাপে পেমেন্ট নিয়ম:</h4>
            <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>রকেট অ্যাপে প্রবেশ করে <b>Bill Pay</b> অথবা <b>Merchant Pay</b> চাপুন</li>
              <li>বিলার বা মার্চেন্ট নম্বর দিন</li>
              <li>স্টুডেন্ট আইডি ও রোল নম্বর টাইপ করুন</li>
              <li>টাকার পরিমাণ নিশ্চিত করে পিন দিন</li>
              <li>পেমেন্ট সফল হলে প্রাপ্ত SMS সংরক্ষণ করুন</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ৩. সরাসরি ব্যাংক অ্যাকাউন্টে জমা দেওয়ার তথ্য */}
      {pm.bankAccountNumber && (
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>সরাসরি ব্যাংক ডিপোজিট</span>
              </div>
              <h3 className="text-2xl font-black text-white">বিদ্যালয়ের অফিসিয়াল ব্যাংক অ্যাকাউন্ট</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">যেকোনো শাখা বা অনলাইন ব্যাংকিং অ্যাপের মাধ্যমে সরাসরি ফান্ড ট্রান্সফার করতে পারেন</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">ব্যাংক:</span>
              <span className="text-sm font-black text-white">{pm.bankName || "সোনালী ব্যাংক পিএলসি"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-semibold">হিসাবের নাম</span>
              <span className="text-xs sm:text-sm font-bold text-white mt-1 block">{pm.bankAccountName || schoolName}</span>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">হিসাব নম্বর (A/C No.)</span>
                <span className="text-sm sm:text-base font-black text-blue-300 mt-1 block">{pm.bankAccountNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(pm.bankAccountNumber || "", "bankAcc")}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition cursor-pointer"
                title="হিসাব নম্বর কপি করুন"
              >
                {copiedKey === "bankAcc" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-semibold">শাখার নাম (Branch)</span>
              <span className="text-xs sm:text-sm font-bold text-white mt-1 block">{pm.bankBranch || "প্রধান শাখা"}</span>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block font-semibold">রাউটিং নম্বর (Routing No.)</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 mt-1 block">{pm.bankRouting || "N/A"}</span>
            </div>
          </div>
        </section>
      )}

      {/* ৪. সাধারণ প্রশ্নোত্তর ও ফি সংক্রান্ত নিয়মাবলী */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">ফি প্রদান সংক্রান্ত সাধারণ জিজ্ঞাসা ও নিয়মাবলী</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">১. ফি প্রদানের পর মানি রসিদ কীভাবে পাব?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              মোবাইল ব্যাংকিং বা ব্যাংকে ফি জমার ট্রানজেকশন আইডি ও শিক্ষার্থীর রোল নম্বর লিখে বিদ্যালয় অফিসে দেখালে অফিসিয়াল প্রিন্ট করা মানি রসিদ পাওয়া যাবে।
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">২. দরিদ্র বা মেধাবী শিক্ষার্থীদের জন্য কি কোনো ছাড় রয়েছে?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              হ্যাঁ, প্রতি শিক্ষাবর্ষের শুরুতে প্রধান শিক্ষক বরাবর আবেদনপত্র জমা দিয়ে মেধা ও আর্থিক অবস্থা বিবেচনায় বেতন পূর্ণ বা আংশিক মওকুফের সুবিধা রয়েছে।
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">৩. এক সাথে কত মাসের বেতন পরিশোধ করা যায়?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              অভিভাবক চাইলে এক মাস থেকে শুরু করে পুরো শিক্ষাবর্ষের (১২ মাস) বেতন একসাথে পরিশোধ করতে পারেন।
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">৪. ভুল নম্বরে টাকা পাঠালে কী করণীয়?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              ভুল এড়াতে উপরের নম্বরগুলো কপি করে ব্যবহার করুন। কোনো অনাকাঙ্ক্ষিত সমস্যা হলে তাৎক্ষণিক বিদ্যালয়ের হিসাব শাখায় যোগাযোগ করার পরামর্শ দেওয়া হলো।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
