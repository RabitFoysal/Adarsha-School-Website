"use client";

import { useState, useEffect } from "react";

type CustomPage = { id: number; title: string; slug: string; template: "text" | "list"; content: string; listItems?: any[]; };

export default function ManageCustomPages() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [activePage, setActivePage] = useState<CustomPage | null>(null);

  // পেজ তৈরির স্টেট
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState<"text" | "list">("text");
  const [content, setContent] = useState("");
  const [editPageId, setEditId] = useState<number | null>(null);

  // মেম্বার লিস্টের ডাইনামিক স্টেট
  const [memberName, setMemberName] = useState("");
  const [memberDesg, setMemberDesg] = useState("");
  const [memberImg, setMemberImg] = useState("");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/custom-pages");
    const data = await res.json();
    setPages(data.customPages);
    if (activePage) {
      const current = data.customPages.find((p: any) => p.id === activePage.id);
      setActivePage(current || null);
    }
  };

  useEffect(() => { fetchData(); }, [activePage]);

  // কাস্টম পেজ তৈরি/এডিট শুরু
  const startEditPage = (page: CustomPage) => {
    setEditId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setTemplate(page.template);
    setContent(page.content);
  };

  const cancelEditPage = () => {
    setEditId(null);
    setTitle("");
    setSlug("");
    setContent("");
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_page", id: editPageId, title, slug, template, content })
    });
    if (res.ok) {
      setMessage(editPageId ? "পেজটি সফলভাবে আপডেট হয়েছে!" : "নতুন পেজ সফলভাবে তৈরি হয়েছে!");
      cancelEditPage();
      fetchData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm("পেজটি ডিলিট করতে চান?")) return;
    await fetch(`/api/custom-pages?id=${id}`, { method: "DELETE" });
    setActivePage(null);
    fetchData();
  };

  // ডাইনামিক মেম্বার ইমেজ আপলোড
  const handleMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload?category=teachers", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) setMemberImg(data.url);
    } catch (err) { alert("সমস্যা!"); } finally { setUploading(false); }
  };

  // মেম্বার লিস্ট এডিট শুরু
  const startEditItem = (item: any) => {
    setEditItemId(item.id);
    setMemberName(item.name);
    setMemberDesg(item.designation);
    setMemberImg(item.image);
  };

  const cancelEditItem = () => {
    setEditItemId(null);
    setMemberName("");
    setMemberDesg("");
    setMemberImg("");
  };

  const handleSavePageItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePage) return;
    setLoading(true);

    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_page_item",
        pageId: activePage.id,
        itemId: editItemId,
        name: memberName,
        designation: memberDesg,
        image: memberImg
      })
    });

    if (res.ok) {
      setMessage("সদস্যের তথ্য সফলভাবে সংরক্ষিত হয়েছে!");
      cancelEditItem();
      fetchData();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!activePage || !confirm("সদস্য ডিলিট করতে চান?")) return;
    const res = await fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_page_item", pageId: activePage.id, itemId })
    });
    if (res.ok) fetchData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🧱 কাস্টম পেজ ও মেম্বার লিস্ট বিল্ডার</h1>
      {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 border border-green-200 font-medium">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম ১: পেজ জেনারেটর */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">{editPageId ? "✍️ পেজ সেটিংস এডিট করুন" : "নতুন পেজ তৈরি করুন"}</h2>
          <form onSubmit={handleSavePage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পেজ টাইটেল (Title)</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="যেমন: লাইব্রেরি নির্দেশনাবলী" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পেজ লিঙ্ক স্লাগ (Slug)</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="যেমন: library-rules" />
              <p className="text-[10px] text-gray-500 mt-1">সব ছোট হাতের অক্ষর ও হাইফেন ব্যবহার করবেন। লিঙ্ক হবে: <b>/pages/library-rules</b></p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পেজ টেমপ্লেট</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value as any)} disabled={editPageId !== null} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none">
                <option value="text">📖 সাধারণ টেক্সট পেজ (প্রবন্ধ/ইতিহাস)</option>
                <option value="list">👥 ডাইনামিক মেম্বার লিস্ট পেজ (টিচার/স্টাফ এর মত)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পেজের বর্ণনা (Content)</label>
              <textarea rows={5} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="পেজের মূল বক্তব্য বিস্তারিত এখানে লিখুন..." />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition">{editPageId ? "আপডেট করুন" : "পেজ তৈরি করুন"}</button>
              {editPageId && <button type="button" onClick={cancelEditPage} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-4 rounded-lg transition">বাতিল</button>}
            </div>
          </form>
        </div>

        {/* ডান পাশ: পেজ তালিকা ও মেম্বারস কন্ট্রোল হাব */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">তৈরিকৃত কাস্টম পেজ সমূহের তালিকা</h2>
            <div className="space-y-3">
              {pages.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-gray-150 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-blue-900 text-base">📄 {p.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">টেমপ্লেট: {p.template === "text" ? "📖 সাধারণ টেক্সট" : "👥 মেম্বার লিস্ট"} | লিঙ্ক: <b>/pages/{p.slug}</b></p>
                  </div>
                  <div className="flex gap-2">
                    {p.template === "list" && (
                      <button onClick={() => setActivePage(p)} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 font-bold px-3 py-1.5 rounded-lg">
                        ⚙️ মেম্বার ম্যানেজ
                      </button>
                    )}
                    <button onClick={() => startEditPage(p)} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg">এডিট</button>
                    <button onClick={() => handleDeletePage(p.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-1.5 rounded-lg">ডিলিট</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* মেম্বার লিস্ট কন্ট্রোলার (শুধুমাত্র লিস্ট টেমপ্লেট পেজগুলোর জন্য একটিভ হবে) */}
          {activePage && (
            <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg">
              <h2 className="text-xl font-bold text-blue-900 border-b pb-4 mb-6">
                👥 <span className="text-red-600">[{activePage.title}]</span> পেজের মেম্বার কন্ট্রোল হাব
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* মেম্বার অ্যাড ফর্ম */}
                <form onSubmit={handleSavePageItem} className="space-y-4 border-r pr-6">
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2">{editItemId ? "✍️ মেম্বার এডিট করুন" : "নতুন মেম্বার যুক্ত করুন"}</h3>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600">সদস্যের নাম</label>
                    <input type="text" required value={memberName} onChange={(e) => setMemberName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600">পদবি</label>
                    <input type="text" required value={memberDesg} onChange={(e) => setMemberDesg(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600">ছবি আপলোড</label>
                    <input type="file" accept="image/*" onChange={handleMemberImageUpload} disabled={uploading} className="w-full px-2 py-1 rounded border bg-white text-gray-900 text-xs" />
                  </div>
                  {memberImg && <div className="text-center"><img src={memberImg} alt="Preview" className="w-16 h-16 rounded-full object-cover border mx-auto" /></div>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading || uploading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-xs">{loading ? "সংরক্ষণ হচ্ছে..." : editItemId ? "মেম্বার আপডেট" : "মেম্বার যুক্ত করুন"}</button>
                    {editItemId && <button type="button" onClick={cancelEditItem} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-3 rounded text-xs">বাতিল</button>}
                  </div>
                </form>

                {/* মেম্বার তালিকা */}
                <div>
                  <h3 className="font-bold text-gray-800 text-sm border-b pb-2 mb-4">এই পেজের বর্তমান মেম্বারগণ</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {activePage.listItems?.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-lg border bg-gray-50 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <p className="text-[10px] text-gray-500">{item.designation}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEditItem(item)} className="text-blue-500 hover:underline">এডিট</button>
                          <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:underline">ডিলিট</button>
                        </div>
                      </div>
                    ))}
                    {(!activePage.listItems || activePage.listItems.length === 0) && <p className="text-xs text-gray-500 italic text-center py-6">কোনো মেম্বার নেই</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}