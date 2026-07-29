import React from 'react';
import { UserPlus, Flame } from 'lucide-react';
import { store } from '../store';

export const CircleRecipientAvatars: React.FC = () => {
  const circleMembers = store.getCircleMembers();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-['Sora'] font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>Circle Members</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            {circleMembers.length} Active
          </span>
        </h3>
        <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1 rounded-xl shadow-sm flex items-center gap-1 transition-colors">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {circleMembers.map((rec) => (
          <div key={rec.userId} className="flex flex-col items-center space-y-1 group cursor-pointer shrink-0">
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full p-0.5 transition-all group-hover:scale-105 shadow-md ${
                  rec.status === 'matured'
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 ring-2 ring-amber-400'
                    : rec.status === 'grace'
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-400'
                    : 'bg-gradient-to-tr from-emerald-400 to-teal-500 ring-2 ring-emerald-400/50'
                }`}
              >
                <img
                  src={rec.avatar}
                  alt={rec.fullName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>

              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 border border-amber-400/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                <span>{rec.streak}m</span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-['Sora'] font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors">
                {rec.fullName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 max-w-[64px] truncate">{rec.handle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
