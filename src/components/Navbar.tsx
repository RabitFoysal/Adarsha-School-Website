import Link from "next/link";
import demoData from "@/data/demoData.json";

export default function Navbar() {
  const { schoolInfo, admission, navbarLinks } = demoData;

  const links = navbarLinks || [];
  
  // ১. শুধুমাত্র একটিভ এবং প্রধান মেনু লিঙ্ক সমূহ ফিল্টার করা (যাদের parentId নাই)
  const mainLinks = links.filter((link: any) => link.parentId === null && link.active);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-3">
          <img 
            src={schoolInfo.logo} 
            alt="School Logo" 
            className="h-12 w-12 rounded-full object-cover border-2 border-blue-600" 
          />
          <h1 className="text-xl md:text-2xl font-bold text-blue-900">{schoolInfo.name}</h1>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex gap-6 items-center">
            {mainLinks.map((link: any) => {
              // ২. এই প্রধান মেনুর অধীনে অন্য কোনো একটিভ সাব-মেনু লিঙ্ক আছে কি না ফিল্টার করা
              const subLinks = links.filter((sub: any) => sub.parentId === link.id && sub.active);
              const hasSub = subLinks.length > 0;

              if (hasSub) {
                return (
                  <div key={link.id} className="relative group py-2">
                    <button className="flex items-center gap-1 hover:text-blue-600 transition font-semibold text-gray-700 outline-none">
                      {link.name} <span className="text-[10px] text-gray-400">▼</span>
                    </button>
                    
                    {/* সাব-মেনু ড্রপডাউন বক্স */}
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                      {subLinks.map((sub: any) => (
                        <Link 
                          key={sub.id} 
                          href={sub.url} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-semibold"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={link.id} href={link.url} className="hover:text-blue-600 transition font-semibold text-gray-700">
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {admission?.showNavbarButton && (
            <Link 
              href="/admission-info" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition shadow-md animate-pulse"
            >
              🎓 ভর্তি তথ্য
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}