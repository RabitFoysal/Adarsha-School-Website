"use client";

import { useState, useEffect, useMemo } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  Save, 
  X, 
  Search, 
  Award, 
  GraduationCap, 
  School, 
  BookOpen, 
  Calendar, 
  Droplet, 
  Hash, 
  MapPin, 
  CheckCircle2,
  FolderPlus
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

const STANDARD_SECTIONS = [
  { id: "administration", name: "👑 প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব", description: "শুধুমাত্র এই বিভাগ সিলেক্ট করলেই তিনি লিডারশিপে যাবেন" },
  { id: "primary", name: "🎒 প্রাথমিক শাখা (শিশু - ৫ম শ্রেণি)", description: "প্রাথমিক স্তরের শিক্ষকমণ্ডলী" },
  { id: "high_school", name: "🏫 মাধ্যমিক শাখা (৬ষ্ঠ - ১০ম শ্রেণি)", description: "হাইস্কুল স্তরের শিক্ষকমণ্ডলী" },
  { id: "college", name: "🎓 উচ্চ মাধ্যমিক / কলেজ শাখা (১১শ - ১২শ শ্রেণি)", description: "কলেজ স্তরের শিক্ষকমণ্ডলী" },
  { id: "custom", name: "✨ নতুন কাস্টম বিভাগ তৈরি করুন", description: "যেকোনো বিশেষ বিভাগ বা নতুন শাখা যোগ করতে এটি ব্যবহার করুন" }
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function ManageTeachersPage() {
  const { data, refreshData } = useAdminData();
  const [teachers, setTeachers] = useState<any[]>(data.teachers || []);

  // ফর্ম স্টেট
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [section, setSection] = useState("high_school");
  const [customSectionName, setCustomSectionName] = useState("");
  const [order, setOrder] = useState<number | string>(1);
  const [subject, setSubject] = useState("");
  const [qualification, setQualification] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [speech, setSpeech] = useState("");
  const [bio, setBio] = useState("");
  const [isLeadership, setIsLeadership] = useState(false);

  // ফিল্টার ও সার্চ স্টেট
  const [filterSection, setFilterSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.teachers) {
      setTeachers(data.teachers);
    }
  }, [data.teachers]);

  // বিদ্যমান সকল কাস্টম বিভাগের তালিকা স্বয়ংক্রিয়ভাবে শনাক্ত করা
  const existingCustomSections = useMemo(() => {
    const list = new Set<string>();
    teachers.forEach((t) => {
      if (t.section === "custom" && t.customSectionName) {
        list.add(t.customSectionName.trim());
      } else if (
        t.section &&
        !["administration", "primary", "high_school", "college", "custom"].includes(t.section)
      ) {
        list.add(t.section.trim());
      }
    });
    return Array.from(list);
  }, [teachers]);

  const handleEdit = (t: any) => {
    setEditId(t.id);
    setName(t.name || "");
    setDesignation(t.designation || "");
    
    // সেকশন নির্ধারণ
    const isStd = ["administration", "primary", "high_school", "college"].includes(t.section);
    if (isStd) {
      setSection(t.section);
      setCustomSectionName("");
    } else {
      setSection("custom");
      setCustomSectionName(t.customSectionName || t.section || "");
    }

    setOrder(t.order !== undefined ? t.order : 1);
    setSubject(t.subject || "");
    setQualification(t.qualification || "");
    setIndexNumber(t.indexNumber || "");
    setTeacherId(t.teacherId || "");
    setJoiningDate(t.joiningDate || "");
    setBloodGroup(t.bloodGroup || "");
    setPhone(t.phone || "");
    setEmail(t.email || "");
    setAddress(t.address || "");
    setImage(t.image || "");
    setSpeech(t.speech || "");
    setBio(t.bio || "");
    setIsLeadership(Boolean(t.isLeadership) || t.section === "administration");

    // ফর্মের দিকে স্ক্রল
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setDesignation("");
    setSection("high_school");
    setCustomSectionName("");
    setOrder(1);
    setSubject("");
    setQualification("");
    setIndexNumber("");
    setTeacherId("");
    setJoiningDate("");
    setBloodGroup("");
    setPhone("");
    setEmail("");
    setAddress("");
    setImage("");
    setSpeech("");
    setBio("");
    setIsLeadership(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setMessage("শিক্ষকের নাম ও পদবি প্রদান করা আবশ্যক!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const finalSection = section === "custom" ? (customSectionName.trim() || "custom") : section;
      const isLead = section === "administration" ? true : isLeadership;

      const payload = {
        id: editId,
        name: name.trim(),
        designation: designation.trim(),
        section: finalSection,
        customSectionName: section === "custom" ? customSectionName.trim() : "",
        order: Number(order) || 1,
        subject: subject.trim(),
        qualification: qualification.trim(),
        indexNumber: indexNumber.trim(),
        teacherId: teacherId.trim(),
        joiningDate: joiningDate.trim(),
        bloodGroup: bloodGroup.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        image: image.trim(),
        speech: speech.trim(),
        bio: bio.trim(),
        isLeadership: isLead,
      };

      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok) {
        setMessage(editId ? "শিক্ষক তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন শিক্ষক যুক্ত হয়েছে!");
        handleCancel();
        await refreshData();
      } else {
        setMessage(resData.message || "সংরক্ষণ ব্যর্থ হয়েছে!");
      }
    } catch {
      setMessage("সার্ভারে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন!");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষকের তথ্য স্থায়ীভাবে মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("শিক্ষক তথ্য মুছে ফেলা হয়েছে!");
        refreshData();
      } else {
        setMessage("মুছে ফেলা সম্ভব হয়নি!");
      }
    } catch {
      setMessage("মুছে ফেলতে সমস্যা হয়েছে!");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  // ফিল্টার ও সাজানো
  const filteredTeachers = useMemo(() => {
    let list = [...teachers];

    // সেকশন ফিল্টার
    if (filterSection !== "all") {
      if (filterSection === "administration") {
        list = list.filter((t) => t.section === "administration" || t.isLeadership);
      } else if (filterSection === "custom") {
        list = list.filter(
          (t) =>
            t.section === "custom" ||
            !["administration", "primary", "high_school", "college"].includes(t.section)
        );
      } else {
        list = list.filter((t) => t.section === filterSection);
      }
    }

    // সার্চ ফিল্টার
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.designation?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q) ||
          t.phone?.includes(q)
      );
    }

    // সেকশন অনুযায়ী এবং সেই সেকশনের নিজস্ব ক্রম অনুযায়ী সাজানো
    return list.sort((a, b) => {
      const orderA = a.order !== undefined ? Number(a.order) : 999;
      const orderB = b.order !== undefined ? Number(b.order) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "", "bn");
    });
  }, [teachers, filterSection, searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-blue-200">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>শিক্ষকমণ্ডলী ডাটাবেজ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            শিক্ষক ও অনুষদ সদস্য ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            প্রতিষ্ঠানের সকল শিক্ষকের বিস্তারিত তথ্য, বিভাগ, সেকশনভিত্তিক ক্রম এবং ছবি আপলোড করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
            মোট শিক্ষক: {teachers.length} জন
          </span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border transition ${
          message.includes("সফল") || message.includes("যুক্ত") || message.includes("মুছে")
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          {message}
        </div>
      )}

      {/* ========================================================================= */}
      {/* শিক্ষক যুক্ত / এডিট করার পূর্ণাঙ্গ ফর্ম                                    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              {editId ? <Edit2 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">
                {editId ? "শিক্ষকের তথ্য সংশোধন করুন" : "নতুন শিক্ষক যুক্ত করুন"}
              </h2>
              <p className="text-xs text-slate-300">
                নিচের সকল প্রয়োজনীয় ফিল্ড পূরণ করে তথ্য সংরক্ষণ করুন
              </p>
            </div>
          </div>

          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>বাতিল করুন</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* গ্রুপ ১: মৌলিক পরিচিতি ও বিভাগ */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>১. মৌলিক তথ্য ও সেকশন নির্ধারণ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* শিক্ষকের নাম */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষকের পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ড. মুহাম্মদ রফিকুল ইসলাম"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* পদবি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পদবি <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="যেমন: প্রধান শিক্ষক / সিনিয়র সহকারী শিক্ষক"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* বিভাগ / শাখা */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষক বিভাগ / অনুষদ <span className="text-rose-500">*</span>
                </label>
                <select
                  value={section}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSection(val);
                    if (val === "administration") {
                      setIsLeadership(true);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-bold text-slate-800"
                >
                  {STANDARD_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                  {existingCustomSections.map((cSec) => (
                    <option key={cSec} value={cSec}>
                      📁 কাস্টম: {cSec}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  * প্রশাসন সিলেক্ট না করলে তিনি কখনোই সাধারণ শিক্ষক হিসেবে থাকবেন
                </p>
              </div>

              {/* কাস্টম বিভাগের নাম (যদি কাস্টম সিলেক্ট করা হয়) */}
              {(section === "custom" || !["administration", "primary", "high_school", "college"].includes(section)) && (
                <div className="sm:col-span-2 lg:col-span-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <FolderPlus className="w-4 h-4 text-amber-600" />
                    <span>কাস্টম বিভাগের নাম লিখুন:</span>
                  </div>
                  <input
                    type="text"
                    required={section === "custom"}
                    value={customSectionName}
                    onChange={(e) => setCustomSectionName(e.target.value)}
                    placeholder="যেমন: কারিগরি ও ভোকেশনাল শাখা / হিফজুল কুরআন বিভাগ / আইসিটি বিভাগ"
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                  <p className="text-[11px] text-amber-800">
                    এই কাস্টম বিভাগটি স্বয়ংক্রিয়ভাবে শিক্ষক পেজে একটি আলাদা ট্যাব ও সেকশন হিসেবে তৈরি হবে।
                  </p>
                </div>
              )}

              {/* এই বিভাগে ক্রমিক নং (Order in Section) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এই বিভাগে ক্রমিক নং (সিরিয়াল)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="১, ২, ৩..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50 font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  * প্রতিটি বিভাগের জন্য আলাদাভাবে ১ থেকে শুরু করতে পারবেন (কার্ডে প্রদর্শিত হবে না)
                </p>
              </div>

              {/* মূল পাঠদানের বিষয় */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মূল পাঠদানের বিষয়
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="যেমন: পদার্থবিজ্ঞান / উচ্চতর গণিত / বাংলা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* শিক্ষাগত যোগ্যতা ও ডিগ্রি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষাগত যোগ্যতা ও ডিগ্রি
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="যেমন: এম.এসসি (১ম শ্রেণি), বি.এড"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

            </div>
          </div>

          {/* গ্রুপ ২: প্রাতিষ্ঠানিক ও যোগাযোগ তথ্য */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-600" />
              <span>২. দাপ্তরিক বিবরণ ও যোগাযোগ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* ইনডেক্স নম্বর */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইনডেক্স নম্বর (MPO)
                </label>
                <input
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  placeholder="যেমন: N-102948"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* শিক্ষক আইডি */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষক আইডি নম্বর
                </label>
                <input
                  type="text"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="যেমন: T-2026-05"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* যোগদানের তারিখ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  যোগদানের তারিখ
                </label>
                <input
                  type="text"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  placeholder="যেমন: ০১ জানুয়ারি, ২০২০"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* রক্তের গ্রুপ */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রক্তের গ্রুপ
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-bold"
                >
                  <option value="">-- সিলেক্ট করুন --</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* মোবাইল নম্বর */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01700-000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* ইমেইল */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: teacher@school.edu.bd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              {/* ঠিকানা */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্থায়ী / বর্তমান ঠিকানা
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: গ্রাম/মহল্লা, উপজেলা, জেলা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

            </div>
          </div>

          {/* গ্রুপ ৩: ছবি আপলোড (কম্পিউটার/ডিভাইস থেকে সরাসরি) */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-purple-600" />
              <span>৩. শিক্ষকের ছবি আপলোড</span>
            </h3>

            <ImageUploadInput
              label="শিক্ষকের পোর্ট্রেট ছবি"
              value={image}
              onChange={setImage}
              placeholder="কম্পিউটার থেকে ছবি সিলেক্ট করুন অথবা ছবির লিঙ্ক দিন"
              helpText="মোবাইল বা কম্পিউটার থেকে যেকোনো সাইজের স্পষ্ট ছবি আপলোড করুন (স্বয়ংক্রিয়ভাবে কম্প্রেস হয়ে সেভ হবে)"
            />
          </div>

          {/* গ্রুপ ৪: বক্তব্য ও জীবনবৃত্তান্ত */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>৪. শিক্ষকের উক্তি ও পরিচিতি (ঐচ্ছিক)</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  শিক্ষকের অনুপ্রেরণামূলক উক্তি / বাণী
                </label>
                <textarea
                  rows={2}
                  value={speech}
                  onChange={(e) => setSpeech(e.target.value)}
                  placeholder="শিক্ষার্থীদের উদ্দেশ্যে শিক্ষকের বিশেষ বক্তব্য বা অনুপ্রেরণামূলক কথা..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিস্তারিত জীবনবৃত্তান্ত ও কর্মপরিধি (Bio)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="শিক্ষকতার অভিজ্ঞতা, বিশেষ অর্জন, গবেষণা বা পাঠদান সংক্রান্ত অন্যান্য বিবরণ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট সংরক্ষণ করুন" : "শিক্ষক যুক্ত করুন"}</span>
            </button>
          </div>

        </form>
      </div>

      {/* ========================================================================= */}
      {/* শিক্ষকবৃন্দের তালিকা ও ফিল্টারিং টেবিল                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              বর্তমান শিক্ষকবৃন্দের তালিকা
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ফিল্টার করে বিভাগভিত্তিক শিক্ষকদের তথ্য ও ক্রম যাচাই করুন
            </p>
          </div>

          {/* সার্চ বক্স */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিক্ষকের নাম, বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
            />
          </div>
        </div>

        {/* সেকশন ফিল্টার বোতামসমূহ */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setFilterSection("all")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterSection === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            সকল শিক্ষক ({teachers.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterSection("administration")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterSection === "administration"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
            }`}
          >
            👑 প্রশাসন ও নেতৃত্ব ({teachers.filter((t) => t.section === "administration" || t.isLeadership).length})
          </button>

          <button
            type="button"
            onClick={() => setFilterSection("primary")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterSection === "primary"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
            }`}
          >
            🎒 প্রাথমিক শাখা ({teachers.filter((t) => t.section === "primary").length})
          </button>

          <button
            type="button"
            onClick={() => setFilterSection("high_school")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterSection === "high_school"
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100"
            }`}
          >
            🏫 মাধ্যমিক শাখা ({teachers.filter((t) => t.section === "high_school").length})
          </button>

          <button
            type="button"
            onClick={() => setFilterSection("college")}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
              filterSection === "college"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            🎓 কলেজ শাখা ({teachers.filter((t) => t.section === "college").length})
          </button>

          {existingCustomSections.length > 0 && (
            <button
              type="button"
              onClick={() => setFilterSection("custom")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                filterSection === "custom"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100"
              }`}
            >
              📁 কাস্টম বিভাগসমূহ
            </button>
          )}
        </div>

        {/* শিক্ষক তালিকা কার্ড গ্রিড */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            কোনো শিক্ষকের তথ্য পাওয়া যায়নি। উপরের ফর্ম থেকে নতুন শিক্ষক যুক্ত করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredTeachers.map((t) => {
              const isAdm = t.section === "administration" || t.isLeadership;
              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between group ${
                    isAdm ? "border-amber-300 ring-1 ring-amber-300/50 bg-amber-50/20" : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <div>
                    {/* টপ ব্যাজ */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isAdm 
                          ? "bg-amber-100 text-amber-900 border-amber-200" 
                          : t.section === "primary"
                          ? "bg-blue-100 text-blue-900 border-blue-200"
                          : t.section === "college"
                          ? "bg-indigo-100 text-indigo-900 border-indigo-200"
                          : "bg-teal-100 text-teal-900 border-teal-200"
                      }`}>
                        {isAdm
                          ? "👑 প্রশাসন ও নেতৃত্ব"
                          : t.customSectionName
                          ? `📁 ${t.customSectionName}`
                          : t.section === "primary"
                          ? "🎒 প্রাথমিক শাখা"
                          : t.section === "college"
                          ? "🎓 কলেজ শাখা"
                          : "🏫 মাধ্যমিক শাখা"}
                      </span>

                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        ক্রম: {t.order || 1}
                      </span>
                    </div>

                    {/* পোর্ট্রেট ও পরিচিতি */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={t.image || "https://placehold.co/150x150/e2e8f0/1e293b?text=Teacher"}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/150x150/e2e8f0/1e293b?text=Teacher";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-sm text-slate-900 truncate group-hover:text-blue-700 transition">
                          {t.name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">
                          {t.designation}
                        </p>
                        {t.subject && (
                          <p className="text-[11px] text-blue-600 font-bold truncate">
                            বিষয়: {t.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* অতিরিক্ত বিস্তারিত */}
                    <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {t.qualification && (
                        <p className="truncate">🎓 {t.qualification}</p>
                      )}
                      {t.phone && (
                        <p className="truncate">📞 {t.phone}</p>
                      )}
                      {t.email && (
                        <p className="truncate">✉️ {t.email}</p>
                      )}
                      {t.bloodGroup && (
                        <p className="truncate text-rose-600 font-bold">🩸 রক্তের গ্রুপ: {t.bloodGroup}</p>
                      )}
                    </div>
                  </div>

                  {/* কার্ড ফুটার অ্যাকশন বাটন */}
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleEdit(t)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
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
