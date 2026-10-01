"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  Image as ImageIcon, 
  BarChart3, 
  GraduationCap, 
  Type, 
  Palette, 
  Lock, 
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Save,
  X,
  FileJson
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "banner" | "stats" | "admission" | "labels" | "translator" | "theme" | "security" | "backup">("general");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // স্কুলের তথ্য
  const [schoolName, setSchoolName] = useState("");
  const [schoolSlogan, setSchoolSlogan] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolEiin, setSchoolEiin] = useState("");
  const [schoolEstablished, setSchoolEstablished] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolCopyright, setSchoolCopyright] = useState("");

  // হিরো ব্যানার
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [showText, setShowText] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [opacity, setOpacity] = useState(60);

  // লাইভ পরিসংখ্যান
  const [statsStudents, setStatsStudents] = useState("");
  const [statsTeachers, setStatsTeachers] = useState("");
  const [statsPassRate, setStatsPassRate] = useState("");
  const [statsEstablished, setStatsEstablished] = useState("");

  // ভর্তি সেটিংস
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(true);
  const [admissionButtonText, setAdmissionButtonText] = useState("ভর্তি চলছে ২০২৬");
  const [applyButtonText, setApplyButtonText] = useState("অনলাইনে আবেদন করুন");
  const [externalLink, setExternalLink] = useState("");
  const [closedNotice, setClosedNotice] = useState("");
  const [instructions, setInstructions] = useState("");

  // UI Labels & বাটন ভাষা
  const [noticesTitle, setNoticesTitle] = useState("");
  const [noticesSubtitle, setNoticesSubtitle] = useState("");
  const [teachersTitle, setTeachersTitle] = useState("");
  const [messagesTitle, setMessagesTitle] = useState("");
  const [blogsTitle, setBlogsTitle] = useState("");
  const [applyButton, setApplyButton] = useState("");
  const [readMoreText, setReadMoreText] = useState("");
  const [viewAllText, setViewAllText] = useState("");
  const [quickAccessTitleText, setQuickAccessTitleText] = useState("");

  // গুগল ট্রান্সলেটর ও ভাষা সেটিংস
  const [isTranslatorEnabled, setIsTranslatorEnabled] = useState(true);
  const [defaultLang, setDefaultLang] = useState("bn");
  const [showTopBarLangButton, setShowTopBarLangButton] = useState(true);

  // থিম কালার
  const [themeColor, setThemeColor] = useState("emerald");

  // পাসওয়ার্ড পরিবর্তন
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ডাটাবেজ ডায়াগনস্টিক স্ট্যাটাস
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [checkingDb, setCheckingDb] = useState(false);

  // ব্যাকআপ প্রিভিউ ও নিশ্চিতকরণ স্টেট
  const [pendingBackup, setPendingBackup] = useState<{
    fileName: string;
    fileSize: string;
    jsonData: any;
    summary: {
      schoolName: string;
      teachers: number;
      staff: number;
      committee: number;
      notices: number;
      blogs: number;
      hasFooter: boolean;
      navbarLinks: number;
    };
  } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllSettings = async () => {
    try {
      const res = await fetch("/api/admin/all-data");
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};

        setSchoolName(data.schoolInfo?.name || "");
        setSchoolSlogan(data.schoolInfo?.slogan || "");
        setSchoolLogo(data.schoolInfo?.logo || "");
        setSchoolEiin(data.schoolInfo?.eiin || "");
        setSchoolEstablished(data.schoolInfo?.established || "");
        setSchoolPhone(data.schoolInfo?.contact?.phone || "");
        setSchoolEmail(data.schoolInfo?.contact?.email || "");
        setSchoolAddress(data.schoolInfo?.contact?.address || "");
        setSchoolCopyright(data.schoolInfo?.copyright || "");

        if (data.heroBanner) {
          setBannerTitle(data.heroBanner.title || "");
          setBannerSubtitle(data.heroBanner.subtitle || "");
          setBannerImage(data.heroBanner.image || "");
          setShowText(data.heroBanner.showText !== false);
          setShowButton(data.heroBanner.showButton !== false);
          setOpacity(data.heroBanner.opacity || 60);
        }

        if (data.stats) {
          setStatsStudents(data.stats.students || "");
          setStatsTeachers(data.stats.teachers || "");
          setStatsPassRate(data.stats.passRate || "");
          setStatsEstablished(data.stats.established || "");
        }

        if (data.admission) {
          setIsAdmissionOpen(data.admission.isOpen !== false);
          setAdmissionButtonText(data.admission.buttonText || "ভর্তি চলছে ২০২৬");
          setApplyButtonText(data.admission.applyButtonText || "অনলাইনে আবেদন করুন");
          setExternalLink(data.admission.externalLink || "");
          setClosedNotice(data.admission.closedNotice || "");
          setInstructions(data.admission.instructions || "");
        }

        if (data.uiLabels) {
          setNoticesTitle(data.uiLabels.noticesTitle || "");
          setNoticesSubtitle(data.uiLabels.noticesSubtitle || "");
          setTeachersTitle(data.uiLabels.teachersTitle || "");
          setMessagesTitle(data.uiLabels.messagesTitle || "");
          setBlogsTitle(data.uiLabels.blogsTitle || "");
          setApplyButton(data.uiLabels.applyButton || "");
          setReadMoreText(data.uiLabels.readMore || "");
          setViewAllText(data.uiLabels.viewAll || "");
          setQuickAccessTitleText(data.uiLabels.quickAccessTitle || "");
        }

        if (data.translationSettings) {
          setIsTranslatorEnabled(data.translationSettings.enabled !== false);
          setDefaultLang(data.translationSettings.defaultLanguage || "bn");
          setShowTopBarLangButton(data.translationSettings.showNavbarToggle !== false);
        }

        if (data.themeColor) setThemeColor(data.themeColor);
      }
    } catch {}
  };

  const checkDatabaseStatus = async () => {
    setCheckingDb(true);
    try {
      const res = await fetch("/api/database-status");
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({ configured: false, connected: false, message: "চেক ব্যর্থ হয়েছে" });
    }
    setCheckingDb(false);
  };

  useEffect(() => {
    fetchAllSettings();
    checkDatabaseStatus();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "school_info",
          name: schoolName,
          slogan: schoolSlogan,
          logo: schoolLogo,
          eiin: schoolEiin,
          established: schoolEstablished,
          phone: schoolPhone,
          email: schoolEmail,
          address: schoolAddress,
          copyright: schoolCopyright,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("স্কুলের তথ্য সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      } else {
        setMessage(data.message || "সংরক্ষণ করতে সমস্যা হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সার্ভারে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "hero_banner",
          title: bannerTitle,
          subtitle: bannerSubtitle,
          image: bannerImage,
          showText,
          showButton,
          opacity,
        }),
      });
      if (res.ok) {
        setMessage("ব্যানার সেটিংস সফলভাবে আপডেট হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      }
    } catch {
      setMessage("সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "stats",
          students: statsStudents,
          teachers: statsTeachers,
          passRate: statsPassRate,
          established: statsEstablished,
        }),
      });
      if (res.ok) {
        setMessage("পরিসংখ্যান সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      }
    } catch {
      setMessage("সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "admission",
          isOpen: isAdmissionOpen,
          buttonText: admissionButtonText,
          applyButtonText: applyButtonText,
          externalLink,
          closedNotice,
          instructions,
        }),
      });
      if (res.ok) {
        setMessage("ভর্তি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      }
    } catch {
      setMessage("সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveLabels = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "labels",
          noticesTitle,
          noticesSubtitle,
          teachersTitle,
          messagesTitle,
          blogsTitle,
          applyButton,
          readMore: readMoreText,
          viewAll: viewAllText,
          quickAccessTitle: quickAccessTitleText,
        }),
      });
      if (res.ok) {
        setMessage("বাটন ও ইউআই ভাষা লেবেল সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      } else {
        setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সার্ভারে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleSaveTranslator = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "translator",
          enabled: isTranslatorEnabled,
          defaultLanguage: defaultLang,
          showNavbarToggle: showTopBarLangButton,
          translationMethod: "google",
        }),
      });
      if (res.ok) {
        setMessage("গুগল ট্রান্সলেটর সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      } else {
        setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সার্ভারে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleSaveTheme = async (color: string) => {
    setLoading(true);
    setThemeColor(color);
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "theme_color",
          themeColor: color,
        }),
      });
      if (res.ok) {
        setMessage(`থিম কালার '${color}' সফলভাবে আপডেট হয়েছে!`);
        setIsError(false);
        fetchAllSettings();
      }
    } catch {
      setMessage("থিম পরিবর্তন ব্যর্থ হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        setIsError(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        setMessage(data.message || "পাসওয়ার্ড আপডেট ব্যর্থ!");
        setIsError(true);
      }
    } catch {
      setMessage("সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleBackupFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      if (!jsonData || typeof jsonData !== "object") {
        throw new Error("Invalid format");
      }

      setPendingBackup({
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + " KB",
        jsonData,
        summary: {
          schoolName: jsonData.schoolInfo?.name || "পাওয়া যায়নি",
          teachers: Array.isArray(jsonData.teachers) ? jsonData.teachers.length : 0,
          staff: Array.isArray(jsonData.staff) ? jsonData.staff.length : 0,
          committee: Array.isArray(jsonData.committee) ? jsonData.committee.length : 0,
          notices: Array.isArray(jsonData.notices) ? jsonData.notices.length : 0,
          blogs: Array.isArray(jsonData.blogs) ? jsonData.blogs.length : 0,
          hasFooter: Boolean(jsonData.footerData),
          navbarLinks: Array.isArray(jsonData.navbarLinks) ? jsonData.navbarLinks.length : 0,
        }
      });
      setMessage("ফাইল যাচাইকরণ সফল হয়েছে। রিস্টোর কার্যকর করতে নিচে 'রিস্টোর নিশ্চিত করুন' বাটনে ক্লিক করুন।");
      setIsError(false);
    } catch {
      setMessage("ত্রুটি: এটি একটি বৈধ ব্যাকআপ JSON ফাইল নয়!");
      setIsError(true);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setTimeout(() => setMessage(""), 5000);
  };

  const handleConfirmRestore = async () => {
    if (!pendingBackup) return;
    setIsRestoring(true);
    try {
      const res = await fetch("/api/backup/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingBackup.jsonData),
      });

      if (res.ok) {
        setMessage("ব্যাকআপ সফলভাবে রিস্টোর হয়েছে এবং ওয়েবসাইট আপডেট সম্পন্ন হয়েছে!");
        setIsError(false);
        setPendingBackup(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchAllSettings();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("school-info-updated", { detail: pendingBackup.jsonData.schoolInfo }));
          if (pendingBackup.jsonData.footerData) {
            window.dispatchEvent(new CustomEvent("footer-updated", { detail: pendingBackup.jsonData.footerData }));
          }
        }
      } else {
        setMessage("ব্যাকআপ রিস্টোর ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("রিস্টোর করার সময় ত্রুটি ঘটেছে!");
      setIsError(true);
    } finally {
      setIsRestoring(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleCancelRestore = () => {
    setPendingBackup(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage("ব্যাকআপ রিস্টোর বাতিল করা হয়েছে।");
    setIsError(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">সেটিংস কন্ট্রোল সেন্টার</h1>
          <p className="text-xs text-slate-500 mt-1">ওয়েবসাইটের তথ্য, ব্যানার, ভর্তি ও ক্লাউড ডাটাবেজ পরিচালনা</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border ${
          isError ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          {message}
        </div>
      )}

      {/* সেটিংস ট্যাব বার */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "general" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>স্কুলের তথ্য ও ফুটার</span>
        </button>

        <button
          onClick={() => setActiveTab("banner")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "banner" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>ব্যানার কন্ট্রোল</span>
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "stats" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>পরিসংখ্যান</span>
        </button>

        <button
          onClick={() => setActiveTab("admission")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "admission" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>ভর্তি সেটিংস</span>
        </button>

        <button
          onClick={() => setActiveTab("labels")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "labels" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Type className="w-4 h-4" />
          <span>বাটন ও ভাষা লেবেল</span>
        </button>

        <button
          onClick={() => setActiveTab("translator")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "translator" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          <span>🌐</span>
          <span>গুগল ট্রান্সলেটর</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "theme" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>থিম ও কালার</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "backup" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>ডাটাবেজ ও ব্যাকআপ</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === "security" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>নিরাপত্তা ও পাসওয়ার্ড</span>
        </button>
      </div>

      {/* ট্যাব কনটেন্ট ১: সাধারণ তথ্য */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">স্কুলের সাধারণ পরিচিতি ও ফুটার</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বিদ্যালয়ের নাম *</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মূলমন্ত্র / স্লোগান</label>
              <input
                type="text"
                value={schoolSlogan}
                onChange={(e) => setSchoolSlogan(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">EIIN নম্বর</label>
              <input
                type="text"
                value={schoolEiin}
                onChange={(e) => setSchoolEiin(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠার সাল</label>
              <input
                type="text"
                value={schoolEstablished}
                onChange={(e) => setSchoolEstablished(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর / হটলাইন</label>
              <input
                type="text"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
              <input
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল ঠিকানা</label>
              <input
                type="text"
                value={schoolAddress}
                onChange={(e) => setSchoolAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUploadInput
                label="বিদ্যালয়ের লোগো"
                value={schoolLogo}
                onChange={setSchoolLogo}
                helpText="বিদ্যালয়ের প্রাতিষ্ঠানিক লোগো (PNG বা স্বচ্ছ ব্যাকগ্রাউন্ড সুপারিশকৃত)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>স্কুলের তথ্য সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট ২: ব্যানার */}
      {activeTab === "banner" && (
        <form onSubmit={handleSaveBanner} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">হোমপেজ হিরো ব্যানার কন্ট্রোল</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্যানার শিরোনাম *</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সাবটাইটেল / স্লোগান</label>
              <input
                type="text"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <ImageUploadInput
              label="ব্যানার ব্যাকগ্রাউন্ড ছবি"
              value={bannerImage}
              onChange={setBannerImage}
              helpText="হোমপেজ হিরো সেকশনের আকর্ষণীয় হাই-রেজ্যুলেশন ব্যাকগ্রাউন্ড ছবি (১৬:৯ রেশিও সুপারিশকৃত)"
            />

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showText}
                  onChange={(e) => setShowText(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>ব্যানারের টেক্সট প্রদর্শন করুন</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showButton}
                  onChange={(e) => setShowButton(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>ভর্তি বাটন প্রদর্শন করুন</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ব্যানার সেটিংস সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট ৩: পরিসংখ্যান */}
      {activeTab === "stats" && (
        <form onSubmit={handleSaveStats} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">হোমপেজ লাইভ পরিসংখ্যান কাউন্টার</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মোট শিক্ষার্থী সংখ্যা</label>
              <input
                type="text"
                value={statsStudents}
                onChange={(e) => setStatsStudents(e.target.value)}
                placeholder="যেমন: ১২৫০+"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষকমণ্ডলী সংখ্যা</label>
              <input
                type="text"
                value={statsTeachers}
                onChange={(e) => setStatsTeachers(e.target.value)}
                placeholder="যেমন: ৪৫+"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসের হার</label>
              <input
                type="text"
                value={statsPassRate}
                onChange={(e) => setStatsPassRate(e.target.value)}
                placeholder="যেমন: ৯৮.৫%"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠিত সাল</label>
              <input
                type="text"
                value={statsEstablished}
                onChange={(e) => setStatsEstablished(e.target.value)}
                placeholder="যেমন: ১৯৭৫"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>পরিসংখ্যান সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট ৪: ভর্তি সেটিংস */}
      {activeTab === "admission" && (
        <form onSubmit={handleSaveAdmission} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">ভর্তি কার্যক্রম ও অনলাইন আবেদন কন্ট্রোল</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmissionOpen}
                onChange={(e) => setIsAdmissionOpen(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600"
              />
              <div>
                <span className="font-bold text-sm text-emerald-900">ভর্তি কার্যক্রম সক্রিয় রাখুন</span>
                <p className="text-xs text-emerald-700">টিক চিহ্ন দেওয়া থাকলে হোমপেজ ও ব্যানারে ভর্তি বাটন দৃশ্যমান থাকবে।</p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি বাটন টেক্সট</label>
                <input
                  type="text"
                  value={admissionButtonText}
                  onChange={(e) => setAdmissionButtonText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">আবেদন বাটন টেক্সট</label>
                <input
                  type="text"
                  value={applyButtonText}
                  onChange={(e) => setApplyButtonText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অনলাইন আবেদন ফরমের এক্সটারনাল লিঙ্ক (ঐচ্ছিক)</label>
              <input
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="যেমন: Google Forms বা অন্য কোনো আবেদন সফটওয়্যারের লিঙ্ক"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি নির্দেশনাবলী</label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ভর্তি সেটিংস সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট: বাটন ও ইউআই ভাষা লেবেল */}
      {activeTab === "labels" && (
        <form onSubmit={handleSaveLabels} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-600" />
              <span>বাটন ও ইউআই ভাষা লেবেল পরিচালনা</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ওয়েবসাইটের বিভিন্ন সেকশনের শিরোনাম, সাবটাইটেল এবং বাটন টেক্সট নিজের মতো করে পরিবর্তন করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ সেকশন শিরোনাম</label>
              <input
                type="text"
                value={noticesTitle}
                onChange={(e) => setNoticesTitle(e.target.value)}
                placeholder="যেমন: সর্বশেষ নোটিশ সমূহ"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ সাবটাইটেল</label>
              <input
                type="text"
                value={noticesSubtitle}
                onChange={(e) => setNoticesSubtitle(e.target.value)}
                placeholder="যেমন: গুরুত্বপূর্ণ প্রাতিষ্ঠানিক নোটিশ ও ঘোষণা"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক সেকশন শিরোনাম</label>
              <input
                type="text"
                value={teachersTitle}
                onChange={(e) => setTeachersTitle(e.target.value)}
                placeholder="যেমন: আমাদের সম্মানিত শিক্ষকবৃন্দ"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বাণী সেকশন শিরোনাম</label>
              <input
                type="text"
                value={messagesTitle}
                onChange={(e) => setMessagesTitle(e.target.value)}
                placeholder="যেমন: বিদ্যালয় বাণী ও দিকনির্দেশনা"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ব্লগ ও সংবাদ শিরোনাম</label>
              <input
                type="text"
                value={blogsTitle}
                onChange={(e) => setBlogsTitle(e.target.value)}
                placeholder="যেমন: ব্লগ ও সাম্প্রতিক প্রবন্ধ"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">কুইক অ্যাক্সেস পোর্টাল শিরোনাম</label>
              <input
                type="text"
                value={quickAccessTitleText}
                onChange={(e) => setQuickAccessTitleText(e.target.value)}
                placeholder="যেমন: তাৎক্ষণিক সেবা ও পোর্টাল"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি/আবেদন বাটন লেবেল</label>
              <input
                type="text"
                value={applyButton}
                onChange={(e) => setApplyButton(e.target.value)}
                placeholder="যেমন: অনলাইনে আবেদন করুন"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">'বিস্তারিত পড়ুন' বাটন লেবেল</label>
              <input
                type="text"
                value={readMoreText}
                onChange={(e) => setReadMoreText(e.target.value)}
                placeholder="যেমন: বিস্তারিত পড়ুন"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">'সকল দেখুন' বাটন লেবেল</label>
              <input
                type="text"
                value={viewAllText}
                onChange={(e) => setViewAllText(e.target.value)}
                placeholder="যেমন: সকল দেখুন"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>বাটন ও ভাষা লেবেল সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট: গুগল ট্রান্সলেটর ও বহুভাষিক সেটিংস */}
      {activeTab === "translator" && (
        <form onSubmit={handleSaveTranslator} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span>গুগল ট্রান্সলেটর ও ভাষা রূপান্তর সেটিংস</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              গুগল ট্রান্সলেটরের মাধ্যমে আপনার সমগ্র ওয়েবসাইট এক ক্লিকে বাংলা থেকে ইংরেজিতে স্বয়ংক্রিয়ভাবে রূপান্তর করা যাবে।
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isTranslatorEnabled}
                onChange={(e) => setIsTranslatorEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-amber-600"
              />
              <div>
                <span className="font-bold text-sm text-amber-950">গুগল ট্রান্সলেটর সক্রিয় রাখুন</span>
                <p className="text-xs text-amber-800">ওয়েবসাইটের ভিজিটররা যাতে যে কোনো সময় বাংলা এবং ইংরেজিতে সুইচ করতে পারেন।</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showTopBarLangButton}
                onChange={(e) => setShowTopBarLangButton(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
              <div>
                <span className="font-bold text-sm text-slate-900">টপ বারে ভাষা পরিবর্তন বাটন (🌐 English / বাংলা) প্রদর্শন করুন</span>
                <p className="text-xs text-slate-500">নেভিগেশন বারের সবার উপরে ভিজিটরদের জন্য ভাষা পরিবর্তনের সরাসরি টগল বাটন।</p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ওয়েবসাইটের মূল ডিফল্ট ভাষা</label>
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none bg-white font-medium"
                >
                  <option value="bn">বাংলা (Bengali - প্রাথমিক)</option>
                  <option value="en">English (ইংরেজি)</option>
                </select>
              </div>
            </div>

            {/* সরাসরি টেস্ট ও ডায়াগনস্টিকস */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>সরাসরি ট্রান্সলেটর টেস্ট করুন:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      document.cookie = "googtrans=/bn/en; path=/";
                      document.cookie = `googtrans=/bn/en; domain=${window.location.hostname}; path=/`;
                      localStorage.setItem("site_lang", "en");
                      const gtSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
                      if (gtSelect) {
                        gtSelect.value = "en";
                        gtSelect.dispatchEvent(new Event("change"));
                      } else {
                        window.location.reload();
                      }
                    }
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  🌐 ইংরেজিতে টেস্ট করুন (Switch to English)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      document.cookie = "googtrans=/bn/bn; path=/";
                      document.cookie = `googtrans=/bn/bn; domain=${window.location.hostname}; path=/`;
                      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      localStorage.setItem("site_lang", "bn");
                      const gtSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
                      if (gtSelect) {
                        gtSelect.value = "bn";
                        gtSelect.dispatchEvent(new Event("change"));
                      } else {
                        window.location.reload();
                      }
                    }
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  🇧🇩 বাংলায় ফেরত যান (Switch to Bengali)
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>গুগল ট্রান্সলেটর সেটিংস সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* ট্যাব কনটেন্ট: থিম ও কালার */}
      {activeTab === "theme" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>ব্র্যান্ড ও থিম কালার সেটিংস</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              বিদ্যালয়ের প্রতিষ্ঠানের পরিচয়ের সাথে মিলিয়ে পছন্দের থিম কালার প্যালেট নির্বাচন করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "emerald", name: "মরকত সবুজ (Emerald)", bg: "bg-emerald-600", border: "border-emerald-500" },
              { id: "blue", name: "রাজকীয় নীল (Royal Blue)", bg: "bg-blue-600", border: "border-blue-500" },
              { id: "indigo", name: "নীলমাধুরী (Indigo)", bg: "bg-indigo-600", border: "border-indigo-500" },
              { id: "amber", name: "স্বর্ণালী (Amber)", bg: "bg-amber-500", border: "border-amber-400" },
              { id: "purple", name: "আভিজাত্য (Purple)", bg: "bg-purple-600", border: "border-purple-500" },
              { id: "rose", name: "গোলাপী লাল (Rose)", bg: "bg-rose-600", border: "border-rose-500" },
            ].map((c) => {
              const isSelected = themeColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSaveTheme(c.id)}
                  disabled={loading}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                    isSelected ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full shrink-0 shadow-xs ${c.bg}`}></span>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 truncate">{c.name}</span>
                    <span className="block text-[10px] text-slate-500">{isSelected ? "সক্রিয় রয়েছে ✓" : "ক্লিক করে সেট করুন"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৫: ডাটাবেজ ও ব্যাকআপ সেন্টার */}
      {activeTab === "backup" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">ডাটাবেজ সংযোগ ও ব্যাকআপ সেন্টার</h2>
              <p className="text-xs text-slate-500">আপনার ডাটা স্থায়ীত্ব পরীক্ষা করুন এবং অফলাইন ব্যাকআপ নিন</p>
            </div>
            <button
              type="button"
              onClick={checkDatabaseStatus}
              disabled={checkingDb}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingDb ? "animate-spin" : ""}`} />
              <span>পুনরায় চেক করুন</span>
            </button>
          </div>

          {/* লাইভ ডাটাবেজ স্ট্যাটাস কার্ড */}
          <div className={`p-5 rounded-2xl border ${
            dbStatus?.connected 
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
              : "bg-amber-50/70 border-amber-200 text-amber-900"
          }`}>
            <div className="flex items-start gap-3">
              {dbStatus?.connected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h3 className="font-bold text-sm">
                  {dbStatus?.connected 
                    ? `সফলভাবে সংযুক্ত: ${dbStatus.type === "vercel-postgres" ? "Vercel Postgres (Neon / Supabase)" : "Firebase Firestore"}` 
                    : "ক্লাউড ডাটাবেজ সক্রিয় নেই"}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  {dbStatus?.message || "স্ট্যাটাস চেক করা হচ্ছে..."}
                </p>
                {dbStatus?.lastUpdatedAt && (
                  <p className="text-[11px] font-semibold opacity-75 pt-1">
                    সর্বশেষ আপডেট সময়: {new Date(dbStatus.lastUpdatedAt).toLocaleString("bn-BD")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ব্যাকআপ ডাউনলোড */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span>১-ক্লিকে সম্পূর্ণ সাইট ব্যাকআপ ডাউনলোড করুন</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              আপনার ওয়েবসাইটের সকল নোটিশ, শিক্ষক তালিকা, স্কুলের তথ্য ও সেটিংস একটি নিরাপদ `.json` ফাইল হিসেবে আপনার কম্পিউটারে সংরক্ষণ করুন।
            </p>
            <a
              href="/api/backup/download"
              download="school_cms_backup.json"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>JSON ব্যাকআপ ডাউনলোড</span>
            </a>
          </div>

          {/* ব্যাকআপ আপলোড / রিস্টোর */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>ব্যাকআপ রিস্টোর করুন (Restore)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              পূর্বে ডাউনলোড করা কোনো `.json` ব্যাকআপ ফাইল থাকলে সেটি আপলোড করে সাথে সাথে পুরো ওয়েবসাইট আগের অবস্থায় ফিরিয়ে আনতে পারবেন।
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleBackupFileSelect}
              className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />

            {/* ব্যাকআপ রিস্টোর নিশ্চিতকরণ প্রিভিউ কার্ড */}
            {pendingBackup && (
              <div className="mt-4 p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-950">
                        ব্যাকআপ ফাইল প্রস্তুত: {pendingBackup.fileName} ({pendingBackup.fileSize})
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        ফাইলটি সফলভাবে রিড করা হয়েছে। রিস্টোর সম্পন্ন করতে নিচের নিশ্চিতকরণ বাটনে ক্লিক করুন।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelRestore}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-amber-100 rounded-lg cursor-pointer"
                    title="বাতিল করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ডিটেক্টেড ডেটা সামারি */}
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 space-y-2">
                  <p className="text-[11px] font-bold text-slate-700">ফাইলে প্রাপ্ত তথ্যের বিবরণ:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium">
                      🏫 {pendingBackup.summary.schoolName}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">
                      👨‍🏫 শিক্ষক: {pendingBackup.summary.teachers} জন
                    </span>
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-medium">
                      📢 নোটিশ: {pendingBackup.summary.notices} টি
                    </span>
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-medium">
                      👥 কর্মচারী: {pendingBackup.summary.staff} জন
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium">
                      💼 কমিটি: {pendingBackup.summary.committee} জন
                    </span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium">
                      📋 মেনুবার: {pendingBackup.summary.navbarLinks} টি
                    </span>
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-medium">
                      🦶 ফুটার সেটিংস: {pendingBackup.summary.hasFooter ? "অন্তর্ভুক্ত ✓" : "সাধারণ"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold bg-amber-100/60 p-2.5 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>সতর্কতা: এটি নিশ্চিত করলে বর্তমান ওয়েবসাইট ডেটা এই ব্যাকআপ ফাইলের ডেটা দিয়ে প্রতিস্থাপিত হবে।</span>
                </div>

                {/* একশন বাটনসমূহ */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmRestore}
                    disabled={isRestoring}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isRestoring ? "animate-spin" : ""}`} />
                    <span>{isRestoring ? "রিস্টোর হচ্ছে..." : "✓ রিস্টোর নিশ্চিত করুন"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelRestore}
                    disabled={isRestoring}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>বাতিল</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ট্যাব কনটেন্ট ৬: নিরাপত্তা ও পাসওয়ার্ড */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-xl">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পুরোনো পাসওয়ার্ড *</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>পাসওয়ার্ড পরিবর্তন করুন</span>
          </button>
        </form>
      )}
    </div>
  );
}
