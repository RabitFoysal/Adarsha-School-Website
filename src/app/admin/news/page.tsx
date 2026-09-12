"use client";

import { useState, useEffect } from "react";

type NewsItem = {
  id: number;
  title: string;
  description: string;
};

export default function ManageNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEdit = (item: NewsItem) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item.id);
  };

  // এডিটের স্টেট বাইন্ডিং করার সুবিধা
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const startEdit = (item: NewsItem) => {
    setSelectedId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

  const cancelEdit = () => {
    setSelectedId(null);
    setTitle("");
    setDescription("");
  };

  const handleAddOrUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, title, description })
    });
    
    if (res.ok) {
      setMessage(selectedId ? "বার্তাটি সফলভাবে আপডেট হয়েছে!" : "নতুন স্ক্রলিং বার্তা যুক্ত হয়েছে!");
      cancelEdit();
      fetchNews();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই বার্তাটি ডিলিট করতে চান?")) return;
    await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    fetchNews();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">জরুরি স্ক্রলিং বার্তা</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {selectedId ? "✍️ স্ক্রলিং বার্তা এডিট করুন" : "নতুন বার্তা তৈরি করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateNews} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">স্ক্রলিং মেসেজ (সংক্ষিপ্ত)</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="হোমপেজে যা স্ক্রল করবে..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত খবর (Details)</label>
              <textarea 
                rows={5} required value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="ক্লিক করলে যে বিস্তারিত খবরটি দেখা যাবে..." 
              />
            </div>
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "প্রকাশ হচ্ছে..." : selectedId ? "আপডেট করুন" : "বার্তা প্রকাশ করুন"}
              </button>

              {selectedId && (
                <button 
                  type="button" onClick={cancelEdit}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 rounded-lg transition text-sm"
                >
                  ❌ বাতিল করুন
                </button>
              )}
            </div>
          </form>
        </div>

        {/* তালিকা */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">স্ক্রলিং বার্তার তালিকা</h2>
          
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(item)}
                    className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition"
                  >
                    এডিট
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold transition"
                  >
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