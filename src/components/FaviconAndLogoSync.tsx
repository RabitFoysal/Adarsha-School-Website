"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function FaviconAndLogoSync() {
  const pathname = usePathname();

  const updateFaviconInDocument = useCallback((logoUrl: string) => {
    if (!logoUrl || typeof document === "undefined") return;

    // ১. বিদ্যমান বা নতুন আইকন লিঙ্ক ট্যাগ খুঁজে নেওয়া বা তৈরি করা
    let linkIcon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!linkIcon) {
      linkIcon = document.createElement("link");
      linkIcon.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(linkIcon);
    }
    linkIcon.href = logoUrl;

    // ২. শর্টকাট আইকন
    let linkShortcut = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement | null;
    if (!linkShortcut) {
      linkShortcut = document.createElement("link");
      linkShortcut.rel = "shortcut icon";
      document.getElementsByTagName("head")[0].appendChild(linkShortcut);
    }
    linkShortcut.href = logoUrl;

    // ৩. অ্যাপল টাচ আইকন
    let linkApple = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
    if (!linkApple) {
      linkApple = document.createElement("link");
      linkApple.rel = "apple-touch-icon";
      document.getElementsByTagName("head")[0].appendChild(linkApple);
    }
    linkApple.href = logoUrl;
  }, []);

  const syncLogo = useCallback(async () => {
    try {
      const res = await fetch("/api/school-info", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.schoolInfo?.logo) {
          updateFaviconInDocument(data.schoolInfo.logo);
        }
        if (data.customColors) {
          applyCustomColors(data.customColors);
        }
        // অন্য সব কম্পোনেন্টে লাইভ সিঙ্ক করানোর জন্য ইভেন্ট পাঠানো
        window.dispatchEvent(
          new CustomEvent("school-info-updated", {
            detail: {
              logo: data.schoolInfo?.logo,
              name: data.schoolInfo?.name,
              customColors: data.customColors
            },
          })
        );
      }
    } catch {
      // সাইলেন্ট ফেইলওভার
    }
  }, [updateFaviconInDocument]);

  const applyCustomColors = (colors: any) => {
    if (!colors || typeof document === "undefined") return;
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty("--custom-primary", colors.primary);
    if (colors.secondary) root.style.setProperty("--custom-secondary", colors.secondary);
    if (colors.navbarBg) root.style.setProperty("--custom-navbar-bg", colors.navbarBg);
    if (colors.footerBg) root.style.setProperty("--custom-footer-bg", colors.footerBg);
    if (colors.buttonGradient1) root.style.setProperty("--custom-grad-1", colors.buttonGradient1);
    if (colors.buttonGradient2) root.style.setProperty("--custom-grad-2", colors.buttonGradient2);
  };

  useEffect(() => {
    syncLogo();

    // কাস্টম ইভেন্ট লিসেনার (অ্যাডমিন প্যানেল থেকে আপডেট হলে)
    const handleInfoUpdated = (e: any) => {
      if (e.detail?.logo) {
        updateFaviconInDocument(e.detail.logo);
      }
      if (e.detail?.customColors) {
        applyCustomColors(e.detail.customColors);
      }
    };

    window.addEventListener("school-info-updated", handleInfoUpdated);
    return () => {
      window.removeEventListener("school-info-updated", handleInfoUpdated);
    };
  }, [syncLogo, updateFaviconInDocument]);

  // প্রতিবার রুট পরিবর্তন হলেও রি-সিঙ্ক নিশ্চিত রাখা
  useEffect(() => {
    syncLogo();
  }, [pathname, syncLogo]);

  return null;
}
