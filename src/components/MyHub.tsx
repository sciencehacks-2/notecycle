import React, { useState } from "react";
import { BookOpen, Download, AlertCircle, Bookmark, History, ClipboardCheck, CheckSquare, Square, Edit, Check } from "lucide-react";
import { Note } from "../types";
import { SUBJECT_COLORS } from "../data";
import { Language, translations } from "../translations";

interface MyHubProps {
  purchasedNotes: Note[];
  listedNotes: Note[];
  balance: number;
  lang: Language;
}

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export default function MyHub({
  purchasedNotes,
  listedNotes,
  balance,
  lang
}: MyHubProps) {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<"purchases" | "earnings">("purchases");
  const [selectedPurchasedNote, setSelectedPurchasedNote] = useState<Note | null>(purchasedNotes[0] || null);

  // Fallback to select first available note if state goes out of sync
  React.useEffect(() => {
    if (purchasedNotes.length > 0 && (!selectedPurchasedNote || !purchasedNotes.some(n => n.id === selectedPurchasedNote.id))) {
      setSelectedPurchasedNote(purchasedNotes[0]);
    }
  }, [purchasedNotes, selectedPurchasedNote]);

  // Dynamic checklists
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>({
    "1": [
      { id: "c1", text: lang === "en" ? "Parse all recursion stack tracebacks" : "সব রিকার্সন স্ট্যাক ট্রেসব্যাক বিশ্লেষণ করা", done: true },
      { id: "c2", text: lang === "en" ? "Complete BST pre-order traversals equations chart" : "BST প্রি-অর্ডার ট্রাভার্সাল সমীকরণ তালিকা সম্পন্ন করা", done: false },
      { id: "c3", text: lang === "en" ? "Test backtracking recursive templates against local compiler" : "লোকাল কম্পাইলার দিয়ে ব্যাকট্র্যাকিং রিকার্সিভ কোড টেস্ট করা", done: false }
    ],
    "2": [
      { id: "c4", text: lang === "en" ? "Memorize endocrine loops feedback loops" : "অন্তঃস্রাবী লুপ এবং ফিডব্যাক লুপ মুখস্থ করা", done: true },
      { id: "c5", text: lang === "en" ? "Re-draw Krebs / cellular respiration pathway diagrams on paper" : "কাগজে ক্রেবস চক্র/কোষীয় শ্বসন পথ ডায়াগ্রাম আঁকা", done: true },
      { id: "c6", text: lang === "en" ? "Draft comprehensive thyroid controls flashcards" : "থাইরয়েড নিয়ন্ত্রণ ফ্ল্যাশকার্ড ড্রাফ্ট করা", done: false }
    ]
  });

  const [newChecklistText, setNewChecklistText] = useState("");
  const [studyNotePad, setStudyNotePad] = useState<Record<string, string>>({
    "1": lang === "en" ? "Alex Rivers' code recursive backtrack format is a goldmine." : "অ্যালিক্স রিভার্সের কোড রিকার্সিভ ব্যাকট্র্যাক ফর্ম্যাটটি খুব কাজের।",
    "2": lang === "en" ? "Krebs yields 32 net ATP in total calculations." : "ক্রেবস চক্রে মোট গণনা অনুযায়ী ৩২টি নেট এটিপি পাওয়া যায়।",
  });

  const [activeNoteText, setActiveNoteText] = useState("");

  // Keep note text synced with selection
  React.useEffect(() => {
    if (selectedPurchasedNote) {
      setActiveNoteText(studyNotePad[selectedPurchasedNote.id] || "");
    }
  }, [selectedPurchasedNote, studyNotePad]);

  const toggleChecklist = (noteId: string, itemId: string) => {
    const list = checklists[noteId] || [];
    const updated = list.map((item) => 
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setChecklists({
      ...checklists,
      [noteId]: updated
    });
  };

  const handleAddChecklistItem = (noteId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: `check-${Date.now()}`,
      text: newChecklistText,
      done: false
    };

    const currentList = checklists[noteId] || [];
    setChecklists({
      ...checklists,
      [noteId]: [...currentList, newItem]
    });
    setNewChecklistText("");
  };

  const handleSaveNotes = (noteId: string) => {
    setStudyNotePad({
      ...studyNotePad,
      [noteId]: activeNoteText
    });
    alert(lang === "en" ? "Study notes updated in physical catalog!" : "স্টাডি নোট সফলভাবে সংরক্ষণ করা হয়েছে!");
  };

  const translateVal = (val: number) => {
    return `${Math.round(val)} Tk`;
  };

  const totalSalesCount = listedNotes.reduce((acc, note) => acc + note.downloadCount, 0);
  const totalEstimatedEarnings = listedNotes.reduce((acc, note) => acc + (note.downloadCount * note.price * 0.9), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="profile-hub-section">
      
      {/* Cover Banner profile */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-xs mb-8 gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />
        
        <div className="flex items-center space-x-4 z-10 text-center sm:text-left">
          <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-lg font-black uppercase ring-2 ring-indigo-400 select-none">
            {lang === "en" ? "ME" : "আমি"}
          </div>
          <div>
            <h2 className="text-xl font-black">
              {lang === "en" ? "Welcome back, Tahsin Note Scholar!" : "স্বাগতম, তাহসিন নোট স্কলার!"}
            </h2>
            <p className="text-xs text-indigo-300 mt-1 font-bold">
              {lang === "en" ? "Active Member Since May 2026 • Verified Contributor" : "মে ২০২৬ থেকে সক্রিয় সদস্য • ভেরিফাইড নোট কন্ট্রিবিউটর"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 z-10 w-full sm:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 min-w-[130px] text-center sm:text-right">
            <span className="text-[9px] uppercase tracking-wider text-indigo-200 font-bold block">{t.balance}</span>
            <span className="text-lg font-black block mt-0.5 font-mono">{translateVal(balance)}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5 min-w-[130px] text-center sm:text-right">
            <span className="text-[9px] uppercase tracking-wider text-indigo-200 font-bold block">
              {lang === "en" ? "Uploaded Catalog" : "সংযুক্ত কন্টেন্ট"}
            </span>
            <span className="text-lg font-black block mt-0.5 font-mono">
              {listedNotes.length} {lang === "en" ? "Items" : "টি কন্টেন্ট"}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Tabs controller */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto whitespace-nowrap" id="profile-subtabs">
        <button
          onClick={() => {
            setActiveSubTab("purchases");
          }}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSubTab === "purchases"
              ? "border-indigo-600 text-indigo-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
          }`}
        >
          {lang === "en" ? `My Unlocked Library (${purchasedNotes.length})` : `আমার সংগ্রহশালা (${purchasedNotes.length})`}
        </button>

        <button
          onClick={() => setActiveSubTab("earnings")}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSubTab === "earnings"
              ? "border-indigo-600 text-indigo-700 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
          }`}
        >
          {lang === "en" ? "Seller Dashboard & Stats" : "বিক্রেতা তথ্য ও হিসেবনিকেশ"}
        </button>
      </div>

      {/* Conditional Subtab layout */}
      {activeSubTab === "purchases" && (
        <div id="purchases-viewer">
          {purchasedNotes.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <ClipboardCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900">
                {lang === "en" ? "Your library is currency empty" : "আপনার সংগ্রহশালাটি বর্তমানে খালি রয়েছে"}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-semibold">
                {lang === "en" ? "Buy study notes or collect free official textbooks to view them here." : "বই বা নোট সংগ্রহ করুন। সংগৃহীত কন্টেন্ট এই ট্যাবে দেখতে পাবেন।"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: purchased notes lists selection (cols-4) */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider block mb-2">
                  {lang === "en" ? "Select Academic Asset" : "পুস্তক নির্বাচন করুন"}
                </span>
                
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {purchasedNotes.map((note) => {
                    const styling = SUBJECT_COLORS[note.subject] || { bg: "bg-slate-55 text-slate-650" };
                    const isSelected = selectedPurchasedNote?.id === note.id;
                    const activeT = lang === "bn" && note.titleBn ? note.titleBn : note.title;
                    const activeS = lang === "bn" && note.subjectBn ? note.subjectBn : note.subject;
                    return (
                      <div
                        key={note.id}
                        onClick={() => setSelectedPurchasedNote(note)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-left ${
                          isSelected 
                            ? "bg-indigo-50/40 border-indigo-400/80 shadow-xs" 
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${styling.bg}`}>
                            {activeS}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug tracking-tight">
                            {activeT}
                          </h4>
                          <p className="text-[10px] text-slate-450 font-medium">
                            {lang === "en" ? "Author:" : "উৎস:"} {lang === "en" ? note.author : (note.authorBn || note.author)}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-120">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Active Document Reader & Checklist tools (cols-8) */}
              <div className="lg:col-span-8 space-y-6">
                {selectedPurchasedNote ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs" id="active-document-container">
                    
                    {/* Reader Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4 mb-5">
                      <div>
                        <span className="text-[10.5px] font-bold text-indigo-700 uppercase tracking-wider block">
                          {lang === "en" ? "Active Document Reader" : "সক্রিয় কন্টেন্ট রিডার ভিউ"}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-905 tracking-tight block mt-1">
                          {lang === "bn" && selectedPurchasedNote.titleBn ? selectedPurchasedNote.titleBn : selectedPurchasedNote.title}
                        </h3>
                        <p className="text-xs text-slate-450 font-medium mt-1">
                          {lang === "en" ? "Institution:" : "শিক্ষা বোর্ড/প্রতিষ্ঠান:"} {lang === "bn" && selectedPurchasedNote.institutionBn ? selectedPurchasedNote.institutionBn : selectedPurchasedNote.institution}
                        </p>
                      </div>

                      <button
                        onClick={() => alert(lang === "en" ? `Starting secure PDF download for "${selectedPurchasedNote.title}.pdf" (Size: 3.5MB).` : `"${selectedPurchasedNote.titleBn || selectedPurchasedNote.title}.pdf" ডাউনলোড করা হচ্ছে (আকার: ৩.৫ মেগাবাইট)।`)}
                        className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-750 transition self-start cursor-pointer shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        <span>{lang === "en" ? "Download PDF" : "পিডিএফ ডাউনলোড"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Document script text body representation (cols-7) */}
                      <div className="md:col-span-7 bg-slate-50 rounded-xl p-4.5 border border-slate-150 max-h-[460px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-200/55 pb-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                            {lang === "en" ? "Catalog Preview Content" : "ব্যবহারকারী ভিউ ফাইল"}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-150 font-bold font-mono">
                            {lang === "en" ? "FULLY ACCESSIBLE" : "সম্পূূর্ণ অ্যাক্সেস"}
                          </span>
                        </div>

                        {/* Full rich texts from notes */}
                        <div className="space-y-4 prose text-xs text-slate-700 leading-relaxed">
                          <h4 className="font-extrabold text-slate-900 border-b border-indigo-100 pb-1 flex items-center gap-1">
                            <Bookmark className="h-3.5 w-3.5 text-indigo-655" />
                            <span>{lang === "en" ? "Verified Syllabus Index" : "অনুমোদিত সূচিপত্র ও সারসংক্ষেপ"}</span>
                          </h4>
                          
                          <div className="bg-white border border-slate-150 p-3 rounded-lg text-[11px] font-bold text-slate-600">
                            {lang === "en" 
                              ? "NCTB Curriculum Reference Guide. Follow these notes and review exercises to target stellar board exam output." 
                              : "এনসিটিবি কারিকুলাম রেফারেন্স নির্দেশিকা। চ্যাপ্টারের মূল বিশ্লেষণগুলি বোর্ড পরীক্ষার সিলেবাসের সাথে শতভাগ সামঞ্জস্যপূর্ণ।"}
                          </div>
                          
                          <div className="space-y-2 mt-2 font-mono">
                            {lang === "bn" && selectedPurchasedNote.previewSnippetBn ? (
                              selectedPurchasedNote.previewSnippetBn.map((line, idx) => (
                                <p key={idx} className="text-slate-650 font-sans tracking-tight leading-normal">{line}</p>
                              ))
                            ) : (
                              selectedPurchasedNote.previewSnippet?.map((line, idx) => (
                                <p key={idx} className="text-slate-650 font-sans tracking-tight leading-normal">{line}</p>
                              ))
                            )}
                          </div>

                          <h4 className="font-extrabold text-slate-905 border-b border-indigo-100 pt-3 pb-1">
                            {lang === "en" ? "Chapter 2: Concept Maps" : "অধ্যায় ২: মূল সূত্র ও পর্যালোচনা"}
                          </h4>
                          <p className="text-[11px]">
                            {lang === "en" 
                              ? "Refer to detailed sample case diagrams. High-achieving student notes recommend updating check boxes as you read major textbook formulas."
                              : "প্রতিটি অধ্যায়ের গুরুত্বপূর্ণ প্রশ্নের উত্তর ও ব্যাখ্যা দেয়া হয়েছে। সূত্রগুলো ভালোমতো আয়ত্ত করতে ডানদিকের স্টাডি চেকলিস্ট ব্যবহার করুন।"}
                          </p>
                        </div>
                      </div>

                      {/* Side Checklist and student note-pad tools (cols-5) */}
                      <div className="md:col-span-5 space-y-5">
                        
                        {/* 1. Study Checklist trackers */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-3 flex items-center gap-1.5">
                            <ClipboardCheck className="h-4 w-4 text-indigo-600" />
                            {lang === "en" ? "Study Goals tracker" : "স্টাডি গোল ট্র্যাকার"}
                          </span>

                          <div className="space-y-2 max-h-[140px] overflow-y-auto">
                            {(checklists[selectedPurchasedNote.id] || checklists["1"]).map((item) => (
                              <div 
                                key={item.id} 
                                onClick={() => toggleChecklist(selectedPurchasedNote.id, item.id)}
                                className="flex items-start gap-2 cursor-pointer select-none"
                              >
                                {item.done ? (
                                  <CheckSquare className="h-4 w-4 shrink-0 text-indigo-650 mt-0.5" />
                                ) : (
                                  <Square className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                                )}
                                <span className={`text-[11.5px] font-medium ${item.done ? "line-through text-slate-400" : "text-slate-700"}`}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Add checklist target */}
                          <form 
                            onSubmit={(e) => handleAddChecklistItem(selectedPurchasedNote.id, e)}
                            className="mt-4 flex gap-1.5"
                          >
                            <input
                              type="text"
                              value={newChecklistText}
                              onChange={(e) => setNewChecklistText(e.target.value)}
                              placeholder={lang === "en" ? "New study target..." : "নতুন লক্ষ্য লিখুন..."}
                              className="w-full text-xs bg-white rounded-lg border border-slate-200 px-2 py-2 text-slate-805 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </form>
                        </div>

                        {/* 2. Interactive Study Notepad */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                              <Edit className="h-3.5 w-3.5 text-indigo-600" />
                              {lang === "en" ? "My Exam Study Notes" : "আমার রিভিশন নোটপ্যাড"}
                            </span>
                          </div>

                          <textarea
                            rows={3}
                            value={activeNoteText}
                            onChange={(e) => setActiveNoteText(e.target.value)}
                            placeholder={lang === "en" ? "Write personal formula triggers here..." : "এখানে চ্যাপ্টারের মূল সূত্র বা গুরুত্বপূর্ণ টপিক টুকে রাখুন..."}
                            className="w-full text-xs font-semibold text-slate-750 rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                          />

                          <button
                            onClick={() => handleSaveNotes(selectedPurchasedNote.id)}
                            className="w-full text-xs font-bold py-2 rounded-lg bg-indigo-650 hover:bg-indigo-750 text-white transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>{lang === "en" ? "Save Note Entries" : "নোটটি সংরক্ষণ করুন"}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 border rounded-xl border-slate-150">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs italic text-slate-450 font-bold">
                      {lang === "en" ? "Select a textbook on the left to start learning" : "পড়াশোনা শুরু করতে বামদিকের তালিকা থেকে বই নির্বাচন করুন"}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* Seller Performance Subtab view */}
      {activeSubTab === "earnings" && (
        <div className="space-y-8" id="performance-tab-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Box 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{lang === "en" ? "Total Downloads" : "মোট ডাউনলোড"}</span>
              <span className="text-xl font-black text-slate-900 block mt-2 font-mono">
                {totalSalesCount} {lang === "en" ? "Copies Sold" : "বার সফল সংগ্রহ"}
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">{lang === "en" ? `Across all ${listedNotes.length} catalogs` : `মোট ${listedNotes.length} টি কন্টেন্ট থেকে`}</p>
            </div>

            {/* Box 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{lang === "en" ? "Gross Earnings" : "অর্জিত ক্রেডিট / লভ্যাংশ"}</span>
              <span className="text-xl font-black text-indigo-700 block mt-2 font-mono">{translateVal(totalEstimatedEarnings)}</span>
              <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">{lang === "en" ? "10% platform cuts applied" : "১০% প্ল্যাটফর্ম সার্চার্জ কর্তন পরবর্তী নিট লভ্যাংশ"}</p>
            </div>

            {/* Box 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{lang === "en" ? "Wallet Balance" : "বর্তমানে ওয়ালেট ব্যালেন্স"}</span>
              <span className="text-xl font-black text-slate-905 block mt-2 font-mono">{translateVal(balance)}</span>
              <p className="text-[10.5px] text-indigo-705 font-bold mt-1">{lang === "en" ? "Fully available to spend" : "অন্যান্য বই ক্রয়ে ব্যবহারযোগ্য"}</p>
            </div>

            {/* Box 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs bg-indigo-50/20">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">{lang === "en" ? "Seller Rank" : "সেলার র‍্যাংক ও সুনাম"}</span>
              <span className="text-md font-black text-indigo-850 mt-2 block">
                {lang === "en" ? "Gold Board Contributor" : "স্বর্ণপদক প্রাপ্ত কন্ট্রিবিউটর"}
              </span>
              <p className="text-[10.5px] text-slate-400 mt-1 font-semibold">{lang === "en" ? "Sustained rating of 4.9★" : "গড় ৪.৯★ রেটিং অর্জনের ভিত্তিতে"}</p>
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <History className="h-4.5 w-4.5 text-indigo-600" />
              <span>{lang === "en" ? "Recent Credits & Wallet logs" : "সাম্প্রতিক লেনদেন ও ওয়ালেট লগের ইতিহাস"}</span>
            </h3>

            {listedNotes.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-4 font-bold">{lang === "en" ? "No records recorded." : "কোনো লেনদেনের ইতিহাস পাওয়া যায়নি।"}</p>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {listedNotes.filter(note => note.downloadCount > 0).map((note, index) => {
                  return (
                    <div key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150 font-mono text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider bg-indigo-150 text-indigo-800 rounded px-1.5 py-0.5 font-bold mr-2">SALE</span>
                        <span className="font-sans text-slate-805 font-bold">{lang === "en" ? note.title : (note.titleBn || note.title)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-900 font-extrabold block font-mono">+{translateVal(note.price * 0.9)}</span>
                        <span className="text-[9.5px] text-slate-400 leading-none block mt-0.5">{lang === "en" ? "May 2026" : "মে ২০২৬"}</span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Simulated default logs */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150 font-mono text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider bg-emerald-100 text-emerald-805 rounded px-1.5 py-0.5 font-bold mr-2">CREDIT</span>
                    <span className="font-sans text-slate-805 font-bold">{lang === "en" ? "Weekly Board Scholar Subsidy Fund" : "সাপ্তাহিক বোর্ড বৃত্তি শিক্ষাসহায়তা অনুদান"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-extrabold block font-mono">+{translateVal(25.00)}</span>
                    <span className="text-[9.5px] text-slate-400 leading-none block mt-0.5">{lang === "en" ? "June 2026" : "জুন ২০২৬"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
