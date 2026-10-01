"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  ExternalLink, 
  FileText, 
  Clock, 
  FileCheck, 
  CalendarDays,
  UploadCloud,
  CheckCircle2,
  X
} from "lucide-react";

interface AcademicItem {
  id: string | number;
  title: string;
  category: "routine" | "exam" | "syllabus" | "calendar";
  classGrade?: string;
  sessionYear: string;
  publishDate: string;
  fileUrl?: string;
  description?: string;
}

export default function ManageAcademicsPage() {
  const [items, setItems] = useState<AcademicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Form state
  const [editId, setEditId] = useState<string | number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"routine" | "exam" | "syllabus" | "calendar">("routine");
  const [classGrade, setClassGrade] = useState("সকল শ্রেণি");
  const [sessionYear, setSessionYear] = useState(new Date().getFullYear().toString());
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/academics");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      setMessage("ডাটা লোড করতে সমস্যা হয়েছে!");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?category=documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFileUrl(data.url);
        setMessage("ফাইল সফলভাবে আপলোড হয়েছে!");
        setIsError(false);
      } else {
        setMessage("ফাইল আপলোড ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("ফাইল আপলোড করতে সমস্যা হয়েছে!");
      setIsError(true);
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("অনুগ্রহ করে শিরোনাম লিখুন!");
      setIsError(true);
      return;
    }

    setSaving(true);
    const payload = {
      action: "save",
      item: {
        id: editId || undefined,
        title: title.trim(),
        category,
        classGrade: classGrade.trim(),
        sessionYear: sessionYear.trim(),
        fileUrl: fileUrl.trim(),
        description: description.trim(),
        publishDate: new Date().toISOString().split("T")[0]
      }
    };

    try {
      const res = await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(editId ? "সফলভাবে আপডেট করা হয়েছে!" : "নতুন আইটেম যুক্ত করা হয়েছে!");
        setIsError(false);
        resetForm();
        setItems(data.academicRoutines);
      } else {
        setMessage(data.error || "সংরক্ষণ করতে সমস্যা হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
      setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("আপনি কি নিশ্চিত এই আইটেমটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", item: { id } })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("আইটেমটি সফলভাবে মুছে ফেলা হয়েছে!");
        setIsError(false);
        setItems(data.academicRoutines);
      }
    } catch {
      setMessage("মুছে ফেলতে সমস্যা হয়েছে!");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const startEdit = (item: AcademicItem) => {
    setEditId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setClassGrade(item.classGrade || "সকল শ্রেণি");
    setSessionYear(item.sessionYear);
    setFileUrl(item.fileUrl || "");
    setDescription(item.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setCategory("routine");
    setClassGrade("সকল শ্রেণি");
    setSessionYear(new Date().getFullYear().toString());
    setFileUrl("");
    setDescription("");
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              একাডেমিক রুটিন, সিলেবাস ও ক্যালেন্ডার ব্যবস্থাপনা
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ক্লাস রুটিন, পরীক্ষার সময়সূচি, বিষয়ভিত্তিক সিলেবাস ও ছুটির ক্যালেন্ডার আপলোড ও নিয়ন্ত্রণ করুন।
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          isError ? "bg-rose-50 border border-rose-200 text-rose-700" : "bg-emerald-50 border border-emerald-200 text-emerald-800"
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* নতুন যুক্ত / এডিট ফর্ম */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {editId ? <Edit3 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
            <span>{editId ? "আইটেম সম্পাদনা করুন" : "নতুন রুটিন বা সিলেবাস যুক্ত করুন"}</span>
          </h2>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>বাতিল করুন</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">শিরোনাম / আইটেমের নাম *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: ২০২৬ শিক্ষাবর্ষের ৬ষ্ঠ শ্রেণির বার্ষিক পরীক্ষার রুটিন"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ক্যাটাগরি *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none font-medium"
            >
              <option value="routine">📅 ক্লাস রুটিন</option>
              <option value="exam">📝 পরীক্ষার রুটিন</option>
              <option value="syllabus">📚 সিলেবাস ও পাঠ্যপরিকল্পনা</option>
              <option value="calendar">📆 ছুটির তালিকা ও ক্যালেন্ডার</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">শ্রেণি বা শাখা</label>
            <input
              type="text"
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value)}
              placeholder="যেমন: ৬ষ্ঠ - ১০ম শ্রেণি / সকল শ্রেণি"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">শিক্ষাবর্ষ / সাল</label>
            <input
              type="text"
              value={sessionYear}
              onChange={(e) => setSessionYear(e.target.value)}
              placeholder="যেমন: ২০২৬"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* ফাইল আপলোড বা সরাসরি লিংক */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            পিডিএফ বা ফাইল লিংক (PDF / Image Document)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/routine.pdf"
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <label className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shrink-0">
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? "আপলোড হচ্ছে..." : "ফাইল আপলোড করুন"}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {fileUrl && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
              ✓ ফাইল লিংক সংযুক্ত হয়েছে: <span className="underline truncate max-w-xs">{fileUrl}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="পরীক্ষার সময় বা রুটিন সম্পর্কিত জরুরি নোট..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-sm"
        >
          {saving ? "সংরক্ষণ করা হচ্ছে..." : (editId ? "আপডেট সংরক্ষণ করুন" : "যুক্ত করুন")}
        </button>
      </form>

      {/* বর্তমান আইটেম তালিকা */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            বিদ্যমান রুটিন ও সিলেবাস তালিকা ({items.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">লোড হচ্ছে...</div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                      {item.category === "routine" && "ক্লাস রুটিন"}
                      {item.category === "exam" && "পরীক্ষার রুটিন"}
                      {item.category === "syllabus" && "সিলেবাস"}
                      {item.category === "calendar" && "ক্যালেন্ডার"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.classGrade}
                    </span>
                    <span className="text-[11px] text-slate-400">সাল: {item.sessionYear}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="ফাইল ভিউ করুন"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">কোনো রুটিন বা সিলেবাস পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
}
