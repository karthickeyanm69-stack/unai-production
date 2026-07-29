import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { store } from '../store';

export const PlanSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const plans = store.getPlans();

  const handleSelectPlan = () => {
    navigate('/payment-setup');
  };

  return (
    <div className="layout-container pt-12 pb-36 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Step 2 of 4 · Plan Selection</span>
        <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732]">Choose Your 12-Month Savings Plan</h1>
        <p className="text-sm text-[#5C6773] max-w-lg mx-auto">
          Select a fixed monthly contribution amount. You get your savings back + cash bonus + gift hamper at maturity!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div
            key={p.id}
            onClick={handleSelectPlan}
            className="bg-white border border-[#1B4B66]/15 hover:border-[#1B4B66] rounded-[24px] p-8 shadow-premium transition-all duration-300 hover-lift cursor-pointer flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#D4A62A]/15 border border-[#D4A62A]/40 text-[#D4A62A] text-xs font-bold">
                {p.badgeTag}
              </span>
              <h3 className="font-['Sora'] font-extrabold text-2xl text-[#1E2732]">{p.title}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold font-mono text-[#1B4B66] tabular-nums">₹{p.monthlyAmount.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#5C6773]">/ month</span>
              </div>
              <p className="text-sm text-[#5C6773] leading-relaxed">{p.description}</p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-semibold">
                <div className="flex items-center justify-between text-[#1E2732]">
                  <span>Duration:</span>
                  <span className="font-bold">12 Months</span>
                </div>
                <div className="flex items-center justify-between text-[#1F8A5F]">
                  <span>Cash Bonus:</span>
                  <span className="font-bold">+{p.cashBonusPercentage}%</span>
                </div>
                <div className="flex items-center justify-between text-[#D4A62A]">
                  <span>Hamper Value Cap:</span>
                  <span className="font-bold">₹{p.hamperValueCap.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2">
              <span>Select Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
