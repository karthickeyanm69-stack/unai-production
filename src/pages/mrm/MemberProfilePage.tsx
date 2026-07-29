import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gift,
  Send,
  MessageSquare,
  Sparkles,
  Flame,
  CreditCard,
  Phone,
  Mail,
  User,
  Download,
} from 'lucide-react';
import { store } from '../../store';

export const MemberProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const memberId = id || 'usr_1';

  const member = store.getProfileById(memberId) || store.getCurrentUser();
  const membership = store.getMembership();
  const contributions = store.getContributions();
  const hamper = store.getSelectedHamper();
  const timeline = store.getActivityTimeline(memberId);
  const supportTickets = store.getSupportTickets().filter((t) => t.userId === memberId || memberId === 'usr_1');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendReminder = () => {
    store.sendNotification(
      memberId,
      'WHATSAPP',
      `Hello ${member.fullName.split(' ')[0]}, your SamruddiSave monthly contribution is active. Streak: ${membership.currentStreak}m!`
    );
    showToast(`WhatsApp payment reminder sent to ${member.phone}!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-8 sm:pt-10 pb-36 space-y-8">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/mrm"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1E2732] flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#1B4B66]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Member MRM Profile</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-extrabold">
                  {member.pipelineStage?.replace('_', ' ') || 'ACTIVE SAVER'}
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732] tracking-tight mt-0.5">
                {member.fullName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSendReminder}
              className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-['Sora'] font-extrabold text-xs px-5 py-3 rounded-[14px] shadow-premium transition-all hover-lift flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send WhatsApp Notice</span>
            </button>
          </div>
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Member Information & Status Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Member Profile Summary Card */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium relative overflow-hidden">
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                <img src={member.avatar} alt={member.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-[#1B4B66]" />
                <div>
                  <h3 className="font-['Sora'] font-extrabold text-lg text-[#1E2732]">{member.fullName}</h3>
                  <p className="text-xs text-[#5C6773] font-mono">{member.id}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-bold">
                    KYC Verified • NSDL Approved
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-3 text-[#5C6773]">
                  <Mail className="w-4 h-4 text-[#1B4B66]" />
                  <span className="font-medium text-[#1E2732] truncate">{member.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-[#5C6773]">
                  <Phone className="w-4 h-4 text-[#1B4B66]" />
                  <span className="font-mono font-medium text-[#1E2732]">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-[#5C6773]">
                  <User className="w-4 h-4 text-[#1B4B66]" />
                  <span className="font-medium text-[#1E2732]">MRM Lead: {member.assignedEmployeeName || 'Priya Verma'}</span>
                </div>
              </div>
            </div>

            {/* Savings Plan Stats Card */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-4 shadow-premium">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#1E2732]">Active Plan Details</span>
                <span className="text-[10px] bg-[#1B4B66]/10 text-[#1B4B66] font-extrabold px-3 py-1 rounded-full">
                  Gold Harvest
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200">
                  <span className="text-[#5C6773] text-[10px] block">Monthly Commitment</span>
                  <p className="font-mono font-extrabold text-base text-[#1E2732] mt-0.5">₹1,000.00</p>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200">
                  <span className="text-[#5C6773] text-[10px] block">Savings Streak</span>
                  <p className="font-extrabold text-base text-[#D4A62A] mt-0.5 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-[#D4A62A]" />
                    <span>8 Months</span>
                  </p>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200">
                  <span className="text-[#5C6773] text-[10px] block">Total Savings</span>
                  <p className="font-mono font-extrabold text-base text-[#1F8A5F] mt-0.5">₹8,000.00</p>
                </div>
                <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200">
                  <span className="text-[#5C6773] text-[10px] block">Maturity Target</span>
                  <p className="font-mono font-extrabold text-base text-[#1B4B66] mt-0.5">₹12,600.00</p>
                </div>
              </div>
            </div>

            {/* Selected Hamper Details Card */}
            <div className="bg-white border border-[#D4A62A]/30 rounded-[28px] p-6 sm:p-8 space-y-4 shadow-premium">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4A62A] uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#D4A62A]" />
                  <span>Selected Gift Hamper</span>
                </span>
                <span className="text-[10px] bg-[#1F8A5F]/15 text-[#1F8A5F] font-bold px-2.5 py-0.5 rounded-full">
                  Dispatched
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <img src={hamper.imageUrl} alt={hamper.title} className="w-16 h-16 rounded-[16px] object-cover shadow-sm" />
                <div>
                  <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">{hamper.title}</p>
                  <p className="text-xs text-[#5C6773]">Cap: ₹{hamper.estimatedValue}</p>
                  <p className="text-[10px] text-[#1B4B66] font-mono font-bold mt-1">Ref: BLUE_DART_891234</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contribution Ledger & Activity Timeline */}
          <div className="lg:col-span-8 space-y-8">
            {/* 12-Month Contribution Ledger Table */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">12-Month Contribution Ledger</h3>
                  <p className="text-xs text-[#5C6773]">NPCI AutoPay monthly debits & Escrow Trustee settlements</p>
                </div>
                <button
                  onClick={() => showToast('Exported Member Ledger PDF')}
                  className="bg-[#1B4B66]/10 text-[#1B4B66] hover:bg-[#1B4B66]/20 font-bold text-xs px-4 py-2 rounded-[12px] flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[#5C6773] uppercase tracking-wider font-bold">
                      <th className="pb-3">Cycle #</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Paid Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Gateway Ref</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contributions.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3.5 font-mono font-extrabold text-[#1E2732]">Month #{c.cycleNumber}</td>
                        <td className="py-3.5 text-[#5C6773]">{c.dueDate}</td>
                        <td className="py-3.5 text-[#5C6773] font-mono">{c.paidDate || '—'}</td>
                        <td className="py-3.5 font-mono font-bold text-[#1E2732]">₹{c.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 font-mono text-[10px] text-[#1B4B66]">{c.paymentGatewayRef || 'Pending AutoPay'}</td>
                        <td className="py-3.5 text-right">
                          {c.status === 'paid' ? (
                            <span className="px-3 py-1 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] font-extrabold text-[10px]">
                              Paid & Escrow Cleared
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px]">
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

            {/* Step-by-Step Activity Timeline */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Member Step-by-Step Activity Timeline</h3>
                <p className="text-xs text-[#5C6773]">Complete audit trail from Account Registration to Maturity Payout</p>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
                {timeline.map((act) => (
                  <div key={act.id} className="relative flex items-start space-x-4 pl-2">
                    <div
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 z-10 shadow-md"
                      style={{ backgroundColor: act.badgeColor || '#1B4B66' }}
                    >
                      ✓
                    </div>
                    <div className="bg-[#F8FAFC] border border-slate-200 rounded-[18px] p-4 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">{act.title}</p>
                        <span className="text-[10px] text-[#5C6773] font-mono">{act.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#5C6773] leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
