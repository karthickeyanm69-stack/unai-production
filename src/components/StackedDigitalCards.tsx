import React, { useState } from 'react';
import { CreditCard, Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export interface CardData {
  id: string;
  title: string;
  subtitle: string;
  cardNumber: string;
  holder: string;
  expires: string;
  limit: string;
  gradient: string;
  textColor: string;
  badge: string;
}

interface StackedDigitalCardsProps {
  selectedIndex?: number;
  onSelectCard?: (index: number, card: CardData) => void;
}

export const StackedDigitalCards: React.FC<StackedDigitalCardsProps> = ({
  selectedIndex: externalSelectedIndex = 0,
  onSelectCard,
}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState<number>(externalSelectedIndex);
  const [autoPayMap, setAutoPayMap] = useState<Record<string, boolean>>({
    gold_card: true,
    trust_card: true,
    emerald_card: true,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedIndex = externalSelectedIndex !== undefined ? externalSelectedIndex : internalSelectedIndex;

  const cards: CardData[] = [
    {
      id: 'gold_card',
      title: 'Gold Savings Card',
      subtitle: '12-Month Gold Tier • Primary Mandate',
      cardNumber: '4892 •••• •••• 7642',
      holder: 'ANANYA SHARMA',
      expires: '08/28',
      limit: '₹1,000 / mo',
      gradient: 'from-[#D4A62A] via-amber-600 to-[#1B4B66]',
      textColor: 'text-white',
      badge: 'Gold Tier Mandate',
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

  const handleCardClick = (idx: number, card: CardData) => {
    setInternalSelectedIndex(idx);
    if (onSelectCard) {
      onSelectCard(idx, card);
    }
    showToast(`Selected ${card.title} (${card.limit}) for Mandate`);
  };

  const toggleAutoPay = (e: React.MouseEvent, cardId: string, title: string) => {
    e.stopPropagation();
    const nextState = !autoPayMap[cardId];
    setAutoPayMap((prev) => ({ ...prev, [cardId]: nextState }));
    showToast(nextState ? `AutoPay Enabled for ${title}` : `AutoPay Paused for ${title}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg animate-fade-down flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A62A]" />
            <span>{toastMessage}</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Real-Time</span>
        </div>
      )}

      {/* 3D Stacked Digital Cards List */}
      <div className="space-y-4">
        {cards.map((card, idx) => {
          const isSelected = idx === selectedIndex;
          const isAutoPay = !!autoPayMap[card.id];

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx, card)}
              className={`relative rounded-[24px] p-6 sm:p-7 bg-gradient-to-r ${card.gradient} text-white shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group hover:shadow-2xl ${
                isSelected
                  ? 'ring-4 ring-[#D4A62A] scale-[1.02] z-20 shadow-glow-gold border-2 border-white'
                  : 'opacity-90 hover:opacity-100 hover:scale-[1.01] z-10 border border-white/20'
              }`}
            >
              {/* Selected Badge Ribbon Header */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#D4A62A] text-[#1E2732] font-['Sora'] font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md flex items-center gap-1 z-30">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>SELECTED FOR MANDATE</span>
                </div>
              )}

              {/* Card Chip Graphic & Header */}
              <div className="flex items-center justify-between mb-6 pt-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Sora'] font-extrabold text-base sm:text-lg text-white">{card.title}</h3>
                    <p className="text-[11px] text-slate-100 font-medium">{card.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 text-xs font-bold text-white">
                    <span className="text-[11px]">AutoPay</span>
                    <button
                      type="button"
                      onClick={(e) => toggleAutoPay(e, card.id, card.title)}
                      className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 cursor-pointer ${
                        isAutoPay ? 'bg-[#1F8A5F]' : 'bg-slate-500'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white transition-transform ${
                          isAutoPay ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-[#D4A62A] text-[#1E2732] flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Number */}
              <div className="my-5">
                <p className="font-mono text-lg sm:text-2xl font-extrabold tracking-widest text-white drop-shadow-md">
                  {card.cardNumber}
                </p>
              </div>

              {/* Card Footer Metadata */}
              <div className="flex items-end justify-between border-t border-white/20 pt-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-200 uppercase font-mono tracking-wider block">Cardholder</span>
                  <span className="font-bold font-mono text-white text-xs sm:text-sm">{card.holder}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-200 uppercase font-mono tracking-wider block">Expires</span>
                  <span className="font-bold font-mono text-white text-xs sm:text-sm">{card.expires}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-200 uppercase font-mono tracking-wider block">Monthly Mandate</span>
                  <span className="font-bold font-mono text-white text-xs sm:text-sm tabular-nums">{card.limit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1F8A5F]/10 border border-[#1F8A5F]/30 rounded-[20px] p-4 flex items-center justify-between text-xs text-[#1E2732]">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#1F8A5F]" />
          <span className="font-semibold text-xs">RBI NPCI E-Mandate Secured • Instant Auto-Debit on Due Date</span>
        </div>
        <span className="font-bold text-[#1F8A5F] flex items-center gap-1 shrink-0">
          <Zap className="w-3.5 h-3.5 fill-[#1F8A5F]" />
          <span>Zero Penalty</span>
        </span>
      </div>
    </div>
  );
};
