import demoData from "@/data/demoData.json";
import { notFound } from "next/navigation";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // TypeScript কে ডিরেক্টলি any টাইপ কাস্ট করে দেওয়া হলো যেন এরর না দেখায়
  const data = demoData as any;
  const blogs = data.blogs || [];
  const blog = blogs.find((b: any) => b.id === Number(id));

  if (!blog) {
    return <div>Not Found</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <article>
        
        {/* লেখকের বিবরণ */}
        <div className="mb-8">
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
            📅 প্রকাশকাল: {blog.date} | ✍️ লেখক: {blog.author}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
            {blog.title}
          </h1>
        </div>

        {/* কভার ইমেজ */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* মূল আর্টিকেল লেখা */}
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {blog.content}
        </div>
        
      </article>
    </main>
  );
}