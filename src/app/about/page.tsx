import demoData from "@/data/demoData.json";

export default function AboutPage() {
  const { schoolInfo } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* পেজের টাইটেল */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">আমাদের সম্পর্কে</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
      </div>

      {/* মূল কনটেন্ট সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* বাম পাশের ছবি */}
        <div>
          <img 
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop" 
            alt="About School" 
            className="rounded-2xl shadow-xl w-full h-[450px] object-cover"
          />
        </div>

        {/* ডান পাশের লেখা */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            {schoolInfo.name} - এ আপনাকে স্বাগতম
          </h3>
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            আমাদের বিদ্যালয়টি দীর্ঘ সময় ধরে শিক্ষার আলো ছড়িয়ে আসছে। আমরা বিশ্বাস করি প্রতিটি শিশুই বিশেষ এবং তাদের ভেতরে লুকিয়ে থাকা সুপ্ত প্রতিভাকে বিকশিত করাই আমাদের মূল লক্ষ্য। 
          </p>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            আধুনিক শিক্ষাব্যবস্থা, দক্ষ শিক্ষকমণ্ডলী এবং মনোরম পরিবেশের সমন্বয়ে আমরা গড়ে তুলেছি এক আদর্শ বিদ্যাপীঠ। আমাদের শিক্ষার্থীরা শুধু পড়াশোনায় নয়, বরং খেলাধুলা ও সাংস্কৃতিক কার্যক্রমেও সমানভাবে এগিয়ে।
          </p>
          
          {/* লক্ষ্য ও উদ্দেশ্য কার্ড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition">
              <h4 className="font-bold text-blue-800 text-xl mb-2">আমাদের লক্ষ্য</h4>
              <p className="text-gray-600">মানসম্মত শিক্ষা নিশ্চিত করে একটি সুন্দর ও শিক্ষিত সমাজ গঠন করা।</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition">
              <h4 className="font-bold text-blue-800 text-xl mb-2">আমাদের উদ্দেশ্য</h4>
              <p className="text-gray-600">শিক্ষার্থীদের নৈতিক মূল্যবোধ ও আধুনিক প্রযুক্তিতে দক্ষ করে তোলা।</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}