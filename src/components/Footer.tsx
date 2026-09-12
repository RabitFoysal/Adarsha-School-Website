import demoData from "@/data/demoData.json";

export default function Footer() {
  const { schoolInfo } = demoData;
  
  return (
    <footer className="bg-gray-900 text-white py-8 text-center border-t border-gray-800">
      {/* ডাইনামিক কপিরাইট লেখা */}
      <p className="font-semibold">{schoolInfo.copyright || `© ${new Date().getFullYear()} ${schoolInfo.name}`}</p>
      
      {/* ডাইনামিক স্কুলের ঠিকানা */}
      {schoolInfo.contact?.address && (
        <p className="text-gray-400 text-sm mt-2">{schoolInfo.contact.address}</p>
      )}
    </footer>
  );
}