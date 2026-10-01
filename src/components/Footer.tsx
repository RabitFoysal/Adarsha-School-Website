"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import demoData from "@/data/demoData.json";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  ArrowUp, 
  ShieldCheck, 
  GraduationCap 
} from "lucide-react";

interface FooterLinkItem {
  id: string;
  title: string;
  url: string;
}

export default function Footer({ initialData }: { initialData?: any }) {
  const pathname = usePathname();
  const initInfo = initialData?.schoolInfo || demoData.schoolInfo;
  const initFooter = initialData?.footerData || (demoData as any).footerData || {};

  // স্কুলের সাধারণ তথ্য
  const [logoUrl, setLogoUrl] = useState(initInfo?.logo ?? demoData.schoolInfo.logo);
  const [schoolName, setSchoolName] = useState(initInfo?.name ?? demoData.schoolInfo.name);
  const [schoolSlogan, setSchoolSlogan] = useState(initInfo?.slogan ?? "");
  const [schoolEiin, setSchoolEiin] = useState(initInfo?.eiin ?? "");
  const [schoolEstablished, setSchoolEstablished] = useState(initInfo?.established ?? "");
  const [contactAddress, setContactAddress] = useState(initInfo?.contact?.address ?? "");
  const [contactPhone, setContactPhone] = useState(initInfo?.contact?.phone ?? "");
  const [contactEmail, setContactEmail] = useState(initInfo?.contact?.email ?? "");
  const [baseCopyright, setBaseCopyright] = useState(initInfo?.copyright ?? "");

  // ফুটার কাস্টমাইজেবল তথ্য
  const [aboutText, setAboutText] = useState(initFooter?.aboutText ?? (initInfo?.slogan || (demoData as any).footerData?.aboutText || ""));
  const [recognitionBadge, setRecognitionBadge] = useState(initFooter?.recognitionBadge ?? (demoData as any).footerData?.recognitionBadge ?? "মডেল শিক্ষাপ্রতিষ্ঠান স্বীকৃতিপ্রাপ্ত");
  const [quickLinksTitle, setQuickLinksTitle] = useState(initFooter?.quickLinksTitle ?? "দ্রুত লিঙ্ক সমূহ");
  const [quickLinks, setQuickLinks] = useState<FooterLinkItem[]>(initFooter?.quickLinks ?? (demoData as any).footerData?.quickLinks ?? []);
  const [academicLinksTitle, setAcademicLinksTitle] = useState(initFooter?.academicLinksTitle ?? "একাডেমিক ও শিক্ষার্থী সেবা");
  const [academicLinks, setAcademicLinks] = useState<FooterLinkItem[]>(initFooter?.academicLinks ?? (demoData as any).footerData?.academicLinks ?? []);
  const [contactTitle, setContactTitle] = useState(initFooter?.contactTitle ?? "অফিস ও যোগাযোগ");
  const [officeHours, setOfficeHours] = useState(initFooter?.officeHours ?? "রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০");
  const [customAddress, setCustomAddress] = useState(initFooter?.customAddress ?? "");
  const [customPhone, setCustomPhone] = useState(initFooter?.customPhone ?? "");
  const [customEmail, setCustomEmail] = useState(initFooter?.customEmail ?? "");
  const [copyrightText, setCopyrightText] = useState(initFooter?.copyrightText ?? "");
  const [backToTopText, setBackToTopText] = useState(initFooter?.backToTopText ?? "উপরে যান");

  useEffect(() => {
    // যদি SSR থেকে footerData না এসে থাকে তবে ফেচ করা হবে
    if (!initialData?.footerData) {
      fetch("/api/footer")
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.footerData) {
            const fd = res.footerData;
            if (fd.aboutText !== undefined) setAboutText(fd.aboutText);
            if (fd.recognitionBadge !== undefined) setRecognitionBadge(fd.recognitionBadge);
            if (fd.quickLinksTitle !== undefined) setQuickLinksTitle(fd.quickLinksTitle);
            if (Array.isArray(fd.quickLinks)) setQuickLinks(fd.quickLinks);
            if (fd.academicLinksTitle !== undefined) setAcademicLinksTitle(fd.academicLinksTitle);
            if (Array.isArray(fd.academicLinks)) setAcademicLinks(fd.academicLinks);
            if (fd.contactTitle !== undefined) setContactTitle(fd.contactTitle);
            if (fd.officeHours !== undefined) setOfficeHours(fd.officeHours);
            if (fd.customAddress !== undefined) setCustomAddress(fd.customAddress);
            if (fd.customPhone !== undefined) setCustomPhone(fd.customPhone);
            if (fd.customEmail !== undefined) setCustomEmail(fd.customEmail);
            if (fd.copyrightText !== undefined) setCopyrightText(fd.copyrightText);
            if (fd.backToTopText !== undefined) setBackToTopText(fd.backToTopText);
          }
        })
        .catch(() => {});
    }

    if (!initialData?.schoolInfo) {
      fetch("/api/school-info")
        .then((res) => res.json())
        .then((data) => {
          if (data.schoolInfo?.logo) setLogoUrl(data.schoolInfo.logo);
          if (data.schoolInfo?.name) setSchoolName(data.schoolInfo.name);
          if (data.schoolInfo?.slogan) setSchoolSlogan(data.schoolInfo.slogan);
          if (data.schoolInfo?.eiin) setSchoolEiin(data.schoolInfo.eiin);
          if (data.schoolInfo?.established) setSchoolEstablished(data.schoolInfo.established);
          if (data.schoolInfo?.contact?.address) setContactAddress(data.schoolInfo.contact.address);
          if (data.schoolInfo?.contact?.phone) setContactPhone(data.schoolInfo.contact.phone);
          if (data.schoolInfo?.contact?.email) setContactEmail(data.schoolInfo.contact.email);
          if (data.schoolInfo?.copyright) setBaseCopyright(data.schoolInfo.copyright);
          if (data.footerData) {
            const fd = data.footerData;
            if (fd.aboutText !== undefined) setAboutText(fd.aboutText);
            if (fd.recognitionBadge !== undefined) setRecognitionBadge(fd.recognitionBadge);
            if (fd.quickLinksTitle !== undefined) setQuickLinksTitle(fd.quickLinksTitle);
            if (Array.isArray(fd.quickLinks)) setQuickLinks(fd.quickLinks);
            if (fd.academicLinksTitle !== undefined) setAcademicLinksTitle(fd.academicLinksTitle);
            if (Array.isArray(fd.academicLinks)) setAcademicLinks(fd.academicLinks);
            if (fd.contactTitle !== undefined) setContactTitle(fd.contactTitle);
            if (fd.officeHours !== undefined) setOfficeHours(fd.officeHours);
            if (fd.customAddress !== undefined) setCustomAddress(fd.customAddress);
            if (fd.customPhone !== undefined) setCustomPhone(fd.customPhone);
            if (fd.customEmail !== undefined) setCustomEmail(fd.customEmail);
            if (fd.copyrightText !== undefined) setCopyrightText(fd.copyrightText);
            if (fd.backToTopText !== undefined) setBackToTopText(fd.backToTopText);
          }
        })
        .catch(() => {});
    }

    // লাইভ ইভেন্ট লিসেনার (অ্যাডমিন সেভ করার সাথে সাথে পেজ রিলোড ছাড়াই তৎক্ষণাৎ আপডেট)
    const handleFooterSync = (e: any) => {
      const fd = e.detail;
      if (!fd) return;
      if (fd.aboutText !== undefined) setAboutText(fd.aboutText);
      if (fd.recognitionBadge !== undefined) setRecognitionBadge(fd.recognitionBadge);
      if (fd.quickLinksTitle !== undefined) setQuickLinksTitle(fd.quickLinksTitle);
      if (Array.isArray(fd.quickLinks)) setQuickLinks(fd.quickLinks);
      if (fd.academicLinksTitle !== undefined) setAcademicLinksTitle(fd.academicLinksTitle);
      if (Array.isArray(fd.academicLinks)) setAcademicLinks(fd.academicLinks);
      if (fd.contactTitle !== undefined) setContactTitle(fd.contactTitle);
      if (fd.officeHours !== undefined) setOfficeHours(fd.officeHours);
      if (fd.customAddress !== undefined) setCustomAddress(fd.customAddress);
      if (fd.customPhone !== undefined) setCustomPhone(fd.customPhone);
      if (fd.customEmail !== undefined) setCustomEmail(fd.customEmail);
      if (fd.copyrightText !== undefined) setCopyrightText(fd.copyrightText);
      if (fd.backToTopText !== undefined) setBackToTopText(fd.backToTopText);
    };

    const handleSchoolInfoSync = (e: any) => {
      if (e.detail?.logo) setLogoUrl(e.detail.logo);
      if (e.detail?.name) setSchoolName(e.detail.name);
      if (e.detail?.slogan) setSchoolSlogan(e.detail.slogan);
      if (e.detail?.eiin) setSchoolEiin(e.detail.eiin);
      if (e.detail?.established) setSchoolEstablished(e.detail.established);
      if (e.detail?.address) setContactAddress(e.detail.address);
      if (e.detail?.phone) setContactPhone(e.detail.phone);
      if (e.detail?.email) setContactEmail(e.detail.email);
      if (e.detail?.copyright) setBaseCopyright(e.detail.copyright);
      if (e.detail?.footerData) handleFooterSync({ detail: e.detail.footerData });
    };

    window.addEventListener("footer-updated", handleFooterSync);
    window.addEventListener("school-info-updated", handleSchoolInfoSync);
    return () => {
      window.removeEventListener("footer-updated", handleFooterSync);
      window.removeEventListener("school-info-updated", handleSchoolInfoSync);
    };
  }, [initialData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayAddress = customAddress || contactAddress;
  const displayPhone = customPhone || contactPhone;
  const displayEmail = customEmail || contactEmail;
  const displayCopyright = copyrightText || baseCopyright || `© ${new Date().getFullYear()} ${schoolName}। সর্বস্বত্ব সংরক্ষিত।`;
  const displayAbout = aboutText || schoolSlogan || "আধুনিক শিক্ষা, প্রযুক্তি এবং নৈতিক মূল্যবোধের সমন্বয়ে আদর্শ ভবিষ্যৎ নাগরিক গড়ার প্রত্যয়ে আমাদের অগ্রযাত্রা অব্যাহত।";
  
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      {/* প্রধান ৪-কলাম ফুটার গ্রিড */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* কলাম ১: বিদ্যালয় পরিচিতি ও আইডেন্টিটি */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl || "https://placehold.co/150x150/2563eb/ffffff?text=School+Logo"} 
                alt={schoolName} 
                className="h-12 w-12 rounded-xl object-contain bg-white p-1 ring-2 ring-blue-500/30" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/150x150/2563eb/ffffff?text=School+Logo";
                }}
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{schoolName}</h3>
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>EIIN: {schoolEiin} • স্থাপিত: {schoolEstablished}</span>
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {displayAbout}
            </p>
            {recognitionBadge && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>{recognitionBadge}</span>
                </span>
              </div>
            )}
          </div>

          {/* কলাম ২: দ্রুত লিঙ্ক সমূহ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              {quickLinksTitle || "দ্রুত লিঙ্ক সমূহ"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((item, idx) => (
                <li key={item.id || idx}>
                  <Link href={item.url || "#"} className="hover:text-blue-400 transition flex items-center gap-1.5 group">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* কলাম ৩: একাডেমিক ও শিক্ষার্থী সেবা */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              {academicLinksTitle || "একাডেমিক ও শিক্ষার্থী সেবা"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {academicLinks.map((item, idx) => (
                <li key={item.id || idx}>
                  <Link href={item.url || "#"} className="hover:text-emerald-400 transition flex items-center gap-1.5 group">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* কলাম ৪: অফিস ও সরাসরি যোগাযোগ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              {contactTitle || "অফিস ও যোগাযোগ"}
            </h4>
            <div className="space-y-3 text-xs">
              {displayAddress && (
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{displayAddress}</span>
                </div>
              )}
              {displayPhone && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${displayPhone}`} className="hover:text-white transition">
                    {displayPhone}
                  </a>
                </div>
              )}
              {displayEmail && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${displayEmail}`} className="hover:text-white transition">
                    {displayEmail}
                  </a>
                </div>
              )}
              {officeHours && (
                <div className="flex items-start gap-2 text-slate-400 pt-1 border-t border-slate-900">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{officeHours}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* বটম কপিরাইট বার */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p suppressHydrationWarning className="text-center sm:text-left">
            {displayCopyright}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <span>{backToTopText || "উপরে যান"}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
