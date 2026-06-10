import React, { useState } from "react";
import { X, ShoppingBag, CreditCard, Landmark, CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { CartItem } from "../types";
import { Language, translations } from "../translations";

interface CheckoutModalProps {
  cart: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onPurchaseSuccess: (purchasedIds: string[]) => void;
  balance: number;
  lang: Language;
}

export default function CheckoutModal({
  cart,
  onClose,
  onClearCart,
  onPurchaseSuccess,
  balance,
  lang
}: CheckoutModalProps) {
  const t = translations[lang];

  const [step, setStep] = useState<number>(1); // 1: Cart review, 2: Payment options, 3: Receipt
  const [paymentMethod, setPaymentMethod] = useState<string>("credits"); // 'credits', 'card'
  
  // Card input states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const platformFee = subtotal > 0 ? 0.99 : 0;
  const total = subtotal + platformFee;

  const translateVal = (val: number) => {
    return `${Math.round(val)} ${t.currency}`;
  };

  const handleNextStep = () => {
    if (step === 1 && cart.length === 0) return;
    if (step === 2) {
      if (paymentMethod === "credits" && balance < total) {
        alert(lang === "en" 
          ? "Your student credits outstanding balance is insufficient. Participate in student uploads or reset balance in profile!" 
          : "আপনার ব্যালেন্স পর্যাপ্ত নয়! কন্টেন্ট সেল করুন অথবা ওয়ালেট টপ-আপ করুন।");
        return;
      }
      // Process purchase
      onPurchaseSuccess(cart.map((item) => item.id));
      setStep(3);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="checkout-modal-title" role="dialog" aria-modal="true">
      
      {/* Black transparent overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 transition-opacity backdrop-blur-xs" 
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
          
          {/* Header */}
          <div className="border-b border-slate-100 p-5 flex items-center justify-between bg-slate-50">
            <h3 className="text-sm sm:text-base font-black text-slate-950 flex items-center gap-2 animate-fade-in" id="checkout-modal-title">
              <ShoppingBag className="h-5 w-5 text-indigo-650" />
              <span>{lang === "en" ? "Notecycle Academic Checkout" : "নোটসাইকেল একাডেমিক চেকআউট"}</span>
            </h3>
            
            <button 
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-650 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Stepper Progress bar */}
          <div className="bg-slate-50 p-2.5 px-6 flex justify-between items-center text-[10.5px] font-bold text-slate-400 border-b border-slate-200">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-indigo-700 font-extrabold" : ""}`}>
              <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] ${step >= 1 ? "bg-indigo-650 text-white" : "bg-slate-200 text-slate-600"}`}>1</span>
              <span>{lang === "en" ? "Review Cart" : "কার্ট রিভিউ"}</span>
            </div>
            <div className="h-0.5 bg-slate-200 flex-1 mx-2" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-indigo-700 font-extrabold" : ""}`}>
              <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] ${step >= 2 ? "bg-indigo-650 text-white" : "bg-slate-200 text-slate-600"}`}>2</span>
              <span>{lang === "en" ? "Billing" : "বিলিং প্রক্রিয়া"}</span>
            </div>
            <div className="h-0.5 bg-slate-200 flex-1 mx-2" />
            <div className={`flex items-center gap-1.5 ${step === 3 ? "text-indigo-700 font-extrabold" : ""}`}>
              <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] ${step === 3 ? "bg-indigo-650 text-white" : "bg-slate-200 text-slate-600"}`}>3</span>
              <span>{lang === "en" ? "Receipt" : "অনুমোদন রশিদ"}</span>
            </div>
          </div>

          {/* Scrollable Checkout Form Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Step 1: Review items list */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">
                  {lang === "en" ? "Purchase Summary" : "ক্রয়ের সারসংক্ষেপ"}
                </h4>
                
                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-450 italic">{lang === "en" ? "Cart is empty." : "শপিং কার্টটি খালি রয়েছে।"}</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {cart.map((item) => {
                      const activeT = lang === "bn" && item.titleBn ? item.titleBn : item.title;
                      const activeS = lang === "bn" && item.subjectBn ? item.subjectBn : item.subject;
                      return (
                        <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-905 truncate">{activeT}</p>
                            <p className="text-[9.5px] text-slate-400 font-semibold">{lang === "en" ? "Subject" : "বিষয়"}: {activeS} • {lang === "en" ? `Provider: ${item.author}` : `উৎস: ${item.authorBn || item.author}`}</p>
                          </div>
                          <span className="text-xs font-semibold text-slate-900 font-mono text-right whitespace-nowrap shrink-0">
                            {item.price === 0 ? (lang === "en" ? "FREE" : "ফ্রি") : translateVal(item.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subtotal table details */}
                <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>{lang === "en" ? "Academic Notes Subtotal" : "বই/নোটের মোট মূল্য"}</span>
                    <span className="font-mono">{translateVal(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>{lang === "en" ? "NCTB System Handling Fee" : "বোর্ড হ্যান্ডলিং চার্জ"}</span>
                    <span className="font-mono">{translateVal(platformFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-100">
                    <span>{lang === "en" ? "Grand Total Due" : "সর্বমোট প্রদেয় মূল্য"}</span>
                    <span className="font-mono text-indigo-700 text-sm sm:text-base">{translateVal(total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Choose Payment Method */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in" id="billing-payment-container">
                <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                  {lang === "en" ? "Select Payment Channel" : "পেমেন্ট মাধ্যম বেছে নিন"}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="payment-targets">
                  {/* Credits choice */}
                  <label 
                    onClick={() => setPaymentMethod("credits")}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer select-none transition ${
                      paymentMethod === "credits" 
                        ? "border-indigo-600 bg-indigo-50/20" 
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Landmark className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-805">{lang === "en" ? "Student Wallet" : "শিক্ষার্থী ওয়ালেট"}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 font-mono">{lang === "en" ? "Available:" : "ব্যালেন্স:"} {translateVal(balance)}</span>
                  </label>

                  {/* Card Choice */}
                  <label 
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer select-none transition ${
                      paymentMethod === "card" 
                        ? "border-indigo-600 bg-indigo-50/20" 
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-805">{lang === "en" ? "Credit/Debit Card" : "কার্ড পেমেন্ট (Visa/Master)"}</span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-semibold mt-1">{lang === "en" ? "Instant Secure Gateway" : "ইনস্ট্যান্ট পেমেন্ট"}</span>
                  </label>
                </div>

                {/* Conditional Payment forms */}
                {paymentMethod === "credits" && (
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-xs space-y-2 text-slate-650 leading-relaxed">
                    <p className="font-bold text-slate-800">{lang === "en" ? "Credit Ledger transaction terms:" : "ওয়ালেট ক্রেডিট নিয়মনীতি:"}</p>
                    <p>
                      {lang === "en" 
                        ? `Standard academic resource debit. Your updated balance after transaction will list: `
                        : `আপনার ওয়ালেট ব্যালেন্স থেকে সরাসরি কর্তন করা হবে। কেনাকাটার পর পরবর্তী ওয়ালেট ব্যালেন্স হবে: `}
                      <span className="font-mono text-slate-900 font-black">{translateVal(balance - total)}</span>.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-fade-in" id="creditcard-form-block">
                    {/* Visual credit card layout */}
                    <div className="relative h-28 w-full rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-950 to-slate-900 text-white p-4 shadow-sm flex flex-col justify-between font-mono select-none overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-white/5 blur-lg" />
                      
                      <div className="flex justify-between items-center text-[10px] opacity-80 font-bold">
                        <span>STUDENT CARD</span>
                        <span>VISA / BANGLA CARDS</span>
                      </div>

                      <div className="text-xs sm:text-sm font-bold tracking-widest text-center my-1.5 min-h-[20px]">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>

                      <div className="flex justify-between text-[8.5px] uppercase opacity-75">
                        <div className="truncate max-w-[150px]">
                          <span className="opacity-50 text-[7px] block">Holder</span>
                          <span>{cardHolder || (lang === "en" ? "TAHSIN NOTE SCHOLAR" : "তাহসিন নোট স্কলার")}</span>
                        </div>
                        <div className="text-right">
                          <span className="opacity-50 text-[7px] block">Expiry</span>
                          <span>{cardExpiry || "MM / YY"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card input forms */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-black">{lang === "en" ? "Card Number" : "কার্ড নম্বর"}</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-black">{lang === "en" ? "Expiry Date" : "মেয়াদকাল"}</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="09/29"
                          className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] text-slate-400 uppercase font-black">{lang === "en" ? "CVV" : "সিকিউরিটি কোড"}</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Total receipt display in step 2 */}
                <div className="p-3 border border-slate-150 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-extrabold uppercase">{lang === "en" ? "Final Fee amount:" : "পরিশোধযোগ্য সর্বমোট মূল্য:"}</span>
                  <span className="font-black text-slate-905 font-mono text-sm sm:text-base">{translateVal(total)}</span>
                </div>
              </div>
            )}

            {/* Step 3: Success statement and Receipt view */}
            {step === 3 && (
              <div className="space-y-5 text-center py-4 animate-fade-in" id="receipt-success-container">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {lang === "en" ? "Academic Resources Unlocked!" : "বই/নোট সংরক্ষণ সম্পন্ন হয়েছে!"}
                  </h4>
                  <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto leading-relaxed">
                    {lang === "en" 
                      ? "Assets added automatically to My Hub workspace library. Access notes instantly any time." 
                      : "আপনার কন্টেন্ট সফলভাবে 'আমার লাইব্রেরি' ট্যাবে যোগ করা হয়েছে। যেকোনো সময় ডাউনলোড ও ব্যবহার করতে পারবেন।"}
                  </p>
                </div>

                {/* Highly Stylized receipt */}
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200/55 pb-1.5 text-[9.5px] font-black text-slate-400">
                    <span>TRANSACTION REC-ID</span>
                    <span>#{Math.floor(Math.random() * 900000) + 100000}</span>
                  </div>

                  <div className="space-y-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-[11px] text-slate-750">
                        <span className="truncate max-w-[220px]">{lang === "bn" && item.titleBn ? item.titleBn : item.title}</span>
                        <span>{item.price === 0 ? (lang === "en" ? "FREE" : "ফ্রি") : translateVal(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-2.5 space-y-1 font-bold text-slate-600">
                    <div className="flex justify-between text-[11px]">
                      <span>{lang === "en" ? "Items due" : "মোট পুস্তকালয়"}</span>
                      <span>{translateVal(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>{lang === "en" ? "Handling Commission" : "কমিশন ও ভ্যাট"}</span>
                      <span>{translateVal(platformFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-black text-xs pt-2 border-t border-slate-200">
                      <span>{lang === "en" ? "Charged Amount" : "পরিশোধিত মূল্য"}</span>
                      <span className="text-indigo-705">{translateVal(total)}</span>
                    </div>
                  </div>

                  {/* Mail instructions */}
                  <div className="bg-indigo-50 text-indigo-850 border border-indigo-100 rounded-lg p-2.5 flex items-start gap-2 pt-3 font-sans text-[11px] leading-snug font-medium">
                    <Mail className="h-4 w-4 shrink-0 text-indigo-650" />
                    <span>
                      {lang === "en" 
                        ? `A backup receipt along with resource hashes was dispatched to your mail. Access study notes instantly under "My Hub".` 
                        : `বিস্তারিত রশিদ ইমেইলে পাঠানো হয়েছে। পড়াশোনা ও পরীক্ষার প্রস্তুতি শুরু করতে সরাসরি 'আমার লাইব্রেরি' ট্যাবে ক্লিক করুন।`}
                    </span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Checkout Footer Controls */}
          <div className="border-t border-slate-150 p-5 bg-slate-50/70 flex justify-between items-center">
            
            {step < 3 ? (
              <>
                <button
                  onClick={() => {
                    if (step === 1) onClose();
                    else setStep(1);
                  }}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition truncate cursor-pointer"
                >
                  {step === 1 ? (lang === "en" ? "Browse More" : "আরও দেখুন") : (lang === "en" ? "Go Back" : "পেছনে যান")}
                </button>

                <button
                  onClick={handleNextStep}
                  id="checkout-next-btn"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-750 hover:shadow-indigo-600/10 active:scale-97 transition-all flex items-center gap-1 leading-none cursor-pointer"
                >
                  <span>
                    {step === 1 
                      ? (lang === "en" ? "Proceed to Billing" : "পেমেন্টে এগিয়ে যান") 
                      : (lang === "en" ? "Process Payment" : "পেমেন্ট নিশ্চিত করুন")}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onClearCart();
                  onClose();
                }}
                id="receipt-complete-btn"
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 px-5 py-3.5 text-xs font-bold text-white transition cursor-pointer text-center"
              >
                {lang === "en" ? "Unlock Notes & View My Hub Library" : "পেমেন্ট সম্পন্ন করুন এবং লাইব্রেরিতে ফিরে যান"}
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
