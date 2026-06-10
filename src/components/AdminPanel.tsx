import React, { useState } from "react";
import { Note } from "../types";
import { Language, translations } from "../translations";
import { PlusCircle, ShieldAlert, BookOpen, Trash2, Check, FileCheck, UploadCloud, Database } from "lucide-react";

interface AdminPanelProps {
  notes: Note[];
  onAddNewListing: (note: Note) => void;
  onRemoveListing: (id: string) => void;
  lang: Language;
}

export default function AdminPanel({
  notes,
  onAddNewListing,
  onRemoveListing,
  lang
}: AdminPanelProps) {
  const t = translations[lang];

  // Form State
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [subjectBn, setSubjectBn] = useState("গণিত");
  const [classLevel, setClassLevel] = useState("Class 10");
  const [institution, setInstitution] = useState("National Curriculum Board Bangladesh");
  const [institutionBn, setInstitutionBn] = useState("জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড");
  const [course, setCourse] = useState("");
  const [courseBn, setCourseBn] = useState("");
  const [price, setPrice] = useState("0.00"); // Standard is 0.00 for government books
  const [author, setAuthor] = useState("National Board Panel");
  const [authorBn, setAuthorBn] = useState("জাতীয় শিক্ষা বোর্ড প্যানেল");
  const [pageCount, setPageCount] = useState(120);
  const [fileType, setFileType] = useState("PDF");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isOfficialTextbook, setIsOfficialTextbook] = useState(true);

  // Success Notification
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubjectChange = (val: string) => {
    setSubject(val);
    // Auto sync Bangla version
    if (val === "Mathematics") setSubjectBn("গণিত");
    else if (val === "Science") setSubjectBn("বিজ্ঞান");
    else if (val === "Physics") setSubjectBn("পদার্থবিজ্ঞান");
    else if (val === "Chemistry") setSubjectBn("রসায়ন");
    else if (val === "Bengali") setSubjectBn("বাংলা");
    else if (val === "English") setSubjectBn("ইংরেজি");
    else if (val === "Social Science") setSubjectBn("ইতিহাস ও সামাজিক বিজ্ঞান");
    else setSubjectBn("অন্যান্য");
  };

  const handleAddOfficialBook = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert(lang === "en" ? "Please fill out required title and description blocks." : "অনুগ্রহ করে প্রয়োজনীয় শিরোনাম এবং বিবরণের ক্ষেত্রগুলি পূরণ করুন।");
      return;
    }

    const priceNum = parseFloat(price);
    const tagsArray = tagsInput
      ? tagsInput.split(",").map((t) => t.trim().toLowerCase())
      : ["nctb", classLevel.toLowerCase().replace(" ", "")];

    // Dummy snippets to simulate a real PDF textbook preview
    const previewSnip = [
      `## OFFICIAL BOARD REFERENCE FOR ${classLevel.toUpperCase()}`,
      `This is a verified academic publication officially listed for target secondary school syllabus in Bangladesh.`,
      `--- CODE INDEX: ${subject.toUpperCase()} ---`,
      `Verified by NCTB Curriculum specialists.`
    ];

    const previewSnipBn = [
      `## ${classLevel === "Class 10" ? "১০ম" : classLevel === "Class 9" ? "৯ম" : classLevel === "Class 8" ? "৮ম" : classLevel === "Class 7" ? "৭ম" : "৬ষ্ঠ"} শ্রেণীর সরকারি বোর্ড বই রেফারেন্স`,
      `বাংলাদেশ মাধ্যমিক শিক্ষা প্যানেল ও এনসিটিবি কর্তৃক অনুমোদিত প্রাতিষ্ঠানিক কারিকুলাম অনুসরণ করে প্রস্তুত।`,
      `--- পাঠ্যসূচি: ${subjectBn} ---`,
      `জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড দ্বারা ভেরিফাইড।`
    ];

    const newNote: Note = {
      id: "admin_" + Date.now(),
      title,
      titleBn: titleBn || title,
      subject,
      subjectBn,
      classLevel,
      institution,
      institutionBn,
      course: course || `${subject} Core Curriculum`,
      courseBn: courseBn || `${subjectBn} বোর্ড পাঠ্যক্রম`,
      price: isNaN(priceNum) ? 0 : priceNum,
      author,
      authorBn,
      rating: 5.0,
      ratingCount: 1,
      downloadCount: 0,
      pageCount: Number(pageCount) || 120,
      fileType,
      description,
      descriptionBn: descriptionBn || description,
      previewSnippet: previewSnip,
      previewSnippetBn: previewSnipBn,
      tags: tagsArray,
      uploadDate: new Date().toISOString().split("T")[0],
      sellerEmail: "admin@notecycle.gov.bd",
      thumbnailSeed: isOfficialTextbook ? "books" : "science",
      featured: true,
      isOfficialTextbook
    };

    onAddNewListing(newNote);
    
    // Notify
    setSuccessMsg(t.adminSuccessUploaded);
    setTimeout(() => setSuccessMsg(""), 4000);

    // Reset Form
    setTitle("");
    setTitleBn("");
    setCourse("");
    setCourseBn("");
    setDescription("");
    setDescriptionBn("");
    setTagsInput("");
  };

  const handleDeleteAsset = (id: string, titleName: string) => {
    if (confirm(lang === "en" ? `Are you sure you want to delete "${titleName}"?` : `আপনি কি নিশ্চিত যে "${titleName}" ডিলিট করতে চান?`)) {
      onRemoveListing(id);
      alert(t.deleteSuccessMsg);
    }
  };

  const officialBooks = notes.filter(n => n.isOfficialTextbook);
  const studentGuides = notes.filter(n => !n.isOfficialTextbook);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="admin-panel-container">
      
      {/* Admin Title Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-rose-200 pb-5 mb-8 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 border border-rose-200 mb-2">
            <ShieldAlert className="h-4 w-4" />
            {t.adminBadge}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {lang === "en" ? "System Administration Dashboard" : "সিস্টেম প্রশাসনিক ড্যাশবোর্ড"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t.adminActions}
          </p>
        </div>

        {/* Counters card info */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-3 shadow-xs shrink-0">
            <span className="text-[10px] font-black uppercase text-slate-400 block leading-none">NCTB Textbooks</span>
            <span className="text-xl font-black text-rose-850 mt-1 block">{officialBooks.length}</span>
          </div>

          <div className="rounded-xl border border-slate-150 bg-white p-3 shadow-xs shrink-0">
            <span className="text-[10px] font-black uppercase text-slate-400 block leading-none">Student Notes Listed</span>
            <span className="text-xl font-black text-slate-800 mt-1 block">{studentGuides.length}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-850 text-xs font-bold flex items-center gap-2">
          <Check className="h-5 w-5 text-indigo-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Upload official textbooks - Column Span 7 */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-205 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <PlusCircle className="h-5 w-5 text-indigo-650" />
            <h3 className="text-lg font-black text-slate-900">
              {t.uploadOfficialTextbook}
            </h3>
          </div>

          <form onSubmit={handleAddOfficialBook} className="space-y-4">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl p-3.5 mb-2">
              <input
                type="checkbox"
                id="is-official-textbook-chk"
                checked={isOfficialTextbook}
                onChange={(e) => setIsOfficialTextbook(e.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              <label htmlFor="is-official-textbook-chk" className="text-xs font-bold text-slate-800 cursor-pointer">
                {t.textbookCheckboxLabel}
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Title EN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Title (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., NCTB Class 9 Chemistry Textbook"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-850 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Title BN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  শিরোনাম (বাংলা)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সরকারি এনসিটিবি ৯ম শ্রেণীর রসায়ন পাঠ্যবই"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-850 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.subjectLabel}</label>
                <select
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full text-xs font-bold rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Mathematics">Mathematics / গণিত</option>
                  <option value="Science">Science / বিজ্ঞান</option>
                  <option value="Physics">Physics / পদার্থবিজ্ঞান</option>
                  <option value="Chemistry">Chemistry / রসায়ন</option>
                  <option value="Bengali">Bengali / বাংলা</option>
                  <option value="English">English / ইংরেজি</option>
                  <option value="Social Science">Social Science / সামাজিক বিজ্ঞান</option>
                  <option value="Other">Other / অন্যান্য</option>
                </select>
              </div>

              {/* Class Level */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.classLevelLabel}</label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full text-xs font-bold rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Class 6">Class 6 (৬ষ্ঠ শ্রেণী)</option>
                  <option value="Class 7">Class 7 (৭ম শ্রেণী)</option>
                  <option value="Class 8">Class 8 (৮ম শ্রেণী)</option>
                  <option value="Class 9">Class 9 (৯ম শ্রেণী)</option>
                  <option value="Class 10">Class 10 (১০ম শ্রেণী)</option>
                </select>
              </div>

              {/* Authority EN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Authority Publisher (English)</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Authority BN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">প্রকাশক কর্তৃপক্ষ (বাংলা)</label>
                <input
                  type="text"
                  value={institutionBn}
                  onChange={(e) => setInstitutionBn(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Price Book */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Price (Set 0.00 for FREE)</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-xs font-black rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Page count */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.pageCountLabel}</label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Author EN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Author Name (English)</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              {/* Author BN */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">লেখকের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={authorBn}
                  onChange={(e) => setAuthorBn(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800"
                />
              </div>

              {/* Description EN */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Description (English)</label>
                <textarea
                  placeholder="Write a clear textbook overview in English..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-850 h-20"
                />
              </div>

              {/* Description BN */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">বিবরণ (বাংলা)</label>
                <textarea
                  placeholder="বাংলায় বইটির চমৎকার বিবরণ লিখুন..."
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 text-slate-850 h-20"
                />
              </div>

              {/* Tags */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{t.tagsLabel}</label>
                <input
                  type="text"
                  placeholder="e.g., nctb, class9, Chemistry, textbook"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-indigo-550"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs py-3.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="h-4 w-4" />
              <span>{lang === "en" ? "Register Official Board Asset" : "সরকারি বোর্ড পুস্তক ডাটাবেসে যুক্ত করুন"}</span>
            </button>
          </form>
        </div>

        {/* Existing Inventory - Column Span 5 */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col max-h-[700px]">
          <h3 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>{lang === "en" ? "Live Inventory Moderation" : "সিস্টেম কন্টেন্ট নিয়ন্ত্রণ তালিকা"}</span>
            <span className="text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-500 font-mono">
              Total: {notes.length}
            </span>
          </h3>

          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-slate-50 border border-slate-105 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-905 line-clamp-1">
                      {lang === "en" ? note.title : (note.titleBn || note.title)}
                    </h4>
                    <p className="text-[9.5px] font-semibold text-slate-400 mt-0.5">
                      {note.classLevel || "Class 9-10"} • {lang === "en" ? note.subject : (note.subjectBn || note.subject)}
                    </p>
                  </div>
                  {note.isOfficialTextbook && (
                    <span className="text-[8px] uppercase tracking-wider font-extrabold bg-indigo-100 text-indigo-805 px-1.5 py-0.5 rounded-md border border-indigo-200">
                      NCTB
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 font-mono">
                  <span className="font-extrabold text-slate-800">
                    {note.price === 0 ? "FREE" : `${Math.round(note.price)} Tk`}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteAsset(note.id, lang === "en" ? note.title : (note.titleBn || note.title))}
                    className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-500 transition-colors"
                    title="Remove permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
