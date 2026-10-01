"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Award, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  Search,
  CheckCircle2
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageCommitteePage() {
  const { data, refreshData } = useAdminData();
  const [committee, setCommittee] = useState<any[]>(data.committee || []);
  
  // ফর্ম স্টেট
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("সভাপতি");
  const [customDesignation, setCustomDesignation] = useState("");
  const [tenure, setTenure] = useState("২০২৪ - বর্তমান");
  const [qualification, setQualification] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const designationPresets = [
    "সভাপতি",
    "সহ-সভাপতি",
    "সদস্য সচিব (প্রতিষ্ঠান প্রধান)",
    "প্রতিষ্ঠাতা সদস্য",
    "দাতা সদস্য",
    "বিদ্যুৎসাহী সদস্য",
    "অভিভাবক প্রতিনিধি সদস্য",
    "শিক্ষক প্রতিনিধি সদস্য",
    "অন্যান্য / কাস্টম পদবি"
  ];

  useEffect(() => {
    if (data.committee && Array.isArray(data.committee)) {
      setCommittee(data.committee);
    }
  }, [data.committee]);

  const handleEdit = (c: any) => {
    setEditId(c.id);
    setName(c.name || "");
    
    if (designationPresets.includes(c.designation)) {
      setDesignation(c.designation);
      setCustomDesignation("");
    } else if (c.designation) {
      setDesignation("অন্যান্য / কাস্টম পদবি");
      setCustomDesignation(c.designation);
    } else {
      setDesignation("সভাপতি");
      setCustomDesignation("");
    }

    setTenure(c.tenure || "২০২৪ - বর্তমান");
    setQualification(c.qualification || "");
    setOccupation(c.occupation || "");
    setPhone(c.phone || "");
    setEmail(c.email || "");
    setAddress(c.address || "");
    setOrder(c.order !== undefined ? Number(c.order) : 1);
    setBio(c.bio || "");
    setImage(c.image || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setDesignation("সভাপতি");
    setCustomDesignation("");
    setTenure("২০২৪ - বর্তমান");
    setQualification("");
    setOccupation("");
    setPhone("");
    setEmail("");
    setAddress("");
    setOrder(committee.length + 1);
    setBio("");
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalDesig = designation === "অন্যান্য / কাস্টম পদবি" 
      ? (customDesignation.trim() || "কমিটি সদস্য") 
      : designation;

    const payload = {
      id: editId,
      name,
      designation: finalDesig,
      role: finalDesig,
      tenure,
      qualification,
      occupation,
      phone,
      email,
      address,
      order: Number(order) || 1,
      bio,
      image
    };

    try {
      const res = await fetch("/api/committee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage(editId ? "কমিটি সদস্য তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন কমিটি সদস্য যুক্ত হয়েছে! (ডেমো ডাটা ১০০% প্রতিস্থাপিত)");
        handleCancel();
        refreshData();
      } else {
        setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
      }
    } catch {
      setMessage("সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই সদস্যের তথ্য মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/committee?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("সদস্য তথ্য মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  const filteredCommittee = committee.filter((c: any) => {
    const q = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.designation && c.designation.toLowerCase().includes(q))
    );
  }).sort((a: any, b: any) => {
    const orderA = a.order !== undefined ? Number(a.order) : 999;
    const orderB = b.order !== undefined ? Number(b.order) : 999;
    return orderA - orderB;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>পরিচালনা পর্ষদ ও ম্যানেজিং কমিটি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">পরিচালনা পর্ষদ ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">ম্যানেজিং কমিটির সভাপতি, সহ-সভাপতি, দাতা সদস্য ও সদস্যবৃন্দের পূর্ণাঙ্গ তথ্য ও ছবি পরিচালনা করুন</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* কমিটি সদস্য ফর্ম */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-amber-600" />}
          <span>{editId ? "সদস্য তথ্য সম্পাদনা করুন" : "নতুন কমিটি সদস্য যোগ করুন"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">সদস্যের পূর্ণ নাম *</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="যেমন: আলহাজ্ব মো: আব্দুল করিম"
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পদবি / ভূমিকা *</label>
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500 bg-white"
            >
              {designationPresets.map((desig) => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">দায়িত্বকাল / মেয়াদ</label>
            <input 
              type="text" 
              value={tenure} 
              onChange={(e) => setTenure(e.target.value)} 
              placeholder="যেমন: ২০২৩ - ২০২৫ অথবা ২০২৪ - বর্তমান"
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          {designation === "অন্যান্য / কাস্টম পদবি" && (
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-amber-700 mb-1">কাস্টম পদবির নাম লিখুন *</label>
              <input 
                type="text" 
                required 
                value={customDesignation} 
                onChange={(e) => setCustomDesignation(e.target.value)} 
                placeholder="যেমন: প্রধান পৃষ্ঠপোষক / উপদেষ্টা" 
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-amber-300 outline-none focus:border-amber-500" 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
            <input 
              type="text" 
              value={qualification} 
              onChange={(e) => setQualification(e.target.value)} 
              placeholder="যেমন: বি.এ (অনার্স), এম.এ" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পেশা / কর্মক্ষেত্র</label>
            <input 
              type="text" 
              value={occupation} 
              onChange={(e) => setOccupation(e.target.value)} 
              placeholder="যেমন: বিশিষ্ট সমাজসেবক ও শিল্পপতি" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="০১৭১XXXXXXXX" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="member@school.edu.bd" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা / এলাকা</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="যেমন: ঢাকা, বাংলাদেশ" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (অগ্রাধিকার)</label>
            <input 
              type="number" 
              min={1} 
              value={order} 
              onChange={(e) => setOrder(Number(e.target.value))} 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500" 
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত পরিচিতি বা বাণী (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="সদস্যের সংক্ষিপ্ত বক্তব্য বা ভূমিকা..."
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <ImageUploadInput
              label="সদস্যের ছবি"
              value={image}
              onChange={setImage}
              helpText="কম্পিউটার বা মোবাইল থেকে সরাসরি কমিটি সদস্যের ছবি আপলোড করুন"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "সদস্য যুক্ত করুন"}</span>
          </button>
          {editId && (
            <button 
              type="button" 
              onClick={handleCancel} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-pointer transition"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      {/* সংরক্ষিত সদস্যদের তালিকা */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              সকল সংরক্ষিত কমিটি সদস্য ({filteredCommittee.length} জন)
            </h2>
          </div>

          {/* সার্চ ফিল্টার */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম বা পদবি দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {filteredCommittee.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            কোনো কমিটি সদস্যের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommittee.map((c: any) => {
              const isPresident = c.designation && c.designation.includes("সভাপতি");
              return (
                <div 
                  key={c.id} 
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 group ${
                    isPresident 
                      ? "border-amber-300 bg-amber-50/50 shadow-xs" 
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img 
                      src={c.image || "https://placehold.co/100x100?text=Member"} 
                      alt={c.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 bg-white shrink-0 shadow-2xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Member";
                      }}
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          isPresident ? "bg-amber-200 text-amber-900" : "bg-slate-200 text-slate-800"
                        }`}>
                          #{c.order || 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 truncate">{c.name}</h4>
                      </div>
                      <p className="text-xs text-amber-800 font-bold truncate">{c.designation}</p>
                      {c.tenure && (
                        <p className="text-[11px] text-slate-500 truncate">🗓️ {c.tenure}</p>
                      )}
                      {c.occupation && (
                        <p className="text-[11px] text-slate-600 truncate">💼 {c.occupation}</p>
                      )}
                      {c.phone && (
                        <p className="text-[11px] text-slate-600 truncate">📞 {c.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                      {c.address || ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        type="button" 
                        onClick={() => handleEdit(c)} 
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-amber-700 hover:border-amber-400 cursor-pointer shadow-2xs transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDelete(c.id)} 
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 hover:border-rose-400 cursor-pointer shadow-2xs transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
