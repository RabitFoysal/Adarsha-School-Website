"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Newspaper, Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function ManageNewsPage() {
  const { data, refreshData } = useAdminData();
  const [news, setNews] = useState<any[]>(data.news || []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.news) setNews(data.news);
  }, [data.news]);

  const handleEdit = (n: any) => {
    setEditId(n.id);
    setTitle(n.title);
    setDescription(n.description || "");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, title, description }),
      });
      if (res.ok) {
        setMessage(editId ? "খবর আপডেট হয়েছে!" : "নতুন খবর যুক্ত হয়েছে!");
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
    if (!confirm("আপনি কি নিশ্চিতভাবে এই খবরটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
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
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">জরুরি খবর ও স্ক্রলিং টিকার</h1>
        <p className="text-xs text-slate-500 mt-1">ওয়েবসাইটের শীর্ষে প্রদর্শিত স্ক্রলিং লাইভ খবর পরিচালনা করুন</p>
      </div>

      {message && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
          <span>{editId ? "খবর সম্পাদনা করুন" : "নতুন জরুরি খবর যুক্ত করুন"}</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">খবরের শিরোনাম (টিকারে প্রদর্শিত হবে) *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: ২০২৬ শিক্ষাবর্ষে অনলাইনে ভর্তি কার্যক্রম শুরু হয়েছে" className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (ঐচ্ছিক)</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="খবরের অতিরিক্ত বিবরণ..." className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "খবর প্রকাশ করুন"}</span>
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer">
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">সকল স্ক্রলিং খবর ({news.length}টি)</h2>
        <div className="space-y-3">
          {news.map((n: any, idx: number) => (
            <div key={n.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                  {n.description && <p className="text-xs text-slate-500 line-clamp-1">{n.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(n)} className="p-1.5 rounded-lg bg-white border text-blue-600 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => handleDelete(n.id)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
