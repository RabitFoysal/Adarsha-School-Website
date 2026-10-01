import { getSchoolData } from "@/lib/dataProvider";
import { ShieldCheck, Award, School, CheckCircle2, Phone, Calendar, Briefcase, GraduationCap } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `ম্যানেজিং কমিটি | ${schoolName}`,
    description: `${schoolName}-এর পরিচালনা পর্ষদের সম্মানিত সভাপতি, সদস্যবৃন্দ ও পরিচালনা কমিটির বিবরণ।`,
    openGraph: {
      title: `পরিচালনা পর্ষদ | ${schoolName}`,
      description: `${schoolName} ম্যানেজিং কমিটি।`,
    }
  };
}

export default async function CommitteePage() {
  const data = await getSchoolData();
  const rawCommittee = data?.committee || [];
  const schoolInfo = data?.schoolInfo || {};

  const sortedCommittee = [...rawCommittee].sort((a: any, b: any) => {
    const orderA = a.order !== undefined ? Number(a.order) : 999;
    const orderB = b.order !== undefined ? Number(b.order) : 999;
    return orderA - orderB;
  });

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
        {sortedCommittee && sortedCommittee.map((member: any) => {
          const isPresident = member.designation && member.designation.includes("সভাপতি");
          return (
            <div 
              key={member.id} 
              className={`bg-white rounded-3xl border shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group relative ${
                isPresident ? "border-amber-300 ring-1 ring-amber-300/60" : "border-slate-200"
              }`}
            >
              {/* আলংকারিক টপ বর্ডার */}
              <div className={`h-2.5 w-full ${isPresident ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}></div>

              <div className="p-6 text-center flex-1 flex flex-col items-center justify-between">
                <div>
                  {/* পোর্ট্রেট ছবি ফ্রেম */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 border-2 border-slate-200 mx-auto bg-slate-100 shadow-sm">
                      <SafeImage 
                        src={member.image} 
                        fallbackSrc="https://placehold.co/400x400/e2e8f0/1e293b?text=Member"
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
                      ? "bg-amber-100 text-amber-900 border-amber-300 font-extrabold" 
                      : "bg-blue-50 text-blue-800 border-blue-200"
                  } mb-2`}>
                    {member.designation}
                  </span>

                  {member.tenure && (
                    <p className="text-[11px] text-slate-500 font-medium mb-1 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{member.tenure}</span>
                    </p>
                  )}

                  {member.qualification && (
                    <p className="text-[11px] text-slate-600 font-medium mb-1 flex items-center justify-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>{member.qualification}</span>
                    </p>
                  )}

                  {member.occupation && (
                    <p className="text-[11px] text-slate-600 font-semibold mb-2 flex items-center justify-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{member.occupation}</span>
                    </p>
                  )}

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {member.bio || "বিদ্যালয়ের সার্বিক নীতি নির্ধারণ ও অবকাঠামোগত উন্নয়নে নিবেদিতপ্রাণ।"}
                  </p>

                  {member.phone && (
                    <a 
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg mt-3 transition border border-amber-200"
                    >
                      <Phone className="w-3 h-3 text-amber-600" />
                      <span>{member.phone}</span>
                    </a>
                  )}
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
