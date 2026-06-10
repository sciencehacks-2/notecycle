import React, { useState } from "react";
import { UploadCloud, CheckCircle2, TrendingUp, BookOpen, FileCheck, Trash2 } from "lucide-react";
import { Note } from "../types";
import { SUBJECT_COLORS } from "../data";
import { Language, translations } from "../translations";

interface DashboardProps {
  listedNotes: Note[];
  onAddNewListing: (note: Note) => void;
  onRemoveListing: (id: string) => void;
  balance: number;
  lang: Language;
}

export default function Dashboard({
  listedNotes,
  onAddNewListing,
  onRemoveListing,
  balance,
  lang
}: DashboardProps) {
  const t = translations[lang];

  // New note form state
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [subjectBn, setSubjectBn] = useState("গণিত");
  const [classLevel, setClassLevel] = useState("Class 10");
  const [institution, setInstitution] = useState("");
  const [institutionBn, setInstitutionBn] = useState("");
  const [course, setCourse] = useState("");
  const [courseBn, setCourseBn] = useState("");
  const [price, setPrice] = useState("200");
  const [author, setAuthor] = useState("");
  const [authorBn, setAuthorBn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [pageCount, setPageCount] = useState(15);
  const [fileType, setFileType] = useState("PDF");

  // Simulated Drag and Drop state
  const [fileName, setFileName] = useState("");
  const [fileAttached, setFileAttached] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Success indicator message
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubjectChange = (val: string) => {
    setSubject(val);
    if (val === "Mathematics") setSubjectBn("গণিত");
    else if (val === "Science") setSubjectBn("বিজ্ঞান");
    else if (val === "Physics") setSubjectBn("পদার্থবিজ্ঞান");
    else if (val === "Chemistry") setSubjectBn("রসায়ন");
    else if (val === "Bengali") setSubjectBn("বাংলা");
    else if (val === "English") setSubjectBn("ইংরেজি");
    else if (val === "Social Science") setSubjectBn("ইতিহাস ও সামাজিক বিজ্ঞান");
    else setSubjectBn("অন্যান্য");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name);
      setFileAttached(true);
    }
  };

  const simulateFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFileAttached(true);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) {
      alert(lang === "en" ? "Please fill in all core fields (Title and Author)." : "দয়া করে প্রয়োজনীয় অংশগুলো যেমন শিরোনাম এবং নাম পূরণ করুন।");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert(lang === "en" ? "Please enter a valid notes price." : "দয়া করে সঠিক মূল্য নির্ধারণ করুন।");
      return;
    }

    const tagsArray = tagsInput
      ? tagsInput.split(",").map((t) => t.trim().toLowerCase())
      : ["classnote", classLevel.toLowerCase().replace(" ", "")];

    // Mock handwritten snippet bilingually
    const textSnippet = [
      `## LECTURE SUMMARY: ${title.toUpperCase()}`,
      `Handwritten syllabus logs structured for Bangladesh NCTB Curriculum.`,
      `Verified standard peer lecture outline. Includes chapter summaries, notes, and illustrations.`
    ];

    const textSnippetBn = [
      `## লেকচার নোট সারসংক্ষেপ: ${titleBn || title}`,
      `জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) কারিকুলাম অনুসারে প্রস্তুতকৃত।`,
      `পরীক্ষার উপযোগী প্রশ্ন ও উত্তর সমাধান সহ বিস্তারিত চ্যাপ্টার ভিত্তিক হ্যাসকোড প্রিভিউ।`
    ];

    const newNote: Note = {
      id: `custom-note-${Date.now()}`,
      title,
      titleBn: titleBn || title,
      subject,
      subjectBn,
      classLevel,
      institution: institution || "Dhaka Government High School",
      institutionBn: institutionBn || "ঢাকা সরকারি মাধ্যমিক বিদ্যালয়",
      course: course || `${subject} Core Class`,
      courseBn: courseBn || `${subjectBn} বোর্ড পাঠ্যক্রম`,
      price: priceNum,
      author,
      authorBn: authorBn || author,
      rating: 5.0,
      ratingCount: 0,
      downloadCount: 0,
      pageCount: pageCount || 10,
      fileType: fileType || "PDF",
      description: description || `Study notes covering topics in ${course || subject} for ${classLevel}.`,
      descriptionBn: descriptionBn || `শ্রেণীঃ ${classLevel} এর ${subjectBn} বিষয়ের চমৎকার সাজানো গোছানো লেকচার শিট ও পরীক্ষার গাইড।`,
      previewSnippet: textSnippet,
      previewSnippetBn: textSnippetBn,
      tags: tagsArray,
      uploadDate: new Date().toISOString().split("T")[0],
      sellerEmail: "student@notecycle.edu.bd",
      thumbnailSeed: "nature"
    };

    onAddNewListing(newNote);

    setSuccessMsg(lang === "en" ? `"${title}" has been published to Notecycle!` : `"${titleBn || title}" সফলভাবে প্রকাশ করা হয়েছে!`);
    
    // Reset Form
    setTitle("");
    setTitleBn("");
    setCourse("");
    setCourseBn("");
    setInstitution("");
    setInstitutionBn("");
    setPrice("200");
    setAuthor("");
    setAuthorBn("");
    setDescription("");
    setDescriptionBn("");
    setTagsInput("");
    setPageCount(15);
    setFileAttached(false);
    setFileName("");

    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  const translateVal = (val: number) => {
    if (isNaN(val)) return `0 ${t.currency}`;
    return `${Math.round(val)} ${t.currency}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="seller-dashboard">
      
      {/* Dashboard Headline banners */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-905 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span>{lang === "en" ? "Seller Portal & Study Creator" : "সেলার ড্যাশবোর্ড ও কন্টেন্ট আপলোড"}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {lang === "en" 
              ? "Share your secondary text notes, board notes or chapter formulations to earn study credits." 
              : "আপনার নিজের তৈরি নোট, টেস্ট পেপার সলিউশন শেয়ার করে ওয়ালেট ক্রেডিট অর্জন করুন।"}
          </p>
        </div>

        {/* Sales status boxes */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-indigo-50/25 p-4 min-w-[130px] shadow-xs">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider leading-none">{t.balance}</span>
            <span className="text-lg font-black block mt-1.5 font-mono text-indigo-800">{translateVal(balance)}</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 min-w-[130px] shadow-xs">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider leading-none">
              {lang === "en" ? "My Listings" : "প্রকাশিত নোট"}
            </span>
            <span className="text-lg font-black block mt-1.5 font-mono text-slate-900">
              {listedNotes.length} {lang === "en" ? "Notes" : "টি নোট"}
            </span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-850 text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in" id="success-banner">
          <CheckCircle2 className="h-4.5 w-4.5 text-indigo-650 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Side Form, Right Side Real-time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Fill Details Form Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <BookOpen className="h-5 w-5 text-indigo-650" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === "en" ? "Upload Class 6-10 Study Notes" : "৬ষ্ঠ-১০ম শ্রেণীর চমৎকার ও বিশ্বস্ত নোট আপলোড"}
              </h3>
            </div>

            <form onSubmit={handlePublish} className="space-y-4" id="listing-creation-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title EN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">Note Title (English) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Class 10 Chemistry Formulas Sheet"
                    className="w-full text-xs font-semibold rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Title BN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">নোটের শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমনঃ ১০ম শ্রেণীর রসায়ন অধ্যায় ৪ সূত্রের নোটস"
                    className="w-full text-xs font-semibold rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Subject dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">{t.subjectLabel}</label>
                  <select
                    value={subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full rounded-lg text-xs font-bold border border-slate-200 p-2.5 text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics / গণিত</option>
                    <option value="Science">Science / বিজ্ঞান</option>
                    <option value="Physics">Physics / পদার্থবিজ্ঞান</option>
                    <option value="Chemistry">Chemistry / রসায়ন</option>
                    <option value="Bengali">Bengali / বাংলা</option>
                    <option value="English">English / ইংরেজি</option>
                    <option value="Social Science">Social Science / ইতিহাস ও সামাজিক বিজ্ঞান</option>
                    <option value="Other">Other / অন্যান্য</option>
                  </select>
                </div>

                {/* Class Level */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">{t.classLevelLabel}</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full rounded-lg text-xs font-bold border border-slate-200 p-2.5 text-slate-805 bg-white focus:outline-none"
                  >
                    <option value="Class 6">Class 6 (৬ষ্ঠ শ্রেণী)</option>
                    <option value="Class 7">Class 7 (৭ম শ্রেণী)</option>
                    <option value="Class 8">Class 8 (৮ম শ্রেণী)</option>
                    <option value="Class 9">Class 9 (৯ম শ্রেণী)</option>
                    <option value="Class 10">Class 10 (১০ম শ্রেণী)</option>
                  </select>
                </div>

                {/* Institution EN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">School Name (English)</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. Dhaka Government High School"
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800"
                  />
                </div>

                {/* Institution BN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">স্কুলের নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={institutionBn}
                    onChange={(e) => setInstitutionBn(e.target.value)}
                    placeholder="যেমনঃ ঢাকা গভঃ হাই স্কুল"
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-805"
                  />
                </div>

                {/* Author EN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">Your Name (English) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Tahsin Note Scholar"
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800"
                  />
                </div>

                {/* Author BN */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">আপনার নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={authorBn}
                    onChange={(e) => setAuthorBn(e.target.value)}
                    placeholder="যেমনঃ তাহসিন আহমেদ"
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-805"
                  />
                </div>

                {/* Price (simulate in Taka or USD) */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-705 block">Price (Taka - Tk) <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs font-black rounded-lg border border-slate-200 p-2.5 text-slate-800 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {lang === "en" ? "Applies to secondary marketplace" : "নির্ধারিত মূল্য ওয়ালেটে ক্রেডিট হিসেবে জমা হবে।"}
                  </p>
                </div>

                {/* Page Count */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">{t.pageCountLabel}</label>
                  <input
                    type="number"
                    min="1"
                    max="400"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold rounded-lg border border-slate-200 p-2.5 text-slate-800"
                  />
                </div>

                {/* Description EN */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-705 block">Description (English)</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe content in English..."
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-800"
                  />
                </div>

                {/* Description BN */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-705 block">বিবরণ (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    placeholder="বাংলায় বই বা নোটটির চমৎকার বিবরণ দিন..."
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-800"
                  />
                </div>

                {/* Custom drag and drop upload block */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-black text-slate-707 block">{lang === "en" ? "Attach PDF Document File" : "পিডিএফ কন্টেন্ট ফাইল সংযুক্তকরণ"}</label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      isDragging 
                        ? "border-indigo-500 bg-indigo-50/20" 
                        : fileAttached 
                        ? "border-indigo-500/50 bg-slate-50" 
                        : "border-slate-300 hover:border-slate-400 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      id="dashboard-file-upload"
                      onChange={simulateFileAttach}
                      className="hidden"
                      accept=".pdf"
                    />
                    
                    <label htmlFor="dashboard-file-upload" className="w-full cursor-pointer">
                      {fileAttached ? (
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-100/90 mb-1.5">
                            <FileCheck className="h-5 w-5 text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 line-clamp-1">{fileName}</span>
                          <span className="text-[10px] text-emerald-805 mt-1 font-bold">{lang === "en" ? "Attached successfully" : "ফাইলটি সংযুক্ত করা হয়েছে"}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-750">
                            {lang === "en" ? "Drag & Drop PDF file or click to browse" : "ক্লিক করে পিডিএফ সংযুক্ত করুন"}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1 uppercase">Supports PDF files</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

              </div>

              {/* Action publish buttons */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  id="btn-publish-listing"
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-750 active:scale-97 transition-all leading-none cursor-pointer"
                >
                  {lang === "en" ? "Publish to Notecycle" : "নোটসাইকেল ডাটাবেসে শেয়ার করুন"}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Real-Time Preview Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-205 bg-slate-50 p-6 sticky top-20 text-center shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-4">
              {lang === "en" ? "Real-Time Cover Preview" : "নিবন্ধন কভার প্রিভিউ"}
            </span>

            {/* Notebook cover widget representation */}
            <div className="flex items-center justify-center py-4">
              <div className="relative shadow-md w-36 h-48 rounded-r-lg rounded-l-xs flex flex-col justify-between p-3 border-l-4 border-l-slate-900 bg-gradient-to-br from-slate-800 to-slate-900 text-white transition-all text-left">
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none rounded-r-lg" />

                <span className="text-[8.5px] uppercase font-black tracking-wider text-indigo-400 bg-white/10 px-1 py-0.5 rounded self-start truncate max-w-full">
                  {lang === "bn" ? subjectBn : subject}
                </span>

                <div className="mt-2 flex-1 flex flex-col justify-center">
                  <h4 className="text-[10px] font-black line-clamp-3 text-slate-100 tracking-tight leading-snug">
                    {lang === "bn" ? (titleBn || title || "বইয়ের শিরোনাম") : (title || "Class Note Title")}
                  </h4>
                  <p className="text-[8.5px] font-bold text-indigo-300 mt-1 font-mono">
                    {lang === "bn" ? `${classLevel.replace("Class ", "")}ম শ্রেণী` : classLevel}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-1.5 flex justify-between items-center text-[7.5px] font-medium text-slate-300 truncate">
                  <span>{lang === "bn" ? `লেখকঃ ${authorBn || author || "আপনার নাম"}` : `By ${author || "Author"}`}</span>
                  <span className="font-mono text-[7px] bg-white/20 px-1 rounded text-slate-50">{fileType}</span>
                </div>
              </div>
            </div>

            {/* Simulated Live update items */}
            <div className="text-left space-y-2 border-t border-slate-200/60 pt-4 mt-2 font-semibold">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === "en" ? "Value:" : "নির্ধারিত মূল্য:"}</span>
                <span className="font-mono text-slate-805">{translateVal(parseFloat(price || "4.99"))}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === "en" ? "Grade level:" : "উপযোগী শ্রেণী:"}</span>
                <span className="text-slate-700">{lang === "bn" ? `${classLevel.replace("Class ", "")}ম শ্রেণী` : classLevel}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Active student listings */}
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <h3 className="text-base font-black text-slate-900 mb-5">
          {lang === "en" ? "My Personal Uploaded Notes" : "আমার প্রকাশিত বই ও হ্যান্ডনোট কারিকুলাম"}
        </h3>

        {listedNotes.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-450 italic font-bold">
              {lang === "en" ? "No listing items created yet." : "আপনার তালিকায় কোনো হ্যান্ডনোট প্রকাশ করা হয়নি এখনো।"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-150 text-xs font-bold text-slate-600 text-left">
              <thead className="bg-slate-50 uppercase text-slate-400 font-black">
                <tr>
                  <th className="px-4 py-3">{lang === "en" ? "Study Notes" : "নোট ও বইয়ের বিবরণ"}</th>
                  <th className="px-4 py-3">{lang === "en" ? "Subject" : "বিষয়"}</th>
                  <th className="px-4 py-3">{lang === "en" ? "Price" : "প্রদেয় মূল্য"}</th>
                  <th className="px-4 py-3">{lang === "en" ? "Rating" : "রেটিং পয়েন্ট"}</th>
                  <th className="px-4 py-3">{lang === "en" ? "Sold downloads" : "বিক্রিত কপি"}</th>
                  <th className="px-4 py-3 text-center">{lang === "en" ? "Actions" : "নিয়ন্ত্রণ"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {listedNotes.map((listed) => {
                  const activeT = lang === "bn" && listed.titleBn ? listed.titleBn : listed.title;
                  const activeS = lang === "bn" && listed.subjectBn ? listed.subjectBn : listed.subject;
                  return (
                    <tr key={listed.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                          <div>
                            <p className="text-slate-900 font-bold line-clamp-1">{activeT}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {listed.classLevel} • {lang === "en" ? listed.institution : (listed.institutionBn || listed.institution)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[10.5px]">
                          {activeS}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-950 font-mono">
                        {translateVal(listed.price)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-amber-500 font-black">{listed.rating.toFixed(1)} ★</span>
                        <span className="text-slate-400 ml-0.5">({listed.ratingCount})</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        {listed.downloadCount}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => {
                            if (confirm(lang === "en" ? "Are you sure you want to delete this listing?" : "আপনি কি নিশ্চিত যে নোটটি বাদ দিতে চান?")) {
                              onRemoveListing(listed.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
