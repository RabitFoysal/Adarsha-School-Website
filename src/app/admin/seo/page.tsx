"use client";

import React, { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import ImageUploadInput from "@/components/ImageUploadInput";
import { 
  Search, 
  Sparkles, 
  Globe, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ExternalLink,
  ShieldCheck,
  Eye,
  Smartphone,
  Monitor
} from "lucide-react";

export default function SeoSettingsPage() {
  const { data, refreshData } = useAdminData();

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [googleVerification, setGoogleVerification] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Load existing SEO settings or set smart defaults
  useEffect(() => {
    if (data) {
      const seo = data.seoSettings || {};
      const schoolName = data.schoolInfo?.name || "আদর্শ উচ্চ বিদ্যালয় ও কলেজ";
      const slogan = data.schoolInfo?.slogan || "নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে আদর্শ নাগরিক গড়ার প্রত্যয়";
      const eiin = data.schoolInfo?.eiin || "108420";
      const address = data.schoolInfo?.contact?.address || "ঢাকা, বাংলাদেশ";
      const banner = data.heroBanner?.image || data.schoolInfo?.logo || "";

      setMetaTitle(seo.metaTitle || `${schoolName} | অফিসিয়াল ওয়েবসাইট ও ভর্তি তথ্য`);
      setMetaDescription(
        seo.metaDescription || 
        `${schoolName} (EIIN: ${eiin}, ${address}) এর অফিশিয়াল ওয়েবসাইটে স্বাগতম। ভর্তি বিজ্ঞপ্তি, নোটিশ বোর্ড, রেজাল্ট ও পরীক্ষা সংক্রান্ত সকল তথ্যাদি জেনে নিন।`
      );
      setKeywords(
        seo.keywords || 
        `${schoolName}, স্কুল ভর্তি ২০২৬, EIIN ${eiin}, নোটিশ বোর্ড, পরীক্ষার রুটিন, ফলাফল, ${address}`
      );
      setOgImage(seo.ogImage || banner);
      setGoogleVerification(seo.googleVerification || "");
      setCanonicalUrl(seo.canonicalUrl || "");
      setRobotsIndex(seo.robotsIndex !== false);
      setRobotsFollow(seo.robotsFollow !== false);
    }
  }, [data]);

  // One-Click Smart SEO Generator
  const handleAutoGenerateSeo = () => {
    const schoolName = data.schoolInfo?.name || "আদর্শ উচ্চ বিদ্যালয় ও কলেজ";
    const slogan = data.schoolInfo?.slogan || "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ";
    const eiin = data.schoolInfo?.eiin || "";
    const address = data.schoolInfo?.contact?.address || "বাংলাদেশ";
    const banner = data.heroBanner?.image || data.schoolInfo?.logo || "";

    const smartTitle = `${schoolName} – অফিসিয়াল ওয়েবসাইট ${eiin ? `(EIIN: ${eiin})` : ""}`;
    const smartDescription = `${schoolName} (${address}) এর দাপ্তরিক পোর্টাল। ২০২৬ শিক্ষাবর্ষের ভর্তি তথ্য, পরীক্ষার ফলাফল, একাডেমিক রুটিন, নোটিশ বোর্ড এবং শিক্ষক পরিচিতি জানুন।`;
    const smartKeywords = `${schoolName}, স্কুল ভর্তি ২০২৬, ${eiin ? `EIIN ${eiin}, ` : ""}নোটিশ বোর্ড, ফলাফল, শিক্ষক তালিকা, সেরা স্কুল ${address}`;

    setMetaTitle(smartTitle.slice(0, 65));
    setMetaDescription(smartDescription.slice(0, 160));
    setKeywords(smartKeywords);
    if (!ogImage && banner) setOgImage(banner);

    setMessage("সর্বোচ্চ র্যাংকিং উপযোগী এসইও টাইটেল ও মেটা ডাটা স্বয়ংক্রিয়ভাবে তৈরি হয়েছে!");
    setIsError(false);
    setTimeout(() => setMessage(""), 4000);
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seoSettings: {
            metaTitle: metaTitle.trim(),
            metaDescription: metaDescription.trim(),
            keywords: keywords.trim(),
            ogImage: ogImage.trim(),
            googleVerification: googleVerification.trim(),
            canonicalUrl: canonicalUrl.trim(),
            robotsIndex,
            robotsFollow,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setMessage(resData.message || "এসইও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        refreshData();
      } else {
        setMessage(resData.message || "সংরক্ষণ ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন!");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // SEO Health Score Calculation
  const calculateSeoScore = () => {
    let score = 0;
    if (metaTitle.length >= 35 && metaTitle.length <= 65) score += 25;
    else if (metaTitle.length > 0) score += 12;

    if (metaDescription.length >= 110 && metaDescription.length <= 165) score += 30;
    else if (metaDescription.length > 0) score += 15;

    if (keywords.split(",").length >= 3) score += 15;
    if (ogImage) score += 15;
    if (googleVerification) score += 15;
    return Math.min(score, 100);
  };

  const seoScore = calculateSeoScore();

  return (
    <div className="space-y-8 pb-12">
      {/* হেডার */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>এসইও অপ্টিমাইজেশন অ্যান্ড সার্চ কনসোল হাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            এসইও (SEO) সেটিংস ও সার্চ ইঞ্জিন র‍্যাংকিং
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            গুগল (Google), বিং (Bing) ও সোশ্যাল মিডিয়ায় আপনার স্কুলের ওয়েবসাইটকে ১ নম্বরে রাখুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAutoGenerateSeo}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>স্বয়ংক্রিয় বেস্ট এসইও জেনারেট</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border transition ${
            isError
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* এসইও স্কোর ও রিয়েল-টাইম গুগল প্রিভিউ গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* বাম পাশ: এসইও স্কোর ও চেকলিস্ট */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">এসইও স্কোর</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black ${
                seoScore >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : seoScore >= 50
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {seoScore}/১০০ ({seoScore >= 80 ? "চমৎকার" : seoScore >= 50 ? "উন্নতি প্রয়োজন" : "দুর্বল"})
            </span>
          </div>

          {/* প্রগ্রেস বার */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                seoScore >= 80
                  ? "bg-emerald-500"
                  : seoScore >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${seoScore}%` }}
            />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  metaTitle.length >= 35 && metaTitle.length <= 65
                    ? "text-emerald-500"
                    : "text-slate-300"
                }`}
              />
              <span className="text-slate-600">
                মেটা টাইটেল ৫০-৬৫ অক্ষরের মধ্যে আদর্শ ({metaTitle.length} অক্ষর)
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  metaDescription.length >= 110 && metaDescription.length <= 165
                    ? "text-emerald-500"
                    : "text-slate-300"
                }`}
              />
              <span className="text-slate-600">
                মেটা ডেসক্রিপশন ১২০-১৬০ অক্ষরের মধ্যে আদর্শ ({metaDescription.length} অক্ষর)
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  keywords.split(",").length >= 3 ? "text-emerald-500" : "text-slate-300"
                }`}
              />
              <span className="text-slate-600">সার্চ কিওয়ার্ড ও ট্যাগ যুক্ত আছে</span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  ogImage ? "text-emerald-500" : "text-slate-300"
                }`}
              />
              <span className="text-slate-600">সোশ্যাল মিডিয়া শেয়ারিং ইমেজ (OG Image) যুক্ত</span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  googleVerification ? "text-emerald-500" : "text-slate-300"
                }`}
              />
              <span className="text-slate-600">গুগল সার্চ কনসোল ভেরিফিকেশন কোড সক্রিয়</span>
            </div>
          </div>
        </div>

        {/* ডান পাশ: গুগল সার্চ রেজাল্ট লাইভ প্রিভিউ */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>গুগল সার্চ ফলাফল প্রিভিউ (Live Google Search Preview)</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  previewDevice === "desktop"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>ডেস্কটপ</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  previewDevice === "mobile"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>মোবাইল</span>
              </button>
            </div>
          </div>

          {/* গুগল সার্চ রেজাল্ট কার্ড */}
          <div
            className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 transition-all ${
              previewDevice === "mobile" ? "max-w-sm mx-auto shadow-sm" : ""
            }`}
          >
            {/* সাইট ও ফেভিকন */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={data.schoolInfo?.logo || "/favicon.ico"}
                  alt="Favicon"
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/favicon.ico";
                  }}
                />
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="text-[12px] font-bold text-slate-800 truncate">
                  {data.schoolInfo?.name || "স্কুল ওয়েবসাইট"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {canonicalUrl || "https://your-school.vercel.app"}
                </p>
              </div>
            </div>

            {/* গুগল টাইটেল */}
            <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1 mt-1">
              {metaTitle || "বিদ্যালয় ম্যানেজমেন্ট সিস্টেম"}
            </h3>

            {/* গুগল বর্ণনা */}
            <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed line-clamp-2 mt-1">
              {metaDescription ||
                "বিদ্যালয়ের তথ্য, ভর্তি বিজ্ঞপ্তি, পরীক্ষার ফলাফল ও নোটিশ বোর্ড সংক্রান্ত বিস্তারিত।"}
            </p>
          </div>

          {/* সোশ্যাল মিডিয়া কার্ড প্রিভিউ */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Share2 className="w-3 h-3 text-indigo-600" />
              <span>সোশ্যাল মিডিয়া শেয়ারিং প্রিভিউ (Facebook / WhatsApp)</span>
            </span>
            <div className="rounded-xl overflow-hidden border border-slate-300 bg-white max-w-md shadow-xs">
              {ogImage && (
                <div className="w-full h-36 bg-slate-100 overflow-hidden">
                  <img src={ogImage} alt="OG Card" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  {new URL(canonicalUrl || "https://school.vercel.app").hostname}
                </p>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {metaTitle}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* এসইও এডিট ফর্ম */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6"
      >
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>মেটাডাটা ও সার্চ ইঞ্জিন কনফিগারেশন ফরম</span>
        </h2>

        {/* মেটা টাইটেল */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              সার্চ ইঞ্জিন মেটা টাইটেল (Meta Title) *
            </label>
            <span
              className={`text-[11px] font-bold ${
                metaTitle.length > 65
                  ? "text-rose-600"
                  : metaTitle.length >= 40
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              {metaTitle.length}/৬৫ অক্ষর (৫০-৬০ অক্ষর সেরা)
            </span>
          </div>
          <input
            type="text"
            required
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="যেমন: আদর্শ উচ্চ বিদ্যালয় ও কলেজ | ভর্তি বিজ্ঞপ্তি ও অফিশিয়াল পোর্টাল"
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            গুগল সার্চের শিরোনামে এটি সবার আগে দৃশ্যমান হয়। স্কুলের পূর্ণ নাম ও মূল বিষয় যুক্ত রাখুন।
          </p>
        </div>

        {/* মেটা ডেসক্রিপশন */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              সার্চ ইঞ্জিন মেটা বর্ণনা (Meta Description) *
            </label>
            <span
              className={`text-[11px] font-bold ${
                metaDescription.length > 165
                  ? "text-rose-600"
                  : metaDescription.length >= 110
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              {metaDescription.length}/১৬০ অক্ষর (১২০-১৬০ অক্ষর সেরা)
            </span>
          </div>
          <textarea
            rows={3}
            required
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="যেমন: আদর্শ উচ্চ বিদ্যালয় ও কলেজ (EIIN: 108420, মিরপুর, ঢাকা) এর অফিশিয়াল ওয়েবসাইট..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            সার্চের নিচে প্রদর্শিত সংক্ষিপ্ত অনুচ্ছেদ। এটি ইউজারদের আপনার সাইটে ক্লিক করতে উৎসাহিত করে।
          </p>
        </div>

        {/* কিওয়ার্ডস */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            সার্চ কিওয়ার্ডস ও ট্যাগ (Keywords - কমা দিয়ে লিখুন)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="যেমন: আদর্শ স্কুল, স্কুল ভর্তি ২০২৬, EIIN 108420, পরীক্ষার নোটিশ, ঢাকা"
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            প্রতিটি কিওয়ার্ড বা বাক্যের পর কমা (,) ব্যবহার করুন।
          </p>
        </div>

        {/* সোশ্যাল শেয়ারিং ইমেজ */}
        <div className="border-t border-slate-100 pt-5">
          <ImageUploadInput
            label="সোশ্যাল মিডিয়া শেয়ারিং ইমেজ (OpenGraph Image)"
            value={ogImage}
            onChange={setOgImage}
            helpText="ফেসবুক, টুইটার বা হোয়াটসঅ্যাপে সাইটের লিংক শেয়ার করলে এই ছবিটি প্রিভিউ হিসেবে আসবে (১২০০x৬৩০ সাইজ সবচেয়ে ভালো)"
          />
        </div>

        {/* গুগল সার্চ কনসোল ও ক্যানোনিকাল লিংক */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              গুগল সার্চ কনসোল ভেরিফিকেশন কোড (Google Site Verification)
            </label>
            <input
              type="text"
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
              placeholder="যেমন: abc123XYZ... (HTML tag থেকে content অংশটুকু)"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Google Search Console-এ সাইট সহজে ভেরিফাই করতে এই কোডটি দিন।
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              সাইট ক্যানোনিকাল URL (Canonical URL - ঐচ্ছিক)
            </label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://myschool.edu.bd"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              কাস্টম ডোমেইন যুক্ত থাকলে তার মূল URL দিন (না দিলে স্বয়ংক্রিয়ভাবে বর্তমান URL ব্যবহৃত হবে)।
            </p>
          </div>
        </div>

        {/* রোবটস ইনডেক্সিং কন্ট্রোল */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            রোবটস ইনডেক্সিং সেটিংস (Search Engine Crawlers)
          </label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={robotsIndex}
                onChange={(e) => setRobotsIndex(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>গুগল সার্চ ইঞ্জিনে সাইট ইনডেক্স করার অনুমতি দিন (Index)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={robotsFollow}
                onChange={(e) => setRobotsFollow(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>সাইটের ভেতরের লিংকগুলো ক্রলারকে অনুসরণ করতে দিন (Follow)</span>
            </label>
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-xs sm:text-sm transition duration-200 shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "সংরক্ষণ করা হচ্ছে..." : "এসইও সেটিংস সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
