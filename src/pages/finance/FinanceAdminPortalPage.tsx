import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Download,
  FileCheck,
  Building,
  RotateCcw,
} from 'lucide-react';
import { store } from '../../store';

export const FinanceAdminPortalPage: React.FC = () => {
  const [, setTick] = useState(0);

  React.useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState<'escrow' | 'checker_payouts' | 'refunds' | 'ledger'>('escrow');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const currentFinanceAdmin = store.getCurrentUser();
  const payoutRecords = store.getPayoutRecords();
  const refundRequests = store.getRefundRequests();
  const financeLedger = store.getFinanceLedger();

  const handleCheckerApprove = (payoutId: string) => {
    store.approvePayoutChecker(payoutId);
    showToast(`CHECKER step approved for payout ${payoutId}! Disbursal executed.`);
  };

  const handleApproveRefund = (refundId: string) => {
    store.approveRefund(refundId);
    showToast(`Refund ${refundId} Approved & Credit Initiated!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-8 sm:pt-10 space-y-8">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Executive Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[18px] bg-purple-700 text-white flex items-center justify-center font-extrabold shadow-premium shrink-0">
              <DollarSign className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-700">Financial Control</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">
                  Finance Admin Portal
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight mt-0.5">
                Escrow Operations & Maker-Checker Disbursals
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-[16px] border border-slate-200 text-xs font-bold shadow-sm">
            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-1.5 ${
                activeTab === 'escrow' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Escrow Settlement</span>
            </button>
            <button
              onClick={() => setActiveTab('checker_payouts')}
              className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-1.5 ${
                activeTab === 'checker_payouts' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Checker Payouts ({payoutRecords.filter((p) => p.status === 'VERIFIED_BY_MAKER').length})</span>
            </button>
            <button
              onClick={() => setActiveTab('refunds')}
              className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-1.5 ${
                activeTab === 'refunds' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refunds ({refundRequests.filter((r) => r.status === 'PENDING_APPROVAL').length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-1.5 ${
                activeTab === 'ledger' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Escrow Ledger</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Escrow Settlement Dashboard */}
        {activeTab === 'escrow' && (
          <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 space-y-3 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Axis Trustee Escrow Vault</span>
                <p className="text-3xl font-extrabold font-mono text-[#1B4B66]">₹42,80,000.00</p>
                <span className="text-xs text-[#1F8A5F] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RBI Escrow Audit Verified</span>
                </span>
              </div>

              <div className="bg-white border border-[#1F8A5F]/20 rounded-[28px] p-6 space-y-3 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Pending CHECKER Disbursals</span>
                <p className="text-3xl font-extrabold font-mono text-[#1F8A5F]">
                  ₹{(payoutRecords.filter((p) => p.status === 'VERIFIED_BY_MAKER').reduce((acc, p) => acc + p.amountInPaise, 0) / 100).toLocaleString('en-IN')}.00
                </p>
                <span className="text-xs text-[#1F8A5F] font-bold">Awaiting Finance Admin Verification</span>
              </div>

              <div className="bg-white border border-amber-200 rounded-[28px] p-6 space-y-3 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Pending Refunds</span>
                <p className="text-3xl font-extrabold font-mono text-amber-600">
                  ₹{(refundRequests.filter((r) => r.status === 'PENDING_APPROVAL').reduce((acc, r) => acc + r.amountInPaise, 0) / 100).toLocaleString('en-IN')}.00
                </p>
                <span className="text-xs text-amber-600 font-bold">Pending Approval</span>
              </div>
            </div>

            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-4 shadow-premium">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Escrow Trustee Reconciliation Node</h3>
                  <p className="text-xs text-[#5C6773]">Nightly bank statement matching & settlement verification</p>
                </div>
                <button
                  onClick={() => showToast('Escrow Trustee Bank Node Reconciled Successfully!')}
                  className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-[12px] flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Execute Node Reconciliation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Checker Step Payout Approvals */}
        {activeTab === 'checker_payouts' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div>
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Maker-Checker Payout Disbursal Queue</h3>
              <p className="text-xs text-[#5C6773]">PostgreSQL DB Enforced Segregation of Duties: `verified_by_maker_id &lt;&gt; auth.uid()`</p>
            </div>

            <div className="space-y-4">
              {payoutRecords.map((p) => (
                <div key={p.id} className="p-6 rounded-[22px] bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B4B66]">#{p.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-['Sora'] font-extrabold text-base text-[#1E2732]">{p.userName}</p>
                    <p className="text-xs text-[#5C6773]">MAKER Step: Verified by <span className="font-bold text-[#1B4B66]">{p.verifiedByMakerName || 'Priya Verma (Maker)'}</span></p>
                    <p className="text-2xl font-extrabold font-mono text-[#1F8A5F] mt-1">₹{(p.amountInPaise / 100).toLocaleString('en-IN')}.00</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === 'VERIFIED_BY_MAKER' ? (
                      <button
                        onClick={() => handleCheckerApprove(p.id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white font-['Sora'] font-extrabold text-xs px-5 py-3 rounded-[14px] shadow-md flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Approve CHECKER Disbursal</span>
                      </button>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] font-bold text-xs">
                        {p.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Refund Approvals */}
        {activeTab === 'refunds' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Refund Requests Approval Queue</h3>
            <div className="space-y-4">
              {refundRequests.map((r) => (
                <div key={r.id} className="p-6 rounded-[22px] bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B4B66]">#{r.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                        {r.status}
                      </span>
                    </div>
                    <p className="font-['Sora'] font-bold text-base text-[#1E2732] mt-1">{r.userName}</p>
                    <p className="text-xs text-[#5C6773]">Reason: {r.reason}</p>
                    <p className="text-xl font-extrabold font-mono text-[#1E2732] mt-1">₹{(r.amountInPaise / 100).toLocaleString('en-IN')}.00</p>
                  </div>

                  {r.status === 'PENDING_APPROVAL' ? (
                    <button
                      onClick={() => handleApproveRefund(r.id)}
                      className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-[14px] shadow-md"
                    >
                      Approve & Initiate Refund
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#1F8A5F]">APPROVED by {r.approvedByFinanceAdminName}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Escrow Ledger */}
        {activeTab === 'ledger' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Master Escrow Financial Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[#5C6773] uppercase tracking-wider font-bold">
                    <th className="pb-3">Txn Reference</th>
                    <th className="pb-3">Member Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Escrow Bank Ref</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financeLedger.map((f) => (
                    <tr key={f.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3.5 font-mono text-[#1B4B66] font-bold">{f.txnRef}</td>
                      <td className="py-3.5 font-bold text-[#1E2732]">{f.userName}</td>
                      <td className="py-3.5 text-[#5C6773]">{f.type}</td>
                      <td className="py-3.5 font-mono font-extrabold text-[#1E2732]">₹{(f.amountInPaise / 100).toLocaleString('en-IN')}.00</td>
                      <td className="py-3.5 font-mono text-[10px] text-slate-500">{f.bankEscrowRef}</td>
                      <td className="py-3.5 text-right font-bold text-[#1F8A5F]">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
