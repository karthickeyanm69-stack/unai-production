import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { store } from '../store';

export const HamperSelectionPage: React.FC = () => {
  const hampers = store.getHampers();
  const selectedHamper = store.getSelectedHamper();
  const [selectedId, setSelectedId] = useState(selectedHamper.id);

  const handleLockIn = (id: string) => {
    setSelectedId(id);
    store.setSelectedHamper(id);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-10 pb-36 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Year-End Reward Selection</span>
          <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732] tracking-tight">Choose Your Curated Gift Hamper</h1>
          <p className="text-sm text-[#5C6773] max-w-xl mx-auto">
            Included in your 12-month Gold Harvest savings plan (Up to ₹2,000 value cap). Delivered to your doorstep at maturity!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hampers.map((h) => {
            const isSelected = h.id === selectedId;

            return (
              <div
                key={h.id}
                onClick={() => handleLockIn(h.id)}
                className={`bg-white border rounded-[24px] p-8 shadow-premium transition-all duration-300 cursor-pointer hover-lift flex flex-col justify-between space-y-6 ${
                  isSelected ? 'border-[#D4A62A] ring-2 ring-[#D4A62A]/40 bg-white' : 'border-slate-200 hover:border-[#1B4B66]/30'
                }`}
              >
                <div className="space-y-4">
                  <div className="relative h-56 rounded-[20px] overflow-hidden shadow-md">
                    <img src={h.imageUrl} alt={h.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-[#1E2732]/90 backdrop-blur text-[#D4A62A] text-xs font-bold px-3.5 py-1.5 rounded-full">
                      {h.categoryName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-2">
                    <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">{h.title}</h3>
                    <span className="font-mono text-base font-bold text-[#D4A62A] shrink-0 tabular-nums">₹{h.estimatedValue}</span>
                  </div>
                  <p className="text-sm text-[#5C6773] leading-relaxed">{h.description}</p>
                </div>

                <button
                  className={`w-full py-4 rounded-[14px] font-['Sora'] font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected ? 'bg-[#D4A62A] text-[#1E2732] shadow-glow-gold' : 'bg-slate-100 text-[#5C6773] hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#1E2732] stroke-[2.5]" />
                      <span>Selected & Locked-In</span>
                    </>
                  ) : (
                    <span>Select This Hamper</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
