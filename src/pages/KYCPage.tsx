import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Upload, Lock, CheckCircle2, Scan, FileCheck, User, Smartphone, Building, Mail, Check, ShieldCheck } from 'lucide-react';
import { store } from '../store';

export const KYCPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: User Registration
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');

  // Step 2: KYC Details
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);

  // Step 3: Bank Account & Mandate Details
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUPIId] = useState('');
  const [mandateProvider, setMandateProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'bank'>('gpay');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setOcrStatus('scanning');
    setOcrProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setOcrProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setOcrStatus('complete');
        setPan('ABCDE1234F');
        setAadhaar('9876 5432 1098');
      }
    }, 350);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      store.registerNewMember({
        fullName,
        phone: mobile,
        email,
        pan,
        aadhaar,
        bankAccount,
        ifsc,
        upiId,
      });
      setIsSubmitting(false);
      navigate('/plans');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#F7F5EF] text-[#1E2732] flex flex-col items-center justify-center py-4 sm:py-8 px-3 sm:px-6 my-auto">
      <div className="w-full max-w-xl space-y-4 sm:space-y-6">
        
        {/* Responsive Step Progress Header */}
        <div className="flex items-center justify-between px-1 sm:px-4 text-[11px] sm:text-xs font-semibold text-[#1E2732]">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none shrink-0"
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 1 ? 'bg-[#1B4B66] text-white' : 'bg-slate-200 text-slate-500'}`}>
              1
            </div>
            <span className={step >= 1 ? 'font-bold text-[#1B4B66]' : 'text-slate-500'}>Profile</span>
          </button>

          <div className={`h-[1px] flex-1 mx-1.5 sm:mx-4 transition-all ${step >= 2 ? 'bg-[#1B4B66]' : 'bg-slate-300'}`} />

          <button
            type="button"
            onClick={() => { if (step >= 2) setStep(2); }}
            className={`flex items-center gap-1.5 sm:gap-2 focus:outline-none shrink-0 ${step >= 2 ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 2 ? 'bg-[#1B4B66] text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </div>
            <span className={step >= 2 ? 'font-bold text-[#1B4B66]' : 'text-slate-500'}>KYC Compliance</span>
          </button>

          <div className={`h-[1px] flex-1 mx-1.5 sm:mx-4 transition-all ${step >= 3 ? 'bg-[#1B4B66]' : 'bg-slate-300'}`} />

          <button
            type="button"
            onClick={() => { if (step >= 3) setStep(3); }}
            className={`flex items-center gap-1.5 sm:gap-2 focus:outline-none shrink-0 ${step >= 3 ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 3 ? 'bg-[#1B4B66] text-white' : 'bg-slate-200 text-slate-500'}`}>
              3
            </div>
            <span className={step >= 3 ? 'font-bold text-[#1B4B66]' : 'text-slate-500'}>Bank & AutoPay</span>
          </button>
        </div>

        {/* Vertically Centered Clean Onboarding Card */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 shadow-lg animate-fade-up">
          
          {/* STEP 1: Create Account */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4 sm:space-y-5">
              <div>
                <h2 className="font-['Sora'] font-bold text-xl sm:text-2xl text-[#1E2732]">Step 1: Create Account</h2>
                <p className="text-xs text-[#5C6773] mt-0.5 font-medium">Enter your personal details to create your wallet account</p>
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-xs font-medium pt-1">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Full Name (As on PAN)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-3 sm:top-3.5" />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-3 sm:top-3.5" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ananya.sharma@example.com"
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-3 sm:top-3.5" />
                  </div>
                </div>

                {/* PIN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Create 4-Digit Security PIN</label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="•••• (e.g. 1234)"
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none tracking-widest transition-all"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-3 sm:top-3.5" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-3.5 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-100 text-[#1E2732] font-bold text-[11px] sm:text-xs hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to KYC</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: KYC Compliance */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4 sm:space-y-5">
              <div>
                <h2 className="font-['Sora'] font-bold text-xl sm:text-2xl text-[#1E2732]">Step 2: Mandatory KYC Verification</h2>
                <p className="text-xs text-[#5C6773] mt-0.5 font-medium">Required by RBI NBFC & Escrow Custody Guidelines</p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />

              <div
                onClick={handleBoxClick}
                className={`p-5 sm:p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center space-y-2.5 sm:space-y-3 relative overflow-hidden group ${
                  ocrStatus === 'complete'
                    ? 'bg-[#1F8A5F]/10 border-[#1F8A5F] text-[#1F8A5F]'
                    : ocrStatus === 'scanning'
                    ? 'bg-[#1B4B66]/10 border-[#1B4B66] text-[#1B4B66]'
                    : 'bg-[#F8FAFC] border-slate-300 text-[#1E2732] hover:border-[#1B4B66] hover:bg-[#1B4B66]/5'
                }`}
              >
                {ocrStatus === 'scanning' ? (
                  <div className="space-y-2 animate-fade-up">
                    <Scan className="w-7 h-7 sm:w-8 sm:h-8 text-[#1B4B66] mx-auto animate-spin" />
                    <p className="font-['Sora'] font-bold text-xs text-[#1B4B66]">
                      AI OCR Scanning Document... {ocrProgress}%
                    </p>
                  </div>
                ) : ocrStatus === 'complete' ? (
                  <div className="space-y-2 animate-fade-up">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1F8A5F] text-white flex items-center justify-center mx-auto shadow-md">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <p className="font-['Sora'] font-bold text-xs text-[#1F8A5F]">
                      OCR Document Auto-Extracted Successfully!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <p className="font-['Sora'] font-bold text-xs text-[#1E2732]">
                      Upload PAN / Aadhaar Document for Auto AI Scan
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">PAN Card Number</label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none uppercase font-bold transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Aadhaar Number</label>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    placeholder="e.g. 9876 5432 1098"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3.5 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-100 text-[#1E2732] font-bold text-[11px] sm:text-xs hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 1</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Bank Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Bank Account & AutoPay Mandate Setup */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <h2 className="font-['Sora'] font-bold text-xl sm:text-2xl text-[#1E2732]">Step 3: Bank Account & AutoPay Setup</h2>
                <p className="text-xs text-[#5C6773] mt-0.5 font-medium">Where your monthly savings and maturity returns will be credited</p>
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Bank Account Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Enter bank account number..."
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                      required
                    />
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-3 sm:top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="UTIB0001029"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none uppercase transition-all"
                    required
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-[#1E2732] block">Select Preferred AutoPay App</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'gpay', title: 'Google Pay (GPay)' },
                      { id: 'phonepe', title: 'PhonePe AutoPay' },
                      { id: 'paytm', title: 'Paytm UPI Mandate' },
                      { id: 'bank', title: 'NetBanking Mandate' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setMandateProvider(p.id as any)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                          mandateProvider === p.id
                            ? 'bg-[#1B4B66]/10 border-[#1B4B66] text-[#1B4B66]'
                            : 'bg-slate-50 border-slate-200 text-[#5C6773]'
                        }`}
                      >
                        <span className="truncate">{p.title}</span>
                        {mandateProvider === p.id && <Check className="w-3.5 h-3.5 text-[#1B4B66] shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732] block">UPI VPA ID for AutoPay</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUPIId(e.target.value)}
                    placeholder="ananya@okaxis"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 font-mono text-xs font-bold text-[#1E2732] focus:border-[#1B4B66] focus:bg-white focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3.5 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-100 text-[#1E2732] font-bold text-[11px] sm:text-xs hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 2</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Saving Details...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#D4A62A]" />
                      <span>Complete & Select Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
