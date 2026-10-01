"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import demoData from "@/data/demoData.json";
import { 
  Phone, 
  Mail, 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown, 
  MapPin
} from "lucide-react";

const translateMenu = (name: string, currentLang: string) => {
  if (currentLang !== "en" || !name) return name;
  const dict: Record<string, string> = {
    "হোম": "Home",
    "আমাদের সম্পর্কে": "About Us",
    "বাণী": "Messages",
    "নোটিশ": "Notices",
    "ব্লগ": "Blog",
    "শিক্ষকবৃন্দ": "Faculty",
    "চিত্রশালা": "Gallery",
    "কর্মচারীবৃন্দ": "Staff",
    "পরিচালনা পর্ষদ": "Committee",
    "যোগাযোগ": "Contact",
    "একাডেমিক": "Academics",
    "ভর্তি তথ্য": "Admissions",
    "ফি ও পেমেন্ট": "Fees & Payment",
    "অ্যালামনাই": "Alumni",
    "তথ্য ডিরেক্টরি": "Directory",
    "প্রতিষ্ঠান পরিচিতি": "About School",
    "ভর্তি আবেদন": "Apply Now",
    "সর্বশেষ নোটিশ": "Latest Notices",
    "বিদ্যালয় তথ্য": "School Info"
  };
  return dict[name.trim()] || name;
};

