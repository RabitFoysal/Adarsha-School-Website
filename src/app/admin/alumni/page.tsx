"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Award, 
  UploadCloud, 
  CheckCircle2, 
  X,
  Phone,
  Mail,
  Briefcase,
  MapPin
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

interface AlumniMember {
  id: string | number;
  name: string;
  batch: string;
  photo?: string;
  currentDesignation: string;
  achievements?: string;
  quote?: string;
}

interface AlumniRegistration {
  id: string | number;
  name: string;
  batch: string;
  phone: string;
  email: string;
  occupation: string;
  currentAddress: string;
  message?: string;
  submittedAt: string;
}

export default function ManageAlumniPage() {
  const [activeTab, setActiveTab] = useState<"members" | "registrations">("members");
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [registrations, setRegistrations] = useState<AlumniRegistration[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Form state for Hall of Fame
  const [editId, setEditId] = useState<string | number | null>(null);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [photo, setPhoto] = useState("");
  const [currentDesignation, setCurrentDesignation] = useState("");
  const [achievements, setAchievements] = useState("");
  const [quote, setQuote] = useState("");

  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/alumni");
      if (res.ok) {
        const data = await res.json();
        setAlumni(data.alumni || []);
        setRegistrations(data.alumniRegistrations || []);
      }
    } catch {
      setMessage("ডাটা লোড করতে সমস্যা হয়েছে!");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?category=alumni", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setPhoto(data.url);
        setMessage("ছবি সফলভাবে আপলোড হয়েছে!");
        setIsError(false);
      } else {
        setMessage("ছবি আপলোড ব্যর্থ হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("ছবি আপলোড করতে সমস্যা হয়েছে!");
      setIsError(true);
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !batch.trim()) {
      setMessage("নাম ও ব্যাচ প্রদান করা আবশ্যক!");
      setIsError(true);
      return;
    }

    setSaving(true);
    const payload = {
      action: "save_member",
      member: {
        id: editId || undefined,
        name: name.trim(),
        batch: batch.trim(),
        photo: photo.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        currentDesignation: currentDesignation.trim(),
        achievements: achievements.trim(),
        quote: quote.trim()
      }
    };

    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(editId ? "সফলভাবে আপডেট হয়েছে!" : "নতুন কৃতি শিক্ষার্থী যুক্ত হয়েছে!");
        setIsError(false);
        resetMemberForm();
        setAlumni(data.alumni);
      } else {
        setMessage(data.error || "সংরক্ষণ করতে সমস্যা হয়েছে!");
        setIsError(true);
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
      setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    if (!confirm("আপনি কি নিশ্চিত এই কৃতি শিক্ষার্থীকে মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_member", member: { id } })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("সফলভাবে মুছে ফেলা হয়েছে!");
        setIsError(false);
        setAlumni(data.alumni);
      }
    } catch {
      setMessage("মুছে ফেলতে ব্যর্থ হয়েছে!");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteRegistration = async (id: string | number) => {
    if (!confirm("আপনি কি এই রেজিস্ট্রেশন রেকর্ডটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_registration", registrationId: id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("রেকর্ডটি মুছে ফেলা হয়েছে!");
        setIsError(false);
        setRegistrations(data.alumniRegistrations);
      }
    } catch {
      setMessage("মুছে ফেলতে ব্যর্থ হয়েছে!");
      setIsError(true);
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const startEditMember = (item: AlumniMember) => {
    setEditId(item.id);
    setName(item.name);
    setBatch(item.batch);
    setPhoto(item.photo || "");
    setCurrentDesignation(item.currentDesignation || "");
    setAchievements(item.achievements || "");
    setQuote(item.quote || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetMemberForm = () => {
    setEditId(null);
    setName("");
    setBatch("");
    setPhoto("");
    setCurrentDesignation("");
    setAchievements("");
    setQuote("");
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* হেডার */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              অ্যালামনাই ও কৃতি শিক্ষার্থী ব্যবস্থাপনা
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            হল অব ফেম (কৃতি প্রাক্তন শিক্ষার্থী) ও ওয়েবসাইটে জমা হওয়া অ্যালামনাই আবেদনসমূহ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* ট্যাব নেভিগেশন */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "members" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>কৃতি শিক্ষার্থী ({alumni.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "registrations" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>নতুন আবেদন ({registrations.length})</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          isError ? "bg-rose-50 border border-rose-200 text-rose-700" : "bg-emerald-50 border border-emerald-200 text-emerald-800"
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* ট্যাব ১: কৃতি শিক্ষার্থী ব্যবস্থাপনা */}
      {activeTab === "members" && (
        <div className="space-y-8">
          {/* ফর্ম */}
          <form onSubmit={handleSaveMember} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {editId ? <Edit3 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                <span>{editId ? "কৃতি শিক্ষার্থীর তথ্য সম্পাদনা" : "নতুন কৃতি শিক্ষার্থী যুক্ত করুন"}</span>
              </h2>
              {editId && (
                <button
                  type="button"
                  onClick={resetMemberForm}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>বাতিল</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ড. মোহাম্মদ তানভীর আহমেদ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পাসের ব্যাচ / শিক্ষাবর্ষ *</label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="যেমন: এসএসসি ১৯৯৮ ব্যাচ"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বর্তমান পেশা ও পদবি *</label>
                <input
                  type="text"
                  required
                  value={currentDesignation}
                  onChange={(e) => setCurrentDesignation(e.target.value)}
                  placeholder="যেমন: সহযোগী অধ্যাপক, কম্পিউটার সায়েন্স"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিশেষ অর্জন বা খ্যাতি</label>
                <input
                  type="text"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="যেমন: জাতীয় পুরস্কারপ্রাপ্ত গবেষক"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* ছবি আপলোড */}
            <ImageUploadInput
              label="প্রোফাইল ছবি"
              value={photo}
              onChange={setPhoto}
              placeholder="কম্পিউটার/মোবাইল থেকে ছবি আপলোড করুন অথবা লিঙ্ক দিন"
              helpText="কৃতি শিক্ষার্থীর স্পষ্ট ছবি আপলোড করুন (স্বয়ংক্রিয় অপ্টিমাইজড)"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অনুপ্রেরণামূলক বক্তব্য বা উক্তি (Quote)</label>
              <textarea
                rows={2}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="বিদ্যালয়ের স্মৃতি বা বর্তমান শিক্ষার্থীদের উদ্দেশ্যে বার্তা..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition cursor-pointer"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : (editId ? "আপডেট সংরক্ষণ করুন" : "কৃতি শিক্ষার্থী যুক্ত করুন")}
            </button>
          </form>

          {/* বিদ্যমান তালিকা */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              বর্তমান কৃতি শিক্ষার্থী তালিকা ({alumni.length})
            </h3>

            {alumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumni.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.photo || "https://placehold.co/100x100?text=Alumni"}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 bg-white"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.batch}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{item.name}</h4>
                        <p className="text-xs text-slate-500">{item.currentDesignation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditMember(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMember(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">কোনো কৃতি শিক্ষার্থী যুক্ত নেই।</div>
            )}
          </div>
        </div>
      )}

      {/* ট্যাব ২: ওয়েবসাইট থেকে জমা পড়া অ্যালামনাই আবেদন */}
      {activeTab === "registrations" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">অনলাইন অ্যালামনাই নিবন্ধন সমূহ ({registrations.length})</h2>
              <p className="text-xs text-slate-500">প্রাক্তন শিক্ষার্থীদের পাঠানো যোগাযোগের তথ্য ও বার্তা</p>
            </div>
          </div>

          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b text-left">
                  <tr>
                    <th className="p-3">তারিখ</th>
                    <th className="p-3">নাম ও ব্যাচ</th>
                    <th className="p-3">যোগাযোগ (ফোন ও ইমেইল)</th>
                    <th className="p-3">পেশা ও বর্তমান ঠিকানা</th>
                    <th className="p-3">বার্তা</th>
                    <th className="p-3 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 text-slate-400 whitespace-nowrap">{reg.submittedAt}</td>
                      <td className="p-3 font-bold text-slate-900">
                        {reg.name}
                        <span className="block text-[11px] font-semibold text-blue-600 mt-0.5">{reg.batch}</span>
                      </td>
                      <td className="p-3 text-slate-600">
                        <div className="flex items-center gap-1 font-medium text-slate-800">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{reg.phone}</span>
                        </div>
                        {reg.email && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{reg.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">
                        <div className="font-medium text-slate-800">{reg.occupation || "—"}</div>
                        {reg.currentAddress && (
                          <div className="text-[11px] text-slate-500">{reg.currentAddress}</div>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={reg.message}>
                        {reg.message || "—"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRegistration(reg.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">এখনো কোনো অনলাইন আবেদন জমা পড়েনি।</div>
          )}
        </div>
      )}
    </div>
  );
}
