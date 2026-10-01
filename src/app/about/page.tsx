import { getSchoolData } from "@/lib/dataProvider";
import type { Metadata } from "next";
import { 
  Building2, 
  GraduationCap, 
  Target, 
  Compass, 
  CheckCircle2, 
  Calendar, 
  Award,
  Users,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import SafeImage from "@/components/SafeImage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";
  const slogan = data?.schoolInfo?.slogan || "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ";
  const address = data?.schoolInfo?.contact?.address || "বাংলাদেশ";

  return {
    title: `আমাদের সম্পর্কে | ${schoolName}`,
    description: `${schoolName} (${address}) - ${slogan}। বিদ্যালয়ের ইতিহাস, লক্ষ্য, উদ্দেশ্য ও পরিচিতি।`,
    openGraph: {
      title: `আমাদের সম্পর্কে | ${schoolName}`,
      description: `${schoolName} - ${slogan}`,
      images: data?.heroBanner?.image ? [{ url: data.heroBanner.image }] : [],
    }
  };
}

export default async function AboutPage() {
  const data = await getSchoolData();
  const schoolInfo = data?.schoolInfo || {};
  const stats = data?.stats || {};
  const heroBanner = data?.heroBanner || {};
  const aboutInfo = data?.aboutInfo || {};

  const schoolName = schoolInfo.name || "আমাদের বিদ্যাপীঠ";
  const slogan = schoolInfo.slogan || "শিক্ষাই জাতির মেরুদণ্ড - আমরা গড়ি আগামীর ভবিষ্যৎ";
  const eiin = schoolInfo.eiin || "";
  const established = schoolInfo.established || stats.established || "১৯৭৫";
  const address = schoolInfo.contact?.address || "বাংলাদেশ";
  const phone = schoolInfo.contact?.phone || "";
  const email = schoolInfo.contact?.email || "";
  
  // Custom about fields from admin
  const pageTitle = aboutInfo.title || "আমাদের সম্পর্কে";
  const pageSubtitle = aboutInfo.subtitle || `${schoolName}-এর সুদীর্ঘ ঐতিহ্য, নৈতিক শিক্ষার আদর্শ ও সার্বিক অগ্রযাত্রার বিস্তারিত বিবরণ।`;
  const welcomeHeading = aboutInfo.welcomeHeading || "স্বাগতম আমাদের প্রাঙ্গণে";
  const description1 = aboutInfo.description1 || aboutInfo.description || `${schoolName} দীর্ঘ সময় ধরে জাতির ভবিষ্যৎ কর্ণধারদের সুশিক্ষায় শিক্ষিত করে গড়ে তুলছে। পুঁথিগত শিক্ষার পাশাপাশি চরিত্র গঠন, নৈতিক মূল্যবোধ ও প্রযুক্তিগত দক্ষতায় আমাদের শিক্ষার্থীরা প্রতিনিয়ত নিজেদের মেধার স্বাক্ষর রেখে চলেছে।`;
  const description2 = aboutInfo.description2 || "অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী, ডিজিটাল ক্লাসরুম, সমৃদ্ধ লাইব্রেরি এবং সুপরিসর বিজ্ঞানাগার ও খেলার মাঠের সমন্বয়ে আমরা শিক্ষার্থীদের জন্য একটি আদর্শ একাডেমিক পরিবেশ নিশ্চিত করেছি।";

  const aboutImage = aboutInfo.image || heroBanner.image || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop";

  const missionTitle = aboutInfo.missionTitle || "আমাদের লক্ষ্য (Our Mission)";
  const missionText = aboutInfo.missionText || "মানসম্মত যুগোপযোগী শিক্ষা প্রদান, মানবিক গুণাবলীর বিকাশ এবং প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভার সর্বোচ্চ বিকাশ ঘটিয়ে একটি জ্ঞানভিত্তিক ও বৈষম্যহীন সুন্দর সমাজ বিনির্মাণ করা।";
  const missionPoints = [
    aboutInfo.missionPoint1 || "ডিজিটাল কারিকুলাম ও আধুনিক বিজ্ঞানমনস্ক পাঠদান",
    aboutInfo.missionPoint2 || "নৈতিকতা, দেশপ্রেম ও নিয়মানুবর্তিতার সঠিক চর্চা",
    aboutInfo.missionPoint3 || "সহশিক্ষা কার্যক্রম ও খেলাধুলায় শিক্ষার্থীদের সক্রিয় অংশগ্রহণ"
  ].filter(Boolean);

  const visionTitle = aboutInfo.visionTitle || "আমাদের দৃষ্টিভঙ্গি (Our Vision)";
  const visionText = aboutInfo.visionText || "একবিংশ শতাব্দীর চ্যালেঞ্জ মোকাবিলায় সক্ষম, সৃজনশীল ও প্রযুক্তিনির্ভর দক্ষ মানবসম্পদ তৈরিতে দেশের অন্যতম শীর্ষস্থানীয় মডেল শিক্ষা প্রতিষ্ঠান হিসেবে আত্মপ্রকাশ করা।";
  const visionPoints = [
    aboutInfo.visionPoint1 || "স্মার্ট ক্লাসরুম ও তথ্যপ্রযুক্তির সর্বজনীন ব্যবহার",
    aboutInfo.visionPoint2 || "পরীক্ষায় শতভাগ সাফল্য ও মেধার সুষম মূল্যায়ন",
    aboutInfo.visionPoint3 || "নিরাপদ, পরিচ্ছন্ন ও শিক্ষাবান্ধব ক্যাম্পাস সংস্কৃতি"
  ].filter(Boolean);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      {/* হেডার সেকশন */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>প্রাতিষ্ঠানিক পরিচিতি ও ইতিহাস</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {pageSubtitle}
        </p>
      </div>

      {/* মূল পরিচিতি ও ক্যাম্পাস ছবি */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        {/* ক্যাম্পাস ইমেজ */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-100 h-[380px] sm:h-[460px]">
            <SafeImage 
              src={aboutImage} 
              fallbackSrc="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
              alt={schoolName} 
              className="w-full h-full object-cover group-hover:scale-103 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">ঐতিহ্যবাহী বিদ্যাপীঠ</span>
              <h3 className="text-xl sm:text-2xl font-black leading-snug mt-1">{schoolName}</h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">{address}</p>
            </div>
          </div>
        </div>

        {/* পরিচিতি টেক্সট */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">{welcomeHeading}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-snug">
              {slogan}
            </h2>
          </div>

          <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
            {description1}
          </p>
          {description2 && (
            <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
              {description2}
            </p>
          )}

          {/* দ্রুত তথ্য গ্রিড */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-400 font-semibold block">প্রতিষ্ঠাকাল</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{established} খ্রিস্টাব্দ</span>
            </div>
            {eiin && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-400 font-semibold block">EIIN নম্বর</span>
                <span className="text-lg font-black text-blue-700 mt-0.5 block">{eiin}</span>
              </div>
            )}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-semibold block">পাস হার</span>
              <span className="text-lg font-black text-emerald-600 mt-0.5 block">{stats.passRate || "৯৮.৫%"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* লক্ষ্য ও উদ্দেশ্য সেকশন */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-3">{missionTitle}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {missionText}
          </p>
          <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
            {missionPoints.map((pt, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-3">{visionTitle}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            {visionText}
          </p>
          <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
            {visionPoints.map((pt, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* যোগাযোগের সারসংক্ষেপ */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-300 font-bold">যোগাযোগ ও অনুসন্ধান</span>
          <h3 className="text-2xl font-black mt-1">{schoolName}-এ সরাসরি আসুন</h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">{address}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {phone && (
            <a 
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 bg-white text-slate-900 text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-100 transition shadow-sm"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a 
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-blue-800 transition"
            >
              <Mail className="w-4 h-4 text-blue-300" />
              <span>ইমেইল পাঠান</span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
