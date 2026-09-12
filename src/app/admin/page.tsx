import demoData from "@/data/demoData.json";

export default function AdminDashboard() {
  // আমাদের JSON ফাইল থেকে মোট শিক্ষকের সংখ্যা বের করছি
  const totalTeachers = demoData.teachers.length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">ড্যাশবোর্ড ওভারভিউ</h1>
      
      {/* পরিসংখ্যান কার্ড (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* কার্ড ১ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">মোট শিক্ষক</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalTeachers} জন</p>
        </div>
        
        {/* কার্ড ২ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm font-medium">মোট শিক্ষার্থী (ডেমো)</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">৪৫০ জন</p>
        </div>

        {/* কার্ড ৩ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">নতুন মেসেজ (ডেমো)</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">১২ টি</p>
        </div>

      </div>

      {/* ওয়েলকাম মেসেজ */}
      <div className="mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">স্বাগতম! 👋</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          এটি আপনার স্কুলের ওয়েবসাইটের অ্যাডমিন প্যানেল। এখান থেকে আপনি ওয়েবসাইটের বিভিন্ন তথ্য খুব সহজেই পরিবর্তন করতে পারবেন। বাম পাশের মেনু থেকে আপনার প্রয়োজনীয় অপশনটি বেছে নিন।
        </p>
      </div>
      
    </div>
  );
}