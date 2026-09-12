"use client";

import { useState, useEffect } from "react";

type Blog = {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string;
  date: string;
};

export default function ManageBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEditStart = (blog: Blog) => {
    setEditId(blog.id);
    setTitle(blog.title);
    setAuthor(blog.author);
    setContent(blog.content);
    setImage(blog.image);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setContent("");
    setImage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?category=blogs", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
      } else {
        alert("ছবি আপলোড ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      alert("সমস্যা হয়েছে!");
    } finally {
      setUploading(false);
    }
  };

  const handleAddOrUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, title, content, author, image })
    });
    
    if (res.ok) {
      setMessage(editId ? "পোস্টটি সফলভাবে আপডেট হয়েছে!" : "নতুন পোস্ট সফলভাবে প্রকাশিত হয়েছে!");
      handleCancelEdit();
      fetchBlogs();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই ব্লগ পোস্টটি ডিলিট করতে চান?")) return;
    await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
    fetchBlogs();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ব্লগ ও অনুচ্ছেদ ম্যানেজমেন্ট</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {editId ? "✍️ পোস্ট এডিট করুন" : "নতুন পোস্ট তৈরি করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateBlog} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পোস্ট টাইটেল</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="টাইটেল লিখুন" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">লেখকের নাম</label>
              <input 
                type="text" required value={author} onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: ফাতেমা বেগম" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পোস্টের বিবরণ (Content)</label>
              <textarea 
                rows={5} required value={content} onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="বিস্তারিত বিবরণ এখানে লিখুন..." 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ফিচার ছবি আপলোড করুন</label>
              <input 
                type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" 
              />
              <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">
                ℹ️ <b>পরামর্শ:</b> ১৬:৯ ল্যান্ডস্কেপ ছবি ব্যবহার করুন। (যেমন: ৮০০x৪৫০০ পিক্সেল)
              </p>
              {uploading && <p className="text-xs text-blue-600 animate-pulse mt-1">ছবি আপলোড হচ্ছে...</p>}
            </div>

            {image && (
              <div className="mt-4 border p-2 rounded bg-gray-50 text-center">
                <img src={image} alt="Preview" className="w-full h-32 object-cover rounded border" />
              </div>
            )}
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "প্রকাশ হচ্ছে..." : editId ? "আপডেট করুন" : "লেখা প্রকাশ করুন"}
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
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">প্রকাশিত লেখার তালিকা</h2>
          
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={blog.image} alt={blog.title} className="w-16 h-16 rounded object-cover border" />
                  <div>
                    <h4 className="font-bold text-gray-800 leading-snug">{blog.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">✍️ লেখক: {blog.author} | 📅 {blog.date}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditStart(blog)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
                    এডিট
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
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