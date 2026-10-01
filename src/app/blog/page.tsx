import { getSchoolData } from "@/lib/dataProvider";
import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Calendar, ArrowRight, User, Clock } from "lucide-react";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `ব্লগ ও শিক্ষামূলক প্রবন্ধ | ${schoolName}`,
    description: `${schoolName}-এর শিক্ষক ও শিক্ষার্থীদের সৃজনশীল লেখা, শিক্ষামূলক প্রবন্ধ ও সমসাময়িক চিন্তাভাবনার সংকলন।`,
    openGraph: {
      title: `ব্লগ | ${schoolName}`,
      description: `${schoolName}-এর সৃজনশীল ব্লগ ও প্রবন্ধ সংকলন।`,
    }
  };
}

export default async function BlogIndexPage() {
  const data = await getSchoolData();
  const blogs = data?.blogs || [];
  const schoolName = data?.schoolInfo?.name || "আমাদের বিদ্যাপীঠ";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>সৃজনশীল ভাবনা ও প্রবন্ধ</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          বিদ্যালয় ব্লগ ও অনুচ্ছেদ
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolName}-এর সম্মানিত শিক্ষক ও শিক্ষার্থীদের লেখা বিভিন্ন শিক্ষামূলক প্রবন্ধ, গবেষণা ও সমসাময়িক চিন্তাভাবনার সমৃদ্ধ সংকলন।
        </p>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <article 
              key={blog.id} 
              className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* থাম্বনেইল ছবি */}
              <div className="h-52 overflow-hidden relative bg-slate-100">
                <SafeImage 
                  src={blog.image} 
                  fallbackSrc="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop"
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                {/* ভাসমান তারিখ */}
                {blog.date && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span>{blog.date}</span>
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1 text-slate-200">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>{blog.author || "বিদ্যালয় পরিবার"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-200 text-[11px] bg-black/40 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>৩ মিনিট পাঠ</span>
                  </span>
                </div>
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-3 mb-4">
                    {blog.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">একাডেমিক ব্লগ</span>
                  <Link 
                    href={`/blog/${blog.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 group-hover:translate-x-1 transition duration-200"
                  >
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">কোনো ব্লগ পোস্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1">শীঘ্রই নতুন শিক্ষামূলক আর্টিকেল ও প্রবন্ধ প্রকাশিত হবে।</p>
        </div>
      )}
    </main>
  );
}
