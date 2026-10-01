"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Phone, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Droplet, 
  Search,
  CheckCircle2,
  Users
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageStaffPage() {
  const { data, refreshData } = useAdminData();
  const [staff, setStaff] = useState<any[]>(data.staff || []);
  
  // ফর্ম ফিল্ড স্টেট
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("প্রশাসনিক অফিস");
  const [customDepartment, setCustomDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [qualification, setQualification] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const departmentPresets = [
    "প্রশাসনিক অফিস",
    "হিসাব শাখা",
    "তথ্যপ্রযুক্তি ও ল্যাব",
    "গ্রন্থাগার (লাইব্রেরি)",
    "বিজ্ঞানাগার ও প্র্যাকটিক্যাল ল্যাব",
    "সাধারণ ও নিরাপত্তা শাখা",
    "অন্যান্য / কাস্টম শাখা"
  ];

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "জানা নেই"];

  useEffect(() => {
    if (data.staff && Array.isArray(data.staff)) {
      setStaff(data.staff);
    }
  }, [data.staff]);

  const handleEdit = (s: any) => {
    setEditId(s.id);
    setName(s.name || "");
    setDesignation(s.designation || "");
    
    if (departmentPresets.includes(s.department)) {
      setDepartment(s.department);
      setCustomDepartment("");
    } else if (s.department) {
      setDepartment("অন্যান্য / কাস্টম শাখা");
      setCustomDepartment(s.department);
    } else {
      setDepartment("প্রশাসনিক অফিস");
      setCustomDepartment("");
    }

    setPhone(s.phone || "");
    setEmail(s.email || "");
    setQualification(s.qualification || "");
    setJoiningDate(s.joiningDate || "");
    setBloodGroup(s.bloodGroup || "");
    setOrder(s.order !== undefined ? Number(s.order) : 1);
    setBio(s.bio || "");
    setImage(s.image || "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setDesignation("");
    setDepartment("প্রশাসনিক অফিস");
    setCustomDepartment("");
    setPhone("");
    setEmail("");
    setQualification("");
    setJoiningDate("");
    setBloodGroup("");
    setOrder(staff.length + 1);
    setBio("");
    setImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalDept = department === "অন্যান্য / কাস্টম শাখা" 
      ? (customDepartment.trim() || "সাধারণ শাখা") 
      : department;

    const payload = {
      id: editId,
      name,
      designation,
      department: finalDept,
      phone,
      email,
      qualification,
      joiningDate,
      bloodGroup,
      order: Number(order) || 1,
      bio,
      image
    };

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage(editId ? "কর্মচারী তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন কর্মচারী সফলভাবে যুক্ত হয়েছে! (ডেমো ডাটা ১০০% প্রতিস্থাপিত)");
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
    if (!confirm("আপনি কি নিশ্চিতভাবে এই কর্মীর তথ্য মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("কর্মচারীর তথ্য মুছে ফেলা হয়েছে!");
        refreshData();
      }
    } catch {}
    setTimeout(() => setMessage(""), 3000);
  };

  const filteredStaff = staff.filter((s: any) => {
    const q = searchTerm.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.designation && s.designation.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  }).sort((a: any, b: any) => {
    const orderA = a.order !== undefined ? Number(a.order) : 999;
    const orderB = b.order !== undefined ? Number(b.order) : 999;
    return orderA - orderB;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-teal-200">
          <Briefcase className="w-3.5 h-3.5 text-teal-600" />
          <span>দাপ্তরিক ও সহায়ক কর্মচারী</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">কর্মচারীবৃন্দ ব্যবস্থাপনা</h1>
        <p className="text-xs text-slate-500 mt-1">বিদ্যালয়ের সকল অফিস সহকারী, হিসাবরক্ষক, কম্পিউটার অপারেটর ও কর্মচারীদের পূর্ণাঙ্গ তথ্য ও ছবি পরিচালনা করুন</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* কর্মচারী সংযোজন / এডিট ফর্ম */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          {editId ? <Edit2 className="w-4 h-4 text-teal-600" /> : <Plus className="w-4 h-4 text-teal-600" />}
          <span>{editId ? "কর্মচারী তথ্য সম্পাদনা করুন" : "নতুন কর্মচারী যোগ করুন"}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">কর্মীর পূর্ণ নাম *</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="যেমন: মো: রফিকুল ইসলাম"
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পদবি *</label>
            <input 
              type="text" 
              required 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)} 
              placeholder="যেমন: প্রধান সহকারী / হিসাবরক্ষক / ল্যাব সহকারী" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শাখা / বিভাগ</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500 bg-white"
            >
              {departmentPresets.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {department === "অন্যান্য / কাস্টম শাখা" && (
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-teal-700 mb-1">কাস্টম শাখার নাম লিখুন *</label>
              <input 
                type="text" 
                required 
                value={customDepartment} 
                onChange={(e) => setCustomDepartment(e.target.value)} 
                placeholder="যেমন: আইসিটি ও ডিজিটাল ক্লাসরুম শাখা" 
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-teal-300 outline-none focus:border-teal-500" 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="০১৭১XXXXXXXX" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="staff@school.edu.bd" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
            <input 
              type="text" 
              value={qualification} 
              onChange={(e) => setQualification(e.target.value)} 
              placeholder="যেমন: বি.বি.এস / ডিপ্লোমা ইন সিএসই" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">যোগদানের তারিখ</label>
            <input 
              type="text" 
              value={joiningDate} 
              onChange={(e) => setJoiningDate(e.target.value)} 
              placeholder="যেমন: ০১ জানুয়ারি, ২০২০" 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500 bg-white"
            >
              <option value="">নির্বাচন করুন</option>
              {bloodGroupOptions.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">প্রদর্শন ক্রম (সিরিয়াল)</label>
            <input 
              type="number" 
              min={1} 
              value={order} 
              onChange={(e) => setOrder(Number(e.target.value))} 
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500" 
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">দায়িত্ব ও সংক্ষিপ্ত পরিচিতি (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="কর্মচারীর প্রধান দায়িত্বসমূহ বা সংক্ষিপ্ত বিবরণ..."
              className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3">
            <ImageUploadInput
              label="কর্মচারীর ছবি"
              value={image}
              onChange={setImage}
              helpText="কম্পিউটার বা মোবাইল থেকে সরাসরি কর্মচারীর ছবি আপলোড করুন"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>{editId ? "আপডেট সংরক্ষণ করুন" : "কর্মচারী যুক্ত করুন"}</span>
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

      {/* সংরক্ষিত কর্মচারীদের তালিকা */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              সকল সংরক্ষিত কর্মচারী ({filteredStaff.length} জন)
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
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {filteredStaff.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            কোনো কর্মচারীর তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((s: any) => (
              <div 
                key={s.id} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <img 
                    src={s.image || "https://placehold.co/100x100?text=Staff"} 
                    alt={s.name} 
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 bg-white shrink-0 shadow-2xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Staff";
                    }}
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full shrink-0">
                        #{s.order || 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 truncate">{s.name}</h4>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold truncate">{s.designation}</p>
                    {s.department && (
                      <p className="text-[11px] text-slate-500 truncate">🏢 {s.department}</p>
                    )}
                    {s.qualification && (
                      <p className="text-[11px] text-slate-600 truncate">🎓 {s.qualification}</p>
                    )}
                    {s.phone && (
                      <p className="text-[11px] text-slate-600 truncate">📞 {s.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {s.bloodGroup ? `🩸 ${s.bloodGroup}` : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button" 
                      onClick={() => handleEdit(s)} 
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-teal-700 hover:border-teal-400 cursor-pointer shadow-2xs transition"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDelete(s.id)} 
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 hover:border-rose-400 cursor-pointer shadow-2xs transition"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
