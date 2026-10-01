"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/admin";
        return;
      } else {
        setError(data.message || "লগইন ব্যর্থ হয়েছে!");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে!");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">অ্যাডমিন লগইন</h1>
          <p className="text-xs text-slate-500">বিদ্যালয় ব্যবস্থাপনা ও ওয়েবসাইট পরিচালনা কেন্দ্র</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ব্যবহারকারীর নাম (Username)</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">পাসওয়ার্ড (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs md:text-sm transition duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">ডিফল্ট ইউজার: admin | পাসওয়ার্ড: password123</p>
        </div>
      </div>
    </main>
  );
}
