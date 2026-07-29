import {
  Profile,
  Plan,
  Membership,
  Contribution,
  HamperItem,
  HamperOrder,
  Circle,
  CircleMember,
  SupportTicket,
  MemberActivityTimelineItem,
  NotificationLog,
  FinanceLedgerItem,
  PipelineStage,
} from './types';

type Listener = () => void;

class StateStore {
  private listeners: Listener[] = [];

  private currentUserId: string = 'usr_1';

  private profiles: Profile[] = [
    {
      id: 'usr_1',
      email: 'ananya.sharma@example.com',
      fullName: 'Ananya Sharma',
      phone: '+91 98765 43210',
      role: 'member',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-11-01',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'PAYMENT_ACTIVE',
    },
    {
      id: 'usr_102',
      email: 'rahul.verma@example.com',
      fullName: 'Rahul Verma',
      phone: '+91 98111 22233',
      role: 'member',
      kycStatus: 'pending',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-10',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'KYC_PENDING',
    },
    {
      id: 'usr_103',
      email: 'priya.patel@example.com',
      fullName: 'Priya Patel',
      phone: '+91 97777 88899',
      role: 'member',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-08-15',
      assignedEmployeeId: 'emp_2',
      assignedEmployeeName: 'Karan Mehra',
      pipelineStage: 'HAMPER_SELECTED',
    },
    {
      id: 'usr_104',
      email: 'vikram.singh@example.com',
      fullName: 'Vikram Singh',
      phone: '+91 96666 55544',
      role: 'member',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-02-01',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'PAYOUT_PROCESSING',
    },
    {
      id: 'usr_admin',
      email: 'admin.ops@samruddisave.com',
      fullName: 'Rajesh Kumar (Finance Admin)',
      phone: '+91 99999 00000',
      role: 'admin',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-01-01',
    },
  ];

  private plans: Plan[] = [
    {
      id: 'plan_starter',
      title: 'Starter Prosperity',
      monthlyAmount: 500,
      durationMonths: 12,
      cashBonusPercentage: 5,
      hamperValueCap: 1000,
      badgeTag: 'Popular Starter',
      description: 'Ideal for building disciplined saving habits with regular cash bonus.',
    },
    {
      id: 'plan_gold',
      title: 'Gold Harvest',
      monthlyAmount: 1000,
      durationMonths: 12,
      cashBonusPercentage: 5,
      hamperValueCap: 2000,
      badgeTag: 'Most Chosen',
      description: 'Our flagship 12-month savings commitment with premium curated hamper.',
    },
    {
      id: 'plan_ultra',
      title: 'Samruddi Elite',
      monthlyAmount: 2000,
      durationMonths: 12,
      cashBonusPercentage: 6,
      hamperValueCap: 4000,
      badgeTag: 'Maximum Value',
      description: 'Maximum rewards, highest cash bonus and luxury gift hampers.',
    },
  ];

  private memberships: Membership[] = [
    {
      id: 'mem_1',
      userId: 'usr_1',
      planId: 'plan_gold',
      status: 'ACTIVE_SAVER',
      startDate: '2025-12-01',
      dueDay: 5,
      currentStreak: 8,
      mandateActive: true,
      totalPaid: 8000,
      cyclesCompleted: 8,
    },
    {
      id: 'mem_102',
      userId: 'usr_102',
      planId: 'plan_starter',
      status: 'KYC_PENDING',
      startDate: '2026-01-10',
      dueDay: 5,
      currentStreak: 0,
      mandateActive: false,
      totalPaid: 0,
      cyclesCompleted: 0,
    },
  ];

  private contributions: Contribution[] = Array.from({ length: 12 }, (_, i) => {
    const cycle = i + 1;
    const isPaid = cycle <= 8;
    return {
      id: `cnt_${cycle}`,
      membershipId: 'mem_1',
      userId: 'usr_1',
      amount: 1000,
      dueDate: `2026-0${(cycle % 12) + 1}-05`,
      paidDate: isPaid ? `2026-0${(cycle % 12) + 1}-03` : undefined,
      cycleNumber: cycle,
      status: isPaid ? 'paid' : 'pending',
      paymentGatewayRef: isPaid ? `NPCI_UPI_${8900 + cycle * 22}` : undefined,
    };
  });

