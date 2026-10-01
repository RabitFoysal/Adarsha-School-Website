"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Images, Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageGalleryPage() {
  const { data, refreshData } = useAdminData();
  const [gallery, setGallery] = useState<any[]>(data.gallery || []);
  const [sliderActive, setSliderActive] = useState<boolean>(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("ক্যাম্পাস");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.gallery) {
      setGallery(data.gallery);
    }
    const sliderConfig = data.layoutConfig?.find((c: any) => c.id === "gallery_slider");
    if (sliderConfig) {
      setSliderActive(sliderConfig.active !== false);
    }
  }, [data.gallery, data.layoutConfig]);

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setTitle(item.title);
    setImageUrl(item.imageUrl);
    setCategory(item.category || "ক্যাম্পাস");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setImageUrl("");
    setCategory("ক্যাম্পাস");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let updatedList: any[];
    if (editId) {
      updatedList = gallery.map((g) => (g.id === editId ? { ...g, title, imageUrl, category } : g));
    } else {
      updatedList = [{ id: Date.now(), title, imageUrl, category }, ...gallery];
    }

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery: updatedList,
          sliderActive,
        }),
      });

      if (res.ok) {
        setMessage(editId ? "ছবি সফলভাবে আপডেট হয়েছে!" : "নতুন ছবি যুক্ত হয়েছে!");
        handleCancel();
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান?")) return;

    const updatedList = gallery.filter((g) => g.id !== id);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gallery: updatedList,
          sliderActive,
        }),
      });

      if (res.ok) {
        setMessage("ছবি মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {
      setMessage("মুছে ফেলতে ব্যর্থ হয়েছে!");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleToggleSlider = async () => {
    const nextState = !sliderActive;
    setSliderActive(nextState);

    try {
      await fetch("/api/gallery-slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: nextState }),
      });
      refreshData();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">ক্যাম্পাস চিত্রশালা ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500 mt-1">ফটো গ্যালারির ছবি যোগ করুন ও হোমপেজ স্লাইডার নিয়ন্ত্রণ করুন</p>
        </div>

        {/* হোমপেজ স্লাইডার টগল */}
        <button
          type="button"
          onClick={handleToggleSlider}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
            sliderActive 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          {sliderActive ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
          <span>হোমপেজ স্লাইডার: {sliderActive ? "সক্রিয়" : "বন্ধ"}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          {message}
        </div>
      )}

      {/* ছবি যোগ/এডিট ফর্ম */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-rose-600" /> : <Plus className="w-4 h-4 text-rose-600" />}
          <span>{editId ? "ছবির বিবরণ সম্পাদনা করুন" : "চিত্রশালায় নতুন ছবি যোগ করুন"}</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ছবির শিরোনাম *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: বিদ্যালয়ের বিজ্ঞান মেলা ২০২৬"
            className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-600 outline-none"
          />
        </div>

        <ImageUploadInput
          label="চিত্রশালার ছবি"
          value={imageUrl}
          onChange={setImageUrl}
          required={true}
          helpText="কম্পিউটার বা মোবাইল থেকে ছবি বেছে নিন (JPG, PNG, WebP)"
        />

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="যেমন: ক্যাম্পাস / ক্রীড়া / সাংস্কৃতিক"
            className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "ছবি যুক্ত করুন"}</span>
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>বাতিল</span>
            </button>
          )}
        </div>
      </form>

      {/* চিত্রশালা গ্রিড */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">সকল সংরক্ষিত ছবি ({gallery.length}টি)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item: any) => (
            <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="relative aspect-video bg-slate-100">
                <img 
                  src={(item.imageUrl && item.imageUrl.trim()) || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop"} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category || "ক্যাম্পাস"}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-800 line-clamp-1">{item.title}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {gallery.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              চিত্রশালায় কোনো ছবি যুক্ত করা হয়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
