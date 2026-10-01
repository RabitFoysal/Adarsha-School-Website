import fs from "fs";
import path from "path";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import demoFallbackData from "@/data/demoData.json";
import adminFallbackData from "@/data/adminData.json";

const dataFilePath = path.join(process.cwd(), "src/data/demoData.json");
const adminFilePath = path.join(process.cwd(), "src/data/adminData.json");

// 1. Check if Vercel Postgres is configured
export function isVercelPostgresConfigured(): boolean {
  if (!process.env.POSTGRES_URL && process.env.STORAGE_URL) {
    process.env.POSTGRES_URL = process.env.STORAGE_URL;
  }
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.STORAGE_URL);
}

// 2. Check if Firebase environment variables are provided
export function isFirebaseConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  return Boolean(apiKey && projectId);
}

// Lazy Firestore instance getter
let firestoreDb: any = null;
function getFirebaseDb() {
  if (firestoreDb) return firestoreDb;
  if (!isFirebaseConfigured()) return null;

  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
    };

    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);
    return firestoreDb;
  } catch (err) {
    console.error("Firebase init failed:", err);
    return null;
  }
}

// Initialize Vercel Postgres table if needed
let postgresTableReady = false;
export async function ensurePostgresTable() {
  if (postgresTableReady) return;
  try {
    const { sql } = await import("@vercel/postgres");
    await sql`CREATE TABLE IF NOT EXISTS school_cms (id VARCHAR(50) PRIMARY KEY, data JSONB);`;
    postgresTableReady = true;
  } catch (err) {
    console.error("Vercel Postgres table init error:", err);
  }
}

