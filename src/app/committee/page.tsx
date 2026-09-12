import demoData from "@/data/demoData.json";
import { ShieldCheck, Award, School, CheckCircle2 } from "lucide-react";

export default function CommitteePage() {
  const { committee, schoolInfo } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <Award className="w-4 h-4 text-amber-600" />
          <span>পরিচালনা পর্ষদ</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          ম্যানেজিং কমিটি (Managing Committee)
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolInfo.name}-এর সার্বিক নীতি নির্ধারণ, প্রশাসনিক স্বচ্ছতা ও অবকাঠামো উন্নয়নে দায়িত্বশীল সম্মানিত সদস্যবৃন্দ।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {committee && committee.map((member: any) => {
          const isPresident = member.designation.includes("সভাপতি");
          return (
            <div 
              key={member.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group relative"
            >
              {/* আলংকারিক টপ বর্ডার */}
              <div className={`h-2.5 w-full ${isPresident ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}></div>

              <div className="p-6 text-center flex-1 flex flex-col items-center justify-between">
                <div>
                  {/* পোর্ট্রেট ছবি ফ্রেম */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 border-2 border-slate-200 mx-auto bg-slate-100 shadow-sm">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-108 transition duration-500" 
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>

                  {/* নাম ও পদবি */}
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition">
                      {member.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>

                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                    isPresident 
                      ? "bg-amber-50 text-amber-800 border-amber-200" 
                      : "bg-blue-50 text-blue-800 border-blue-200"
                  } mb-3`}>
                    {member.designation}
                  </span>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    বিদ্যালয়ের উন্নয়ন ও শিক্ষার্থীদের কল্যাণে সক্রিয়ভাবে নিয়োজিত।
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3.5 mt-4 w-full flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span>কার্যনির্বাহী পরিষদ</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
