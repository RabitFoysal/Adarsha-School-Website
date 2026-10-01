"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Link as LinkIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ExternalLink, 
  PhoneCall, 
  Image as ImageIcon, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageLinksPage() {
  const { data, refreshData } = useAdminData();
  const [activeTab, setActiveTab] = useState<"links" | "hotlines" | "banner">("links");

  // ১. গুরুত্বপূর্ণ লিংক স্টেট
  const [links, setLinks] = useState<any[]>(data.importantLinks || []);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [editLinkId, setEditLinkId] = useState<number | null>(null);

  // ২. সরকারি হটলাইন স্টেট
  const [hotlines, setHotlines] = useState<any[]>(data.hotlines || []);
  const [hotlineName, setHotlineName] = useState("");
  const [hotlineNumber, setHotlineNumber] = useState("");
  const [editHotlineId, setEditHotlineId] = useState<number | null>(null);

  // ৩. সাইডবার ফটো ব্যানার স্টেট
  const [sidebarImage, setSidebarImage] = useState(data.sidebarImage || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.importantLinks) setLinks(data.importantLinks);
    if (data.hotlines) setHotlines(data.hotlines);
    if (data.sidebarImage) setSidebarImage(data.sidebarImage);
  }, [data.importantLinks, data.hotlines, data.sidebarImage]);

  // লিঙ্ক হ্যান্ডলার
  const handleEditLink = (l: any) => {
    setEditLinkId(l.id);
    setLinkTitle(l.title);
    setLinkUrl(l.url);
  };

  const handleCancelLink = () => {
    setEditLinkId(null);
    setLinkTitle("");
    setLinkUrl("");
  };

  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let updated: any[];
    if (editLinkId) {
      updated = links.map((l) => (l.id === editLinkId ? { ...l, title: linkTitle, url: linkUrl } : l));
    } else {
      updated = [...links, { id: Date.now(), title: linkTitle, url: linkUrl }];
    }

    try {
      const res = await fetch("/api/important-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: updated }),
      });
      if (res.ok) {
        setMessage(editLinkId ? "লিঙ্ক আপডেট হয়েছে!" : "নতুন লিঙ্ক যুক্ত হয়েছে!");
        handleCancelLink();
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই লিঙ্কটি মুছে ফেলতে চান?")) return;
    const updated = links.filter((l) => l.id !== id);
    try {
      const res = await fetch("/api/important-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: updated }),
      });
      if (res.ok) {
        setMessage("লিঙ্ক মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  // হটলাইন হ্যান্ডলার
  const handleEditHotline = (h: any) => {
    setEditHotlineId(h.id);
    setHotlineName(h.name);
    setHotlineNumber(h.number);
  };

  const handleCancelHotline = () => {
    setEditHotlineId(null);
    setHotlineName("");
    setHotlineNumber("");
  };

  const handleSubmitHotline = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let updated: any[];
    if (editHotlineId) {
      updated = hotlines.map((h) => (h.id === editHotlineId ? { ...h, name: hotlineName, number: hotlineNumber } : h));
    } else {
      updated = [...hotlines, { id: Date.now(), name: hotlineName, number: hotlineNumber }];
    }

    try {
      const res = await fetch("/api/hotlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotlines: updated }),
      });
      if (res.ok) {
        setMessage(editHotlineId ? "হটলাইন আপডেট হয়েছে!" : "নতুন হটলাইন যুক্ত হয়েছে!");
        handleCancelHotline();
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteHotline = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই হটলাইনটি মুছে ফেলতে চান?")) return;
    const updated = hotlines.filter((h) => h.id !== id);
    try {
      const res = await fetch("/api/hotlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotlines: updated }),
      });
      if (res.ok) {
        setMessage("হটলাইন মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  // সাইডবার ফটো ব্যানার সেভ হ্যান্ডলার
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/layout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sidebarImage }),
      });
      if (res.ok) {
        setMessage("সাইডবার ফটো ব্যানার সফলভাবে সংরক্ষিত হয়েছে!");
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-blue-200">
          <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>সাইডবার উইজেট ও প্রয়োজনীয় তথ্য</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">গুরুত্বপূর্ণ লিংক ও সাইডবার ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">হোমপেজের ডান পাশের গুরুত্বপূর্ণ লিংক, সরকারি জরুরি হটলাইন ও ফটো ব্যানার পরিচালনা করুন</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* ৩টি কার্যকরী ট্যাব */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "links"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>🔗 গুরুত্বপূর্ণ লিংক ({links.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("hotlines")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "hotlines"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>📞 সরকারি হটলাইন ({hotlines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("banner")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "banner"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>🖼️ সাইডবার ফটো ব্যানার</span>
        </button>
      </div>

      {/* ট্যাব ১: গুরুত্বপূর্ণ লিংক */}
      {activeTab === "links" && (
        <div className="space-y-6">
          <form onSubmit={handleSubmitLink} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              {editLinkId ? <Edit2 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
              <span>{editLinkId ? "লিঙ্ক সম্পাদনা করুন" : "নতুন গুরুত্বপূর্ণ লিংক যোগ করুন"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম / শিরোনাম *</label>
                <input 
                  type="text" 
                  required 
                  value={linkTitle} 
                  onChange={(e) => setLinkTitle(e.target.value)} 
                  placeholder="যেমন: ঢাকা শিক্ষা বোর্ড / শিক্ষা মন্ত্রণালয়" 
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ওয়েবসাইট লিঙ্ক (URL) *</label>
                <input 
                  type="url" 
                  required 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                  placeholder="https://dhakaeducationboard.gov.bd" 
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>{editLinkId ? "সংরক্ষণ করুন" : "যোগ করুন"}</span>
              </button>
              {editLinkId && (
                <button 
                  type="button" 
                  onClick={handleCancelLink} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer transition"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">বিদ্যমান গুরুত্বপূর্ণ লিংকসমূহ ({links.length}টি)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {links.map((l: any) => (
                <div key={l.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{l.title}</h4>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 truncate">
                      <span className="truncate">{l.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => handleEditLink(l)} className="p-1.5 rounded-lg bg-white border text-blue-600 cursor-pointer shadow-2xs hover:border-blue-300"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => handleDeleteLink(l.id)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer shadow-2xs hover:border-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব ২: সরকারি হটলাইন */}
      {activeTab === "hotlines" && (
        <div className="space-y-6">
          <form onSubmit={handleSubmitHotline} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              {editHotlineId ? <Edit2 className="w-4 h-4 text-rose-600" /> : <Plus className="w-4 h-4 text-rose-600" />}
              <span>{editHotlineId ? "হটলাইন সম্পাদনা করুন" : "নতুন জরুরি সরকারি হটলাইন যোগ করুন"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হটলাইনের সেবার নাম *</label>
                <input 
                  type="text" 
                  required 
                  value={hotlineName} 
                  onChange={(e) => setHotlineName(e.target.value)} 
                  placeholder="যেমন: জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)" 
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-rose-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">হটলাইন নম্বর *</label>
                <input 
                  type="text" 
                  required 
                  value={hotlineNumber} 
                  onChange={(e) => setHotlineNumber(e.target.value)} 
                  placeholder="যেমন: ৯৯৯ অথবা ৩৩৩ অথবা ১০৯" 
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-rose-500" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>{editHotlineId ? "সংরক্ষণ করুন" : "যোগ করুন"}</span>
              </button>
              {editHotlineId && (
                <button 
                  type="button" 
                  onClick={handleCancelHotline} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer transition"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">বিদ্যমান সরকারি হটলাইনসমূহ ({hotlines.length}টি)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {hotlines.map((h: any) => (
                <div key={h.id || h.number} className="p-4 rounded-2xl border border-rose-100 bg-rose-50/50 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-black text-rose-700 bg-white px-2.5 py-0.5 rounded-md border border-rose-200 inline-block mb-1">
                      📞 {h.number}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 truncate">{h.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => handleEditHotline(h)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer shadow-2xs hover:border-rose-300"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => handleDeleteHotline(h.id)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer shadow-2xs hover:border-rose-300"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব ৩: সাইডবার ফটো ব্যানার */}
      {activeTab === "banner" && (
        <form onSubmit={handleSaveBanner} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-800" />
              <span>হোমপেজ সাইডবার ফটো ব্যানার</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              হোমপেজের ডান পাশের সাইডবারে হটলাইনের নিচে প্রদর্শিত কাস্টম পোস্টার বা ব্যানার ছবি আপলোড করুন
            </p>
          </div>

          <ImageUploadInput
            label="সাইডবার ব্যানার ছবি আপলোড করুন"
            value={sidebarImage}
            onChange={setSidebarImage}
            helpText="কম্পিউটার বা ডিভাইস থেকে সরাসরি ব্যানার বা নোটিশ পোস্টার ছবি সিলেক্ট করুন"
          />

          {sidebarImage && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">বর্তমান প্রিভিউ:</span>
              <img 
                src={sidebarImage} 
                alt="Sidebar Preview" 
                className="max-h-64 object-contain rounded-xl border border-slate-200 bg-white mx-auto shadow-xs" 
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : "সাইডবার ব্যানার সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
