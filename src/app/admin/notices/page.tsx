"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Bell, Plus, Edit2, Trash2, Calendar, FileText, Upload, Save, X } from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageNoticesPage() {
  const { data, updateSection, refreshData } = useAdminData();
  const [notices, setNotices] = useState<any[]>(data.notices || []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.notices) {
      setNotices(data.notices);
    }
  }, [data.notices]);

  const handleEdit = (n: any) => {
    setEditId(n.id);
    setTitle(n.title);
    setDescription(n.description);
    setImageUrl(n.imageUrl || "");
    setAttachmentUrl(n.attachmentUrl || "");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setAttachmentUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title,
          description,
          imageUrl,
          attachmentUrl,
        }),
      });

      if (res.ok) {
        setMessage(editId ? "নোটিশ সফলভাবে আপডেট হয়েছে!" : "নতুন নোটিশ প্রকাশিত হয়েছে!");
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
    if (!confirm("আপনি কি নিশ্চিতভাবে এই নোটিশটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/notices?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("নোটিশ মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {
      setMessage("মুছে ফেলতে ব্যর্থ হয়েছে!");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">নোটিশ বোর্ড ব্যবস্থাপনা</h1>
          <p className="text-xs text-slate-500 mt-1">বিদ্যালয়ের সকল দাপ্তরিক বিজ্ঞপ্তি প্রকাশ ও পরিবর্তন করুন</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          {message}
        </div>
      )}

      {/* ফর্ম */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-3xl">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
          <span>{editId ? "নোটিশ সম্পাদনা করুন" : "নতুন নোটিশ প্রকাশ করুন"}</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: ২০২৬ শিক্ষাবর্ষে ভর্তি বিজ্ঞপ্তি"
            className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ *</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ লিখুন..."
            className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <ImageUploadInput
              label="নোটিশের ছবি (ঐচ্ছিক)"
              value={imageUrl}
              onChange={setImageUrl}
              helpText="নোটিশের ছবি বা ব্যানারের ছবি আপলোড করুন"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ডকুমেন্ট / পিডিএফ লিঙ্ক (ঐচ্ছিক)</label>
            <input
              type="text"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "নোটিশ প্রকাশ করুন"}</span>
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

      {/* নোটিশ তালিকা */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">প্রকাশিত নোটিশসমূহ ({notices.length}টি)</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {notices.map((n: any) => (
            <div key={n.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  📅 {n.date}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{n.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(n)}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
                  title="এডিট"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {notices.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              কোনো নোটিশ পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
