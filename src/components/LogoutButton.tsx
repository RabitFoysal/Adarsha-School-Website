"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // লগআউট API কে কল করা হচ্ছে
    await fetch("/api/logout", { method: "POST" });
    // লগআউট সফল হলে লগইন পেজে পাঠিয়ে দেওয়া হবে
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left px-4 py-3 mt-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition font-medium"
    >
      🚪 লগআউট
    </button>
  );
}