  private hampers: HamperItem[] = [
    {
      id: 'hamp_tech',
      title: 'Smart Home & Tech Hamper',
      categoryName: 'Electronics',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      description: 'Includes wireless earbuds, smart fitness tracker band, and 10,000mAh fast-charging power bank.',
      inStock: true,
      vendorName: 'Croma Enterprise Logistics',
      stockCount: 142,
    },
    {
      id: 'hamp_wellness',
      title: 'Luxury Organic Wellness Hamper',
      categoryName: 'Wellness',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
      description: 'Organic essential oils, bath salts, silk eye mask, and artisan aromatherapy diffuser.',
      inStock: true,
      vendorName: 'Kama Ayurveda Direct',
      stockCount: 88,
    },
    {
      id: 'hamp_fashion',
      title: 'Artisan Festive Fashion Box',
      categoryName: 'Fashion',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      description: 'Handcrafted silk stole, luxury wrist watch, and designer leather accessory set.',
      inStock: true,
      vendorName: 'FabIndia Craft Logistics',
      stockCount: 65,
    },
    {
      id: 'hamp_home',
      title: 'Handcrafted Festive Home Decor',
      categoryName: 'Home & Kitchen',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      description: 'Brass oil lamps, handwoven table runner, scented soy candles, and decorative brass bowls.',
      inStock: true,
      vendorName: 'Urban Living Crafts',
      stockCount: 50,
    },
  ];

  private hamperOrders: HamperOrder[] = [
    {
      id: 'hord_1',
      userId: 'usr_1',
      userName: 'Ananya Sharma',
      hamperId: 'hamp_tech',
      hamperTitle: 'Smart Home & Tech Hamper',
      status: 'DISPATCHED',
      courierPartner: 'BlueDart Express',
      trackingNumber: 'BLUE_DART_891234',
      dispatchDate: '2026-07-20',
    },
    {
      id: 'hord_2',
      userId: 'usr_103',
      userName: 'Priya Patel',
      hamperId: 'hamp_wellness',
      hamperTitle: 'Luxury Organic Wellness Hamper',
      status: 'SELECTION_LOCKED',
      courierPartner: 'Delhivery Logistics',
      dispatchDate: '2026-07-28',
    },
  ];

  private selectedHamperId: string = 'hamp_tech';

  private circles: Circle[] = [
    {
      id: 'circ_1',
      name: 'Bangalore Tech Savers Circle',
      creatorId: 'usr_1',
      inviteCode: 'SAVER2026',
      memberCount: 6,
      totalStreak: 8,
    },
  ];

  private circleMembers: CircleMember[] = [
    {
      circleId: 'circ_1',
      userId: 'usr_1',
      fullName: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      handle: '@ananya_save',
      streak: 8,
      status: 'active',
      amount: '₹1,000/mo',
    },
  ];

  private supportTickets: SupportTicket[] = [
    {
      id: 'tkt_101',
      userId: 'usr_1',
      subject: 'Mandate AutoPay Execution Date Confirmation',
      category: 'payment',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2026-07-28 10:30 AM',
      messages: [
        { sender: 'user', text: 'Hi, will my 9th month payment auto-debit on Aug 5th?', timestamp: '10:30 AM' },
        { sender: 'agent', text: 'Hello Ananya! Yes, your NPCI mandate is active for Aug 5th.', timestamp: '10:32 AM' },
      ],
    },
    {
      id: 'tkt_102',
      userId: 'usr_102',
      subject: 'PAN OCR Verification Document Re-upload',
      category: 'kyc',
      status: 'open',
      priority: 'high',
      createdAt: '2026-07-29 09:15 AM',
      messages: [
        { sender: 'user', text: 'My PAN image scan showed 99.8% match. Waiting for MRM approval.', timestamp: '09:15 AM' },
      ],
    },
  ];

  private activityTimeline: MemberActivityTimelineItem[] = [
    {
      id: 'act_1',
      userId: 'usr_1',
      title: 'Month #8 Contribution Cleared',
      description: '₹1,000 debited via NPCI UPI Mandate. Escrow custody confirmed.',
      timestamp: 'Jul 28, 2026',
      category: 'payment',
      badgeColor: '#1F8A5F',
    },
    {
      id: 'act_2',
      userId: 'usr_1',
      title: 'Smart Home & Tech Hamper Locked',
      description: 'Selected Month 6 Milestone Hamper. Dispatched via BlueDart (BLUE_DART_891234).',
      timestamp: 'Jul 20, 2026',
      category: 'hamper',
      badgeColor: '#D4A62A',
    },
    {
      id: 'act_3',
      userId: 'usr_1',
      title: 'KYC Verified via NSDL API',
      description: 'PAN ABCDE1234F and Aadhaar verified 100% compliant.',
      timestamp: 'Dec 01, 2025',
      category: 'kyc',
      badgeColor: '#1B4B66',
    },
    {
      id: 'act_4',
      userId: 'usr_1',
      title: 'Account Created & Gold Harvest Plan Selected',
      description: 'Signed up for ₹1,000/mo 12-Month Goal Savings Plan.',
      timestamp: 'Nov 01, 2025',
      category: 'system',
      badgeColor: '#5C6773',
    },
  ];

