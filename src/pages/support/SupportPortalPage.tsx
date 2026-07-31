import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Plus,
  X,
} from 'lucide-react';
import { store } from '../../store';
import { SupportTicket } from '../../types';

export const SupportPortalPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState<'tickets' | 'kb' | 'reports'>('tickets');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [agentMessage, setAgentMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [searchKb, setSearchKb] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // New Ticket Modal State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newCategory, setNewCategory] = useState<'payment' | 'kyc' | 'hamper' | 'payout' | 'general'>('payment');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newSubject, setNewSubject] = useState('');
  const [newMessageText, setNewMessageText] = useState('');

  const [toastNotification, setToastNotification] = useState<{ recipient: string; message: string } | null>(null);

  const showToastNotification = (recipient: string, message: string) => {
    setToastNotification({ recipient, message });
    setTimeout(() => setToastNotification(null), 5000);
  };

  const tickets = store.getSupportTickets();
  const articles = store.getKnowledgeArticles();
  const currentAgent = store.getCurrentUser();

  const filteredTickets = tickets.filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  // Selected ticket
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || (filteredTickets.length > 0 ? filteredTickets[0] : null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !agentMessage.trim()) return;

    const messageText = agentMessage.trim();
    const recipientPhone = '+91 90422 85132';

    // 1. Append message to live support ticket thread
    selectedTicket.messages.push({
      sender: 'agent',
      senderName: currentAgent.fullName,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    selectedTicket.status = 'in_progress';
    store.logAuditAction('SUPPORT_AGENT_REPLY', 'Support Desk', `Agent ${currentAgent.fullName} replied to ticket ${selectedTicket.id}`);
    
    // 2. Dispatch real-time WhatsApp & SMS notification to the target customer's phone number +91 90422 85132
    store.sendNotification(
      selectedTicket.userId,
      'WHATSAPP',
      `[Ticket #${selectedTicket.id}] ${currentAgent.fullName}: "${messageText}"`
    );

    setAgentMessage('');
    showToastNotification(recipientPhone, messageText);
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !internalNote.trim()) return;

    if (!selectedTicket.internalNotes) selectedTicket.internalNotes = [];
    selectedTicket.internalNotes.push(`[${new Date().toLocaleTimeString()}] ${currentAgent.fullName}: ${internalNote}`);
    store.logAuditAction('ADD_INTERNAL_NOTE', 'Support Desk', `Added internal note to ticket ${selectedTicket.id}`);
    setInternalNote('');
    showToastNotification('+91 90422 85132', 'Internal Note Saved!');
  };

  const handleEscalate = () => {
    if (!selectedTicket) return;
    store.escalateTicket(selectedTicket.id, 'Escalated by Support Agent for Finance/Admin review.');
    showToastNotification('+91 90422 85132', `Ticket ${selectedTicket.id} Escalated to Super Admin!`);
  };

  const handleResolve = () => {
    if (!selectedTicket) return;
    store.resolveSupportTicketWithNotes(selectedTicket.id, 'Issue resolved by Support Agent.');
    showToastNotification('+91 90422 85132', `Ticket ${selectedTicket.id} Marked Resolved!`);
  };

  const handleCreateNewTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessageText.trim()) return;

    const created = store.createSupportTicket({
      userName: newMemberName.trim() || 'New Member',
      category: newCategory,
      priority: newPriority,
      subject: newSubject.trim(),
      messageText: newMessageText.trim(),
    });

    setSelectedTicketId(created.id);
    setShowNewTicketModal(false);
    setNewMemberName('');
    setNewSubject('');
    setNewMessageText('');
    showToastNotification('+91 90422 85132', `New Ticket ${created.id} Created!`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2732] pb-36">
      <div className="layout-container pt-8 sm:pt-10 space-y-8">
        
        {/* Toast Alert / Live Notification Dispatch Popup */}
        {toastNotification && (
          <div className="fixed top-16 right-4 sm:right-6 z-50 bg-[#1B4B66] text-white p-4 rounded-[20px] shadow-2xl border-2 border-[#D4A62A] max-w-sm animate-fade-up space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4A62A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live SMS & WhatsApp Dispatched</span>
              </span>
              <span className="text-[10px] text-slate-200 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">{toastNotification.recipient}</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 leading-relaxed bg-white/10 p-2.5 rounded-xl border border-white/15">
              "{toastNotification.message}"
            </p>
          </div>
        )}

        {/* Executive Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[18px] bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-premium shrink-0">
              <MessageSquare className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Grievance & Helpdesk</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 text-[10px] font-extrabold">
                  Support Portal
                </span>
              </div>
              <h1 className="font-['Sora'] font-extrabold text-2xl sm:text-4xl text-[#1E2732] tracking-tight mt-0.5">
                Support Agent Desk & Knowledge Base
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2.5 rounded-[12px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Ticket</span>
            </button>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[16px] border border-slate-200 text-xs font-bold shadow-sm">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-2 ${
                  activeTab === 'tickets' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ticket Queue ({tickets.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('kb')}
                className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-2 ${
                  activeTab === 'kb' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Knowledge Base</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2.5 rounded-[12px] transition-all flex items-center gap-2 ${
                  activeTab === 'reports' ? 'bg-[#1B4B66] text-white shadow-md font-extrabold' : 'text-[#5C6773] hover:text-[#1E2732]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>SLA Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Ticket Queue & Resolution Chat */}
        {activeTab === 'tickets' && (
          <div className="space-y-6 animate-fade-up">
            {/* Filter Category Chips */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-[18px] border border-slate-200 text-xs font-bold shadow-sm overflow-x-auto">
              <span className="text-[#5C6773] px-3 font-semibold">Filter Issue Category:</span>
              {['all', 'payment', 'kyc', 'hamper', 'payout', 'general'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-[10px] capitalize transition-all shrink-0 ${
                    categoryFilter === cat ? 'bg-[#1B4B66] text-white font-extrabold' : 'bg-slate-100 text-[#5C6773] hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Ticket List */}
              <div className="lg:col-span-5 bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 space-y-4 shadow-premium">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Sora'] font-extrabold text-lg text-[#1E2732]">Member Support Tickets</h3>
                  <span className="text-xs text-[#5C6773] font-bold">{filteredTickets.length} Tickets</span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredTickets.length === 0 ? (
                    <div className="p-8 text-center text-[#5C6773] text-xs font-medium bg-[#F8FAFC] rounded-2xl border border-slate-200">
                      No tickets found for "{categoryFilter}" category.
                    </div>
                  ) : (
                    filteredTickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-4 rounded-[18px] border transition-all cursor-pointer space-y-2 ${
                          selectedTicket?.id === t.id
                            ? 'border-[#1B4B66] bg-[#1B4B66]/5 shadow-md ring-1 ring-[#1B4B66]'
                            : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#1B4B66]">#{t.id}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              t.priority === 'high'
                                ? 'bg-rose-100 text-rose-700'
                                : t.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {t.priority} Priority
                          </span>
                        </div>
                        <p className="font-['Sora'] font-bold text-sm text-[#1E2732] line-clamp-1">{t.subject}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#5C6773]">
                          <span>Member: {t.userName}</span>
                          <span className="capitalize font-bold text-[#1F8A5F]">{t.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Ticket Conversation & Agent Resolution */}
              <div className="lg:col-span-7 space-y-6">
                {selectedTicket ? (
                  <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-premium">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#1B4B66]">#{selectedTicket.id}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1B4B66]/10 text-[#1B4B66] text-[10px] font-bold uppercase">
                            {selectedTicket.category} Issue
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1F8A5F] text-[10px] font-bold uppercase">
                            {selectedTicket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h2 className="font-['Sora'] font-extrabold text-xl text-[#1E2732] mt-1">{selectedTicket.subject}</h2>
                        <p className="text-xs text-[#5C6773]">Member: {selectedTicket.userName} <span className="font-mono text-[#1B4B66] font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">(+91 90422 85132)</span> • Assigned Agent: {selectedTicket.assignedAgentName || currentAgent.fullName}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleEscalate}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs px-3.5 py-2 rounded-[10px] flex items-center gap-1 cursor-pointer"
                          title="Escalate to Admin"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Escalate</span>
                        </button>
                        <button
                          onClick={handleResolve}
                          className="bg-[#1F8A5F] hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </div>

                    {/* Messages Thread */}
                    <div className="space-y-4 max-h-80 overflow-y-auto p-4 bg-[#F8FAFC] rounded-[20px] border border-slate-200">
                      {selectedTicket.messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col space-y-1 ${m.sender === 'agent' ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-[#5C6773] font-mono">
                            {m.senderName || m.sender} • {m.timestamp}
                          </span>
                          <div
                            className={`p-3.5 rounded-[16px] text-xs max-w-sm leading-relaxed ${
                              m.sender === 'agent'
                                ? 'bg-[#1B4B66] text-white font-medium rounded-tr-none'
                                : 'bg-white border border-slate-200 text-[#1E2732] font-medium rounded-tl-none shadow-sm'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Response Form */}
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <label className="text-xs font-bold text-[#1E2732] block">Reply to Member</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={agentMessage}
                          onChange={(e) => setAgentMessage(e.target.value)}
                          placeholder="Type member reply message..."
                          className="flex-1 p-3.5 rounded-[14px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66] font-medium"
                        />
                        <button
                          type="submit"
                          className="bg-[#1B4B66] hover:bg-[#123448] text-white font-bold text-xs px-5 py-3.5 rounded-[14px] shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </form>

                    {/* Staff Internal Notes Section */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <label className="text-xs font-bold text-[#5C6773] uppercase tracking-wider block">Staff Internal Notes (Private)</label>
                      {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                        <div className="space-y-1 text-[11px] text-[#5C6773] bg-amber-50 border border-amber-200 p-3 rounded-[14px]">
                          {selectedTicket.internalNotes.map((note, i) => (
                            <p key={i}>• {note}</p>
                          ))}
                        </div>
                      )}

                      <form onSubmit={handleAddInternalNote} className="flex gap-2">
                        <input
                          type="text"
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          placeholder="Add private internal note for team..."
                          className="flex-1 p-3 rounded-[12px] bg-slate-50 border border-slate-200 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
                        />
                        <button type="submit" className="bg-slate-200 hover:bg-slate-300 text-[#1E2732] font-bold text-xs px-4 py-2 rounded-[12px] cursor-pointer">
                          Add Note
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-[28px] p-12 text-center text-slate-400 space-y-3">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="font-['Sora'] font-bold text-base text-[#1E2732]">Select a ticket from the left queue to respond</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Agent Knowledge Base */}
        {activeTab === 'kb' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Support Agent Knowledge Base & FAQs</h3>
                <p className="text-xs text-[#5C6773]">Standard operating procedures and member troubleshooting guides</p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchKb}
                  onChange={(e) => setSearchKb(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-[12px] bg-[#F8FAFC] border border-slate-300 text-xs text-[#1E2732] focus:outline-none focus:border-[#1B4B66]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles
                .filter((a) => a.title.toLowerCase().includes(searchKb.toLowerCase()) || a.summary.toLowerCase().includes(searchKb.toLowerCase()))
                .map((a) => (
                  <div key={a.id} className="p-6 rounded-[22px] bg-[#F8FAFC] border border-slate-200 space-y-3 hover:border-[#1B4B66]/30 transition-all">
                    <span className="text-[10px] font-bold text-[#1B4B66] uppercase bg-[#1B4B66]/10 px-2.5 py-1 rounded-full">
                      {a.category}
                    </span>
                    <h4 className="font-['Sora'] font-extrabold text-base text-[#1E2732]">{a.title}</h4>
                    <p className="text-xs text-[#5C6773] leading-relaxed">{a.summary}</p>
                    <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">Views: {a.views} • Updated: {a.lastUpdated}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 3: SLA Performance Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-[#1B4B66]/15 rounded-[28px] p-6 sm:p-10 space-y-6 shadow-premium animate-fade-up">
            <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Support SLA & Performance Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-bold">
              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">Average First Response Time</span>
                <p className="text-3xl font-extrabold font-mono text-[#1B4B66]">4.2 Mins</p>
                <span className="text-[#1F8A5F] font-bold">Within 15 Min SLA Target</span>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">Resolution Satisfaction Rate</span>
                <p className="text-3xl font-extrabold font-mono text-[#1F8A5F]">99.1%</p>
                <span className="text-[#1F8A5F] font-bold">High Member CSAT</span>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-[22px] border border-slate-200 space-y-2">
                <span className="text-[#5C6773] uppercase tracking-wider block">Escalated Tickets</span>
                <p className="text-3xl font-extrabold font-mono text-amber-600">1</p>
                <span className="text-amber-600 font-bold">Pending Admin Review</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-['Sora'] font-extrabold text-xl text-[#1E2732]">Create Member Support Ticket</h3>
                <p className="text-xs text-[#5C6773]">Log a new inquiry or issue for member resolution</p>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTicketSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E2732]">Member Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732]">Issue Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:outline-none"
                  >
                    <option value="payment">Payment & AutoPay</option>
                    <option value="kyc">KYC & Aadhaar</option>
                    <option value="hamper">Gift Hamper</option>
                    <option value="payout">Maturity Payout</option>
                    <option value="general">General Query</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1E2732]">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E2732]">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Summary of issue..."
                  className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-bold text-[#1E2732] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1E2732]">Initial Message / Details</label>
                <textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Describe member query details..."
                  rows={3}
                  className="w-full p-3 rounded-[12px] bg-[#F8FAFC] border border-slate-300 font-medium text-[#1E2732] focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-[12px] bg-[#1B4B66] hover:bg-[#123448] text-white font-['Sora'] font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Create & Add to Queue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
