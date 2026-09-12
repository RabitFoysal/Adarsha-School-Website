"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import demoData from "@/data/demoData.json";

// TypeScript কে বাইপাস করার জন্য marquee ট্যাগকে any হিসেবে ডিফাইন করা হলো
const Marquee = "marquee" as any;

// ১. স্ক্রলিং বার্তা কম্পোনেন্ট (সুরক্ষিত)
function NewsTickerSection({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="bg-red-600 text-white flex items-center h-12 overflow-hidden shadow-md z-40 relative">
      <div className="bg-black/20 h-full flex items-center px-4 font-bold text-sm tracking-wider uppercase z-10 whitespace-nowrap animate-pulse">🔥 জরুরি ঘোষণা:</div>
      <div className="flex-1 overflow-hidden relative">
        {/* কাস্টম Marquee কম্পোনেন্ট ব্যবহার করা হলো */}
        <Marquee behavior="scroll" direction="left" scrollamount="6" className="flex items-center w-full h-full font-medium cursor-pointer" onMouseEnter={(e: any) => e.currentTarget.stop()} onMouseLeave={(e: any) => e.currentTarget.start()}>
          {data.map((item) => (
            <Link key={item.id} href="/news" className="inline-block mr-20 hover:text-yellow-300 transition text-sm md:text-base">• {item.title}</Link>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

// ২. ব্যানার সেকশন কম্পোনেন্ট
function BannerSection({ data, btnText }: { data: any, btnText: string }) {
  if (!data) return null;
  const bgPosClass = data.bgPosition === "top" ? "bg-top" : data.bgPosition === "bottom" ? "bg-bottom" : "bg-center";

  let alignClass = "text-center items-center justify-center";
  if (data.textAlign === "left") {
    alignClass = "text-left items-start justify-start pl-8 md:pl-20";
  } else if (data.textAlign === "right") {
    alignClass = "text-right items-end justify-end pr-8 md:pr-20";
  }

  return (
    <section className="relative h-[500px] flex items-center overflow-hidden">
      <div className={`absolute inset-0 z-0 bg-cover ${bgPosClass}`} style={{ backgroundImage: `url(${data.image || ""})` }}>
        <div className="absolute inset-0 bg-black" style={{ opacity: (data.opacity || 60) / 100 }}></div>
      </div>
      <div className={`relative z-10 w-full flex h-full ${alignClass}`}>
        <div className="max-w-3xl px-4 py-8">
          {data.showText !== false && (
            <>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{data.title || "স্বাগতম"}</h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-sm">{data.subtitle || ""}</p>
            </>
          )}
          {data.showButton !== false && (
            <Link href="/admission-info" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105">
              {btnText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ৩. লাইভ পরিসংখ্যান কাউন্টার সেকশন কম্পোনেন্ট
function StatsCounterSection({ data }: { data: any }) {
  if (!data) return null;

  const statItems = [
    { value: data.students || "৪৫০+", label: "মোট শিক্ষার্থী", icon: "👨‍🎓", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { value: data.teachers || "১৫+", label: "শিক্ষক ও কর্মচারী", icon: "👩‍🏫", color: "text-green-600 bg-green-50 border-green-100" },
    { value: data.passRate || "১০০%", label: "পাসের হার", icon: "📈", color: "text-orange-600 bg-orange-50 border-orange-100" },
    { value: data.established || "১৯৭৫", label: "প্রতিষ্ঠা সাল", icon: "🏛️", color: "text-purple-600 bg-purple-50 border-purple-100" }
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border text-center hover:shadow-md transition duration-300 flex flex-col items-center justify-center ${item.color}`}
            >
              <span className="text-4xl mb-3">{item.icon}</span>
              <h4 className="text-3xl font-black mb-1">{item.value}</h4>
              <p className="text-gray-500 font-bold text-xs md:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ৪. তথ্য কেন্দ্র বা ডিরেক্টরি সেকশন
function InfoDirectorySection({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-3 mb-6 flex items-center gap-2">🏫 বিদ্যালয় তথ্য কেন্দ্র</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((cat) => (
          <div key={cat.id} className="bg-[#f8f9fa] rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-[#e9ecef] px-4 py-2.5 border-b border-gray-200">
              <h4 className="font-bold text-gray-800 text-sm md:text-base">{cat.title}</h4>
            </div>
            <div className="p-4 flex gap-4 items-start">
              <div className="w-12 h-12 bg-gray-800 text-white rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1zm-1 14H4V6h16v12zM6 8h12v2H6zm0 4h12v2H6z"/>
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                {cat.items && Array.isArray(cat.items) && cat.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">»</span>
                    <Link href={`/info/${item.id}`} className="text-gray-700 hover:text-blue-600 font-bold text-xs md:text-sm transition hover:underline">{item.name}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৫. নোটিশ সেকশন কম্পোনেন্ট
function NoticesSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const latestNotices = data.slice(0, 3);
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">📢 {labels.noticesTitle || "সর্বশেষ নোটিশ সমূহ"}</h3>
        <Link href="/notices" className="text-xs font-bold text-blue-600 hover:underline">সকল নোটিশ ➔</Link>
      </div>
      <div className="space-y-4">
        {latestNotices.map((notice) => (
          <div key={notice.id} className="p-4 rounded-xl border border-gray-150 hover:bg-gray-50 transition flex justify-between items-center">
            <div>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">📅 {notice.date}</span>
              <h4 className="text-base font-bold text-gray-800 mt-2 line-clamp-1">{notice.title}</h4>
            </div>
            <Link href="/notices" className="text-xs text-blue-600 hover:underline flex-shrink-0">পড়ুন...</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৬. বিদ্যালয় বাণী সেকশন কম্পোনেন্ট
function MessagesSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-3 mb-6">💬 {labels.messagesTitle || "বিদ্যালয় বাণী"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((msg) => (
          <div key={msg.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4 items-start">
            <img src={msg.image} alt={msg.name} className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{msg.name}</h4>
              <p className="text-xs text-blue-600 mb-2">{msg.designation}</p>
              <p className="text-gray-600 text-xs line-clamp-2">"{msg.text}"</p>
              <Link href="/messages" className="text-blue-600 hover:underline text-xs font-bold mt-2 inline-block">বিস্তারিত ➔</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৭. ডাইনামিক ফটো গ্যালারি স্লাইডার কম্পোনেন্ট
function GallerySliderSection({ data }: { data: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-3 mb-6">🖼️ ফটো গ্যালারি স্লাইডার</h3>
      <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden rounded-xl border border-gray-200">
        <img src={data[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="w-full h-full object-cover" />
        <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-10 rounded flex items-center justify-center font-bold">❮</button>
        <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-10 rounded flex items-center justify-center font-bold">❯</button>
      </div>
    </div>
  );
}

// ৮. হোমপেজে ব্লগ ও আর্টিকেল সেকশন কম্পোনেন্ট
function BlogSection({ data, labels }: { data: any[]; labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  const latestBlogs = data.slice(0, 3);
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">📝 {labels.blogsTitle || "ব্লগ ও আর্টিকেল সমূহ"}</h3>
        <Link href="/blog" className="text-xs font-bold text-blue-600 hover:underline">সকল লেখা ➔</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between">
            <div className="h-32 overflow-hidden"><img src={blog.image} alt={blog.title} className="w-full h-full object-cover" /></div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-blue-600 font-bold">📅 {blog.date}</span>
                <h4 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">{blog.title}</h4>
                <p className="text-gray-600 text-xs line-clamp-2 mt-1">"{blog.content}"</p>
              </div>
              <Link href={`/blog/${blog.id}`} className="text-blue-600 hover:underline text-xs font-bold mt-3 inline-block">পড়ুন ➔</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ৯. শিক্ষকবৃন্দ সেকশন কম্পোনেন্ট
function TeachersSection({ data, labels }: { data: any[], labels: any }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-b pb-3 mb-6">👨‍🏫 {labels.teachersTitle || "আমাদের সম্মানিত শিক্ষকবৃন্দ"}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((teacher) => (
          <div key={teacher.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 text-center p-3">
            <img src={teacher.image} alt={teacher.name} className="w-16 h-16 rounded-full object-cover mx-auto border" />
            <h4 className="font-bold text-gray-800 text-sm mt-2 truncate">{teacher.name}</h4>
            <p className="text-blue-600 text-xs truncate">{teacher.designation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ১০. ডান পাশের "গুরুত্বপূর্ণ লিঙ্ক" উইজেট কম্পোনেন্ট
function ImportantLinksWidget({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      <div className="bg-black text-white px-4 py-2.5">
        <h4 className="font-extrabold text-sm md:text-base">Important Link</h4>
      </div>
      <div className="border border-gray-200 border-t-0 p-4 bg-[#f8f9fa] space-y-2.5">
        {data.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">»</span>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 hover:underline text-xs md:text-sm font-bold transition leading-snug">{link.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ১১. ডান পাশের "জরুরি হটলাইন" উইজেট কম্পোনেন্ট
function HelpLineWidget() {
  const hotlines = [
    { number: "999", name: "জরুরি সেবা" },
    { number: "333", name: "জাতীয় তথ্য বাতায়ন" },
    { number: "109", name: "নারী ও শিশু নির্যাতন" },
    { number: "106", name: "দুর্নীতি দমন কমিশন" }
  ];

  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      <div className="bg-black text-white px-4 py-2.5">
        <h4 className="font-extrabold text-sm md:text-base">Help Line</h4>
      </div>
      <div className="border border-gray-200 border-t-0 p-4 bg-white space-y-3">
        {hotlines.map((hl) => (
          <div key={hl.number} className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-100">
            <span className="text-xs font-bold text-gray-800">{hl.name}</span>
            <span className="text-sm font-black text-red-600">📞 {hl.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ১২. ডান পাশের "কাস্টম আপলোড করা হটলাইন ছবি/ব্যানার" উইজেট কম্পোনেন্ট
function SidebarImageWidget({ imageUrl }: { imageUrl: string }) {
  if (!imageUrl) return null;
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white p-2 shadow-sm text-center">
      <img src={imageUrl} alt="Sidebar Banner" className="w-full object-contain rounded" />
    </div>
  );
}

// ডাইনামিক রেন্ডারিং ও টু-কলাম লেআউট
export default function Home() {
  const heroBanner = demoData?.heroBanner;
  const teachers = demoData?.teachers || [];
  const notices = demoData?.notices || [];
  const messages = demoData?.messages || [];
  const news = demoData?.news || [];
  const gallery = demoData?.gallery || [];
  const blogs = demoData?.blogs || [];
  const directory = demoData?.directory || [];
  const importantLinks = demoData?.importantLinks || [];
  const sidebarImage = demoData?.sidebarImage || "";
  const stats = demoData?.stats;
  const layoutConfig = demoData?.layoutConfig;
  const uiLabels = demoData?.uiLabels || {};

  const renderOrder = layoutConfig || [
    { id: "news_ticker", active: true },
    { id: "banner", active: true },
    { id: "stats_counter", active: true },
    { id: "info_directory", active: true },
    { id: "notices", active: true },
    { id: "messages", active: true },
    { id: "gallery_slider", active: true },
    { id: "blog_section", active: true },
    { id: "teachers", active: true },
    { id: "sidebar_links", active: true },
    { id: "sidebar_helpline", active: true },
    { id: "sidebar_image", active: true }
  ];

  const isTickerActive = renderOrder.find(s => s.id === "news_ticker" && s.active);
  const isBannerActive = renderOrder.find(s => s.id === "banner" && s.active);
  const sidebarOrder = renderOrder.filter(s => s.id.startsWith("sidebar_"));

  return (
    <main className="bg-gray-50 min-h-screen">
      {isTickerActive && <NewsTickerSection data={news} />}
      {isBannerActive && <BannerSection data={heroBanner} btnText={uiLabels.applyButton || "ভর্তি তথ্য জানুন"} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {renderOrder.map((section: any) => {
            if (section.id === "news_ticker" || section.id === "banner" || section.id.startsWith("sidebar_")) return null;
            if (!section.active) return null;

            switch (section.id) {
              case "stats_counter":
                return <StatsCounterSection key="stats_counter" data={stats} />;
              case "info_directory":
                return <InfoDirectorySection key="info_directory" data={directory} />;
              case "notices":
                return <NoticesSection key="notices" data={notices} labels={uiLabels} />;
              case "messages":
                return <MessagesSection key="messages" data={messages} labels={uiLabels} />;
              case "gallery_slider":
                return <GallerySliderSection key="gallery_slider" data={gallery} />;
              case "blog_section":
                return <BlogSection key="blog_section" data={blogs} labels={uiLabels} />;
              case "teachers":
                return <TeachersSection key="teachers" data={teachers} labels={uiLabels} />;
              default:
                return null;
            }
          })}
        </div>

        <aside className="lg:col-span-1 space-y-8 h-fit lg:sticky lg:top-24">
          {sidebarOrder.map((widget) => {
            if (!widget.active) return null;

            switch (widget.id) {
              case "sidebar_links":
                return <ImportantLinksWidget key="sidebar_links" data={importantLinks} />;
              case "sidebar_helpline":
                return <HelpLineWidget key="sidebar_helpline" />;
              case "sidebar_image":
                return <SidebarImageWidget key="sidebar_image" imageUrl={sidebarImage} />;
              default:
                return null;
            }
          })}
        </aside>
      </div>
    </main>
  );
}