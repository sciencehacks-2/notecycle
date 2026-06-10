import React from "react";
import { BookOpen, ShoppingCart, User, Landmark, PlusCircle, Compass, Shield, Languages } from "lucide-react";
import { CartItem } from "../types";
import { Language, translations } from "../translations";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  setCartOpen: (open: boolean) => void;
  balance: number;
  lang: Language;
  setLang: (lang: Language) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cart,
  setCartOpen,
  balance,
  lang,
  setLang,
  isAdmin,
  setIsAdmin
}: NavbarProps) {
  const t = translations[lang];

  // Configure navigation entries dynamically
  const tabs = [
    { id: "home", label: t.tabHome, icon: Compass },
    { id: "listings", label: t.tabExplore, icon: BookOpen },
    { id: "sell", label: t.tabSell, icon: PlusCircle },
    { id: "hub", label: t.tabHub, icon: User }
  ];

  // Append Admin tab if verified
  if (isAdmin) {
    tabs.push({ id: "admin", label: t.tabAdmin, icon: Shield });
  }

  const handleToggleAdmin = () => {
    const nextState = !isAdmin;
    setIsAdmin(nextState);
    if (nextState) {
      alert(lang === "en" ? "Logged in as System Administrator!" : "সিস্টেম এডমিন হিসেবে লগইন করা হয়েছে!");
      setCurrentTab("admin");
    } else {
      alert(lang === "en" ? "Logged out from Administrator view." : "এডমিন ভিউ থেকে লগআউট করা হয়েছে।");
      setCurrentTab("home");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Aspect */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="flex cursor-pointer items-center space-x-2.5 group"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-transform group-hover:scale-105 shadow-md shadow-indigo-600/10">
            <BookOpen className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-950">
              {t.appName}<span className="text-indigo-600">{t.appSubName}</span>
            </span>
            <span className="block text-[9.5px] font-bold tracking-wider uppercase text-slate-400">
              {t.shareKnowledge}
            </span>
          </div>
        </div>

        {/* Global Nav Paths */}
        <nav className="hidden md:flex items-center space-x-1" id="main-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs lg:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-black"
                    : "text-slate-600 hover:bg-indigo-50/40 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Suite */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5" id="nav-actions">
          
          {/* 1. Language Swapping Element */}
          <div className="flex items-center border border-slate-200 bg-slate-50/80 rounded-lg p-1" id="lang-switcher">
            <Languages className="h-3.5 w-3.5 text-slate-400 mx-1 secret-icon hide-sm" />
            <button
              onClick={() => setLang("en")}
              className={`px-1.5 py-0.5 rounded text-[10.5px] font-extrabold transition ${
                lang === "en" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("bn")}
              className={`px-1.5 py-0.5 rounded text-[10.5px] font-extrabold transition ${
                lang === "bn" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              বাং
            </button>
          </div>

          {/* 2. Admin Log-In simulation lock switch */}
          <button
            onClick={handleToggleAdmin}
            id="admin-login-switch"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10.5px] font-black tracking-tight border transition ${
              isAdmin 
                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" 
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Shield className={`h-3.5 w-3.5 ${isAdmin ? "text-rose-600 fill-rose-600/10" : "text-slate-400"}`} />
            <span className="hidden sm:inline">
              {isAdmin ? (lang === "en" ? "Admin Mode Active" : "এডমিন মোড চালু") : (lang === "en" ? "Login as Admin" : "এডমিন লগইন")}
            </span>
          </button>

          {/* 3. Credits Balance Pill */}
          <div 
            onClick={() => setCurrentTab("hub")}
            className="hidden sm:flex items-center space-x-2 rounded-xl bg-slate-50 border border-slate-150 px-3 py-1 cursor-pointer hover:bg-slate-100 transition-colors"
            id="nav-balance"
          >
            <Landmark className="h-4 w-4 text-indigo-600" />
            <div className="text-right">
              <p className="text-[8.5px] uppercase font-black text-slate-400 leading-none">{t.balance}</p>
              <p className="text-xs font-black text-slate-800 leading-tight">
                {lang === "en" ? `$${balance.toFixed(2)}` : `${Math.round(balance * 110)} ${t.currency}`}
              </p>
            </div>
          </div>

          {/* 4. Cart icon */}
          <button
            id="btn-cart-toggle"
            onClick={() => setCartOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-extrabold text-white shadow-sm animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Bar representation */}
      <div className="flex md:hidden border-t border-slate-100 bg-white px-2 py-1 justify-around text-slate-500" id="mobile-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                isActive ? "text-indigo-700 font-extrabold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 mb-0.5 ${isActive ? "text-indigo-600" : "text-slate-450"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
