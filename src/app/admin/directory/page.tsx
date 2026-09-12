"use client";

import { useState, useEffect } from "react";

type SubItem = {
  id: number;
  name: string;
  content: string;
};

type Category = {
  id: number;
  title: string;
  items: SubItem[];
};

export default function ManageDirectory() {
  const [directory, setDirectory] = useState<Category[]>([]);
  
  // ক্যাটাগরির ইনপুট ও এডিট স্টেট
  const [categoryTitle, setCategoryTitle] = useState("");
  const [editCatId, setEditCatId] = useState<number | null>(null);

  // উপ-লিঙ্কের ইনপুট ও এডিট স্টেট
  const [selectedCatId, setSelectedCatId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemContent, setItemContent] = useState("");
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDirectory = async () => {
    const res = await fetch("/api/directory");
    const data = await res.json();
    setDirectory(data);
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  // ক্যাটাগরি এডিট শুরু
  const startEditCategory = (cat: Category) => {
    setEditCatId(cat.id);
    setCategoryTitle(cat.title);
  };

  const cancelEditCategory = () => {
    setEditCatId(null);
    setCategoryTitle("");
  };

  // উপ-লিঙ্ক এডিট শুরু (ক্যাটাগরিও স্বয়ংক্রিয়ভাবে সিলেক্ট হবে)
  const startEditItem = (catId: number, item: SubItem) => {
    setEditItemId(item.id);
    setSelectedCatId(catId.toString());
    setItemName(item.name);
    setItemContent(item.content);
  };

  const cancelEditItem = () => {
    setEditItemId(null);
    setSelectedCatId("");
    setItemName("");
    setItemContent("");
  };

  const handleAddOrUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/directory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_category", id: editCatId, title: categoryTitle }),
    });

    if (res.ok) {
      setMessage(editCatId ? "ক্যাটাগরি টাইটেল আপডেট হয়েছে!" : "নতুন প্রধান ক্যাটাগরি যুক্ত হয়েছে!");
      cancelEditCategory();
      fetchDirectory();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAddOrUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/directory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_item",
        id: editItemId,
        categoryId: selectedCatId,
        name: itemName,
        content: itemContent,
      }),
    });

    if (res.ok) {
      setMessage(editItemId ? "উপ-লিঙ্কের তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন লিঙ্ক ও তথ্য প্রকাশিত হয়েছে!");
      cancelEditItem();
      fetchDirectory();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number, actionType: "delete_category" | "delete_item") => {
    if (!confirm("আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?")) return;
    await fetch(`/api/directory?action=${actionType}&id=${id}`, { method: "DELETE" });
    fetchDirectory();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">তথ্য কেন্দ্র (Directory) সেটিংস</h1>

      {message && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 border border-green-200 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* ফর্ম ১: প্রধান ক্যাটাগরি */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {editCatId ? "✍️ ক্যাটাগরি টাইটেল এডিট করুন" : "১. নতুন প্রধান ক্যাটাগরি তৈরি করুন"}
          </h2>
          <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরির নাম</label>
              <input
                type="text" required value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="যেমন: বিদ্যালয় প্রশাসন"
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition">
                {editCatId ? "ক্যাটাগরি আপডেট করুন" : "ক্যাটাগরি যুক্ত করুন"}
              </button>
              {editCatId && (
                <button type="button" onClick={cancelEditCategory} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-4 rounded-lg transition">
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ফর্ম ২: উপ-লিঙ্ক ও পেজের তথ্য */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
            {editItemId ? "✍️ উপ-লিঙ্কের তথ্য এডিট করুন" : "২. ক্যাটাগরিতে লিঙ্ক এবং বিস্তারিত তথ্য যুক্ত করুন"}
          </h2>
          <form onSubmit={handleAddOrUpdateItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-blue-600">প্রধান ক্যাটাগরি নির্বাচন করুন</label>
              <select
                required value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)} disabled={editItemId !== null} // এডিট কালীন ক্যাটাগরি লক রাখা ভালো
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="">নির্বাচন করুন</option>
                {directory.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লিঙ্ক বা মেনুর নাম</label>
              <input
                type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="যেমন: গভর্নিং বডি"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">এই লিঙ্কে ক্লিক করলে যে আর্টিকেল/তথ্য দেখা যাবে</label>
              <textarea
                rows={6} required value={itemContent} onChange={(e) => setItemContent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="বিস্তারিত তথ্য এখানে লিখুন..."
              />
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition">
                {editItemId ? "তথ্য আপডেট করুন" : "লিঙ্ক ও তথ্য প্রকাশ করুন"}
              </button>
              {editItemId && (
                <button type="button" onClick={cancelEditItem} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-4 rounded-lg transition">
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* তালিকা */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">বর্তমান তথ্য কেন্দ্রর তালিকা</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {directory.map((cat) => (
            <div key={cat.id} className="p-6 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="font-extrabold text-blue-900 text-lg">📁 {cat.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => startEditCategory(cat)} className="text-blue-500 hover:text-blue-700 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded">
                      এডিট
                    </button>
                    <button onClick={() => handleDelete(cat.id, "delete_category")} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded">
                      ডিলিট
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-gray-150">
                      <span className="text-gray-800 font-medium">» {item.name}</span>
                      <div className="flex gap-3">
                        <button onClick={() => startEditItem(cat.id, item)} className="text-blue-500 hover:text-blue-700 text-xs font-semibold">
                          এডিট
                        </button>
                        <button onClick={() => handleDelete(item.id, "delete_item")} className="text-red-400 hover:text-red-600 text-xs">
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  ))}
                  {cat.items.length === 0 && <p className="text-xs text-gray-500 italic">কোনো লিঙ্ক যুক্ত করা হয়নি</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}