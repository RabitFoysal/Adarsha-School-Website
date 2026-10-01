import { getSchoolData } from "@/lib/dataProvider";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, Download, ExternalLink, ArrowLeft, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSchoolData();
  const customPages = data?.customPages || [];
  const page = customPages.find((p: any) => p.slug === slug);
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  if (!page) {
    return { title: `তথ্য পাতা | ${schoolName}` };
  }

  const excerpt = page.content ? page.content.substring(0, 160) : `${page.title} সংক্রান্ত তথ্য।`;

  return {
    title: `${page.title} | ${schoolName}`,
    description: excerpt,
    openGraph: {
      title: page.title,
      description: excerpt,
      images: page.image ? [{ url: page.image }] : [],
    }
  };
}

export default async function DynamicCustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const data = await getSchoolData();
  const customPages = data?.customPages || [];
  const schoolInfo = data?.schoolInfo || {};

  const page = customPages.find((p: any) => p.slug === slug);

  if (!page) {
    notFound();
  }

  // ইমেজ সাইজ ক্লাস ম্যাপ
  const getImageSizeClass = (size?: string) => {
    switch (size) {
      case "small": return "max-w-xs md:max-w-sm";
      case "medium": return "max-w-md md:max-w-lg";
      case "large": return "max-w-2xl md:max-w-3xl";
      case "full": return "w-full";
      default: return "max-w-xl";
    }
  };

  const isFullPdfTemplate = page.template === "pdf_only" || (page.pdfUrl && page.pdfMode === "embed" && !page.content);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-screen">
      {/* ব্যাক ও নেভিগেশন বার */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>

        {page.updatedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>সর্বশেষ আপডেট: {new Date(page.updatedAt).toLocaleDateString('bn-BD')}</span>
          </div>
        )}
      </div>

      <article className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* পেজ হেডার */}
        <header className="p-6 md:p-10 border-b border-gray-100 bg-gradient-to-b from-blue-50/30 to-transparent">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            {schoolInfo.name || "অফিসিয়াল তথ্য পাতা"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {page.title}
          </h1>
        </header>

        {/* সম্পূর্ণ পেজ পিডিএফ মোড */}
        {isFullPdfTemplate && page.pdfUrl ? (
          <div className="p-4 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{page.pdfName || "ডকুমেন্ট ফাইল (PDF)"}</h4>
                  <p className="text-xs text-gray-500">নিচে সরাসরি ডকুমেন্টের পূর্ণাঙ্গ কপি প্রদর্শিত হচ্ছে</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={page.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  নতুন ট্যাবে খুলুন
                </a>
                <a
                  href={page.pdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  ডাউনলোড করুন
                </a>
              </div>
            </div>

            {/* এমবেডেড ফুল পেজ আইফ্রেম ভিউয়ার */}
            <div className="w-full h-[85vh] min-h-[650px] rounded-xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100">
              <iframe
                src={`${page.pdfUrl}#toolbar=1`}
                className="w-full h-full"
                title={page.title}
              />
            </div>
          </div>
        ) : (
          /* সাধারণ পেজ (টেক্সট + ইমেজ + পিডিএফ) */
          <div className="p-6 md:p-10 space-y-8">
            {/* টপ ব্যানার ইমেজ */}
            {page.image && page.imagePosition === "top" && (
              <figure className="space-y-2">
                <div className={`mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-xs ${getImageSizeClass(page.imageSize)}`}>
                  <img src={page.image} alt={page.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
                {page.imageCaption && (
                  <figcaption className="text-center text-xs text-gray-500 italic">
                    {page.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* মূল কনটেন্ট এবং সাইড/সেন্টার ইমেজ */}
            <div className="prose max-w-none">
              {/* লেফট বা রাইট ফ্লোটিং ইমেজ */}
              {page.image && (page.imagePosition === "left" || page.imagePosition === "right") && (
                <div className={`mb-6 ${page.imagePosition === "left" ? "md:float-left md:mr-8" : "md:float-right md:ml-8"} ${getImageSizeClass(page.imageSize)}`}>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                    <img src={page.image} alt={page.title} className="w-full h-auto object-cover" />
                  </div>
                  {page.imageCaption && (
                    <p className="text-xs text-gray-500 italic mt-2 text-center">{page.imageCaption}</p>
                  )}
                </div>
              )}

              {/* সেন্টার ইমেজ */}
              {page.image && page.imagePosition === "center" && (
                <figure className="my-8 space-y-2">
                  <div className={`mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-xs ${getImageSizeClass(page.imageSize)}`}>
                    <img src={page.image} alt={page.title} className="w-full h-auto object-cover" />
                  </div>
                  {page.imageCaption && (
                    <figcaption className="text-center text-xs text-gray-500 italic">
                      {page.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* টেক্সট কনটেন্ট */}
              {page.content && (
                <div className="text-gray-800 text-base md:text-lg leading-relaxed whitespace-pre-line font-normal space-y-4">
                  {page.content}
                </div>
              )}
            </div>

            {/* মেম্বার লিস্ট টেমপ্লেট হলে মেম্বার গ্রিড */}
            {page.template === "list" && page.listItems && page.listItems.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {page.listItems.map((item: any) => (
                    <div key={item.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 text-center hover:shadow-md transition">
                      <img 
                        src={item.image || "/images/placeholder-avatar.png"} 
                        alt={item.name} 
                        className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white shadow-xs" 
                      />
                      <h4 className="text-base font-bold text-gray-900 mt-4 truncate">{item.name}</h4>
                      <p className="text-blue-600 font-semibold text-xs truncate mt-1">{item.designation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* পিডিএফ ফাইল সেকশন (যদি অ্যাটাচ করা থাকে) */}
            {page.pdfUrl && (
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <span>সংযুক্ত নথি / ডকুমেন্ট</span>
                </h3>

                {page.pdfMode === "embed" ? (
                  /* খোলা অবস্থায় এমবেডেড ভিউয়ার */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                      <span className="text-sm font-semibold text-gray-700 truncate">{page.pdfName || "ডকুমেন্ট ফাইল (PDF)"}</span>
                      <div className="flex gap-2">
                        <a href={page.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 bg-white border rounded font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> বড় করুন
                        </a>
                        <a href={page.pdfUrl} download className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> ডাউনলোড
                        </a>
                      </div>
                    </div>
                    <div className="w-full h-[75vh] min-h-[550px] rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-gray-100">
                      <iframe src={`${page.pdfUrl}#toolbar=1`} className="w-full h-full" title="PDF Document" />
                    </div>
                  </div>
                ) : (
                  /* ডাউনলোড/ভিউ বাটন মোড */
                  <div className="bg-gradient-to-r from-red-50/70 via-gray-50 to-blue-50/40 p-5 rounded-2xl border border-red-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{page.pdfName || "অফিসিয়াল ডকুমেন্ট (PDF)"}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">ক্লিক করে ফাইলটি অনলাইনে পড়ুন অথবা সংরক্ষণ করুন</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href={page.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-2xs"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        পিডিএফ দেখুন
                      </a>
                      <a
                        href={page.pdfUrl}
                        download
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        ডাউনলোড
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </article>
    </main>
  );
}
