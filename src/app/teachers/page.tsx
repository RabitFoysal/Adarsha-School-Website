import demoData from "@/data/demoData.json";

export default function TeachersPage() {
  const { teachers } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      {/* পেজের টাইটেল */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">আমাদের সম্মানিত শিক্ষকবৃন্দ</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          আমাদের রয়েছে একদল দক্ষ, অভিজ্ঞ এবং নিবেদিতপ্রাণ শিক্ষকমণ্ডলী, যারা শিক্ষার্থীদের উজ্জ্বল ভবিষ্যৎ গড়তে নিরলস পরিশ্রম করে যাচ্ছেন।
        </p>
      </div>

      {/* শিক্ষকদের কার্ডের গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {teachers.map((teacher) => (
          <div 
            key={teacher.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            {/* শিক্ষকের ছবি */}
            <div className="relative h-72 overflow-hidden">
              <img 
                src={teacher.image} 
                alt={teacher.name} 
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
              />
            </div>
            
            {/* শিক্ষকের তথ্য */}
            <div className="p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h4>
              <p className="text-blue-600 font-medium mb-4">{teacher.designation}</p>
              
              {/* ছোট একটি ডেকোরেশন লাইন */}
              <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-4"></div>
              
              {/* যোগাযোগের ডেমো বাটন */}
              <button className="text-sm text-gray-500 hover:text-blue-600 font-medium transition">
                প্রোফাইল দেখুন ➔
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}