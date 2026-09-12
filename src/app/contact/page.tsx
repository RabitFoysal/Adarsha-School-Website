"use client";

import { useState } from "react";
import demoData from "@/data/demoData.json";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare
} from "lucide-react";

export default function ContactPage() {
  const { schoolInfo } = demoData;
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* পেজের হেডার */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>যোগাযোগ ও সহায়তা কেন্দ্র</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          আমাদের সাথে যোগাযোগ করুন
        </h1>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          ভর্তি, শিক্ষা কার্যক্রম কিংবা প্রশাসনিক যেকোনো বিষয়ে তথ্যের জন্য নির্দ্বিধায় যোগাযোগ করতে পারেন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশ: প্রাতিষ্ঠানিক ঠিকানা ও সময়সূচি (৫ কলাম) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              অফিসের ঠিকানা ও তথ্য
            </h3>
            
            {/* ঠিকানা */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">ঠিকানা</h4>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{schoolInfo.contact.address}</p>
              </div>
            </div>

            {/* ফোন নম্বর */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">হটলাইন ও ফোন নম্বর</h4>
                <a href={`tel:${schoolInfo.contact.phone}`} className="text-slate-600 hover:text-blue-600 text-xs mt-0.5 block font-medium">
                  {schoolInfo.contact.phone}
                </a>
              </div>
            </div>

            {/* ইমেইল */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">অফিসিয়াল ইমেইল</h4>
                <a href={`mailto:${schoolInfo.contact.email}`} className="text-slate-600 hover:text-blue-600 text-xs mt-0.5 block font-medium">
                  {schoolInfo.contact.email}
                </a>
              </div>
            </div>

            {/* অফিস সময় */}
            <div className="flex items-start gap-3.5 border-t border-slate-100 pt-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">দাপ্তরিক কর্মঘণ্টা</h4>
                <p className="text-slate-600 text-xs mt-0.5">রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০</p>
                <p className="text-slate-400 text-[11px]">(শুক্রবার ও শনিবার সাপ্তাহিক ছুটি)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশ: অভিভাবক বার্তা পাঠানোর ফর্ম (৭ কলাম) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1">সরাসরি বার্তা পাঠান</h3>
          <p className="text-xs text-slate-500 mb-6">আপনার বার্তা প্রাপ্তির পর আমাদের কর্তৃপক্ষ দ্রুত যোগাযোগ করবে।</p>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</h4>
              <p className="text-xs text-emerald-700">ধন্যবাদ, আপনার সাথে দ্রুত যোগাযোগ করা হবে।</p>
              <button 
                type="button" 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
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
                  placeholder="আপনার বক্তব্য এখানে লিখুন..."
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
    </main>
  );
}
