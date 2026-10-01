"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    __changeGoogleTranslateLanguage: (lang: "bn" | "en") => void;
  }
}

export default function GoogleTranslator() {
  const initializedRef = useRef(false);

  useEffect(() => {
    // ১. কুকি হেল্পার ফাংশন
    const setTranslateCookie = (targetLang: "bn" | "en") => {
      const pathSuffix = "; path=/; SameSite=Lax";
      
      if (targetLang === "en") {
        document.cookie = `googtrans=/bn/en${pathSuffix}`;
        document.cookie = `googtrans=/auto/en${pathSuffix}`;
      } else {
        document.cookie = `googtrans=/bn/bn${pathSuffix}`;
        document.cookie = `googtrans=/auto/bn${pathSuffix}`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    };

    // ২. গুগল ট্রান্সলেট সিলেক্টর ট্রিগার
    const triggerGoogleCombo = (targetLang: "bn" | "en"): boolean => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        if (select.value !== targetLang) {
          select.value = targetLang;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          try {
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", true, true);
            select.dispatchEvent(evt);
          } catch {}
        }
        return true;
      }
      return false;
    };

    // ৩. গ্লোবাল ল্যাঙ্গুয়েজ চেঞ্জ ফাংশন
    window.__changeGoogleTranslateLanguage = (targetLang: "bn" | "en") => {
      localStorage.setItem("site_lang", targetLang);
      setTranslateCookie(targetLang);

      // তাত্ক্ষণিকভাবে লোকাল ইভেন্ট ফায়ার যাতে UI দ্রুত ইংরেজি হয়
      window.dispatchEvent(new CustomEvent("language-changed", { detail: targetLang }));

      // গুগল ট্রান্সলেট সিলেক্টর ট্রিগার
      const success = triggerGoogleCombo(targetLang);
      if (!success) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (triggerGoogleCombo(targetLang) || attempts >= 30) {
            clearInterval(interval);
          }
        }, 100);
      }
    };

    // ৪. ইভেন্ট লিসেনার
    const handleSwitchEvent = (e: any) => {
      if (e.detail && (e.detail === "bn" || e.detail === "en")) {
        window.__changeGoogleTranslateLanguage(e.detail);
      }
    };
    window.addEventListener("trigger-language-switch", handleSwitchEvent);

    // ৫. গুগল ট্রান্সলেট ইনিশিয়ালাইজেশন
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate && !initializedRef.current) {
          initializedRef.current = true;
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "bn",
              includedLanguages: "bn,en,ar,ur,hi",
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // ইনিট হওয়ার পর যদি পূর্বে 'en' সংরক্ষিত থাকে তবে অটো-ট্রিগার
          setTimeout(() => {
            const savedLang = localStorage.getItem("site_lang") || "bn";
            if (savedLang === "en") {
              triggerGoogleCombo("en");
            }
          }, 350);
        }
      } catch (err) {
        console.error("Google Translate Init Error:", err);
      }
    };

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // ৬. গুগল ট্রান্সলেট ব্যানার ও টপ বার জোরপূর্বক লুকানো (Active Banner Suppression)
    const cleanupGoogleBanner = () => {
      if (typeof document === "undefined") return;

      if (document.body && document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.setProperty("top", "0px", "important");
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== "0px") {
        document.documentElement.style.setProperty("top", "0px", "important");
      }

      const banners = document.querySelectorAll(
        ".goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-ORHb, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-xl07Ob-OEVmcd, iframe.skiptranslate, #goog-gt-tt"
      );
      banners.forEach((el) => {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
        (el as HTMLElement).style.setProperty("height", "0px", "important");
        (el as HTMLElement).style.setProperty("max-height", "0px", "important");
        (el as HTMLElement).style.setProperty("opacity", "0", "important");
        (el as HTMLElement).style.setProperty("pointer-events", "none", "important");
      });
    };

    cleanupGoogleBanner();
    const bannerInterval = setInterval(cleanupGoogleBanner, 200);

    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver(() => {
        cleanupGoogleBanner();
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ["style", "class"], childList: true });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    } catch {}

    return () => {
      clearInterval(bannerInterval);
      if (observer) observer.disconnect();
      window.removeEventListener("trigger-language-switch", handleSwitchEvent);
    };
  }, []);

  return (
    <>
      {/* ইনলাইন স্টাইল ব্লকার যাতে গুগল ব্যানার কখনওই দৃশ্যমান না হয় */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame,
            .goog-te-banner-frame.skiptranslate,
            iframe.goog-te-banner-frame,
            .VIpgJd-ZVi9od-ORHb-OEVmcd,
            .VIpgJd-ZVi9od-ORHb,
            .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
            .VIpgJd-ZVi9od-xl07Ob-OEVmcd,
            .VIpgJd-ZVi9od-SmfZ-OEVmcd,
            iframe.skiptranslate,
            #goog-gt-tt,
            .goog-te-balloon-frame,
            .goog-tooltip,
            .goog-tooltip:hover {
              display: none !important;
              visibility: hidden !important;
              height: 0px !important;
              max-height: 0px !important;
              width: 0px !important;
              margin: 0 !important;
              padding: 0 !important;
              opacity: 0 !important;
              pointer-events: none !important;
              clip: rect(0 0 0 0) !important;
            }
            html, body {
              top: 0px !important;
              position: static !important;
            }
          `,
        }}
      />

      {/* ইনলাইন ইনিশিয়ালাইজার ফাংশন */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== "undefined") {
              window.googleTranslateElementInit = function() {
                try {
                  if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                      {
                        pageLanguage: "bn",
                        includedLanguages: "bn,en,ar,ur,hi",
                        autoDisplay: false
                      },
                      "google_translate_element"
                    );
                    var saved = localStorage.getItem("site_lang");
                    if (saved === "en") {
                      setTimeout(function() {
                        var combo = document.querySelector(".goog-te-combo");
                        if (combo) {
                          combo.value = "en";
                          combo.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                      }, 400);
                    }
                  }
                } catch(e) {}
              };
            }
          `,
        }}
      />

      {/* গুগল ট্রান্সলেট এর কন্টেইনার (হাইড্রেটেড ও স্ট্যাবল) */}
      <div 
        id="google_translate_element" 
        className="google-translate-active-container"
        aria-hidden="true"
      />

      {/* অফিশিয়াল গুগল ট্রান্সলেট স্ক্রিপ্ট */}
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
