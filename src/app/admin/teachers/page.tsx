"use client";

import { useState, useEffect } from "react";

type Teacher = {
  id: number;
  name: string;
  designation: string;
  image: string;
};

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleEditStart = (teacher: Teacher) => {
    setEditId(teacher.id);
    setName(teacher.name);
    setDesignation(teacher.designation);
    setImage(teacher.image);
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
      const res = await fetch("/api/upload?category=teachers", {
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

  const handleAddOrUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name, designation, image })
    });
    
    if (res.ok) {
      setMessage(editId ? "শিক্ষকের তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন শিক্ষক সফলভাবে যুক্ত করা হয়েছে!");
      handleCancelEdit();
      fetchTeachers();
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই শিক্ষককে ডিলিট করতে চান?")) return;
    await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
    fetchTeachers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">শিক্ষক ম্যানেজমেন্ট</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ফর্ম */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
            {editId ? "✍️ শিক্ষকের তথ্য এডিট করুন" : "নতুন শিক্ষক যুক্ত করুন"}
          </h2>
          
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 border border-green-200 font-medium text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateTeacher} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">শিক্ষকের নাম</label>
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: রহিম উদ্দিন" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পদবি</label>
              <input 
                type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" 
                placeholder="যেমন: ইংরেজি শিক্ষক" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">শিক্ষকের ছবি আপলোড করুন</label>
              <input 
                type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 cursor-pointer" 
              />
              <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">
                ℹ️ <b>পরামর্শ:</b> ১:১ অনুপাতের বর্গাকার (Square) ছবি ব্যবহার করুন। (যেমন: ৪০০x৪০০ পিক্সেল)
              </p>
              {uploading && <p className="text-xs text-blue-600 animate-pulse mt-1">ছবি আপলোড হচ্ছে...</p>}
            </div>

            {image && (
              <div className="mt-4 border p-3 rounded bg-gray-50 text-center">
                <img src={image} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto border" />
              </div>
            )}
            
            <div className="space-y-2">
              <button 
                type="submit" disabled={loading || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition shadow-md disabled:bg-blue-400"
              >
                {loading ? "যুক্ত হচ্ছে..." : editId ? "আপডেট করুন" : "শিক্ষক যুক্ত করুন"}
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
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">শিক্ষকদের তালিকা</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4 font-medium rounded-tl-lg">ছবি</th>
                  <th className="p-4 font-medium">নাম</th>
                  <th className="p-4 font-medium">পদবি</th>
                  <th className="p-4 font-medium text-right rounded-tr-lg">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <img src={teacher.image} alt={teacher.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    </td>
                    <td className="p-4 font-medium text-gray-800">{teacher.name}</td>
                    <td className="p-4 text-gray-600">{teacher.designation}</td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleEditStart(teacher)} className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition">
                          এডিট
                        </button>
                        <button onClick={() => handleDelete(teacher.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition">
                          ডিলিট
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}