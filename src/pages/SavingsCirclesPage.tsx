import React, { useState, useEffect } from 'react';
import { Users, Plus, Share2, Flame, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { store } from '../store';
import { CircleRecipientAvatars } from '../components/CircleRecipientAvatars';

export const SavingsCirclesPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const circles = store.getCircles();
  const members = store.getCircleMembers();
  
  const [selectedCircleId, setSelectedCircleId] = useState<string>(circles.length > 0 ? circles[0].id : '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newInviteCode, setNewInviteCode] = useState('SAVEGOAL' + Math.floor(10 + Math.random() * 90));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (showCreateModal) {
      store.setModalOpen(true);
      return () => {
        store.setModalOpen(false);
      };
    }
  }, [showCreateModal]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const activeCircle = circles.find((c) => c.id === selectedCircleId) || circles[0] || {
    id: 'crcl_default',
    name: 'Diwali Savings Goal 2026',
    inviteCode: 'SAVEDIWALI26',
    createdById: 'usr_ananya',
    createdByName: 'Ananya Sharma',
    memberCount: 4,
    targetMonth: '2026-10-31',
  };

  const handleShare = () => {
    const text = `Join my SamruddiSave Savings Circle "${activeCircle.name}"! Use Code: ${activeCircle.inviteCode}`;
    if (navigator.share) {
      navigator.share({ title: activeCircle.name, text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      showToast(`Invite Code "${activeCircle.inviteCode}" copied to clipboard!`);
    }
  };

  const handleCreateCircleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;

    const newId = `crcl_${Date.now()}`;
    circles.push({
      id: newId,
      name: newCircleName.trim(),
      creatorId: 'usr_ananya',
      inviteCode: newInviteCode.trim() || `GOAL${Math.floor(100 + Math.random() * 900)}`,
      memberCount: 1,
      totalStreak: 1,
    });

    setSelectedCircleId(newId);
    setShowCreateModal(false);
    setNewCircleName('');
    showToast(`Savings Circle "${newCircleName.trim()}" Created!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-8 sm:pt-10 space-y-8">
        
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B66]">Social Motivation</span>
            <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight">Savings Circles</h1>
            <p className="text-xs sm:text-sm text-[#5C6773]">Save individually toward your goal while sharing streak progress with friends</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-[14px] shadow-premium flex items-center justify-center gap-2 shrink-0 transition-all hover-lift cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Circle</span>
          </button>
        </div>

        {/* Recipient Avatars Box */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] p-6 sm:p-8 shadow-premium">
          <CircleRecipientAvatars />
        </div>

        {/* Circle Selector Tabs */}
        {circles.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {circles.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCircleId(c.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCircle.id === c.id
                    ? 'bg-[#1B4B66] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-[#5C6773] hover:border-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Circle Leaderboard Card */}
        <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-mono bg-[#1B4B66]/10 text-[#1B4B66] px-3.5 py-1.5 rounded-full font-bold">
                INVITE CODE: {activeCircle.inviteCode}
              </span>
              <h2 className="font-['Sora'] font-extrabold text-xl sm:text-2xl text-[#1E2732] mt-3">{activeCircle.name}</h2>
            </div>

            <button
              onClick={handleShare}
              className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-[14px] shadow-premium flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2.5]" />
              <span>Share Invite Code</span>
            </button>
          </div>

          <div>
            <h3 className="font-['Sora'] font-bold text-sm sm:text-base text-[#1E2732] mb-4 flex items-center justify-between">
              <span>Group Leaderboard ({members.length} Members)</span>
              <span className="text-[11px] text-[#5C6773] font-normal">Balances remain 100% private</span>
            </h3>

            <div className="space-y-3">
              {members.map((m, idx) => (
                <div key={m.userId} className="p-4 sm:p-5 rounded-[20px] bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between hover:border-slate-300 transition-all">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <img src={m.avatar} alt={m.fullName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 shadow-md shrink-0" />
                    <div>
                      <p className="font-['Sora'] font-bold text-xs sm:text-sm text-[#1E2732]">{m.fullName}</p>
                      <p className="text-[11px] text-[#5C6773] mt-0.5">{m.handle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#D4A62A] flex items-center gap-1.5">
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

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Create Savings Circle</h3>
                <p className="text-xs text-[#5C6773]">Save together with friends for your group goal</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCircleSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E2732]">Circle / Goal Name</label>
                <input
                  type="text"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="e.g. Goa Trip Savings Goal"
                  className="w-full p-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E2732]">Custom Invite Code</label>
                <input
                  type="text"
                  value={newInviteCode}
                  onChange={(e) => setNewInviteCode(e.target.value)}
                  className="w-full p-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono font-bold text-[#1B4B66] uppercase focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Create Circle & Invite Friends
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
