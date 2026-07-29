import React from 'react';
import { MessageSquare, CheckCircle2, Clock } from 'lucide-react';

export const SupportAgentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-extrabold shadow-md">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Grievance & Support Desk</span>
          <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-3xl text-white">Support Agent Dashboard</h1>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-['Sora'] font-bold text-lg text-white">Open Tickets (Grievance Officer Queue)</h3>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">#TCK-8941: AutoPay Mandate Confirmation Delay</span>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
              Open (Medium)
            </span>
          </div>
          <p className="text-xs text-slate-400">Member: Ananya Sharma • Category: Payment Mandate</p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button onClick={() => alert('Ticket Resolved')} className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl">
              Resolve Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
