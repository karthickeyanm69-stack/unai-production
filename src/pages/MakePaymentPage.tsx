import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Building2, PhoneCall, Mail, CheckCircle2, Clock } from 'lucide-react';
import { store } from '../store';

export const MakePaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const user = store.getCurrentUser();
  const membership = store.getMembership();
  const isPendingApproval = user.kycStatus === 'pending' || membership.status === 'KYC_PENDING';

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
            <h2 className="font-[#Sora] font-extrabold text-xl text-[#1E2732]">
              Account Under Admin Review
            </h2>
            <p className="text-xs text-[#5C6773] leading-relaxed">
              Your account KYC is currently pending review by the Admin team. Payment records will be managed by Admin once your identity is approved.
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

  const userContribs = store.getContributions();
  const paidCount = userContribs.filter((c) => c.status === 'paid').length;
  const currentCycle = paidCount + 1 <= 12 ? paidCount + 1 : 12;

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden text-[#1E2732]">
      {/* Back Button Bar */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-[11px] font-bold text-[#5C6773]">Offline Payment Guide</span>
      </div>

      <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative z-10 animate-fade-up">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 text-center space-y-1">
          <span className="px-3 py-1 bg-[#1B4B66]/10 text-[#1B4B66] text-[10px] font-extrabold rounded-full uppercase tracking-wider">
            Offline Direct Payment Mode
          </span>
          <h1 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">
            Pay Monthly Savings to Admin
          </h1>
          <p className="text-xs text-[#5C6773]">
            Payments are made offline directly to your Admin Officer
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-[#F8FAFC] rounded-[22px] p-5 border border-[#1B4B66]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#5C6773] uppercase tracking-wider block">Upcoming Payment</span>
              <p className="font-['Sora'] font-extrabold text-base text-[#1E2732]">Month {currentCycle} Contribution</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              Pending Admin Receipt
            </span>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#5C6773]">Monthly Contribution:</span>
              <span className="font-bold text-[#1B4B66] font-mono">₹1,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C6773]">Payment Due Date:</span>
              <span className="font-bold text-[#1E2732]">5th of Every Month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5C6773]">Recorded Status:</span>
              <span className="font-bold text-amber-700">Auto-Pending until Admin enters</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <h3 className="font-['Sora'] font-bold text-xs uppercase tracking-wider text-[#1B4B66] flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#D4A62A]" />
            <span>How to Complete Your Payment:</span>
          </h3>

          <ol className="space-y-2.5 text-xs text-[#1E2732] font-medium pl-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B4B66] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">1</span>
              <span>Hand over cash or make direct bank transfer to your assigned Admin Officer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B4B66] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">2</span>
              <span>The Admin Officer verifies your payment and enters it into the system manually.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1B4B66] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">3</span>
              <span>Once recorded by Admin, your status updates to <strong className="text-[#1F8A5F]">PAID</strong> in your wallet & ledger.</span>
            </li>
          </ol>
        </div>

        {/* Admin Contact Box */}
        <div className="p-4 bg-[#1B4B66]/5 border border-[#1B4B66]/20 rounded-[18px] space-y-2">
          <p className="font-['Sora'] font-bold text-xs text-[#1B4B66]">Assigned Admin Contact:</p>
          <div className="space-y-1 text-xs font-semibold text-[#1E2732]">
            <p className="font-extrabold">Priya Verma (Admin Officer)</p>
            <p className="flex items-center gap-1.5 text-slate-600">
              <PhoneCall className="w-3.5 h-3.5 text-[#1B4B66]" />
              <span>+91 98765 11100</span>
            </p>
            <p className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-[#1B4B66]" />
              <span>priya.verma@samruddisave.com</span>
            </p>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigate('/ledger')}
            className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] text-white font-['Sora'] font-extrabold text-xs shadow-md hover:bg-[#123448] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>View My Payment Ledger & Progress</span>
          </button>
        </div>

        {/* Compliance Footer */}
        <div className="pt-2 text-center border-t border-slate-100">
          <p className="text-[11px] text-[#5C6773] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1F8A5F]" />
            <span>Escrow Trustee Compliant • Cash/Bank Entry by Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentPage;
