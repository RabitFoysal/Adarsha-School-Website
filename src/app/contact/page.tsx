import demoData from "@/data/demoData.json";

export default function ContactPage() {
  const { schoolInfo } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* পেজের টাইটেল */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">যোগাযোগ করুন</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          ভর্তি সংক্রান্ত যেকোনো তথ্য বা অন্য যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন। আমরা দ্রুত আপনার প্রশ্নের উত্তর দেওয়ার চেষ্টা করব।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* বাম পাশ: যোগাযোগের তথ্য */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 mb-6">আমাদের ঠিকানা</h3>
          <div className="space-y-6">
            
            {/* ঠিকানা কার্ড */}
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl">📍</div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">ঠিকানা</h4>
                <p className="text-gray-600 mt-1">{schoolInfo.contact.address}</p>
              </div>
            </div>

            {/* ফোন নম্বর কার্ড */}
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl">📞</div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">ফোন নম্বর</h4>
                <p className="text-gray-600 mt-1">{schoolInfo.contact.phone}</p>
              </div>
            </div>

            {/* ইমেইল কার্ড */}
            <div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-3xl">✉️</div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">ইমেইল</h4>
                <p className="text-gray-600 mt-1">{schoolInfo.contact.email}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ডান পাশ: মেসেজ পাঠানোর ফর্ম */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">মেসেজ পাঠান</h3>
          <form className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">আপনার নাম</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" 
                placeholder="আপনার নাম লিখুন" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল এড্রেস</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" 
                placeholder="আপনার ইমেইল লিখুন" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">মেসেজ</label>
              <textarea 
                rows={4} 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" 
                placeholder="আপনার মেসেজ বিস্তারিত লিখুন"
              ></textarea>
            </div>
            
            <button 
              type="button" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
            >
              মেসেজ পাঠান
            </button>
            
          </form>
        </div>

      </div>
    </main>
  );
}