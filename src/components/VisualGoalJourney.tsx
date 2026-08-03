import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, CheckCircle2, Flame, Trophy, Lock, X, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { store } from '../store';
import type { Membership } from '../types';

interface VisualGoalJourneyProps {
  membership?: Membership;
}

export const VisualGoalJourney: React.FC<VisualGoalJourneyProps> = ({ membership }) => {
  // Crash-proof fallback to state store if prop is omitted
  const activeMembership = membership || store.getMembership();
  const currentMonth = activeMembership?.cyclesCompleted || 8;
  const currentStreak = activeMembership?.currentStreak || 8;

  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  useEffect(() => {
    if (expandedMonth !== null) {
      store.setModalOpen(true);
      return () => {
        store.setModalOpen(false);
      };
    }
  }, [expandedMonth]);

  const monthDetailsMap: Record<number, { date: string; ref: string; reward: string; detail: string }> = {
    1: { date: 'Jan 5, 2026', ref: 'UPI_NPCI_8912', reward: 'Goal Journey Started', detail: '₹1,000 deposited in escrow account. Account activated.' },
    2: { date: 'Feb 5, 2026', ref: 'UPI_NPCI_8934', reward: '+1 Month Streak Protection', detail: '2nd consecutive cycle completed. Streak active.' },
    3: { date: 'Mar 5, 2026', ref: 'UPI_NPCI_8956', reward: 'Quarter 1 Milestone Badge', detail: '3-Month milestone achieved. Escrow audit passed.' },
    4: { date: 'Apr 5, 2026', ref: 'UPI_NPCI_8978', reward: '+1 Month Streak Protection', detail: '4th cycle credited successfully.' },
    5: { date: 'May 5, 2026', ref: 'UPI_NPCI_8990', reward: '5th Cycle Credited', detail: '₹1,000 credited to escrow balance.' },
    6: { date: 'Jun 5, 2026', ref: 'UPI_NPCI_9012', reward: 'Month 6 Halfway Milestone', detail: 'Congratulations! You reached the 6-month halfway milestone.' },
    7: { date: 'Jul 5, 2026', ref: 'UPI_NPCI_9034', reward: '+1 Month Streak Protection', detail: '7th cycle credited. Past halfway mark!' },
    8: { date: 'Aug 5, 2026', ref: 'UPI_NPCI_9056', reward: '8-Month Streak Master Badge', detail: '8 consecutive months saved. Outstanding discipline!' },
    9: { date: 'Sep 5, 2026', ref: 'Pending AutoPay', reward: 'Next Due • Pay to Preserve Streak', detail: 'Cycle due on Sep 5, 2026. AutoPay active.' },
    10: { date: 'Oct 5, 2026', ref: 'Upcoming', reward: 'Pre-Maturity Build Phase', detail: 'Cycle 10 scheduled contribution.' },
    11: { date: 'Nov 5, 2026', ref: 'Upcoming', reward: 'Final Countdown Month', detail: 'Penultimate savings cycle before maturity!' },
    12: { date: 'Dec 5, 2026', ref: 'Upcoming', reward: '🏆 Full 12-Month Maturity & Gift Hamper Review!', detail: 'Final month! You receive ₹12,600 total + Gift Hamper review session & delivery.' },
  };

  const handleCardClick = (month: number) => {
    setExpandedMonth(month);
  };

  const activeMeta = expandedMonth ? monthDetailsMap[expandedMonth] : null;

  return (
    <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-5 sm:p-8 shadow-premium space-y-6 sm:space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66] flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#D4A62A]" />
            <span>Interactive Goal Journey</span>
          </span>
          <h2 className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-[#1E2732] tracking-tight">
            12-Month Savings Progress
          </h2>
          <p className="text-xs text-[#5C6773] mt-1">
            Tap any vertical capsule to inspect cycle details & milestone rewards
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 text-[#1F8A5F] text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-[14px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1F8A5F]" />
            <span>Month {currentMonth} of 12 Completed</span>
          </div>
          <div className="bg-[#D4A62A]/10 border border-[#D4A62A]/40 text-[#D4A62A] text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-[14px] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-[#D4A62A] text-[#D4A62A]" />
            <span>{currentStreak}m Streak</span>
          </div>
        </div>
      </div>

      {/* 12-Month Vertical Capsules Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4 py-2">
        {Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const isDone = month <= currentMonth;
          const isCurrent = month === currentMonth + 1;
          const cardMeta = monthDetailsMap[month];

          return (
            <div
              key={month}
              onClick={() => handleCardClick(month)}
              className={`relative h-48 sm:h-52 rounded-[28px] sm:rounded-[32px] px-2 sm:px-3 py-3.5 sm:py-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 hover-lift ${
                isDone
                  ? 'bg-[#1F8A5F]/5 border border-[#1F8A5F]/35 text-[#1E2732] hover:border-[#1F8A5F] shadow-sm'
                  : isCurrent
                  ? 'bg-[#1B4B66] text-white border-2 border-[#D4A62A] shadow-glow-gold z-10 animate-pulse'
                  : 'bg-[#F8FAFC] border border-slate-200 text-slate-400 hover:border-slate-300'
              }`}
            >
              {/* LIFTED TICK SYMBOL: Top Right Prominent Checkmark Badge for Completed Months */}
              {isDone && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1F8A5F] text-white flex items-center justify-center shadow-sm"
                  title="Payment Accepted & Approved by Admin"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Top Month Badge */}
              <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider opacity-80 pt-0.5">
                #{month}
              </span>

              {/* Middle Amount / Milestone Graphic */}
              <div className="my-auto space-y-1 w-full px-0.5">
                {month === 12 ? (
                  <div className="inline-flex flex-col items-center">
                    <Trophy className={`w-5 h-5 mb-0.5 ${isDone ? 'text-[#D4A62A]' : isCurrent ? 'text-[#D4A62A]' : 'text-slate-400'}`} />
                    <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-[#D4A62A]">Maturity & Hamper</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-['Sora'] font-extrabold text-[11px] sm:text-xs md:text-sm tracking-tight tabular-nums block truncate">
                      ₹1,000
                    </span>
                    {/* ACCEPTED DATA BY ADMIN DISPLAY */}
                    {isDone && (
                      <div className="mt-1 pt-1 border-t border-[#1F8A5F]/20 space-y-0.5">
                        <span className="text-[8px] font-extrabold text-[#1F8A5F] block uppercase tracking-tight">
                          Accepted by Admin
                        </span>
                        <span className="text-[9px] font-mono font-bold text-[#1E2732] block truncate">
                          {cardMeta?.date || 'Jan 5, 2026'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Status Indicator */}
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider w-full pb-0.5">
                {isDone ? (
                  <span className="text-[#1F8A5F] font-extrabold block text-[9px]">
                    Approved
                  </span>
                ) : isCurrent ? (
                  <span className="text-[#D4A62A] flex items-center justify-center gap-0.5 font-extrabold">
                    <Sparkles className="w-3 h-3 text-[#D4A62A]" />
                    <span className="truncate">DUE</span>
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center justify-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span className="truncate">Locked</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL FOCUS OVERLAY: Focused Square Detail Box */}
      {expandedMonth && activeMeta && (
        <div className="fixed inset-0 z-50 bg-[#1E2732]/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
          {/* Clickable Backdrop */}
          <div className="absolute inset-0" onClick={() => setExpandedMonth(null)} />

          {/* Focused Expanded Square Detail Card */}
          <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#1B4B66] via-[#123448] to-[#1E2732] text-white rounded-[28px] p-6 sm:p-8 border-2 border-[#D4A62A] shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-[#D4A62A] text-[#1E2732] px-3.5 py-1 rounded-full text-xs font-extrabold">
                  Month #{expandedMonth}
                </span>
                <span className="text-xs text-slate-200 font-mono">{activeMeta.date}</span>
              </div>
              <button
                onClick={() => setExpandedMonth(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-300 block">Monthly Contribution:</span>
                <p className="text-3xl font-mono font-extrabold text-white tabular-nums mt-0.5">₹1,000.00</p>
              </div>

              <div className="p-4 rounded-[18px] bg-black/40 border border-white/15 space-y-2">
                <p className="text-[#D4A62A] font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4A62A]" />
                  <span>{activeMeta.reward}</span>
                </p>
                <p className="text-xs text-slate-200 leading-relaxed">{activeMeta.detail}</p>
                <p className="text-[11px] text-slate-400 font-mono pt-1">Reference: {activeMeta.ref}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-[#1F8A5F]/20 p-3 rounded-[14px] border border-[#1F8A5F]/40">
              <ShieldCheck className="w-4 h-4 text-[#1F8A5F] shrink-0" />
              <span>Custody held in RBI-compliant Escrow Trustee Account</span>
            </div>

            <div className="pt-2">
              {expandedMonth === currentMonth + 1 ? (
                <Link
                  to="/pay"
                  onClick={() => setExpandedMonth(null)}
                  className="w-full py-3.5 rounded-[14px] bg-[#D4A62A] hover:bg-yellow-400 text-[#1E2732] font-['Sora'] font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition-all hover-lift"
                >
                  <span>Pay Month #{expandedMonth} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : expandedMonth <= currentMonth ? (
                <div className="flex items-center justify-between text-xs text-[#1F8A5F] bg-[#1F8A5F]/20 p-3 rounded-[14px] border border-[#1F8A5F]/40 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
                    <span>Escrow Verified & Cleared</span>
                  </span>
                  <Link to="/ledger" onClick={() => setExpandedMonth(null)} className="text-white hover:underline flex items-center gap-1 text-xs">
                    <span>Receipt PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setExpandedMonth(null)}
                  className="w-full py-3.5 rounded-[14px] bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                >
                  Close Focus View
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