export async function ensurePostgresFilesTable() {
  try {
    const { sql } = await import("@vercel/postgres");
    await sql`CREATE TABLE IF NOT EXISTS school_files (
      id VARCHAR(100) PRIMARY KEY,
      filename VARCHAR(255),
      mime_type VARCHAR(100),
      data_base64 TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
  } catch (err) {
    console.error("Vercel Postgres files table init error:", err);
  }
}

/**
 * Automatically extracts large Base64 images from JSON data and stores them in `school_files`
 * replacing the field value with `/api/files/{id}`. This keeps JSON payloads tiny (< 50KB)
 * and eliminates Vercel's FALLBACK_BODY_TOO_LARGE error.
 */
export async function sanitizeAndExtractBase64(data: any): Promise<{ cleaned: any; wasMigrated: boolean }> {
  if (!data || typeof data !== "object") return { cleaned: data, wasMigrated: false };

  let wasMigrated = false;
  const isPg = isVercelPostgresConfigured();

  const traverse = async (val: any): Promise<any> => {
    if (typeof val === "string" && val.startsWith("data:image/") && val.length > 2048) {
      wasMigrated = true;
      const match = val.match(/^data:(image\/[a-zA-Z0-9.+]+);base64,(.+)$/);
      if (match && isPg) {
        try {
          await ensurePostgresFilesTable();
          const mimeType = match[1];
          const base64Data = match[2];
          const fileId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
          const { sql } = await import("@vercel/postgres");
          await sql`INSERT INTO school_files (id, filename, mime_type, data_base64)
            VALUES (${fileId}, 'migrated-image', ${mimeType}, ${base64Data})
            ON CONFLICT (id) DO NOTHING;`;
          return `/api/files/${fileId}`;
        } catch (e) {
          console.error("Base64 migration error:", e);
        }
      }
      return val;
    }
    if (Array.isArray(val)) {
      return Promise.all(val.map(traverse));
    }
    if (val && typeof val === "object") {
      const res: any = {};
      for (const [k, v] of Object.entries(val)) {
        res[k] = await traverse(v);
      }
      return res;
    }
    return val;
  };

  const cleaned = await traverse(data);
  return { cleaned, wasMigrated };
}

// Helper: Run promise with timeout
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallbackValue), timeoutMs);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

// High-speed In-Memory Cache with TTL and Request Deduplication
let memoryCache: any = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 30000; // 30 seconds high-speed memory cache
let inFlightPromise: Promise<any> | null = null;

/**
 * Deep merge helper that ensures live customized data completely replaces demo data.
 * For arrays (teachers, notices, news, etc.): LIVE DATA IS 100% AUTHORITATIVE.
 * If live data has an empty array or custom array, it NEVER merges or injects demo items.
 */
function applyAuthoritativeData(liveData: any): any {
  if (!liveData || typeof liveData !== "object") {
    return demoFallbackData;
  }

  // Base fallback structure for any missing top-level keys
  const merged: any = { ...demoFallbackData, ...liveData };

  // 1. Arrays must be strictly authoritative from liveData if present
  const arrayKeys = [
    "teachers",
    "staff",
    "committee",
    "notices",
    "news",
    "messages",
    "gallery",
    "blogs",
    "directory",
    "importantLinks",
    "customPages",
    "navbarLinks",
    "layoutConfig",
    "academicRoutines",
    "feeStructure",
    "alumni",
    "alumniRegistrations",
    "dignitaries",
    "quickAccess",
    "hotlines"
  ];

  for (const key of arrayKeys) {
    if (Array.isArray(liveData[key])) {
      merged[key] = liveData[key];
    }
  }

  // 2. Objects: preserve saved sub-properties without forcing demo text
  if (liveData.schoolInfo && typeof liveData.schoolInfo === "object") {
    merged.schoolInfo = {
      ...demoFallbackData.schoolInfo,
      ...liveData.schoolInfo,
      contact: {
        ...demoFallbackData.schoolInfo?.contact,
        ...(liveData.schoolInfo.contact || {})
      }
    };
  }

  if (liveData.heroBanner && typeof liveData.heroBanner === "object") {
    merged.heroBanner = {
      ...demoFallbackData.heroBanner,
      ...liveData.heroBanner
    };
  }

  if (liveData.admission && typeof liveData.admission === "object") {
    merged.admission = {
      ...demoFallbackData.admission,
      ...liveData.admission
    };
  }

  if (liveData.paymentMethods && typeof liveData.paymentMethods === "object") {
    merged.paymentMethods = {
      ...demoFallbackData.paymentMethods,
      ...liveData.paymentMethods
    };
  }

  if (liveData.stats && typeof liveData.stats === "object") {
    merged.stats = {
      ...demoFallbackData.stats,
      ...liveData.stats
    };
  }

  if (liveData.footerData && typeof liveData.footerData === "object") {
    merged.footerData = {
      ...((demoFallbackData as any).footerData || {}),
      ...liveData.footerData,
      quickLinks: Array.isArray(liveData.footerData.quickLinks)
        ? liveData.footerData.quickLinks
        : (((demoFallbackData as any).footerData?.quickLinks) || []),
      academicLinks: Array.isArray(liveData.footerData.academicLinks)
        ? liveData.footerData.academicLinks
        : (((demoFallbackData as any).footerData?.academicLinks) || [])
    };
  } else if ((demoFallbackData as any).footerData) {
    merged.footerData = (demoFallbackData as any).footerData;
  }

  if (liveData.seoSettings && typeof liveData.seoSettings === "object") {
    merged.seoSettings = {
      ...((demoFallbackData as any).seoSettings || {}),
      ...liveData.seoSettings
    };
  } else if ((demoFallbackData as any).seoSettings) {
    merged.seoSettings = (demoFallbackData as any).seoSettings;
  }

  if (liveData.uiLabels && typeof liveData.uiLabels === "object") {
    merged.uiLabels = {
      ...((demoFallbackData as any).uiLabels || {}),
      ...liveData.uiLabels
    };
  } else if ((demoFallbackData as any).uiLabels) {
    merged.uiLabels = (demoFallbackData as any).uiLabels;
  }

  if (liveData.translationSettings && typeof liveData.translationSettings === "object") {
    merged.translationSettings = {
      enabled: true,
      defaultLanguage: "bn",
      showNavbarToggle: true,
      ...liveData.translationSettings
    };
  }

  if (liveData.aboutInfo && typeof liveData.aboutInfo === "object") {
    merged.aboutInfo = {
      ...((demoFallbackData as any).aboutInfo || {}),
      ...liveData.aboutInfo
    };
  } else if ((demoFallbackData as any).aboutInfo) {
    merged.aboutInfo = (demoFallbackData as any).aboutInfo;
  }

  if (liveData.sidebarImage !== undefined) {
    merged.sidebarImage = liveData.sidebarImage;
  }

  merged._isLive = true;
  return merged;
}

async function fetchSchoolDataFromSource(): Promise<any> {
  // A. Try Vercel Postgres
  if (isVercelPostgresConfigured()) {
    try {
      const postgresTask = (async () => {
        const { sql } = await import("@vercel/postgres");
        try {
          const result = await sql`SELECT data FROM school_cms WHERE id = 'main_data' LIMIT 1;`;
          if (result.rows.length > 0 && result.rows[0].data) {
            const rawData = result.rows[0].data;
            const { cleaned, wasMigrated } = await sanitizeAndExtractBase64(rawData);
            if (wasMigrated) {
              try {
                await sql`UPDATE school_cms SET data = ${JSON.stringify(cleaned)}::jsonb WHERE id = 'main_data';`;
              } catch {}
            }
            return applyAuthoritativeData(cleaned);
          }
        } catch {
          // If table doesn't exist yet, create it and seed
          await ensurePostgresTable();
        }

        // First-time seed or retry after table creation
        let initialData: any = demoFallbackData;
        try {
          if (fs.existsSync(dataFilePath)) {
            initialData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
          }
        } catch {}

        const { sql: sqlRetry } = await import("@vercel/postgres");
        await sqlRetry`INSERT INTO school_cms (id, data) VALUES ('main_data', ${JSON.stringify(initialData)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(initialData)}::jsonb;`;
        return applyAuthoritativeData(initialData);
      })();

      // 2.5 second timeout safeguard for remote DB
      const result = await withTimeout(postgresTask, 2500, null);
      if (result) return result;
    } catch (err) {
      console.error("Vercel Postgres read error, checking alternatives:", err);
    }
  }

  // B. Try Firebase Firestore
  const db = getFirebaseDb();
  if (db) {
    try {
      const firestoreTask = (async () => {
        const docRef = doc(db, "school_cms", "main_data");
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const liveData = snap.data();
          return applyAuthoritativeData(liveData);
        } else {
          let initialData: any = demoFallbackData;
          try {
            if (fs.existsSync(dataFilePath)) {
              initialData = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
            }
          } catch {}

          await setDoc(docRef, initialData);
          return applyAuthoritativeData(initialData);
        }
      })();

      const result = await withTimeout(firestoreTask, 2500, null);
      if (result) return result;
    } catch (err) {
      console.error("Firestore read error, falling back to local file:", err);
    }
  }

  // C. Fallback to local JSON file
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(fileData);
      return applyAuthoritativeData(parsed);
    }
  } catch {}

  return demoFallbackData;
}

/**
 * Reads school data with lightning-fast in-memory caching and request deduplication
 */
export async function getSchoolData(forceFresh = false): Promise<any> {
  const now = Date.now();

  // 1. Return immediately from memory cache if fresh
  if (!forceFresh && memoryCache && (now - lastCacheTimestamp < CACHE_TTL_MS)) {
    return memoryCache;
  }

  // 2. Deduplicate in-flight requests during concurrent SSR rendering
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const freshData = await fetchSchoolDataFromSource();
      memoryCache = freshData;
      lastCacheTimestamp = Date.now();
      return freshData;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

/**
 * Saves updated data to Vercel Postgres / Firebase / Local File
 * Immediately updates in-memory cache so subsequent reads are instant
 */
export async function saveSchoolData(data: any): Promise<{ success: boolean; data: any }> {
  // Sanitize any large base64 strings so the JSON stays tiny
  const { cleaned } = await sanitizeAndExtractBase64(data);

  const dataToSave = {
    ...cleaned,
    _isLive: true,
    _lastUpdated: Date.now()
  };

  // Instant cache update
  memoryCache = dataToSave;
  lastCacheTimestamp = Date.now();

  // A. Save to Vercel Postgres if configured
  if (isVercelPostgresConfigured()) {
    try {
      await ensurePostgresTable();
      const { sql } = await import("@vercel/postgres");
      await sql`INSERT INTO school_cms (id, data) VALUES ('main_data', ${JSON.stringify(dataToSave)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(dataToSave)}::jsonb;`;
    } catch (err) {
      console.error("Vercel Postgres save error:", err);
    }
  }

  // B. Save to Firebase Firestore if configured
  const db = getFirebaseDb();
  if (db) {
    try {
      const docRef = doc(db, "school_cms", "main_data");
      await setDoc(docRef, dataToSave, { merge: true });
    } catch (err) {
      console.error("Firestore save error:", err);
    }
  }

  // C. Also write to local file if writable (local dev environment)
  try {
    if (fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(dataToSave, null, 2));
    }
  } catch {}

  return { success: true, data: dataToSave };
}

// In-memory cache for admin login
let adminMemoryCache: { username: string; password: string } | null = null;
let lastAdminCacheTimestamp = 0;

/**
 * Reads admin login credentials from Vercel Postgres / Firebase / Local File
 */
export async function getAdminData(): Promise<{ username: string; password: string }> {
  if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
    return {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };
  }

  const now = Date.now();
  if (adminMemoryCache && (now - lastAdminCacheTimestamp < CACHE_TTL_MS)) {
    return adminMemoryCache;
  }

  // A. Vercel Postgres
  if (isVercelPostgresConfigured()) {
    try {
      const { sql } = await import("@vercel/postgres");
      const res = await sql`SELECT data FROM school_cms WHERE id = 'admin_data' LIMIT 1;`;
      if (res.rows.length > 0 && res.rows[0].data) {
        adminMemoryCache = res.rows[0].data as { username: string; password: string };
        lastAdminCacheTimestamp = Date.now();
        return adminMemoryCache;
      }
    } catch {}
  }

  // B. Firebase
  const db = getFirebaseDb();
  if (db) {
    try {
      const docRef = doc(db, "school_cms", "admin_data");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const val = snap.data() as { username: string; password: string };
        if (val) {
          adminMemoryCache = val;
          lastAdminCacheTimestamp = Date.now();
          return val;
        }
      }
    } catch {}
  }

  // C. Local file
  try {
    if (fs.existsSync(adminFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(adminFilePath, "utf8"));
      if (parsed) {
        adminMemoryCache = parsed;
        lastAdminCacheTimestamp = Date.now();
        return parsed;
      }
    }
  } catch {}

  return adminFallbackData;
}

/**
 * Saves admin login credentials
 */
export async function saveAdminData(adminData: { username: string; password: string }): Promise<void> {
  adminMemoryCache = adminData;
  lastAdminCacheTimestamp = Date.now();

  // A. Vercel Postgres
  if (isVercelPostgresConfigured()) {
    try {
      await ensurePostgresTable();
      const { sql } = await import("@vercel/postgres");
      await sql`INSERT INTO school_cms (id, data) VALUES ('admin_data', ${JSON.stringify(adminData)}::jsonb) ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(adminData)}::jsonb;`;
    } catch {}
  }

  // B. Firebase
  const db = getFirebaseDb();
  if (db) {
    try {
      const docRef = doc(db, "school_cms", "admin_data");
      await setDoc(docRef, adminData);
    } catch {}
  }

  // C. Local file
  try {
    if (fs.existsSync(adminFilePath)) {
      fs.writeFileSync(adminFilePath, JSON.stringify(adminData, null, 2));
    }
  } catch {}
}
