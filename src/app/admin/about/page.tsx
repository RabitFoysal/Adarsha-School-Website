"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Building2, 
  Save, 
  Target, 
  Compass, 
  Image as ImageIcon, 
  CheckCircle2, 
  Info,
  RotateCcw
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageAboutPage() {
  const { data, refreshData } = useAdminData();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // পরিচিতি ফিল্ড স্টেট
  const [title, setTitle] = useState("আমাদের সম্পর্কে");
  const [subtitle, setSubtitle] = useState("সুদীর্ঘ ঐতিহ্য, নৈতিক শিক্ষার আদর্শ ও সার্বিক অগ্রযাত্রার বিস্তারিত বিবরণ");
  const [welcomeHeading, setWelcomeHeading] = useState("স্বাগতম আমাদের প্রাঙ্গণে");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [image, setImage] = useState("");

  // লক্ষ্য (Mission)
  const [missionTitle, setMissionTitle] = useState("আমাদের লক্ষ্য (Our Mission)");
  const [missionText, setMissionText] = useState("");
  const [missionPoint1, setMissionPoint1] = useState("");
  const [missionPoint2, setMissionPoint2] = useState("");
  const [missionPoint3, setMissionPoint3] = useState("");

  // দৃষ্টিভঙ্গি (Vision)
  const [visionTitle, setVisionTitle] = useState("আমাদের দৃষ্টিভঙ্গি (Our Vision)");
  const [visionText, setVisionText] = useState("");
  const [visionPoint1, setVisionPoint1] = useState("");
  const [visionPoint2, setVisionPoint2] = useState("");
  const [visionPoint3, setVisionPoint3] = useState("");

  useEffect(() => {
    const about = data.aboutInfo || {};
    if (about.title) setTitle(about.title);
    if (about.subtitle) setSubtitle(about.subtitle);
    if (about.welcomeHeading) setWelcomeHeading(about.welcomeHeading);
    
    setDescription1(
      about.description1 ||
      about.description ||
      "আমাদের বিদ্যাপীঠ দীর্ঘ সময় ধরে জাতির ভবিষ্যৎ কর্ণধারদের সুশিক্ষায় শিক্ষিত করে গড়ে তুলছে। পুঁথিগত শিক্ষার পাশাপাশি চরিত্র গঠন, নৈতিক মূল্যবোধ ও প্রযুক্তিগত দক্ষতায় আমাদের শিক্ষার্থীরা প্রতিনিয়ত নিজেদের মেধার স্বাক্ষর রেখে চলেছে।"
    );

    setDescription2(
      about.description2 ||
      "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী, ডিজিটাল ক্লাসরুম, সমৃদ্ধ লাইব্রেরি এবং সুপরিসর বিজ্ঞানাগার ও খেলার মাঠের সমন্বয়ে আমরা শিক্ষার্থীদের জন্য একটি আদর্শ একাডেমিক পরিবেশ নিশ্চিত করেছি।"
    );

    setImage(about.image || data?.heroBanner?.image || "");

    setMissionTitle(about.missionTitle || "আমাদের লক্ষ্য (Our Mission)");
    setMissionText(about.missionText || "মানসম্মত যুগোপযোগী শিক্ষা প্রদান, মানবিক গুণাবলীর বিকাশ এবং প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার সর্বোচ্চ বিকাশ ঘটিয়ে একটি জ্ঞানভিত্তিক ও বৈষম্যহীন সুন্দর সমাজ বিনির্মাণ করা।");
    setMissionPoint1(about.missionPoint1 || "ডিজিটাল কারিকুলাম ও আধুনিক বিজ্ঞানমনস্ক পাঠদান");
    setMissionPoint2(about.missionPoint2 || "নৈতিকতা, দেশপ্রেম ও নিয়মানুবর্তিতার সঠিক চর্চা");
    setMissionPoint3(about.missionPoint3 || "সহশিক্ষা কার্যক্রম ও খেলাধুলায় শিক্ষার্থীদের সক্রিয় অংশগ্রহণ");

    setVisionTitle(about.visionTitle || "আমাদের দৃষ্টিভঙ্গি (Our Vision)");
    setVisionText(about.visionText || "একবিংশ শতাব্দীর চ্যালেঞ্জ মোকাবিলায় সক্ষম, সৃজনশীল ও প্রযুক্তিনির্ভর দক্ষ মানবসম্পদ তৈরিতে দেশের অন্যতম শীর্ষস্থানীয় মডেল শিক্ষা প্রতিষ্ঠান হিসেবে আত্মপ্রকাশ করা।");
    setVisionPoint1(about.visionPoint1 || "স্মার্ট ক্লাসরুম ও তথ্যপ্রযুক্তির সর্বজনীন ব্যবহার");
    setVisionPoint2(about.visionPoint2 || "পরীক্ষায় শতভাগ সাফল্য ও মেধার সুষম মূল্যায়ন");
    setVisionPoint3(about.visionPoint3 || "নিরাপদ, পরিচ্ছন্ন ও শিক্ষাবান্ধব ক্যাম্পাস সংস্কৃতি");
  }, [data.aboutInfo, data.heroBanner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      title,
      subtitle,
      welcomeHeading,
      description1,
      description2,
      image,
      missionTitle,
      missionText,
      missionPoint1,
      missionPoint2,
      missionPoint3,
      visionTitle,
      visionText,
      visionPoint1,
      visionPoint2,
      visionPoint3
    };

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("প্রতিষ্ঠান পরিচিতি সফলভাবে সংরক্ষিত ও আপডেট হয়েছে! (ডেমো ডাটা ১০০% রিপ্লেস)");
        refreshData();
      } else {
        setError("সংরক্ষণ ব্যর্থ হয়েছে!");
      }
    } catch {
      setError("নেটওয়ার্ক সংযোগ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-blue-200">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span>পাবলিক পেজ ম্যানেজমেন্ট</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">স্কুল পরিচিতি ও ইতিহাস ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">&quot;/about&quot; পেজের সকল বিবরণ, ক্যাম্পাস ছবি, লক্ষ্য ও দৃষ্টিভঙ্গির প্রতিটি অক্ষর নিয়ন্ত্রণ করুন</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ১. সাধারণ শিরোনাম ও ব্যানার ছবি */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>মূল পরিচিতি ও ক্যাম্পাস ছবি</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পেজের মূল শিরোনাম *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">স্বাগত সাব-হেডিং *</label>
              <input
                type="text"
                required
                value={welcomeHeading}
                onChange={(e) => setWelcomeHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">উপ-শিরোনাম / সংক্ষিপ্ত ভূমিকা</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadInput
                label="ক্যাম্পাস পরিচিতি ছবি (Cover Image)"
                value={image}
                onChange={setImage}
                helpText="কম্পিউটার বা ডিভাইস থেকে বিদ্যালয় ভবনের সুন্দর ল্যান্ডস্কেপ ছবি আপলোড করুন"
              />
            </div>
          </div>
        </div>

        {/* ২. বিস্তারিত পরিচিতি ও ইতিহাস অনুচ্ছেদ */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span>বিস্তারিত ইতিহাস ও একাডেমিক বিবরণ</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">প্রথম অনুচ্ছেদ (ইতিহাস ও আদর্শ) *</label>
            <textarea
              rows={4}
              required
              value={description1}
              onChange={(e) => setDescription1(e.target.value)}
              placeholder="বিদ্যালয়ের ঐতিহ্য, প্রতিষ্ঠা ও মৌলিক লক্ষ্য..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">দ্বিতীয় অনুচ্ছেদ (সুবিধাসমূহ ও পরিবেশ)</label>
            <textarea
              rows={3}
              value={description2}
              onChange={(e) => setDescription2(e.target.value)}
              placeholder="শিক্ষকমণ্ডলী, ডিজিটাল ক্লাসরুম, লাইব্রেরি ও খেলার মাঠ..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>
        </div>

        {/* ৩. লক্ষ্য ও উদ্দেশ্য (Our Mission) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>আমাদের লক্ষ্য (Our Mission)</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">লক্ষ্যের শিরোনাম</label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">লক্ষ্যের মূল বক্তব্য</label>
            <textarea
              rows={2}
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700">প্রধান লক্ষ্য বুলেট পয়েন্টসমূহ</label>
            <input
              type="text"
              value={missionPoint1}
              onChange={(e) => setMissionPoint1(e.target.value)}
              placeholder="পয়েন্ট ১"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={missionPoint2}
              onChange={(e) => setMissionPoint2(e.target.value)}
              placeholder="পয়েন্ট ২"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={missionPoint3}
              onChange={(e) => setMissionPoint3(e.target.value)}
              placeholder="পয়েন্ট ৩"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ৪. আমাদের দৃষ্টিভঙ্গি (Our Vision) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>আমাদের দৃষ্টিভঙ্গি (Our Vision)</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">দৃষ্টিভঙ্গির শিরোনাম</label>
            <input
              type="text"
              value={visionTitle}
              onChange={(e) => setVisionTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">দৃষ্টিভঙ্গির মূল বক্তব্য</label>
            <textarea
              rows={2}
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700">প্রধান দৃষ্টিভঙ্গি বুলেট পয়েন্টসমূহ</label>
            <input
              type="text"
              value={visionPoint1}
              onChange={(e) => setVisionPoint1(e.target.value)}
              placeholder="পয়েন্ট ১"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={visionPoint2}
              onChange={(e) => setVisionPoint2(e.target.value)}
              placeholder="পয়েন্ট ২"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={visionPoint3}
              onChange={(e) => setVisionPoint3(e.target.value)}
              placeholder="পয়েন্ট ৩"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* সাবমিট বোতাম */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-2xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "সংরক্ষণ হচ্ছে..." : "পরিচিতির সকল তথ্য সংরক্ষণ করুন (Save All)"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
