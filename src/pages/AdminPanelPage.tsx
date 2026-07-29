import React, { useState } from 'react';
import {
  Shield,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  Lock,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  Search,
  DollarSign,
  Truck,
  MessageSquare,
  Bell,
  Users,
  Layers,
  Send,
} from 'lucide-react';
import { store } from '../store';

export const AdminPanelPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'members' | 'plans' | 'finance' | 'kyc' | 'payouts' | 'hampers' | 'support' | 'notifications' | 'compliance'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const members = store.getProfiles();
  const plans = store.getPlans();
  const financeLedger = store.getFinanceLedger();
  const hampers = store.getHampers();
  const hamperOrders = store.getHamperOrders();
  const tickets = store.getSupportTickets();
  const notificationLogs = store.getNotificationLogs();

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732]">
      <div className="layout-container pt-8 sm:pt-10 pb-36 space-y-8">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-[#1B4B66] text-white px-6 py-3.5 rounded-[16px] shadow-2xl font-['Sora'] font-extrabold text-xs flex items-center gap-2 border-2 border-[#D4A62A] animate-fade-up">
            <CheckCircle2 className="w-4 h-4 text-[#D4A62A]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Executive Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[18px] bg-[#1B4B66] text-[#D4A62A] flex items-center justify-center font-extrabold shadow-premium shrink-0">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Financial Operations</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-extrabold">
                  Super Admin
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight mt-0.5">
                SamruddiSave Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AUM or Member..."
                className="w-full pl-9 pr-4 py-2 rounded-[12px] bg-white border border-slate-200 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Structured 10-Module Admin Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-[18px] border border-slate-200 text-xs font-bold shadow-premium overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'members', label: 'Members' },
            { id: 'plans', label: 'Savings Plans' },
            { id: 'finance', label: 'Finance Operations' },
            { id: 'kyc', label: 'KYC Verification' },
            { id: 'payouts', label: 'Payouts' },
            { id: 'hampers', label: 'Hamper Management' },
            { id: 'support', label: 'Support Desk' },
            { id: 'notifications', label: 'Notification Center' },
            { id: 'compliance', label: 'Compliance Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-[12px] transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#1B4B66] text-white shadow-md font-extrabold'
                  : 'text-[#5C6773] hover:text-[#1E2732] hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Module 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-3 shadow-premium hover-lift">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Total AUM in Escrow</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#1B4B66]">₹42.8 Lakhs</p>
                <span className="text-xs text-[#1F8A5F] font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+14.2% MoM Capital Growth</span>
                </span>
              </div>

              <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-3 shadow-premium hover-lift">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Active Goal Savers</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#1E2732]">1,280 Members</p>
                <span className="text-xs text-[#5C6773]">98.4% Active Savings Streak</span>
              </div>

              <div className="bg-white border border-[#1F8A5F]/20 rounded-[28px] p-6 sm:p-8 space-y-3 shadow-premium hover-lift">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Upcoming Payouts</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#1F8A5F]">₹5.24 Lakhs</p>
                <span className="text-xs text-[#1F8A5F] font-bold">42 Matured Plans Ready</span>
              </div>

              <div className="bg-white border border-[#D4A62A]/30 rounded-[28px] p-6 sm:p-8 space-y-3 shadow-premium hover-lift">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Hampers Fulfilled</span>
                <p className="text-3xl sm:text-4xl font-extrabold font-mono text-[#D4A62A]">342 Hampers</p>
                <span className="text-xs text-[#D4A62A] font-bold">99.2% Delivery SLA</span>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Members Management */}
        {activeTab === 'members' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Global Members Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[#5C6773] uppercase tracking-wider font-bold">
                    <th className="pb-3">Member Name</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">KYC Status</th>
                    <th className="pb-3">Assigned Lead</th>
                    <th className="pb-3">Pipeline Stage</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-4 font-bold text-[#1E2732]">{m.fullName}</td>
                      <td className="py-4 font-mono text-[#5C6773]">{m.phone}</td>
                      <td className="py-4 font-bold text-[#1F8A5F]">{m.kycStatus.toUpperCase()}</td>
                      <td className="py-4 text-[#5C6773]">{m.assignedEmployeeName || 'Priya Verma'}</td>
                      <td className="py-4 font-extrabold text-[#1B4B66]">{m.pipelineStage || 'ACTIVE SAVER'}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => showToast(`Opened profile for ${m.fullName}`)}
                          className="bg-[#1B4B66] text-white font-bold px-3 py-1.5 rounded-[8px]"
                        >
                          Inspect MRM
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 3: Savings Plans Configurator */}
        {activeTab === 'plans' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Savings Plans Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="p-6 rounded-[22px] bg-[#F8FAFC] border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#1B4B66] uppercase">{p.badgeTag}</span>
                    <span className="text-xs font-mono font-extrabold text-[#1F8A5F]">+{p.cashBonusPercentage}% Bonus</span>
                  </div>
                  <h4 className="font-['Sora'] font-extrabold text-lg text-[#1E2732]">{p.title}</h4>
                  <p className="text-2xl font-mono font-extrabold text-[#1E2732]">₹{p.monthlyAmount}/mo</p>
                  <p className="text-xs text-[#5C6773]">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 4: Finance Operations */}
        {activeTab === 'finance' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Finance Operations & Escrow Monitoring</h3>
                <p className="text-xs text-[#5C6773]">Payment Verification, Monthly Collections & Escrow Audits</p>
              </div>
              <button onClick={() => showToast('Escrow Audit Sync Verified')} className="bg-[#1F8A5F] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                Sync Escrow Bank Node
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[#5C6773] uppercase tracking-wider font-bold">
                    <th className="pb-3">Txn Reference</th>
                    <th className="pb-3">Member Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Bank Escrow Ref</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financeLedger.map((f) => (
                    <tr key={f.id} className="hover:bg-[#F8FAFC]">
                      <td className="py-3.5 font-mono text-[#1B4B66] font-bold">{f.txnRef}</td>
                      <td className="py-3.5 font-bold text-[#1E2732]">{f.userName}</td>
                      <td className="py-3.5 text-[#5C6773]">{f.type}</td>
                      <td className="py-3.5 font-mono font-extrabold text-[#1E2732]">₹{f.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 font-mono text-[10px] text-slate-500">{f.bankEscrowRef}</td>
                      <td className="py-3.5 text-right font-bold text-[#1F8A5F]">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 5: KYC Verification Queue */}
        {activeTab === 'kyc' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">NSDL Identity Verification Queue</h3>
            <div className="p-6 bg-[#F8FAFC] rounded-[20px] border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-base text-[#1E2732]">Ananya Sharma (usr_1)</p>
                <p className="text-xs text-[#5C6773] font-mono">PAN: ABCDE1234F • Aadhaar: 9876 5432 1098</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => showToast('KYC Approved via NSDL API')} className="bg-[#1F8A5F] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                  Approve KYC
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Module 6: Payouts */}
        {activeTab === 'payouts' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Maturity Payout Disbursals</h3>
            <p className="text-xs text-[#5C6773]">Escrow Bank Payout Executions</p>
          </div>
        )}

        {/* Module 7: Hamper Management */}
        {activeTab === 'hampers' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Hamper Logistics, Vendors & Inventory</h3>
                <p className="text-xs text-[#5C6773]">Vendor Dispatch Management & Courier Tracking</p>
              </div>
              <button onClick={() => showToast('Hamper Vendor Stock Re-ordered')} className="bg-[#1B4B66] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                Re-order Stock
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hampers.map((h) => (
                <div key={h.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex items-center space-x-4">
                  <img src={h.imageUrl} alt={h.title} className="w-14 h-14 rounded-[14px] object-cover" />
                  <div>
                    <p className="font-bold text-sm text-[#1E2732]">{h.title}</p>
                    <p className="text-xs text-[#5C6773]">Vendor: {h.vendorName || 'Croma Logistics'}</p>
                    <span className="text-[10px] text-[#1F8A5F] font-bold">Stock Available: {h.stockCount || 100} units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 8: Support Desk */}
        {activeTab === 'support' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Member Support Desk</h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-[#1E2732]">{t.subject}</p>
                    <p className="text-xs text-[#5C6773]">Category: {t.category} • Priority: {t.priority}</p>
                  </div>
                  <button onClick={() => showToast(`Ticket ${t.id} Resolved`)} className="bg-[#1F8A5F] text-white font-bold text-xs px-4 py-2 rounded-[10px]">
                    Resolve Ticket
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 9: Notification Center */}
        {activeTab === 'notifications' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Notification Center & Dispatcher</h3>
                <p className="text-xs text-[#5C6773]">SMS, WhatsApp, Email & Push Reminders</p>
              </div>
              <button
                onClick={() => {
                  store.sendNotification('usr_1', 'WHATSAPP', 'System AutoPay Reminder sent.');
                  showToast('Automated Notification Dispatch Completed!');
                }}
                className="bg-[#1B4B66] text-white font-bold text-xs px-4 py-2 rounded-[10px]"
              >
                Dispatch Reminders
              </button>
            </div>

            <div className="space-y-3">
              {notificationLogs.map((n) => (
                <div key={n.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-[#1B4B66] uppercase">{n.channel}</span>
                    <p className="text-xs text-[#1E2732] font-medium mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-[#5C6773] font-mono">{n.sentAt}</p>
                  </div>
                  <span className="text-xs font-bold text-[#1F8A5F]">{n.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 10: Compliance & Audit Logs */}
        {activeTab === 'compliance' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">PMLA & RBI Escrow Compliance Logs</h3>
                <p className="text-xs text-[#5C6773]">Immutable Regulatory Audit Trail</p>
              </div>
              <button onClick={() => showToast('Exported Compliance CSV')} className="bg-[#1B4B66] text-white font-bold text-xs px-4 py-2 rounded-[10px] flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
