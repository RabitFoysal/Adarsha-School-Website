"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, Save, CheckCircle2, Image as ImageIcon } from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageLayoutPage() {
  const { data, refreshData } = useAdminData();
  const [layoutConfig, setLayoutConfig] = useState<any[]>([]);
  const [sidebarImage, setSidebarImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const defaultSections = [
    { id: "news_ticker", name: "স্ক্রলিং জরুরি খবর (News Ticker)", active: true },
    { id: "banner", name: "হিরো ব্যানার সেকশন", active: true },
    { id: "stats_counter", name: "পরিসংখ্যান কাউন্টার", active: true },
    { id: "info_directory", name: "তথ্য ও সেবা ডিরেক্টরি", active: true },
    { id: "notices", name: "নোটিশ বোর্ড", active: true },
    { id: "messages", name: "বিদ্যালয় বাণী", active: true },
    { id: "leadership_dignitaries", name: "নেতৃত্ব ও দিকনির্দেশনা (সভাপতি, প্রধান শিক্ষক ও বিশিষ্ট ব্যক্তিবর্গ)", active: true },
    { id: "alumni", name: "কৃতি শিক্ষার্থী ও অ্যালামনাই নেটওয়ার্ক (Alumni & Hall of Fame)", active: true },
    { id: "gallery_slider", name: "ক্যাম্পাস চিত্রশালা স্লাইডার", active: true },
    { id: "blog_section", name: "ব্লগ ও অনুচ্ছেদ", active: true },
    { id: "teachers", name: "সম্মানিত শিক্ষকবৃন্দ", active: true },
    { id: "sidebar_links", name: "সাইডবার: গুরুত্বপূর্ণ লিঙ্ক", active: true },
    { id: "sidebar_helpline", name: "সাইডবার: হেল্পলাইন উইজেট", active: true },
    { id: "sidebar_image", name: "সাইডবার: ফটো ব্যানার", active: true },
  ];

  useEffect(() => {
    if (data.layoutConfig && data.layoutConfig.length > 0) {
      const currentList = [...data.layoutConfig];
      defaultSections.forEach((ds) => {
        if (!currentList.some((s) => s.id === ds.id)) {
          currentList.push(ds);
        }
      });
      setLayoutConfig(currentList);
    } else {
      setLayoutConfig(defaultSections);
    }
    if (data.sidebarImage) {
      setSidebarImage(data.sidebarImage);
    }
  }, [data.layoutConfig, data.sidebarImage]);

  const toggleSection = (idx: number) => {
    const updated = [...layoutConfig];
    updated[idx].active = !updated[idx].active;
    setLayoutConfig(updated);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...layoutConfig];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setLayoutConfig(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === layoutConfig.length - 1) return;
    const updated = [...layoutConfig];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setLayoutConfig(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/layout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutConfig, sidebarImage }),
      });

      if (res.ok) {
        setMessage("হোমপেজ লেআউট ও সাইডবার ফটো ব্যানার সফলভাবে সংরক্ষিত হয়েছে!");
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">হোমপেজ লেআউট ও সেকশন কন্ট্রোল</h1>
          <p className="text-xs text-slate-500 mt-1">হোমপেজের সেকশনগুলোর অবস্থান সাজান এবং প্রয়োজন অনুযায়ী অন/অফ করুন</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>লেআউট সংরক্ষণ করুন</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {layoutConfig.map((sec, idx) => (
          <div key={sec.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{sec.name}</h4>
                <span className={`text-[11px] font-semibold ${sec.active ? "text-emerald-600" : "text-slate-400"}`}>
                  {sec.active ? "সক্রিয় রয়েছে" : "লুকানো রয়েছে"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="উপরে নিন"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(idx)}
                disabled={idx === layoutConfig.length - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="নিচে নিন"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleSection(idx)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  sec.active ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-400"
                }`}
                title={sec.active ? "লুকান" : "দেখিয়ে দিন"}
              >
                {sec.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* সাইডবার ফটো ব্যানার আপলোড বক্স */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">হোমপেজ সাইডবার ফটো ব্যানার</h3>
            <p className="text-xs text-slate-500">হোমপেজের ডান পাশের সাইডবারে প্রদর্শিত ফটো ব্যানার ছবি</p>
          </div>
        </div>

        <ImageUploadInput
          label="সাইডবার ব্যানার ছবি"
          value={sidebarImage}
          onChange={setSidebarImage}
          placeholder="কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন অথবা লিঙ্ক দিন"
          helpText="সাইডবারে আকর্ষণীয়ভাবে দেখানোর জন্য স্পষ্ট ও ভার্টিক্যাল/ল্যান্ডস্কেপ ছবি আপলোড করুন"
        />

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>ছবি ও সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