  private notificationLogs: NotificationLog[] = [
    {
      id: 'notif_1',
      userId: 'usr_1',
      channel: 'WHATSAPP',
      recipient: '+91 98765 43210',
      message: 'Your Month #8 payment of ₹1,000 is verified! You maintain an 8-month streak.',
      status: 'SENT',
      sentAt: '2026-07-28 10:35 AM',
    },
    {
      id: 'notif_2',
      userId: 'usr_1',
      channel: 'SMS',
      recipient: '+91 98765 43210',
      message: 'SamruddiSave: NPCI AutoPay mandate active for Aug 5th debit.',
      status: 'SENT',
      sentAt: '2026-07-28 09:00 AM',
    },
  ];

  private financeLedger: FinanceLedgerItem[] = [
    {
      id: 'ledg_1',
      txnRef: 'NPCI_UPI_9056',
      userId: 'usr_1',
      userName: 'Ananya Sharma',
      amount: 1000,
      type: 'MONTHLY_DEBIT',
      status: 'SETTLED',
      bankEscrowRef: 'ESCROW_AXIS_89123',
      timestamp: '2026-07-28 10:30 AM',
    },
    {
      id: 'ledg_2',
      txnRef: 'ESCROW_CREDIT_9901',
      userId: 'usr_104',
      userName: 'Vikram Singh',
      amount: 12600,
      type: 'MATURITY_PAYOUT',
      status: 'SETTLED',
      bankEscrowRef: 'ESCROW_HDFC_99124',
      timestamp: '2026-07-25 04:15 PM',
    },
  ];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  getCurrentUser(): Profile {
    return this.profiles.find((p) => p.id === this.currentUserId) || this.profiles[0];
  }

  setCurrentUser(id: string) {
    this.currentUserId = id;
    this.notify();
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  updatePipelineStage(userId: string, stage: PipelineStage) {
    const p = this.profiles.find((item) => item.id === userId);
    if (p) {
      p.pipelineStage = stage;
      this.notify();
    }
  }

  updateProfileKYC(status: 'pending' | 'approved' | 'rejected' = 'approved') {
    const profile = this.profiles.find((p) => p.id === this.currentUserId);
    if (profile) {
      profile.kycStatus = status;
      if (status === 'approved') profile.pipelineStage = 'PAYMENT_ACTIVE';
      this.notify();
    }
  }

  getPlans(): Plan[] {
    return this.plans;
  }

  getMembership(): Membership {
    return this.memberships[0];
  }

  getContributions(): Contribution[] {
    return this.contributions;
  }

  getHampers(): HamperItem[] {
    return this.hampers;
  }

  getHamperOrders(): HamperOrder[] {
    return this.hamperOrders;
  }

  getSelectedHamper(): HamperItem {
    return this.hampers.find((h) => h.id === this.selectedHamperId) || this.hampers[0];
  }

  setSelectedHamper(id: string) {
    this.selectedHamperId = id;
    this.notify();
  }

  getCircles(): Circle[] {
    return this.circles;
  }

  getCircleMembers(): CircleMember[] {
    return this.circleMembers;
  }

  getSupportTickets(): SupportTicket[] {
    return this.supportTickets;
  }

  getActivityTimeline(userId: string): MemberActivityTimelineItem[] {
    return this.activityTimeline.filter((a) => a.userId === userId || userId === 'usr_1');
  }

  getNotificationLogs(): NotificationLog[] {
    return this.notificationLogs;
  }

  getFinanceLedger(): FinanceLedgerItem[] {
    return this.financeLedger;
  }

  sendNotification(userId: string, channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH', message: string) {
    const user = this.profiles.find((p) => p.id === userId) || this.profiles[0];
    const newLog: NotificationLog = {
      id: `notif_${Date.now()}`,
      userId,
      channel,
      recipient: user.phone || user.email,
      message,
      status: 'SENT',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.notificationLogs.unshift(newLog);
    this.notify();
  }

  makePayment(cntId: string) {
    this.contributions = this.contributions.map((c) =>
      c.id === cntId ? { ...c, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : c
    );
    const mem = this.memberships[0];
    mem.cyclesCompleted = Math.min(12, mem.cyclesCompleted + 1);
    mem.totalPaid += 1000;
    mem.currentStreak += 1;
    if (mem.cyclesCompleted === 12) {
      mem.status = 'MATURED';
    }
    this.notify();
  }

  toggleGracePeriod() {
    const mem = this.memberships[0];
    mem.status = mem.status === 'GRACE_PERIOD' ? 'ACTIVE_SAVER' : 'GRACE_PERIOD';
    this.notify();
  }
}

export const store = new StateStore();
