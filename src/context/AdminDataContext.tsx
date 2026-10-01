"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type AdminData = {
  schoolInfo: any;
  teachers: any[];
  staff: any[];
  committee: any[];
  dignitaries?: any[];
  notices: any[];
  news: any[];
  messages: any[];
  blogs: any[];
  directory: any[];
  menuLinks: any[];
  customPages: any[];
  layoutSettings: any;
  layoutConfig: any[];
  gallery: any[];
  admission: any;
  importantLinks?: any[];
  academicRoutines?: any[];
  feeStructure?: any[];
  paymentMethods?: any;
  alumni?: any[];
  alumniRegistrations?: any[];
  quickAccess?: any[];
  hotlines?: any[];
  footerData?: any;
  navbarLinks?: any[];
  seoSettings?: any;
  heroBanner?: any;
  aboutInfo?: any;
  sidebarImage?: string;
  [key: string]: any;
};

interface AdminContextType {
  data: AdminData;
  isLoaded: boolean;
  refreshData: () => Promise<void>;
  updateSection: (section: keyof AdminData, newData: any) => void;
}

const defaultAdminData: AdminData = {
  schoolInfo: {},
  teachers: [],
  staff: [],
  committee: [],
  dignitaries: [],
  notices: [],
  news: [],
  messages: [],
  blogs: [],
  directory: [],
  menuLinks: [],
  customPages: [],
  layoutSettings: {},
  layoutConfig: [],
  gallery: [],
  admission: {},
  importantLinks: [],
  academicRoutines: [],
  feeStructure: [],
  paymentMethods: {},
  alumni: [],
  alumniRegistrations: [],
  quickAccess: [],
  hotlines: [],
  footerData: {},
  navbarLinks: [],
  seoSettings: {},
  heroBanner: {},
  aboutInfo: {},
  sidebarImage: "",
};

const AdminDataContext = createContext<AdminContextType>({
  data: defaultAdminData,
  isLoaded: false,
  refreshData: async () => {},
  updateSection: () => {},
});

const STORAGE_KEY = "school_admin_cache_v2";

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>(defaultAdminData);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/all-data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsLoaded(true);
          try {
            const serialized = JSON.stringify(json.data);
            sessionStorage.setItem(STORAGE_KEY, serialized);
            localStorage.setItem(STORAGE_KEY, serialized);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  }, []);

  // ১. প্রাথমিক ইনস্ট্যান্ট ক্যাশ রিড (০ মিলিসেকেন্ডে লোড)
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setIsLoaded(true);
      }
    } catch {}

    // ব্যাকগ্রাউন্ডে সার্ভার থেকে একদম ফ্রেশ ডেটা আনা
    fetchAllData();

    // মাল্টি-ট্যাব সিঙ্ক (এক ট্যাবে এডিট করলে অন্য ট্যাবেও যেন সাথে সাথে আপডেট হয়)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchAllData]);

  // কোনো পেজ সেভ করার সাথে সাথে ক্যাশ ও স্টেট আপডেট
  const updateSection = useCallback((section: keyof AdminData, newData: any) => {
    setData((prev) => {
      const updated = { ...prev, [section]: newData };
      try {
        const serialized = JSON.stringify(updated);
        sessionStorage.setItem(STORAGE_KEY, serialized);
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AdminDataContext.Provider value={{ data, isLoaded, refreshData: fetchAllData, updateSection }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  return useContext(AdminDataContext);
}
