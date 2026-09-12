import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center py-16">
      
      {/* চমৎকার বড় ৪০৪ ইলাস্ট্রেশন টেক্সট */}
      <span className="text-9xl font-black text-blue-100 select-none animate-pulse">
        ৪০৪
      </span>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-6 mb-3">
        দুঃখিত, পেজটি পাওয়া যায়নি!
      </h2>
      
      <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
        আপনি সম্ভবত ভুল কোনো লিঙ্কে প্রবেশ করেছেন অথবা পেজটি সাময়িকভাবে সরিয়ে ফেলা হয়েছে।
      </p>

      {/* হোমপেজে ফিরে যাওয়ার বাটন */}
      <Link 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition transform hover:-translate-y-0.5 duration-200 cursor-pointer"
      >
        🏠 হোমপেজে ফিরে যান
      </Link>
      
    </main>
  );
}