import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Grid,
  Send,
  Download,
  QrCode,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Gift,
  Clock,
} from 'lucide-react';
import { store } from '../store';
import { VisualGoalJourney } from '../components/VisualGoalJourney';

export const DashboardPage: React.FC = () => {
  const [membership, setMembership] = useState(store.getMembership());
  const user = store.getCurrentUser();
  const circleMembers = store.getCircleMembers();
  const selectedHamper = store.getSelectedHamper();

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setMembership(store.getMembership());
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-8 sm:pt-12 space-y-8">
        {/* Grace Period Alert Banner (if active) */}
        {membership.status === 'GRACE_PERIOD' && (
          <div className="bg-[#FDF6E2] border-2 border-[#DB9A2C] rounded-[24px] p-6 text-[#1E2732] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-premium animate-fade-up">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#DB9A2C] text-white flex items-center justify-center shrink-0 shadow-md">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">5-Day Grace Period Notice</p>
                <p className="text-xs text-[#5C6773]">Make your monthly contribution to protect your 8-month streak!</p>
              </div>
            </div>
            <Link to="/pay" className="bg-[#DB9A2C] hover:bg-amber-600 text-white font-bold text-xs px-5 py-3 rounded-[12px] text-center shadow-md transition-all">
              Pay Now to Cure Grace
            </Link>
          </div>
        )}

        {/* 2nd Reference Image Inspired Executive Dashboard Main View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column (Reference Image Wallet Layout) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Greeting Header (Reference Image Style) */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-[#5C6773] font-medium">
                  Hi <span className="font-bold text-[#1E2732]">{user.fullName.split(' ')[0]}</span>! Welcome to your wallet
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => store.toggleGracePeriod()}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1E2732] flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                  title="Toggle Grace Period Demo"
                >
                  <Grid className="w-4 h-4 text-[#5C6773]" />
                </button>
                <div className="relative">
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1E2732] flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
                    <Bell className="w-4 h-4 text-[#5C6773]" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1F8A5F]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Balance HUD Card (Reference Image: Big Balance Display) */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-8 text-center space-y-4 shadow-premium relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] text-xs font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B4B66]" />
                <span>INR · RBI Escrow Vault</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#5C6773] uppercase tracking-wider mb-1">
                  Accumulated Savings Balance
                </p>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[#1E2732] tracking-tight tabular-nums">
                    ₹{membership.totalPaid.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-mono font-bold text-[#5C6773]">.00</span>
                </div>
              </div>

              {/* Cash Return Badge */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1F8A5F]/15 border border-[#1F8A5F]/30 text-[#1F8A5F] text-xs font-extrabold">
                <TrendingUp className="w-3.5 h-3.5 text-[#1F8A5F]" />
                <span>+5.00% Cash Bonus Return Guaranteed</span>
              </div>
            </div>

            {/* Redesigned Section 5 High-Contrast Quick Action Pill Bar */}
            <div className="bg-white border-2 border-[#1B4B66]/20 rounded-[24px] p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-premium">
              <Link
                to="/pay"
                className="flex-1 py-3.5 rounded-[18px] bg-[#1B4B66] hover:bg-[#123448] text-white transition-all flex items-center justify-center gap-2 text-xs font-extrabold shadow-md hover-lift"
              >
                <span>Pay Monthly</span>
                <Send className="w-3.5 h-3.5 text-[#D4A62A]" />
              </Link>
              <Link
                to="/payment-setup"
                className="w-12 h-12 rounded-[18px] bg-[#1F8A5F] hover:bg-emerald-600 text-white transition-all flex items-center justify-center shadow-md shrink-0 hover-lift"
                title="UPI Mandate"
              >
                <QrCode className="w-5 h-5 text-white" />
              </Link>
              <Link
                to="/ledger"
                className="flex-1 py-3.5 rounded-[18px] bg-[#F7F5EF] border border-[#1B4B66]/20 hover:bg-[#1B4B66]/10 text-[#1B4B66] transition-all flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm hover-lift"
              >
                <span>Savings Ledger</span>
                <Download className="w-3.5 h-3.5 text-[#1B4B66]" />
              </Link>
            </div>

            {/* Middle Feature Cards Grid (Reference Image: Send Again + Your Income Sparkline) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left Card: Circle Friends / Avatars */}
              <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-6 space-y-4 shadow-premium">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E2732]">Savings Circle</span>
                  <Link to="/circles" className="text-xs font-bold text-[#1B4B66] hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {circleMembers.slice(0, 3).map((m) => (
                    <div key={m.userId} className="p-3 bg-[#F8FAFC] rounded-[16px] border border-slate-200 flex items-center space-x-2.5">
                      <img src={m.avatar} alt={m.fullName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-[#1E2732] truncate">{m.fullName.split(' ')[0]}</p>
                        <span className="text-[10px] text-[#D4A62A] font-bold flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-[#D4A62A]" />
                          {m.streak}m
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/circles"
                    className="p-3 bg-[#1B4B66]/10 border border-dashed border-[#1B4B66]/30 rounded-[16px] flex flex-col items-center justify-center text-[#1B4B66] hover:bg-[#1B4B66]/20 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span className="text-[10px] font-bold mt-0.5">Invite</span>
                  </Link>
                </div>
              </div>

              {/* Right Card: Growth Sparkline */}
              <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-6 space-y-3 shadow-premium flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E2732]">Maturity Target</span>
                  <span className="text-[10px] text-[#5C6773] font-bold">Month 12</span>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-extrabold font-mono text-[#1F8A5F] tabular-nums">
                    ₹12,600.00
                  </p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-bold">
                    +5.00% Return + Gift Hamper
                  </span>
                </div>

                {/* SVG Growth Sparkline */}
                <div className="h-12 w-full pt-2">
                  <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                    <path
                      d="M0 25 Q 25 20, 50 12 T 100 2"
                      fill="none"
                      stroke="#1F8A5F"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 25 Q 25 20, 50 12 T 100 2 L 100 30 L 0 30 Z"
                      fill="url(#sparkline-gradient)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1F8A5F" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Recent Goal Activity */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-6 space-y-4 shadow-premium">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#1E2732] uppercase tracking-wider">Recent Activity</span>
                <Link to="/ledger" className="text-xs font-bold text-[#1B4B66] flex items-center gap-1 hover:underline">
                  <span>Ledger</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1E2732]">Month #8 Contribution</p>
                      <p className="text-[10px] text-[#5C6773]">Verified • Escrow Cleared</p>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-[#1F8A5F] text-sm tabular-nums">+₹1,000</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4A62A]/15 text-[#D4A62A] flex items-center justify-center font-bold">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1E2732]">Gold Hamper Locked</p>
                      <p className="text-[10px] text-[#5C6773]">Month #6 Reward Milestone</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#D4A62A] text-xs">₹2,000 Cap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop 12-Month Journey + Reward Card) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selected Hamper Card */}
            <div className="bg-white border border-[#D4A62A]/30 rounded-[28px] p-6 space-y-4 shadow-premium relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4A62A] uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#D4A62A]" />
                  <span>Selected Year-End Hamper</span>
                </span>
                <Link to="/hampers" className="text-xs font-bold text-[#1B4B66] hover:underline">
                  Change
                </Link>
              </div>

              <div className="relative h-44 rounded-[20px] overflow-hidden shadow-md">
                <img src={selectedHamper.imageUrl} alt={selectedHamper.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <p className="font-['Sora'] font-extrabold text-white text-lg">{selectedHamper.title}</p>
                  <p className="text-xs text-amber-300 font-bold">₹{selectedHamper.estimatedValue} Estimated Value</p>
                </div>
              </div>
            </div>

            {/* Desktop Visual Goal Journey */}
            <div className="space-y-4">
              <VisualGoalJourney membership={membership} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
