import React, { useState } from "react";
import { Search, Sparkles, BookOpen, GraduationCap, DollarSign } from "lucide-react";
import { Language, translations } from "../translations";

interface HeroProps {
  onSearch: (query: string) => void;
  setCurrentTab: (tab: string) => void;
  availableSubjects: string[];
  onSelectSubject: (subject: string) => void;
  lang: Language;
}

export default function Hero({
  onSearch,
  setCurrentTab,
  availableSubjects,
  onSelectSubject,
  lang
}: HeroProps) {
  const [localSearch, setLocalSearch] = useState("");
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    setCurrentTab("listings");
  };

  const handleQuickSubject = (subj: string) => {
    onSelectSubject(subj);
    setCurrentTab("listings");
  };

  const translateSubject = (subj: string) => {
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

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white py-12 sm:py-20" id="hero-section">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
      <div className="absolute right-1/4 top-1/3 -z-10 h-96 w-96 rounded-full bg-blue-50/50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          
          {/* Tagline pills with NCTB emphasis */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 border border-indigo-150 px-4 py-1.5 text-xs font-black text-indigo-800 mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin-once" />
            <span>{t.taglinePill}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-tight">
            {t.heroTitlePart1}<span className="text-indigo-650 inline-block">{t.heroTitlePart2}</span>,<br />
            {t.heroTitlePart3}<span className="relative inline-block text-slate-950 mt-1">
              {t.heroTitleSubtitle}
              <span className="absolute bottom-1 left-0 h-2 w-full bg-indigo-400/25 -z-10 rounded-full" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
            {t.heroDescription}
          </p>

          {/* Majestic Search Bar */}
          <form 
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-2xl px-2"
            id="hero-search-form"
          >
            <div className="relative flex items-center rounded-2xl bg-white p-1.5 shadow-xl shadow-indigo-600/5 border border-slate-200 transition-shadow focus-within:shadow-indigo-600/10">
              <div className="flex h-12 w-12 items-center justify-center text-slate-400 pl-2">
                <Search className="h-5 w-5 text-indigo-650" />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t.heroSearchPlaceholder}
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm border-none font-medium px-2"
              />
              <button
                type="submit"
                id="search-submit"
                className="ml-2 rounded-xl bg-indigo-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-97 transition-all cursor-pointer"
              >
                {t.heroSearchBtn}
              </button>
            </div>
          </form>

          {/* Quick Filter Subject Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto px-4 items-center">
            <span className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider py-1.5 shrink-0">
              {t.quickSubjects}
            </span>
            {availableSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleQuickSubject(subject)}
                className="rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200/60 hover:border-indigo-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-700 transition"
              >
                {translateSubject(subject)}
              </button>
            ))}
          </div>

          {/* Standard stats breakdown */}
          <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-xs grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-y-0 sm:divide-x" id="stats-block">
            <div className="flex flex-col items-center justify-center p-5 text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-1.5 shadow-inner">
                <BookOpen className="h-4.5 w-4.5" />
              </span>
              <span className="text-xl font-black text-slate-900 tracking-tight">{t.statsBooks}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-5 text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-1.5 shadow-inner">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="text-xl font-black text-slate-900 tracking-tight">{t.statsStudents}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-5 text-center font">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-1.5 shadow-inner">
                <DollarSign className="h-4.5 w-4.5" />
              </span>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {t.statsEarnings}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
