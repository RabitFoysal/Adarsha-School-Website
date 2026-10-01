import { getSchoolData } from "@/lib/dataProvider";
import { Briefcase, School, CheckCircle2, Phone, Mail, GraduationCap } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSchoolData();
  const schoolName = data?.schoolInfo?.name || "বিদ্যালয়";

  return {
    title: `কর্মকর্তা ও কর্মচারীবৃন্দ | ${schoolName}`,
    description: `${schoolName}-এর অফিস সহকারী, লাইব্রেরিয়ান ও প্রশাসনিক কর্মচারীদের বিবরণ।`,
    openGraph: {
      title: `কর্মচারীবৃন্দ | ${schoolName}`,
      description: `${schoolName} অফিস ও সহায়ক স্টাফবৃন্দ।`,
    }
  };
}

export default async function StaffPage() {
  const data = await getSchoolData();
  const rawStaff = data?.staff || [];
  const schoolInfo = data?.schoolInfo || {};

  const sortedStaff = [...rawStaff].sort((a: any, b: any) => {
    const orderA = a.order !== undefined ? Number(a.order) : 999;
    const orderB = b.order !== undefined ? Number(b.order) : 999;
    return orderA - orderB;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-teal-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
          <Briefcase className="w-4 h-4 text-teal-600" />
          <span>দাপ্তরিক ও প্রশাসনিক কর্মী</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          কর্মকর্তা ও সহায়ক কর্মচারীবৃন্দ
        </h1>
        <div className="w-20 h-1.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 mx-auto mt-4 rounded-full"></div>
        <p className="text-slate-600 text-sm md:text-base mt-4 leading-relaxed">
          {schoolInfo.name}-এর অফিসিয়াল নথি ব্যবস্থাপনা, লাইব্রেরি সেবা ও প্রশাসনিক কার্যক্রমে নিরলস কর্মী বাহিনী।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedStaff && sortedStaff.map((member: any) => (
          <div 
            key={member.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group relative"
          >
            {/* টপ কালার রিবন */}
            <div className="h-2 w-full bg-gradient-to-r from-teal-600 to-emerald-600"></div>

            <div className="p-6 text-center flex-1 flex flex-col items-center justify-between">
              <div>
                <div className="relative mx-auto mb-4">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-slate-50 border-2 border-slate-200 mx-auto bg-slate-100 shadow-sm">
                    <SafeImage 
                      src={member.image} 
                      fallbackSrc="https://placehold.co/400x400/e2e8f0/1e293b?text=Staff"
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-500" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition">
                    {member.name}
                  </h3>
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                </div>

                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full border bg-teal-50 text-teal-800 border-teal-200 mb-2">
                  {member.designation}
                </span>

                {member.qualification && (
                  <p className="text-[11px] text-slate-600 font-semibold mb-1 flex items-center justify-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                    <span>{member.qualification}</span>
                  </p>
                )}

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                  {member.bio || "বিদ্যালয়ের প্রশাসনিক ও সহায়তামূলক দায়িত্বে বিশ্বস্ততার সাথে নিয়োজিত।"}
                </p>

                {member.phone && (
                  <a 
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-bold bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg mt-3 transition border border-teal-100"
                  >
                    <Phone className="w-3 h-3 text-teal-600" />
                    <span>{member.phone}</span>
                  </a>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3.5 mt-4 w-full flex items-center justify-center gap-1.5 text-slate-400 text-xs font-medium">
                <School className="w-3.5 h-3.5 text-slate-500" />
                <span>{member.department || "দাপ্তরিক বিভাগ"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
