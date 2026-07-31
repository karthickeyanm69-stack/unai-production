import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Clock,
  Gift,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  TrendingUp,
  Search,
  Menu,
  X,
  CreditCard,
  Bell,
  User,
  LogOut,
  DollarSign,
  FileCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { store } from '../../store';
import { PipelineStage, Profile } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const [, setTick] = useState(0);

  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      setProfiles(store.getProfiles());
      setTick((t) => t + 1);
    });
    return unsub;
  }, []);

  const [activeModule, setActiveModule] = useState<
    'overview' | 'members' | 'kyc' | 'payments' | 'grace' | 'hampers' | 'payouts' | 'timeline'
  >('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>(store.getProfiles());
  const [search, setSearch] = useState('');
  const [filterAssignedOnly, setFilterAssignedOnly] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [kycRejectReason, setKycRejectReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const currentEmployee = store.getCurrentUser();

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStageChange = (userId: string, newStage: PipelineStage) => {
    store.updatePipelineStage(userId, newStage);
    setProfiles(store.getProfiles());
    triggerToast(`Updated Member pipeline stage to ${newStage.replace('_', ' ')}`);
  };

  const handleKycResubmit = (userId: string) => {
    if (!kycRejectReason) return;
    store.requestKYCResubmission(userId, kycRejectReason);
    setKycRejectReason('');
    setProfiles(store.getProfiles());
    triggerToast('Resubmission request sent to member via WhatsApp & SMS!');
  };

  const handleMakerVerify = (payoutId: string) => {
    store.verifyPayoutMaker(payoutId);
    triggerToast(`MAKER step verified for payout ${payoutId}! Sent to Finance Admin for CHECKER approval.`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'members', label: 'Assigned Members', icon: Users },
    { id: 'kyc', label: 'KYC Review', icon: ShieldCheck, badge: 1 },
    { id: 'payments', label: 'Payment Monitoring', icon: CreditCard },
    { id: 'grace', label: 'Grace Management', icon: AlertTriangle, badge: 1 },
    { id: 'hampers', label: 'Hamper Tracking', icon: Gift, badge: 1 },
    { id: 'payouts', label: 'Payout MAKER Verification', icon: DollarSign },
    { id: 'timeline', label: 'Activity Timeline', icon: Clock },
  ];

  const pipelineColumns: { id: PipelineStage; title: string; color: string }[] = [
    { id: 'SIGNUP', title: '1. Member Signup', color: 'border-slate-300 bg-slate-100 text-slate-700' },
    { id: 'KYC_PENDING', title: '2. KYC Pending', color: 'border-[#D4A62A] bg-[#D4A62A]/10 text-[#D4A62A]' },
    { id: 'KYC_APPROVED', title: '3. KYC Approved', color: 'border-[#1F8A5F] bg-[#1F8A5F]/10 text-[#1F8A5F]' },
    { id: 'PAYMENT_ACTIVE', title: '4. Savings Active', color: 'border-[#1B4B66] bg-[#1B4B66]/10 text-[#1B4B66]' },
    { id: 'GRACE_PERIOD', title: '5. Grace Period', color: 'border-[#DB9A2C] bg-[#FDF6E2] text-[#DB9A2C]' },
    { id: 'HAMPER_SELECTED', title: '6. Hamper Selected', color: 'border-[#D4A62A] bg-amber-50 text-[#D4A62A]' },
    { id: 'PAYOUT_PROCESSING', title: '7. Payout Processing', color: 'border-purple-400 bg-purple-50 text-purple-700' },
    { id: 'COMPLETED', title: '8. Plan Matured', color: 'border-[#1F8A5F] bg-emerald-50 text-[#1F8A5F]' },
  ];

  const displayedProfiles = profiles.filter((p) => {
    const isMemberRole = p.role === 'member';
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    const matchesAssigned = !filterAssignedOnly || p.assignedEmployeeId === currentEmployee.id || currentEmployee.role === 'super_admin';
    return isMemberRole && matchesSearch && matchesAssigned;
  });

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] flex flex-col lg:flex-row">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 left-4 right-4 sm:left-auto sm:right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
          <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-[#F7F5EF] text-[#1B4B66] hover:bg-slate-200 transition-all"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-['Sora'] font-extrabold text-base text-[#1E2732]">
            Member<span className="text-[#1B4B66]">Ops</span>
          </span>
        </div>
        <span className="text-xs font-bold text-[#1B4B66] bg-[#1B4B66]/10 px-3 py-1 rounded-full">
          {currentEmployee.fullName}
        </span>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-full lg:h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">SamruddiSave</p>
                <p className="text-[10px] text-[#5C6773] font-bold">Member Operations Portal</p>
              </div>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[14px] transition-all text-left ${
                    isActive
                      ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                      : 'text-[#5C6773] hover:text-[#1E2732] hover:bg-[#F7F5EF]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#D4A62A]' : 'text-[#1B4B66]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#D4A62A] text-[#1E2732]' : 'bg-[#1B4B66]/10 text-[#1B4B66]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img src={currentEmployee.avatar} alt={currentEmployee.fullName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
              <div>
                <p className="font-bold text-xs text-[#1E2732]">{currentEmployee.fullName}</p>
                <p className="text-[10px] text-[#5C6773]">Operations Officer</p>
              </div>
            </div>
            <Link to="/" title="Exit to Website" className="text-slate-400 hover:text-[#1B4B66]">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Operational Content */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Member Operations & Lifecycle</span>
            <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732] tracking-tight mt-0.5">
              Officer Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterAssignedOnly(!filterAssignedOnly)}
              className={`px-3.5 py-2 rounded-[12px] text-xs font-bold transition-all border ${
                filterAssignedOnly
                  ? 'bg-[#1B4B66] text-white border-[#1B4B66]'
                  : 'bg-white text-[#5C6773] border-slate-300'
              }`}
            >
              {filterAssignedOnly ? 'Showing My Assigned Members' : 'Showing All Members'}
            </button>

            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Member..."
                className="w-full pl-9 pr-4 py-2 rounded-[12px] bg-white border border-slate-200 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Module 1: Overview & Pipeline Board */}
        {activeModule === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#1B4B66]/15 rounded-[22px] p-5 space-y-2 shadow-premium">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Assigned Portfolio</span>
                <span className="text-3xl font-extrabold font-mono text-[#1B4B66]">{displayedProfiles.length}</span>
                <p className="text-[10px] text-[#1F8A5F] font-bold">Active Members</p>
              </div>

              <div className="bg-white border border-[#D4A62A]/40 rounded-[22px] p-5 space-y-2 shadow-premium">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Pending KYC Review</span>
                <span className="text-3xl font-extrabold font-mono text-[#D4A62A]">1</span>
                <p className="text-[10px] text-[#5C6773]">Waiting Review</p>
              </div>

              <div className="bg-white border border-[#DB9A2C]/30 rounded-[22px] p-5 space-y-2 shadow-premium">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Grace Period 5-Day Alert</span>
                <span className="text-3xl font-extrabold font-mono text-[#DB9A2C]">1</span>
                <p className="text-[10px] text-[#DB9A2C] font-bold">Action Required</p>
              </div>

              <div className="bg-white border border-[#1F8A5F]/20 rounded-[22px] p-5 space-y-2 shadow-premium">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Payout MAKER Queue</span>
                <span className="text-3xl font-extrabold font-mono text-[#1F8A5F]">1</span>
                <p className="text-[10px] text-[#1F8A5F] font-bold">Eligible for Disbursal</p>
              </div>
            </div>

            {/* Explicit 8-Stage Lifecycle Pipeline Kanban */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Explicit 8-Stage Lifecycle Pipeline Board</h3>
                <p className="text-xs text-[#5C6773]">Member Signup ➔ KYC Pending ➔ KYC Approved ➔ Savings Active ➔ Grace Period ➔ Hamper Selected ➔ Payout Processing ➔ Completed</p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
                {pipelineColumns.map((col) => {
                  const colMembers = displayedProfiles.filter((p) => (p.pipelineStage || 'PAYMENT_ACTIVE') === col.id);

                  return (
                    <div key={col.id} className="bg-[#F8FAFC] border border-slate-200 rounded-[22px] p-4 space-y-3 w-72 shrink-0 snap-start">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${col.color}`}>
                          {col.title}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#5C6773]">{colMembers.length}</span>
                      </div>

                      <div className="space-y-3 min-h-[140px]">
                        {colMembers.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMember(m)}
                            className="bg-white border border-slate-200 rounded-[18px] p-4 shadow-sm space-y-2 hover:border-[#1B4B66]/40 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3">
                              <img src={m.avatar} alt={m.fullName} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-['Sora'] font-bold text-xs text-[#1E2732] group-hover:text-[#1B4B66]">
                                  {m.fullName}
                                </p>
                                <p className="text-[10px] text-[#5C6773] font-mono">{m.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-100">
                              <span className="text-[#1F8A5F] font-bold">Streak: 8m</span>
                              <span className="text-[#1B4B66] font-bold group-hover:underline">Inspect 360° →</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Assigned Members Directory */}
        {activeModule === 'members' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Assigned Members Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[#5C6773] uppercase tracking-wider font-bold">
                    <th className="pb-3">Member Name</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">KYC Status</th>
                    <th className="pb-3">Pipeline Stage</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 font-bold text-[#1E2732]">{p.fullName}</td>
                      <td className="py-4 font-mono text-[#5C6773]">{p.phone}</td>
                      <td className="py-4 font-bold text-[#1F8A5F]">{p.kycStatus.toUpperCase()}</td>
                      <td className="py-4 font-bold text-[#1B4B66]">{p.pipelineStage || 'PAYMENT_ACTIVE'}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => setSelectedMember(p)} className="bg-[#1B4B66] text-white font-bold px-3 py-1.5 rounded-[8px]">
                          Inspect 360° Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 3: KYC Review & Resubmission Request */}
        {activeModule === 'kyc' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Pending KYC Review Queue</h3>
                <p className="text-xs text-[#5C6773]">Review AI OCR verification and approve member accounts</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                {profiles.filter((p) => p.kycStatus === 'pending').length} Pending
              </span>
            </div>

            {profiles.filter((p) => p.kycStatus === 'pending').length === 0 ? (
              <div className="p-8 bg-[#F8FAFC] rounded-[20px] border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#1F8A5F] mx-auto" />
                <p className="font-bold text-sm text-[#1E2732]">No Pending Applications</p>
                <p className="text-xs text-[#5C6773]">All customer KYC applications have been reviewed and approved!</p>
              </div>
            ) : (
              profiles
                .filter((p) => p.kycStatus === 'pending')
                .map((p) => (
                  <div key={p.id} className="p-6 bg-[#F8FAFC] rounded-[20px] border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <p className="font-bold text-base text-[#1E2732]">{p.fullName} ({p.id})</p>
                        <p className="text-xs text-[#5C6773] font-mono">
                          Phone: {p.phone} • Email: {p.email} • PAN: {p.maskedPan || 'XXXXX5678G'}
                        </p>
                        <span className="text-[10px] text-[#1F8A5F] font-bold mt-1 block">OCR 99.8% Match Verified • Pending Officer Sign-off</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            store.approveMemberKyc(p.id, 'Priya Verma (Senior MRM Officer)');
                            triggerToast(`KYC & Account Approved for ${p.fullName}!`);
                          }}
                          className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-[12px] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve Account & KYC</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Module 5: Grace Period Management (Cured vs Expired) */}
        {activeModule === 'grace' && (
          <div className="bg-white border border-[#DB9A2C]/30 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Grace Period Management (5-Day Warning)</h3>
            <div className="p-6 bg-[#FDF6E2] border border-[#DB9A2C] rounded-[20px] space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-base text-[#1E2732]">Rahul Verma (usr_102)</p>
                  <p className="text-xs text-[#5C6773]">1 Day Remaining in 5-Day Grace Period</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => triggerToast('WhatsApp Grace Warning Sent!')} className="bg-[#DB9A2C] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                    Send Reminder
                  </button>
                  <button onClick={() => { store.markGraceRecovered('gpc_1'); triggerToast('Marked Grace Recovered!'); }} className="bg-[#1F8A5F] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                    Mark Recovered
                  </button>
                  <button onClick={() => { store.expireGracePeriod('gpc_1'); triggerToast('Grace Expired: Member marked DEFAULTED.'); }} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                    Expire Grace (Day 6+)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module 7: Payout MAKER Step Verification */}
        {activeModule === 'payouts' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div>
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Payout Disbursal MAKER Step Verification</h3>
              <p className="text-xs text-[#5C6773]">Employee Operations Officer verifies 12 completed contributions & KYC compliance before sending to Finance Admin for CHECKER approval.</p>
            </div>

            <div className="space-y-3">
              {store.getPayoutRecords().map((p) => (
                <div key={p.id} className="p-5 rounded-[20px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#1B4B66]">#{p.id}</span>
                    <p className="font-bold text-base text-[#1E2732]">{p.userName}</p>
                    <p className="text-xs text-[#1F8A5F] font-mono font-bold">₹{(p.amountInPaise / 100).toLocaleString('en-IN')}.00</p>
                  </div>
                  {p.status === 'PENDING' ? (
                    <button onClick={() => handleMakerVerify(p.id)} className="bg-[#1B4B66] text-white font-bold text-xs px-4 py-2.5 rounded-[12px]">
                      Verify MAKER Step
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#1F8A5F]">{p.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 8: Member Activity Timeline */}
        {activeModule === 'timeline' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Member Operational Activity Timeline</h3>
            <p className="text-xs text-[#5C6773]">Member Signup ➔ KYC Submitted ➔ Payment Made ➔ Reminder Sent ➔ Grace Period ➔ Hamper Selected ➔ Payout Released</p>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
              {store.getActivityTimeline('usr_1').map((act) => (
                <div key={act.id} className="relative flex items-start space-x-4 pl-2">
                  <div className="w-7 h-7 rounded-full bg-[#1B4B66] text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
                    ✓
                  </div>
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-[18px] p-4 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">{act.title}</p>
                      <span className="text-[10px] text-[#5C6773] font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#5C6773]">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 360° Member Profile Inspection Drawer */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-[#1E2732]/70 backdrop-blur-md flex justify-end animate-fade-up">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6 text-[#1E2732] relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <img src={selectedMember.avatar} alt={selectedMember.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-[#1B4B66]" />
                <div>
                  <h3 className="font-['Sora'] font-extrabold text-lg text-[#1E2732]">{selectedMember.fullName}</h3>
                  <p className="text-xs text-[#5C6773] font-mono">{selectedMember.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-[18px] bg-[#F7F5EF] border border-slate-200 space-y-2">
                <span className="font-bold text-[#1B4B66] uppercase block">Member 360° Snapshot</span>
                <p>Plan: <span className="font-bold text-[#1E2732]">₹1,000/mo Gold Harvest</span></p>
                <p>Streak: <span className="font-bold text-[#D4A62A]">8 Months Active</span></p>
                <p>Escrow Balance: <span className="font-mono font-bold text-[#1F8A5F]">₹8,000.00</span></p>
                <p>Selected Hamper: <span className="font-bold text-[#1E2732]">Smart Home & Tech Hamper</span></p>
              </div>

              <button
                onClick={() => { triggerToast(`WhatsApp reminder sent to ${selectedMember.fullName}!`); setSelectedMember(null); }}
                className="w-full py-3.5 rounded-[14px] bg-[#1F8A5F] hover:bg-emerald-600 text-white font-['Sora'] font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send WhatsApp Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
