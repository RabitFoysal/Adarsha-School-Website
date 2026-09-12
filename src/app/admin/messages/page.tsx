"use client";

import { useState, useEffect } from "react";

type Message = {
  id: number;
  name: string;
  designation: string;
  text: string;
  image: string;
};

export default function ManageMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleEditStart = (msg: Message) => {
    setEditId(msg.id);
    setName(msg.name);
    setDesignation(msg.designation);
    setText(msg.text);
    setImage(msg.image);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setDesignation("");
    setText("");
    setImage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?category=messages", {
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

  const handleAddOrUpdateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name, designation, text, image })
    });
    
    if (res.ok) {
      setMessage(editId ? "বাণী সফলভাবে আপডেট হয়েছে!" : "নতুন বাণী সফলভাবে যুক্ত হয়েছে!");
      handleCancelEdit();
      fetchMessages();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই বাণীটি ডিলিট করতে চান?")) return;
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    fetchMessages();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">বাণী ম্যানেজমেন্ট</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {editId ? "✍️ বাণী এডিট করুন" : "নতুন বাণী যুক্ত করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">প্রদত্ত ব্যক্তির নাম</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="নাম লিখুন" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পদবি</label>
              <input 
                type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: সভাপতি" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">বাণী/বার্তা (Message)</label>
              <textarea 
                rows={5} required value={text} onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="বাণী বিস্তারিত লিখুন..." 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ব্যক্তির ছবি আপলোড করুন</label>
              <input 
                type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" 
              />
              <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">
                ℹ️ <b>পরামর্শ:</b> ১:১ বর্গাকার ছবি ব্যবহার করুন।
              </p>
              {uploading && <p className="text-xs text-blue-600 animate-pulse mt-1">ছবি আপলোড হচ্ছে...</p>}
            </div>

            {image && (
              <div className="mt-4 border p-2 rounded bg-gray-50 text-center">
                <img src={image} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto border" />
              </div>
            )}
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "যুক্ত হচ্ছে..." : editId ? "আপডেট করুন" : "বাণী যুক্ত করুন"}
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
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">বাণীর তালিকা</h2>
          
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={msg.image} alt={msg.name} className="w-12 h-12 rounded-full object-cover border" />
                  <div>
                    <h4 className="font-bold text-gray-800">{msg.name}</h4>
                    <p className="text-sm text-gray-500">{msg.designation}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditStart(msg)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
                    এডিট
                  </button>
                  <button onClick={() => handleDelete(msg.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold transition">
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