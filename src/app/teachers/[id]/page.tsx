import { getSchoolData } from "@/lib/dataProvider";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, Droplets, BookOpen, Award } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getSchoolData();
  const teachers = data?.teachers || [];
  const teacher = teachers.find((t: any) => t.id === Number(id));

  if (!teacher) return { title: "শিক্ষক পাওয়া যায়নি" };

  return {
    title: `${teacher.name} (${teacher.designation}) | ${data?.schoolInfo?.name || "বিদ্যালয়"}`,
    description: `${teacher.name} - ${teacher.designation}, বিষয়: ${teacher.subject}।`,
  };
}

export default async function TeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSchoolData();
  const teachers = data?.teachers || [];
  const teacher = teachers.find((t: any) => t.id === Number(id));

  if (!teacher) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <Link 
        href="/teachers"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>সকল শিক্ষকে ফিরে যান</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-md shrink-0 bg-slate-50">
            <SafeImage 
              src={teacher.image} 
              fallbackSrc="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop"
              alt={teacher.name || "শিক্ষক"} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="bg-blue-100 text-blue-900 text-xs px-3 py-0.5 rounded-full font-bold">
                {teacher.customSectionName || (teacher.section === "administration" ? "প্রশাসন ও প্রাতিষ্ঠানিক নেতৃত্ব" : teacher.section === "primary" ? "প্রাথমিক শাখা" : teacher.section === "college" ? "কলেজ শাখা" : "মাধ্যমিক শাখা")}
              </span>
              {teacher.isLeadership && (
                <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  👑 প্রশাসনিক নেতৃত্ব
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{teacher.name}</h1>
            <p className="text-sm font-bold text-blue-600">{teacher.designation}</p>
            {teacher.qualification && <p className="text-xs text-slate-600">🎓 {teacher.qualification}</p>}

            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              {teacher.subject && (
                <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                  বিষয়: {teacher.subject}
                </span>
              )}
              {teacher.bloodGroup && (
                <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>রক্তের গ্রুপ: {teacher.bloodGroup}</span>
                </span>
              )}
              {teacher.joiningDate && (
                <span className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>যোগদান: {teacher.joiningDate}</span>
                </span>
              )}
              {teacher.indexNumber && (
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                  ইনডেক্স: {teacher.indexNumber}
                </span>
              )}
              {teacher.teacherId && (
                <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                  আইডি: {teacher.teacherId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* পরিচিতি ও উক্তি */}
        {teacher.speech && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-sm text-slate-700 italic">
            "{teacher.speech}"
          </div>
        )}

        {teacher.bio && (
          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">জীবনবৃত্তান্ত ও কর্মপরিধি</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{teacher.bio}</p>
          </div>
        )}

        {/* যোগাযোগ ও ঠিকানা */}
        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {teacher.phone && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>ফোন: {teacher.phone}</span>
            </div>
          )}
          {teacher.email && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>ইমেইল: {teacher.email}</span>
            </div>
          )}
          {teacher.address && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl sm:col-span-2 lg:col-span-1">
              <span>📍 ঠিকানা: {teacher.address}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
