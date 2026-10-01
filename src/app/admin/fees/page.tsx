"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle 
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

export default function ManageFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [pm, setPm] = useState<PaymentMethods>({
    bkashNumber: "",
    bkashType: "মার্চেন্ট (পেমেন্ট)",
    nagadNumber: "",
    nagadType: "মার্চেন্ট (পেমেন্ট)",
    rocketNumber: "",
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankBranch: "",
    bankRouting: "",
    feeNotice: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchFeesData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fees");
      if (res.ok) {
        const data = await res.json();
        setFees(data.feeStructure || []);
        if (data.paymentMethods) {
          setPm(data.paymentMethods);
        }
      }
    } catch {
      setMessage("ডাটা লোড করতে সমস্যা হয়েছে!");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeesData();
  }, []);

  const handleFeeChange = (index: number, field: keyof FeeItem, value: string) => {
    const updated = [...fees];
    updated[index] = { ...updated[index], [field]: value };
    setFees(updated);
  };

  const handleAddFeeRow = () => {
    const newRow: FeeItem = {
      id: Date.now(),
      grade: "নতুন শ্রেণি",
      admissionFee: "১,০০০/-",
      sessionFee: "১,০০০/-",
      monthlyTuition: "৭০০/-",
      examFee: "৪০০/-",
      remarks: ""
    };
    setFees([...fees, newRow]);
  };

  const handleDeleteFeeRow = (index: number) => {
    const updated = fees.filter((_, i) => i !== index);
    setFees(updated);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeStructure: fees,
          paymentMethods: pm
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("সকল ফি ও পেমেন্ট তথ্য সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
      } else {
        setMessage(data.error || "সংরক্ষণ করতে সমস্যা হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
      setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              টিউশন ফি ও ডিজিটাল পেমেন্ট সেটিংস
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            শ্রেণিভিত্তিক ফি চার্ট, মোবাইল ব্যাংকিং নম্বর এবং ব্যাংক অ্যাকাউন্ট বিবরণী আপডেট করুন।
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-sm transition cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সকল পরিবর্তন সংরক্ষণ করুন"}</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          isError ? "bg-rose-50 border border-rose-200 text-rose-700" : "bg-emerald-50 border border-emerald-200 text-emerald-800"
        }`}>
          {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      {/* ১. শ্রেণিভিত্তিক ফি তালিকা টেবিল */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">শ্রেণিভিত্তিক ফি কাঠামো চার্ট</h2>
            <p className="text-xs text-slate-500">প্রতিটি শ্রেণির নির্ধারিত ফি ও মাসিক বেতনের পরিমাণ</p>
          </div>
          <button
            type="button"
            onClick={handleAddFeeRow}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শ্রেণি যুক্ত করুন</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b text-left">
              <tr>
                <th className="p-3">শ্রেণি</th>
                <th className="p-3">ভর্তি ফি</th>
                <th className="p-3">সেশন ফি</th>
                <th className="p-3">মাসিক বেতন</th>
                <th className="p-3">পরীক্ষা ফি</th>
                <th className="p-3">মন্তব্য (ঐচ্ছিক)</th>
                <th className="p-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => handleFeeChange(idx, "grade", e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.admissionFee}
                      onChange={(e) => handleFeeChange(idx, "admissionFee", e.target.value)}
                      className="w-24 p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.sessionFee}
                      onChange={(e) => handleFeeChange(idx, "sessionFee", e.target.value)}
                      className="w-24 p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.monthlyTuition}
                      onChange={(e) => handleFeeChange(idx, "monthlyTuition", e.target.value)}
                      className="w-24 p-2 rounded-lg border border-slate-200 text-xs font-semibold text-blue-700"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.examFee}
                      onChange={(e) => handleFeeChange(idx, "examFee", e.target.value)}
                      className="w-24 p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.remarks || ""}
                      onChange={(e) => handleFeeChange(idx, "remarks", e.target.value)}
                      placeholder="যেমন: বিজ্ঞান শাখা"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteFeeRow(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ২. মোবাইল ব্যাংকিং নম্বর সেটিংস */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Smartphone className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">মোবাইল ব্যাংকিং অ্যাকাউন্ট নম্বর</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বিকাশ (bKash) নম্বর</label>
            <input
              type="text"
              value={pm.bkashNumber || ""}
              onChange={(e) => setPm({ ...pm, bkashNumber: e.target.value })}
              placeholder="01700-000000"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">নগদ (Nagad) নম্বর</label>
            <input
              type="text"
              value={pm.nagadNumber || ""}
              onChange={(e) => setPm({ ...pm, nagadNumber: e.target.value })}
              placeholder="01800-000000"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">রকেট (Rocket) নম্বর / বিলার আইডি</label>
            <input
              type="text"
              value={pm.rocketNumber || ""}
              onChange={(e) => setPm({ ...pm, rocketNumber: e.target.value })}
              placeholder="01900-000000"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* ৩. ব্যাংক অ্যাকাউন্ট সেটিংস */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">অফিসিয়াল ব্যাংক অ্যাকাউন্ট বিবরণী</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ব্যাংকের নাম</label>
            <input
              type="text"
              value={pm.bankName || ""}
              onChange={(e) => setPm({ ...pm, bankName: e.target.value })}
              placeholder="যেমন: সোনালী ব্যাংক পিএলসি"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">হিসাবের নাম (Account Name)</label>
            <input
              type="text"
              value={pm.bankAccountName || ""}
              onChange={(e) => setPm({ ...pm, bankAccountName: e.target.value })}
              placeholder="যেমন: আদর্শ উচ্চ বিদ্যালয় সাধারণ তহবিল"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">হিসাব নম্বর (Account Number)</label>
            <input
              type="text"
              value={pm.bankAccountNumber || ""}
              onChange={(e) => setPm({ ...pm, bankAccountNumber: e.target.value })}
              placeholder="যেমন: 4401234567890"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শাখার নাম (Branch)</label>
            <input
              type="text"
              value={pm.bankBranch || ""}
              onChange={(e) => setPm({ ...pm, bankBranch: e.target.value })}
              placeholder="যেমন: প্রধান শাখা, ঢাকা"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ফি সংক্রান্ত জরুরি নোটিশ / নিয়মাবলী</label>
          <textarea
            rows={2}
            value={pm.feeNotice || ""}
            onChange={(e) => setPm({ ...pm, feeNotice: e.target.value })}
            placeholder="বেতন প্রদানের নির্ধারিত তারিখ ও নিয়ম..."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
