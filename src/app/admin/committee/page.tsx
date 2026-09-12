"use client";

import { useState, useEffect } from "react";

type Committee = { id: number; name: string; designation: string; image: string; };

export default function ManageCommittee() {
  const [committee, setCommittee] = useState<Committee[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCommittee = async () => {
    const res = await fetch("/api/committee");
    const data = await res.json();
    setCommittee(data);
  };

  useEffect(() => { fetchCommittee(); }, []);

  const handleEditStart = (member: Committee) => {
    setEditId(member.id);
    setName(member.name);
    setDesignation(member.designation);
    setImage(member.image);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setDesignation("");
    setImage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=teachers", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setImage(data.url);
    } catch (err) { alert("সমস্যা!"); } finally { setUploading(false); }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/committee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name, designation, image })
    });
    if (res.ok) {
      setMessage(editId ? "কমিটির তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন সদস্য সফলভাবে যুক্ত হয়েছে!");
      handleCancelEdit();
      fetchCommittee();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ডিলিট করতে চান?")) return;
    await fetch(`/api/committee?id=${id}`, { method: "DELETE" });
    fetchCommittee();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">পরিচালনা পর্ষদ ম্যানেজমেন্ট</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">{editId ? "✍️ তথ্য এডিট করুন" : "নতুন সদস্য যুক্ত করুন"}</h2>
          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">{message}</div>}
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পদবি</label>
              <input type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ছবি আপলোড</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 cursor-pointer" />
            </div>
            {image && <div className="mt-4 border p-2 rounded bg-gray-50 text-center"><img src={image} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto border" /></div>}
            <div className="space-y-2">
              <button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition">{loading ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট করুন" : "যুক্ত করুন"}</button>
              {editId && <button type="button" onClick={handleCancelEdit} className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 rounded-lg transition text-sm">❌ বাতিল</button>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">বর্তমান সদস্যদের তালিকা</h2><div className="space-y-3">{committee.map((c) => (<div key={c.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-center gap-4"><div className="flex items-center gap-4"><img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover border" /><div><h4 className="font-bold text-gray-800">{c.name}</h4><p className="text-sm text-gray-500">{c.designation}</p></div></div><div className="flex gap-2"><button onClick={() => handleEditStart(c)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold">এডিট</button><button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold">ডিলিট</button></div></div>))}</div></div>
      </div>
    </div>
  );
}