import React, { useState } from 'react';
import { Users, Plus, Share2, Flame } from 'lucide-react';
import { store } from '../store';
import { CircleRecipientAvatars } from '../components/CircleRecipientAvatars';

export const SavingsCirclesPage: React.FC = () => {
  const circles = store.getCircles();
  const members = store.getCircleMembers();
  const [activeCircle] = useState(circles[0]);

  const handleShare = () => {
    const text = `Join my SamruddiSave Savings Circle "${activeCircle.name}"! Use Code: ${activeCircle.inviteCode}`;
    if (navigator.share) {
      navigator.share({ title: activeCircle.name, text, url: window.location.origin }).catch(() => {});
    } else {
      window.open(`whatsapp://send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-10 pb-36 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Social Motivation</span>
            <h1 className="font-['Sora'] font-extrabold text-3xl sm:text-4xl text-[#1E2732] tracking-tight">Savings Circles</h1>
            <p className="text-sm text-[#5C6773]">Save individually toward your goal while sharing streak progress with friends</p>
          </div>

          <button
            onClick={() => alert('Create Circle Modal (Simulated)')}
            className="bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-sm px-6 py-3.5 rounded-[14px] shadow-premium flex items-center gap-2 shrink-0 transition-all hover-lift"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Circle</span>
          </button>
        </div>

        {/* Recipient Avatars Box */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-8 shadow-premium">
          <CircleRecipientAvatars />
        </div>

        {/* Circle Leaderboard Card */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-8 space-y-8 shadow-premium">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-mono bg-[#1B4B66]/10 text-[#1B4B66] px-3.5 py-1.5 rounded-full font-bold">
                INVITE CODE: {activeCircle.inviteCode}
              </span>
              <h2 className="font-['Sora'] font-extrabold text-2xl text-[#1E2732] mt-3">{activeCircle.name}</h2>
            </div>

            <button
              onClick={handleShare}
              className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-[14px] shadow-premium flex items-center justify-center gap-2 shrink-0 transition-all hover-lift"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>Share Invite Code</span>
            </button>
          </div>

          <div>
            <h3 className="font-['Sora'] font-bold text-base text-[#1E2732] mb-6 flex items-center justify-between">
              <span>Group Leaderboard</span>
              <span className="text-xs text-[#5C6773] font-normal">Individual balances remain 100% private</span>
            </h3>

            <div className="space-y-4">
              {members.map((m, idx) => (
                <div key={m.userId} className="p-6 rounded-[20px] bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-9 h-9 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <img src={m.avatar} alt={m.fullName} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-md" />
                    <div>
                      <p className="font-['Sora'] font-bold text-sm text-[#1E2732]">{m.fullName}</p>
                      <p className="text-xs text-[#5C6773] mt-0.5">{m.handle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-[#D4A62A] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 fill-[#D4A62A] text-[#D4A62A]" />
                      {m.streak} Months Streak
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
