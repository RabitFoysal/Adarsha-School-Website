"use client";

import { useState } from "react";
import { 
  Award, 
  GraduationCap, 
  Users, 
  Send, 
  CheckCircle2, 
  Quote, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles,
  Calendar,
  Heart
} from "lucide-react";

interface AlumniMember {
  id: string | number;
  name: string;
  batch: string;
  photo?: string;
  currentDesignation: string;
  achievements?: string;
  quote?: string;
}

export default function AlumniClient({
  initialAlumni,
  schoolInfo
}: {
  initialAlumni: AlumniMember[];
  schoolInfo: any;
}) {
  const [alumniList] = useState<AlumniMember[]>(initialAlumni || []);
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    phone: "",
    email: "",
    occupation: "",
    currentAddress: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const schoolName = schoolInfo?.name || "আমাদের বিদ্যাপীঠ";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/alumni/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          batch: "",
          phone: "",
          email: "",
          occupation: "",
          currentAddress: "",
          message: ""
        });
      } else {
        setErrorMessage(json.error || "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      }
    } catch {
      setErrorMessage("নেটওয়ার্ক সমস্যা! অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* ১. কৃতি শিক্ষার্থী গ্যালারি (Hall of Fame) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>হল অব ফেম (Hall of Fame)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              বিদ্যালয়ের গর্বিত কৃতি শিক্ষার্থীবৃন্দ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              যাদের মেধা ও সাফল্য দেশ ও জাতির কল্যাণে অনন্য অবদান রেখে চলেছে
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            মোট কৃতি অ্যালামনাই: {alumniList.length} জন
          </span>
        </div>

        {alumniList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alumniList.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* ব্যাকগ্রাউন্ড হালকা আভা */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-50 transition duration-500"></div>

                <div className="relative">
                  {/* ছবি ও ব্যাচ */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-600/20 group-hover:ring-blue-600 transition duration-300 shrink-0 bg-slate-100">
                      <img
                        src={person.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                    </div>
                    <div>
                      <span className="inline-block bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200/60 mb-1">
                        {person.batch}
                      </span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition leading-snug">
                        {person.name}
                      </h3>
                    </div>
                  </div>

                  {/* পেশা ও অর্জন */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                      <Briefcase className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{person.currentDesignation}</span>
                    </div>
                    {person.achievements && (
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{person.achievements}</span>
                      </div>
                    )}
                  </div>

                  {/* উক্তি */}
                  {person.quote && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 relative text-xs text-slate-600 italic leading-relaxed">
                      <Quote className="w-3.5 h-3.5 text-slate-300 absolute top-2 right-2" />
                      "{person.quote}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">শীঘ্রই কৃতি শিক্ষার্থীদের তালিকা হালনাগাদ করা হবে</p>
          </div>
        )}
      </section>

      {/* ২. অ্যালামনাই রেজিস্ট্রেশন ফর্ম ও পুনর্মিলনী ব্যানার */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* বাম পাশ: নেটওয়ার্ক আহ্বান ও তথ্য (৫ কলাম) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 mb-6">
              <GraduationCap className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black mb-3 leading-snug">
              আপনি কি {schoolName}-এর প্রাক্তন শিক্ষার্থী?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6">
              আপনার স্মৃতিবিজড়িত প্রিয় প্রাঙ্গণের সাথে আজই যুক্ত হোন। স্কুলের ভবিষ্যৎ প্রজন্মের দিকনির্দেশনা ও সার্বিক উন্নয়নে আপনার অংশগ্রহণ আমাদের জন্য অত্যন্ত গর্বের।
            </p>

            <div className="space-y-3 border-t border-blue-800/80 pt-6 text-xs text-blue-200">
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                <span>বার্ষিক অ্যালামনাই রিইউনিয়ন ও পুনর্মিলনীতে আমন্ত্রণ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>অ্যালামনাই নেটওয়ার্ক ডিরেক্টরিতে অন্তর্ভুক্তি</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>বর্তমান শিক্ষার্থীদের জন্য মেন্টরশিপ ও ক্যারিয়ার গাইডেন্স</span>
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশ: অনলাইন রেজিস্ট্রেশন ফর্ম (৭ কলাম) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              অ্যালামনাই রেজিস্ট্রেশন ফর্ম
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            ফর্মটি পূরণ করে বিদ্যালয়ের প্রাক্তন শিক্ষার্থী নেটওয়ার্কে আপনার নাম তালিকাভুক্ত করুন।
          </p>

          {submitSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">ধন্যবাদ! রেজিস্ট্রেশন সম্পন্ন হয়েছে</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                আপনার তথ্য বিদ্যালয়ের প্রাক্তন শিক্ষার্থী ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে। পরবর্তী পুনর্মিলনী ও অনুষ্ঠান সম্পর্কে আপনার সাথে যোগাযোগ করা হবে।
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                আরেকটি তথ্য যুক্ত করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="যেমন: ইঞ্জিনিয়ার মাহমুদ হাসান"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">পাসের সন / ব্যাচ *</label>
                  <input
                    type="text"
                    required
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="যেমন: এসএসসি ২০১০ ব্যাচ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="০১৭১২-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="alumni@mail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">বর্তমান পেশা ও পদবি</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="যেমন: ব্যাংক কর্মকর্তা / শিক্ষক / প্রকৌশলী"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">বর্তমান কর্মস্থল বা ঠিকানা</label>
                  <input
                    type="text"
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                    placeholder="যেমন: ঢাকা, বাংলাদেশ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">বিদ্যালয়ের উদ্দেশ্যে আপনার স্মৃতিচারণ বা বার্তা</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                  placeholder="বিদ্যালয়ের প্রতি শুভকামনা বা আপনার অনুভূতি..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 px-8 rounded-xl transition duration-300 shadow-sm cursor-pointer text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "সংরক্ষণ করা হচ্ছে..." : "অ্যালামনাই হিসেবে যুক্ত হোন"}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
