import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Gift, ShieldCheck, Eye, Lock, Info, X, Check } from 'lucide-react';
import { store } from '../store';
import { HamperItem } from '../types';

export const HamperSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = store.getCurrentUser();
  const hampers = store.getHampers();
  const { hamper: allocatedHamper, adminName, allocatedAt } = store.getAllocatedHamperForUser(currentUser.id);
  const [selectedPreviewHamper, setSelectedPreviewHamper] = useState<HamperItem | null>(null);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-6 sm:pt-10 space-y-8">

        {/* Top Single Back Arrow Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] hover:bg-slate-100 font-['Sora'] font-extrabold text-xs transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#1B4B66] stroke-[2.5]" />
            <span>Back to Wallet</span>
          </button>

          <span className="text-[11px] font-bold text-[#5C6773]">Year-End Reward Catalogue</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Maturity Perks & Catalogue</span>
            <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight">Gift Hampers Catalogue</h1>
            <p className="text-xs sm:text-sm text-[#5C6773]">Browse our curated festival hampers. Gift hampers are allocated & dispatched by SamruddiSave Admin upon Month 12 maturity!</p>
          </div>
        </div>

        {/* Official Allocation Notice Banner */}
        <div className="p-5 sm:p-6 bg-white border border-[#1B4B66]/20 rounded-[24px] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4B66]/10 text-[#1B4B66] flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['Sora'] font-extrabold text-sm text-[#1E2732]">Admin Allocation Policy</span>
                <span className="px-2.5 py-0.5 bg-[#1B4B66]/10 text-[#1B4B66] text-[10px] font-bold rounded-full uppercase tracking-wider">Catalogue View Only</span>
              </div>
              <p className="text-xs text-[#5C6773] leading-relaxed">
                Members can explore all available gift hampers below. Final hamper allocation is managed and assigned directly by the Admin team prior to Month 12 maturity dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Member Allocated Status Banner */}
        {allocatedHamper ? (
          <div className="p-5 sm:p-6 bg-emerald-50 border-2 border-[#1F8A5F]/40 rounded-[24px] shadow-md flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1F8A5F] text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F8A5F] bg-white px-2.5 py-0.5 rounded-full border border-[#1F8A5F]/30">
                  Assigned Gift Hamper
                </span>
                <p className="font-['Sora'] font-extrabold text-lg text-[#1E2732] mt-1">{allocatedHamper.title}</p>
                <p className="text-xs text-[#5C6773]">
                  Allocated by <span className="font-bold text-[#1B4B66]">{adminName || 'Admin Team'}</span> on {allocatedAt || 'Month 12 Cycle'}. Ready for dispatch at maturity.
                </p>
              </div>
            </div>
            <span className="font-mono text-[#1F8A5F] font-bold text-sm bg-white px-4 py-2 rounded-xl border border-[#1F8A5F]/30 shadow-sm">
              ₹{allocatedHamper.estimatedValue.toLocaleString('en-IN')} Value
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-[20px] flex items-center gap-3 text-xs text-amber-900 font-medium">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span><strong>Status:</strong> Your gift hamper allocation is pending Admin sign-off. It will be assigned to your wallet before your Month 12 maturity payout.</span>
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
                        <span>Allocated By Admin</span>
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
                    className="w-full py-3.5 rounded-[14px] bg-slate-100 hover:bg-slate-200 text-[#1E2732] font-['Sora'] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#1B4B66]" />
                    <span>View Hamper Items Breakdown</span>
                  </button>

                  {isAllocatedToMe ? (
                    <div className="w-full py-3 rounded-[14px] bg-[#1F8A5F]/15 border border-[#1F8A5F]/30 text-[#1F8A5F] font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
                      <span>Allocated to Your Wallet by Admin</span>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 text-center text-[11px] text-[#5C6773] font-semibold flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Admin Managed • Member Selection Disabled</span>
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
                  {selectedPreviewHamper.categoryName} Catalogue
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
