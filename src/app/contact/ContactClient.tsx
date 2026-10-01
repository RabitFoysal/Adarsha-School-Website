"use client";

import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare
} from "lucide-react";

export default function ContactClient({ initialSchoolInfo }: { initialSchoolInfo: any }) {
  const schoolInfo = initialSchoolInfo || {};
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const contactAddress = schoolInfo?.contact?.address || "ঢাকা, বাংলাদেশ";
  const contactPhone = schoolInfo?.contact?.phone || "+880 1234 567890";
  const contactEmail = schoolInfo?.contact?.email || "info@school.edu.bd";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* বাম পাশ: প্রাতিষ্ঠানিক ঠিকানা ও সময়সূচি (৫ কলাম) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            অফিসের ঠিকানা ও তথ্য
          </h3>
          
          {/* ঠিকানা */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">বিদ্যালয়ের ঠিকানা</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">{contactAddress}</p>
            </div>
          </div>

          {/* ফোন নম্বর */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">হটলাইন ও ফোন নম্বর</h4>
              <a href={`tel:${contactPhone}`} className="text-slate-600 hover:text-blue-600 text-xs mt-1 block font-medium">
                {contactPhone}
              </a>
            </div>
          </div>

          {/* ইমেইল */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">অফিসিয়াল ইমেইল</h4>
              <a href={`mailto:${contactEmail}`} className="text-slate-600 hover:text-blue-600 text-xs mt-1 block font-medium">
                {contactEmail}
              </a>
            </div>
          </div>

          {/* অফিস সময় */}
          <div className="flex items-start gap-4 border-t border-slate-100 pt-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">দাপ্তরিক কর্মঘণ্টা</h4>
              <p className="text-slate-600 text-xs mt-1">রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০</p>
              <p className="text-slate-400 text-[11px] mt-0.5">(শুক্রবার ও শনিবার সাপ্তাহিক ছুটি)</p>
            </div>
          </div>
        </div>
      </div>

      {/* ডান পাশ: অভিভাবক বার্তা পাঠানোর ফর্ম (৭ কলাম) */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1">সরাসরি বার্তা পাঠান</h3>
        <p className="text-xs text-slate-500 mb-6">আপনার বার্তা বা অনুসন্ধান প্রাপ্তির পর আমাদের কর্তৃপক্ষ দ্রুত যোগাযোগ করবে।</p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</h4>
            <p className="text-xs text-emerald-700">ধন্যবাদ, আপনার বার্তার প্রেক্ষিতে সংশ্লিষ্ট শাখা থেকে দ্রুত যোগাযোগ করা হবে।</p>
            <button 
              type="button" 
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
            >
              আরেকটি বার্তা পাঠান
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">আপনার পূর্ণ নাম *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50 outline-none transition" 
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">মোবাইল নম্বর *</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50 outline-none transition" 
                  placeholder="০১৭১২-XXXXXX" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">ইমেইল এড্রেস (ঐচ্ছিক)</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50 outline-none transition" 
                placeholder="example@mail.com" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">আপনার বার্তা বা অনুসন্ধান *</label>
              <textarea 
                rows={4} 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:bg-white bg-slate-50 outline-none transition" 
                placeholder="ভর্তি, ফি, ফলাফল বা বিদ্যালয়ের অন্য যেকোনো বিষয়..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition duration-300 shadow-sm cursor-pointer text-xs md:text-sm"
            >
              <Send className="w-4 h-4" />
              <span>বার্তা পাঠান</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
