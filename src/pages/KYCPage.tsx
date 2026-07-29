import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Upload, Lock, CheckCircle2, Scan, FileCheck, Sparkles } from 'lucide-react';
import { store } from '../store';

export const KYCPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pan, setPan] = useState('ABCDE1234F');
  const [aadhaar, setAadhaar] = useState('9876 5432 1098');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

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

    // Simulate real-time AI OCR scanning progress
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setOcrProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setOcrStatus('complete');
        // Auto-extract and populate OCR data
        setPan('ABCDE1234F');
        setAadhaar('9876 5432 1098');
      }
    }, 350);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      store.updateProfileKYC('approved');
      navigate('/plans');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-10 pb-36 space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66] flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#D4A62A]" />
            <span>Step 1 of 4 · Identity Verification</span>
          </span>
          <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732] tracking-tight">
            Mandatory KYC Verification
          </h1>
          <p className="text-sm text-[#5C6773] max-w-md mx-auto leading-relaxed font-medium">
            Required by RBI guidelines for goal savings wallets & escrow custody
          </p>
        </div>

        {/* Outer White Surface Card Box on Soft Ivory */}
        <div className="max-w-xl mx-auto bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 shadow-premium space-y-8">
          <div className="space-y-6">
            {/* Interactive File Upload Input (OCR Model Simulator) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />

            <div
              onClick={handleBoxClick}
              className={`p-6 rounded-[20px] border-2 border-dashed cursor-pointer transition-all text-center space-y-3 relative overflow-hidden group ${
                ocrStatus === 'complete'
                  ? 'bg-[#1F8A5F]/10 border-[#1F8A5F] text-[#1F8A5F]'
                  : ocrStatus === 'scanning'
                  ? 'bg-[#1B4B66]/10 border-[#1B4B66] text-[#1B4B66]'
                  : 'bg-[#F8FAFC] border-[#1B4B66]/30 text-[#1E2732] hover:border-[#1B4B66] hover:bg-[#1B4B66]/5'
              }`}
            >
              {ocrStatus === 'scanning' ? (
                <div className="space-y-3 animate-fade-up">
                  <Scan className="w-8 h-8 text-[#1B4B66] mx-auto animate-spin" />
                  <p className="font-['Sora'] font-bold text-xs text-[#1B4B66]">
                    AI OCR Scanning Document... {ocrProgress}%
                  </p>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                    <div
                      className="bg-[#1B4B66] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#5C6773]">Extracting Name, PAN & Aadhaar Number...</p>
                </div>
              ) : ocrStatus === 'complete' ? (
                <div className="space-y-2 animate-fade-up">
                  <div className="w-10 h-10 rounded-full bg-[#1F8A5F] text-white flex items-center justify-center mx-auto shadow-md">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <p className="font-['Sora'] font-bold text-xs text-[#1F8A5F]">
                    OCR Document Auto-Extracted Successfully!
                  </p>
                  <p className="text-[11px] text-[#5C6773] font-mono">
                    File: {uploadedFile?.name || 'IdentityDoc.jpg'}
                  </p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1F8A5F]/20 text-[#1F8A5F] text-[10px] font-extrabold">
                    <Sparkles className="w-3 h-3 text-[#1F8A5F]" />
                    99.8% AI Match Confidence
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="font-['Sora'] font-bold text-sm text-[#1E2732]">
                      Upload Selfie & Identity Documents
                    </p>
                    <p className="text-xs text-[#5C6773] mt-1">
                      Click to upload PAN / Aadhaar image for automatic AI OCR scanning
                    </p>
                  </div>
                  <span className="text-[10px] bg-[#1B4B66]/10 text-[#1B4B66] border border-[#1B4B66]/20 font-bold px-3 py-1 rounded-full inline-block">
                    Supports JPG, PNG, PDF (Max 10MB)
                  </span>
                </>
              )}
            </div>

            {/* PAN Card Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E2732]">PAN Card Number</label>
                {ocrStatus === 'complete' && (
                  <span className="text-[10px] text-[#1F8A5F] font-bold">Auto-Extracted via OCR</span>
                )}
              </div>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder="ABCDE1234F"
                className="w-full p-4 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono text-sm text-[#1E2732] focus:border-[#1B4B66] focus:outline-none uppercase font-bold"
              />
            </div>

            {/* Aadhaar Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1E2732]">Aadhaar Number</label>
                {ocrStatus === 'complete' && (
                  <span className="text-[10px] text-[#1F8A5F] font-bold">Auto-Extracted via OCR</span>
                )}
              </div>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="XXXX XXXX XXXX"
                className="w-full p-4 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono text-sm text-[#1E2732] focus:border-[#1B4B66] focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Compliance Guarantee Strip */}
          <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[16px] p-4 text-xs text-[#1F8A5F] flex items-center gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#1F8A5F] shrink-0" />
            <span>256-Bit SSL Encrypted • Direct Verification via NSDL & UIDAI</span>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full py-4 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-premium transition-all hover-lift flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span>Verifying Identity with NSDL...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Verify KYC & Select Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
