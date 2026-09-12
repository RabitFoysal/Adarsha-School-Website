import demoData from "@/data/demoData.json";
import { notFound } from "next/navigation";

export default async function DynamicCustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // TypeScript কে any কাস্ট করে ডাইনামিক পেজ সেফলি রিড করা হচ্ছে
  const data = demoData as any;
  const customPages = data.customPages || [];

  const page = customPages.find((p: any) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 border-b pb-4 mb-8">
          {page.title}
        </h1>

        {page.template === "text" && (
          <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {page.content}
          </div>
        )}

        {page.template === "list" && (
          <div className="space-y-8">
            {page.content && (
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-8 border-b pb-8">
                {page.content}
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {page.listItems && page.listItems.map((item: any) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl border p-4 text-center hover:shadow-md transition">
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-full object-cover mx-auto border" />
                  <h4 className="text-base font-bold text-gray-900 mt-4 truncate">{item.name}</h4>
                  <p className="text-blue-600 font-semibold text-xs truncate">{item.designation}</p>
                </div>
              ))}
              {(!page.listItems || page.listItems.length === 0) && (
                <p className="col-span-full text-center text-gray-500">এই তালিকায় কোনো সদস্য যুক্ত করা হয়নি।</p>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}