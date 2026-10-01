"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { BookOpen, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageBlogPage() {
  const { data, refreshData } = useAdminData();
  const [blogs, setBlogs] = useState<any[]>(data.blogs || []);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.blogs) setBlogs(data.blogs);
  }, [data.blogs]);

  const handleEdit = (b: any) => {
    setEditId(b.id);
    setTitle(b.title);
    setAuthor(b.author || "");
    setContent(b.content);
    setImage(b.image || "");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setContent("");
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, title, author, content, image }),
      });
      if (res.ok) {
        setMessage(editId ? "ব্লগ আপডেট হয়েছে!" : "নতুন ব্লগ প্রকাশিত হয়েছে!");
        handleCancel();
        refreshData();
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্লগটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">ব্লগ ও অনুচ্ছেদ ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">শিক্ষক ও শিক্ষার্থীদের শিক্ষামূলক প্রবন্ধ প্রকাশ করুন</p>
      </div>

      {message && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-3xl">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
          <span>{editId ? "ব্লগ সম্পাদনা করুন" : "নতুন ব্লগ লিখুন"}</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ব্লগের শিরোনাম *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">লেখকের নাম</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="যেমন: ফারহানা আক্তার (সহকারী শিক্ষক)" className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div>
            <ImageUploadInput
              label="কভার ছবি"
              value={image}
              onChange={setImage}
              helpText="ব্লগ বা আর্টিকেলের আকর্ষণীয় কভার ছবি"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">আর্টিকেলের পূর্ণ বিবরণ *</label>
          <textarea rows={6} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "ব্লগ প্রকাশ করুন"}</span>
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer">
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">প্রকাশিত ব্লগসমূহ ({blogs.length}টি)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((b: any) => (
            <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">📅 {b.date}</span>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{b.title}</h4>
                <p className="text-xs text-slate-500">লেখক: {b.author || "বিদ্যালয় পরিবার"}</p>
                <p className="text-xs text-slate-600 line-clamp-2 pt-1">{b.content}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => handleEdit(b)} className="p-1.5 rounded-lg bg-white border text-blue-600 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
