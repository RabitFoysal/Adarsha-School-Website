import demoData from "@/data/demoData.json";

export default function NewsPage() {
  const { news } = demoData;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">জরুরি খবর ও নোটিশ সমূহ</h2>
        <div className="w-24 h-1 bg-red-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4">হোমপেজে প্রচারিত সকল স্ক্রলিং খবরের বিস্তারিত বিবরণ</p>
      </div>

      <div className="space-y-8">
        {news && news.map((item: any) => (
          <div 
            key={item.id} 
            className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition border-l-4 border-l-red-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full text-xs animate-pulse">
                🔴 লাইভ নোটিশ
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        ))}

        {(!news || news.length === 0) && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
            কোনো নোটিশ পাওয়া যায়নি।
          </div>
        )}
      </div>

    </main>
  );
}