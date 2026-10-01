"use client";

import { useState } from "react";
import { Images, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function GalleryClient({ initialGallery, schoolName }: { initialGallery: any[]; schoolName: string }) {
  const gallery = initialGallery || [];
  const [selectedCat, setSelectedCat] = useState("all");
  const [previewImg, setPreviewImg] = useState<any | null>(null);

  const categories = ["all", ...Array.from(new Set(gallery.map((g: any) => g.category || "সাধারণ")))];

  const filtered = selectedCat === "all" ? gallery : gallery.filter((g: any) => (g.category || "সাধারণ") === selectedCat);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
          <Images className="w-3.5 h-3.5 text-rose-600" />
          <span>ক্যাম্পাস চিত্রশালা</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          ফটো গ্যালারি ও চিত্রশালা
        </h1>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          {schoolName}-এর স্মৃতিময় মুহূর্ত, ক্রীড়া প্রতিযোগিতা, সাংস্কৃতিক অনুষ্ঠান ও একাডেমিক কার্যক্রমের ছবির সংকলন।
        </p>
      </div>

      {/* ক্যাটাগরি ফিল্টার */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat: any) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCat === cat 
                ? "bg-rose-600 text-white shadow-sm" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat === "all" ? "সকল ছবি" : cat}
          </button>
        ))}
      </div>

      {/* ছবি গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item: any, idx: number) => {
          const itemImg = (typeof item === "string" ? item : (item.imageUrl || item.url || item.image || "")).trim() || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop";
          const itemTitle = typeof item === "string" ? `ক্যাম্পাস চিত্র ${idx + 1}` : (item.title || "ক্যাম্পাস চিত্র");
          const itemCategory = typeof item === "string" ? "ক্যাম্পাস" : (item.category || "ক্যাম্পাস");

          return (
            <div
              key={item.id || idx}
              onClick={() => setPreviewImg({ ...item, imageUrl: itemImg, title: itemTitle, category: itemCategory })}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
            >
              <img 
                src={itemImg} 
                alt={itemTitle} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] bg-rose-600 font-bold px-2 py-0.5 rounded w-fit mb-1">
                  {itemCategory}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{itemTitle}</h4>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm">
            এই ক্যাটাগরিতে কোনো ছবি পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* ফুলস্ক্রিন প্রিভিউ মডেল */}
      {previewImg && (
        <div 
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              type="button" 
              onClick={() => setPreviewImg(null)} 
              className="absolute -top-12 right-0 text-white hover:text-rose-400 transition cursor-pointer p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={previewImg.imageUrl?.trim() || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop"} 
              alt={previewImg.title || "ছবি প্রিভিউ"} 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop";
              }}
            />
            <div className="mt-4 text-center text-white">
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md mb-2 inline-block">
                {previewImg.category}
              </span>
              <h3 className="text-lg font-bold">{previewImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
