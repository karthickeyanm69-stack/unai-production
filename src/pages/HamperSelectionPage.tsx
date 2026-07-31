import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Gift } from 'lucide-react';
import { store } from '../store';

export const HamperSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const hampers = store.getHampers();
  const selectedHamper = store.getSelectedHamper();
  const [selectedId, setSelectedId] = useState(selectedHamper.id);
  const [toast, setToast] = useState<string | null>(null);

  const handleLockIn = (id: string, title: string) => {
    setSelectedId(id);
    store.setSelectedHamper(id);
    setToast(`Selected & Locked-In "${title}"!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-6 sm:pt-10 space-y-8">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Top Single Back Arrow Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
            <span>Back to Wallet</span>
          </button>

          <span className="text-[11px] font-bold text-[#5C6773]">Year-End Reward Selection</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Maturity Perks</span>
            <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight">Choose Your Gift Hamper</h1>
            <p className="text-xs sm:text-sm text-[#5C6773]">Included in your 12-month Gold Harvest plan. Delivered to your door at Month 12 maturity!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hampers.map((h) => {
            const isSelected = h.id === selectedId;

            return (
              <div
                key={h.id}
                onClick={() => handleLockIn(h.id, h.title)}
                className={`bg-white border rounded-[24px] p-6 sm:p-8 shadow-premium transition-all duration-300 cursor-pointer hover-lift flex flex-col justify-between space-y-6 ${
                  isSelected ? 'border-[#D4A62A] ring-2 ring-[#D4A62A]/40 bg-white' : 'border-slate-200 hover:border-[#1B4B66]/30'
                }`}
              >
                <div className="space-y-4">
                  <div className="relative h-52 sm:h-56 rounded-[20px] overflow-hidden shadow-md">
                    <img src={h.imageUrl} alt={h.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-[#1E2732]/90 backdrop-blur text-[#D4A62A] text-xs font-bold px-3.5 py-1.5 rounded-full">
                      {h.categoryName}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-2">
                    <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">{h.title}</h3>
                    <span className="font-mono text-base font-bold text-[#D4A62A] shrink-0 tabular-nums">₹{h.estimatedValue}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C6773] leading-relaxed">{h.description}</p>
                </div>

                <button
                  type="button"
                  className={`w-full py-4 rounded-[14px] font-['Sora'] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
