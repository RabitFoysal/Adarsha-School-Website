"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { MessageSquare, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageMessagesPage() {
  const { data, refreshData } = useAdminData();
  const [messages, setMessages] = useState<any[]>(Array.isArray(data.messages) ? data.messages : []);
  const [author, setAuthor] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (Array.isArray(data.messages)) setMessages(data.messages);
  }, [data.messages]);

  const handleEdit = (m: any) => {
    setEditId(m.id);
    setAuthor(m.author || m.name || "");
    setDesignation(m.designation || "");
    setQualification(m.qualification || "");
    setTitle(m.title || "");
    setContent(m.content || m.text || "");
    setImage(m.image || "");
    setOrder(m.order !== undefined ? Number(m.order) : 1);
  };

  const handleCancel = () => {
    setEditId(null);
    setAuthor("");
    setDesignation("");
    setQualification("");
    setTitle("");
    setContent("");
    setImage("");
    setOrder(messages.length + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: editId, 
          author, 
          name: author,
          designation, 
          qualification,
          title, 
          content, 
          text: content,
          image,
          order: Number(order) || 1
        }),
      });
      if (res.ok) {
        setMessage(editId ? "বাণী আপডেট হয়েছে!" : "নতুন বাণী যুক্ত হয়েছে!");
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
    if (!confirm("আপনি কি নিশ্চিতভাবে এই বাণীটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("বাণী মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">বিদ্যালয় বাণী ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">সভাপতি ও প্রধান শিক্ষকের মূল্যবান বাণী ও উপদেশ পরিচালনা করুন</p>
      </div>

      {message && <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
          <span>{editId ? "বাণী সম্পাদনা করুন" : "নতুন বাণী যুক্ত করুন"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বাণী প্রদানকারীর নাম *</label>
            <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পদবি *</label>
            <input type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত ডিগ্রি ও পদবি (ঐচ্ছিক)</label>
            <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="যেমন: এম.এ, বি.এড (১ম শ্রেণি)" className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">বাণীর শিরোনাম</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: প্রধান শিক্ষকের বাণী" className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (অগ্রাধিকার)</label>
            <input type="number" min={1} value={order} onChange={(e) => setOrder(Number(e.target.value))} placeholder="১" className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <ImageUploadInput
              label="বাণী প্রদানকারীর ছবি"
              value={image}
              onChange={setImage}
              helpText="সভাপতি বা প্রধান শিক্ষকের ফরমাল ছবি আপলোড করুন"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">বাণীর পূর্ণ বক্তব্য *</label>
          <textarea rows={5} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>{editId ? "সংরক্ষণ করুন" : "বাণী যুক্ত করুন"}</span>
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer">
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">সকল সংরক্ষিত বাণী ({messages.length}টি)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((m: any) => (
            <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={m.image || "https://placehold.co/100x100?text=Author"}
                  alt={m.author || "বাণী"}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 bg-white shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Author";
                  }}
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block">{m.title || "বাণী"}</span>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{m.author || m.name}</h4>
                  <p className="text-xs text-slate-500">{m.designation}</p>
                  {m.qualification && <p className="text-[11px] text-blue-700 font-semibold">{m.qualification}</p>}
                  <p className="text-xs text-slate-600 line-clamp-3 pt-1">{m.content || m.text}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => handleEdit(m)} className="p-1.5 rounded-lg bg-white border text-blue-600 cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg bg-white border text-rose-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
