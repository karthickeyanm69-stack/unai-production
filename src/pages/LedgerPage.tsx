import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { store } from '../store';

export const LedgerPage: React.FC = () => {
  const contributions = store.getContributions();

  return (
    <div className="layout-container pt-12 pb-36 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Financial Auditability</span>
          <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732] tracking-tight">Savings Wallet Ledger</h1>
          <p className="text-sm text-[#5C6773]">Itemized monthly contributions and escrow verification status</p>
        </div>

        <button
          onClick={() => alert('PDF Statement Downloaded (Simulated)')}
          className="bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-sm px-6 py-3.5 rounded-[14px] shadow-premium flex items-center gap-2 shrink-0 transition-all hover-lift"
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
                <th className="p-6">Cycle</th>
                <th className="p-6">Due Date</th>
                <th className="p-6">Paid Date</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Payment Ref</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs text-[#1E2732]">
              {contributions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-bold text-[#1E2732]">Month #{c.cycleNumber}</td>
                  <td className="p-6 text-[#5C6773]">{c.dueDate}</td>
                  <td className="p-6 text-[#1E2732]">{c.paidDate || '—'}</td>
                  <td className="p-6 text-[#1B4B66] font-bold tabular-nums">₹{c.amount.toLocaleString('en-IN')}</td>
                  <td className="p-6 text-[#5C6773] font-mono">{c.paymentGatewayRef || 'Pending'}</td>
                  <td className="p-6 font-sans">
                    {c.status === 'paid' ? (
                      <span className="bg-[#1F8A5F]/10 text-[#1F8A5F] border border-[#1F8A5F]/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A5F]" />
                        <span>Escrow Cleared</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-[#5C6773] border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold">
                        Upcoming
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
