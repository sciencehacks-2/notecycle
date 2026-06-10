import React, { useState } from "react";
import { X, Star, User, Send, Download, BookOpen, FileLock, ShoppingCart } from "lucide-react";
import { Note, Review } from "../types";
import { MOCK_REVIEWS, SUBJECT_COLORS } from "../data";
import { Language, translations } from "../translations";

interface NoteDetailsModalProps {
  note: Note;
  onClose: () => void;
  onAddToCart: (note: Note) => void;
  isInCart: boolean;
  isPurchased: boolean;
  onDownload: (note: Note) => void;
  lang: Language;
}

export default function NoteDetailsModal({
  note,
  onClose,
  onAddToCart,
  isInCart,
  isPurchased,
  onDownload,
  lang
}: NoteDetailsModalProps) {
  const t = translations[lang];

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS[note.id] || []);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  const activeSubject = lang === "bn" && note.subjectBn ? note.subjectBn : note.subject;
  const activeTitle = lang === "bn" && note.titleBn ? note.titleBn : note.title;
  const activeInstitution = lang === "bn" && note.institutionBn ? note.institutionBn : note.institution;
  const activeAuthor = lang === "bn" && note.authorBn ? note.authorBn : note.author;
  const activeDescription = lang === "bn" && note.descriptionBn ? note.descriptionBn : note.description;
  const activePreviewSnippet = lang === "bn" && note.previewSnippetBn ? note.previewSnippetBn : note.previewSnippet;

  const subjectStyling = SUBJECT_COLORS[note.subject] || {
    bg: "bg-slate-50 text-slate-705 border-slate-200",
    text: "text-slate-700",
    border: "border-slate-200"
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const added: Review = {
      id: `new-r-${Date.now()}`,
      username: lang === "en" ? "You (Active Student)" : "আপনি (সক্রিয় শিক্ষার্থী)",
      rating: newRating,
      comment: newReviewText,
      date: new Date().toISOString().split("T")[0]
    };

    const updatedReviews = [added, ...reviews];
    setReviews(updatedReviews);
    setNewReviewText("");
    
    MOCK_REVIEWS[note.id] = updatedReviews;
  };

  const renderPrice = () => {
    if (note.price === 0) return lang === "en" ? "FREE" : "ফ্রি";
    return `${Math.round(note.price)} ${t.currency}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-xs" 
        aria-hidden="true" 
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl transition-all border border-slate-105 flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
          
          {/* Left panel: Document Preview & Watermark */}
          <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                  <span>{lang === "en" ? "Curriculum Preview Card" : "এনসিটিবি পাঠ্যবই প্রিভিউ"}</span>
                </span>
                <span className="text-[10px] font-black text-indigo-850 bg-indigo-50 px-2 rounded-md border border-indigo-100 uppercase">
                  {note.fileType} format
                </span>
              </div>

              {/* Watermarked Document Container */}
              <div className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-inner select-none font-sans overflow-hidden">
                {/* Diagonal repeating watermarks */}
                <div className="pointer-events-none absolute inset-0 flex flex-wrap justify-between items-center opacity-5 gap-x-12 Rotate-12 h-[200%] w-[150%] -left-1/4 -top-1/4">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span key={i} className="text-indigo-700 text-[10px] font-black rotate-12 tracking-wider transform select-none uppercase">
                      {lang === "en" ? "NOTECYCLE PREVIEW" : "নোটসাইকেল প্রিভিউ"}
                    </span>
                  ))}
                </div>

                {/* Simulated Document content block */}
                <div className="space-y-3 prose max-w-none text-[11px] text-slate-700 leading-relaxed font-sans font-medium">
                  {activePreviewSnippet && activePreviewSnippet.map((line, idx) => {
                    if (line.startsWith("##")) {
                      return <h5 key={idx} className="font-black text-slate-900 border-b border-slate-100 pb-1 mt-3 text-xs">{line.replace("##", "")}</h5>;
                    } else if (line.startsWith("###")) {
                      return <h6 key={idx} className="font-bold text-slate-800 text-[11px]">{line.replace("###", "")}</h6>;
                    } else {
                      return <p key={idx} className={line.trim() === "" ? "h-1" : "text-slate-650"}>{line}</p>;
                    }
                  })}
                </div>

                {/* Blur / Protection Barrier at the bottom */}
                {!isPurchased && (
                  <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col justify-end p-5 text-center">
                    <div className="flex items-center justify-center p-2 bg-amber-50 border border-amber-200 rounded-xl space-x-2 text-[11px] font-black text-amber-800 shadow-sm animate-pulse max-w-xs mx-auto">
                      <FileLock className="h-4 w-4 shrink-0" />
                      <span>
                        {lang === "en" 
                          ? `Remaining ${note.pageCount - 2} Pages Blurry` 
                          : `বাকি ${note.pageCount - 2} টি পৃষ্ঠা নিরাপত্তা লক করা`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-snug font-bold">
                      {lang === "en" 
                        ? "Unlock full lecture sheets, citations, and formulas instantly upon purchase." 
                        : "সম্পূর্ণ কন্টেন্ট পড়তে এখনই সংগ্রহ করুন ও পড়া চালিয়ে যান।"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Downstream preview footer */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>{lang === "en" ? "Publisher/Author:" : "অনুমোদিত উৎসব:"} <span className="font-extrabold text-slate-700">{activeAuthor}</span></span>
              <span>{note.pageCount} {lang === "en" ? "Pages Total" : "টি পৃষ্ঠা"}</span>
            </div>
          </div>

          {/* Right panel: Buying actions, reviews */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {/* Modal close icon */}
            <button 
              onClick={onClose}
              id="close-modal-btn"
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              {/* Categories metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3 mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${subjectStyling.bg}`}>
                  {activeSubject}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">{activeInstitution}</span>
              </div>

              {/* Title heading */}
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug" id="modal-title">
                {activeTitle}
              </h3>
              
              <div className="mt-1.5 flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 font-bold font-mono">
                  {lang === "en" ? "Course Code" : "কারিকুলাম কোড"}: {lang === "bn" && note.courseBn ? note.courseBn : note.course}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                  <span className="font-black">{note.rating.toFixed(1)}</span>
                  <span className="text-slate-400 ml-0.5">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  {lang === "en" ? "Detailed Overview" : "বিস্তারিত বইয়ের তথ্য"}
                </h4>
                <p className="text-xs text-slate-605 leading-relaxed font-semibold">{activeDescription}</p>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Reviews subsection */}
              <div className="mt-6 border-t border-slate-150 pt-5">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 mb-3 block">
                  {lang === "en" ? `Student Reviews (${reviews.length})` : `শিক্ষার্থীদের মন্তব্য ও রেটিং (${reviews.length})`}
                </h4>
                
                <div className="space-y-3 overflow-y-auto max-h-[140px] pr-1.5 scrollbar-thin">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      {lang === "en" ? "No student reviews logged yet." : "কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!"}
                    </p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-805 flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-400" />
                            {rev.username}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono">{rev.date}</span>
                        </div>
                        <div className="mt-1 flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, step) => (
                            <Star 
                              key={step} 
                              className={`h-3 w-3 ${step < rev.rating ? "fill-current" : ""}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[11.5px] text-slate-600 mt-1 font-medium leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Inline Review form */}
                <form onSubmit={handleAddReview} className="mt-4 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-400 font-black uppercase block mb-1">
                      {lang === "en" ? "Leave feedback" : "নতুন কমেন্ট করুন"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder={lang === "en" ? "I loved the NCTB illustrations..." : "বইটি সম্পর্কে মন্তব্য লিখুন..."}
                      className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-450 focus:outline-none"
                    />
                  </div>
                  <div className="w-16">
                    <label className="text-[9px] text-slate-400 font-black uppercase block mb-1">Rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full text-xs rounded-lg border border-slate-200 px-1.5 py-2 font-bold text-slate-700 bg-white"
                    >
                      <option value="5">5 ★</option>
                      <option value="4">4 ★</option>
                      <option value="3">3 ★</option>
                      <option value="2">2 ★</option>
                      <option value="1">1 ★</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-750 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Footer Pricing / Purchase actions */}
            <div className="mt-6 pt-5 border-t border-slate-150 flex items-center justify-between bg-slate-50 -mx-6 -mb-6 p-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">{lang === "en" ? "Book Price" : "বইটির প্রদেয় মূল্য"}</span>
                <span className="text-xl sm:text-2xl font-black text-indigo-700 block tracking-tight font-mono">
                  {renderPrice()}
                </span>
              </div>

              {isPurchased ? (
                <button
                  onClick={() => onDownload(note)}
                  id={`btn-modal-dl-${note.id}`}
                  className="flex items-center space-x-2 rounded-xl bg-indigo-650 hover:bg-indigo-750 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all"
                >
                  <Download className="h-4.5 w-4.5" />
                  <span>{lang === "en" ? "Download Notes" : "পিডিএফ সংগ্রহ করুন"}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isInCart) onAddToCart(note);
                  }}
                  id={`btn-modal-cart-${note.id}`}
                  disabled={isInCart}
                  className={`flex items-center space-x-2 rounded-xl px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold transition-all ${
                    isInCart
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                  }`}
                >
                  <ShoppingCart className="h-4.5 w-4.5" />
                  <span>{isInCart ? t.inCartBtn : (note.price === 0 ? (lang === "en" ? "Collect Free" : "সংগ্রহ করুন") : t.buyBtn)}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
