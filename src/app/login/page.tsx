"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError("আইডি বা পাসওয়ার্ড ভুল হয়েছে!");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">অ্যাডমিন লগইন</h2>
          <p className="text-gray-500 mt-2">প্যানেলে প্রবেশ করতে আপনার তথ্য দিন</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ইউজার আইডি</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              placeholder="আপনার আইডি লিখুন" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md disabled:bg-blue-400"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p>ডেমো আইডি: <b>admin</b></p>
          <p>পাসওয়ার্ড: <b>password123</b></p>
        </div>
      </div>
    </div>
  );
}