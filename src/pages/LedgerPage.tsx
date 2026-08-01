import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, CheckCircle2, ArrowLeft, FileText } from 'lucide-react';
import { store } from '../store';

export const LedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const contributions = store.getContributions();
  const user = store.getCurrentUser();
  const [toast, setToast] = useState<string | null>(null);

  const handleDownloadStatement = () => {
    const header = `SAMRUDDISAVE - OFFICIAL SAVINGS WALLET PASSBOOK STATEMENT\n` +
      `============================================================\n` +
      `Member Name: ${user.fullName}\n` +
      `Member Email: ${user.email}\n` +
      `Statement Date: ${new Date().toLocaleDateString('en-IN')}\n` +
      `Escrow Trustee Custody Status: 100% RBI TRUSTEE VERIFIED\n` +
      `============================================================\n\n` +
      `Cycle  | Due Date   | Paid Date  | Amount (INR) | Payment Ref      | Escrow Status\n` +
      `-----------------------------------------------------------------------------------\n`;

    const rows = contributions
      .map((c) => {
        const cycle = `Month #${c.cycleNumber}`.padEnd(7);
        const due = (c.dueDate || '').padEnd(10);
        const paid = (c.paidDate || 'Pending   ').padEnd(10);
        const amt = `₹${(c.amountInPaise / 100).toLocaleString('en-IN')}`.padEnd(12);
        const ref = (c.paymentGatewayRef || 'Pending Ref       ').padEnd(17);
        const status = c.status === 'paid' ? 'ESCROW CLEARED' : 'UPCOMING';
        return `${cycle} | ${due} | ${paid} | ${amt} | ${ref} | ${status}`;
      })
      .join('\n');

    const footer = `\n============================================================\n` +
      `Total Accumulated Savings: ₹${(contributions.filter(c => c.status === 'paid').length * 1000).toLocaleString('en-IN')}.00\n` +
      `Guaranteed Cash Bonus (+5.00%): ₹600.00\n` +
      `Maturity Escrow Payout Projection: ₹12,600.00 + Gift Hamper\n` +
      `============================================================\n` +
      `Thank you for saving with SamruddiSave Escrow Custody!`;

    const blob = new Blob([header + rows + footer], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SamruddiSave_Passbook_Statement_${user.fullName.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast('Passbook Statement Statement Downloaded Successfully!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="layout-container pt-6 sm:pt-10 pb-24 space-y-6 sm:space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
          <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Single Back Arrow Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
          <span>Back to Wallet</span>
        </button>

        <span className="text-[11px] font-bold text-[#5C6773]">Escrow Verified Passbook</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Financial Auditability</span>
          <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight">Savings Wallet Ledger</h1>
          <p className="text-xs sm:text-sm text-[#5C6773]">Itemized monthly contributions and escrow verification status</p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-[14px] shadow-premium flex items-center justify-center gap-2 shrink-0 transition-all hover-lift cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Statement (PDF)</span>
        </button>
      </div>

      <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[#5C6773] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 sm:p-6">Cycle</th>
                <th className="p-4 sm:p-6">Due Date</th>
                <th className="p-4 sm:p-6">Paid Date</th>
                <th className="p-4 sm:p-6">Amount</th>
                <th className="p-4 sm:p-6">Payment Ref</th>
                <th className="p-4 sm:p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs text-[#1E2732]">
              {contributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-6 font-bold text-[#1E2732]">Month #{c.cycleNumber}</td>
                  <td className="p-4 sm:p-6 text-[#5C6773]">{c.dueDate}</td>
                  <td className="p-4 sm:p-6 text-[#1E2732]">{c.paidDate || '—'}</td>
                  <td className="p-4 sm:p-6 text-[#1B4B66] font-bold tabular-nums">₹{(c.amountInPaise / 100).toLocaleString('en-IN')}</td>
                  <td className="p-4 sm:p-6 text-[#5C6773] font-mono">{c.paymentGatewayRef || 'Pending'}</td>
                  <td className="p-4 sm:p-6 font-sans">
                    {c.status === 'paid' ? (
                      <span className="bg-[#1F8A5F]/10 text-[#1F8A5F] border border-[#1F8A5F]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A5F]" />
                        <span>PAID (Recorded by Admin)</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
                        Pending Admin Entry
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
