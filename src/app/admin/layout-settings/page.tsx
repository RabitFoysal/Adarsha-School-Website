"use client";

import { useState, useEffect } from "react";

type LayoutItem = {
  id: string;
  name: string;
  active: boolean;
};

export default function LayoutSettings() {
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchLayout = async () => {
    const res = await fetch("/api/layout-config");
    const data = await res.json();
    setLayout(data);
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  // সেকশন অন/অফ (Toggle Active) করার ফাংশন
  const handleToggle = (id: string) => {
    const updated = layout.map((item) => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    setLayout(updated);
  };

  // সেকশনের পজিশন উপরে বা নিচে নেওয়ার ফাংশন
  const handleMove = (index: number, direction: "up" | "down") => {
    const updated = [...layout];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // বাউন্ডারি চেক
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // অদল-বদল (Swap)
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setLayout(updated);
  };

  // লেআউট সার্ভারে সেভ করার ফাংশন
  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/layout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layout),
      });

      if (res.ok) {
        setMessage("হোমপেজ লেআউট সফলভাবে আপডেট হয়েছে!");
      } else {
        setMessage("সংরক্ষণ করতে সমস্যা হয়েছে!");
      }
    } catch (err) {
      setMessage("সার্ভারে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">লেআউট সেটিংস</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
          হোমপেজ সেকশন সমূহের পজিশন ও অ্যাক্টিভেশন
        </h2>

        {message && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 border border-green-200 font-medium">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {layout.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition ${item.active ? "bg-white border-gray-200 shadow-sm" : "bg-gray-50 border-gray-150 opacity-70"}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 font-bold text-lg">#{index + 1}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500">ID: {item.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                
                {/* অন/অফ সুইচ (Toggle Switch Button) */}
                <button 
                  onClick={() => handleToggle(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition duration-200 ${item.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                >
                  {item.active ? "● চালু আছে" : "○ বন্ধ আছে"}
                </button>

                {/* পজিশন পরিবর্তনের বাটন (Up & Down Arrow) */}
                <div className="flex gap-2">
                  <button 
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 transition text-gray-700 font-bold"
                  >
                    ▲
                  </button>
                  <button 
                    disabled={index === layout.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-gray-100 transition text-gray-700 font-bold"
                  >
                    ▼
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md disabled:bg-blue-400"
        >
          {loading ? "সংরক্ষণ হচ্ছে..." : "লেআউট পরিবর্তন সেভ করুন"}
        </button>

      </div>
    </div>
  );
}