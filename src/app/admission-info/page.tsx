import demoData from "@/data/demoData.json";

export default function AdmissionInfoPage() {
  const { admission, schoolInfo } = demoData;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
        
        <span className="bg-red-50 text-red-700 font-bold px-4 py-1.5 rounded-full text-xs animate-pulse">
          🎓 অনলাইন ভর্তি কার্যক্রম
        </span>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mt-6 mb-8">
          {schoolInfo.name} - এ ভর্তি সংক্রান্ত তথ্য
        </h1>

        {/* এক্সটার্নাল লিঙ্ক বাটন (অন্য সফটওয়্যারের লিঙ্ক) */}
        {admission?.externalLink && (
          <div className="mb-12">
            <a 
              href={admission.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-black text-lg py-4 px-8 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1"
            >
              📝 সরাসরি ভর্তি আবেদন ফর্ম (Apply Online)
            </a>
          </div>
        )}

        {/* এডিটেবল ভর্তি সংক্রান্ত নির্দেশনা */}
        <div className="text-left border-t pt-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📋 ভর্তি নির্দেশনাবলী ও নিয়মসমূহ:
          </h3>
          <div className="text-gray-600 text-base md:text-lg leading-relaxed whitespace-pre-line bg-gray-50 p-6 rounded-xl border border-gray-200">
            {admission?.instructions}
          </div>
        </div>

      </div>
    </main>
  );
}