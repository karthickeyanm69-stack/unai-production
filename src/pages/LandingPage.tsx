import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, ArrowUpRight, MousePointer } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [monthlyAmount, setMonthlyAmount] = useState<number>(1000);
  const totalSaved = monthlyAmount * 12;
  const bonus = totalSaved * 0.05;
  const hamperVal = monthlyAmount * 2;
  const totalValue = totalSaved + bonus + hamperVal;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      {/* Official Soft Ivory Theme Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-12 md:pb-20 overflow-hidden">
        {/* Subtle background ambient radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#1B4B66]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#D4A62A]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="layout-container relative z-10 text-center space-y-6 md:space-y-8">
          {/* Top Brand Logo Banner */}
          <div className="flex items-center justify-center gap-2.5 pb-2">
            <div className="w-9 h-9 rounded-2xl bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-md">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-['Sora'] font-extrabold text-xl tracking-tight text-[#1E2732]">
              Samruddi<span className="text-[#1B4B66]">Save</span>
            </span>
          </div>

          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] text-[11px] sm:text-xs font-bold shadow-sm animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A62A]" />
            <span>Early Access — Goal Savings & Rewards</span>
          </div>

          {/* Main Headline with Serif Italic Flourish */}
          <div className="relative max-w-4xl mx-auto space-y-2">
            <h1 className="font-['Sora'] text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#1E2732] leading-[1.15]">
              Save Small Monthly. <br />
              <span className="font-serif-italic font-normal text-3xl sm:text-5xl md:text-7xl bg-gradient-to-r from-[#D4A62A] via-amber-600 to-[#1B4B66] bg-clip-text text-transparent">
                Unlock Cash Bonus & Hampers
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-[#5C6773] max-w-xl mx-auto leading-relaxed font-medium px-2">
            Join a vibrant goal-based savings community where every monthly payment brings tangible rewards — cash bonuses, streak perks, and curated gift hampers.
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <Link
              to="/kyc"
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-glow-blue hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Start Saving Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3D Fan-Out Cards Array (Mobile Snap Carousel / Desktop Fan-Out) */}
          <div className="pt-8 sm:pt-16 pb-4">
            <div className="flex items-end justify-start sm:justify-center -space-x-2 sm:-space-x-6 max-w-5xl mx-auto overflow-x-auto snap-x snap-mandatory py-6 scrollbar-none px-2 sm:px-0">
              {/* Card 1: Trust Blue (Flexible Saver) */}
              <div className="snap-center w-40 sm:w-56 h-64 sm:h-80 rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#1B4B66] via-[#123448] to-[#1E2732] text-white shadow-xl sm:transform sm:-rotate-12 hover:rotate-0 transition-transform duration-500 hover:z-30 shrink-0 border border-white/20 flex flex-col justify-between overflow-hidden relative group">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-300 block">Starter Saver</span>
                  <h4 className="font-['Sora'] font-extrabold text-base sm:text-xl text-white mt-0.5">Flexible Micro</h4>
                  <p className="text-[10px] text-slate-200">₹500 / month</p>
                </div>

                <div className="my-1 relative h-28 sm:h-32 flex items-center justify-center">
                  <img
                    src="/assets/card_exec_micro_light.png"
                    alt="Flexible Micro-Save 3D"
                    className="w-24 sm:w-28 h-24 sm:h-28 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-2 sm:p-2.5 text-center border border-white/20">
                  <span className="text-[10px] font-bold text-[#D4A62A]">5% Cash Bonus</span>
                </div>
              </div>

              {/* Card 2: Celebration Gold (Gold Harvest) */}
              <div className="snap-center w-40 sm:w-56 h-72 sm:h-96 rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#D4A62A] via-amber-600 to-yellow-700 text-[#1E2732] shadow-xl sm:transform sm:-rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-30 shrink-0 border border-yellow-300/80 flex flex-col justify-between overflow-hidden relative group">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-950 font-bold block">Gold Harvest</span>
                  <h4 className="font-['Sora'] font-extrabold text-base sm:text-xl mt-0.5 text-amber-950">Gold Vault</h4>
                  <p className="text-[10px] text-amber-950 font-bold">₹1,000 / month</p>
                </div>

                <div className="my-1 relative h-32 sm:h-36 flex items-center justify-center">
                  <img
                    src="/assets/card_exec_gold_light.png"
                    alt="Gold Harvest 3D Vault"
                    className="w-28 sm:w-32 h-28 sm:h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="bg-amber-950/90 backdrop-blur rounded-2xl p-2 sm:p-2.5 text-center text-white border border-amber-400/40">
                  <span className="text-[10px] font-bold text-[#D4A62A]">🔥 8 Month Streak</span>
                </div>
              </div>

              {/* Card 3: Center Elevated Trust Blue (Main Vault Card) */}
              <div className="snap-center w-48 sm:w-64 h-80 sm:h-[420px] rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#1B4B66] via-[#123448] to-[#1E2732] text-white shadow-glow-blue sm:transform sm:-translate-y-6 hover:translate-y-0 transition-transform duration-500 z-20 shrink-0 border-2 border-[#D4A62A]/60 flex flex-col justify-between overflow-hidden relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-white">Vault HUD</h4>
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-300">12-Month Escrow</p>
                  </div>
                  <Link
                    to="/kyc"
                    className="flex items-center gap-1 bg-[#D4A62A] text-[#1E2732] px-3 py-1 rounded-full text-[11px] font-extrabold shadow hover:scale-105 transition-transform"
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                  </Link>
                </div>

                <div className="my-1 relative h-36 sm:h-44 flex items-center justify-center">
                  <img
                    src="/assets/card_exec_vault_light.png"
                    alt="12-Month Vault 3D"
                    className="w-32 sm:w-40 h-32 sm:h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="bg-black/30 backdrop-blur p-3 sm:p-4 rounded-2xl text-white space-y-1.5 border border-white/20">
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                      <span className="text-[#1F8A5F]">Escrow Status</span>
                      <span className="text-[#D4A62A]">Month 8/12</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[66%] h-full bg-gradient-to-r from-[#1F8A5F] to-[#D4A62A] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Prosperity Green (Gift Hampers) */}
              <div className="snap-center w-40 sm:w-56 h-72 sm:h-96 rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#1F8A5F] via-teal-700 to-[#1E2732] text-white shadow-xl sm:transform sm:rotate-6 hover:rotate-0 transition-transform duration-500 hover:z-30 shrink-0 border border-emerald-400/40 flex flex-col justify-between overflow-hidden relative group">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-100 block">Gift Hampers</span>
                  <h4 className="font-['Sora'] font-extrabold text-base sm:text-xl text-white mt-0.5">Luxury Reward</h4>
                  <p className="text-[10px] text-emerald-100">Year-End Selection</p>
                </div>

                <div className="my-1 relative h-32 sm:h-36 flex items-center justify-center">
                  <img
                    src="/assets/card_exec_hamper_light.png"
                    alt="Luxury Gift Hamper 3D"
                    className="w-28 sm:w-32 h-28 sm:h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="bg-black/30 backdrop-blur rounded-2xl p-2 sm:p-2.5 text-center border border-white/20">
                  <span className="text-[10px] font-bold text-emerald-200">₹2,000 Hamper Cap</span>
                </div>
              </div>

              {/* Card 5: Deep Charcoal Blue (Savings Circles) */}
              <div className="snap-center w-40 sm:w-56 h-64 sm:h-80 rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#1E2732] via-[#123448] to-[#1B4B66] text-white shadow-xl sm:transform sm:rotate-12 hover:rotate-0 transition-transform duration-500 hover:z-30 shrink-0 border border-white/20 flex flex-col justify-between overflow-hidden relative group">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-300 block">Savings Circles</span>
                  <h4 className="font-['Sora'] font-extrabold text-base sm:text-xl text-white mt-0.5">Group Circle</h4>
                  <p className="text-[10px] text-slate-300">Shared Streaks</p>
                </div>

                <div className="my-1 relative h-28 sm:h-32 flex items-center justify-center">
                  <img
                    src="/assets/card_exec_circles_light.png"
                    alt="Savings Circles 3D"
                    className="w-24 sm:w-28 h-24 sm:h-28 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="bg-black/30 backdrop-blur rounded-2xl p-2 sm:p-2.5 text-center border border-white/20">
                  <span className="text-[10px] font-bold text-[#D4A62A]">6 Circle Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Ivory Interactive Maturity Calculator Section */}
      <section className="layout-container pb-16 md:pb-24">
        <div className="bg-white rounded-[24px] p-6 sm:p-12 border border-[#1B4B66]/15 shadow-premium space-y-6 sm:space-y-8">
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="text-xs font-bold text-[#1B4B66] uppercase tracking-widest">Interactive Calculator</span>
            <h2 className="font-['Sora'] font-extrabold text-xl sm:text-4xl text-[#1E2732]">See What You Receive at Maturity</h2>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-[#1E2732]">
              <span>Monthly Savings Amount:</span>
              <span className="text-xl sm:text-3xl font-mono font-extrabold text-[#1B4B66] tabular-nums">₹{monthlyAmount.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B4B66]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 text-center">
            <div className="p-4 md:p-6 bg-[#F7F5EF] rounded-[16px] sm:rounded-[20px] border border-slate-200 space-y-1">
              <span className="text-[10px] sm:text-xs text-[#5C6773] block font-semibold">Total Saved</span>
              <span className="text-base sm:text-xl font-extrabold font-mono text-[#1E2732] tabular-nums">₹{totalSaved.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 md:p-6 bg-[#1F8A5F]/10 rounded-[16px] sm:rounded-[20px] border border-[#1F8A5F]/30 space-y-1">
              <span className="text-[10px] sm:text-xs text-[#1F8A5F] block font-semibold">Cash Bonus (5%)</span>
              <span className="text-base sm:text-xl font-extrabold font-mono text-[#1F8A5F] tabular-nums">+₹{bonus.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 md:p-6 bg-[#D4A62A]/10 rounded-[16px] sm:rounded-[20px] border border-[#D4A62A]/30 space-y-1">
              <span className="text-[10px] sm:text-xs text-[#D4A62A] block font-semibold">Gift Hamper</span>
              <span className="text-base sm:text-xl font-extrabold font-mono text-[#D4A62A] tabular-nums">+₹{hamperVal.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-4 md:p-6 bg-[#1B4B66] text-white rounded-[16px] sm:rounded-[20px] border border-[#1B4B66] space-y-1 shadow-md col-span-2 sm:col-span-1">
              <span className="text-[10px] sm:text-xs text-[#D4A62A] block font-bold">Total Maturity</span>
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-white tabular-nums">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Ivory Compliance Trust Strip */}
      <section className="layout-container pb-28 md:pb-36">
        <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[24px] p-5 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-[#1E2732] shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[14px] bg-[#1F8A5F] text-white flex items-center justify-center shrink-0 shadow-md">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-[#1E2732] text-sm sm:text-base">Regulatory & Compliance First</p>
              <p className="text-[11px] sm:text-xs text-[#5C6773] leading-relaxed">Escrow bank account custody, RBI NBFC guideline disclosures, mandatory KYC verification.</p>
            </div>
          </div>
          <Link to="/trust" className="w-full sm:w-auto text-center bg-[#1B4B66] hover:bg-[#123448] text-white font-bold text-xs px-6 py-3 sm:py-3.5 rounded-[14px] shrink-0 transition-all shadow-md">
            Read Compliance Center
          </Link>
        </div>
      </section>
    </div>
  );
};