export default function Navbar({ initialData }: { initialData?: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const pathname = usePathname();

  const initInfo = initialData?.schoolInfo || demoData.schoolInfo;
  const initAdmission = initialData?.admission || demoData.admission;
  const initLinks = initialData?.navbarLinks || demoData.navbarLinks;

  const [logoUrl, setLogoUrl] = useState(initInfo?.logo ?? demoData.schoolInfo.logo);
  const [schoolName, setSchoolName] = useState(initInfo?.name ?? demoData.schoolInfo.name);
  const [schoolSlogan, setSchoolSlogan] = useState(initInfo?.slogan ?? "");
  const [schoolEiin, setSchoolEiin] = useState(initInfo?.eiin ?? "");
  const [contactPhone, setContactPhone] = useState(initInfo?.contact?.phone ?? "");
  const [contactEmail, setContactEmail] = useState(initInfo?.contact?.email ?? "");
  const [contactAddress, setContactAddress] = useState(initInfo?.contact?.address ?? "");
  const [menuLinks, setMenuLinks] = useState<any[]>(initLinks || []);
  const [admissionState, setAdmissionState] = useState<any>(initAdmission || {
    isOpen: true,
    showNavbarButton: true,
    buttonText: "ভর্তি চলছে ২০২৬",
    applyButtonText: "অনলাইনে আবেদন করুন",
    externalLink: ""
  });

  useEffect(() => {
    let savedLang = localStorage.getItem("site_lang") || "bn";
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
      if (match && match[1] === "/bn/en") {
        savedLang = "en";
      } else if (match && match[1] === "/bn/bn") {
        savedLang = "bn";
      }
    }
    setLang(savedLang as "bn" | "en");

    // Listen to custom storage or event changes
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem("site_lang") || "bn";
      setLang(currentLang as "bn" | "en");
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("language-changed", handleStorageChange);

    // initialData না থাকলেই কেবল এপিআই ফেচ হবে (পারফরম্যান্স বৃদ্ধি)
    if (!initialData?.schoolInfo) {
      fetch("/api/school-info")
        .then((res) => res.json())
        .then((data) => {
          if (data.schoolInfo?.logo) setLogoUrl(data.schoolInfo.logo);
          if (data.schoolInfo?.name) setSchoolName(data.schoolInfo.name);
          if (data.schoolInfo?.slogan) setSchoolSlogan(data.schoolInfo.slogan);
          if (data.schoolInfo?.eiin) setSchoolEiin(data.schoolInfo.eiin);
          if (data.schoolInfo?.contact?.phone) setContactPhone(data.schoolInfo.contact.phone);
          if (data.schoolInfo?.contact?.email) setContactEmail(data.schoolInfo.contact.email);
          if (data.schoolInfo?.contact?.address) setContactAddress(data.schoolInfo.contact.address);
          if (data.admission) setAdmissionState(data.admission);
          if (data.navbarLinks && Array.isArray(data.navbarLinks)) setMenuLinks(data.navbarLinks);
        })
        .catch(() => {});
    }

    const handleSync = (e: any) => {
      if (e.detail?.logo) setLogoUrl(e.detail.logo);
      if (e.detail?.name) setSchoolName(e.detail.name);
      if (e.detail?.slogan) setSchoolSlogan(e.detail.slogan);
      if (e.detail?.eiin) setSchoolEiin(e.detail.eiin);
      if (e.detail?.phone) setContactPhone(e.detail.phone);
      if (e.detail?.email) setContactEmail(e.detail.email);
      if (e.detail?.address) setContactAddress(e.detail.address);
      if (e.detail?.admission) setAdmissionState(e.detail.admission);
      if (e.detail?.navbarLinks) setMenuLinks(e.detail.navbarLinks);
    };

    window.addEventListener("school-info-updated", handleSync);
    return () => {
      window.removeEventListener("school-info-updated", handleSync);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("language-changed", handleStorageChange);
    };
  }, []);

  const toggleLang = () => {
    const newLang = lang === "bn" ? "en" : "bn";
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("site_lang", newLang);
      
      if (typeof (window as any).__changeGoogleTranslateLanguage === "function") {
        (window as any).__changeGoogleTranslateLanguage(newLang);
      } else {
        window.dispatchEvent(new CustomEvent("trigger-language-switch", { detail: newLang }));
      }

      window.dispatchEvent(new CustomEvent("language-changed", { detail: newLang }));
    }
  };

  const links = menuLinks || [];
  const mainLinks = links.filter((link: any) => link.parentId === null && link.active);

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      {/* ১. শীর্ষ প্রাতিষ্ঠানিক তথ্য ও হটলাইন বার (Top Bar) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          {/* যোগাযোগ ও পরিচয় */}
          <div className="flex items-center flex-wrap gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              <span className="font-semibold text-amber-500">EIIN:</span> {schoolEiin || "108420"}
            </span>
            {contactPhone && (
              <a 
                href={`tel:${contactPhone}`} 
                className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{contactPhone}</span>
              </a>
            )}
            {contactEmail && (
              <a 
                href={`mailto:${contactEmail}`} 
                className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{contactEmail}</span>
              </a>
            )}
            {contactAddress && (
              <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{contactAddress}</span>
              </span>
            )}
          </div>

          {/* ভর্তি তথ্য অ্যাক্সেস লিংক ও ভাষা পরিবর্তন টগল */}
          <div className="flex items-center gap-3 font-medium ml-auto">
            {admissionState?.isOpen && admissionState?.showNavbarButton && (
              admissionState?.externalLink ? (
                <a 
                  href={admissionState.externalLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40 text-xs shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>{admissionState.buttonText || "ভর্তি চলছে ২০২৬"}</span>
                </a>
              ) : (
                <Link 
                  href="/admission-info" 
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40 text-xs shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span suppressHydrationWarning>{admissionState.buttonText || "ভর্তি চলছে ২০২৬"}</span>
                </Link>
              )
            )}

            {/* ভাষা পরিবর্তন টগল বাটন (EIIN স্টাইলে ডিজাইন করা) */}
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 text-xs font-semibold hover:bg-amber-900/60 transition cursor-pointer shadow-xs"
              title="Switch Language / ভাষা পরিবর্তন করুন"
            >
              <span>🌐</span>
              <span>{lang === "bn" ? "English" : "বাংলা"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ২. প্রধান ন্যাভিগেশন বার (Main Navigation) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
        {/* লোগো ও স্কুলের নাম */}
        <Link href="/" className="flex items-center gap-3.5 group min-w-0 py-1">
          <div className="relative shrink-0">
            <img 
              src={logoUrl || "https://placehold.co/150x150/2563eb/ffffff?text=School+Logo"} 
              alt={schoolName} 
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-contain bg-white p-1 ring-2 ring-slate-200 group-hover:ring-blue-600 transition duration-300 shadow-xs" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/150x150/2563eb/ffffff?text=School+Logo";
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-1">
              {schoolName}
            </h1>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-normal line-clamp-1">
              <span>{schoolSlogan || "জ্ঞানের আলোয় উদ্ভাসিত একটি আধুনিক বিদ্যাপীঠ"}</span>
            </p>
          </div>
        </Link>

        {/* ডেস্কটপ মেনু */}
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-1">
            {mainLinks.map((link: any) => {
              const subLinks = links.filter((sub: any) => sub.parentId === link.id && sub.active);
              const hasSub = subLinks.length > 0;
              const isActive = pathname === link.url;

              if (hasSub) {
                return (
                  <div key={link.id} className="relative group py-2">
                    <button 
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <span>{translateMenu(link.name, lang)}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:rotate-180 transition duration-200" />
                    </button>
                    
                    {/* সাব-মেনু পপওভার */}
                    <div className="absolute left-0 top-full pt-1 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1.5">
                        {subLinks.map((sub: any) => (
                          <Link 
                            key={sub.id} 
                            href={sub.url} 
                            className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                          >
                            {translateMenu(sub.name, lang)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.id} 
                  href={link.url} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive 
                      ? "text-blue-700 bg-blue-50 font-bold" 
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {translateMenu(link.name, lang)}
                </Link>
              );
            })}
          </nav>

          {/* ভর্তি বাটন (CTA) */}
          {admissionState?.showNavbarButton && (
            <Link 
              href="/admission-info" 
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs md:text-sm transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span suppressHydrationWarning>ভর্তি আবেদন</span>
            </Link>
          )}

          {/* মোবাইল মেনু টগল বাটন */}
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-800" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* ৩. মোবাইল রেসপনসিভ মেনু ড্রয়ার (Mobile Navigation Drawer) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {mainLinks.map((link: any) => {
              const subLinks = links.filter((sub: any) => sub.parentId === link.id && sub.active);
              const hasSub = subLinks.length > 0;
              const isDropdownOpen = openDropdown === link.id;

              if (hasSub) {
                return (
                  <div key={link.id} className="border-b border-slate-100 last:border-b-0 py-1">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(link.id)}
                      className="w-full flex justify-between items-center py-2.5 px-3 text-left font-semibold text-slate-800 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition text-sm"
                    >
                      <span>{translateMenu(link.name, lang)}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    {isDropdownOpen && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                        {subLinks.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={sub.url}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2 px-3 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-white rounded transition"
                          >
                            {translateMenu(sub.name, lang)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.id}
                  href={link.url}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 px-3 font-semibold text-slate-800 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition text-sm border-b border-slate-100 last:border-b-0"
                >
                  {translateMenu(link.name, lang)}
                </Link>
              );
            })}

            {/* মোবাইল ড্রয়ার অ্যাকশন */}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
              {/* মোবাইল ভাষা পরিবর্তন টগল */}
              <button
                type="button"
                onClick={() => {
                  toggleLang();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition text-sm shadow-sm"
              >
                <span>🌐</span>
                <span>{lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}</span>
              </button>
              {admissionState.isOpen ? (
                admissionState.externalLink ? (
                  <a
                    href={admissionState.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{admissionState.applyButtonText || "অনলাইনে ভর্তি আবেদন"}</span>
                  </a>
                ) : (
                  <Link
                    href="/admission-info"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>ভর্তি সংক্রান্ত যাবতীয় তথ্য</span>
                  </Link>
                )
              ) : null}

              {contactPhone && (
                <div className="pt-2">
                  <a
                    href={`tel:${contactPhone}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কল করুন ({contactPhone})</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
