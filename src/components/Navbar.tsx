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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const pathname = usePathname();

  const { schoolInfo, admission, navbarLinks } = demoData;
  const [logoUrl, setLogoUrl] = useState(schoolInfo.logo);
  const [schoolName, setSchoolName] = useState(schoolInfo.name);
  const [admissionState, setAdmissionState] = useState<any>(admission || {
    isOpen: true,
    showNavbarButton: true,
    buttonText: "ভর্তি চলছে ২০২৬",
    applyButtonText: "অনলাইনে আবেদন করুন",
    externalLink: ""
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("site_lang") || "bn";
    setLang(savedLang as "bn" | "en");

    // Listen to custom storage or event changes
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem("site_lang") || "bn";
      setLang(currentLang as "bn" | "en");
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("language-changed", handleStorageChange);

    fetch("/api/school-info", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.schoolInfo?.logo) setLogoUrl(data.schoolInfo.logo);
        if (data.schoolInfo?.name) setSchoolName(data.schoolInfo.name);
        if (data.admission) setAdmissionState(data.admission);
      })
      .catch(() => {});

    const handleSync = (e: any) => {
      if (e.detail?.logo) setLogoUrl(e.detail.logo);
      if (e.detail?.name) setSchoolName(e.detail.name);
      if (e.detail?.admission) setAdmissionState(e.detail.admission);
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
    localStorage.setItem("site_lang", newLang);
    window.dispatchEvent(new CustomEvent("language-changed", { detail: newLang }));
    // Force reload or re-render state across components
    window.location.reload();
  };

  const links = navbarLinks || [];
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
              <span className="font-semibold">EIIN:</span> 108420
            </span>
            {schoolInfo.contact?.phone && (
              <a 
                href={`tel:${schoolInfo.contact.phone}`} 
                className="hidden sm:inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{schoolInfo.contact.phone}</span>
              </a>
            )}
            {schoolInfo.contact?.email && (
              <a 
                href={`mailto:${schoolInfo.contact.email}`} 
                className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{schoolInfo.contact.email}</span>
              </a>
            )}
            {schoolInfo.contact?.address && (
              <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{schoolInfo.contact.address}</span>
              </span>
            )}
          </div>

          {/* ভর্তি তথ্য অ্যাক্সেস লিংক ও ভাষা পরিবর্তন টগল */}
          <div className="flex items-center gap-3 font-medium ml-auto">
            {admissionState.isOpen && admissionState.showNavbarButton && (
              admissionState.externalLink ? (
                <a 
                  href={admissionState.externalLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40 text-xs shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{admissionState.buttonText || "ভর্তি চলছে ২০২৬"}</span>
                </a>
              ) : (
                <Link 
                  href="/admission-info" 
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40 text-xs shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{admissionState.buttonText || "ভর্তি চলছে ২০২৬"}</span>
                </Link>
              )
            )}

            {/* ভাষা পরিবর্তন টগল বাটন */}
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition cursor-pointer text-xs shadow-xs"
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
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <img 
              src={logoUrl} 
              alt={schoolName} 
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-200 group-hover:ring-blue-600 transition duration-300 shadow-xs" 
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-700 transition">
              {schoolName}
            </h1>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide flex items-center gap-1.5">
              <span>সরকারি স্বীকৃতিপ্রাপ্ত মডেল শিক্ষা প্রতিষ্ঠান</span>
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
                      <span>{link.name}</span>
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
                            {sub.name}
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
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ভর্তি বাটন (CTA) */}
          {admission?.showNavbarButton && (
            <Link 
              href="/admission-info" 
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs md:text-sm transition duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ভর্তি আবেদন</span>
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
                      <span>{link.name}</span>
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
                            {sub.name}
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
                  {link.name}
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

              {schoolInfo.contact?.phone && (
                <div className="pt-2">
                  <a
                    href={`tel:${schoolInfo.contact.phone}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কল করুন ({schoolInfo.contact.phone})</span>
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
