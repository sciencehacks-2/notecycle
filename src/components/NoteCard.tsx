import React from "react";
import { Star, Eye, ClipboardList, GraduationCap, Download, ShieldCheck } from "lucide-react";
import { Note } from "../types";
import { SUBJECT_COLORS } from "../data";
import { Language, translations } from "../translations";

interface NoteCardProps {
  note: Note;
  onViewDetails: (note: Note) => void;
  onAddToCart: (note: Note, e: React.MouseEvent) => void;
  isInCart: boolean;
  lang: Language;
}

export default function NoteCard({
  note,
  onViewDetails,
  onAddToCart,
  isInCart,
  lang
}: NoteCardProps) {
  const t = translations[lang];

  // Subject translation helper
  const activeSubject = lang === "bn" && note.subjectBn ? note.subjectBn : note.subject;
  const activeTitle = lang === "bn" && note.titleBn ? note.titleBn : note.title;
  const activeInstitution = lang === "bn" && note.institutionBn ? note.institutionBn : note.institution;
  const activeAuthor = lang === "bn" && note.authorBn ? note.authorBn : note.author;

  const subjectStyling = SUBJECT_COLORS[note.subject] || {
    bg: "bg-slate-50 text-slate-700 border-slate-200",
    text: "text-slate-700",
    border: "border-slate-200"
  };

  // Price rendering directly in Taka
  const renderPrice = () => {
    if (note.price === 0) {
      return lang === "en" ? "FREE" : "ফ্রি";
    }
    return `${Math.round(note.price)} ${t.currency}`;
  };

  return (
    <div 
      id={`note-card-${note.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
    >
      {/* Visual Notebook Thumbnail / Cover preview */}
      <div 
        onClick={() => onViewDetails(note)}
        className="relative h-44 w-full cursor-pointer bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100 select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-white to-slate-200/20" />
        
        {/* Dynamic Stylized Notebook Cover */}
        <div className="relative z-10 w-28 h-36 rounded-r-md rounded-l-xs shadow-md transition-transform duration-300 group-hover:scale-103 group-hover:rotate-1 flex flex-col justify-between p-3 border-l-4 border-l-slate-900 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none rounded-r-md" />

          {/* Subject tag on book cover */}
          <span className="text-[7.5px] uppercase font-black tracking-widest text-indigo-300 bg-white/10 px-1 py-0.5 rounded self-start truncate max-w-full">
            {activeSubject}
          </span>

          {/* Brief title snippet for the book spine */}
          <div className="mt-1 flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-black line-clamp-3 text-slate-100 tracking-tight leading-snug">
              {activeTitle}
            </span>
          </div>

          <div className="border-t border-white/10 pt-1.5 flex justify-between items-center text-[7.5px] font-medium text-slate-300">
            <span className="truncate max-w-[50px]">{activeAuthor}</span>
            <span className="font-mono text-[6.5px] bg-white/15 px-1 py-0.2 rounded-sm text-slate-100 font-bold">
              {note.fileType}
            </span>
          </div>
        </div>

        {/* Floating action overlay on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(note);
            }}
            id={`quick-view-${note.id}`}
            className="flex items-center space-x-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-indigo-600" />
            <span>{lang === "en" ? "Preview" : "প্রিভিউ দেখুন"}</span>
          </button>
        </div>

        {/* Micro file metadata badges */}
        <div className="absolute top-2 right-2 z-10 flex space-x-1">
          <span className="rounded bg-white/95 backdrop-blur-xs px-1.5 py-0.5 text-[9.5px] font-bold text-slate-700 shadow-sm border border-slate-100 flex items-center gap-0.5">
            <ClipboardList className="h-3 w-3 text-slate-400" />
            {note.pageCount} {lang === "en" ? "pgs" : "পৃষ্ঠা"}
          </span>
        </div>

        {/* Download Count Label */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="rounded bg-slate-100/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
            <Download className="h-2.5 w-2.5 text-slate-450" />
            {lang === "en" ? `${note.downloadCount} sold` : `${note.downloadCount}টি বিক্রি`}
          </span>
        </div>

        {/* Custom official stamp for government Board Books */}
        {note.isOfficialTextbook && (
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 text-[8.5px] font-black flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3" />
              NCTB
            </span>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="cursor-pointer space-y-1.5" onClick={() => onViewDetails(note)}>
          
          {/* Tag & Institution */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${subjectStyling.bg} truncate max-w-[100px]`}>
              {activeSubject}
            </span>
            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[140px] flex items-center gap-0.5" title={activeInstitution}>
              <GraduationCap className="h-3.5 w-3.5 inline text-slate-400 shrink-0" />
              <span>{activeInstitution}</span>
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-700 min-h-[38px] tracking-tight leading-snug">
            {activeTitle}
          </h4>

          {/* Category Class marker if applicable */}
          {note.classLevel && (
            <div className="flex items-center">
              <span className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 text-[10px] font-bold">
                {lang === "en" ? note.classLevel : `${note.classLevel.replace("Class ", "")}ম শ্রেণী`}
              </span>
            </div>
          )}

          {/* Author descriptor */}
          <p className="text-[11px] text-slate-400">
            {lang === "en" ? "Source/Author: " : "উৎস/লেখক: "}<span className="text-slate-600 font-bold">{activeAuthor}</span>
          </p>

          {/* Rating summary */}
          <div className="flex items-center space-x-1 pt-1">
            <div className="flex text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="text-xs font-black text-slate-800">{note.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-medium">({note.ratingCount})</span>
          </div>
        </div>

        {/* Pricing tag & Cart action footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">{lang === "en" ? "Price" : "প্রদেয় মূল্য"}</span>
            <span className="text-sm sm:text-base font-black text-slate-950 font-mono">
              {renderPrice()}
            </span>
          </div>

          <button
            id={`btn-card-cart-${note.id}`}
            onClick={(e) => onAddToCart(note, e)}
            className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition duration-200 select-none cursor-pointer ${
              isInCart
                ? "bg-slate-100 text-slate-400 hover:bg-slate-150 cursor-not-allowed"
                : "bg-indigo-650 text-white hover:bg-indigo-750 active:scale-95 shadow-sm hover:shadow-indigo-650/10"
            }`}
            disabled={isInCart}
          >
            {isInCart ? t.inCartBtn : (note.price === 0 ? (lang === "en" ? "Collect Note" : "সংগ্রহ করুন") : t.buyBtn)}
          </button>
        </div>
      </div>
    </div>
  );
}
