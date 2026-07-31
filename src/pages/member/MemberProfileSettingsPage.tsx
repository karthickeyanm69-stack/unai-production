import React, { useState } from 'react';
import { User, Bell, Settings, ShieldCheck, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';
import { store } from '../../store';

export const MemberProfileSettingsPage: React.FC = () => {
  const user = store.getCurrentUser();
  const membership = store.getMembership();
  const notificationLogs = store.getNotificationLogs();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'settings'>('profile');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    user.email = email;
    user.phone = phone;
    store.logAuditAction('UPDATE_PROFILE', 'Member Portal', `Updated member profile details for ${user.fullName}`);
    showToast('Profile and Notification Preferences Saved Successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36 w-full overflow-x-hidden">
      <div className="layout-container pt-6 sm:pt-12 space-y-6 sm:space-y-8 w-full max-w-full">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-16 right-4 sm:right-6 z-50 bg-[#1B4B66] text-white px-4 sm:px-6 py-3 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Mobile Phone Optimized Header & Tab Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full overflow-hidden">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img src={user.avatar} alt={user.fullName} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#1B4B66] shadow-md shrink-0" />
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Member Account</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-extrabold whitespace-nowrap">
                  KYC Verified
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-xl sm:text-3xl text-[#1E2732] tracking-tight mt-0.5 truncate">
                {user.fullName}
              </h1>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-[14px] border border-slate-200 text-xs font-bold shadow-sm w-full md:w-auto overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-[10px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-[10px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'notifications' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-[10px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Profile & Identity */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 animate-fade-up w-full">
            <div className="lg:col-span-7 bg-white border border-[#1B4B66]/15 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 space-y-6 shadow-premium w-full">
              <h3 className="font-['Sora'] font-extrabold text-lg sm:text-xl text-[#1E2732]">Personal Contact Details</h3>
              <form onSubmit={handleSave} className="space-y-4 text-xs font-medium w-full">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2732] block">Full Name</label>
                  <input
                    type="text"
                    value={user.fullName}
                    disabled
                    className="w-full p-3.5 rounded-[14px] bg-slate-100 border border-slate-200 font-bold text-[#1E2732] cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#5C6773]">Name verified via NSDL PAN records.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2732] block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:border-[#1B4B66] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2732] block">Registered Mobile Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 font-mono font-bold text-[#1E2732] focus:border-[#1B4B66] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-[14px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            </div>

            {/* PII Verification Card */}
            <div className="lg:col-span-5 space-y-6 w-full">
              <div className="bg-white border border-[#1F8A5F]/20 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 space-y-4 shadow-premium w-full">
                <div className="flex items-center space-x-3 text-[#1F8A5F]">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                  <h3 className="font-['Sora'] font-extrabold text-base sm:text-lg text-[#1E2732]">RBI & NSDL Compliance</h3>
                </div>

                <div className="space-y-3 text-xs w-full">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200 flex justify-between items-center gap-2">
                    <span className="text-[#5C6773] font-medium">PAN Status</span>
                    <span className="font-mono font-bold text-[#1E2732]">{user.maskedPan || 'XXXXX1234F'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200 flex justify-between items-center gap-2">
                    <span className="text-[#5C6773] font-medium">Aadhaar Status</span>
                    <span className="font-mono font-bold text-[#1E2732]">{user.maskedAadhaar || 'XXXXXXXX1098'}</span>
                  </div>
                  <div className="p-3.5 bg-[#F8FAFC] rounded-[16px] border border-slate-200 flex justify-between items-center gap-2">
                    <span className="text-[#5C6773] font-medium">Assigned Lead Agent</span>
                    <span className="font-bold text-[#1B4B66]">{user.assignedEmployeeName || 'Priya Verma'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Notifications History */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 space-y-6 shadow-premium animate-fade-up w-full">
            <h3 className="font-['Sora'] font-extrabold text-lg sm:text-xl text-[#1E2732]">Notification Dispatch History</h3>
            <div className="space-y-3 w-full">
              {notificationLogs.map((n) => (
                <div key={n.id} className="p-3.5 sm:p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs w-full">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#1B4B66] uppercase">{n.channel}</span>
                    <p className="font-medium text-[#1E2732] leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#5C6773] font-mono">{n.sentAt}</p>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] font-bold text-[10px] shrink-0">{n.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Account Security Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 space-y-6 shadow-premium max-w-2xl animate-fade-up w-full">
            <h3 className="font-['Sora'] font-extrabold text-lg sm:text-xl text-[#1E2732]">Security & UPI AutoPay Settings</h3>
            <div className="space-y-4 text-xs font-semibold w-full">
              <div className="p-3.5 sm:p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-[#1E2732]">NPCI AutoPay E-Mandate</p>
                  <p className="text-[11px] text-[#5C6773] font-normal">Active monthly debit on 5th of every month</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] font-extrabold text-[10px] shrink-0">
                  ACTIVE ({membership.currentStreak}m streak)
                </span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-[#1E2732]">Session Security</p>
                  <p className="text-[11px] text-[#5C6773] font-normal">Stored in localStorage (`samruddisave_session` Phase 1)</p>
                </div>
                <button onClick={() => showToast('Session cleared on logout')} className="text-[#1B4B66] font-bold hover:underline self-start sm:self-auto shrink-0">
                  Manage Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
