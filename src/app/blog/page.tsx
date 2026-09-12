import Link from "next/link";
import demoData from "@/data/demoData.json";

export default function BlogIndexPage() {
  const { blogs } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">বিদ্যালয় ব্লগ ও অনুচ্ছেদ</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4">আমাদের শিক্ষক ও শিক্ষার্থীদের লেখা সৃজনশীল প্রবন্ধ, শিক্ষামূলক আর্টিকেল ও ডায়েরি সমূহের সংকলন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs && blogs.map((blog: any) => (
          <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
            <div className="h-48 overflow-hidden">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                  📅 {blog.date} | ✍️ {blog.author}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2 leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {blog.content}
                </p>
              </div>

              <Link 
                href={`/blog/${blog.id}`}
                className="inline-block text-center bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-bold py-2 rounded-lg transition text-sm cursor-pointer"
              >
                বিস্তারিত পড়ুন ➔
              </Link>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}