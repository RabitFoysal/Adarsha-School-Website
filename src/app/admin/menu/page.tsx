"use client";

import { useState, useEffect } from "react";

type SubLink = { id: number; name: string; url: string; };
type NavLink = { id: number; name: string; url: string; parentId: number | null; active: boolean; items?: SubLink[]; };

export default function ManageMenu() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMenu = async () => {
    const res = await fetch("/api/custom-pages");
    const data = await res.json();
    setLinks(data.navbarLinks);
  };

  useEffect(() => { fetchMenu(); }, []);

  // ক. নতুন মেনু লিঙ্ক তৈরি সাবমিট
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "add_menu", 
        name, 
        url, 
        parentId: selectedParentId ? Number(selectedParentId) : null 
      })
    });
    if (res.ok) {
      setMessage("নতুন মেনু লিঙ্ক যুক্ত হয়েছে!");
      setName("");
      setUrl("");
      setSelectedParentId("");
      fetchMenu();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  // খ. অন/অফ এবং প্যারেন্ট আইডি পরিবর্তনের ইউনিভার্সাল হ্যান্ডলার
  const handleUpdateMenuConfig = async (id: number, updates: Partial<NavLink>) => {
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

  const handleDelete = async (id: number, parentId: number | null) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই লিঙ্কটি মুছে ফেলতে চান?")) return;
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_menu", id, parentId })
    });
    if (res.ok) fetchMenu();
  };

  const mainLevelMenus = links.filter((link) => link.parentId === null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ডাইনামিক মেনুবার ও স্লাইডার রিলেশনশিপ সেটিংস</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">নতুন মেনু লিঙ্ক তৈরি করুন</h2>
          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">{message}</div>}
          <form onSubmit={handleAddMenu} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মেনুর ধরণ</label>
              <select 
                value={selectedParentId ? "sub" : "main"} 
                onChange={(e) => {
                  if (e.target.value === "main") setSelectedParentId("");
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="main">➕ প্রধান মেনু (Main Menu)</option>
                <option value="sub">🔽 সাব-মেনু (Sub-menu dropdown)</option>
              </select>
            </div>

            {/* সাব-মেনুর জন্য প্যারেন্ট সিলেক্টর */}
            {(selectedParentId !== "" || links.length > 0) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-blue-600">প্যারেন্ট মেনু নির্বাচন (ঐচ্ছিক)</label>
                <select 
                  value={selectedParentId} onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                >
                  <option value="">প্রধান মেনু হিসেবে রাখুন (None)</option>
                  {mainLevelMenus.map((link) => (
                    <option key={link.id} value={link.id}>↳ {link.name} এর সাব-মেনু করুন</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">যেকোনো মেইন মেনুর অধীনে সাব-মেনু করতে এটি ব্যবহার করুন।</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">মেনুর নাম (বাংলায়)</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="যেমন: ফটো গ্যালারি" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্ক পাথ (URL Path)</label>
              <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="যেমন: /teachers অথবা /pages/history" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">যুক্ত করুন</button>
          </form>
        </div>

        {/* বর্তমান মেনুর তালিকা */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">মেনুবার রিলেশন কন্ট্রোল হাব</h2>
          
          <div className="space-y-4">
            {links.map((link) => {
              return (
                <div 
                  key={link.id} 
                  className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                    link.active ? "bg-white border-gray-200" : "bg-red-50/40 border-red-100 opacity-80"
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">
                      {link.name} {link.parentId && <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded ml-2">↳ সাব-মেনু</span>}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">লিঙ্ক: {link.url}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center w-full md:w-auto justify-end">
                    
                    {/* এডিটের সময় টাইপ এরর দূর করতে এখানে Number() কনভার্ট যুক্ত করা হয়েছে */}
                    <div>
                      <select 
                        value={link.parentId || ""} 
                        onChange={(e) => handleUpdateMenuConfig(link.id, { parentId: e.target.value ? Number(e.target.value) : null })}
                        className="px-3 py-1.5 rounded-lg border bg-gray-50 text-gray-700 font-bold text-xs outline-none cursor-pointer"
                      >
                        <option value="">প্রধান মেনু (Main)</option>
                        {mainLevelMenus.filter(p => p.id !== link.id).map((parent) => (
                          <option key={parent.id} value={parent.id}>↳ {parent.name} এর অধীনে দিন</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => handleUpdateMenuConfig(link.id, { active: !link.active })}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition duration-200 ${
                        link.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {link.active ? "● একটিভ" : "○ ডিএকটিভ"}
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}