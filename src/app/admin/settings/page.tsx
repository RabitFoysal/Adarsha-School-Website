"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "banner" | "stats" | "admission" | "labels" | "security" | "backup">("general");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // স্কুলের তথ্য স্টেট
  const [schoolName, setSchoolName] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolCopyright, setSchoolCopyright] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // হিরো ব্যানার স্টেট
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [showText, setShowText] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [opacity, setOpacity] = useState(60);
  const [bgPosition, setBgPosition] = useState("center");
  const [textAlign, setTextAlign] = useState("center");
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // লাইভ পরিসংখ্যান স্টেট (নতুন)
  const [statsStudents, setStatsStudents] = useState("");
  const [statsTeachers, setStatsTeachers] = useState("");
  const [statsPassRate, setStatsPassRate] = useState("");
  const [statsEstablished, setStatsEstablished] = useState("");

  // ভর্তি সেটিংস স্টেট
  const [externalLink, setExternalLink] = useState("");
  const [showNavbarButton, setShowNavbarButton] = useState(true);
  const [instructions, setInstructions] = useState("");

  // ভাষা ও টেক্সট সেটিংস স্টেট (UI Labels)
  const [noticesTitle, setNoticesTitle] = useState("");
  const [noticesSubtitle, setNoticesSubtitle] = useState("");
  const [teachersTitle, setTeachersTitle] = useState("");
  const [messagesTitle, setMessagesTitle] = useState("");
  const [blogsTitle, setBlogsTitle] = useState("");
  const [applyButton, setApplyButton] = useState("");

  // নিরাপত্তা সেটিংস স্টেট
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const fetchAllSettings = async () => {
    const res = await fetch("/api/school-info");
    if (res.ok) {
      const data = await res.json();
      setSchoolName(data.schoolInfo.name);
      setSchoolLogo(data.schoolInfo.logo);
      setSchoolAddress(data.schoolInfo.contact.address);
      setSchoolCopyright(data.schoolInfo.copyright || "");

      setBannerTitle(data.heroBanner.title);
      setBannerSubtitle(data.heroBanner.subtitle);
      setBannerImage(data.heroBanner.image);
      setShowText(data.heroBanner.showText !== false);
      setShowButton(data.heroBanner.showButton !== false);
      setOpacity(data.heroBanner.opacity || 60);
      setBgPosition(data.heroBanner.bgPosition || "center");
      setTextAlign(data.heroBanner.textAlign || "center");

      // পরিসংখ্যান ডাটা লোড (নতুন)
      const stats = data.stats || {};
      setStatsStudents(stats.students || "৪৫০+");
      setStatsTeachers(stats.teachers || "১৫+");
      setStatsPassRate(stats.passRate || "১০০%");
      setStatsEstablished(stats.established || "১৯৭৫");

      // UI Labels লোড
      const labels = data.uiLabels || {};
      setNoticesTitle(labels.noticesTitle || "সর্বশেষ নোটিশ সমূহ");
      setNoticesSubtitle(labels.noticesSubtitle || "বিদ্যালয়ের গুরুত্বপূর্ণ নোটিশ ও ঘোষণা");
      setTeachersTitle(labels.teachersTitle || "আমাদের সম্মানিত শিক্ষকবৃন্দ");
      setMessagesTitle(labels.messagesTitle || "বিদ্যালয় বাণী");
      setBlogsTitle(labels.blogsTitle || "ব্লগ ও আর্টিকেল সমূহ");
      setApplyButton(labels.applyButton || "ভর্তি তথ্য জানুন");

      fetch("/api/school-info")
        .then(r => r.json())
        .then(dData => {
          setExternalLink(dData.admission?.externalLink || "");
          setShowNavbarButton(dData.admission?.showNavbarButton !== false);
          setInstructions(dData.admission?.instructions || "");
        });
    }
  };

  useEffect(() => { fetchAllSettings(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (target === "logo") setUploadingLogo(true);
    else setUploadingBanner(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=banners", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (target === "logo") setSchoolLogo(data.url);
        else setBannerImage(data.url);
      }
    } catch (err) { alert("সমস্যা!"); } finally { setUploadingLogo(false); setUploadingBanner(false); }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "school_info", name: schoolName, logo: schoolLogo, address: schoolAddress, copyright: schoolCopyright })
      });
      if (res.ok) { setMessage("স্কুলের তথ্য সফলভাবে সংরক্ষিত হয়েছে!"); setIsError(false); fetchAllSettings(); }
    } catch (err) { setMessage("সমস্যা!"); setIsError(true); }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero_banner", image: bannerImage, title: bannerTitle, subtitle: bannerSubtitle, showText, showButton, opacity, bgPosition, textAlign })
      });
      if (res.ok) { setMessage("ব্যানার সেটিংস সফলভাবে আপডেট হয়েছে!"); setIsError(false); fetchAllSettings(); }
    } catch (err) { setMessage("সমস্যা!"); setIsError(true); }
    setTimeout(() => setMessage(""), 3000);
  };

  // লাইভ পরিসংখ্যান সেভ হ্যান্ডলার (নতুন)
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "stats",
          students: statsStudents,
          teachers: statsTeachers,
          passRate: statsPassRate,
          established: statsEstablished
        })
      });
      if (res.ok) {
        setMessage("বিদ্যালয়ের লাইভ পরিসংখ্যান সফলভাবে সংরক্ষিত হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      }
    } catch (err) {
      setMessage("সংরক্ষণ করতে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "admission", externalLink, showNavbarButton, instructions })
      });
      if (res.ok) { setMessage("ভর্তি তথ্য সফলভাবে সংরক্ষিত হয়েছে!"); setIsError(false); fetchAllSettings(); }
    } catch (err) { setMessage("সমস্যা!"); setIsError(true); }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveLabels = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/custom-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_labels",
          labels: { noticesTitle, noticesSubtitle, teachersTitle, messagesTitle, blogsTitle, applyButton }
        })
      });
      if (res.ok) { setMessage("হোমপেজ ও বাটনের ভাষা সফলভাবে আপডেট হয়েছে!"); setIsError(false); fetchAllSettings(); }
    } catch (err) { setMessage("সমস্যা!"); setIsError(true); }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/update-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { setMessage(data.message); setIsError(false); setOldPassword(""); setNewPassword(""); } else { setMessage(data.message); setIsError(true); }
    } catch (error) { setMessage("সমস্যা!"); setIsError(true); } finally { setPassLoading(false); setTimeout(() => setMessage(""), 3000); }
  };

  const handleBackupUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      const res = await fetch("/api/backup/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
      });
      
      if (res.ok) {
        setMessage("ব্যাকআপ সফলভাবে রিস্টোর হয়েছে!");
        setIsError(false);
        fetchAllSettings();
      } else {
        setMessage("ব্যাকআপ রিস্টোর করতে সমস্যা হয়েছে!");
        setIsError(true);
      }
    } catch (err) {
      setMessage("অকার্যকর JSON ফাইল!");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">সেটিংস কন্ট্রোল সেন্টার</h1>
      {message && <div className={`p-4 rounded-lg mb-6 font-bold text-sm ${isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>{message}</div>}

      <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-8">
        <button onClick={() => { setActiveTab("general"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "general" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>🏫 স্কুলের তথ্য ও ফুটার</button>
        <button onClick={() => { setActiveTab("banner"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "banner" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>🌄 ব্যানার কন্ট্রোল</button>
        <button onClick={() => { setActiveTab("stats"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "stats" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>📊 পরিসংখ্যান সেটিংস</button>
        <button onClick={() => { setActiveTab("admission"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "admission" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>🎓 ভর্তি সেটিংস</button>
        <button onClick={() => { setActiveTab("labels"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "labels" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>✍️ বাটন ও লেখার ভাষা সেটিংস</button>
        <button onClick={() => { setActiveTab("security"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "security" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>🔑 নিরাপত্তা (পাসওয়ার্ড)</button>
        <button onClick={() => { setActiveTab("backup"); setMessage(""); }} className={`pb-4 px-4 font-bold text-sm transition ${activeTab === "backup" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>💾 ব্যাকআপ ও রিস্টোর</button>
      </div>

      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-8 rounded-xl border space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">বিদ্যালয়ের তথ্য ও কপিরাইট</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">প্রতিষ্ঠানের নাম</label><input type="text" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ফুটার ঠিকানা</label><input type="text" required value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ফুটার কপিরাইট লেখা</label><input type="text" required value={schoolCopyright} onChange={(e) => setSchoolCopyright(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">প্রতিষ্ঠানের লোগো আপলোড</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} disabled={uploadingLogo} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 cursor-pointer" />
            <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">ℹ️ <b>পরামর্শ:</b> প্রতিষ্ঠানের লোগোর জন্য ১:১ বর্গাকার (Square) ছবি ব্যবহার করুন। আদর্শ সাইজ: <b>১৫০x১৫০ পিক্সেল</b>।</p>
            {uploadingLogo && <p className="text-xs text-blue-600 mt-1">লোগো আপলোড হচ্ছে...</p>}
            {schoolLogo && <div className="mt-4 border p-2 rounded bg-gray-50 w-24 h-24 mx-auto flex items-center justify-center"><img src={schoolLogo} alt="Logo" className="max-w-full max-h-full rounded-full object-cover" /></div>}
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg">তথ্য সেভ করুন</button>
        </form>
      )}

      {activeTab === "banner" && (
        <form onSubmit={handleSaveBanner} className="bg-white p-8 rounded-xl border space-y-6 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">হিরো ব্যানার ডিজাইন সেটিংস</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ব্যানার টাইটেল</label><input type="text" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ব্যানার সাব-টাইটেল</label><input type="text" value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">কালো শেডের অপাসিটি ({opacity}%)</label><input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ছবির পজিশন</label><select value={bgPosition} onChange={(e) => setBgPosition(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none"><option value="center">সেন্টার</option><option value="top">টপ</option><option value="bottom">বটম</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">লেখা ও বাটনের পজিশন</label><select value={textAlign} onChange={(e) => setTextAlign(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none"><option value="center">মাঝখানে (Center)</option><option value="left">বাম কোনায় (Left)</option><option value="right">ডান কোনায় (Right)</option></select></div>
          </div>
          <div className="flex gap-8 bg-gray-50 p-4 rounded-lg border">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 text-sm"><input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />ব্যানারের লেখা দেখান</label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 text-sm"><input type="checkbox" checked={showButton} onChange={(e) => setShowButton(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />ব্যানার বাটন দেখান</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ব্যানার ব্যাকগ্রাউন্ড ছবি পরিবর্তন</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "banner")} disabled={uploadingBanner} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 cursor-pointer" />
            <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">ℹ️ <b>পরামর্শ:</b> হোমপেজের ব্যানারের জন্য ১৬:৯ অনুপাতের চওড়া (Landscape) ছবি ব্যবহার করুন। আদর্শ সাইজ: <b>১৯২০x১০৮০ পিক্সেল</b>।</p>
            {bannerImage && <div className="mt-4 border p-2 rounded bg-gray-50 max-w-sm"><img src={bannerImage} alt="Banner" className="w-full h-32 object-cover rounded" /></div>}
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg w-full">ব্যানার ডিজাইন আপডেট করুন</button>
        </form>
      )}

      {/* নতুন ট্যাব: স্কুলের লাইভ পরিসংখ্যান এডিটর ফর্ম */}
      {activeTab === "stats" && (
        <form onSubmit={handleSaveStats} className="bg-white p-8 rounded-xl border space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">বিদ্যালয়ের লাইভ পরিসংখ্যান এডিটর</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মোট শিক্ষার্থী</label>
              <input type="text" required value={statsStudents} onChange={(e) => setStatsStudents(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" placeholder="যেমন: ৪৫০+" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মোট শিক্ষক ও কর্মচারী</label>
              <input type="text" required value={statsTeachers} onChange={(e) => setStatsTeachers(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" placeholder="যেমন: ১৫+" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসের হার</label>
              <input type="text" required value={statsPassRate} onChange={(e) => setStatsPassRate(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" placeholder="যেমন: ১০০%" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">বিদ্যালয়ের প্রতিষ্ঠা সাল</label>
              <input type="text" required value={statsEstablished} onChange={(e) => setStatsEstablished(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" placeholder="যেমন: ১৯৭৫" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg w-full">পরিসংখ্যান ডাটা সেভ করুন</button>
        </form>
      )}

      {activeTab === "admission" && (
        <form onSubmit={handleSaveAdmission} className="bg-white p-8 rounded-xl border space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">অনлайн ভর্তি ও সফটওয়্যার লিঙ্ক কানেকশন</h2>
          <div><label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-red-600">ভর্তি আবেদন লিঙ্ক</label><input type="url" required value={externalLink} onChange={(e) => setExternalLink(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" /></div>
          <div className="bg-gray-50 p-4 rounded-lg border"><label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 text-sm"><input type="checkbox" checked={showNavbarButton} onChange={(e) => setShowNavbarButton(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />নেভ বারের (Navbar) ডান কোনায় "ভর্তি তথ্য" বাটনটি দেখান</label></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">ভর্তি নির্দেশনাবলী ও নিয়মসমূহ</label><textarea rows={6} required value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none" /></div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg w-full">ভর্তি তথ্য ও লিংক সেভ করুন</button>
        </form>
      )}

      {activeTab === "labels" && (
        <form onSubmit={handleSaveLabels} className="bg-white p-8 rounded-xl border space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">হোমপেজের বাটন ও সেকশন সমূহের ভাষা কাস্টমাইজেশন</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">নোটিশ বোর্ডের শিরোনাম</label><input type="text" value={noticesTitle} onChange={(e) => setNoticesTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">নোটিশ বোর্ডের সাব-টাইটেল</label><input type="text" value={noticesSubtitle} onChange={(e) => setNoticesSubtitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">শিক্ষক সেকশনের শিরোনাম</label><input type="text" value={teachersTitle} onChange={(e) => setTeachersTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">বাণী সেকশনের শিরোনাম</label><input type="text" value={messagesTitle} onChange={(e) => setMessagesTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ব্লগ সেকশনের শিরোনাম</label><input type="text" value={blogsTitle} onChange={(e) => setBlogsTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ব্যানার ভর্তি বাটন টেক্সট</label><input type="text" value={applyButton} onChange={(e) => setApplyButton(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg w-full">বাটন ও লেখার ভাষা আপডেট করুন</button>
        </form>
      )}

      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="bg-white p-8 rounded-xl border space-y-6 max-w-xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">নিরাপত্তা - পাসওয়ার্ড পরিবর্তন</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">পুরোনো পাসওয়ার্ড</label><input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড</label><input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border bg-white text-gray-900 outline-none" /></div>
          </div>
          <button type="submit" disabled={passLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg w-full">পাসওয়ার্ড আপডেট করুন</button>
        </form>
      )}

      {activeTab === "backup" && (
        <div className="bg-white p-8 rounded-xl border space-y-6 max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">ডাটা ব্যাকআপ এবং রিস্টোর</h2>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">📥 ব্যাকআপ ডাউনলোড করুন</h3>
            <p className="text-sm text-blue-700 mb-4">আপনার ওয়েবসাইটের সম্পূর্ণ ডাটা (সেটিংস, নোটিশ, পেজ, গ্যালারি) একটি JSON ফাইল হিসেবে লোকালি সেভ করে রাখুন।</p>
            <a href="/api/backup/download" download="school_cms_backup.json" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">JSON ফাইল ডাউনলোড করুন</a>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">📤 ব্যাকআপ রিস্টোর করুন (Upload)</h3>
            <p className="text-sm text-green-700 mb-4">আপনার কাছে আগে থেকে সেভ করা কোনো ব্যাকআপ JSON ফাইল থাকলে সেটি আপলোড করে আগের ডাটা ফিরিয়ে আনুন। (সতর্কতা: এটি বর্তমান ডাটা মুছে ফেলবে)</p>
            <input type="file" accept=".json" onChange={handleBackupUpload} className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-gray-900 cursor-pointer" />
          </div>
        </div>
      )}

    </div>
  );
}