"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Building,
  Link as LinkIcon,
  Phone,
  Clock,
  Eye
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import demoData from "@/data/demoData.json";

interface FooterLinkItem {
  id: string;
  title: string;
  url: string;
}

export default function AdminFooterPage() {
  const { data: adminData, updateSection } = useAdminData();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // কলাম ১: পরিচিতি
  const [aboutText, setAboutText] = useState("");
  const [recognitionBadge, setRecognitionBadge] = useState("");

  // কলাম ২: দ্রুত লিঙ্ক সমূহ
  const [quickLinksTitle, setQuickLinksTitle] = useState("দ্রুত লিঙ্ক সমূহ");
  const [quickLinks, setQuickLinks] = useState<FooterLinkItem[]>([]);

  // কলাম ৩: একাডেমিক ও শিক্ষার্থী সেবা
  const [academicLinksTitle, setAcademicLinksTitle] = useState("একাডেমিক ও শিক্ষার্থী সেবা");
  const [academicLinks, setAcademicLinks] = useState<FooterLinkItem[]>([]);

  // কলাম ৪: অফিস ও যোগাযোগ
  const [contactTitle, setContactTitle] = useState("অফিস ও যোগাযোগ");
  const [officeHours, setOfficeHours] = useState("রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০");
  const [customAddress, setCustomAddress] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  // বটম বার
  const [copyrightText, setCopyrightText] = useState("");
  const [backToTopText, setBackToTopText] = useState("উপরে যান");

  // নতুন লিঙ্ক ইনপুট স্টেট (কলাম ২)
  const [newQuickTitle, setNewQuickTitle] = useState("");
  const [newQuickUrl, setNewQuickUrl] = useState("");

  // নতুন লিঙ্ক ইনপুট স্টেট (কলাম ৩)
  const [newAcademicTitle, setNewAcademicTitle] = useState("");
  const [newAcademicUrl, setNewAcademicUrl] = useState("");

  // সক্রিয় ট্যাব
  const [activeTab, setActiveTab] = useState<"about" | "quickLinks" | "academicLinks" | "contact" | "bottomBar" | "preview">("about");

  const populateStates = (fd: any, sInfo?: any) => {
    const fallback = (demoData as any).footerData || {};
    setAboutText(fd?.aboutText ?? fallback.aboutText ?? sInfo?.slogan ?? "");
    setRecognitionBadge(fd?.recognitionBadge ?? fallback.recognitionBadge ?? "মডেল শিক্ষাপ্রতিষ্ঠান স্বীকৃতিপ্রাপ্ত");
    setQuickLinksTitle(fd?.quickLinksTitle ?? fallback.quickLinksTitle ?? "দ্রুত লিঙ্ক সমূহ");
    setQuickLinks(Array.isArray(fd?.quickLinks) ? fd.quickLinks : (fallback.quickLinks || []));
    setAcademicLinksTitle(fd?.academicLinksTitle ?? fallback.academicLinksTitle ?? "একাডেমিক ও শিক্ষার্থী সেবা");
    setAcademicLinks(Array.isArray(fd?.academicLinks) ? fd.academicLinks : (fallback.academicLinks || []));
    setContactTitle(fd?.contactTitle ?? fallback.contactTitle ?? "অফিস ও যোগাযোগ");
    setOfficeHours(fd?.officeHours ?? fallback.officeHours ?? "রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০");
    setCustomAddress(fd?.customAddress ?? "");
    setCustomPhone(fd?.customPhone ?? "");
    setCustomEmail(fd?.customEmail ?? "");
    setCopyrightText(fd?.copyrightText ?? sInfo?.copyright ?? "");
    setBackToTopText(fd?.backToTopText ?? fallback.backToTopText ?? "উপরে যান");
  };

  useEffect(() => {
    fetch("/api/footer")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.footerData) {
          populateStates(res.footerData, adminData.schoolInfo);
        } else if (adminData.footerData) {
          populateStates(adminData.footerData, adminData.schoolInfo);
        }
      })
      .catch(() => {
        if (adminData.footerData) {
          populateStates(adminData.footerData, adminData.schoolInfo);
        }
      })
      .finally(() => setFetchLoading(false));
  }, [adminData.footerData, adminData.schoolInfo]);

  // লিঙ্ক যুক্ত করার হ্যান্ডলার (কলাম ২)
  const handleAddQuickLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickTitle.trim() || !newQuickUrl.trim()) return;
    const newItem: FooterLinkItem = {
      id: Date.now().toString(),
      title: newQuickTitle.trim(),
      url: newQuickUrl.trim()
    };
    setQuickLinks([...quickLinks, newItem]);
    setNewQuickTitle("");
    setNewQuickUrl("");
  };

  // লিঙ্ক যুক্ত করার হ্যান্ডলার (কলাম ৩)
  const handleAddAcademicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcademicTitle.trim() || !newAcademicUrl.trim()) return;
    const newItem: FooterLinkItem = {
      id: Date.now().toString(),
      title: newAcademicTitle.trim(),
      url: newAcademicUrl.trim()
    };
    setAcademicLinks([...academicLinks, newItem]);
    setNewAcademicTitle("");
    setNewAcademicUrl("");
  };

  // লিঙ্ক রিমুভ ও পজিশন পরিবর্তন
  const removeQuickLink = (id: string) => {
    setQuickLinks(quickLinks.filter(l => l.id !== id));
  };

  const removeAcademicLink = (id: string) => {
    setAcademicLinks(academicLinks.filter(l => l.id !== id));
  };

  const moveQuickLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= quickLinks.length) return;
    const updated = [...quickLinks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuickLinks(updated);
  };

  const moveAcademicLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= academicLinks.length) return;
    const updated = [...academicLinks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setAcademicLinks(updated);
  };

  // ডিফল্ট মান রিসেট
  const handleResetDefaults = () => {
    if (!confirm("আপনি কি ফুটারের সমস্ত তথ্য ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?")) return;
    const fallback = (demoData as any).footerData || {};
    populateStates(fallback, adminData.schoolInfo);
    setMessage("ডিফল্ট ডেটা লোড হয়েছে। সংরক্ষণ করতে 'পরিবর্তন সংরক্ষণ করুন' বাটনে ক্লিক করুন।");
    setIsError(false);
  };

  // মূল সেভ হ্যান্ডলার
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");

    const footerPayload = {
      aboutText: aboutText.trim(),
      recognitionBadge: recognitionBadge.trim(),
      quickLinksTitle: quickLinksTitle.trim(),
      quickLinks,
      academicLinksTitle: academicLinksTitle.trim(),
      academicLinks,
      contactTitle: contactTitle.trim(),
      officeHours: officeHours.trim(),
      customAddress: customAddress.trim(),
      customPhone: customPhone.trim(),
      customEmail: customEmail.trim(),
      copyrightText: copyrightText.trim(),
      backToTopText: backToTopText.trim()
    };

    try {
      const res = await fetch("/api/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footerData: footerPayload }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setMessage("ফুটারের সমস্ত টেক্সট ও লিঙ্ক সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        updateSection("footerData", footerPayload);

        // লাইভ ইভেন্ট ডিসপ্যাচ
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("footer-updated", { detail: footerPayload }));
        }
      } else {
        setMessage("সংরক্ষণ ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।");
        setIsError(true);
      }
    } catch {
      setMessage("নেটওয়ার্ক সমস্যার কারণে সংরক্ষণ করা যায়নি!");
      setIsError(true);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4500);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">ফুটার ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <span>🦶 ফুটার টেক্সট ও লিঙ্ক ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ওয়েবসাইটের ফুটারের প্রতিটি টেক্সট, কলাম শিরোনাম, লিঙ্ক এবং যোগাযোগের তথ্য সম্পূর্ণ নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition shadow-xs cursor-pointer"
          >
            <Save className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </div>

      {/* স্ট্যাটাস বার্তা */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2.5 ${
          isError ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      {/* ট্যাব নেভিগেশন */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "about" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>কলাম ১: পরিচিতি ও ব্যাজ</span>
        </button>

        <button
          onClick={() => setActiveTab("quickLinks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "quickLinks" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>কলাম ২: দ্রুত লিঙ্ক সমূহ ({quickLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("academicLinks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "academicLinks" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>কলাম ৩: শিক্ষার্থী সেবা ({academicLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "contact" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>কলাম ৪: অফিস ও সময়সূচি</span>
        </button>

        <button
          onClick={() => setActiveTab("bottomBar")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "bottomBar" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>বটম বার ও কপিরাইট</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === "preview" ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>লাইভ প্রিভিউ</span>
        </button>
      </div>

      {/* ট্যাব কনটেন্ট ১: পরিচিতি ও ব্যাজ */}
      {activeTab === "about" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">কলাম ১: বিদ্যালয় পরিচিতি বার্তা ও স্বীকৃতি ব্যাজ</h2>
            <p className="text-xs text-slate-500">ফুটারের প্রথম কলামে লোগো ও নামের নিচে যে পরিচিতি বাক্য ও স্বীকৃতি ব্যাজ প্রদর্শিত হয়</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পরিচিতি টেক্সট / স্লোগান বার্তা *
              </label>
              <textarea
                rows={3}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="যেমন: আধুনিক শিক্ষা, প্রযুক্তি এবং নৈতিক মূল্যবোধের সমন্বয়ে আদর্শ ভবিষ্যৎ নাগরিক গড়ার প্রত্যয়ে আমাদের অগ্রযাত্রা অব্যাহত।"
                className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">লোগো ও নামের ঠিক নিচে প্রদর্শিত হয়।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                স্বীকৃতি ব্যাজ টেক্সট (ঐচ্ছিক)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recognitionBadge}
                  onChange={(e) => setRecognitionBadge(e.target.value)}
                  placeholder="যেমন: মডেল শিক্ষাপ্রতিষ্ঠান স্বীকৃতিপ্রাপ্ত"
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">খালি রাখলে কোনো ব্যাজ প্রদর্শিত হবে না।</p>
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ২: দ্রুত লিঙ্ক সমূহ */}
      {activeTab === "quickLinks" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">কলাম ২: দ্রুত লিঙ্ক শিরোনাম ও লিঙ্ক তালিকা</h2>
              <p className="text-xs text-slate-500">ফুটারের দ্বিতীয় কলামে গুরুত্বপূর্ণ পেজসমূহের লিঙ্ক প্রদর্শন করুন</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কলাম শিরোনাম</label>
              <input
                type="text"
                value={quickLinksTitle}
                onChange={(e) => setQuickLinksTitle(e.target.value)}
                placeholder="যেমন: দ্রুত লিঙ্ক সমূহ"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* নতুন লিঙ্ক যোগ করার ফর্ম */}
            <form onSubmit={handleAddQuickLink} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">➕ নতুন লিঙ্ক যুক্ত করুন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={newQuickTitle}
                    onChange={(e) => setNewQuickTitle(e.target.value)}
                    placeholder="লিঙ্কের নাম (যেমন: আমাদের সম্পর্কে)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={newQuickUrl}
                    onChange={(e) => setNewQuickUrl(e.target.value)}
                    placeholder="লিঙ্ক URL (যেমন: /about)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>লিঙ্ক যুক্ত করুন</span>
              </button>
            </form>

            {/* বর্তমান লিঙ্কের তালিকা */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700">বর্তমান লিঙ্ক সমূহ ({quickLinks.length})</h3>
              {quickLinks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">কোনো লিঙ্ক নেই</p>
              ) : (
                quickLinks.map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...quickLinks];
                          updated[idx].title = e.target.value;
                          setQuickLinks(updated);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-600 outline-none"
                        placeholder="লিঙ্ক শিরোনাম"
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...quickLinks];
                          updated[idx].url = e.target.value;
                          setQuickLinks(updated);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 rounded-lg border border-slate-200 focus:ring-1 focus:ring-blue-600 outline-none"
                        placeholder="URL (যেমন /about)"
                      />
                    </div>

                    <div className="flex items-center gap-1 justify-end shrink-0">
                      <button
                        type="button"
                        onClick={() => moveQuickLink(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="উপরে নিন"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuickLink(idx, "down")}
                        disabled={idx === quickLinks.length - 1}
                        className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="নিচে নিন"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuickLink(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৩: একাডেমিক ও শিক্ষার্থী সেবা */}
      {activeTab === "academicLinks" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">কলাম ৩: একাডেমিক ও শিক্ষার্থী সেবা কলাম</h2>
              <p className="text-xs text-slate-500">ফুটারের তৃতীয় কলামে রুটিন, সিলেবাস, ফি এবং কৃতি শিক্ষার্থীদের লিঙ্ক যুক্ত করুন</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কলাম শিরোনাম</label>
              <input
                type="text"
                value={academicLinksTitle}
                onChange={(e) => setAcademicLinksTitle(e.target.value)}
                placeholder="যেমন: একাডেমিক ও শিক্ষার্থী সেবা"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* নতুন লিঙ্ক যোগ করার ফর্ম */}
            <form onSubmit={handleAddAcademicLink} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">➕ নতুন লিঙ্ক যুক্ত করুন</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={newAcademicTitle}
                    onChange={(e) => setNewAcademicTitle(e.target.value)}
                    placeholder="লিঙ্কের নাম (যেমন: ক্লাস রুটিন)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={newAcademicUrl}
                    onChange={(e) => setNewAcademicUrl(e.target.value)}
                    placeholder="লিঙ্ক URL (যেমন: /academics)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>লিঙ্ক যুক্ত করুন</span>
              </button>
            </form>

            {/* বর্তমান লিঙ্কের তালিকা */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700">বর্তমান লিঙ্ক সমূহ ({academicLinks.length})</h3>
              {academicLinks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl">কোনো লিঙ্ক নেই</p>
              ) : (
                academicLinks.map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...academicLinks];
                          updated[idx].title = e.target.value;
                          setAcademicLinks(updated);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 focus:ring-1 focus:ring-emerald-600 outline-none"
                        placeholder="লিঙ্ক শিরোনাম"
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const updated = [...academicLinks];
                          updated[idx].url = e.target.value;
                          setAcademicLinks(updated);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 rounded-lg border border-slate-200 focus:ring-1 focus:ring-emerald-600 outline-none"
                        placeholder="URL (যেমন /academics)"
                      />
                    </div>

                    <div className="flex items-center gap-1 justify-end shrink-0">
                      <button
                        type="button"
                        onClick={() => moveAcademicLink(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="উপরে নিন"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveAcademicLink(idx, "down")}
                        disabled={idx === academicLinks.length - 1}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="নিচে নিন"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAcademicLink(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৪: অফিস ও সময়সূচি */}
      {activeTab === "contact" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">কলাম ৪: অফিস, যোগাযোগ ও সময়সূচি</h2>
            <p className="text-xs text-slate-500">ফুটারের চতুর্থ কলামে যোগাযোগের শিরোনাম, অফিস সময় ও ওভাররাইড কন্টাক্ট তথ্য দিন</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কলামের শিরোনাম</label>
              <input
                type="text"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                placeholder="যেমন: অফিস ও যোগাযোগ"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিস সময়সূচি *</label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                placeholder="যেমন: রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">ফুটারের ঘড়ি আইকনের পাশে এটি প্রদর্শিত হবে।</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 mb-2">ঐচ্ছিক কন্টাক্ট ওভাররাইড (খালি রাখলে মূল স্কুলের তথ্য ব্যবহার হবে)</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">ফুটারের জন্য বিশেষ ঠিকানা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder={adminData.schoolInfo?.contact?.address || "স্কুলের সাধারণ ঠিকানা"}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">ফুটারের জন্য বিশেষ ফোন নম্বর (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder={adminData.schoolInfo?.contact?.phone || "স্কুলের সাধারণ ফোন"}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">ফুটারের জন্য বিশেষ ইমেইল (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder={adminData.schoolInfo?.contact?.email || "স্কুলের সাধারণ ইমেইল"}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৫: বটম বার ও কপিরাইট */}
      {activeTab === "bottomBar" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">ফুটারের নিচের বার ও কপিরাইট টেক্সট</h2>
            <p className="text-xs text-slate-500">একদম নিচে প্রদর্শিত কপিরাইট বাক্য ও স্ক্রল টু টপ বাটনের টেক্সট নির্ধারণ করুন</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কপিরাইট টেক্সট</label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder={`যেমন: © ২০২৬ ${adminData.schoolInfo?.name || "আদর্শ উচ্চ বিদ্যালয়"}। সর্বস্বত্ব সংরক্ষিত।`}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">খালি রাখলে স্বয়ংক্রিয়ভাবে বর্তমান বছর ও স্কুলের নাম দিয়ে তৈরি হবে।</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">'উপরে যান' বাটন টেক্সট</label>
              <input
                type="text"
                value={backToTopText}
                onChange={(e) => setBackToTopText(e.target.value)}
                placeholder="উপরে যান"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৬: লাইভ প্রিভিউ */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl flex items-center justify-between text-white text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>লাইভ প্রিভিউ (বর্তমান পরিবর্তনের নমুনা)</span>
            </span>
            <span className="text-[11px] text-slate-400">এই পরিবর্তনগুলো চূড়ান্ত করতে উপরের 'সংরক্ষণ করুন' চাপুন</span>
          </div>

          <div className="bg-slate-950 text-slate-300 rounded-3xl p-6 sm:p-8 border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
              
              {/* কলাম ১ প্রিভিউ */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={adminData.schoolInfo?.logo || "https://placehold.co/100x100?text=Logo"} 
                    alt="Logo" 
                    className="w-10 h-10 rounded-xl bg-white p-1 object-contain" 
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{adminData.schoolInfo?.name || "বিদ্যালয়ের নাম"}</h4>
                    <p className="text-[10px] text-emerald-400">EIIN: {adminData.schoolInfo?.eiin || "108420"}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{aboutText || "পরিচিতি বার্তা"}</p>
                {recognitionBadge && (
                  <span className="inline-block bg-slate-900 border border-slate-800 text-[11px] text-amber-300 px-2.5 py-1 rounded-lg">
                    ★ {recognitionBadge}
                  </span>
                )}
              </div>

              {/* কলাম ২ প্রিভিউ */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-blue-500 pl-2">
                  {quickLinksTitle || "দ্রুত লিঙ্ক"}
                </h4>
                <ul className="space-y-2 text-slate-400">
                  {quickLinks.map((l, i) => (
                    <li key={i} className="hover:text-white flex items-center gap-1">
                      <span>›</span>
                      <span>{l.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* কলাম ৩ প্রিভিউ */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-emerald-500 pl-2">
                  {academicLinksTitle || "একাডেমিক লিঙ্ক"}
                </h4>
                <ul className="space-y-2 text-slate-400">
                  {academicLinks.map((l, i) => (
                    <li key={i} className="hover:text-white flex items-center gap-1">
                      <span>›</span>
                      <span>{l.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* কলাম ৪ প্রিভিউ */}
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-amber-500 pl-2">
                  {contactTitle || "অফিস ও যোগাযোগ"}
                </h4>
                <div className="space-y-2 text-slate-400">
                  <p>📍 {customAddress || adminData.schoolInfo?.contact?.address || "ঢাকা, বাংলাদেশ"}</p>
                  <p>📞 {customPhone || adminData.schoolInfo?.contact?.phone || "+880 1234 567890"}</p>
                  <p>✉️ {customEmail || adminData.schoolInfo?.contact?.email || "info@school.edu.bd"}</p>
                  <p className="pt-1 text-[11px] text-slate-500 border-t border-slate-900">🕒 {officeHours}</p>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-500">
              <p>{copyrightText || `© ২০২৬ ${adminData.schoolInfo?.name || "বিদ্যালয়"}। সর্বস্বত্ব সংরক্ষিত।`}</p>
              <span className="flex items-center gap-1 text-slate-400">
                <span>{backToTopText}</span>
                <span>↑</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ফুটার সংরক্ষণ বাটন (নিচে সবসময় দৃশ্যমান) */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition shadow-md cursor-pointer"
        >
          <Save className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "সংরক্ষণ হচ্ছে..." : "ফুটার সেটিংস সম্পূর্ণ সংরক্ষণ করুন"}</span>
        </button>
      </div>
    </div>
  );
}
