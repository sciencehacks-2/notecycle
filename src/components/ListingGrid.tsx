import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, FilterX, BookOpen, GraduationCap, CheckCircle } from "lucide-react";
import { Note } from "../types";
import NoteCard from "./NoteCard";
import { Language, translations } from "../translations";

interface ListingGridProps {
  notes: Note[];
  onViewDetails: (note: Note) => void;
  onAddToCart: (note: Note, e: React.MouseEvent) => void;
  cartIds: string[];
  initialSearchQuery: string;
  onResetSearch: () => void;
  selectedSubjectFilter?: string;
  onSelectSubjectFilter: (subj?: string) => void;
  lang: Language;
}

export default function ListingGrid({
  notes,
  onViewDetails,
  onAddToCart,
  cartIds,
  initialSearchQuery,
  onResetSearch,
  selectedSubjectFilter,
  onSelectSubjectFilter,
  lang
}: ListingGridProps) {
  const t = translations[lang];

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(400); // Slider up to 400 Tk
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popular");

  // Sync state if parent research changes query
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Derive available categories dynamically
  const subjects = useMemo(() => {
    const list = new Set(notes.map(n => n.subject));
    return Array.from(list);
  }, [notes]);

  const institutions = useMemo(() => {
    const list = new Set(notes.map(n => n.institution));
    return ["All", ...Array.from(list)];
  }, [notes]);

  const translateSubjectName = (subj: string) => {
    if (lang === "en") return subj;
    switch(subj) {
      case "Mathematics": return "গণিত";
      case "Science": return "বিজ্ঞান";
      case "Physics": return "পদার্থবিজ্ঞান";
      case "Chemistry": return "রসায়ন";
      case "Bengali": return "বাংলা";
      case "English": return "ইংরেজি";
      case "Social Science": return "ইতিহাস ও সামাজিক বিজ্ঞান";
      default: return subj;
    }
  };

  // Compute filtered items
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        
        const titleMatch = note.title.toLowerCase().includes(query) || (note.titleBn && note.titleBn.toLowerCase().includes(query));
        const subjectMatch = note.subject.toLowerCase().includes(query) || (note.subjectBn && note.subjectBn.toLowerCase().includes(query));
        const instMatch = note.institution.toLowerCase().includes(query) || (note.institutionBn && note.institutionBn.toLowerCase().includes(query));
        const authorMatch = note.author.toLowerCase().includes(query) || (note.authorBn && note.authorBn.toLowerCase().includes(query));
        const courseMatch = (note.course && note.course.toLowerCase().includes(query)) || (note.courseBn && note.courseBn.toLowerCase().includes(query));
        const classMatch = note.classLevel && note.classLevel.toLowerCase().includes(query);

        const matchesQuery = query === "" || 
          titleMatch ||
          subjectMatch ||
          instMatch ||
          authorMatch ||
          courseMatch ||
          classMatch ||
          note.tags.some(tag => tag.toLowerCase().includes(query));

        // Subject category checklists
        const matchesSubject = !selectedSubjectFilter || note.subject === selectedSubjectFilter;

        // Class level dropdown filter
        const matchesClass = selectedClass === "All" || note.classLevel === selectedClass;

        // Institution dropdown
        const matchesInstitution = selectedInstitution === "All" || note.institution === selectedInstitution;

        // Price range
        const matchesPrice = note.price <= maxPrice;

        // Rating
        const matchesRating = note.rating >= minRating;

        return matchesQuery && matchesSubject && matchesClass && matchesInstitution && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        // Sorting dropdown
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating-desc") return b.rating - a.rating;
        if (sortBy === "popular") return b.downloadCount - a.downloadCount;
        if (sortBy === "newest") return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        return 0;
      });
  }, [notes, searchQuery, selectedSubjectFilter, selectedClass, selectedInstitution, maxPrice, minRating, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    onSelectSubjectFilter(undefined);
    setSelectedClass("All");
    setSelectedInstitution("All");
    setMaxPrice(400);
    setMinRating(0);
    setSortBy("popular");
    onResetSearch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="explore-section">
      
      {/* Visual Title / Meta indicator */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-650" />
            {t.exploreTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {t.exploreSubtitle}
          </p>
        </div>

        {/* Info indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-indigo-50/50 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-100 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {lang === "en" 
              ? `Found ${filteredNotes.length} matching textbooks` 
              : `মোট ${filteredNotes.length} টি বই/নোট পাওয়া গেছে`}
          </span>
          {(searchQuery || selectedSubjectFilter || selectedClass !== "All" || selectedInstitution !== "All" || maxPrice < 20 || minRating > 0) && (
            <button
              onClick={handleReset}
              className="rounded-full bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 flex items-center gap-1 hover:bg-slate-850 transition cursor-pointer"
              id="btn-listing-reset"
            >
              <FilterX className="h-3.5 w-3.5" />
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-8">
        
        {/* Left Side: Filter Control Board */}
        <div className="w-full lg:w-64 shrink-0 mb-8 lg:mb-0" id="listing-sidebar">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600" />
                {t.refineTitle}
              </span>
              <button 
                onClick={handleReset}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-850 hover:underline transition"
              >
                {t.clearAll}
              </button>
            </div>

            {/* Keyword search inside listing page */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">{t.searchLabel}</label>
              <div className="relative">
                <Search className="absolute top-3 left-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full text-xs font-semibold rounded-lg border border-slate-200 pl-8.5 pr-2.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Class selection dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">{t.classLevelHeader}</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-lg text-xs font-bold border border-slate-200 px-2.5 py-2.5 text-slate-800 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">{lang === "en" ? "All Grades / Classes" : "সকল শ্রেণী"}</option>
                <option value="Class 6">{lang === "en" ? "Class 6" : "৬ষ্ঠ শ্রেণী (Class 6)"}</option>
                <option value="Class 7">{lang === "en" ? "Class 7" : "৭ম শ্রেণী (Class 7)"}</option>
                <option value="Class 8">{lang === "en" ? "Class 8" : "৮ম শ্রেণী (Class 8)"}</option>
                <option value="Class 9">{lang === "en" ? "Class 9" : "৯ম শ্রেণী (Class 9)"}</option>
                <option value="Class 10">{lang === "en" ? "Class 10" : "১০ম শ্রেণী (Class 10)"}</option>
              </select>
            </div>

            {/* Subjects Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">{t.subjectHeader}</label>
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                <button
                  onClick={() => onSelectSubjectFilter(undefined)}
                  className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-bold transition flex items-center justify-between ${
                    !selectedSubjectFilter 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{lang === "en" ? "All Subjects" : "সকল বিষয়"}</span>
                  {!selectedSubjectFilter && <CheckCircle className="h-3 w-3 text-indigo-650" />}
                </button>
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => onSelectSubjectFilter(subj)}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-bold transition flex items-center justify-between ${
                      selectedSubjectFilter === subj 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{translateSubjectName(subj)}</span>
                    {selectedSubjectFilter === subj && <CheckCircle className="h-3 w-3 text-indigo-650" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Cap selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-755">
                <span>{t.maxPriceLabel}</span>
                <span className="text-indigo-700 font-extrabold font-mono">
                  {maxPrice} Tk
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                <span>{lang === "en" ? "FREE" : "ফ্রি"}</span>
                <span>250 Tk</span>
                <span>500 Tk</span>
              </div>
            </div>

            {/* Institution select */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">{t.institutionLabel}</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full rounded-lg text-xs font-bold border border-slate-200 px-2.5 py-2 text-slate-700 bg-white focus:outline-none"
              >
                <option value="All">{lang === "en" ? "All Schools / Boards" : "সকল শিক্ষা প্রতিষ্ঠান"}</option>
                {institutions.filter(inst => inst !== "All").map((inst) => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>

            {/* Rating selection bar */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">{t.starRatingLabel}</label>
              <div className="grid grid-cols-4 gap-1">
                {[0, 4.0, 4.6, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`rounded-lg py-1.5 text-[10px] font-black text-center transition cursor-pointer ${
                      minRating === stars
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {stars === 0 ? (lang === "en" ? "Any" : "সব") : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Note grids, sorting toolbar */}
        <div className="flex-1 space-y-6">
          
          {/* Sorting toolbar line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-100/50 border border-slate-200 rounded-xl p-3 px-4 gap-3">
            <span className="text-xs text-slate-500 font-extrabold flex items-center gap-1.5">
              <GraduationCap className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
              <span>{t.showingCurated.replace("{count}", String(filteredNotes.length))}</span>
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-extrabold flex items-center gap-0.5 whitespace-nowrap">
                <ArrowUpDown className="h-3 w-3 text-slate-400" />
                {lang === "en" ? "Sort By:" : "ক্রম সাজান:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg text-xs font-bold border border-slate-200 px-3 py-1.5 text-slate-700 bg-white cursor-pointer focus:outline-none"
                id="listing-sort-select"
              >
                <option value="popular">{lang === "en" ? "Popularity" : "জনপ্রিয় কন্টেন্ট"}</option>
                <option value="newest">{lang === "en" ? "Newest" : "নতুন আপলোড"}</option>
                <option value="rating-desc">{lang === "en" ? "Top Rated" : "সর্বোত্তম রেটিং"}</option>
                <option value="price-asc">{lang === "en" ? "Price: Low to High" : "মূল্য: কম থেকে বেশি"}</option>
                <option value="price-desc">{lang === "en" ? "Price: High to Low" : "মূল্য: বেশি থেকে কম"}</option>
              </select>
            </div>
          </div>

          {/* Core Results grid */}
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white" id="no-listings-warning">
              <FilterX className="h-10 w-10 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">{lang === "en" ? "No Books or Notes Found" : "কোনো বই বা নোট খুঁজে পাওয়া যায়নি"}</h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs font-medium">
                {lang === "en" 
                  ? "We couldn't match any results for your active filters. Try clearing filters or revising subjects." 
                  : "আপনার বাছাইকৃত ফিল্টার অনুযায়ী কোনো কন্টেন্ট মেলেনি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।"}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 rounded-xl bg-indigo-650 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-750 transition cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              id="listing-grid-container"
            >
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onViewDetails={onViewDetails}
                  onAddToCart={(itemNote, e) => onAddToCart(itemNote, e)}
                  isInCart={cartIds.includes(note.id)}
                  lang={lang}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
