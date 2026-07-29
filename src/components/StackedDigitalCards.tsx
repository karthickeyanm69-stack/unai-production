import React, { useState } from 'react';
import { CreditCard, Check, ShieldCheck, Zap } from 'lucide-react';

export const StackedDigitalCards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true);

  const cards = [
    {
      id: 'gold_card',
      title: 'Gold Savings Card',
      subtitle: '12-Month Gold Tier • Primary Mandate',
      cardNumber: '4892 •••• •••• 7642',
      holder: 'ANANYA SHARMA',
      expires: '08/28',
      limit: '₹2,000 / mo',
      gradient: 'from-[#D4A62A] via-amber-600 to-[#1B4B66]',
      textColor: 'text-white',
      badge: 'Active Mandate',
    },
    {
      id: 'trust_card',
      title: 'Trust Blue Savings Card',
      subtitle: 'Escrow Trustee Verified • AutoPay Backup',
      cardNumber: '5219 •••• •••• 3125',
      holder: 'ANANYA SHARMA',
      expires: '11/29',
      limit: '₹5,000 / mo',
      gradient: 'from-[#1B4B66] via-[#123448] to-[#1E2732]',
      textColor: 'text-white',
      badge: 'Verified Escrow',
    },
    {
      id: 'emerald_card',
      title: 'Prosperity Emerald Card',
      subtitle: 'Streak Protection Guarantee',
      cardNumber: '6011 •••• •••• 9081',
      holder: 'ANANYA SHARMA',
      expires: '05/30',
      limit: '₹10,000 / mo',
      gradient: 'from-[#1F8A5F] via-teal-700 to-[#1E2732]',
      textColor: 'text-white',
      badge: 'Streak Shield',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 3D Stacked Digital Cards List */}
      <div className="space-y-4">
        {cards.map((card, idx) => {
          const isSelected = idx === selectedCard;

          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(idx)}
              className={`relative rounded-[24px] p-6 sm:p-8 bg-gradient-to-r ${card.gradient} text-white shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group hover-lift ${
                isSelected
                  ? 'ring-4 ring-[#1B4B66]/40 scale-[1.02] z-10'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Decorative Card Chip Graphic */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Sora'] font-extrabold text-lg text-white">{card.title}</h3>
                    <p className="text-xs text-slate-100 font-medium">{card.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full border border-white/30 text-xs font-bold text-white">
                    <span>AutoPay</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAutoPayEnabled(!autoPayEnabled);
                      }}
                      className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 ${
                        autoPayEnabled ? 'bg-[#1F8A5F]' : 'bg-slate-400'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          autoPayEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-white text-[#1B4B66] flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Number */}
              <div className="my-6">
                <p className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-white drop-shadow-md">
                  {card.cardNumber}
                </p>
              </div>

              {/* Card Footer Metadata */}
              <div className="flex items-end justify-between border-t border-white/20 pt-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-200 uppercase font-mono tracking-wider block">Cardholder</span>
                  <span className="font-bold font-mono text-white text-sm">{card.holder}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-200 uppercase font-mono tracking-wider block">Expires</span>
                  <span className="font-bold font-mono text-white text-sm">{card.expires}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-200 uppercase font-mono tracking-wider block">Monthly Mandate</span>
                  <span className="font-bold font-mono text-white text-sm tabular-nums">{card.limit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[20px] p-4 flex items-center justify-between text-xs text-[#1E2732]">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#1F8A5F]" />
          <span className="font-semibold">RBI NPCI E-Mandate Secured • Instant Auto-Debit on Due Date</span>
        </div>
        <span className="font-bold text-[#1F8A5F] flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-[#1F8A5F]" />
          <span>Zero Penalty Guarantee</span>
        </span>
      </div>
    </div>
  );
};
