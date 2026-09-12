import demoData from "@/data/demoData.json";

export default function CommitteePage() {
  const { committee, schoolInfo } = demoData;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">আমাদের পরিচালনা পর্ষদ (Managing Committee)</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
        <p className="text-gray-600 mt-4">{schoolInfo.name} সুপরিচালনায় নিয়োজিত কমিটির সদস্যবৃন্দ</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {committee && committee.map((member: any) => (
          <div key={member.id} className="bg-white rounded-2xl border p-4 text-center hover:shadow-lg transition">
            <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto border" />
            <h4 className="text-lg font-bold text-gray-900 mt-4">{member.name}</h4>
            <p className="text-blue-600 font-medium text-sm">{member.designation}</p>
          </div>
        ))}
      </div>
    </main>
  );
}