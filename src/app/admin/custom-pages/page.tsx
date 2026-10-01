"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Plus, 
  FileText, 
  Eye, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Save, 
  Upload, 
  ExternalLink, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Link2,
  FolderOpen,
  Sparkles,
  Users,
  Settings2
} from "lucide-react";

export type CustomPage = {
  id: number;
  title: string;
  slug: string;
  template: "text" | "pdf_only" | "list";
  content: string;
  image?: string;
  imageSize?: "small" | "medium" | "large" | "full";
  imagePosition?: "top" | "center" | "left" | "right";
  imageCaption?: string;
  pdfUrl?: string;
  pdfMode?: "button" | "embed";
  pdfName?: string;
  listItems?: any[];
  updatedAt?: string;
};

export default function ManageCustomPages() {
  const { data: adminData, updateSection, refreshData } = useAdminData();
  const [pages, setPages] = useState<CustomPage[]>(adminData.customPages || []);
  const [loading, setLoading] = useState(adminData.customPages ? false : true);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // মোডাল ও এডিটর ভিউ স্টেট
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activePage, setActivePage] = useState<CustomPage | null>(null);

  // পেজ তৈরি ও এডিটের ফর্ম স্টেট
  const [pageId, setPageId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState<"text" | "pdf_only" | "list">("text");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageSize, setImageSize] = useState<"small" | "medium" | "large" | "full">("medium");
  const [imagePosition, setImagePosition] = useState<"top" | "center" | "left" | "right">("top");
  const [imageCaption, setImageCaption] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfMode, setPdfMode] = useState<"button" | "embed">("button");
  const [pdfName, setPdfName] = useState("");
  const [listItems, setListItems] = useState<any[]>([]);

  // নতুন মেম্বার স্টেট (যদি Member List টেমপ্লেট হয়)
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDesg, setNewMemberDesg] = useState("");
  const [newMemberImg, setNewMemberImg] = useState("");
  const [uploadingMemberImg, setUploadingMemberImg] = useState(false);

  useEffect(() => {
    if (adminData.customPages && adminData.customPages.length > 0) {
      setPages(adminData.customPages);
      setLoading(false);
    }
  }, [adminData.customPages]);

  // ডেটা ফেচ
  const fetchPages = async () => {
    await refreshData();
  };

  // টাইটেল থেকে অটোমেটিক স্লাগ তৈরি ফাংশন
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u0980-\u09FF-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
  };

  // এডিটর লোড করা
  const openEditor = (page: CustomPage) => {
    setPageId(page.id);
    setTitle(page.title || "");
    setSlug(page.slug || "");
    setTemplate(page.template || "text");
    setContent(page.content || "");
    setImage(page.image || "");
    setImageSize(page.imageSize || "medium");
    setImagePosition(page.imagePosition || "top");
    setImageCaption(page.imageCaption || "");
    setPdfUrl(page.pdfUrl || "");
    setPdfMode(page.pdfMode || "button");
    setPdfName(page.pdfName || "");
    setListItems(page.listItems || []);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeEditor = () => {
    setActivePage(null);
    setPageId(null);
  };

  // নতুন পেজ তৈরি শুরু
  const handleStartCreate = () => {
    setPageId(null);
    setTitle("");
    setSlug("");
    setTemplate("text");
    setContent("");
    setImage("");
    setImageSize("medium");
    setImagePosition("top");
    setImageCaption("");
    setPdfUrl("");
    setPdfMode("button");
    setPdfName("");
    setListItems([]);
    setShowCreateModal(true);
  };

  // মোডাল থেকে নতুন পেজ তৈরি ও সাথে সাথে এডিটরে যাওয়া
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("দয়া করে পেজের টাইটেল দিন");
    const finalSlug = slug.trim() ? slug.trim() : `page-${Date.now()}`;

    setSaving(true);
    try {
      const res = await fetch("/api/custom-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_page",
          title: title.trim(),
          slug: finalSlug,
          template: template,
          content: template === "pdf_only" ? "" : "এখানে পেজের বিস্তারিত বিবরণ লিখুন...",
          pdfMode: template === "pdf_only" ? "embed" : "button"
        })
      });
      const data = await res.json();
      if (data.success && data.page) {
        setShowCreateModal(false);
        await fetchPages();
        openEditor(data.page);
        setMessage("🎉 পেজ সফলভাবে তৈরি হয়েছে! এখন এটি প্রয়োজন অনুযায়ী সাজিয়ে নিন।");
        setTimeout(() => setMessage(""), 4000);
      }
    } catch {
      alert("সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  };

  // পরিবর্তন সংরক্ষণ
  const handleSavePage = async () => {
    if (!title.trim()) return alert("টাইটেল খালি রাখা যাবে না");
    if (!slug.trim()) return alert("স্লাগ খালি রাখা যাবে না");

    setSaving(true);
    try {
      const res = await fetch("/api/custom-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_page",
          id: pageId,
          title: title.trim(),
          slug: slug.trim(),
          template,
          content,
          image,
          imageSize,
          imagePosition,
          imageCaption,
          pdfUrl,
          pdfMode,
          pdfName,
          listItems
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ পেজ সফলভাবে সংরক্ষণ করা হয়েছে!");
        await fetchPages();
        if (data.page) {
          setActivePage(data.page);
        }
        setTimeout(() => setMessage(""), 3500);
      }
    } catch {
      alert("সংরক্ষণে সমস্যা হয়েছে!");
    } finally {
      setSaving(false);
    }
  };

  // পেজ মুছে ফেলা
  const handleDeletePage = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই পেজটি মুছে ফেলতে চান?")) return;
    try {
      await fetch(`/api/custom-pages?id=${id}`, { method: "DELETE" });
      if (activePage?.id === id) {
        closeEditor();
      }
      fetchPages();
    } catch {}
  };

  // ইমেজ আপলোড
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=custom-pages", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert("ইমেজ আপলোড ব্যর্থ হয়েছে!");
      }
    } catch {
      alert("ইমেজ আপলোডে সমস্যা হয়েছে!");
    } finally {
      setUploadingImg(false);
    }
  };

  // পিডিএফ আপলোড
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=documents", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPdfUrl(data.url);
        if (!pdfName) {
          setPdfName(file.name);
        }
      } else {
        alert("পিডিএফ আপলোড ব্যর্থ হয়েছে!");
      }
    } catch {
      alert("পিডিএফ আপলোডে সমস্যা হয়েছে!");
    } finally {
      setUploadingPdf(false);
    }
  };

  // মেম্বার ইমেজ আপলোড
  const handleMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMemberImg(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=teachers", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewMemberImg(data.url);
      }
    } finally {
      setUploadingMemberImg(false);
    }
  };

  // মেম্বার আইটেম যোগ
  const handleAddMember = () => {
    if (!newMemberName.trim()) return alert("সদস্যের নাম দিন");
    const newItem = {
      id: Date.now(),
      name: newMemberName.trim(),
      designation: newMemberDesg.trim(),
      image: newMemberImg
    };
    setListItems([...listItems, newItem]);
    setNewMemberName("");
    setNewMemberDesg("");
    setNewMemberImg("");
  };

  const handleRemoveMember = (id: number) => {
    setListItems(listItems.filter(item => item.id !== id));
  };

  // লিংক কপি করা
  const copyPageLink = (pageSlug: string) => {
    const fullUrl = `${window.location.origin}/custom-pages/${pageSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(pageSlug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // ইমেজ সাইজ ক্লাস ম্যাপ (প্রিভিউয়ের জন্য)
  const getImageSizeClass = (size?: string) => {
    switch (size) {
      case "small": return "max-w-[240px]";
      case "medium": return "max-w-[400px]";
      case "large": return "max-w-[600px]";
      case "full": return "w-full";
      default: return "max-w-[400px]";
    }
  };

  return (
    <div className="space-y-8">
      {/* টপ মেসেজ */}
      {message && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 font-semibold flex items-center justify-between shadow-xs">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-xs text-emerald-600 hover:underline">বন্ধ করুন</button>
        </div>
      )}

      {/* =========================================================
          ভিউ ১: লাইভ এডিটর ও প্রিভিউ মোড (যখন কোনো পেজ এডিট করা হচ্ছে)
          ========================================================= */}
      {activePage ? (
        <div className="space-y-6">
          {/* এডিটর হেডার ও নেভিগেশন */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={closeEditor}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                title="পেজ তালিকায় ফিরে যান"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <span>✍️ পেজ এডিটর:</span>
                  <span className="text-blue-700 max-w-xs sm:max-w-md truncate">{title || "শিরোনামহীন পৃষ্ঠা"}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                  <span>/custom-pages/{slug}</span>
                  <button
                    onClick={() => copyPageLink(slug)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-sans font-semibold ml-2"
                  >
                    {copiedSlug === slug ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> কপি হয়েছে</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> লিংক কপি</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/custom-pages/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>লাইভ দেখুন</span>
              </a>

              <button
                onClick={handleSavePage}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
              </button>
            </div>
          </div>

          {/* তথ্য কেন্দ্র লিঙ্কিং হেল্পার ব্যানার */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-2xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm">এই পেজটি তথ্য কেন্দ্রে কিভাবে দেখাবেন?</p>
                <p className="text-gray-600">
                  'তথ্য কেন্দ্র সেটিংস' এ গিয়ে যেকোনো ক্যাটাগরিতে উপ-লিঙ্ক যোগ করার সময় ড্রপডাউন থেকে <strong>{title || "এই পেজটি"}</strong> সিলেক্ট করে সেভ করুন।
                </p>
              </div>
            </div>
            <Link
              href="/admin/directory"
              className="px-4 py-2 bg-white text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-50 transition shrink-0 flex items-center gap-1.5 shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>তথ্য কেন্দ্র সেটিংসে যান</span>
            </Link>
          </div>

          {/* স্প্লিট স্ক্রিন: বামে এডিট কন্ট্রোল, ডানে লাইভ প্রিভিউ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ===================== বাম পাশ: এডিটর কন্ট্রোল (5 cols) ===================== */}
            <div className="lg:col-span-5 space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
              
              {/* সেকশন ১: বেসিক তথ্য */}
              <div className="space-y-4 border-b border-gray-100 pb-5">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-blue-600" />
                  <span>১. পেজ কনফিগারেশন ও টাইটেল</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">পেজের টাইটেল *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
                    placeholder="যেমন: ভর্তি নীতিমালা ২০২৬"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">স্লাগ / লিঙ্ক পাথ *</label>
                  <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-blue-600">
                    <span className="text-xs text-gray-400 pl-3 font-mono">/custom-pages/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className="w-full px-2 py-2 text-xs font-mono bg-transparent text-gray-900 outline-none"
                      placeholder="admission-rules"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">টেমপ্লেট মোড</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none font-medium"
                  >
                    <option value="text">📄 সাধারণ পেজ (টেক্সট + ইমেজ + পিডিএফ)</option>
                    <option value="pdf_only">📑 সম্পূর্ণ পেজ পিডিএফ ভিউয়ার (Full PDF Viewer)</option>
                    <option value="list">👥 সদস্য / টিম তালিকা (Member List)</option>
                  </select>
                </div>
              </div>

              {/* সেকশন ২: ইমেজ কন্ট্রোল (শুধুমাত্র সাধারণ বা মেম্বার টেমপ্লেট হলে) */}
              {template !== "pdf_only" && (
                <div className="space-y-4 border-b border-gray-100 pb-5">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>২. ইমেজ ও ডিসপ্লে সাইজ/পজিশন</span>
                  </h3>

                  {/* ইমেজ প্রিভিউ বা আপলোড ফিল্ড */}
                  {image ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 max-h-48 flex items-center justify-center">
                        <img src={image} alt="Uploaded" className="max-h-48 object-contain" />
                        <button
                          onClick={() => setImage("")}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs shadow-xs"
                          title="ইমেজ মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* পজিশন নির্বাচন */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">ইমেজ কোথায় দেখাবে (পজিশন):</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { id: "top", label: "🔝 উপরে ব্যানার", desc: "পেজের শুরুতে" },
                            { id: "center", label: "☵ মাঝে কেন্দ্রস্থলে", desc: "কনটেন্টের মাঝে" },
                            { id: "left", label: "◧ বামে ফ্লোট", desc: "লেখার বাম পাশে" },
                            { id: "right", label: "◨ ডানে ফ্লোট", desc: "লেখার ডান পাশে" },
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => setImagePosition(pos.id as any)}
                              className={`p-2 rounded-xl border text-left transition ${imagePosition === pos.id ? "border-blue-600 bg-blue-50 text-blue-900 font-bold" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                            >
                              <div>{pos.label}</div>
                              <div className="text-[10px] text-gray-400">{pos.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* সাইজ নির্বাচন */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">ইমেজের আকার (সাইজ):</label>
                        <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
                          {[
                            { id: "small", label: "ছোট (30%)" },
                            { id: "medium", label: "মাঝারি (50%)" },
                            { id: "large", label: "বড় (75%)" },
                            { id: "full", label: "পূর্ণাঙ্গ (100%)" },
                          ].map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setImageSize(s.id as any)}
                              className={`py-1.5 px-2 rounded-lg border text-xs transition ${imageSize === s.id ? "border-blue-600 bg-blue-600 text-white font-bold" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেজ ক্যাপশন (ঐচ্ছিক)</label>
                        <input
                          type="text"
                          value={imageCaption}
                          onChange={(e) => setImageCaption(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 outline-none"
                          placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600">
                          {uploadingImg ? "ইমেজ আপলোড হচ্ছে..." : "ডিভাইস থেকে ছবি আপলোড করুন"}
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImg} />
                      </label>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>অথবা ইমেজ URL দিন:</span>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border rounded-lg bg-white"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* সেকশন ৩: পিডিএফ ফাইল ও ২ টি মোড কন্ট্রোল */}
              <div className="space-y-4 border-b border-gray-100 pb-5">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>৩. পিডিএফ ফাইল ও প্রদর্শনের ধরণ</span>
                </h3>

                {pdfUrl ? (
                  <div className="space-y-3 bg-red-50/40 p-3.5 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-xs font-bold text-gray-900 truncate">{pdfName || "ডকুমেন্ট.pdf"}</span>
                      </div>
                      <button
                        onClick={() => { setPdfUrl(""); setPdfName(""); }}
                        className="text-xs text-red-600 hover:underline shrink-0"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">ডকুমেন্টের নাম:</label>
                      <input
                        type="text"
                        value={pdfName}
                        onChange={(e) => setPdfName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                        placeholder="যেমন: ভর্তি বিজ্ঞপ্তি ২০২৬.pdf"
                      />
                    </div>

                    {/* পিডিএফ প্রদর্শনের ২ টি মোড */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">পিডিএফ যেভাবে দেখাবে:</label>
                      <div className="space-y-2">
                        <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${pdfMode === "button" ? "border-red-600 bg-red-50/60 font-semibold text-red-950" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                          <input
                            type="radio"
                            name="pdfMode"
                            value="button"
                            checked={pdfMode === "button"}
                            onChange={() => setPdfMode("button")}
                            className="mt-0.5 text-red-600 focus:ring-red-500"
                          />
                          <div className="text-xs">
                            <div>🔘 ডাউনলোড ও ভিউ বাটন আকারে (Button Mode)</div>
                            <div className="text-[11px] text-gray-500 font-normal">সুন্দর কার্ডে ফাইলের নাম, সরাসরি দেখা ও ডাউনলোডের বাটন থাকবে।</div>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${pdfMode === "embed" ? "border-red-600 bg-red-50/60 font-semibold text-red-950" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                          <input
                            type="radio"
                            name="pdfMode"
                            value="embed"
                            checked={pdfMode === "embed"}
                            onChange={() => setPdfMode("embed")}
                            className="mt-0.5 text-red-600 focus:ring-red-500"
                          />
                          <div className="text-xs">
                            <div>📖 খোলা অবস্থায় সরাসরি পেজে (Full Embedded Viewer)</div>
                            <div className="text-[11px] text-gray-500 font-normal">পেজে ঢুকলেই পুরো স্ক্রিন জুড়ে পিডিএফটি খোলা থাকবে, পড়তে পারবেন।</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-red-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition">
                      <FileText className="w-5 h-5 text-red-400" />
                      <span className="text-xs font-semibold text-gray-600">
                        {uploadingPdf ? "পিডিএফ আপলোড হচ্ছে..." : "পিডিএফ (PDF) ফাইল আপলোড করুন"}
                      </span>
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" disabled={uploadingPdf} />
                    </label>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>অথবা পিডিএফ লিংক দিন:</span>
                      <input
                        type="text"
                        value={pdfUrl}
                        onChange={(e) => setPdfUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border rounded-lg bg-white"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* সেকশন ৪: টেক্সট কনটেন্ট */}
              {template !== "pdf_only" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">৪. বিস্তারিত টেক্সট / বিবরণ</label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
                    placeholder="এখানে আপনার পেজের সম্পূর্ণ লেখা লিখুন..."
                  />
                </div>
              )}

              {/* সেকশন ৫: মেম্বার লিস্ট পরিচালনা (যদি Member List টেমপ্লেট হয়) */}
              {template === "list" && (
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>৫. সদস্য তালিকা পরিচালনা ({listItems.length} জন)</span>
                  </h4>

                  <div className="bg-gray-50 p-3 rounded-xl border space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="সদস্যের নাম"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      placeholder="পদবী (যেমন: সভাপতি / সদস্য)"
                      value={newMemberDesg}
                      onChange={(e) => setNewMemberDesg(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded-lg bg-white"
                    />
                    <div className="flex gap-2">
                      <label className="flex-1 px-3 py-1.5 border rounded-lg bg-white text-center cursor-pointer hover:bg-gray-50">
                        <span>{uploadingMemberImg ? "আপলোড..." : (newMemberImg ? "ছবি যুক্ত হয়েছে ✓" : "ছবি আপলোড")}</span>
                        <input type="file" accept="image/*" onChange={handleMemberImageUpload} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      >
                        যোগ করুন
                      </button>
                    </div>
                  </div>

                  {listItems.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {listItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border text-xs">
                          <span className="font-semibold text-gray-800">{item.name} ({item.designation})</span>
                          <button onClick={() => handleRemoveMember(item.id)} className="text-red-500 hover:text-red-700 text-[11px]">মুছুন</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* সেভ বাটন */}
              <button
                onClick={handleSavePage}
                disabled={saving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
              </button>
            </div>

            {/* ===================== ডান পাশ: রিয়েল-টাইম প্রিভিউ (7 cols) ===================== */}
            <div className="lg:col-span-7 sticky top-24">
              <div className="bg-gray-100 p-2 sm:p-4 rounded-3xl border border-gray-300/80 shadow-md">
                
                {/* প্রিভিউ উইন্ডো বার */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-gray-200 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    <span className="ml-2 font-bold text-gray-700">লাইভ প্রিভিউ (WYSIWYG)</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                    ভিজিটর যেমন দেখবেন
                  </span>
                </div>

                {/* প্রিভিউ কনটেন্ট কন্টেইনার */}
                <div className="mt-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 min-h-[550px] overflow-y-auto max-h-[80vh]">
                  
                  {/* পেজ হেডার */}
                  <div className="border-b pb-4 mb-6">
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-3 py-0.5 rounded-full">
                      অফিসিয়াল তথ্য পাতা
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                      {title || "শিরোনামহীন পৃষ্ঠা"}
                    </h1>
                  </div>

                  {/* সম্পূর্ণ পেজ পিডিএফ মোড */}
                  {(template === "pdf_only" || (pdfUrl && pdfMode === "embed" && !content)) ? (
                    <div className="space-y-4">
                      {pdfUrl ? (
                        <>
                          <div className="flex items-center justify-between bg-red-50/60 p-3 rounded-xl border border-red-200 text-xs">
                            <span className="font-bold text-red-950 truncate">{pdfName || "ডকুমেন্ট.pdf"}</span>
                            <span className="text-[11px] font-semibold text-red-600 bg-white px-2 py-1 rounded border">খোলা অবস্থায় প্রদর্শিত</span>
                          </div>
                          <div className="w-full h-[550px] rounded-xl overflow-hidden border border-gray-300 bg-gray-50">
                            <iframe src={`${pdfUrl}#toolbar=1`} className="w-full h-full" title="PDF Preview" />
                          </div>
                        </>
                      ) : (
                        <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
                          <FileText className="w-8 h-8 text-gray-300" />
                          <span>বামের মেনু থেকে একটি PDF ফাইল আপলোড করুন</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* সাধারণ টেক্সট + ইমেজ + পিডিএফ মোড */
                    <div className="space-y-6">
                      
                      {/* টপ ব্যানার ইমেজ */}
                      {image && imagePosition === "top" && (
                        <div className="space-y-1 text-center">
                          <div className={`mx-auto rounded-xl overflow-hidden border ${getImageSizeClass(imageSize)}`}>
                            <img src={image} alt="Banner" className="w-full h-auto object-cover max-h-72" />
                          </div>
                          {imageCaption && <p className="text-[11px] text-gray-500 italic">{imageCaption}</p>}
                        </div>
                      )}

                      {/* টেক্সট এবং সাইড/সেন্টার ইমেজ */}
                      <div className="clearfix">
                        {image && (imagePosition === "left" || imagePosition === "right") && (
                          <div className={`mb-4 ${imagePosition === "left" ? "float-left mr-4" : "float-right ml-4"} ${getImageSizeClass(imageSize)}`}>
                            <div className="rounded-xl overflow-hidden border">
                              <img src={image} alt="Floating" className="w-full h-auto object-cover" />
                            </div>
                            {imageCaption && <p className="text-[10px] text-gray-500 italic text-center mt-1">{imageCaption}</p>}
                          </div>
                        )}

                        {image && imagePosition === "center" && (
                          <div className="space-y-1 text-center my-4">
                            <div className={`mx-auto rounded-xl overflow-hidden border ${getImageSizeClass(imageSize)}`}>
                              <img src={image} alt="Centered" className="w-full h-auto object-cover max-h-72" />
                            </div>
                            {imageCaption && <p className="text-[11px] text-gray-500 italic">{imageCaption}</p>}
                          </div>
                        )}

                        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line font-normal">
                          {content || "এখানে আপনার লেখার কনটেন্ট দেখা যাবে..."}
                        </div>
                      </div>

                      {/* মেম্বার লিস্ট */}
                      {template === "list" && listItems.length > 0 && (
                        <div className="pt-4 border-t grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {listItems.map((item) => (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-xl border text-center">
                              <img 
                                src={item.image || "/images/placeholder-avatar.png"} 
                                alt={item.name} 
                                className="w-14 h-14 rounded-full object-cover mx-auto border" 
                              />
                              <h5 className="font-bold text-gray-900 text-xs mt-2 truncate">{item.name}</h5>
                              <p className="text-blue-600 text-[11px] truncate">{item.designation}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* পিডিএফ সেকশন */}
                      {pdfUrl && (
                        <div className="pt-6 border-t border-gray-100">
                          <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-red-600" />
                            <span>সংযুক্ত নথি / ডকুমেন্ট</span>
                          </h4>

                          {pdfMode === "embed" ? (
                            <div className="space-y-2">
                              <div className="w-full h-[450px] rounded-xl overflow-hidden border border-gray-300 bg-gray-50">
                                <iframe src={`${pdfUrl}#toolbar=1`} className="w-full h-full" title="PDF Viewer" />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 text-xs">{pdfName || "ডকুমেন্ট.pdf"}</div>
                                  <div className="text-[10px] text-gray-500">অনলাইনে পড়ুন অথবা ডাউনলোড করুন</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-lg shadow-2xs">
                                  দেখুন
                                </span>
                                <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs rounded-lg shadow-2xs">
                                  ডাউনলোড
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* =========================================================
            ভিউ ২: সকল পেজের তালিকা ও ব্যবস্থাপনা ড্যাশবোর্ড
            ========================================================= */
        <div className="space-y-8">
          {/* হেডার */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
                <LayoutTemplate className="w-7 h-7 text-blue-600" />
                <span>কাস্টম পেজ বিল্ডার (Custom Page Builder)</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                আপনার প্রয়োজনমতো নতুন পাতা তৈরি করুন, ছবি/পিডিএফ সাজান এবং লিংক কপি করে তথ্য কেন্দ্রে যুক্ত করুন।
              </p>
            </div>

            <button
              onClick={handleStartCreate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>নতুন পেজ তৈরি করুন</span>
            </button>
          </div>

          {/* পেজের তালিকা */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                বর্তমান কাস্টম পেজ তালিকা ({pages.length}টি)
              </h2>
              <Link
                href="/admin/directory"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>তথ্য কেন্দ্র সেটিংসে যান</span>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-500">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <span>পেজ লোড হচ্ছে...</span>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">এখনো কোনো কাস্টম পেজ তৈরি করা হয়নি</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  ভর্তি নীতিমালা, পরীক্ষা নির্দেশিকা, সিলেবাস ইত্যাদি যেকোনো তথ্য প্রদর্শনের জন্য "নতুন পেজ তৈরি করুন" বাটনে ক্লিক করুন।
                </p>
                <button
                  onClick={handleStartCreate}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>প্রথম পেজ তৈরি করুন</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-50/70 hover:bg-white rounded-2xl border border-gray-200 p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {p.template === "pdf_only" ? "📑 সম্পূর্ণ PDF" : p.template === "list" ? "👥 সদস্য তালিকা" : "📄 সাধারণ পেজ"}
                        </span>
                        {p.pdfUrl && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> PDF সংযুক্ত
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-base mb-2 group-hover:text-blue-700 transition line-clamp-1">
                        {p.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-white p-2 rounded-lg border mb-4">
                        <span className="truncate">/custom-pages/{p.slug}</span>
                        <button
                          onClick={() => copyPageLink(p.slug)}
                          className="ml-auto text-blue-600 hover:text-blue-800 p-1 shrink-0"
                          title="লিংক কপি করুন"
                        >
                          {copiedSlug === p.slug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                        {p.content || (p.pdfUrl ? "পিডিএফ ভিত্তিক ডকুমেন্ট পাতা" : "কোনো সংক্ষিপ্ত বিবরণ নেই")}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditor(p)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>এডিট ও প্রিভিউ</span>
                        </button>
                        <a
                          href={`/custom-pages/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 rounded-lg text-xs"
                          title="নতুন উইন্ডোতে দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeletePage(p.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          নতুন পেজ তৈরি মোডাল (Step 1: Create Modal)
          ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>নতুন কাস্টম পেজ তৈরি করুন</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              {/* ধাপ ১: টেমপ্লেট নির্বাচন */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">১. টেমপ্লেট নির্বাচন করুন *</label>
                <div className="space-y-2">
                  {[
                    {
                      id: "text",
                      title: "📄 সাধারণ পাতা (Standard Article)",
                      desc: "টেক্সট লেখা, ছবি ও পিডিএফ যুক্ত করার পূর্ণাঙ্গ পেজ"
                    },
                    {
                      id: "pdf_only",
                      title: "📑 সম্পূর্ণ পেজ পিডিএফ ভিউয়ার (Full-page PDF)",
                      desc: "পেজে ঢুকলেই পুরো স্ক্রিনে সম্পূর্ণ পিডিএফটি সরাসরি খোলা থাকবে"
                    },
                    {
                      id: "list",
                      title: "👥 সদস্য / পরিচালনা পর্ষদ তালিকা (Member List)",
                      desc: "সদস্যদের ছবি, নাম ও পদবী সমন্বিত গ্রিড তালিকা"
                    }
                  ].map((tpl) => (
                    <label
                      key={tpl.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${template === tpl.id ? "border-blue-600 bg-blue-50/60 font-semibold text-blue-950" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                    >
                      <input
                        type="radio"
                        name="createTemplate"
                        value={tpl.id}
                        checked={template === tpl.id}
                        onChange={() => setTemplate(tpl.id as any)}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-xs">
                        <div className="font-bold">{tpl.title}</div>
                        <div className="text-[11px] text-gray-500 font-normal">{tpl.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ধাপ ২: পেজের নাম / টাইটেল */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">২. পেজের টাইটেল / নাম *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug || slug.startsWith("page-")) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="যেমন: ভর্তি নীতিমালা ও আসন সংখ্যা ২০২৬"
                />
              </div>

              {/* ধাপ ৩: স্লাগ */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">৩. পেজের লিংক (Slug) *</label>
                <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden bg-gray-50 focus-within:ring-2 focus-within:ring-blue-600">
                  <span className="text-xs text-gray-400 pl-3 font-mono">/custom-pages/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="w-full px-2 py-2 text-xs font-mono bg-transparent text-gray-900 outline-none"
                    placeholder="admission-policy"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-mono">
                  🔗 লিংক হবে: /custom-pages/{slug || "..."}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{saving ? "তৈরি হচ্ছে..." : "পেজ তৈরি করুন এবং এডিটরে যান"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
