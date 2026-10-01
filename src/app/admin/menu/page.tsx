"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  ExternalLink,
  Menu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import demoData from "@/data/demoData.json";

type SubLink = { id: number; name: string; url: string; };
type NavLink = { id: number; name: string; url: string; parentId: number | null; active: boolean; items?: SubLink[]; };

export default function ManageMenu() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // ইনলাইন এডিটিং স্টেট
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editParentId, setEditParentId] = useState<string>("");

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/custom-pages");
      const data = await res.json();
      if (Array.isArray(data.navbarLinks)) {
        setLinks(data.navbarLinks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    fetchMenu(); 
  }, []);

  const dispatchNavUpdate = (updatedLinks: NavLink[]) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("school-info-updated", {
        detail: { navbarLinks: updatedLinks }
      }));
    }
  };

  // ক. নতুন মেনু লিঙ্ক তৈরি সাবমিট
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "add_menu", 
        name: name.trim(), 
        url: url.trim(), 
        parentId: selectedParentId ? Number(selectedParentId) : null 
      })
    });

    if (res.ok) {
      setMessage("নতুন মেনু লিঙ্ক সফলভাবে যুক্ত হয়েছে!");
      setIsError(false);
      setName("");
      setUrl("");
      setSelectedParentId("");
      await fetchMenu();
    } else {
      setMessage("মেনু লিঙ্ক যোগ করতে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 4000);
  };

  // খ. এডিট মোড শুরু
  const startEditing = (link: NavLink) => {
    setEditingId(link.id);
    setEditName(link.name);
    setEditUrl(link.url);
    setEditParentId(link.parentId ? String(link.parentId) : "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
    setEditParentId("");
  };

  const saveEditing = async (id: number) => {
    if (!editName.trim() || !editUrl.trim()) return;

    await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "update_menu", 
        id, 
        name: editName.trim(),
        url: editUrl.trim(),
        parentId: editParentId ? Number(editParentId) : null
      })
    });

    setEditingId(null);
    setMessage("মেনুর তথ্য সফলভাবে আপডেট হয়েছে!");
    setIsError(false);
    await fetchMenu();
    setTimeout(() => setMessage(""), 3000);
  };

  // গ. অন/অফ এবং প্যারেন্ট আইডি পরিবর্তনের হ্যান্ডলার
  const handleUpdateMenuConfig = async (id: number, updates: Partial<NavLink>) => {
    const updated = links.map(l => l.id === id ? { ...l, ...updates } : l);
    setLinks(updated);
    dispatchNavUpdate(updated);

    await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "update_menu", 
        id, 
        ...updates
      })
    });
    fetchMenu();
  };

  // ঘ. লিঙ্ক মুছে ফেলা
  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই মেনু লিঙ্কটি মুছে ফেলতে চান?")) return;
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_menu", id })
    });
    if (res.ok) {
      setMessage("মেনু লিঙ্কটি মুছে ফেলা হয়েছে।");
      setIsError(false);
      await fetchMenu();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // ঙ. পজিশন উপরে বা নিচে নেওয়া (Reorder)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIdx];
    newLinks[targetIdx] = temp;

    setLinks(newLinks);
    dispatchNavUpdate(newLinks);

    await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder_menu", navbarLinks: newLinks })
    });
  };

  // চ. স্ট্যান্ডার্ড ১৪টি মেনু পেজ রিসেট/পুনরুদ্ধার
  const handleResetStandardMenu = async () => {
    if (!confirm("আপনি কি ওয়েবসাইটের স্ট্যান্ডার্ড ১৪টি মেনু লিঙ্ক (হোম, আমাদের সম্পর্কে, বাণী, নোটিশ, ব্লগ, শিক্ষকবৃন্দ, চিত্রশালা, কর্মচারীবৃন্দ, পরিচালনা পর্ষদ, যোগাযোগ, একাডেমিক, ভর্তি তথ্য, ফি ও পেমেন্ট, অ্যালামনাই) রিসেট ও পুনরুদ্ধার করতে চান?")) return;

    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_menu" })
    });

    if (res.ok) {
      setMessage("স্ট্যান্ডার্ড সকল মেনু লিঙ্ক সফলভাবে পুনরুদ্ধার করা হয়েছে!");
      setIsError(false);
      await fetchMenu();
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const mainLevelMenus = links.filter((link) => link.parentId === null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <span>📋 মেনুবার ও ন্যাভিগেশন লিংক ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ওয়েবসাইটের উপরের মেনুবারে কোন কোন পেজ দেখাবে, তাদের নাম, লিঙ্ক, সাব-মেনু ড্রপডাউন ও ক্রম নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetStandardMenu}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer border border-blue-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>স্ট্যান্ডার্ড ১৪টি মেনু রিসেট করুন</span>
        </button>
      </div>

      {/* মেসেজ ব্যানার */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-2.5 ${
          isError ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}>
          {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* বাম কলাম: নতুন মেনু লিঙ্ক তৈরি ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xs border border-slate-200 h-fit space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">➕ নতুন মেনু লিঙ্ক তৈরি করুন</h2>
            <p className="text-xs text-slate-500">মেইন মেনু অথবা যেকোনো মেনুর অধীনে সাব-মেনু যোগ করুন</p>
          </div>

          <form onSubmit={handleAddMenu} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মেনুর ধরণ</label>
              <select 
                value={selectedParentId ? "sub" : "main"} 
                onChange={(e) => {
                  if (e.target.value === "main") setSelectedParentId("");
                  else if (mainLevelMenus.length > 0) setSelectedParentId(String(mainLevelMenus[0].id));
                }}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="main">➕ প্রধান মেনু (Main Menu)</option>
                <option value="sub">🔽 সাব-মেনু (Sub-menu dropdown)</option>
              </select>
            </div>

            {/* সাব-মেনুর জন্য প্যারেন্ট সিলেক্টর */}
            {selectedParentId !== "" && (
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-1">প্যারেন্ট মেনু নির্বাচন *</label>
                <select 
                  value={selectedParentId} 
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blue-200 bg-blue-50/50 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                >
                  {mainLevelMenus.map((link) => (
                    <option key={link.id} value={link.id}>↳ {link.name} এর অধীনে ড্রপডাউন</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">মেনুর নাম (বাংলায়) *</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: ভর্তি প্রক্রিয়া বা কৃতি শিক্ষার্থী" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">লিঙ্ক পাথ (URL Path) *</label>
              <input 
                type="text" 
                required 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: /teachers অথবা /alumni" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? "যুক্ত হচ্ছে..." : "মেনু লিঙ্ক যুক্ত করুন"}</span>
            </button>
          </form>
        </div>

        {/* ডান কলাম: বর্তমান মেনুর তালিকা */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">মেনুবার লিংক তালিকা ({links.length} টি)</h2>
              <p className="text-xs text-slate-500">ক্রম পরিবর্তন করতে তীর বাটনে ক্লিক করুন, নাম বা URL এডিট করুন</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {links.map((link, index) => {
              const isEditing = editingId === link.id;

              return (
                <div 
                  key={link.id} 
                  className={`p-4 rounded-2xl border transition ${
                    link.active 
                      ? "bg-white border-slate-200 hover:border-blue-200" 
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  {isEditing ? (
                    /* ইনলাইন এডিট মোড */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">মেনুর নাম</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-400 bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-0.5">URL পাথ</label>
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-400 bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <select 
                            value={editParentId} 
                            onChange={(e) => setEditParentId(e.target.value)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 outline-none"
                          >
                            <option value="">প্রধান মেনু (Main)</option>
                            {mainLevelMenus.filter(p => p.id !== link.id).map((parent) => (
                              <option key={parent.id} value={parent.id}>↳ {parent.name} এর সাব-মেনু</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditing(link.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>সংরক্ষণ</span>
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ভিউ মোড */
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded cursor-pointer"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, "down")}
                            disabled={index === links.length - 1}
                            className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 hover:bg-slate-100 rounded cursor-pointer"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm">{link.name}</h4>
                            {link.parentId ? (
                              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                ↳ সাব-মেনু
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                প্রধান
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{link.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 justify-end">
                        {/* প্যারেন্ট রিলেশন ড্রপডাউন */}
                        <select 
                          value={link.parentId || ""} 
                          onChange={(e) => handleUpdateMenuConfig(link.id, { parentId: e.target.value ? Number(e.target.value) : null })}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs outline-none cursor-pointer"
                        >
                          <option value="">প্রধান (Main)</option>
                          {mainLevelMenus.filter(p => p.id !== link.id).map((parent) => (
                            <option key={parent.id} value={parent.id}>↳ {parent.name}</option>
                          ))}
                        </select>

                        {/* একটিভ / ডিএকটিভ টগল */}
                        <button 
                          type="button"
                          onClick={() => handleUpdateMenuConfig(link.id, { active: !link.active })}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition duration-200 cursor-pointer ${
                            link.active 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {link.active ? "● চালু" : "○ বন্ধ"}
                        </button>

                        {/* এডিট বাটন */}
                        <button
                          type="button"
                          onClick={() => startEditing(link)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer"
                          title="নাম ও URL এডিট করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* মুছে ফেলা বাটন */}
                        <button
                          type="button"
                          onClick={() => handleDelete(link.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
