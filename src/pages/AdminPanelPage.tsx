import React, { useState } from 'react';
import {
  Shield,
  Download,
  CheckCircle2,
  Users,
  Layers,
  Search,
  Truck,
  MessageSquare,
  Bell,
  Cpu,
  Settings,
  Plus,
  UserCheck,
  Package,
} from 'lucide-react';
import { store } from '../store';

export const AdminPanelPage: React.FC = () => {
  const [, setTick] = useState(0);

  React.useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'members' | 'employees' | 'plans' | 'inventory' | 'support' | 'compliance' | 'notifications' | 'audit' | 'monitoring' | 'settings'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // New Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Member Operations');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const members = store.getProfiles();
  const employees = store.getEmployees();
  const plans = store.getPlans();
  const hampers = store.getHampers();
  const vendors = store.getVendors();
  const purchaseOrders = store.getPurchaseOrders();
  const auditLogs = store.getAuditLogs();
  const health = store.getSystemHealth();
  const config = store.getSystemConfig();

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    store.addEmployee(newEmpName, newEmpEmail, newEmpPhone || '+91 XXXXX 99000', newEmpDept);
    setNewEmpName('');
    setNewEmpEmail('');
    setNewEmpPhone('');
    showToast(`New Employee ${newEmpName} Added Successfully!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-8 sm:pt-10 space-y-8">
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
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#1B4B66]">Platform Operations</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] text-[10px] font-extrabold">
                  Super Admin Portal
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight mt-0.5">
                SamruddiSave Super Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Members or Employees..."
                className="w-full pl-9 pr-4 py-2.5 rounded-[12px] bg-white border border-slate-200 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Structured Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-[18px] border border-slate-200 text-xs font-bold shadow-premium overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'members', label: 'Members' },
            { id: 'employees', label: 'Employee HR' },
            { id: 'plans', label: 'Savings Plans' },
            { id: 'inventory', label: 'Vendors & POs' },
            { id: 'support', label: 'Support Oversight' },
            { id: 'compliance', label: 'Compliance & Audits' },
            { id: 'notifications', label: 'Notification Dispatcher' },
            { id: 'audit', label: 'Audit Logs' },
            { id: 'monitoring', label: 'System Health' },
            { id: 'settings', label: 'Settings & Config' },
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

        {/* Tab 1: Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 space-y-2 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Total AUM in Escrow</span>
                <p className="text-3xl font-extrabold font-mono text-[#1B4B66]">₹42.8 Lakhs</p>
                <span className="text-xs text-[#1F8A5F] font-bold">+14.2% MoM Capital Growth</span>
              </div>

              <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 space-y-2 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Active Members</span>
                <p className="text-3xl font-extrabold font-mono text-[#1E2732]">1,280 Members</p>
                <span className="text-xs text-[#5C6773]">98.4% Active Savings Streak</span>
              </div>

              <div className="bg-white border border-[#1F8A5F]/20 rounded-[28px] p-6 space-y-2 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Active Staff Officers</span>
                <p className="text-3xl font-extrabold font-mono text-[#1F8A5F]">{employees.length} Officers</p>
                <span className="text-xs text-[#1F8A5F] font-bold">100% Workload Capacity</span>
              </div>

              <div className="bg-white border border-[#D4A62A]/30 rounded-[28px] p-6 space-y-2 shadow-premium">
                <span className="text-xs text-[#5C6773] uppercase tracking-wider block font-bold">Hamper Fulfillment %</span>
                <p className="text-3xl font-extrabold font-mono text-[#D4A62A]">99.2% SLA</p>
                <span className="text-xs text-[#D4A62A] font-bold">342 Hampers Dispatched</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members Directory */}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Employee HR & Workload Management */}
        {activeTab === 'employees' && (
          <div className="space-y-8 animate-fade-up">
            {/* Add Employee Form */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Add New Staff Operations Officer</h3>
              <form onSubmit={handleAddEmployeeSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <input
                  type="text"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  placeholder="Full Name..."
                  className="p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732]"
                  required
                />
                <input
                  type="email"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  placeholder="Email Address..."
                  className="p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732]"
                  required
                />
                <input
                  type="text"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                  placeholder="+91 XXXXX 99000"
                  className="p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-mono font-bold text-[#1E2732]"
                />
                <button type="submit" className="py-3 bg-[#1B4B66] text-white font-bold rounded-[12px] shadow-md flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Create Employee</span>
                </button>
              </form>
            </div>

            {/* Employees List */}
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium">
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Active Operations Officers Roster</h3>
              <div className="space-y-4">
                {employees.map((e) => (
                  <div key={e.id} className="p-6 rounded-[22px] bg-[#F8FAFC] border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#1B4B66] uppercase">{e.department}</span>
                      <p className="font-['Sora'] font-extrabold text-base text-[#1E2732] mt-0.5">{e.fullName}</p>
                      <p className="text-xs text-[#5C6773] font-mono">{e.email} • {e.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#1F8A5F]">Performance Score: {e.performanceScore}%</span>
                      <p className="text-[10px] text-[#5C6773]">Active Cases: {e.activeCasesCount} Members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Savings Plans Configurator */}
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

        {/* Tab 5: Vendors & Purchase Orders */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Hamper Suppliers & Vendor Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map((v) => (
                  <div key={v.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-[#1B4B66] uppercase">{v.categoryName}</span>
                    <p className="font-bold text-base text-[#1E2732]">{v.name}</p>
                    <p className="text-xs text-[#5C6773]">Contact: {v.contactPerson} ({v.phone})</p>
                    <p className="text-[10px] text-[#1F8A5F] font-bold">Total Stock Supplied: {v.stockSupplied} units</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
              <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Vendor Purchase Orders (POs)</h3>
              <div className="space-y-3 text-xs">
                {purchaseOrders.map((po) => (
                  <div key={po.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-[#1B4B66]">#{po.id}</span>
                      <p className="font-bold text-[#1E2732] mt-0.5">{po.vendorName} • {po.itemsDescription}</p>
                      <p className="text-[10px] text-[#5C6773]">Total: ₹{(po.totalAmountInPaise / 100).toLocaleString('en-IN')}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#1F8A5F]/15 text-[#1F8A5F] font-bold text-[10px]">{po.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Compliance & Audit Logs */}
        {activeTab === 'compliance' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">PMLA & RBI Escrow Compliance Logs</h3>
                <p className="text-xs text-[#5C6773]">Immutable Regulatory Audit Trail</p>
              </div>
              <button
                onClick={() => store.exportComplianceCSV()}
                className="bg-[#1B4B66] text-white font-bold text-xs px-4 py-2.5 rounded-[12px] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Compliance CSV (Audited)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 9: System Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">System Insert-Only Audit Logs</h3>
            <div className="space-y-3 text-xs">
              {auditLogs.map((a) => (
                <div key={a.id} className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-[#1B4B66]">
                    <span>{a.action} • Module: {a.module}</span>
                    <span>{a.timestamp}</span>
                  </div>
                  <p className="font-bold text-[#1E2732]">{a.details}</p>
                  <p className="text-[10px] text-[#5C6773]">Actor: {a.actorName} ({a.actorRole}) • IP: {a.ipAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Infrastructure System Health */}
        {activeTab === 'monitoring' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Infrastructure Health & Monitoring</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-bold">
              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">API Node Status</span>
                <p className="text-3xl font-extrabold font-mono text-[#1F8A5F]">{health.apiStatus}</p>
                <span className="text-[#1F8A5F] font-bold">All 7 Edge Functions Operational</span>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">Cron Worker Status</span>
                <p className="text-3xl font-extrabold font-mono text-[#1B4B66]">{health.cronWorkerStatus}</p>
                <span className="text-[#5C6773]">Last Reconciliation: {health.lastReconciliationTime}</span>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">Storage Usage</span>
                <p className="text-3xl font-extrabold font-mono text-purple-700">{health.storageUsagePct}%</p>
                <span className="text-purple-700 font-bold">4 Private Buckets Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 11: Settings & Config */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium max-w-2xl animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">System Platform Configuration</h3>
            <div className="space-y-4 text-xs font-bold">
              <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                <span>Grace Period Duration</span>
                <span className="font-mono text-[#1B4B66]">{config.gracePeriodDays} Days</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                <span>Cash Bonus Return Rate</span>
                <span className="font-mono text-[#1F8A5F]">{config.cashBonusPercentage}%</span>
              </div>

              <div className="p-4 rounded-[18px] bg-[#F8FAFC] border border-slate-200 flex justify-between items-center">
                <span>Max Payment Gateway Retries</span>
                <span className="font-mono text-amber-600">{config.paymentRetryMaxCount} Retries</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
