import React, { useState, useMemo } from "react";
import { INITIAL_NOTES } from "./data";
import { Note, CartItem } from "./types";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ListingGrid from "./components/ListingGrid";
import Dashboard from "./components/Dashboard";
import NoteDetailsModal from "./components/NoteDetailsModal";
import CheckoutModal from "./components/CheckoutModal";
import MyHub from "./components/MyHub";
import AdminPanel from "./components/AdminPanel";
import NoteCard from "./components/NoteCard";
import { Language, translations } from "./translations";
import { ShoppingBag, ShieldCheck, X, ChevronRight, Bookmark, BookOpen } from "lucide-react";

export default function App() {
  // Main Navigation state
  const [currentTab, setCurrentTab] = useState<string>("home");

  // Bilingual and authentication state
  const [lang, setLang] = useState<Language>("bn");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const t = translations[lang];

  // Core Persistent State
  const [allNotes, setAllNotes] = useState<Note[]>(INITIAL_NOTES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // User Workspace States
  const [balance, setBalance] = useState<number>(45.00); // Pre-funded credits
  const [purchasedNoteIds, setPurchasedNoteIds] = useState<string[]>(["2", "3"]); // Pre-owned textbooks for immediate reading sandbox

  // Unified Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string | undefined>(undefined);

  // Derivations
  const cartIds = useMemo(() => cart.map((i) => i.id), [cart]);
  
  const purchasedNotes = useMemo(() => {
    return allNotes.filter((n) => purchasedNoteIds.includes(n.id));
  }, [allNotes, purchasedNoteIds]);

  const sellerNotes = useMemo(() => {
    return allNotes.filter((n) => n.sellerEmail === "student@notecycle.edu.bd" || n.sellerEmail === "me@example.com");
  }, [allNotes]);

  const availableSubjects = useMemo(() => {
    const subjectsSet = new Set(allNotes.map((n) => n.subject));
    return Array.from(subjectsSet);
  }, [allNotes]);

  // Handle addition to shopping cart
  const handleAddToCart = (note: Note, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (purchasedNoteIds.includes(note.id)) {
      alert(lang === "en" 
        ? "You already own this package! Go to My Hub to read or download." 
        : "আপনি ইতিমধ্যেই বইটি সংগ্রহ করেছেন! পড়তে সরাসরি আপনার প্রোফাইলে যান।");
      return;
    }

    if (cartIds.includes(note.id)) {
      setCartOpen(true);
      return;
    }

    const newItem: CartItem = {
      id: note.id,
      title: note.title,
      titleBn: note.titleBn,
      price: note.price,
      subject: note.subject,
      subjectBn: note.subjectBn,
      author: note.author,
      authorBn: note.authorBn
    };

    setCart([...cart, newItem]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Add customized listed material
  const handleAddNewListing = (note: Note) => {
    setAllNotes([note, ...allNotes]);
  };

  // Remove listed notes
  const handleRemoveListing = (id: string) => {
    const updated = allNotes.filter((n) => n.id !== id);
    setAllNotes(updated);
  };

  // Purchase complete handle
  const handlePurchaseSuccess = (purchasedIds: string[]) => {
    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    const platformFee = subtotal > 0 ? 0.99 : 0;
    const total = subtotal + platformFee;

    // Direct student ledger debit simulation
    if (balance >= total) {
      setBalance((prev) => prev - total);
    }

    const updatedPurchased = Array.from(new Set([...purchasedNoteIds, ...purchasedIds]));
    setPurchasedNoteIds(updatedPurchased);

    // Increment downloads of sellers notes as interactive feedback loops
    const updatedNotes = allNotes.map((note) => {
      if (purchasedIds.includes(note.id)) {
        return {
          ...note,
          downloadCount: note.downloadCount + 1,
          ratingCount: note.ratingCount + Math.floor(Math.random() * 2)
        };
      }
      return note;
    });
    setAllNotes(updatedNotes);
  };

  // Trigger search term from homepage
  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab("listings");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleSelectSubject = (subject: string) => {
    setSubjectFilter(subject);
    setSearchQuery("");
    setCurrentTab("listings");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSubjectFilter(undefined);
  };

  const translateVal = (val: number) => {
    return `${Math.round(val)} ${t.currency}`;
  };

  const currentCartTotal = cart.reduce((s, c) => s + c.price, 0);
  const platformFeeValue = currentCartTotal > 0 ? 0.99 : 0;
  const grandTotalValue = currentCartTotal + platformFeeValue;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800" id="notecycle-root">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        cart={cart}
        setCartOpen={setCartOpen}
        balance={balance}
        lang={lang}
        setLang={setLang}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* 2. Main Tab router switches */}
      <main className="flex-grow">
        
        {currentTab === "home" && (
          <div className="animate-fade-in" id="home-view">
            {/* Hero Banner Grid container */}
            <Hero
              onSearch={handleHeroSearch}
              setCurrentTab={setCurrentTab}
              availableSubjects={availableSubjects}
              onSelectSubject={handleSelectSubject}
              lang={lang}
            />

            {/* Featured textbooks / note cards section */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white border-t border-slate-150" id="featured-listings-section">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1.5 animate-pulse">
                    <Bookmark className="h-4 w-4" />
                    <span>{lang === "en" ? "Top Curriculum Picks" : "সেরা বোর্ড সহায়িকা ও নোট"}</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-905 tracking-tight mt-1">
                    {lang === "en" ? "Highly Reviewed NCTB Materials" : "জনপ্রিয় শ্রেণীর পাঠ্যবই ও নোট"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold leading-relaxed">
                    {lang === "en" 
                      ? "Directly mapped to board curriculum guidelines from certified tutors and top schools." 
                      : "৬ষ্ঠ থেকে ১০ম শ্রেণীর বোর্ড বইয়ের নির্ভুল অধ্যায় ভিত্তিক সমাধান এবং চমৎকার সাজানো গোছানো ক্লাস নোট।"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    handleResetSearch();
                    setCurrentTab("listings");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  id="btn-all-listings"
                  className="rounded-xl bg-slate-900 text-white font-bold text-xs px-5 py-3.5 hover:bg-slate-800 transition shadow-sm cursor-pointer whitespace-nowrap self-start"
                >
                  {lang === "en" ? "See All Catalogs" : "সকল বই ও নোট দেখুন"}
                </button>
              </div>

              {/* Grid books list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="top-selling-grid">
                {allNotes.slice(0, 4).map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onViewDetails={(noteItem) => setSelectedNote(noteItem)}
                    onAddToCart={(noteItem, e) => handleAddToCart(noteItem, e)}
                    isInCart={cartIds.includes(note.id)}
                    lang={lang}
                  />
                ))}
              </div>
            </section>

            {/* Features Info Matrix */}
            <Features setCurrentTab={setCurrentTab} lang={lang} />
          </div>
        )}

        {currentTab === "listings" && (
          <div className="animate-fade-in" id="listings-view">
            <ListingGrid
              notes={allNotes}
              onViewDetails={(noteItem) => setSelectedNote(noteItem)}
              onAddToCart={(noteItem, e) => handleAddToCart(noteItem, e)}
              cartIds={cartIds}
              initialSearchQuery={searchQuery}
              onResetSearch={handleResetSearch}
              selectedSubjectFilter={subjectFilter}
              onSelectSubjectFilter={setSubjectFilter}
              lang={lang}
            />
          </div>
        )}

        {currentTab === "sell" && (
          <div className="animate-fade-in" id="sell-view">
            <Dashboard
              listedNotes={sellerNotes}
              onAddNewListing={handleAddNewListing}
              onRemoveListing={handleRemoveListing}
              balance={balance}
              lang={lang}
            />
          </div>
        )}

        {currentTab === "hub" && (
          <div className="animate-fade-in" id="hub-view">
            <MyHub
              purchasedNotes={purchasedNotes}
              listedNotes={sellerNotes}
              balance={balance}
              lang={lang}
            />
          </div>
        )}

        {currentTab === "admin" && (
          <div className="animate-fade-in" id="admin-view">
            <AdminPanel
              notes={allNotes}
              onAddNewListing={handleAddNewListing}
              onRemoveListing={handleRemoveListing}
              lang={lang}
            />
          </div>
        )}

      </main>

      {/* 3. Sliding Shopping Cart side drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true" id="cart-side-drawer">
          <div className="absolute inset-0 overflow-hidden">
            {/* Click overlay backdrop to close drawer */}
            <div 
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-slate-900/60 transition-opacity backdrop-blur-xs" 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ease-in-out">
                <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-150">
                  
                  {/* Cart Title header */}
                  <div className="border-b border-slate-200 p-5 flex items-center justify-between bg-slate-50">
                    <h3 className="text-sm sm:text-base font-black text-slate-950 flex items-center gap-2" id="slide-over-title">
                      <ShoppingBag className="h-5 w-5 text-indigo-650" />
                      <span>{lang === "en" ? "Study Checkout Cart" : "স্টাডি বুকশেলফ ঝুড়ি"}</span>
                    </h3>
                    <button 
                      onClick={() => setCartOpen(false)}
                      id="close-cart-btn"
                      className="rounded-full p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Cart items list scrolling drawer area */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3" id="empty-cart-indicator">
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">{lang === "en" ? "Your study basket is empty" : "আপনার বুকশেলফ ঝুড়ি খালি"}</h4>
                        <p className="text-[11px] text-slate-450 max-w-xs leading-relaxed font-semibold">
                          {lang === "en" 
                            ? "Explore the curriculum collection, filter by board topics, and pick your textbooks!" 
                            : "আমাদের ৬ষ্ঠ-১০ম শ্রেণীর স্টাডি নোটের তালিকা দেখুন, ক্লাস এবং বিষয়ের মাধ্যমে ফিল্টার করুন।"}
                        </p>
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            setCurrentTab("listings");
                          }}
                          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 transition cursor-pointer"
                        >
                          {lang === "en" ? "Explore Catalogs" : "বই ও নোট দেখুন"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {cart.map((item) => {
                          const activeT = lang === "bn" && item.titleBn ? item.titleBn : item.title;
                          const activeS = lang === "bn" && item.subjectBn ? item.subjectBn : item.subject;
                          return (
                            <div 
                              key={item.id} 
                              className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex justify-between items-center gap-3 animate-fade-in"
                            >
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                                  {activeT}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                                  {activeS} • {lang === "en" ? item.author : (item.authorBn || item.author)}
                                </p>
                              </div>
                              
                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-slate-900 font-mono block">
                                  {item.price === 0 ? (lang === "en" ? "FREE" : "ফ্রি") : translateVal(item.price)}
                                </span>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-[10px] font-black text-rose-500 hover:underline mt-1 block cursor-pointer"
                                >
                                  {lang === "en" ? "Remove" : "বাদ দিন"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Cart totals & Check out Actions footer */}
                  {cart.length > 0 && (
                    <div className="border-t border-slate-200 p-5 bg-slate-50 space-y-4">
                      
                      {/* Price matrix */}
                      <div className="space-y-2 text-xs font-semibold text-slate-600">
                        <div className="flex justify-between">
                          <span>{lang === "en" ? "Study Materials Subtotal" : "বই ও নোটের মোট মূল্য"}</span>
                          <span className="font-mono text-slate-900">{translateVal(currentCartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === "en" ? "Platform Verification fee" : "বোর্ড কারিকুলাম কমিশন ও চার্জ"}</span>
                          <span className="font-mono text-slate-900">{translateVal(platformFeeValue)}</span>
                        </div>
                        <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-150">
                          <span>{lang === "en" ? "Grand total due" : "সর্বমোট প্রদেয় টাকা"}</span>
                          <span className="font-mono text-indigo-700 text-sm sm:text-base">
                            {translateVal(grandTotalValue)}
                          </span>
                        </div>
                      </div>

                      {/* Call-to-actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            setCheckoutOpen(true);
                          }}
                          id="btn-cart-checkout"
                          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-750 font-bold text-xs py-3.5 text-white shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{lang === "en" ? "Proceed to Checkout" : "নিরাপদ পেমেন্ট সম্পন্ন করুন"}</span>
                          <ChevronRight className="h-4.5 w-4.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(lang === "en" ? "Are you sure you want to empty your shopping basket?" : "আপনার শপিং কার্ট খালি করতে চাচ্ছেন?")) {
                              setCart([]);
                            }
                          }}
                          id="btn-clear-cart"
                          className="w-full rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs py-2.5 text-slate-500 transition cursor-pointer text-center"
                        >
                          {lang === "en" ? "Empty study basket" : "কার্ট পরিষ্কার করুন"}
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        <ShieldCheck className="h-4 w-4 text-indigo-650" />
                        <span>{lang === "en" ? "All materials NCTB Verified" : "সকল বই ও নোট এনসিটিবি ভেরিফাইড"}</span>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Full Detailed Product View Modal */}
      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onAddToCart={(itemNote) => {
            handleAddToCart(itemNote);
            setSelectedNote(null);
          }}
          isInCart={cartIds.includes(selectedNote.id)}
          isPurchased={purchasedNoteIds.includes(selectedNote.id)}
          onDownload={(noteItem) => {
            alert(lang === "en" 
              ? `Direct secure download triggered for: ${noteItem.title}.pdf (3.5MB). Check your downloads.` 
              : `বইটির পিডিএফ ডাউনলোড শুরু হয়েছে: ${noteItem.title}.pdf (৩.৫ মেগাবাইট)। লোকাল ড্রাইভে সংরক্ষণ করুন।`);
          }}
          lang={lang}
        />
      )}

      {/* 5. Comprehensive Multi-step Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onClearCart={() => setCart([])}
          onPurchaseSuccess={(ids) => {
            handlePurchaseSuccess(ids);
            setCurrentTab("hub");
          }}
          balance={balance}
          lang={lang}
        />
      )}

      {/* 6. Main Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-12" id="notecycle-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
                <BookOpen className="h-4.5 w-4.5 stroke-[2.5]" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">notecycle</span>
            </div>
            
            <p className="max-w-sm text-slate-400 font-semibold leading-relaxed font-sans">
              {lang === "en"
                ? '"Recycle Your Knowledge, Cycle Your Notes." A digital peer-to-peer textbook platform built exclusively to enhance resource accessibility, security, and student micro-incomes.'
                : '"আপনার জ্ঞান শেয়ার করুন, পড়াশোনা সহজ করুন।" বাংলাদেশের মাধ্যমিক ছাত্রছাত্রীদের জন্য সাশ্রয়ী মূল্যে পাঠ্যবই ও ক্লাস নোট সংগ্রহের নির্ভরযোগ্য প্ল্যাটফর্ম।'}
            </p>
          </div>

          {/* Directory Column */}
          <div className="space-y-3 font-semibold">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px] mb-2">
              {lang === "en" ? "Curriculum Directories" : "শ্রেণী সূচিপত্র সমূহ"}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => { handleResetSearch(); setSubjectFilter("Mathematics"); setCurrentTab("listings"); }} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  {lang === "en" ? "Class 9-10 Higher Math" : "৯ম-১০ম শ্রেণী উচ্চতর গণিত"}
                </button>
              </li>
              <li>
                <button onClick={() => { handleResetSearch(); setSubjectFilter("Physics"); setCurrentTab("listings"); }} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  {lang === "en" ? "Class 9-10 Physics Guide" : "৯ম-১০ম শ্রেণী পদার্থবিজ্ঞান নোট"}
                </button>
              </li>
              <li>
                <button onClick={() => { handleResetSearch(); setSubjectFilter("Science"); setCurrentTab("listings"); }} className="hover:text-indigo-400 transition cursor-pointer text-left">
                  {lang === "en" ? "Class 6-8 Board Science" : "৬ষ্ঠ-৮ম শ্রেণী বোর্ড বিজ্ঞান নোট"}
                </button>
              </li>
            </ul>
          </div>

          {/* Safety rules Column */}
          <div className="space-y-3 font-semibold">
            <h4 className="text-white font-black uppercase tracking-wider text-[11px] mb-2">
              {lang === "en" ? "Academic Honesty" : "কোড অফ অনার ও সহায়তা"}
            </h4>
            <ul className="space-y-1.5">
              <li><span className="text-slate-400">{lang === "en" ? "Copyright & Watermark Policy" : "কপিরাইট জেনুইন পলিসি"}</span></li>
              <li><span className="text-slate-400">{lang === "en" ? "bKash Refund Guidelines" : "বিকাশ রিফান্ড পলিসি"}</span></li>
              <li><span className="text-slate-400">{lang === "en" ? "Verify Student Profile" : "শিক্ষার্থী ভেরিফিকেশন এফএকিউ"}</span></li>
            </ul>
          </div>

        </div>

        {/* Brand Copyright */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-500 font-semibold">
          <span>{lang === "en" ? "© 2026 Notecycle Marketplace Inc. All rights reserved." : "© ২০২৬ নোটসাইকেল বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।"}</span>
          <span className="mt-2 sm:mt-0">
            {lang === "en" 
              ? "Proudly engineered for modern educational boards and secondary student cohorts." 
              : "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) সহায়ক একটি বেসরকারি উদ্যোগ।"}
          </span>
        </div>
      </footer>

    </div>
  );
}
