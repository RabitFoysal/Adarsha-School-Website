import demoData from "@/data/demoData.json";
import { notFound } from "next/navigation";

export default async function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // TypeScript কে any টাইপ কাস্ট করে দেওয়া হলো যেন এরর না দেখায়
  const data = demoData as any;
  const directory = data.directory || [];

  // ক্যাটাগরি লুপ করে সঠিক উপ-লিঙ্ক এবং তার কনটেন্ট খুঁজে বের করা
  let foundItem: any = null;
  let categoryTitle = "";

  for (const category of directory) {
    // items অ্যারে আছে কি না চেক করে লুপ চালানো হচ্ছে
    if (category.items && Array.isArray(category.items)) {
      const item = category.items.find((i: any) => i.id === Number(id));
      if (item) {
        foundItem = item;
        categoryTitle = category.title;
        break;
      }
    }
  }

  if (!foundItem) {
    return <div>Not Found</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
        
        {/* প্রধান ক্যাটাগরি ট্যাগ */}
        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
          📁 {categoryTitle}
        </span>
        
        {/* আর্টিকেলের নাম */}
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-6 border-b pb-4 leading-snug">
          {foundItem.name}
        </h1>
        
        {/* বিস্তারিত লেখা বা আর্টিকেল */}
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {foundItem.content}
        </div>
        
      </div>
    </main>
  );
}