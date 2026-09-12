import demoData from "@/data/demoData.json";

export default function MessagesPage() {
  const { messages } = demoData;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">বিদ্যালয় বাণী ও শুভেচ্ছা বার্তা</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4">বিদ্যালয়ের সম্মানিত সভাপতি ও দায়িত্বপ্রাপ্ত ব্যক্তিদের বাণী সমূহ</p>
      </div>

      <div className="space-y-12">
        {messages.map((msg: any) => (
          <div 
            key={msg.id} 
            className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-8 items-start"
          >
            {/* ছবি */}
            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 mx-auto md:mx-0">
              <img 
                src={msg.image} 
                alt={msg.name} 
                className="w-full h-full object-cover rounded-2xl border-4 border-blue-50 shadow-md" 
              />
            </div>

            {/* বাণী */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center md:text-left">{msg.name}</h3>
              <p className="text-blue-600 font-semibold mb-6 text-center md:text-left text-sm">{msg.designation}</p>
              
              <div className="relative">
                {/* উক্তি ডেকোরেশন */}
                <span className="absolute -top-6 -left-4 text-6xl text-blue-100 font-serif">“</span>
                <p className="text-gray-700 text-lg leading-relaxed relative z-10 whitespace-pre-line">
                  {msg.text}
                </p>
                <span className="absolute -bottom-10 right-0 text-6xl text-blue-100 font-serif">”</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}