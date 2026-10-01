"use client";

import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ExternalLink, 
  FileText, 
  FolderPlus, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Info,
  Link as LinkIcon
} from "lucide-react";

interface SubItem {
  id: string | number;
  name: string;
  url?: string;
  content?: string;
}

interface DirectorySection {
  id: string | number;
  title: string;
  items: SubItem[];
}

export default function ManageDirectoryPage() {
  const { data, refreshData } = useAdminData();
  const [sections, setSections] = useState<DirectorySection[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // সেকশন অ্যাড/এডিট স্টেট
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | number | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");

  // সাব-সেকশন (আইটেম) অ্যাড/এডিট স্টেট
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string | number | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | number | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [itemContent, setItemContent] = useState("");

  // এক্সপ্যান্ডেড সেকশন ট্র্যাকিং
  const [expandedSections, setExpandedSections] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    if (data.directory && Array.isArray(data.directory) && data.directory.length > 0) {
      // যদি ডাটাতে সাব-আইটেম থাকে
      const formatted: DirectorySection[] = data.directory.map((sec: any, idx: number) => {
        if (sec.items && Array.isArray(sec.items)) {
          return {
            id: sec.id || `sec_${idx}_${Date.now()}`,
            title: sec.title || `সেকশন ${idx + 1}`,
            items: sec.items.map((it: any, iIdx: number) => ({
              id: it.id || `item_${iIdx}_${Date.now()}`,
              name: it.name || it.title || `আইটেম ${iIdx + 1}`,
              url: it.url || it.link || "",
              content: it.content || it.description || ""
            }))
          };
        } else {
          // পূর্বের ফ্ল্যাট ডাটা হলে স্বয়ংক্রিয়ভাবে সেকশনে কনভার্ট
          return {
            id: sec.id || `sec_${idx}`,
            title: sec.title || "সাধারণ তথ্য",
            items: [
              {
                id: sec.id ? `item_${sec.id}` : Date.now(),
                name: sec.title || "তথ্য লিঙ্ক",
                url: sec.link || "",
                content: sec.description || ""
              }
            ]
          };
        }
      });
      setSections(formatted);
      // ডিফল্টভাবে সব সেকশন খোলা থাকবে
      const expandMap: Record<string | number, boolean> = {};
      formatted.forEach((s) => { expandMap[s.id] = true; });
      setExpandedSections(expandMap);
    } else {
      // ডিফল্ট ইনিশিয়াল স্ট্রাকচার
      const defaultData: DirectorySection[] = [
        {
          id: "academics",
          title: "একাডেমিক তথ্য",
          items: [
            { id: "syllabus", name: "সিলেবাস", url: "/academics", content: "আমাদের বিদ্যালয়ের শ্রেণিভিত্তিক বার্ষিক ও অর্ধবার্ষিক পরীক্ষার সিলেবাস ও পাঠ্যক্রম ডাউনলোড করুন।" },
            { id: "routine", name: "ক্লাস রুটিন", url: "/academics", content: "সকল শ্রেণির হালনাগাদ ক্লাসের সময়সূচি ও সাপ্তাহিক রুটিন।" },
            { id: "results", name: "পরীক্ষার ফলাফল", url: "", content: "বিদ্যালয়ের অভ্যন্তরীণ পরীক্ষা ও পাবলিক পরীক্ষার ফলাফল এখানে নিয়মিত প্রকাশ করা হয়।" }
          ]
        },
        {
          id: "admission",
          title: "ভর্তি তথ্য",
          items: [
            { id: "rules", name: "ভর্তির নিয়মাবলী", url: "/admission-info", content: "নতুন শিক্ষাবর্ষে প্রথম শ্রেণি থেকে নবম শ্রেণিতে ভর্তির যোগ্যতা, শর্ত ও আবেদন পদ্ধতি।" },
            { id: "fees", name: "বেতন ও ফি", url: "/fees-payment", content: "শ্রেণিভিত্তিক মাসিক বেতন, পরীক্ষার ফি ও ভর্তি ফি এর বিবরণ।" },
            { id: "prospectus", name: "প্রসপেক্টাস", url: "", content: "বিদ্যালয়ের সার্বিক পরিচিতি ও ভর্তি নির্দেশিকা পুস্তিকা।" }
          ]
        }
      ];
      setSections(defaultData);
      setExpandedSections({ academics: true, admission: true });
    }
  }, [data.directory]);

  const toggleExpand = (secId: string | number) => {
    setExpandedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  // সেকশন হ্যান্ডলার
  const openNewSectionModal = () => {
    setEditingSectionId(null);
    setSectionTitle("");
    setSectionModalOpen(true);
  };

  const openEditSectionModal = (sec: DirectorySection) => {
    setEditingSectionId(sec.id);
    setSectionTitle(sec.title);
    setSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;

    let updated: DirectorySection[];
    if (editingSectionId) {
      updated = sections.map((s) => (s.id === editingSectionId ? { ...s, title: sectionTitle } : s));
    } else {
      const newId = `sec_${Date.now()}`;
      updated = [...sections, { id: newId, title: sectionTitle, items: [] }];
      setExpandedSections((prev) => ({ ...prev, [newId]: true }));
    }
    setSections(updated);
    setSectionModalOpen(false);
    saveToServer(updated);
  };

  const handleDeleteSection = (secId: string | number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই সম্পূর্ণ সেকশন এবং এর ভেতরের সকল সাব-সেকশন মুছে ফেলতে চান?")) return;
    const updated = sections.filter((s) => s.id !== secId);
    setSections(updated);
    saveToServer(updated);
  };

  // সাব-সেকশন হ্যান্ডলার
  const openNewItemModal = (secId: string | number) => {
    setTargetSectionId(secId);
    setEditingItemId(null);
    setItemName("");
    setItemUrl("");
    setItemContent("");
    setItemModalOpen(true);
  };

  const openEditItemModal = (secId: string | number, item: SubItem) => {
    setTargetSectionId(secId);
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemUrl(item.url || "");
    setItemContent(item.content || "");
    setItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !targetSectionId) return;

    const updated = sections.map((sec) => {
      if (sec.id !== targetSectionId) return sec;

      let newItems: SubItem[];
      if (editingItemId) {
        newItems = sec.items.map((it) =>
          it.id === editingItemId
            ? { ...it, name: itemName, url: itemUrl.trim(), content: itemContent.trim() }
            : it
        );
      } else {
        const newItem: SubItem = {
          id: `item_${Date.now()}`,
          name: itemName,
          url: itemUrl.trim(),
          content: itemContent.trim()
        };
        newItems = [...sec.items, newItem];
      }
      return { ...sec, items: newItems };
    });

    setSections(updated);
    setItemModalOpen(false);
    saveToServer(updated);
  };

  const handleDeleteItem = (secId: string | number, itemId: string | number) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই সাব-সেকশনটি মুছে ফেলতে চান?")) return;
    const updated = sections.map((sec) => {
      if (sec.id !== secId) return sec;
      return { ...sec, items: sec.items.filter((it) => it.id !== itemId) };
    });
    setSections(updated);
    saveToServer(updated);
  };

  // সার্ভার সংরক্ষণ
  const saveToServer = async (latestSections: DirectorySection[]) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directory: latestSections }),
      });

      if (res.ok) {
        setMessage("তথ্য ডিরেক্টরি সফলভাবে আপডেট ও সংরক্ষিত হয়েছে! (ডেমো ডাটা ১০০% রিপ্লেস)");
        refreshData();
      } else {
        setError("সংরক্ষণ ব্যর্থ হয়েছে!");
      }
    } catch {
      setError("নেটওয়ার্ক সংযোগ ত্রুটি!");
    }

    setLoading(false);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* শীর্ষ হেডার ও ব্রিফ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-1 border border-blue-100">
            <FolderTree className="w-3.5 h-3.5 text-blue-600" />
            <span>হোমপেজ তথ্য কেন্দ্র ও ডিরেক্টরি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            তথ্য ডিরেক্টরি ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            এখানে মূল সেকশন (যেমন: একাডেমিক তথ্য, ভর্তি তথ্য) এবং তার অধীনে সাব-সেকশন তৈরি করুন। 
            সাব-সেকশনে কাস্টম পেজের লিঙ্ক দিতে পারেন; অথবা লিঙ্ক না দিলে বিবরণের ঘরে যা লিখবেন ভিজিটররা ক্লিক করলে সেই বিস্তারিত বিবরণী দেখতে পাবে।
          </p>
        </div>

        <button
          onClick={openNewSectionModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <FolderPlus className="w-4 h-4" />
          <span>+ নতুন মূল সেকশন তৈরি</span>
        </button>
      </div>

      {/* নোটিফিকেশন মেসেজ */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* গাইডলাইন টিপস */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">ব্যবহারবিধি ও নিয়মাবলী:</p>
          <p className="text-amber-800 leading-relaxed">
            ১. প্রতিটি সেকশনের অধীনে যত খুশি সাব-সেকশন বা পেজ যুক্ত করতে পারেন।<br/>
            ২. যদি কোনো সাব-সেকশনে <strong>কাস্টম পেজ লিঙ্ক (URL)</strong> দেওয়া থাকে (যেমন: <code className="bg-amber-100 px-1 py-0.5 rounded">/academics</code> বা <code className="bg-amber-100 px-1 py-0.5 rounded">/admission-info</code>), তবে ভিজিটররা সরাসরি সেই লিঙ্কে চলে যাবে।<br/>
            ৩. যদি কোনো লিঙ্ক <strong>না দেওয়া হয়</strong>, তবে <strong>বিস্তারিত বিবরণ</strong> ফিল্ডে আপনি যা লিখবেন, ভিজিটররা ক্লিক করলে স্বয়ংক্রিয়ভাবে একটি আকর্ষণীয় পেজে সেই বিবরণ পাঠ করতে পারবে।
          </p>
        </div>
      </div>

      {/* সেকশন এবং সাব-সেকশন লিস্ট */}
      <div className="space-y-5">
        {sections.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <FolderTree className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">কোনো তথ্য সেকশন পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              হোমপেজে তথ্য ডিরেক্টরি সাজাতে উপরে &quot;+ নতুন মূল সেকশন তৈরি&quot; বোতামে ক্লিক করে প্রথম সেকশনটি যুক্ত করুন।
            </p>
            <button
              onClick={openNewSectionModal}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>সেকশন তৈরি করুন</span>
            </button>
          </div>
        ) : (
          sections.map((section, sIdx) => {
            const isExpanded = expandedSections[section.id] !== false;
            return (
              <div 
                key={section.id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* সেকশন হেডার বার */}
                <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer transition"
                      title={isExpanded ? "সংকুচিত করুন" : "প্রসারিত করুন"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                        {section.title}
                      </h3>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full shrink-0">
                        {section.items?.length || 0}টি সাব-সেকশন
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openNewItemModal(section.id)}
                      className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">সাব-সেকশন যোগ</span>
                    </button>
                    <button
                      onClick={() => openEditSectionModal(section)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                      title="সেকশন শিরোনাম এডিট"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                      title="সেকশন মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* সাব-সেকশনগুলোর তালিকা (যদি প্রসারিত থাকে) */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-3 bg-white">
                    {section.items && section.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {section.items.map((item) => {
                          const hasUrl = item.url && item.url.trim() !== "";
                          return (
                            <div 
                              key={item.id}
                              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-start justify-between gap-3 group"
                            >
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-900 truncate">
                                    {item.name}
                                  </h4>
                                  {hasUrl ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                                      <LinkIcon className="w-2.5 h-2.5 text-emerald-600" />
                                      <span>কাস্টম লিঙ্ক</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded shrink-0">
                                      <FileText className="w-2.5 h-2.5 text-purple-600" />
                                      <span>বিবরণ পেজ</span>
                                    </span>
                                  )}
                                </div>

                                {hasUrl ? (
                                  <p className="text-xs text-blue-600 truncate font-medium flex items-center gap-1">
                                    <span>লিঙ্ক: {item.url}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {item.content || "(কোনো বিবরণ দেওয়া হয়নি - ডিফল্ট বার্তা প্রদর্শিত হবে)"}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                <button
                                  onClick={() => openEditItemModal(section.id, item)}
                                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-blue-600 cursor-pointer shadow-2xs transition"
                                  title="সম্পাদনা করুন"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(section.id, item.id)}
                                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-300 text-rose-600 cursor-pointer shadow-2xs transition"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <p className="text-xs text-slate-500 font-medium">এই সেকশনে এখনও কোনো সাব-সেকশন নেই।</p>
                        <button
                          onClick={() => openNewItemModal(section.id)}
                          className="mt-2 text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>প্রথম সাব-সেকশন যোগ করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* সেকশন তৈরি/এডিট মডাল */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingSectionId ? "মূল সেকশন সম্পাদনা" : "নতুন মূল সেকশন তৈরি"}
              </h3>
              <button onClick={() => setSectionModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সেকশন শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="যেমন: একাডেমিক তথ্য / ভর্তি তথ্য / পরীক্ষা কেন্দ্র"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* সাব-সেকশন (আইটেম) তৈরি/এডিট মডাল */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingItemId ? "সাব-সেকশন সম্পাদনা" : "নতুন সাব-সেকশন যোগ করুন"}
                </h3>
                <p className="text-[11px] text-slate-400">
                  সেকশন: {sections.find((s) => s.id === targetSectionId)?.title}
                </p>
              </div>
              <button onClick={() => setItemModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সাব-সেকশন / আইটেম নাম *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="যেমন: সিলেবাস / ক্লাস রুটিন / প্রসপেক্টাস"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কাস্টম পেজ লিঙ্ক (URL) — <span className="text-slate-400 font-normal">ঐচ্ছিক</span>
                </label>
                <input
                  type="text"
                  value={itemUrl}
                  onChange={(e) => setItemUrl(e.target.value)}
                  placeholder="যেমন: /academics বা /custom-pages/rules বা খালি রাখুন"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  লিঙ্ক দিলে ব্যবহারকারী সরাসরি সেই পেজে চলে যাবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিস্তারিত বিবরণ — <span className="text-blue-600 font-semibold">লিঙ্ক না দিলে এটি প্রদর্শিত হবে</span>
                </label>
                <textarea
                  rows={5}
                  value={itemContent}
                  onChange={(e) => setItemContent(e.target.value)}
                  placeholder="এই বিষয়ের বিস্তারিত তথ্য লিখুন। ব্যবহারকারী ক্লিক করলে একটি চমৎকার ডায়নামিক পেজে এই বিবরণ দেখতে পাবে..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  উপরে লিঙ্ক না থাকলে, ব্যবহারকারী ক্লিক করলে স্বয়ংক্রিয়ভাবে একটি ডেডিকেটেড পেজে এই বিবরণটি পাঠ করতে পারবে।
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingItemId ? "আপডেট করুন" : "যোগ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
