import React, { useState, useRef } from 'react';
import { Shield, Sparkles, ArrowRight, ArrowUpRight, CheckCircle2, Lock, Gift, Users, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { store } from '../store';

export const LandingPage: React.FC = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(1000);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(2); // Center Vault HUD default
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic calculation for 12-Month Maturity
  const totalSaved = monthlyDeposit * 12;
  const cashBonus = totalSaved * 0.05; // 5% Cash Bonus
  const giftHamperValue = monthlyDeposit >= 2000 ? 3000 : 2000;
  const totalMaturityValue = totalSaved + cashBonus + giftHamperValue;

  // Real-time active center detector for smooth scaling on ALL cards (1 to 5)
  const handleCardsScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;

    const cardChildren = children.filter((child) => child.dataset.cardIdx !== undefined);

    cardChildren.forEach((child) => {
      const idx = Number(child.dataset.cardIdx);
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    setActiveCardIndex(closestIndex);
  };

  const scrollToCard = (index: number) => {
    const targetIdx = (index + cardsData.length) % cardsData.length;
    setActiveCardIndex(targetIdx);
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const targetCard = container.querySelector(`[data-card-idx="${targetIdx}"]`) as HTMLElement;
    if (targetCard) {
      const targetScroll = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const cardsData = [
    {
      id: 0,
      badge: 'Starter Saver',
      title: 'Flexible Micro',
      sub: '₹500 / month',
      img: '/assets/card_exec_micro_light.png',
      alt: 'Flexible Micro Savings Card 3D',
      footer: '5% Cash Bonus',
      gradient: 'from-[#1B4B66] via-[#123448] to-[#1E2732]',
      border: 'border-white/20',
      footerBg: 'bg-white/10 text-[#D4A62A]',
    },
    {
      id: 1,
      badge: 'Gold Harvest',
      title: 'Gold Vault',
      sub: '₹1,000 / month',
      img: '/assets/card_exec_gold_light.png',
      alt: 'Gold Vault Savings Card 3D',
      footer: '🔥 8 Month Streak',
      gradient: 'from-[#D4A62A] via-amber-600 to-yellow-700',
      border: 'border-yellow-300/80',
      footerBg: 'bg-amber-950/90 text-[#D4A62A]',
    },
    {
      id: 2,
      badge: '12-Month Escrow',
      title: 'Vault HUD',
      sub: 'Main Escrow Plan',
      img: '/assets/card_exec_vault_light.png',
      alt: 'Vault HUD Savings Card 3D',
      footer: 'Escrow Status • Month 8/12',
      gradient: 'from-[#1B4B66] via-[#123448] to-[#1E2732]',
      border: 'border-2 border-[#D4A62A]/60',
      isCenter: true,
    },
    {
      id: 3,
      badge: 'Gift Hampers',
      title: 'Luxury Reward',
      sub: 'Year-End Selection',
      img: '/assets/card_exec_hamper_light.png',
      alt: 'Luxury Gift Hamper Card 3D',
      footer: '₹2,000 Hamper Cap',
      gradient: 'from-[#1F8A5F] via-teal-700 to-[#1E2732]',
      border: 'border-emerald-400/40',
      footerBg: 'bg-black/30 text-emerald-200',
    },
    {
      id: 4,
      badge: 'Savings Circles',
      title: 'Group Circle',
      sub: 'Shared Streaks',
      img: '/assets/card_exec_circles_light.png',
      alt: 'Group Circle Card 3D',
      footer: '6 Circle Members',
      gradient: 'from-[#1E2732] via-[#123448] to-[#1B4B66]',
      border: 'border-white/20',
      footerBg: 'bg-white/10 text-slate-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-32 pt-6 sm:pt-12">
      <main id="main-content" className="layout-container space-y-16">

        {/* Hero Section */}
        <section aria-label="Welcome Banner" className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] text-[11px] sm:text-xs font-bold shadow-sm animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A62A]" />
            <span>Early Access — Goal Savings & Rewards</span>
          </div>

          <div className="relative max-w-4xl mx-auto space-y-2">
            <h1 className="font-['Sora'] text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#1E2732] leading-[1.15]">
              Save Small Monthly. <br />
              <span className="font-serif-italic font-normal text-3xl sm:text-5xl md:text-7xl bg-gradient-to-r from-[#D4A62A] via-amber-600 to-[#1B4B66] bg-clip-text text-transparent">
                Unlock Cash Bonus & Hampers
              </span>
            </h1>
          </div>

          <p className="text-xs sm:text-base text-[#374151] max-w-xl mx-auto leading-relaxed font-medium px-2">
            Join a vibrant goal-based savings community where every monthly payment brings tangible rewards — cash bonuses, streak perks, and curated gift hampers.
          </p>

          <div id="hero-cta-button" className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={() => store.openLoginModal()}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm shadow-glow-blue hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Start Saving Today"
            >
              <span>Start Saving Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* True Viewport Full-Bleed 3D Fan-Out Deck Showcase (w-screen breakout, 0px side gaps) */}
          <div className="pt-6 sm:pt-10 pb-4 w-full relative">
            
            {/* Scroll Navigation Controls */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => scrollToCard(activeCardIndex - 1)}
                className="w-8 h-8 rounded-full bg-white border border-[#1B4B66]/30 text-[#1B4B66] flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous Savings Tier Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {cardsData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeCardIndex === idx ? 'w-6 bg-[#1B4B66]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to Card ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToCard(activeCardIndex + 1)}
                className="w-8 h-8 rounded-full bg-white border border-[#1B4B66]/30 text-[#1B4B66] flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Next Savings Tier Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* True Viewport 100vw Full-Bleed Container (0px Side Gaps, Zero Padding) */}
            <div
              ref={scrollContainerRef}
              onScroll={handleCardsScroll}
              className="flex items-end justify-start sm:justify-center -space-x-4 sm:-space-x-8 md:-space-x-10 w-screen relative left-1/2 -translate-x-1/2 overflow-x-auto snap-x snap-mandatory py-10 scrollbar-none px-0"
              style={{ scrollBehavior: 'smooth' }}
            >
              {cardsData.map((card, i) => {
                const distance = Math.abs(i - activeCardIndex);
                const isCenter = distance === 0;

                // Dynamic 3D Fan-Out transforms: Middle Big in front (z-30), Sides Shorter stepping back (z-20, z-10)
                let zIndexClass = 'z-10';
                let transformClass = 'scale-[0.82] sm:scale-90 opacity-75 translate-y-4';

                if (isCenter) {
                  zIndexClass = 'z-30';
                  transformClass = 'scale-100 sm:scale-115 -translate-y-4 shadow-2xl opacity-100 ring-4 ring-[#D4A62A]';
                } else if (distance === 1) {
                  zIndexClass = 'z-20';
                  transformClass = 'scale-[0.92] sm:scale-95 translate-y-1 opacity-90 hover:opacity-100';
                }

                return (
                  <div
                    key={card.id}
                    data-card-idx={i}
                    onClick={() => scrollToCard(i)}
                    className={`snap-center w-[72vw] max-w-[220px] sm:w-56 h-[350px] sm:h-[400px] rounded-[28px] bg-gradient-to-b ${card.gradient} transition-all duration-500 shrink-0 border ${card.border} relative cursor-pointer ${zIndexClass} ${transformClass}`}
                  >
                    <div className="flex flex-col justify-between h-full p-4 sm:p-6 text-white overflow-hidden relative select-none">
                      
                      {/* Top Card Header */}
                      <div className="space-y-0.5 z-10 shrink-0 text-left">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 block">{card.badge}</span>
                        <h4 className="font-['Sora'] font-extrabold text-base sm:text-xl text-white tracking-tight leading-tight">{card.title}</h4>
                        <p className="text-[11px] text-slate-200">{card.sub}</p>
                      </div>

                      {/* 3D Graphic Image Area (No Overlap) */}
                      <div className="my-auto py-2 flex items-center justify-center relative shrink-0 h-32 sm:h-36">
                        <img
                          src={card.img}
                          alt={card.alt}
                          className={`max-h-full max-w-full object-contain drop-shadow-2xl transition-all duration-500 ${
                            isCenter ? 'scale-110 sm:scale-125' : 'scale-95'
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>

                      {/* Bottom Footer Badge / Progress Bar */}
                      <div className="shrink-0 z-10 pt-1">
                        {card.isCenter ? (
                          <div className="bg-black/50 backdrop-blur p-2.5 sm:p-3 rounded-2xl text-white space-y-1.5 border border-white/25 shadow-md">
                            <div className="flex justify-between text-[10px] sm:text-[11px] font-bold">
                              <span className="text-[#1F8A5F]">Escrow Status</span>
                              <span className="text-[#D4A62A]">Month 8/12</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="w-[66%] h-full bg-gradient-to-r from-[#1F8A5F] to-[#D4A62A] rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <div className={`${card.footerBg} backdrop-blur rounded-2xl p-2.5 text-center border border-white/20 shadow-md`}>
                            <span className="text-[10px] sm:text-[11px] font-bold">{card.footer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[#5C6773] font-bold text-center mt-1">← Tap arrows or cards to bring any savings tier to the front →</p>
          </div>
        </section>

        {/* Interactive Maturity Calculator */}
        <section aria-label="Maturity Calculator" className="bg-white border-2 border-[#1B4B66]/20 rounded-[32px] p-6 sm:p-10 shadow-premium max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Interactive Calculator</span>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732]">See What You Receive at Maturity</h2>
            <p className="text-xs sm:text-sm text-[#5C6773]">Adjust your monthly deposit amount to calculate your total 12-month returns and gift perks.</p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between font-['Sora'] font-extrabold">
              <label htmlFor="deposit-slider" className="text-xs sm:text-sm text-[#1E2732]">Monthly Savings Amount:</label>
              <span className="text-xl sm:text-2xl text-[#1B4B66]">₹{monthlyDeposit.toLocaleString('en-IN')}/mo</span>
            </div>

            <input
              id="deposit-slider"
              type="range"
              min={500}
              max={10000}
              step={500}
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              aria-label="Monthly Savings Slider"
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B4B66]"
            />
            <div className="flex justify-between text-[11px] font-bold text-[#5C6773]">
              <span>₹500/mo</span>
              <span>₹5,000/mo</span>
              <span>₹10,000/mo</span>
            </div>
          </div>

          {/* Calculator Output Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-[#5C6773] uppercase tracking-wider block">Total Saved</span>
              <span className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-[#1E2732]">₹{totalSaved.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Cash Bonus (5%)</span>
              <span className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-emerald-700">+₹{cashBonus.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Gift Hamper</span>
              <span className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-amber-700">+₹{giftHamperValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-[#1B4B66] to-[#123448] text-white rounded-2xl text-center space-y-2 shadow-lg">
            <span className="text-xs uppercase tracking-widest text-[#D4A62A] font-bold">Total Maturity Value</span>
            <div className="font-['Sora'] font-black text-3xl sm:text-4xl text-white">₹{totalMaturityValue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-300">Principal + 5% Cash Bonus + Luxury Festival Gift Hamper Dispatched at Month 12</p>
          </div>
        </section>

      </main>
    </div>
  );
};
