import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Smartphone, Check, Delete } from 'lucide-react';
import { StackedDigitalCards } from '../components/StackedDigitalCards';
import { store } from '../store';
import confetti from 'canvas-confetti';

export const PaymentSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upi' | 'cards'>('upi');
  const [vpa, setVpa] = useState('ananya@okicici');
  const [phone, setPhone] = useState('98765 43210');
  const [showPinModal, setShowPinModal] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const presets = [
    { name: 'Google Pay', handle: 'ananya@okaxis', badge: 'GPay' },
    { name: 'PhonePe', handle: '9876543210@ybl', badge: 'PhonePe' },
    { name: 'Paytm UPI', handle: '9876543210@paytm', badge: 'Paytm' },
    { name: 'BHIM UPI', handle: 'ananya@upi', badge: 'BHIM' },
  ];

  const handleStartMandate = () => {
    if (!vpa) return;
    setShowPinModal(true);
  };

  const handlePinKey = (num: string) => {
    if (upiPin.length < 6) {
      const nextPin = upiPin + num;
      setUpiPin(nextPin);
      if (nextPin.length === 6) {
        // Auto submit when 6 digits are entered
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
      store.makePayment('cnt_9');
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#1F8A5F', '#D4A62A', '#1B4B66', '#2E9E5B'],
        });
      } catch (e) {}

      navigate('/dashboard');
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-10 pb-36 space-y-10">
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
            Set up automatic monthly savings debit for your <span className="font-bold text-[#1B4B66]">₹1,000/mo Gold Harvest</span> plan via UPI
          </p>
        </div>

        {/* Outer White Surface Card Box on Soft Ivory */}
        <div className="max-w-xl mx-auto bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 shadow-premium space-y-8">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-3 bg-[#F7F5EF] p-2 rounded-[16px] border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setTab('upi')}
              className={`py-3 rounded-[12px] transition-all flex items-center justify-center gap-2 ${
                tab === 'upi'
                  ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                  : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <span>UPI AutoPay Mandate</span>
            </button>
            <button
              onClick={() => setTab('cards')}
              className={`py-3 rounded-[12px] transition-all flex items-center justify-center gap-2 ${
                tab === 'cards'
                  ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                  : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <span>Digital Stack Cards</span>
            </button>
          </div>

          {tab === 'upi' ? (
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
                      onClick={() => setVpa(p.handle)}
                      className={`p-3 rounded-[14px] border text-xs font-bold transition-all text-center ${
                        vpa === p.handle
                          ? 'bg-[#1B4B66]/10 border-[#1B4B66] text-[#1B4B66] shadow-sm'
                          : 'bg-[#F8FAFC] border-slate-200 text-[#5C6773] hover:border-slate-300'
                      }`}
                    >
                      <p className="font-extrabold">{p.badge}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{p.handle.split('@')[1]}</p>
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

              {/* Guarantee Box */}
              <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[16px] p-4 text-xs text-[#1F8A5F] flex items-center gap-3 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-[#1F8A5F] shrink-0" />
                <span>NPCI E-Mandate Limit: ₹1,000/mo. Debited automatically on 5th of every month.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C6773]">Select Mandate Source Card</span>
                <span className="text-[10px] bg-[#D4A62A]/15 text-[#D4A62A] border border-[#D4A62A]/40 font-bold px-3 py-1 rounded-full">
                  Video Reference UI
                </span>
              </div>
              <StackedDigitalCards />
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleStartMandate}
            className="w-full py-4 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-premium transition-all hover-lift flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
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
                <span className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">UPI AutoPay</span>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">
                Cancel ✕
              </button>
            </div>

            <div className="bg-[#F7F5EF] p-4 rounded-[18px] border border-slate-200 space-y-1">
              <span className="text-[10px] text-[#5C6773] font-mono uppercase block">Payee / Escrow Trustee</span>
              <p className="font-['Sora'] font-extrabold text-sm text-[#1B4B66]">SamruddiSave Escrow Trustee</p>
              <p className="text-xl font-extrabold font-mono text-[#1E2732]">₹1,000.00 / month</p>
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

            {/* Keypad */}
            {isAuthorizing ? (
              <div className="py-6 space-y-3">
                <div className="w-10 h-10 rounded-full border-4 border-[#1B4B66] border-t-transparent animate-spin mx-auto" />
                <p className="font-bold text-xs text-[#1B4B66]">Verifying Mandate with NPCI & Bank...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 py-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map((k) => (
                  <button
                    key={k}
                    onClick={() => (k === 'DEL' ? handlePinDelete() : k !== '' && handlePinKey(k))}
                    disabled={k === ''}
                    className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#1E2732] font-['Sora'] font-extrabold text-lg rounded-[14px] border border-slate-200 flex items-center justify-center"
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
