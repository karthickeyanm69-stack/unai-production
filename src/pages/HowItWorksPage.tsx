import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, CheckCircle2, Gift, Smartphone, Lock, HelpCircle, ChevronDown } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Choose Your Monthly Savings Goal',
      description: 'Select a comfortable monthly contribution — ₹500 (Starter), ₹1,000 (Gold Harvest), or ₹2,000 (Elite). Your plan locks in your cash bonus rate and gift hamper reward tier.',
      icon: Smartphone,
      accent: 'border-[#1B4B66] text-[#1B4B66] bg-[#1B4B66]/10',
    },
    {
      step: '02',
      title: 'Complete RBI-Compliant KYC',
      description: 'Verify your PAN and Aadhaar in 60 seconds. All funds are deposited directly into a designated RBI-compliant Escrow Trustee bank account for 100% capital protection.',
      icon: Lock,
      accent: 'border-[#1F8A5F] text-[#1F8A5F] bg-[#1F8A5F]/10',
    },
    {
      step: '03',
      title: 'Save Monthly & Maintain Streaks',
      description: 'Set up NPCI UPI AutoPay or pay manually. Compete with friends in Savings Circles to maintain consecutive monthly streak badges and unlock grace period protection.',
      icon: CheckCircle2,
      accent: 'border-[#1B4B66] text-[#1B4B66] bg-[#1B4B66]/10',
    },
    {
      step: '04',
      title: 'Claim Cash Bonus & Doorstep Gift Hamper',
      description: 'At the end of 12 months, receive 100% of your accumulated savings back + a 5% guaranteed cash bonus return + your chosen luxury gift hamper delivered to your doorstep.',
      icon: Gift,
      accent: 'border-[#D4A62A] text-[#D4A62A] bg-[#D4A62A]/10',
    },
  ];

  const faqs = [
    {
      q: 'What happens if I miss a monthly payment date?',
      a: 'SamruddiSave offers a 5-day grace period with zero penalty. You will receive an alert notice in your dashboard to make the payment and cure your grace status to keep your streak active.',
    },
    {
      q: 'How are my funds protected in escrow?',
      a: 'All monthly contributions are held under a tripartite escrow agreement with an RBI-regulated Trustee Bank. SamruddiSave cannot touch or misappropriate your funds.',
    },
    {
      q: 'Can I select my gift hamper before maturity?',
      a: 'Yes! You can select and lock in your preferred gift hamper (Tech, Home, Wellness, or Fashion) anytime during your 12-month goal journey.',
    },
    {
      q: 'When do I receive my 5% cash bonus?',
      a: 'Your 5% cash bonus return is calculated at 12-month maturity and paid out directly to your registered UPI/bank account alongside your principal savings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-8 sm:pt-14 pb-36 space-y-12 sm:space-y-16">
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1B4B66]/20 text-[#1B4B66] text-xs font-bold shadow-sm animate-fade-up">
            <Sparkles className="w-4 h-4 text-[#D4A62A]" />
            <span>Simple, Transparent 4-Step Process</span>
          </div>
          <h1 className="font-['Sora'] text-3xl sm:text-5xl font-extrabold text-[#1E2732] tracking-tight">
            How SamruddiSave Works
          </h1>
          <p className="text-sm sm:text-base text-[#5C6773] leading-relaxed font-medium">
            Goal-based savings made rewarding. Save small monthly, build disciplined financial habits, and unlock cash bonuses + curated gift hampers.
          </p>
        </div>

        {/* 4-Step Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((s) => {
            const IconComponent = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 shadow-premium space-y-6 hover-lift relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-extrabold text-[#1B4B66]/20">
                      {s.step}
                    </span>
                    <div className={`w-12 h-12 rounded-[16px] border ${s.accent} flex items-center justify-center shadow-sm`}>
                      <IconComponent className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  </div>
                  <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">{s.title}</h3>
                  <p className="text-sm text-[#5C6773] leading-relaxed">{s.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1B4B66]">
                  <span>Step {s.step} Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-[#1F8A5F]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-12 shadow-premium space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66] flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#D4A62A]" />
              <span>Got Questions?</span>
            </span>
            <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-[#1E2732]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="p-5 rounded-[20px] bg-[#F7F5EF] border border-slate-200 cursor-pointer transition-all hover:border-[#1B4B66]/30 space-y-3"
                >
                  <div className="flex items-center justify-between font-['Sora'] font-bold text-sm text-[#1E2732]">
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#5C6773] transition-transform ${isOpen ? 'rotate-180 text-[#1B4B66]' : ''}`} />
                  </div>
                  {isOpen && (
                    <p className="text-xs text-[#5C6773] leading-relaxed pt-2 border-t border-slate-200 animate-fade-up font-medium">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#1B4B66] text-white rounded-[28px] p-8 sm:p-12 text-center space-y-6 shadow-glow-blue max-w-4xl mx-auto relative overflow-hidden">
          <span className="text-xs font-bold text-[#D4A62A] uppercase tracking-widest block">Start Your 12-Month Journey</span>
          <h2 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-white">Ready to Save & Unlock Rewards?</h2>
          <p className="text-sm text-slate-200 max-w-md mx-auto font-medium">
            Take 60 seconds to set up your plan. 100% capital protected in RBI-compliant escrow.
          </p>
          <div className="pt-2">
            <Link
              to="/kyc"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#D4A62A] hover:bg-yellow-400 text-[#1E2732] font-['Sora'] font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>Start Saving Now</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
