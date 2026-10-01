import { getSchoolData } from "@/lib/dataProvider";
import HomeClientWrapper from "@/components/HomeClientWrapper";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialData = null;
  try {
    initialData = await getSchoolData();
  } catch (error) {
    console.error("Error fetching school data in Server Component:", error);
  }

  const schoolName = initialData?.basicInfo?.name || "বিদ্যালয় তথ্য ও ব্যবস্থাপনা পোর্টাল";

  return (
    <>
      <noscript>
        <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
          <h1>{schoolName}</h1>
          <p>{initialData?.about?.description || "বিদ্যালয়ের অফিসিয়াল ওয়েব পোর্টাল।"}</p>
          <p>EIIN: {initialData?.basicInfo?.eiin || "N/A"} | ফোন: {initialData?.basicInfo?.phone || "N/A"}</p>
        </div>
      </noscript>
      <HomeClientWrapper initialData={initialData} />
    </>
  );
}
