import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const TrustCenterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-10 pb-36 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1F8A5F]/30 text-[#1F8A5F] text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#1F8A5F]" />
            <span>RBI Guidelines & Tripartite Escrow Custody</span>
          </div>
          <h1 className="font-['Sora'] text-3xl sm:text-5xl font-extrabold text-[#1E2732] tracking-tight">
            Trust & Legal Compliance Center
          </h1>
          <p className="text-sm sm:text-base text-[#5C6773] leading-relaxed font-medium">
            Complete transparency on capital custody, regulatory compliance, and statutory disclosures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-8 shadow-premium space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-[16px] bg-[#1B4B66]/10 text-[#1B4B66] flex items-center justify-center">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Escrow Bank Custody</h3>
            <p className="text-sm text-[#5C6773] leading-relaxed">
              100% of user savings are held in a ring-fenced Escrow Trustee Account at an RBI-regulated scheduled commercial bank.
            </p>
          </div>

          <div className="bg-white border border-[#1F8A5F]/20 rounded-[28px] p-8 shadow-premium space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-[16px] bg-[#1F8A5F]/10 text-[#1F8A5F] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">NSDL KYC Verification</h3>
            <p className="text-sm text-[#5C6773] leading-relaxed">
              Mandatory PAN and Aadhaar identity verification compliant with Prevention of Money Laundering Act (PMLA) norms.
            </p>
          </div>

          <div className="bg-white border border-[#D4A62A]/30 rounded-[28px] p-8 shadow-premium space-y-4 hover-lift">
            <div className="w-12 h-12 rounded-[16px] bg-[#D4A62A]/10 text-[#D4A62A] flex items-center justify-center">
              <FileText className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Statutory Disclosures</h3>
            <p className="text-sm text-[#5C6773] leading-relaxed">
              Full refund transparency, clear T&Cs, and zero hidden penalties under Chit Fund & Savings scheme regulatory frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
