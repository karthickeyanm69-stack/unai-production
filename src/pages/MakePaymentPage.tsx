import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Check, Delete, ShieldCheck, ArrowLeft, Clock } from 'lucide-react';
import { SwipeToPaySlider } from '../components/SwipeToPaySlider';
import { store } from '../store';
import confetti from 'canvas-confetti';

export const MakePaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const membership = store.getMembership();
  const isPendingApproval = user.kycStatus === 'pending' || membership.status === 'KYC_PENDING';

  const baseAmount = 1000;
  const [displayAmount, setDisplayAmount] = useState<string>(baseAmount.toString());
  const [multiplier, setMultiplier] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (isPendingApproval) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border border-[#1B4B66]/20 rounded-[28px] p-6 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-6 animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300">
            <Clock className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
              KYC APPROVAL REQUIRED
            </span>
            <h2 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">
              Account Under Employee Review
            </h2>
            <p className="text-xs text-[#5C6773] leading-relaxed">
              Your account KYC is currently pending review by the Employee MRM team. Payment transactions cannot be processed until your identity is verified and approved.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] text-white font-['Sora'] font-bold text-xs shadow-md hover:bg-[#123448] transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const calculatedTotal = (parseInt(displayAmount || '0', 10) || 0) * multiplier;

  const handleKeyPress = (val: string) => {
    if (val === 'DEL') {
      setDisplayAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === 'CLEAR') {
      setDisplayAmount(baseAmount.toString());
      setMultiplier(1);
    } else {
      setDisplayAmount((prev) => (prev === '0' ? val : prev + val));
    }
  };

  const handleConfirmPayment = () => {
    store.makePayment('cnt_9');
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2E9E5B', '#D4A62A', '#1B4B66', '#1F8A5F'],
      });
    } catch (e) {}

    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden text-[#1E2732]">
      {/* Top Single Back Arrow Bar */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
          <span>Back to Wallet</span>
        </button>

        <span className="text-[11px] font-bold text-[#5C6773]">Distraction-Free Checkout</span>
      </div>

      <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-5 sm:p-8 max-w-md w-full shadow-2xl space-y-6 sm:space-y-8 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-[#1F8A5F]/10 text-[#1F8A5F] border border-[#1F8A5F]/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-['Sora'] font-extrabold text-base sm:text-lg text-[#1E2732]">
                Monthly Contribution
              </h1>
              <p className="text-[11px] sm:text-xs text-[#5C6773] mt-0.5">
                Cycle #9 of 12 • Due: 2026-09-05
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-[#1F8A5F]/10 text-[#1F8A5F] border border-[#1F8A5F]/30 font-bold px-2.5 py-1 rounded-full shrink-0">
            AutoPay Active
          </span>
        </div>

        <div className="bg-[#F8FAFC] rounded-[20px] p-5 sm:p-8 border border-slate-200 text-center space-y-3">
          <span className="text-xs font-semibold text-[#5C6773] uppercase tracking-widest block">
            Contribution Amount
          </span>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1B4B66] font-mono tracking-tight tabular-nums">
              ₹{calculatedTotal.toLocaleString('en-IN')}
            </span>
          </div>

          {multiplier > 1 && (
            <p className="text-[11px] font-mono text-[#1B4B66] bg-[#1B4B66]/10 border border-[#1B4B66]/20 rounded-[14px] py-1 px-3 inline-block font-bold">
              ₹{displayAmount} × {multiplier} cycles = ₹{calculatedTotal.toLocaleString('en-IN')}
            </p>
          )}

          <p className="text-[11px] text-[#5C6773] flex items-center justify-center gap-1.5 pt-2 border-t border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#1F8A5F]" />
            <span>Secured via RBI-compliant Escrow Trustee</span>
          </p>
        </div>

        {/* Multipliers */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <span className="text-xs text-[#5C6773] font-semibold mr-1">Pay Cycles:</span>
          {[1, 2, 3].map((mult) => (
            <button
              key={mult}
              onClick={() => setMultiplier(mult)}
              className={`px-3.5 py-2 rounded-[14px] font-mono text-xs font-bold transition-all border cursor-pointer ${
                multiplier === mult
                  ? 'bg-[#1B4B66] text-white border-[#1B4B66] shadow-md scale-105'
                  : 'bg-slate-100 text-[#5C6773] border-slate-200 hover:bg-slate-200'
              }`}
            >
              × {mult}
            </button>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-1 sm:py-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'DEL'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-12 sm:h-14 bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#1E2732] font-['Sora'] font-extrabold text-lg sm:text-xl rounded-[14px] border border-slate-200 transition-all flex items-center justify-center shadow-sm cursor-pointer"
            >
              {key === 'DEL' ? (
                <Delete className="w-5 h-5 sm:w-6 sm:h-6 text-[#C0392B]" />
              ) : key === 'CLEAR' ? (
                <span className="text-[11px] text-[#1B4B66] font-bold">RESET</span>
              ) : (
                key
              )}
            </button>
          ))}
        </div>

        {/* Swipe Slider */}
        <div className="pt-1 sm:pt-2">
          <SwipeToPaySlider onConfirm={handleConfirmPayment} label="Swipe right to pay" />
        </div>
      </div>

      {/* Confirm Green (#2E9E5B) Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#2E9E5B] flex flex-col items-center justify-center p-6 text-white text-center animate-fade-up">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#2E9E5B] flex items-center justify-center mb-5 sm:mb-6 shadow-2xl">
            <Check className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3]" />
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-100 mb-1">
            Payment Success
          </span>
          <h2 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl mb-2 tabular-nums">
            ₹{calculatedTotal.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-emerald-100 mb-6 sm:mb-8 max-w-xs leading-relaxed">
            Contribution credited to your 12-Month SamruddiSave Vault
          </p>

          <div className="bg-emerald-700/60 backdrop-blur-md rounded-[20px] p-5 sm:p-6 max-w-xs w-full mb-6 sm:mb-8 text-xs space-y-2.5 border border-emerald-400/40">
            <div className="flex justify-between">
              <span className="text-emerald-100">Cycle Paid:</span>
              <span className="font-bold">Month #9 of 12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Streak Updated:</span>
              <span className="font-bold text-[#D4A62A]">🔥 9 Months Streak!</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Transaction ID:</span>
              <span className="font-mono">TXN_{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full max-w-xs py-3.5 sm:py-4 bg-white text-[#2E9E5B] font-['Sora'] font-extrabold text-xs sm:text-sm rounded-[14px] shadow-2xl hover:bg-emerald-50 transition-all cursor-pointer"
          >
            Back to Goal Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
