"use client";

import { useState, useEffect } from "react";

type ImportantLink = {
  id: number;
  title: string;
  url: string;
};

export default function ManageLinks() {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState<number | null>(null); // এডিট আইডি ট্র্যাক করার স্টেট
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLinks = async () => {
    const res = await fetch("/api/important-links");
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // লিঙ্ক এডিট শুরু করার হ্যান্ডলার
  const handleEditStart = (link: ImportantLink) => {
    setEditId(link.id);
    setTitle(link.title);
    setUrl(link.url);
  };

  // এডিট মোড বাতিল করার হ্যান্ডলার
  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setUrl("");
  };

  const handleAddOrUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/important-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, title, url }) // ID থাকলে API এডিট করবে
    });
    
    if (res.ok) {
      setMessage(editId ? "লিঙ্কটি সফলভাবে আপডেট হয়েছে!" : "নতুন লিঙ্ক যুক্ত হয়েছে!");
      handleCancelEdit(); // ফর্ম রিসেট করা
      fetchLinks();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই লিঙ্কটি ডিলিট করতে চান?")) return;
    await fetch(`/api/important-links?id=${id}`, { method: "DELETE" });
    fetchLinks();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">গুরুত্বপূর্ণ লিঙ্ক সেটিংস</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {editId ? "✍️ লিঙ্ক আপডেট করুন" : "নতুন লিঙ্ক যুক্ত করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্কের শিরোনাম</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: শিক্ষা মন্ত্রণালয়" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্ক বা ইউআরএল (URL)</label>
              <input 
                type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="https://example.gov.bd" 
              />
            </div>
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট করুন" : "লিঙ্ক যুক্ত করুন"}
              </button>

              {editId && (
                <button 
                  type="button" onClick={handleCancelEdit}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 rounded-lg transition text-sm"
                >
                  ❌ এডিট বাতিল করুন
                </button>
              )}
            </div>
          </form>
        </div>

        {/* তালিকা */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">বর্তমান লিঙ্কের তালিকা</h2>
          
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-center gap-4">
                <div className="truncate">
                  <h4 className="font-bold text-gray-800">{link.title}</h4>
                  <p className="text-blue-600 text-xs truncate">{link.url}</p>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button 
                    onClick={() => handleEditStart(link)}
                    className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition"
                  >
                    এডিট
                  </button>
                  <button 
                    onClick={() => handleDelete(link.id)}
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