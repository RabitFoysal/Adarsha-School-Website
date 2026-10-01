import { getSchoolData } from "@/lib/dataProvider";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const data = await getSchoolData();
  const directory = data?.directory || [];

  let foundItem: any = null;
  let categoryTitle = "";

  for (const category of directory) {
    if (category.items && Array.isArray(category.items)) {
      const item = category.items.find((i: any) => String(i.id) === String(id));
      if (item) {
        foundItem = item;
        categoryTitle = category.title;
        break;
      }
    }
  }

  if (!foundItem) {
    notFound();
  }

  // যদি সরাসরি অন্য কোনো লিঙ্ক (যেমন কাস্টম পেজ) দেওয়া থাকে
  if (foundItem.url && foundItem.url.trim() !== "") {
    redirect(foundItem.url);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600 hover:text-blue-600 transition mb-6 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>হোমপেজে ফিরে যান</span>
      </Link>

      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs border border-blue-100 inline-block">
          📁 {categoryTitle}
        </span>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-4 mb-6 border-b border-slate-100 pb-4 leading-snug">
          {foundItem.name}
        </h1>
        
        <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line font-normal">
          {foundItem.content || "এই বিষয়ের বিস্তারিত তথ্য প্রকাশের প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে পরবর্তীতে পুনরায় ভিজিট করুন অথবা প্রতিষ্ঠান কর্তৃপক্ষের সাথে যোগাযোগ করুন।"}
        </div>
      </div>
    </main>
  );
}
