import { getSchoolData } from "@/lib/dataProvider";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, User, Clock, BookOpen, Share2 } from "lucide-react";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getSchoolData();
  const blogs = data?.blogs || [];
  const blog = blogs.find((b: any) => String(b.id) === String(id));
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  if (!blog) {
    return { title: `ব্লগ পোস্ট পাওয়া যায়নি | ${schoolName}` };
  }

  const excerpt = blog.content ? blog.content.substring(0, 160) + "..." : "বিস্তারিত পড়ুন";

  return {
    title: `${blog.title} | ${schoolName}`,
    description: excerpt,
    openGraph: {
      title: blog.title,
      description: excerpt,
      images: blog.image ? [{ url: blog.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: excerpt,
      images: blog.image ? [blog.image] : [],
    }
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSchoolData();
  const blogs = data?.blogs || [];
  const schoolInfo = data?.schoolInfo || {};
  const blog = blogs.find((b: any) => String(b.id) === String(id));

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 min-h-screen">
      {/* ব্যাক বাটন */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল ব্লগে ফিরে যান</span>
        </Link>
      </div>

      <article className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* কভার ইমেজ */}
        {blog.image && (
          <div className="w-full h-[300px] sm:h-[450px] relative bg-slate-100 overflow-hidden">
            <SafeImage 
              src={blog.image} 
              fallbackSrc="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop"
              alt={blog.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="p-6 sm:p-10 md:p-12">
          {/* মেটাডাটা */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
            {blog.date && (
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{blog.date}</span>
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-blue-600" />
              <span>{blog.author || "বিদ্যালয় পরিবার"}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>একাডেমিক প্রবন্ধ</span>
            </span>
          </div>

          {/* টাইটেল */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
            {blog.title}
          </h1>

          {/* মূল লেখা */}
          <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
            {blog.content}
          </div>

          {/* ফুটার কার্ড */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">প্রকাশক</span>
              <span className="text-sm font-bold text-slate-800">{schoolInfo.name || "বিদ্যালয় কর্তৃপক্ষ"}</span>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              আরও আর্টিকেল পড়ুন →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
