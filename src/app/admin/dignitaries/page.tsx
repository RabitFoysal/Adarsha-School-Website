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
  GraduationCap, 
  Award, 
  Landmark, 
  Sparkles, 
  Phone, 
  Mail,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import ImageUploadInput from "@/components/ImageUploadInput";

export default function ManageDignitariesPage() {
  const { data, refreshData } = useAdminData();
  const [dignitaries, setDignitaries] = useState<any[]>(data.dignitaries || []);

  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [roleBadge, setRoleBadge] = useState("");
  const [badgeColor, setBadgeColor] = useState("blue");
  const [organization, setOrganization] = useState(data.schoolInfo?.name || "বিদ্যালয়");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [degrees, setDegrees] = useState("");
  const [achievements, setAchievements] = useState("");
  const [affiliations, setAffiliations] = useState("");
  const [expertise, setExpertise] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tenure, setTenure] = useState("");
  const [experience, setExperience] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [order, setOrder] = useState<number | string>(1);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.dignitaries) {
      setDignitaries(data.dignitaries);
    }
  }, [data.dignitaries]);

  const handleEdit = (d: any) => {
    setEditId(d.id);
    setName(d.name || "");
    setDesignation(d.designation || "");
    setRoleBadge(d.roleBadge || d.designation || "");
    setBadgeColor(d.badgeColor || "blue");
    setOrganization(d.organization || data.schoolInfo?.name || "");
    setImage(d.image || "");
    setBio(d.bio || "");
    setQuote(d.quote || "");
    setDegrees(Array.isArray(d.degrees) ? d.degrees.join("\n") : (d.degrees || ""));
    setAchievements(Array.isArray(d.achievements) ? d.achievements.join("\n") : (d.achievements || ""));
    setAffiliations(Array.isArray(d.affiliations) ? d.affiliations.join("\n") : (d.affiliations || ""));
    setExpertise(Array.isArray(d.expertise) ? d.expertise.join("\n") : (d.expertise || ""));
    setPhone(d.phone || "");
    setEmail(d.email || "");
    setTenure(d.tenure || "");
    setExperience(d.experience || "");
    setSocialLinks(d.socialLinks || "");
    setOrder(d.order !== undefined ? d.order : 1);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setDesignation("");
    setRoleBadge("");
    setBadgeColor("blue");
    setOrganization(data.schoolInfo?.name || "");
    setImage("");
    setBio("");
    setQuote("");
    setDegrees("");
    setAchievements("");
    setAffiliations("");
    setExpertise("");
    setPhone("");
    setEmail("");
    setTenure("");
    setExperience("");
    setSocialLinks("");
    setOrder(dignitaries.length + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      alert("অনুগ্রহ করে নাম এবং পদবি পূরণ করুন।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/dignitaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          name,
          designation,
          roleBadge: roleBadge || designation,
          badgeColor,
          organization,
          image,
          bio,
          quote,
          degrees,
          achievements,
          affiliations,
          expertise,
          phone,
          email,
          tenure,
          experience,
          socialLinks,
          order: Number(order) || 0,
        }),
      });

      if (res.ok) {
        setMessage(editId ? "ব্যক্তিত্বের তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন ব্যক্তিত্ব সফলভাবে যুক্ত হয়েছে!");
        handleCancel();
        await refreshData();
      } else {
        setMessage("সংরক্ষণ ব্যর্থ হয়েছে!");
      }
    } catch {
      setMessage("সার্ভার সমস্যা, সংরক্ষণ ব্যর্থ!");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্যক্তিত্বের তথ্য মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/dignitaries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("সফলভাবে মুছে ফেলা হয়েছে!");
        await refreshData();
      }
    } catch {
      setMessage("মুছে ফেলা ব্যর্থ হয়েছে!");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* পেজ হেডার */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>নেতৃত্ব ও বিশিষ্ট ব্যক্তিবর্গ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            সভাপতি, প্রধান শিক্ষক ও বিশিষ্ট ব্যক্তিত্ব ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            বিদ্যালয়ের শীর্ষ নেতৃত্ব, সভাপতি, প্রধান শিক্ষক, প্রতিষ্ঠাতা ও শিক্ষানুরাগী বিশিষ্ট ব্যক্তিত্বদের প্রোফাইল, ডিগ্রি ও অর্জন এখান থেকে পরিচালনা করুন।
          </p>
        </div>

        {message && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold animate-fadeIn">
            {message}
          </div>
        )}
      </div>

      {/* নতুন যুক্ত / এডিট ফর্ম */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          {editId ? <Edit2 className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
          <span>{editId ? "ব্যক্তিত্বের তথ্য সম্পাদনা করুন" : "নতুন বিশিষ্ট ব্যক্তিত্ব যুক্ত করুন"}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* নাম */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পূর্ণ নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: অধ্যাপক মোহাম্মদ আবু তাহের"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* পদবি */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                প্রাতিষ্ঠানিক পদবি <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="যেমন: সভাপতি, গভর্নিং বডি"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* ভূমিকা ব্যাজ ও রঙ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                কার্ড ব্যাজ ট্যাগ ও থিম রঙ
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roleBadge}
                  onChange={(e) => setRoleBadge(e.target.value)}
                  placeholder="ব্যাজ নাম (যেমন: সভাপতি)"
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
                <select
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="amber">স্বর্ণালী (অ্যাম্বার)</option>
                  <option value="blue">নীল (ব্লু)</option>
                  <option value="emerald">সবুজ (এমারেল্ড)</option>
                  <option value="purple">বেগুনী (পার্পল)</option>
                </select>
              </div>
            </div>

            {/* ছবি আপলোড */}
            <div className="md:col-span-2">
              <ImageUploadInput
                label="ব্যক্তিত্বের ছবি"
                value={image}
                onChange={setImage}
                helpText="পাসপোর্ট বা ফরমাল প্রতিকৃতি ছবি আপলোড করুন"
              />
            </div>

            {/* ফোন নম্বর */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ফোন নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1711-XXXXXX"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* ইমেইল */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ইমেইল এড্রেস</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="president@school.edu.bd"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* দায়িত্বকাল / মেয়াদ */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">দায়িত্বকাল / মেয়াদ</label>
              <input
                type="text"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="যেমন: ২০২৪ - বর্তমান"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* প্রদর্শনের ক্রম / অগ্রাধিকার */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">প্রদর্শনের ক্রম (Order)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="১, ২, ৩..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold"
              />
            </div>

            {/* ফেসবুক / সোশ্যাল মিডিয়া লিঙ্ক */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ফেসবুক / সামাজিক প্রোফাইল লিংক (ঐচ্ছিক)</label>
              <input
                type="url"
                value={socialLinks}
                onChange={(e) => setSocialLinks(e.target.value)}
                placeholder="https://facebook.com/username"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* অনুপ্রেরণাদায়ী উক্তি */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                দিকনির্দেশনামূলক বাণী / উক্তি (Quote)
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="যেমন: নৈতিক শিক্ষা এবং আধুনিক প্রযুক্তিজ্ঞানের সমন্বয়ই পারে একটি জাতিকে বিশ্বমঞ্চে সমাসীন করতে।"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* পূর্ব অভিজ্ঞতা ও কর্মজীবন */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                পূর্ববর্তী কর্মজীবন ও অতীত অভিজ্ঞতা (Experience)
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="যেমন: সাবেক অধ্যক্ষ, ঢাকা সরকারি কলেজ / দীর্ঘ ২৫ বছরের শিক্ষকতা ও শিক্ষা প্রশাসন অভিজ্ঞতা"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* ডিটেইল এ পরিচয় (Bio) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                বিস্তারিত আত্মপরিচয় ও পটভূমি (Bio)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="শিক্ষা ও সামাজিক উন্নয়নে দীর্ঘ অভিজ্ঞতাসম্পন্ন একজন দূরদর্শী সংগঠক..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* শিক্ষাগত ডিগ্রি ও যোগ্যতা (Degrees) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>শিক্ষাগত ডিগ্রি (প্রতি লাইনে বা কমা দিয়ে একটি)</span>
              </label>
              <textarea
                rows={3}
                value={degrees}
                onChange={(e) => setDegrees(e.target.value)}
                placeholder={"এম.এসসি (রসায়ন), ঢাবি\nএম.এড (শিক্ষা প্রশাসন)\nপিএইচডি ফেলো"}
                className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
              />
            </div>

            {/* কি কি করেছেন / বিশেষ অবদান ও অর্জন (Achievements) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>বিশেষ অবদান ও অর্জন (প্রতি লাইনে একটি)</span>
              </label>
              <textarea
                rows={3}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder={"শেখ রাসেল ডিজিটাল ল্যাব স্থাপন\nমেধাবী শিক্ষার্থীদের জন্য ১০০% বৃত্তি তহবিল গঠন\nজেলায় সেরা প্রতিষ্ঠান স্বীকৃতি"}
                className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
              />
            </div>

            {/* আর কোথায় কোথায় যুক্ত আছেন (Affiliations) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>অন্যান্য সংশ্লিষ্টতা ও পদ (প্রতি লাইনে একটি)</span>
              </label>
              <textarea
                rows={3}
                value={affiliations}
                onChange={(e) => setAffiliations(e.target.value)}
                placeholder={"সদস্য, জেলা শিক্ষা উন্নয়ন কমিটি\nসাবেক সহ-সভাপতি, রোটারি ক্লাব\nআজীবন সদস্য, রেড ক্রিসেন্ট"}
                className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
              />
            </div>

            {/* বিশেষ অভিজ্ঞতা ও দক্ষতা (Expertise) */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>বিশেষ দক্ষতা ও অভিজ্ঞতা (কমা বা নতুন লাইনে)</span>
              </label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="যেমন: প্রাতিষ্ঠানিক পলিসি ও উন্নয়ন, শিক্ষক প্রশিক্ষণ, সমাজসেবা, আধুনিক শিক্ষণ-শিখন"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "সংরক্ষণ হচ্ছে..." : editId ? "তথ্য আপডেট করুন" : "নতুন ব্যক্তিত্ব যোগ করুন"}</span>
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
                <span>বাতিল করুন</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* বর্তমান ব্যক্তিত্বদের তালিকা */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900">
            বিদ্যমান ব্যক্তিত্ব ও নেতৃত্বের তালিকা ({dignitaries.length} জন)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            (হোমপেজের &ldquo;নেতৃত্ব ও দিকনির্দেশনা&rdquo; সেকশনে দৃশ্যমান হবে)
          </span>
        </div>

        {dignitaries.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            এখনো কোনো ব্যক্তিত্বের তথ্য যুক্ত করা হয়নি। উপরের ফর্ম ব্যবহার করে যোগ করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dignitaries.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.image || "https://placehold.co/150x150/e2e8f0/1e293b?text=Portrait"}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/150x150/e2e8f0/1e293b?text=Portrait";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-900 mb-1">
                      {item.roleBadge || item.designation}
                    </span>
                    <h3 className="text-base font-black text-slate-900 truncate">{item.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{item.designation}</p>
                    {item.phone && <p className="text-[11px] text-slate-500 mt-0.5">📞 {item.phone}</p>}
                  </div>
                </div>

                {item.degrees && item.degrees.length > 0 && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">ডিগ্রি: </span>
                    <span>{Array.isArray(item.degrees) ? item.degrees.join(" • ") : item.degrees}</span>
                  </div>
                )}

                {item.achievements && item.achievements.length > 0 && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">বিশেষ অর্জন: </span>
                    <span className="line-clamp-2">
                      {Array.isArray(item.achievements) ? item.achievements.join(" | ") : item.achievements}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>সম্পাদনা</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
