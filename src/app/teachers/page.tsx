"use client";

import { useState } from "react";
import demoData from "@/data/demoData.json";
import { 
  Users, 
  Search, 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  School,
  ArrowRight
} from "lucide-react";

export default function TeachersPage() {
  const { teachers, schoolInfo } = demoData;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = [
    { id: "all", name: "সকল শিক্ষক" },
    { id: "admin", name: "প্রশাসন" },
    { id: "math", name: "গণিত ও বিজ্ঞান" },
    { id: "language", name: "ভাষা ও সাহিত্য" },
  ];

  const filteredTeachers = (teachers || []).filter((teacher: any) => {
    const matchesSearch = 
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedDepartment === "admin") {
      return teacher.designation.includes("প্রধান") || teacher.designation.includes("ভারপ্রাপ্ত");
    }
    if (selectedDepartment === "math") {
      return teacher.designation.includes("গণিত") || teacher.designation.includes("বিজ্ঞান");
    }
    if (selectedDepartment === "language") {
      return teacher.designation.includes("ইংরেজি") || teacher.designation.includes("বাংলা");
    }
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      
      {/* প্রিমিয়াম হেডার */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>অনুষদ ও শিক্ষকমণ্ডলী</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          আমাদের নিবেদিতপ্রাণ শিক্ষকবৃন্দ
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolInfo.name}-এর দক্ষ, অভিজ্ঞ ও স্নেহশীল শিক্ষকমণ্ডলী যারা ভবিষ্যৎ প্রজন্ম গঠনে নিরলসভাবে জ্ঞান বিতরণ করে যাচ্ছেন।
        </p>

        {/* সার্চ ও ক্যাটাগরি ফিল্টার */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="শিক্ষকের নাম বা পদবি দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs transition"
            />
          </div>
        </div>

        {/* ডিপার্টমেন্ট ফিল্টার পিলস */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-200 border ${
                selectedDepartment === dept.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* শিক্ষকদের আধুনিক কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTeachers.map((teacher: any) => {
          const isLeader = teacher.designation.includes("প্রধান শিক্ষক");
          const dept = teacher.designation.includes("গণিত") 
            ? "গণিত বিভাগ" 
            : teacher.designation.includes("ইংরেজি") 
            ? "ইংরেজি বিভাগ" 
            : teacher.designation.includes("বিজ্ঞান")
            ? "বিজ্ঞান বিভাগ"
            : teacher.designation.includes("বাংলা")
            ? "বাংলা বিভাগ"
            : "একাডেমিক বিভাগ";

          return (
            <div 
              key={teacher.id} 
              className="bg-white rounded-3xl border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group relative"
            >
              {/* টপ কালার রিবন */}
              <div className={`h-2.5 w-full ${isLeader ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500"}`}></div>

              {/* ফটো এরিয়া */}
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  src={teacher.image} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition duration-500"
                />
                
                {/* নরম ওভারলে */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-95 transition duration-300"></div>

                {/* স্ট্যাটাস ও বিভাগ ব্যাজ (ফ্লোটিং) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                    isLeader 
                      ? "bg-amber-500 text-white" 
                      : "bg-slate-900/80 text-white"
                  }`}>
                    {isLeader ? <Award className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                    <span>{isLeader ? "★ প্রধান শিক্ষক" : "অনুষদ সদস্য"}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                    {dept}
                  </span>
                </div>

                {/* নামের ওভারলে (মোবাইল ও বড় পর্দায় স্পষ্টতার জন্য) */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-black truncate group-hover:text-blue-200 transition">{teacher.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-xs text-blue-100 font-medium truncate mt-0.5">{teacher.designation}</p>
                </div>
              </div>
              
              {/* বডি ইনফরমেশন */}
              <div className="p-4.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                      {dept}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      সক্রিয়
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    শিক্ষার্থীদের পাঠদানে অভিজ্ঞ এবং প্রাতিষ্ঠানিক সহশিক্ষা কার্যক্রমে বিশেষ অবদান রাখছেন।
                  </p>
                </div>
                
                {/* কার্ডের ফুটার অ্যাকশন */}
                <div className="border-t border-slate-100 pt-3.5 mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-[130px]">{schoolInfo.name}</span>
                  </div>

                  <span className="text-xs font-black text-blue-700 group-hover:text-blue-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>প্রোফাইল</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 max-w-md mx-auto shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-base text-slate-700">কোনো শিক্ষক পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 mt-1">অনুগ্রহ করে ভিন্ন নাম বা পদবি দিয়ে অনুসন্ধান করুন।</p>
        </div>
      )}

    </main>
  );
}
