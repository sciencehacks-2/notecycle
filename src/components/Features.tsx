import React from "react";
import { UploadCloud, ShieldCheck, CreditCard, ChevronRight, Share2, Eye, Award } from "lucide-react";
import { Language, translations } from "../translations";

interface FeaturesProps {
  setCurrentTab: (tab: string) => void;
  lang: Language;
}

export default function Features({ setCurrentTab, lang }: FeaturesProps) {
  const t = translations[lang];

  const stepsBn = [
    {
      id: "step-1",
      number: "০১",
      title: "আপলোড ও লিস্টিং",
      description: "আপনার তৈরি চ্যাপ্টার ভিত্তিক গাইড, সাজেশন্স বা প্রশ্ন সমাধান আপলোড করুন। নিজের নির্ধারণ করা সাশ্রয়ী মূল্য সেট করুন।",
      icon: UploadCloud,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    },
    {
      id: "step-2",
      number: "০২",
      title: "নিরাপদ ভেরিফিকেশন",
      description: "আমাদের কারিকুলাম সিস্টেম প্রতিটি ফাইলের জন্য স্বয়ংক্রিয় প্রিভিউ ওয়াটারমার্ক এবং সুরক্ষিত ব্লার মেইনটেইন করে।",
      icon: ShieldCheck,
      color: "bg-sky-500/10 text-sky-600 border-sky-100",
    },
    {
      id: "step-3",
      number: "০৩",
      title: "ক্রেডিট ও আয় উপার্জন",
      description: "কোনো পরীক্ষার্থী বা শিক্ষার্থী আপনার নোট সংগ্রহ করলেই ইনস্ট্যান্ট ওয়ালেট ব্যালেন্স ফান্ড যুক্ত হবে। যেকোনো সময় টপ-আপ করুন।",
      icon: CreditCard,
      color: "bg-violet-500/10 text-violet-600 border-violet-100",
    },
  ];

  const stepsEn = [
    {
      id: "step-1",
      number: "01",
      title: "Upload & List",
      description: "Submit your handwritten notes, board notes, or chapter summaries. Set your own fair price easily.",
      icon: UploadCloud,
      color: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
    },
    {
      id: "step-2",
      number: "02",
      title: "Secure Verification",
      description: "Our system prepares clean digital watermarks and safe blurry reviews for student convenience. Zero risk of theft.",
      icon: ShieldCheck,
      color: "bg-sky-500/10 text-sky-600 border-sky-100",
    },
    {
      id: "step-3",
      number: "03",
      title: "Earn Study Credit",
      description: "Get wallet balance instantly whenever an schoolmate unlocks your notes. Use balance for purchases.",
      icon: CreditCard,
      color: "bg-violet-500/10 text-violet-600 border-violet-100",
    },
  ];

  const steps = lang === "bn" ? stepsBn : stepsEn;

  const highlightsBn = [
    {
      title: "সুরক্ষিত প্রিভিউ পেজ",
      desc: "ডাউনলোড না করেই ওয়াটারমার্ক সহ মূল বই ও নোটের কন্টেন্ট ও সূচিপত্র পরখ করার চমৎকার সুযোগ।",
      icon: Eye
    },
    {
      title: "বাস্তবিক শিক্ষার্থী ও শিক্ষক",
      desc: "সকল কন্টেন্ট অভিজ্ঞ শিক্ষক অথবা প্রথম সারির মেধাবী শিক্ষার্থীদের দ্বারা প্রস্তুত ও সংশোধিত।",
      icon: Award
    },
    {
      title: "সহজ স্টাডি সার্কেল শেয়ার",
      desc: "মেসেঞ্জার বা স্টাডি গ্রুপে সরাসরি লিংক শেয়ার করে অন্য বন্ধুদের সাহায্য করুন ও রেটিং সংগ্রহ করুন।",
      icon: Share2
    }
  ];

  const highlightsEn = [
    {
      title: "Watermarked Previews",
      desc: "Our interactive viewer protects work quality while allowing buyers to inspect lessons fully.",
      icon: Eye
    },
    {
      title: "True Contributors Only",
      desc: "All resources are reviewed under official Bangladesh curriculum guidelines by qualified readers.",
      icon: Award
    },
    {
      title: "Study Group Sharing",
      desc: "Easily distribute custom URLs into your Messenger or classroom circles to secure fast reviews.",
      icon: Share2
    }
  ];

  const highlights = lang === "bn" ? highlightsBn : highlightsEn;

  return (
    <section className="bg-white py-14 sm:py-20 border-t border-slate-150" id="features-how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* How It Works Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">
            {lang === "en" ? "Three Simple Steps" : "মাত্র ৩টি সহজ পদক্ষেপ"}
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-snug">
            {lang === "en" ? "How Notecycle Cycles Knowledge" : "নোটসাইকেল যেভাবে কাজ করে"}
          </p>
          <p className="mt-3.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
            {lang === "en" 
              ? "A dedicated peer scholastic market aimed at minimizing book and note expenses in Bangladesh schools." 
              : "বাংলাদেশের মাধ্যমিক শিক্ষার্থীদের জন্য পাঠ্যপুস্তক ও নোটের সাশ্রয়ী সমাধান এবং জ্ঞান বিনিময়ের নির্ভরযোগ্য প্লাটফর্ম।"}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12" id="steps-container">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                id={step.id}
                key={step.id}
                className="relative group flex flex-col justify-between bg-white border border-slate-200/70 p-6 sm:p-7 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-100 group-hover:text-indigo-200 transition-colors font-mono">
                      {step.number}
                    </span>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${step.color} shadow-xs`}>
                      <Icon className="h-5 w-5 stroke-[2]" />
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mt-5 group-hover:text-indigo-705 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-650">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {lang === "en" ? "Let's Go" : "শুরু করুন"}
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-20 rounded-3xl bg-slate-950 p-7 sm:p-10 lg:p-14 text-white relative overflow-hidden" id="notecycle-perks">
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl opacity-20" />
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-12 items-center">
            <div className="lg:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Notecycle Perks</span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1.5 text-white leading-snug">
                {lang === "en" ? "Academic Honesty Meets Secondary Market" : "স্মার্ট শিক্ষাক্রম ও টেকসই পড়ার পরিবেশ"}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed font-semibold">
                {lang === "en" 
                  ? "We cooperate with original student authors and tutors to verify content before listing." 
                  : "আমরা ৬ষ্ঠ থেকে ১০ম শ্রেণীর শিক্ষালয়গুলোর কারিকুলাম ও নোট কোয়ালিটি যাচাই করে প্রতিটি তথ্য প্রস্তুত করি।"}
              </p>
              <button
                onClick={() => setCurrentTab("sell")}
                className="mt-5 inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-550 active:scale-95 transition-all cursor-pointer shadow-indigo-700/20 shadow-md"
              >
                <span>{lang === "en" ? "List Your Notes" : "নোট লিস্টিং এ যান"}</span>
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>

            <div className="mt-10 lg:mt-0 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex space-x-3.5 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-550/15 text-indigo-450">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white mb-1">{h.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
