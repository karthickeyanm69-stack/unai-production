import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Clock,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';
import { store } from '../../store';
import { PipelineStage, Profile } from '../../types';

export const MRMDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>(store.getProfiles());
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStageChange = (userId: string, newStage: PipelineStage) => {
    store.updatePipelineStage(userId, newStage);
    setProfiles(store.getProfiles());
    triggerToast(`Updated Member pipeline stage to ${newStage.replace('_', ' ')}`);
  };

  const pipelineColumns: { id: PipelineStage; title: string; color: string }[] = [
    { id: 'SIGNUP', title: '1. New Signup', color: 'border-slate-300 bg-slate-100 text-slate-700' },
    { id: 'KYC_PENDING', title: '2. Approval Pending', color: 'border-[#D4A62A] bg-[#D4A62A]/10 text-[#D4A62A]' },
    { id: 'KYC_APPROVED', title: '3. Account Approved', color: 'border-[#1F8A5F] bg-[#1F8A5F]/10 text-[#1F8A5F]' },
    { id: 'PAYMENT_ACTIVE', title: '4. Active Saver', color: 'border-[#1B4B66] bg-[#1B4B66]/10 text-[#1B4B66]' },
    { id: 'GRACE_PERIOD', title: '5. Grace Warning', color: 'border-[#DB9A2C] bg-[#FDF6E2] text-[#DB9A2C]' },
    { id: 'HAMPER_SELECTED', title: '6. Hamper Locked', color: 'border-[#D4A62A] bg-amber-50 text-[#D4A62A]' },
    { id: 'PAYOUT_PROCESSING', title: '7. Payout Pending', color: 'border-purple-400 bg-purple-50 text-purple-700' },
    { id: 'COMPLETED', title: '8. Plan Matured', color: 'border-[#1F8A5F] bg-emerald-50 text-[#1F8A5F]' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-8 sm:pt-10 pb-36 space-y-8">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[18px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-premium shrink-0">
              <Users className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Fintech Operations</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-extrabold">
                  MRM Workspace
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight mt-0.5">
                Member Relationship Management (MRM)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Member Name or Phone..."
                className="w-full pl-9 pr-4 py-2.5 rounded-[14px] bg-white border border-slate-200 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66] shadow-sm font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* 6 Key Operational Member Widgets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-[#1B4B66]/15 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Today's Due Payments</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1B4B66]">14</span>
              <Clock className="w-4 h-4 text-[#1B4B66]" />
            </div>
            <p className="text-[10px] text-[#1F8A5F] font-bold">AutoPay Scheduled</p>
          </div>

          <div className="bg-white border border-[#DB9A2C]/30 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Grace Period Members</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#DB9A2C]">3</span>
              <AlertTriangle className="w-4 h-4 text-[#DB9A2C]" />
            </div>
            <p className="text-[10px] text-[#DB9A2C] font-bold">5-Day Alert Active</p>
          </div>

          <div className="bg-white border border-[#D4A62A]/40 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">KYC Waiting</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#D4A62A]">1</span>
              <ShieldCheck className="w-4 h-4 text-[#D4A62A]" />
            </div>
            <p className="text-[10px] text-[#5C6773]">Pending Approval</p>
          </div>

          <div className="bg-white border border-[#1F8A5F]/20 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Upcoming Maturity</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F8A5F]">₹5.2L</span>
              <TrendingUp className="w-4 h-4 text-[#1F8A5F]" />
            </div>
            <p className="text-[10px] text-[#1F8A5F] font-bold">42 Disbursals Ready</p>
          </div>

          <div className="bg-white border border-amber-200 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Pending Hampers</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">2</span>
              <Gift className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-[10px] text-amber-600 font-bold">Selection Locked</p>
          </div>

          <div className="bg-white border border-purple-200 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
            <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Open Support Tickets</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-700">2</span>
              <MessageSquare className="w-4 h-4 text-purple-700" />
            </div>
            <p className="text-[10px] text-purple-700 font-bold">In Progress</p>
          </div>
        </div>

        {/* Member Lifecycle MRM Pipeline Kanban Board */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">
                Member Lifecycle MRM Pipeline
              </h3>
              <p className="text-xs text-[#5C6773]">
                Manage member savings lifecycle stages from Signup to Maturity Payout
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B4B66]">
              <Filter className="w-4 h-4" />
              <span>Filter Assigned: My Members</span>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
            {pipelineColumns.map((col) => {
              const columnMembers = profiles.filter((p) => {
                const stage = p.pipelineStage || 'PAYMENT_ACTIVE';
                const matchSearch =
                  p.fullName.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
                return stage === col.id && matchSearch;
              });

              return (
                <div
                  key={col.id}
                  className="bg-[#F8FAFC] border border-slate-200 rounded-[22px] p-4 space-y-3 w-72 shrink-0 sm:w-80 snap-start flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${col.color}`}>
                      {col.title}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#5C6773]">{columnMembers.length}</span>
                  </div>

                  <div className="space-y-3 min-h-[160px]">
                    {columnMembers.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">No members in this stage</div>
                    ) : (
                      columnMembers.map((m) => (
                        <div
                          key={m.id}
                          className="bg-white border border-slate-200 rounded-[18px] p-4 shadow-sm space-y-3 hover:border-[#1B4B66]/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={m.avatar}
                                alt={m.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <Link
                                  to={`/crm/member/${m.id}`}
                                  className="font-['Sora'] font-bold text-xs text-[#1E2732] hover:text-[#1B4B66] group-hover:underline flex items-center gap-1"
                                >
                                  <span>{m.fullName}</span>
                                  <ChevronRight className="w-3 h-3 text-[#1B4B66]" />
                                </Link>
                                <p className="text-[10px] text-[#5C6773] font-mono">{m.phone}</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-[#5C6773] font-bold">Assigned: {m.assignedEmployeeName || 'Priya V.'}</span>
                            <button
                              onClick={() => {
                                store.sendNotification(
                                  m.id,
                                  'WHATSAPP',
                                  `Hi ${m.fullName.split(' ')[0]}, your SamruddiSave monthly contribution update.`
                                );
                                triggerToast(`WhatsApp Notice sent to ${m.fullName}`);
                              }}
                              className="bg-[#1F8A5F]/15 hover:bg-[#1F8A5F]/25 text-[#1F8A5F] px-2.5 py-1 rounded-full font-bold flex items-center gap-1"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
