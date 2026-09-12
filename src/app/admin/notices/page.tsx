"use client";

import { useState, useEffect } from "react";

type Notice = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  attachmentUrl?: string;
  date: string;
};

export default function ManageNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNotices = async () => {
    const res = await fetch("/api/notices");
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleEditStart = (notice: Notice) => {
    setEditId(notice.id);
    setTitle(notice.title);
    setDescription(notice.description);
    setImageUrl(notice.imageUrl || "");
    setAttachmentUrl(notice.attachmentUrl || "");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setAttachmentUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "doc") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") setUploadingImage(true);
    else setUploadingDoc(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (type === "image") setImageUrl(data.url);
        else setAttachmentUrl(data.url);
      } else {
        alert("ফাইল আপলোড ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      alert("সমস্যা হয়েছে!");
    } finally {
      if (type === "image") setUploadingImage(false);
      else setUploadingDoc(false);
    }
  };

  const handleAddOrUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, title, description, imageUrl, attachmentUrl })
    });
    
    if (res.ok) {
      setMessage(editId ? "নোটিশ সফলভাবে আপডেট হয়েছে!" : "নতুন নোটিশ প্রকাশিত হয়েছে!");
      handleCancelEdit();
      fetchNotices();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই নোটিশটি ডিলিট করতে চান?")) return;
    await fetch(`/api/notices?id=${id}`, { method: "DELETE" });
    fetchNotices();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">নোটিশ ম্যানেজমেন্ট</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {editId ? "✍️ নোটিশ এডিট করুন" : "নতুন নোটিশ তৈরি করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateNotice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নোটিশের শিরোনাম</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="শিরোনাম লিখুন" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নোটিশের বিবরণ</label>
              <textarea 
                rows={4} required value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="বিবরণ বিস্তারিত লিখুন..." 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নোটিশের ছবি আপলোড (A4 সাইজ)</label>
              <input 
                type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} disabled={uploadingImage}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" 
              />
              {uploadingImage && <p className="text-xs text-blue-600 animate-pulse mt-1">ছবি আপলোড হচ্ছে...</p>}
              {imageUrl && <p className="text-xs text-green-600 font-bold mt-1">✓ ছবি সফলভাবে আপলোড হয়েছে!</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ডকুমেন্ট ফাইল (PDF/Doc)</label>
              <input 
                type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => handleFileUpload(e, "doc")} disabled={uploadingDoc}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" 
              />
              {uploadingDoc && <p className="text-xs text-blue-600 animate-pulse mt-1">ফাইল আপলোড হচ্ছে...</p>}
              {attachmentUrl && <p className="text-xs text-green-600 font-bold mt-1">✓ ফাইল সফলভাবে আপলোড হয়েছে!</p>}
            </div>
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading || uploadingImage || uploadingDoc}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "প্রকাশ হচ্ছে..." : editId ? "আপডেট করুন" : "নোটিশ প্রকাশ করুন"}
              </button>
              {editId && (
                <button type="button" onClick={handleCancelEdit} className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 rounded-lg transition text-sm">
                  ❌ বাতিল করুন
                </button>
              )}
            </div>
          </form>
        </div>

        {/* তালিকা */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">প্রকাশিত নোটিশের তালিকা</h2>
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">📅 {notice.date}</span>
                    {notice.imageUrl && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">🖼️ ছবি</span>}
                    {notice.attachmentUrl && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">📎 ফাইল</span>}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-1">{notice.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{notice.description}</p>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditStart(notice)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
                    এডিট
                  </button>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
                    ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}