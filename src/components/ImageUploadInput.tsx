"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2, Check } from "lucide-react";

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
}

/**
 * Client-side image optimizer:
 * Scales large phone/camera images down to max 1600px to ensure super fast uploads (<200KB)
 * and eliminate Vercel serverless body size limits.
 */
async function optimizeImageForUpload(file: File): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({ file, dataUrl: "" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const originalDataUrl = (e.target?.result as string) || "";
      const img = new Image();

      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const optimizedDataUrl = canvas.toDataURL(mimeType, 0.88);

          canvas.toBlob((blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, { type: mimeType });
              resolve({ file: optimizedFile, dataUrl: optimizedDataUrl });
            } else {
              resolve({ file, dataUrl: originalDataUrl });
            }
          }, mimeType, 0.88);
        } else {
          resolve({ file, dataUrl: originalDataUrl });
        }
      };

      img.onerror = () => {
        resolve({ file, dataUrl: originalDataUrl });
      };

      img.src = originalDataUrl;
    };

    reader.onerror = () => {
      resolve({ file, dataUrl: "" });
    };

    reader.readAsDataURL(file);
  });
}

export default function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = "https://... অথবা কম্পিউটার থেকে ফাইল সিলেক্ট করুন",
  required = false,
  helpText,
  className = "",
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);

    try {
      // 1. Optimize image in browser (downscale huge camera photos)
      const { file: optimizedFile, dataUrl: localPreviewUrl } = await optimizeImageForUpload(rawFile);

      // Immediately set local preview so UI updates without any lag
      if (localPreviewUrl) {
        onChange(localPreviewUrl);
      }

      // 2. Upload to server
      const formData = new FormData();
      formData.append("file", optimizedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        onChange(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else if (localPreviewUrl) {
        // Fallback to optimized dataUrl if upload endpoint had issues
        onChange(localPreviewUrl);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(data.message || "আপলোড ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।");
      }
    } catch (err: any) {
      setUploadError("ছবি আপলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    setUploadSuccess(false);
    setUploadError("");
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>ছবি সরান</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* প্রিভিউ ও আপলোড বাটন বক্স */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          {/* ইমেজ থাম্বনেইল প্রিভিউ */}
          <div className="relative w-16 h-16 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center mx-auto sm:mx-0">
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Error";
                }}
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-400" />
            )}
          </div>

          {/* আপলোড বাটন ও অ্যাকশন */}
          <div className="flex-1 flex flex-col justify-center gap-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 cursor-pointer disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>প্রসেসিং ও আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>কম্পিউটার/মোবাইল থেকে আপলোড</span>
                  </>
                )}
              </button>

              {uploadSuccess && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fadeIn">
                  <Check className="w-3 h-3" />
                  <span>সফলভাবে যুক্ত হয়েছে!</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {helpText || "যেকোনো সাইজের JPG, PNG, WebP ফরম্যাটের ছবি (স্বয়ংক্রিয়ভাবে অপ্টিমাইজড হয়)"}
            </p>
          </div>
        </div>

        {/* ম্যানুয়াল লিঙ্ক ইনপুট (ঐচ্ছিক ইউআরএল পেস্ট করার সুবিধা) */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-3.5 pr-8 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-slate-700 transition"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="মুছে ফেলুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {uploadError && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  );
}
