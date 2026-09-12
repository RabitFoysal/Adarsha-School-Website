import demoData from "@/data/demoData.json";

export default function NoticesPage() {
  const { notices } = demoData;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      {/* পেজের টাইটেল */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">নোটিশ বোর্ড</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4">বিদ্যালয়ের সকল দাপ্তরিক নোটিশ, স্ক্যান কপি ও ফাইল ডাউনলোড করুন।</p>
      </div>

      {/* নোটিশ সমূহের তালিকা */}
      <div className="space-y-8">
        {notices.map((notice: any) => (
          <div 
            key={notice.id} 
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col gap-6"
          >
            <div>
              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                📅 প্রকাশকাল: {notice.date}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2 leading-snug">
                {notice.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                {notice.description}
              </p>
            </div>

            {/* ১. নোটিশ ছবি প্রদর্শন করা */}
            {notice.imageUrl && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2 max-w-lg shadow-inner">
                <p className="text-xs text-gray-500 mb-2 font-semibold">🖼️ নোটিশের স্ক্যান কপি:</p>
                <img 
                  src={notice.imageUrl} 
                  alt={notice.title} 
                  className="w-full object-contain max-h-[600px] rounded" 
                />
              </div>
            )}

            {/* ২. নোটিশ ফাইল বা পিডিএফ ডাউনলোড করার বাটন */}
            {notice.attachmentUrl && (
              <div className="border-t pt-4">
                <a 
                  href={notice.attachmentUrl} 
                  download
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md text-sm cursor-pointer"
                >
                  📥 ফাইলটি ডাউনলোড করুন (PDF/Word)
                </a>
              </div>
            )}
            
          </div>
        ))}

        {notices.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
            কোনো নোটিশ পাওয়া যায়নি।
          </div>
        )}
      </div>

    </main>
  );
}