"use client";

import { useState, useEffect } from "react";

type MediaData = {
  banners: string[];
  teachers: string[];
  messages: string[];
  gallery: string[];
};

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaData>({ banners: [], teachers: [], messages: [], gallery: [] });
  const [activeTab, setActiveTab] = useState<keyof MediaData>("gallery");
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchMedia = async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data);

    // স্লাইডারের কারেন্ট লিস্ট আনা
    const infoRes = await fetch("/api/school-info");
    if (infoRes.ok) {
      // আমরা school-info API টি মডিফাই করব যেন স্লাইডারের ডেটাও আসে
      const resData = await fetch("/api/teachers"); // অথবা সরাসরি ডাটা পড়া
    }
  };

  const fetchSliderData = async () => {
    const res = await fetch("/api/school-info"); // যেহেতু school-info পুরোটা দেয় না, আমরা ডাটা রিড করব
    const infoRes = await fetch("/api/layout-config"); // অথবা ডাইনামিক
    // ডেমোডাটা সরাসরি পড়তে নিচের ট্রিকটি করছি
    const req = await fetch("/api/school-info");
    const sData = await fetch("/api/teachers"); // স্লাইডার লিস্ট আনার জন্য
  };

  useEffect(() => {
    fetchMedia();
    // স্লাইডার লিস্ট রিড করা
    const getSliderList = async () => {
      const res = await fetch("/api/school-info");
      // JSON থেকে গ্যালারি নিয়ে আসা
      const response = await fetch("/api/media"); // ডেমো ট্রিক
    };
    // ডাইনামিক স্লাইডার লিস্ট লোড করতে
    const loadSlider = async () => {
      const res = await fetch("/api/school-info"); // dummy call to sync
    };
    
    // স্লাইডারের জন্য ডেমোডাটা থেকে সরাসরি এরে রিড করা
    const loadConfig = async () => {
      const res = await fetch("/api/school-info");
      // we will fetch demoData.json directly using our API
    };
    fetch("/api/school-info")
      .then(r => r.json())
      .then(() => {
        // demoData fetch
      });
  }, []);

  useEffect(() => {
    // স্লাইডার ডাটা লোড করার জন্য school-info মডিফাই করা হবে পরবর্তী ধাপে, আপাতত
    const fetchSliderList = async () => {
      const res = await fetch("/api/school-info");
      // custom fetch
    };
  }, []);

  // ছবি আপলোড হ্যান্ডলার
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/upload?category=${activeTab}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      } else {
        alert("আপলোড ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      alert("সমস্যা হয়েছে!");
    } finally {
      setUploading(false);
    }
  };

  // ছবি ডিলিট হ্যান্ডলার
  const handleDelete = async (path: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই ছবিটি সার্ভার থেকে ডিলিট করতে চান?")) return;

    const res = await fetch(`/api/media?path=${encodeURIComponent(path)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // স্লাইডার থেকেও রিমুভ করা
      await handleSliderToggle(path, "remove");
      fetchMedia();
    }
  };

  // স্লাইডারে অন/অফ করার হ্যান্ডলার
  const handleSliderToggle = async (path: string, action: "add" | "remove") => {
    await fetch("/api/gallery-slider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, path }),
    });
    // স্লাইডার ইমেজ রিলোড করার ডেমো
    alert(action === "add" ? "স্লাইডারে যুক্ত হয়েছে!" : "স্লাইডার থেকে বাদ দেওয়া হয়েছে!");
  };

  // ছবির লিঙ্ক কপি করার ফাংশন
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopySuccess(link);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">মিডিয়া লাইব্রেরি</h1>

      {/* ট্যাব সমূহ */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {(["gallery", "banners", "teachers", "messages"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-4 font-bold text-sm transition ${activeTab === tab ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
          >
            {tab === "gallery" && "🖼️ ফটো গ্যালারি স্লাইডার"}
            {tab === "banners" && "🌄 হিরো ব্যানার"}
            {tab === "teachers" && "👨‍🏫 শিক্ষকবৃন্দ"}
            {tab === "messages" && "💬 বিদ্যালয় বাণী"}
          </button>
        ))}
      </div>

      {/* আপলোড এরিয়া */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          সরাসরি <span className="text-blue-600">[{activeTab}]</span> ফোল্ডারে আপলোড করুন
        </h3>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={handleUpload}
          className="px-3 py-2 border rounded bg-white text-gray-900 cursor-pointer"
        />
        {uploading && <p className="text-sm text-blue-600 mt-2 animate-pulse">ছবি আপলোড হচ্ছে...</p>}
      </div>

      {/* ছবির গ্রিড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {media[activeTab]?.map((path) => (
          <div key={path} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <img src={path} alt="Media" className="w-full h-40 object-cover" />
            
            <div className="p-4 space-y-2">
              <p className="text-xs text-gray-500 truncate" title={path}>{path}</p>
              
              <div className="flex gap-2 justify-between">
                {/* লিঙ্ক কপি বাটন */}
                <button
                  onClick={() => handleCopyLink(path)}
                  className={`text-xs px-2.5 py-1.5 rounded font-bold transition flex-1 text-center ${copySuccess === path ? "bg-green-100 text-green-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                >
                  {copySuccess === path ? "অনুলিপি সম্পন্ন!" : "লিঙ্ক কপি করুন"}
                </button>

                {/* ডিলিট বাটন */}
                <button
                  onClick={() => handleDelete(path)}
                  className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded font-bold transition"
                >
                  ডিলিট
                </button>
              </div>

              {/* শুধুমাত্র ফটো গ্যালারি ট্যাবের জন্য স্লাইডার কন্ট্রোল */}
              {activeTab === "gallery" && (
                <div className="pt-2 border-t flex justify-around gap-2">
                  <button
                    onClick={() => handleSliderToggle(path, "add")}
                    className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-100"
                  >
                    📥 স্লাইডারে দিন
                  </button>
                  <button
                    onClick={() => handleSliderToggle(path, "remove")}
                    className="text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-100"
                  >
                    ❌ স্লাইডার থেকে সরান
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {media[activeTab]?.length === 0 && (
          <p className="col-span-full text-center py-12 text-gray-500">এই ফোল্ডারে কোনো ছবি নেই।</p>
        )}
      </div>
    </div>
  );
}