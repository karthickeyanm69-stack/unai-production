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
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  Menu,
  X,
  CreditCard,
  Bell,
  User,
  ArrowRight,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Download,
} from 'lucide-react';
import { store } from '../../store';
import { PipelineStage, Profile } from '../../types';

export const EmployeeDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<
    'overview' | 'members' | 'kyc' | 'payments' | 'grace' | 'hampers' | 'payouts' | 'support' | 'notifications' | 'profile'
  >('overview');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>(store.getProfiles());
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
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

  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'members', label: 'My Members', icon: Users },
    { id: 'kyc', label: 'Pending KYC', icon: ShieldCheck, badge: 1 },
    { id: 'payments', label: 'Payment Monitoring', icon: CreditCard },
    { id: 'grace', label: 'Grace Period', icon: AlertTriangle, badge: 3 },
    { id: 'hampers', label: 'Hamper Selection', icon: Gift, badge: 2 },
    { id: 'payouts', label: 'Payout Processing', icon: DollarSign },
    { id: 'support', label: 'Support Center', icon: MessageSquare, badge: 2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const pipelineColumns: { id: PipelineStage; title: string; color: string }[] = [
    { id: 'SIGNUP', title: '1. New Signup', color: 'border-slate-300 bg-slate-100 text-slate-700' },
    { id: 'KYC_PENDING', title: '2. KYC Waiting', color: 'border-[#D4A62A] bg-[#D4A62A]/10 text-[#D4A62A]' },
    { id: 'KYC_APPROVED', title: '3. KYC Approved', color: 'border-[#1F8A5F] bg-[#1F8A5F]/10 text-[#1F8A5F]' },
    { id: 'PAYMENT_ACTIVE', title: '4. Savings Active', color: 'border-[#1B4B66] bg-[#1B4B66]/10 text-[#1B4B66]' },
    { id: 'GRACE_PERIOD', title: '5. Grace Period', color: 'border-[#DB9A2C] bg-[#FDF6E2] text-[#DB9A2C]' },
    { id: 'HAMPER_SELECTED', title: '6. Hamper Selected', color: 'border-[#D4A62A] bg-amber-50 text-[#D4A62A]' },
    { id: 'PAYOUT_PROCESSING', title: '7. Payout Processing', color: 'border-purple-400 bg-purple-50 text-purple-700' },
    { id: 'COMPLETED', title: '8. Completed', color: 'border-[#1F8A5F] bg-emerald-50 text-[#1F8A5F]' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] flex flex-col lg:flex-row">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
          <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Mobile Header (Appears on screens < 1024px) */}
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
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#1B4B66] bg-[#1B4B66]/10 px-3 py-1 rounded-full">
            Priya V. (Executive)
          </span>
        </div>
      </header>

      {/* Sidebar Navigation (Mobile Slide-out + Desktop Fixed) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-full lg:h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">SamruddiSave</p>
                <p className="text-[10px] text-[#5C6773] font-bold">Employee Operations Portal</p>
              </div>
            </div>
            <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
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

        {/* Bottom Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
                alt="Priya Verma"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="font-bold text-xs text-[#1E2732]">Priya Verma</p>
                <p className="text-[10px] text-[#5C6773]">KYC & Operations Officer</p>
              </div>
            </div>
            <Link to="/" title="Exit to Website" className="text-slate-400 hover:text-[#1B4B66]">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Operational Workspace Content Area */}
      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Module 1: Overview & KPI Dashboard */}
        {activeModule === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Employee MRM Hub</span>
                <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732] tracking-tight mt-0.5">
                  Member Operations Overview
                </h1>
              </div>

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

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white border border-[#1B4B66]/15 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Assigned Members</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1B4B66]">48</span>
                  <Users className="w-4 h-4 text-[#1B4B66]" />
                </div>
                <p className="text-[10px] text-[#1F8A5F] font-bold">Active Portfolio</p>
              </div>

              <div className="bg-white border border-[#D4A62A]/40 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Pending KYC</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#D4A62A]">3</span>
                  <ShieldCheck className="w-4 h-4 text-[#D4A62A]" />
                </div>
                <p className="text-[10px] text-[#5C6773]">Review Queue</p>
              </div>

              <div className="bg-white border border-[#1B4B66]/15 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Today's Due</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1B4B66]">14</span>
                  <Clock className="w-4 h-4 text-[#1B4B66]" />
                </div>
                <p className="text-[10px] text-[#1F8A5F] font-bold">AutoPay Scheduled</p>
              </div>

              <div className="bg-white border border-[#DB9A2C]/30 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Grace Period</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#DB9A2C]">3</span>
                  <AlertTriangle className="w-4 h-4 text-[#DB9A2C]" />
                </div>
                <p className="text-[10px] text-[#DB9A2C] font-bold">5-Day Alert</p>
              </div>

              <div className="bg-white border border-[#1F8A5F]/20 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Upcoming Payouts</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1F8A5F]">₹5.2L</span>
                  <TrendingUp className="w-4 h-4 text-[#1F8A5F]" />
                </div>
                <p className="text-[10px] text-[#1F8A5F] font-bold">42 Disbursals</p>
              </div>

              <div className="bg-white border border-purple-200 rounded-[22px] p-5 space-y-2 shadow-premium hover-lift">
                <span className="text-[11px] text-[#5C6773] font-bold uppercase tracking-wider block">Open Tickets</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-700">2</span>
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                </div>
                <p className="text-[10px] text-purple-700 font-bold">Support Desk</p>
              </div>
            </div>

            {/* Interactive Touch/Click Kanban Pipeline */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Member Lifecycle Pipeline Board</h3>
                  <p className="text-xs text-[#5C6773]">Move assigned members through operational lifecycle stages</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
                {pipelineColumns.map((col) => {
                  const colMembers = profiles.filter((p) => (p.pipelineStage || 'PAYMENT_ACTIVE') === col.id);

                  return (
                    <div
                      key={col.id}
                      className="bg-[#F8FAFC] border border-slate-200 rounded-[22px] p-4 space-y-3 min-w-[260px]"
                    >
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
                            className="bg-white border border-slate-200 rounded-[18px] p-4 shadow-sm space-y-3 hover:border-[#1B4B66]/40 transition-all cursor-pointer group"
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
                              <span className="text-[#1B4B66] font-bold group-hover:underline">View 360° Profile →</span>
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

        {/* Module 2: My Members List */}
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
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 font-bold text-[#1E2732]">{p.fullName}</td>
                      <td className="py-4 font-mono text-[#5C6773]">{p.phone}</td>
                      <td className="py-4 font-bold text-[#1F8A5F]">{p.kycStatus.toUpperCase()}</td>
                      <td className="py-4 font-bold text-[#1B4B66]">{p.pipelineStage || 'PAYMENT_ACTIVE'}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedMember(p)}
                          className="bg-[#1B4B66] text-white font-bold px-3 py-1.5 rounded-[8px]"
                        >
                          View 360° Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 3: Pending KYC Verification */}
        {activeModule === 'kyc' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Pending KYC Review Queue</h3>
            <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-base text-[#1E2732]">Ananya Sharma (usr_1)</p>
                <p className="text-xs text-[#5C6773] font-mono">PAN: ABCDE1234F • Aadhaar: 9876 5432 1098</p>
                <span className="text-[10px] text-[#1F8A5F] font-bold mt-1 block">OCR 99.8% Match Verified</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerToast('KYC Approved for Ananya Sharma!')}
                  className="bg-[#1F8A5F] text-white font-bold text-xs px-4 py-2 rounded-[10px]"
                >
                  Approve KYC
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Module 4: Payment Monitoring */}
        {activeModule === 'payments' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Payment Monitoring & Debits</h3>
            <p className="text-xs text-[#5C6773]">NPCI AutoPay monthly debit verification</p>
          </div>
        )}

        {/* Module 5: Grace Period Management */}
        {activeModule === 'grace' && (
          <div className="bg-white border border-[#DB9A2C]/30 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Grace Period Members (5-Day Warning)</h3>
            <div className="p-5 bg-[#FDF6E2] border border-[#DB9A2C] rounded-[20px] flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-[#1E2732]">Rahul Verma (usr_102)</p>
                <p className="text-xs text-[#5C6773]">2 Days Remaining in Grace Period</p>
              </div>
              <button
                onClick={() => triggerToast('WhatsApp Grace Warning Sent!')}
                className="bg-[#DB9A2C] text-white font-bold text-xs px-4 py-2 rounded-[10px]"
              >
                Send Reminder SMS
              </button>
            </div>
          </div>
        )}

        {/* Module 6: Hamper Selection */}
        {activeModule === 'hampers' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Hamper Selection Tracking</h3>
            <p className="text-xs text-[#5C6773]">Selected hampers dispatch status</p>
          </div>
        )}

        {/* Module 7: Payout Processing */}
        {activeModule === 'payouts' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Payout Disbursal Queue</h3>
            <p className="text-xs text-[#5C6773]">Escrow trustee bank maturity transfers</p>
          </div>
        )}

        {/* Module 8: Support Center */}
        {activeModule === 'support' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Employee Support Desk</h3>
            <p className="text-xs text-[#5C6773]">Member help requests</p>
          </div>
        )}

        {/* Module 9: Notifications */}
        {activeModule === 'notifications' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Notification Dispatch Center</h3>
            <p className="text-xs text-[#5C6773]">WhatsApp & SMS dispatch log</p>
          </div>
        )}

        {/* Module 10: My Profile */}
        {activeModule === 'profile' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Employee Profile & Settings</h3>
            <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-slate-200 space-y-2">
              <p className="font-bold text-base text-[#1E2732]">Priya Verma</p>
              <p className="text-xs text-[#5C6773]">Role: KYC & Member Operations Officer</p>
              <p className="text-xs text-[#1B4B66] font-mono">Assigned Portfolio: 48 Members</p>
            </div>
          </div>
        )}
      </main>

      {/* 360° Member Profile Detail Drawer (Opens when clicking any member) */}
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
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E2732] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-[18px] bg-[#F7F5EF] border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-[#1B4B66] uppercase block">Member 360° Snapshot</span>
                <p>Plan: <span className="font-bold text-[#1E2732]">₹1,000/mo Gold Harvest</span></p>
                <p>Streak: <span className="font-bold text-[#D4A62A]">8 Months Active</span></p>
                <p>Escrow Savings: <span className="font-mono font-bold text-[#1F8A5F]">₹8,000.00</span></p>
                <p>Selected Hamper: <span className="font-bold text-[#1E2732]">Smart Home & Tech Hamper</span></p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E2732] block">Internal Employee Operational Notes</label>
                <textarea
                  placeholder="Add internal note regarding member payment or KYC..."
                  className="w-full p-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
                  rows={3}
                />
              </div>

              <button
                onClick={() => {
                  triggerToast(`WhatsApp reminder sent to ${selectedMember.fullName}!`);
                  setSelectedMember(null);
                }}
                className="w-full py-3.5 rounded-[14px] bg-[#1F8A5F] hover:bg-emerald-600 text-white font-['Sora'] font-extrabold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Payment Reminder Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
