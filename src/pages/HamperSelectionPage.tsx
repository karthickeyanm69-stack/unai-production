import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Gift, Eye, X, Check } from 'lucide-react';
import { store } from '../store';
import { HamperItem } from '../types';

export const HamperSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();
  const hampers = store.getHampers();
  const { hamper: allocatedHamper } = store.getAllocatedHamperForUser(currentUser.id);
  const [selectedPreviewHamper, setSelectedPreviewHamper] = useState<HamperItem | null>(null);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-6 sm:pt-10 space-y-8">

        {/* Top Back Arrow Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
            <span>Back to Wallet</span>
          </button>

          <span className="text-[11px] font-bold text-[#5C6773]">Year-End Reward Perks</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Maturity Perks</span>
            <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight">Year-End Gift Hampers</h1>
            <p className="text-xs sm:text-sm text-[#5C6773]">Included as a complimentary gift with your 12-month savings commitment and delivered to your doorstep at maturity!</p>
          </div>
        </div>

        {/* Member Allocated Status Banner (Clean Customer View) */}
        {allocatedHamper && (
          <div className="p-5 sm:p-6 bg-emerald-50 border-2 border-[#1F8A5F]/40 rounded-[24px] shadow-md flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F8A5F] text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F8A5F] bg-white px-2.5 py-0.5 rounded-full border border-[#1F8A5F]/30">
                  Your Maturity Gift
                </span>
                <p className="font-['Sora'] font-extrabold text-lg text-[#1E2732] mt-1">{allocatedHamper.title}</p>
                <p className="text-xs text-[#5C6773]">
                  Assigned to your savings wallet. Prepared for doorstep delivery at Month 12 maturity completion.
                </p>
              </div>
            </div>
            <span className="font-mono text-[#1F8A5F] font-bold text-sm bg-white px-4 py-2 rounded-xl border border-[#1F8A5F]/30 shadow-sm">
              ₹{allocatedHamper.estimatedValue.toLocaleString('en-IN')} Value
            </span>
          </div>
        )}

        {/* Hampers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hampers.map((h) => {
            const isAllocatedToMe = allocatedHamper?.id === h.id;

            return (
              <div
                key={h.id}
                className={`bg-white border rounded-[24px] p-6 sm:p-8 shadow-premium transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  isAllocatedToMe ? 'border-[#1F8A5F] ring-2 ring-[#1F8A5F]/30 bg-white' : 'border-slate-200'
                }`}
              >
                <div className="space-y-4">
                  <div className="relative h-52 sm:h-56 rounded-[20px] overflow-hidden shadow-md">
                    <img src={h.imageUrl} alt={h.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-[#1E2732]/90 backdrop-blur text-[#D4A62A] text-xs font-bold px-3.5 py-1.5 rounded-full">
                      {h.categoryName}
                    </span>
                    {isAllocatedToMe && (
                      <span className="absolute top-4 right-4 bg-[#1F8A5F] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Included Gift</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-2">
                    <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">{h.title}</h3>
                    <span className="font-mono text-base font-bold text-[#D4A62A] shrink-0 tabular-nums">₹{h.estimatedValue}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C6773] leading-relaxed">{h.description}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewHamper(h)}
                    className="w-full py-3.5 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4 text-[#D4A62A]" />
                    <span>View Included Gift Items</span>
                  </button>

                  {isAllocatedToMe && (
                    <div className="w-full py-3 rounded-[14px] bg-[#1F8A5F]/15 border border-[#1F8A5F]/30 text-[#1F8A5F] font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
                      <span>Assigned to Your Maturity Payout</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Items Preview Modal */}
        {selectedPreviewHamper && (
          <div className="fixed inset-0 z-50 bg-[#1E2732]/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-up relative">
              <button
                onClick={() => setSelectedPreviewHamper(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B4B66] bg-[#1B4B66]/10 px-3 py-1 rounded-full">
                  {selectedPreviewHamper.categoryName} Gift Hamper
                </span>
                <h3 className="font-['Sora'] font-extrabold text-2xl text-[#1E2732] mt-2">
                  {selectedPreviewHamper.title}
                </h3>
                <p className="text-xs text-[#5C6773]">{selectedPreviewHamper.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="font-bold text-xs text-[#1E2732] uppercase tracking-wider">Curated Included Items:</p>
                <div className="space-y-2">
                  {selectedPreviewHamper.items?.map((item: { name: string; approxValue: number }, idx: number) => (
                    <div key={idx} className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-[#1B4B66]/10 text-[#1B4B66] flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-xs text-[#1E2732]">{item.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#D4A62A]">₹{item.approxValue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                <p className="text-xs font-bold text-[#1E2732]">Estimated Total Retail Value: ₹{selectedPreviewHamper.estimatedValue}</p>
                <p className="text-[10px] text-[#5C6773]">Delivered to your registered address upon Month 12 maturity completion.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
