import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Smartphone, Check, Delete, Clock, CreditCard, Sparkles } from 'lucide-react';
import { StackedDigitalCards, CardData } from '../components/StackedDigitalCards';
import { store } from '../store';
import confetti from 'canvas-confetti';

export const PaymentSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const membership = store.getMembership();
  const isPendingApproval = user.kycStatus === 'pending' || membership.status === 'KYC_PENDING';

  const [tab, setTab] = useState<'upi' | 'cards'>('cards'); // Default to cards tab as shown in user screenshot
  const [vpa, setVpa] = useState('karthik@okaxis');
  const [phone, setPhone] = useState('+91 90422 85132');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const [selectedCardObj, setSelectedCardObj] = useState<CardData | null>(null);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorizedSuccess, setAuthorizedSuccess] = useState(false);

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
              Your account KYC is currently pending review by the Employee MRM team. Payment setup cannot be completed until your identity is verified and approved.
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

  const presets = [
    { name: 'Google Pay', handle: 'karthik@okaxis', badge: 'GPay' },
    { name: 'PhonePe', handle: '9042285132@ybl', badge: 'PhonePe' },
    { name: 'Paytm UPI', handle: '9042285132@paytm', badge: 'Paytm' },
    { name: 'BHIM UPI', handle: 'karthik@upi', badge: 'BHIM' },
  ];

  const handleSelectCard = (idx: number, card: CardData) => {
    setSelectedCardIdx(idx);
    setSelectedCardObj(card);
  };

  const handleStartMandate = () => {
    setShowPinModal(true);
    setUpiPin('');
  };

  const handlePinKey = (num: string) => {
    if (upiPin.length < 6) {
      const nextPin = upiPin + num;
      setUpiPin(nextPin);
      if (nextPin.length === 6) {
        submitPin(nextPin);
      }
    }
  };

  const handlePinDelete = () => {
    setUpiPin((prev) => prev.slice(0, -1));
  };

  const submitPin = (pinValue: string) => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setAuthorizedSuccess(true);

      store.updateMandateStatus('ACTIVE', tab === 'cards' ? selectedCardObj?.title : vpa);

      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#1F8A5F', '#D4A62A', '#1B4B66', '#2E9E5B'],
        });
      } catch (e) {}

      setTimeout(() => {
        setShowPinModal(false);
        navigate('/dashboard');
      }, 1200);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#F7F5EF] text-[#1E2732] flex flex-col justify-center items-center py-6 sm:py-10 px-4 my-auto">
      <div className="layout-container space-y-6 sm:space-y-8 w-full max-w-xl">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66] flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#D4A62A]" />
            <span>Step 3 of 4 · UPI AutoPay & Mandate Setup</span>
          </span>
          <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732] tracking-tight">
            Authorize Monthly UPI Mandate
          </h1>
          <p className="text-sm text-[#5C6773] max-w-lg mx-auto leading-relaxed font-medium">
            Set up automatic monthly savings debit for your <span className="font-bold text-[#1B4B66]">₹1,000/mo Gold Harvest</span> plan via UPI or Digital Stack Cards
          </p>
        </div>

        {/* Outer White Surface Card Box on Soft Ivory */}
        <div className="max-w-xl mx-auto bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 shadow-premium space-y-8">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-3 bg-[#F7F5EF] p-2 rounded-[16px] border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTab('cards')}
              className={`py-3 rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'cards'
                  ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                  : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital Stack Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('upi')}
              className={`py-3 rounded-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'upi'
                  ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                  : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI VPA Mandate</span>
            </button>
          </div>

          {tab === 'cards' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C6773]">Select Mandate Source Card</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Real-Time Selection Active</span>
                </span>
              </div>
              <StackedDigitalCards
                selectedIndex={selectedCardIdx}
                onSelectCard={handleSelectCard}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick UPI Presets Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5C6773] uppercase tracking-wider block">
                  Select UPI App or Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presets.map((p) => (
                    <button
                      key={p.badge}
                      type="button"
                      onClick={() => setVpa(p.handle)}
                      className={`p-3 rounded-[14px] border text-xs font-bold transition-all text-center cursor-pointer ${
                        vpa === p.handle
                          ? 'bg-[#1B4B66]/10 border-[#1B4B66] text-[#1B4B66] shadow-sm font-extrabold'
                          : 'bg-[#F8FAFC] border-slate-200 text-[#5C6773] hover:border-slate-300'
                      }`}
                    >
                      <p className="font-extrabold">{p.badge}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{p.handle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI VPA Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E2732] block">Enter VPA / UPI ID Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="mobile@upi or username@okicici"
                    className="w-full p-4 pl-11 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono text-sm text-[#1E2732] focus:border-[#1B4B66] focus:outline-none font-bold"
                  />
                  <Smartphone className="w-5 h-5 text-[#1B4B66] absolute left-3.5 top-4" />
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E2732] block">Registered Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full p-4 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono text-sm text-[#1E2732] focus:border-[#1B4B66] focus:outline-none font-bold"
                />
              </div>

              {/* Guarantee & NPCI GPay/Paytm Rules Box */}
              <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[18px] p-4 text-xs text-[#1E2732] space-y-2.5">
                <div className="flex items-center gap-2 text-[#1F8A5F] font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1F8A5F]" />
                  <span>Official NPCI GPay & Paytm AutoPay Mandate Rules</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-[#5C6773] leading-relaxed list-disc list-inside pl-1 font-medium">
                  <li><strong className="text-[#1E2732]">24-Hour Pre-Debit Notification:</strong> GPay/Paytm sends SMS alert 24h before monthly auto-debit.</li>
                  <li><strong className="text-[#1E2732]">Zero-Penalty 5-Day Grace Window:</strong> Retries up to 3 times if bank servers are down without breaking your streak.</li>
                  <li><strong className="text-[#1E2732]">100% Mandate Control:</strong> Pause or revoke your GPay/Paytm AutoPay mandate anytime in settings.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleStartMandate}
            className="w-full py-4 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-premium transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[#D4A62A]" />
            <span>Authorize UPI AutoPay Mandate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* NPCI 6-Digit UPI PIN Authentication Modal Simulator */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-[#1E2732]/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          <div className="bg-white border-2 border-[#1B4B66] rounded-[28px] p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 text-[#1E2732] relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#1B4B66] text-white font-bold text-xs flex items-center justify-center">
                  NPCI
                </div>
                <span className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">UPI AutoPay Mandate</span>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">
                Cancel ✕
              </button>
            </div>

            <div className="bg-[#F7F5EF] p-4 rounded-[18px] border border-slate-200 space-y-1 text-left">
              <span className="text-[10px] text-[#5C6773] font-mono uppercase block">Payee / Escrow Trustee</span>
              <p className="font-['Sora'] font-extrabold text-sm text-[#1B4B66]">SamruddiSave Escrow Trustee</p>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 mt-2">
                <span className="text-xs text-[#5C6773]">Monthly Amount:</span>
                <span className="text-lg font-extrabold font-mono text-[#1E2732]">₹1,000.00 / month</span>
              </div>
              {tab === 'cards' && selectedCardObj && (
                <p className="text-[11px] font-bold text-[#1F8A5F]">Source: {selectedCardObj.title}</p>
              )}
            </div>

            {/* 6 PIN Dots */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#5C6773]">ENTER 6-DIGIT UPI PIN</span>
              <div className="flex items-center justify-center space-x-3 py-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      i < upiPin.length
                        ? 'bg-[#1B4B66] border-[#1B4B66] scale-110'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Keypad or Spinner */}
            {isAuthorizing ? (
              <div className="py-6 space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#1B4B66] border-t-transparent animate-spin mx-auto" />
                <p className="font-bold text-xs text-[#1B4B66]">Verifying Mandate with NPCI & Escrow Trustee Bank...</p>
              </div>
            ) : authorizedSuccess ? (
              <div className="py-4 space-y-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-12 h-12 text-[#1F8A5F] mx-auto animate-bounce" />
                <p className="text-sm">Mandate Successfully Authorized!</p>
                <p className="text-xs text-slate-500">Redirecting to Dashboard...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 py-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => (k === 'DEL' ? handlePinDelete() : k !== '' && handlePinKey(k))}
                    disabled={k === ''}
                    className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#1E2732] font-['Sora'] font-extrabold text-lg rounded-[14px] border border-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    {k === 'DEL' ? <Delete className="w-5 h-5 text-[#C0392B]" /> : k}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
