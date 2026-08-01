import {
  Profile,
  UserRole,
  Employee,
  MemberAssignment,
  Plan,
  Membership,
  Contribution,
  HamperItem,
  HamperOrder,
  Vendor,
  PurchaseOrder,
  RefundRequest,
  GracePeriodCase,
  PayoutRecord,
  Circle,
  CircleMember,
  SupportTicket,
  MemberActivityTimelineItem,
  NotificationQueue,
  NotificationLog,
  FinanceLedgerItem,
  KnowledgeArticle,
  AuditLog,
  SystemHealthStatus,
  SystemConfig,
  PipelineStage,
} from './types';

type Listener = () => void;

const SESSION_KEY = 'samruddisave_session';

class StateStore {
  private listeners: Listener[] = [];

  private currentUserId: string | null = null;
  private isAuthenticated: boolean = false;
  private showLoginModal: boolean = false;
  private openModalCount: number = 0;

  constructor() {
    this.loadSession();
  }

  public openLoginModal() {
    this.showLoginModal = true;
    this.setModalOpen(true);
  }

  public closeLoginModal() {
    this.showLoginModal = false;
    this.setModalOpen(false);
  }

  public getShowLoginModal(): boolean {
    return this.showLoginModal;
  }

  public setModalOpen(open: boolean) {
    if (open) {
      this.openModalCount++;
    } else {
      this.openModalCount = Math.max(0, this.openModalCount - 1);
    }
    const isCurrentlyOpen = this.openModalCount > 0 || this.showLoginModal;
    if (typeof document !== 'undefined' && document.body) {
      if (isCurrentlyOpen) {
        document.body.classList.add('modal-open', 'overflow-hidden');
      } else {
        document.body.classList.remove('modal-open', 'overflow-hidden');
      }
    }
    this.notify();
  }

  public getIsModalOpen(): boolean {
    const hasClass = typeof document !== 'undefined' && document.body?.classList.contains('modal-open');
    return this.openModalCount > 0 || this.showLoginModal || !!hasClass;
  }

  private loadSession() {
    try {
      const savedProfiles = localStorage.getItem('samruddisave_profiles');
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0) {
          const existingIds = new Set(parsedProfiles.map((p: any) => p.id));
          const missingDefaults = this.profiles.filter((p) => !existingIds.has(p.id));
          this.profiles = [...parsedProfiles, ...missingDefaults];
        }
      }
      const savedMemberships = localStorage.getItem('samruddisave_memberships');
      if (savedMemberships) {
        const parsedMemberships = JSON.parse(savedMemberships);
        if (Array.isArray(parsedMemberships) && parsedMemberships.length > 0) {
          this.memberships = parsedMemberships;
        }
      }
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.currentUserId) {
          const userExists = this.profiles.find((p) => p.id === parsed.currentUserId);
          if (userExists) {
            this.currentUserId = parsed.currentUserId;
            this.isAuthenticated = true;
            return;
          }
        }
      }
    } catch (e) {}
    localStorage.removeItem(SESSION_KEY);
    this.currentUserId = null;
    this.isAuthenticated = false;
  }

  private saveSession() {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ currentUserId: this.currentUserId, isAuthenticated: this.isAuthenticated })
      );
      localStorage.setItem('samruddisave_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('samruddisave_memberships', JSON.stringify(this.memberships));
    } catch (e) {}
  }

  public getDeviceAccounts(): Profile[] {
    try {
      const saved = localStorage.getItem('samruddisave_device_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    const current = this.getCurrentUser();
    if (current && current.id !== 'guest') {
      this.saveDeviceAccount(current);
      return [current];
    }
    const defaultUser = this.profiles.find((p) => p.id === 'usr_karthik') || this.profiles[0];
    this.saveDeviceAccount(defaultUser);
    return [defaultUser];
  }

  public saveDeviceAccount(profile: Profile) {
    if (!profile || profile.id === 'guest') return;
    try {
      const currentAccounts = this.getDeviceAccounts();
      const existsIndex = currentAccounts.findIndex((p) => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase());
      if (existsIndex >= 0) {
        currentAccounts[existsIndex] = profile;
      } else {
        currentAccounts.push(profile);
      }
      localStorage.setItem('samruddisave_device_accounts', JSON.stringify(currentAccounts));
    } catch (e) {}
  }

  public removeDeviceAccount(id: string) {
    try {
      const currentAccounts = this.getDeviceAccounts().filter((p) => p.id !== id);
      localStorage.setItem('samruddisave_device_accounts', JSON.stringify(currentAccounts));
      this.notify();
    } catch (e) {}
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.saveSession();
    this.listeners.forEach((l) => l());
  }

  getCurrentUser(): Profile {
    if (this.isAuthenticated && this.currentUserId) {
      const found = this.profiles.find((p) => p.id === this.currentUserId);
      if (found) return found;
    }
    // Return a safe guest profile — never falls back to a real employee's data
    return {
      id: 'guest',
      email: '',
      fullName: 'Guest',
      phone: '',
      role: 'member' as const,
      kycStatus: 'pending' as const,
      createdAt: '',
      avatar: '',
    };
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setCurrentUser(id: string) {
    this.currentUserId = id;
    this.isAuthenticated = true;
    this.logAuditAction('USER_PERSONA_SWITCH', 'Auth', `Switched active persona to user ID ${id}`);
    this.notify();
  }

  loginUser(identifier: string, _pin: string): Profile | null {
    if (!identifier || !identifier.trim()) return null;
    const cleanId = identifier.trim().toLowerCase();

    // 1. Direct match by email, phone, or ID
    let user = this.profiles.find(
      (p) =>
        p.email.toLowerCase() === cleanId ||
        p.phone.replaceAll(' ', '').includes(cleanId.replaceAll(' ', '')) ||
        p.id.toLowerCase() === cleanId
    );

    // 2. Smart match for user 'karthik' / 'karthickeyan'
    if (!user && (cleanId.includes('karthik') || cleanId.includes('karthickeyan'))) {
      user = this.profiles.find((p) => p.id === 'usr_karthik');
      if (user) {
        user.email = identifier.trim();
      }
    }

    // 3. Dynamic seamless login/account linking for any valid email so users are never blocked
    if (!user && cleanId.includes('@')) {
      const nameFromEmail = cleanId.split('@')[0].replace(/[._-]/g, ' ');
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      user = this.registerNewMember({
        fullName: capitalizedName,
        email: cleanId,
        phone: '+91 90422 85132',
        pan: 'ABCDE1234F',
        aadhaar: '123456789012',
        bankAccount: '998877665544',
        ifsc: 'UTIB0001029',
        upiId: `${cleanId.split('@')[0]}@okaxis`,
      });
      user.kycStatus = 'approved';
      user.pipelineStage = 'PAYMENT_ACTIVE';
    }

    if (user) {
      this.currentUserId = user.id;
      this.isAuthenticated = true;
      this.saveDeviceAccount(user);
      this.saveSession();
      this.logAuditAction('USER_LOGIN', 'Auth', `User ${user.fullName} (${user.email}) logged in successfully.`);
      this.notify();
      return user;
    }
    return null;
  }

  logoutUser() {
    this.logAuditAction('USER_LOGOUT', 'Auth', `User ${this.currentUserId || 'unknown'} logged out.`);
    this.isAuthenticated = false;
    this.currentUserId = null;
    // Clear persisted session so browser refresh doesn't restore the session
    localStorage.removeItem(SESSION_KEY);
    this.notify();
  }

  private profiles: Profile[] = [
    {
      id: 'emp_1',
      email: 'priya.verma@samruddisave.com',
      fullName: 'Priya Verma (Admin)',
      phone: '+91 98765 11100',
      role: 'employee',
      department: 'Platform Admin & Member Operations',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-01-10',
    },
    {
      id: 'admin_1',
      email: 'rajesh.admin@samruddisave.com',
      fullName: 'Rajesh Sharma (Admin)',
      phone: '+91 98765 44400',
      role: 'employee',
      department: 'Platform Governance & Admin',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2025-01-01',
    },
    {
      id: 'usr_karthik',
      email: 'karthickeyanm69@gmail.com',
      fullName: 'Karthik',
      phone: '+91 90422 85132',
      role: 'member',
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-20',
      pipelineStage: 'PAYMENT_ACTIVE',
    },
    {
      id: 'usr_102',
      email: 'rahul.verma@example.com',
      fullName: 'Rahul Verma',
      phone: '+91 98765 88990',
      role: 'member',
      kycStatus: 'pending',
      maskedPan: 'ABCDE1234F',
      maskedAadhaar: 'XXXX-XXXX-4321',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-30',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'KYC_PENDING',
    },
    {
      id: 'usr_103',
      email: 'ananya.sharma@example.com',
      fullName: 'Ananya Sharma',
      phone: '+91 98765 77889',
      role: 'member',
      kycStatus: 'pending',
      maskedPan: 'FGHIJ5678K',
      maskedAadhaar: 'XXXX-XXXX-8765',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-31',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'KYC_PENDING',
    },
    {
      id: 'usr_104',
      email: 'rohit.kumar@example.com',
      fullName: 'Rohit Kumar',
      phone: '+91 98765 66778',
      role: 'member',
      kycStatus: 'pending',
      maskedPan: 'KLMNO9012P',
      maskedAadhaar: 'XXXX-XXXX-1098',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-31',
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'KYC_PENDING',
    },
  ];

  private employees: Employee[] = [
    {
      id: 'emp_1',
      profileId: 'emp_1',
      fullName: 'Priya Verma',
      email: 'priya.verma@samruddisave.com',
      phone: '+91 XXXXX 11100',
      department: 'Member Operations',
      role: 'employee',
      performanceScore: 100.0,
      activeCasesCount: 0,
      assignedMemberIds: [],
      status: 'active',
    },
  ];

  private memberAssignments: MemberAssignment[] = [];

  private plans: Plan[] = [
    {
      id: 'plan_starter',
      title: 'Starter Prosperity',
      monthlyAmount: 500,
      monthlyAmountInPaise: 50000,
      durationMonths: 12,
      cashBonusPercentage: 5,
      hamperValueCap: 1000,
      badgeTag: 'Popular Starter',
      description: 'Ideal for building disciplined saving habits with regular cash bonus.',
      features: ['5% Year-End Cash Bonus', 'Curated Festival Hamper (up to ₹1,000 value)', 'Zero Penalty 5-Day Grace Window', '100% Capital Safety under RBI Escrow'],
    },
    {
      id: 'plan_gold',
      title: 'Gold Harvest',
      monthlyAmount: 1000,
      monthlyAmountInPaise: 100000,
      durationMonths: 12,
      cashBonusPercentage: 5,
      hamperValueCap: 2000,
      badgeTag: 'Most Chosen',
      description: 'Our flagship 12-month savings commitment with premium curated hamper.',
      features: ['5% Year-End Cash Bonus (₹600 on ₹12,000)', 'Luxury Tech / Wellness Gift Hamper (₹2,000 value)', 'Automated Monthly UPI AutoPay', 'Tripartite Bank Escrow Custody'],
    },
    {
      id: 'plan_elite',
      title: 'Samruddi Elite',
      monthlyAmount: 2000,
      monthlyAmountInPaise: 200000,
      durationMonths: 12,
      cashBonusPercentage: 6,
      hamperValueCap: 4000,
      badgeTag: 'Maximum Value',
      description: 'Maximum rewards, highest cash bonus and luxury gift hampers.',
      features: ['6% Year-End Cash Bonus (₹1,440 on ₹24,000)', 'Ultra-Luxury Tech/Home Hamper (₹4,000 value)', 'Dedicated Senior Relationship Manager', 'Priority Customer Support'],
    },
  ];

  private memberships: Membership[] = [];

  private contributions: Contribution[] = [];

  private hampers: HamperItem[] = [
    {
      id: 'hamp_tech',
      title: 'Smart Home & Tech Hamper',
      categoryName: 'Electronics',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      description: 'Includes wireless earbuds, smart fitness tracker band, and 10,000mAh fast-charging power bank.',
      inStock: true,
      stockStatus: 'available',
      vendorName: 'Croma Enterprise Logistics',
      stockCount: 142,
      items: [
        { name: 'Wireless Bluetooth Earbuds', approxValue: 899 },
        { name: 'Smart Fitness Tracker Band', approxValue: 699 },
        { name: '10,000mAh Power Bank', approxValue: 402 },
      ],
    },
    {
      id: 'hamp_wellness',
      title: 'Luxury Organic Wellness Hamper',
      categoryName: 'Wellness',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
      description: 'Organic essential oils, bath salts, silk eye mask, and artisan aromatherapy diffuser.',
      inStock: true,
      stockStatus: 'low_stock',
      vendorName: 'Kama Ayurveda Direct',
      stockCount: 12,
      items: [
        { name: 'Organic Essential Oils Set', approxValue: 799 },
        { name: 'Artisan Aromatherapy Diffuser', approxValue: 699 },
        { name: 'Pure Silk Eye Mask & Bath Salts', approxValue: 502 },
      ],
    },
    {
      id: 'hamp_fashion',
      title: 'Artisan Festive Fashion Box',
      categoryName: 'Fashion',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      description: 'Handcrafted silk stole, luxury wrist watch, and designer leather accessory set.',
      inStock: true,
      stockStatus: 'available',
      vendorName: 'FabIndia Craft Logistics',
      stockCount: 65,
      items: [
        { name: 'Handcrafted Pure Silk Stole', approxValue: 999 },
        { name: 'Luxury Analog Wrist Watch', approxValue: 699 },
        { name: 'Designer Leather Accessory Set', approxValue: 302 },
      ],
    },
    {
      id: 'hamp_home',
      title: 'Handcrafted Festive Home Decor',
      categoryName: 'Home & Kitchen',
      estimatedValue: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      description: 'Brass oil lamps, handwoven table runner, scented soy candles, and decorative brass bowls.',
      inStock: false,
      stockStatus: 'out_of_stock',
      vendorName: 'Urban Living Crafts',
      stockCount: 0,
      items: [
        { name: 'Traditional Brass Diya Oil Lamps', approxValue: 799 },
        { name: 'Handwoven Silk Table Runner', approxValue: 699 },
        { name: 'Scented Soy Candles & Brass Bowl', approxValue: 502 },
      ],
    },
  ];

  private hamperOrders: HamperOrder[] = [];

  private vendors: Vendor[] = [
    { id: 'vnd_1', name: 'Croma Enterprise Logistics', categoryName: 'Electronics', contactPerson: 'Ramesh Shah', phone: '+91 XXXXX 99001', email: 'croma.b2b@example.com', stockSupplied: 450, activeOrders: 14, status: 'active' },
    { id: 'vnd_2', name: 'Kama Ayurveda Direct', categoryName: 'Wellness', contactPerson: 'Neha Gupta', phone: '+91 XXXXX 99002', email: 'kama.orders@example.com', stockSupplied: 220, activeOrders: 8, status: 'active' },
    { id: 'vnd_3', name: 'FabIndia Craft Logistics', categoryName: 'Fashion', contactPerson: 'Vikram Joshi', phone: '+91 XXXXX 99003', email: 'fabindia.craft@example.com', stockSupplied: 310, activeOrders: 5, status: 'active' },
    { id: 'vnd_4', name: 'Urban Living Crafts', categoryName: 'Home & Kitchen', contactPerson: 'Sunita Rao', phone: '+91 XXXXX 99004', email: 'urbanliving@example.com', stockSupplied: 180, activeOrders: 2, status: 'active' },
  ];

  private purchaseOrders: PurchaseOrder[] = [];

  private refundRequests: RefundRequest[] = [];

  private gracePeriodCases: GracePeriodCase[] = [];

  private payoutRecords: PayoutRecord[] = [];

  private selectedHamperId: string = 'hamp_tech';

  private circles: Circle[] = [
    {
      id: 'crcl_diwali',
      name: 'Diwali Gold Savings Goal 2026',
      creatorId: 'usr_ananya',
      inviteCode: 'SAVEDIWALI26',
      memberCount: 4,
      totalStreak: 23,
    },
    {
      id: 'crcl_home',
      name: 'Home Renovation Fund',
      creatorId: 'emp_1',
      inviteCode: 'HOMESAVE55',
      memberCount: 3,
      totalStreak: 15,
    },
  ];

  private circleMembers: CircleMember[] = [
    {
      circleId: 'crcl_diwali',
      userId: 'usr_karthik',
      fullName: 'Karthik (You)',
      handle: '@karthicMK123',
      streak: 8,
      status: 'active',
      amount: '₹2,000/mo',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    {
      circleId: 'crcl_diwali',
      userId: 'usr_ananya',
      fullName: 'Ananya Sharma',
      handle: '@ananya_s',
      streak: 7,
      status: 'active',
      amount: '₹2,000/mo',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      circleId: 'crcl_diwali',
      userId: 'usr_rohit',
      fullName: 'Rohit Kulkarni',
      handle: '@rohit_k',
      streak: 6,
      status: 'active',
      amount: '₹1,000/mo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      circleId: 'crcl_diwali',
      userId: 'usr_meera',
      fullName: 'Meera Nair',
      handle: '@meera_n',
      streak: 5,
      status: 'active',
      amount: '₹1,000/mo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      circleId: 'crcl_diwali',
      userId: 'usr_suresh',
      fullName: 'Suresh Patel',
      handle: '@suresh_p',
      streak: 4,
      status: 'active',
      amount: '₹1,000/mo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  private supportTickets: SupportTicket[] = [
    {
      id: 'TCK-8901',
      userId: 'usr_ananya',
      userName: 'Ananya Sharma',
      category: 'payment',
      priority: 'high',
      subject: 'UPI AutoPay Mandate Failed - 5 Day Grace Period Query',
      status: 'open',
      createdAt: '2026-07-30 09:30 AM',
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: 'Ananya Sharma',
          text: 'Hi Support, my Google Pay AutoPay mandate failed this morning due to bank server downtime. Will I lose my savings streak or pay any penalty?',
          timestamp: '09:30 AM',
        },
        {
          sender: 'agent',
          senderName: 'Amit Hegde',
          text: 'Hello Ananya! Do not worry. SamruddiSave provides a zero-penalty 5-Day Grace Window. You can retry payment via manual UPI before Aug 4 without breaking your streak.',
          timestamp: '09:42 AM',
        },
      ],
      internalNotes: ['Verified account - member completed Cycle 8 on time. No penalty risk.'],
    },
    {
      id: 'TCK-8902',
      userId: 'usr_rohit',
      userName: 'Rohit Kulkarni',
      category: 'kyc',
      priority: 'medium',
      subject: 'Aadhaar Address Update Verification Pending',
      status: 'in_progress',
      createdAt: '2026-07-29 02:15 PM',
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: 'Rohit Kulkarni',
          text: 'I uploaded my updated Aadhaar PDF with my new address yesterday. How long does the AI OCR verification take to approve?',
          timestamp: '02:15 PM',
        },
      ],
      internalNotes: ['OCR scan complete. Verification team assigned to cross-check PAN.'],
    },
    {
      id: 'TCK-8903',
      userId: 'usr_meera',
      userName: 'Meera Nair',
      category: 'hamper',
      priority: 'medium',
      subject: 'Festival Gift Hamper Selection Change Request',
      status: 'open',
      createdAt: '2026-07-30 11:00 AM',
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: 'Meera Nair',
          text: 'I currently have the Smart Home Tech Hamper selected for Month 12 maturity. Can I switch to the Organic Wellness Hamper?',
          timestamp: '11:00 AM',
        },
      ],
    },
    {
      id: 'TCK-8904',
      userId: 'usr_suresh',
      userName: 'Suresh Patel',
      category: 'payout',
      priority: 'high',
      subject: 'Month 12 Maturity Payout Bank Account Confirmation',
      status: 'open',
      createdAt: '2026-07-30 11:30 AM',
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: 'Suresh Patel',
          text: 'My Gold Harvest plan completed 12 months yesterday! Total ₹12,000 + ₹600 cash bonus. When will the Escrow Bank disburse the funds?',
          timestamp: '11:30 AM',
        },
      ],
      internalNotes: ['Payout record PO-9081 in ESCROW queue awaiting Maker-Checker verification.'],
    },
    {
      id: 'TCK-8905',
      userId: 'usr_pooja',
      userName: 'Pooja Sundaram',
      category: 'general',
      priority: 'low',
      subject: 'Savings Circle Invitation Code Not Working',
      status: 'open',
      createdAt: '2026-07-30 01:10 PM',
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: 'Pooja Sundaram',
          text: 'My friend shared a Savings Circle link for Diwali Savings Goal but it says maximum member limit reached. Can we expand the group size?',
          timestamp: '01:10 PM',
        },
      ],
    },
  ];

  private knowledgeArticles: KnowledgeArticle[] = [
    { id: 'kb_1', title: 'Understanding the 5-Day Grace Period', category: 'payment', summary: 'What happens if your monthly AutoPay payment date is missed?', content: 'SamruddiSave offers a zero-penalty 5-day grace period. If payment is made within 5 days, your streak remains active. If Day 6 passes unpaid, streak resets to 0.', views: 342, lastUpdated: '2026-06-15' },
    { id: 'kb_2', title: 'RBI Escrow Trustee Capital Safety Rules', category: 'general', summary: 'How funds are held under tripartite escrow agreements.', content: '100% of user contributions are deposited into an RBI-regulated Escrow Trustee Bank account. Funds cannot be touched by SamruddiSave until maturity payout.', views: 512, lastUpdated: '2026-05-10' },
    { id: 'kb_3', title: 'Selecting & Changing Your Year-End Gift Hamper', category: 'hamper', summary: 'Guidelines for choosing luxury gift hampers before Month 12.', content: 'Members can select and change their gift hamper choice anytime up to Month 10 of their 12-month savings commitment.', views: 289, lastUpdated: '2026-07-01' },
  ];

  private activityTimeline: MemberActivityTimelineItem[] = [];

  private notificationQueue: NotificationQueue[] = [];

  private notificationLogs: NotificationLog[] = [];

  private financeLedger: FinanceLedgerItem[] = [];

  private auditLogs: AuditLog[] = [];

  private systemHealth: SystemHealthStatus = {
    apiStatus: 'HEALTHY',
    emailQueueCount: 0,
    smsQueueCount: 1,
    storageUsagePct: 18.4,
    cronWorkerStatus: 'RUNNING',
    lastReconciliationTime: '2026-07-30 00:01 AM',
  };

  private systemConfig: SystemConfig = {
    gracePeriodDays: 5,
    cashBonusPercentage: 5,
    reminderFrequencyDays: 3,
    paymentRetryMaxCount: 3,
    smsWhatsappTemplates: {
      graceWarning: 'SamruddiSave Alert: You have 5 days to make your monthly payment and preserve your streak!',
      paymentReminder: 'SamruddiSave Reminder: AutoPay payment of ₹1,000 due on 5th of this month.',
      payoutDisbursed: 'Congratulations! Your SamruddiSave maturity payout of ₹12,600 has been transferred to your bank account.',
    },
  };



  registerNewMember(data: {
    fullName: string;
    phone: string;
    email: string;
    pan: string;
    aadhaar: string;
    bankAccount: string;
    ifsc: string;
    upiId: string;
  }): Profile {
    const newId = `usr_${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      fullName: data.fullName || 'New Customer',
      phone: data.phone || '+91 90422 85132',
      role: 'member',
      kycStatus: 'pending', // Pending Higher Officer Approval
      maskedPan: data.pan ? `${data.pan.slice(0, 2)}XXXX${data.pan.slice(-2)}` : 'XXXXX1234F',
      maskedAadhaar: data.aadhaar ? `XXXX-XXXX-${data.aadhaar.slice(-4)}` : 'XXXXXXXX1098',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      assignedEmployeeId: 'emp_1',
      assignedEmployeeName: 'Priya Verma',
      pipelineStage: 'KYC_PENDING',
    };
    this.profiles.unshift(newProfile);

    // Create a fresh 12-month goal savings membership for this newly registered customer
    const newMembership: Membership = {
      id: `mem_${Date.now()}`,
      userId: newId,
      planId: 'plan_gold',
      status: 'KYC_PENDING', // Pending Officer Review
      startDate: new Date().toISOString().split('T')[0],
      dueDay: 5,
      currentStreak: 1,
      mandateActive: true,
      totalPaidInPaise: 100000,
      cyclesCompleted: 1,
    };
    this.memberships.unshift(newMembership);

    // Set as active logged-in session
    this.currentUserId = newId;
    this.isAuthenticated = true;
    this.logAuditAction('NEW_MEMBER_REGISTER', 'Auth', `New customer ${newProfile.fullName} completed onboarding. Application pending Higher Officer approval.`);
    this.notify();
    return newProfile;
  }

  approveMemberKyc(userId: string, officerName: string = 'Priya Verma (Senior MRM Officer)'): Profile | null {
    const profile = this.profiles.find((p) => p.id === userId || p.phone.includes(userId) || p.email.includes(userId));
    if (profile) {
      profile.kycStatus = 'approved';
      profile.pipelineStage = 'PAYMENT_ACTIVE';

      const membership = this.memberships.find((m) => m.userId === profile.id);
      if (membership) {
        membership.status = 'ACTIVE_SAVER';
      }

      this.logAuditAction('ADMIN_OFFICER_APPROVAL', 'Member Operations', `Officer ${officerName} approved account for member ${profile.fullName}`);
      
      this.sendNotification(
        profile.id,
        'WHATSAPP',
        `SamruddiSave Alert: Your account application has been APPROVED by Admin Officer ${officerName}! Your 12-Month Savings Wallet is now 100% active.`
      );

      this.notify();
      return profile;
    }
    return null;
  }

  updateMandateStatus(status: 'ACTIVE' | 'PENDING' | 'INACTIVE', vpaOrCard?: string) {
    const mem = this.getMembership();
    if (mem) {
      mem.mandateActive = (status === 'ACTIVE');
      if (status === 'ACTIVE') {
        mem.status = 'ACTIVE_SAVER';
      }
      this.saveSession();
      this.logAuditAction('MANDATE_UPDATE', 'Payment', `NPCI AutoPay mandate authorized for user ${this.currentUserId} via ${vpaOrCard || 'UPI/Card'}`);
      this.notify();
    }
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }

  getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  getMemberAssignments(): MemberAssignment[] {
    return this.memberAssignments;
  }

  addEmployee(name: string, email: string, phone: string, department: string) {
    const newId = `emp_${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      email,
      fullName: name,
      phone,
      role: 'employee',
      department,
      kycStatus: 'approved',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newEmp: Employee = {
      id: newId,
      profileId: newId,
      fullName: name,
      email,
      phone,
      department,
      role: 'employee',
      performanceScore: 100.0,
      activeCasesCount: 0,
      assignedMemberIds: [],
      status: 'active',
    };
    this.profiles.push(newProfile);
    this.employees.push(newEmp);
    this.logAuditAction('ADD_EMPLOYEE', 'Employee HR', `Created new employee record ${name} (${newId})`);
    this.notify();
  }

  assignMemberToEmployee(memberId: string, employeeId: string) {
    const emp = this.employees.find((e) => e.id === employeeId);
    const member = this.profiles.find((p) => p.id === memberId);
    if (emp && member) {
      this.memberAssignments.forEach((a) => {
        if (a.memberId === memberId) a.active = false;
      });
      const newAsgn: MemberAssignment = {
        id: `asgn_${Date.now()}`,
        memberId,
        employeeId,
        employeeName: emp.fullName,
        assignedAt: new Date().toISOString().split('T')[0],
        assignedBy: this.getCurrentUser().id,
        active: true,
      };
      this.memberAssignments.push(newAsgn);
      member.assignedEmployeeId = employeeId;
      member.assignedEmployeeName = emp.fullName;
      if (!emp.assignedMemberIds.includes(memberId)) emp.assignedMemberIds.push(memberId);
      this.logAuditAction('ASSIGN_MEMBER', 'Member Ops', `Assigned member ${member.fullName} to employee ${emp.fullName}`);
      this.notify();
    }
  }

  updatePipelineStage(userId: string, stage: PipelineStage) {
    const p = this.profiles.find((item) => item.id === userId);
    if (p) {
      p.pipelineStage = stage;
      this.logAuditAction('UPDATE_PIPELINE', 'Member Ops', `Updated member ${p.fullName} pipeline stage to ${stage}`);
      this.notify();
    }
  }

  updateProfileKYC(userId?: string, status: 'pending' | 'approved' | 'rejected' = 'approved') {
    const id = userId || this.currentUserId;
    const profile = this.profiles.find((p) => p.id === id);
    if (profile) {
      profile.kycStatus = status;
      if (status === 'approved') profile.pipelineStage = 'PAYMENT_ACTIVE';
      this.logAuditAction('UPDATE_KYC', 'KYC Review', `Updated KYC status to ${status} for ${profile.fullName}`);
      this.notify();
    }
  }

  requestKYCResubmission(userId: string, reason: string) {
    const p = this.profiles.find((item) => item.id === userId);
    if (p) {
      p.kycStatus = 'rejected';
      p.pipelineStage = 'KYC_PENDING';
      this.sendNotification(userId, 'WHATSAPP', `KYC Document Resubmission Requested: ${reason}`);
      this.logAuditAction('KYC_RESUBMISSION_REQUEST', 'KYC Review', `Requested KYC resubmission for ${p.fullName}: ${reason}`);
      this.notify();
    }
  }

  getPlans(): Plan[] {
    return this.plans;
  }

  getMembership(): Membership {
    const currentId = this.currentUserId;
    if (currentId) {
      const found = this.memberships.find((m) => m.userId === currentId);
      if (found) return found;
    }
    if (this.memberships.length > 0) return this.memberships[0];
    return {
      id: 'mem_default',
      userId: currentId || 'usr_guest',
      planId: 'plan_gold',
      status: 'ACTIVE_SAVER',
      startDate: new Date().toISOString().split('T')[0],
      dueDay: 5,
      currentStreak: 1,
      mandateActive: true,
      totalPaidInPaise: 100000,
      cyclesCompleted: 1,
    };
  }

  getContributions(): Contribution[] {
    const currentId = this.currentUserId;
    if (currentId) {
      const found = this.contributions.filter((c) => c.userId === currentId);
      if (found.length > 0) return found;
    }
    if (this.contributions.length > 0) return this.contributions;
    return Array.from({ length: 12 }, (_, i) => {
      const cycle = i + 1;
      const isPaid = cycle === 1;
      return {
        id: `cnt_${cycle}`,
        membershipId: 'mem_default',
        userId: currentId || 'usr_guest',
        amountInPaise: 100000,
        dueDate: `2026-0${(cycle % 12) + 1}-05`,
        paidDate: isPaid ? new Date().toISOString().split('T')[0] : undefined,
        cycleNumber: cycle,
        status: isPaid ? 'paid' : 'pending',
        paymentGatewayRef: isPaid ? `NPCI_UPI_${8900 + cycle * 22}` : undefined,
      };
    });
  }

  recordOfflinePayment(
    userId: string,
    cycleNumber: number,
    amountInRupees: number,
    paidDate?: string,
    mode: 'OFFLINE_CASH' | 'OFFLINE_BANK_TRANSFER' | 'ADMIN_MANUAL_ENTRY' = 'OFFLINE_CASH',
    notes?: string
  ): boolean {
    const user = this.profiles.find((p) => p.id === userId);
    if (!user) return false;

    // Check if user has initialized contributions array
    const userContribs = this.contributions.filter((c) => c.userId === userId);
    if (userContribs.length === 0) {
      const membership = this.memberships.find((m) => m.userId === userId) || this.getMembership();
      for (let c = 1; c <= 12; c++) {
        this.contributions.push({
          id: `cnt_${userId}_${c}`,
          membershipId: membership.id,
          userId: userId,
          amountInPaise: amountInRupees * 100,
          dueDate: `2026-0${((c - 1) % 12) + 1}-05`,
          cycleNumber: c,
          status: 'pending',
        });
      }
    }

    const targetContrib = this.contributions.find((c) => c.userId === userId && c.cycleNumber === cycleNumber);
    if (targetContrib) {
      targetContrib.status = 'paid';
      targetContrib.paidDate = paidDate || new Date().toISOString().split('T')[0];
      targetContrib.amountInPaise = amountInRupees * 100;
      targetContrib.paymentMode = mode;
      targetContrib.recordedByAdminId = this.currentUserId || 'emp_1';
      targetContrib.recordedByAdminName = this.getCurrentUser().fullName || 'Admin Officer';
      targetContrib.adminNotes = notes || 'Recorded offline cash payment by Admin';
      targetContrib.paymentGatewayRef = `OFFLINE_${mode}_${Date.now().toString().slice(-6)}`;

      // Update membership metrics
      const membership = this.memberships.find((m) => m.userId === userId) || this.getMembership();
      if (membership) {
        const paidCount = this.contributions.filter((c) => c.userId === userId && c.status === 'paid').length;
        membership.cyclesCompleted = paidCount;
        membership.currentStreak = paidCount;
        membership.totalPaidInPaise = paidCount * (amountInRupees * 100);
        if (paidCount >= 12) {
          membership.status = 'MATURED';
          user.pipelineStage = 'COMPLETED';
        } else {
          membership.status = 'ACTIVE_SAVER';
          user.pipelineStage = 'PAYMENT_ACTIVE';
        }
      }

      this.saveSession();
      this.logAuditAction(
        'RECORD_OFFLINE_PAYMENT',
        'Member Operations',
        `Admin recorded offline payment for member ${user.fullName} for Cycle ${cycleNumber} (₹${amountInRupees})`
      );
      this.sendNotification(
        userId,
        'WHATSAPP',
        `SamruddiSave Alert: Offline payment of ₹${amountInRupees} for Month ${cycleNumber} has been verified and recorded by Admin.`
      );
      this.notify();
      return true;
    }
    return false;
  }

  getHampers(): HamperItem[] {
    return this.hampers;
  }

  getHamperOrders(): HamperOrder[] {
    return this.hamperOrders;
  }

  getVendors(): Vendor[] {
    return this.vendors;
  }

  getPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders;
  }

  createPurchaseOrder(vendorId: string, itemsDescription: string, quantity: number, totalAmountInPaise: number) {
    const vendor = this.vendors.find((v) => v.id === vendorId);
    if (vendor) {
      const po: PurchaseOrder = {
        id: `po_${Date.now()}`,
        vendorId,
        vendorName: vendor.name,
        itemsDescription,
        quantity,
        totalAmountInPaise,
        status: 'ISSUED',
        createdDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      };
      this.purchaseOrders.unshift(po);
      vendor.activeOrders += 1;
      this.logAuditAction('CREATE_PURCHASE_ORDER', 'Vendor Inventory', `Created PO ${po.id} for vendor ${vendor.name}`);
      this.notify();
    }
  }

  getSelectedHamper(): HamperItem {
    return this.hampers.find((h) => h.id === this.selectedHamperId) || this.hampers[0];
  }

  setSelectedHamper(id: string) {
    this.selectedHamperId = id;
    this.logAuditAction('SELECT_HAMPER', 'Rewards', `Member locked in gift hamper ID ${id}`);
    this.notify();
  }

  allocateHamperToMember(userId: string, hamperId: string, adminName: string = 'Admin Officer'): boolean {
    const user = this.profiles.find((p) => p.id === userId);
    const hamper = this.hampers.find((h) => h.id === hamperId);
    if (user && hamper) {
      user.allocatedHamperId = hamper.id;
      user.allocatedHamperTitle = hamper.title;
      user.allocatedByAdminName = adminName;
      user.allocatedAt = new Date().toISOString().split('T')[0];
      this.saveSession();
      this.logAuditAction('ALLOCATE_HAMPER', 'Rewards', `Admin ${adminName} allocated gift hamper "${hamper.title}" to member ${user.fullName} (${user.id})`);
      this.notify();
      return true;
    }
    return false;
  }

  getAllocatedHamperForUser(userId: string): { hamper: HamperItem | null; allocatedAt?: string; adminName?: string } {
    const user = this.profiles.find((p) => p.id === userId);
    if (user?.allocatedHamperId) {
      const hamper = this.hampers.find((h) => h.id === user.allocatedHamperId);
      if (hamper) {
        return {
          hamper,
          allocatedAt: user.allocatedAt,
          adminName: user.allocatedByAdminName,
        };
      }
    }
    return { hamper: null };
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

  createSupportTicket(data: {
    userName: string;
    category: 'payment' | 'kyc' | 'hamper' | 'payout' | 'general';
    priority: 'low' | 'medium' | 'high';
    subject: string;
    messageText: string;
  }): SupportTicket {
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: newId,
      userId: `usr_${Date.now()}`,
      userName: data.userName || 'Member User',
      category: data.category,
      priority: data.priority,
      subject: data.subject,
      status: 'open',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedAgentId: 'supp_1',
      assignedAgentName: 'Amit Hegde',
      messages: [
        {
          sender: 'user',
          senderName: data.userName || 'Member User',
          text: data.messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    this.supportTickets.unshift(newTicket);
    this.logAuditAction('CREATE_SUPPORT_TICKET', 'Support Desk', `Created ticket ${newId}: ${data.subject}`);
    this.notify();
    return newTicket;
  }

  getKnowledgeArticles(): KnowledgeArticle[] {
    return this.knowledgeArticles;
  }

  resolveSupportTicketWithNotes(ticketId: string, agentNote: string) {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      if (!ticket.internalNotes) ticket.internalNotes = [];
      ticket.internalNotes.push(`[${new Date().toLocaleTimeString()}] Agent Resolution: ${agentNote}`);
      this.logAuditAction('RESOLVE_SUPPORT_TICKET', 'Support Desk', `Resolved support ticket ${ticketId}`);
      this.notify();
    }
  }

  escalateTicket(ticketId: string, escalationReason: string) {
    const ticket = this.supportTickets.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = 'escalated';
      ticket.priority = 'high';
      if (!ticket.internalNotes) ticket.internalNotes = [];
      ticket.internalNotes.push(`Escalated to Super Admin: ${escalationReason}`);
      this.logAuditAction('ESCALATE_SUPPORT_TICKET', 'Support Desk', `Escalated ticket ${ticketId} to Admin: ${escalationReason}`);
      this.notify();
    }
  }

  getGracePeriodCases(): GracePeriodCase[] {
    return this.gracePeriodCases;
  }

  extendGracePeriod(caseId: string, additionalDays: number = 3) {
    const c = this.gracePeriodCases.find((item) => item.id === caseId);
    if (c) {
      c.daysRemaining += additionalDays;
      this.logAuditAction('EXTEND_GRACE_PERIOD', 'Grace Operations', `Extended grace period for case ${caseId} by ${additionalDays} days`);
      this.notify();
    }
  }

  markGraceRecovered(caseId: string) {
    const c = this.gracePeriodCases.find((item) => item.id === caseId);
    if (c) {
      c.status = 'CURED';
      const mem = this.memberships[0];
      mem.status = 'ACTIVE_SAVER';
      this.logAuditAction('MARK_GRACE_RECOVERED', 'Grace Operations', `Marked grace period case ${caseId} as CURED`);
      this.notify();
    }
  }

  expireGracePeriod(caseId: string) {
    const c = this.gracePeriodCases.find((item) => item.id === caseId);
    if (c) {
      c.status = 'EXPIRED';
      const mem = this.memberships[0];
      mem.currentStreak = 0;
      mem.status = 'DEFAULTED';
      this.sendNotification(c.userId, 'WHATSAPP', 'Grace period expired. Your savings streak has been reset.');
      this.logAuditAction('EXPIRE_GRACE_PERIOD', 'Grace Operations', `Grace period expired for member ${c.userName}. Streak reset to 0.`);
      this.notify();
    }
  }

  toggleGracePeriod() {
    const mem = this.memberships[0];
    mem.status = mem.status === 'GRACE_PERIOD' ? 'ACTIVE_SAVER' : 'GRACE_PERIOD';
    this.notify();
  }

  getRefundRequests(): RefundRequest[] {
    return this.refundRequests;
  }

  createRefundRequest(userId: string, amountInPaise: number, reason: string) {
    const user = this.profiles.find((p) => p.id === userId) || this.getCurrentUser();
    const rf: RefundRequest = {
      id: `rf_${Date.now()}`,
      userId,
      userName: user.fullName,
      amountInPaise,
      reason,
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.refundRequests.unshift(rf);
    this.logAuditAction('CREATE_REFUND_REQUEST', 'Finance Ops', `Created refund request for ${user.fullName}`);
    this.notify();
  }

  approveRefund(refundId: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'employee') {
      alert('Only Admin Officer can approve refunds.');
      return;
    }
    const rf = this.refundRequests.find((r) => r.id === refundId);
    if (rf) {
      rf.status = 'APPROVED';
      rf.approvedByFinanceAdminId = currentUser.id;
      rf.approvedByFinanceAdminName = currentUser.fullName;
      this.logAuditAction('APPROVE_REFUND', 'Finance Ops', `Approved refund ID ${refundId} by ${currentUser.fullName}`);
      this.notify();
    }
  }

  getPayoutRecords(): PayoutRecord[] {
    return this.payoutRecords;
  }

  verifyPayoutMaker(payoutId: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'employee') {
      alert('Only Admin Officer can verify Maker step.');
      return;
    }
    const pay = this.payoutRecords.find((p) => p.id === payoutId);
    if (pay && pay.status === 'PENDING') {
      pay.status = 'VERIFIED_BY_MAKER';
      pay.verifiedByMakerId = currentUser.id;
      pay.verifiedByMakerName = `${currentUser.fullName} (Maker)`;
      this.logAuditAction('VERIFY_PAYOUT_MAKER', 'Escrow Payouts', `MAKER step verified for payout ${payoutId} by ${currentUser.fullName}`);
      this.notify();
    }
  }

  approvePayoutChecker(payoutId: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'employee') {
      alert('Only Admin Officer can execute disbursal approval step.');
      return;
    }
    const pay = this.payoutRecords.find((p) => p.id === payoutId);
    if (pay) {
      pay.status = 'APPROVED_BY_CHECKER';
      pay.checkerAdminId = currentUser.id;
      pay.checkerAdminName = `${currentUser.fullName} (Checker)`;
      pay.bankTransferRef = `ESCROW_TRANSFER_${Date.now().toString().slice(-6)}`;
      pay.disbursedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.logAuditAction('APPROVE_PAYOUT_CHECKER', 'Escrow Payouts', `Disbursal approved for payout ${payoutId} by ${currentUser.fullName}`);
      this.notify();
    }
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

  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  getSystemHealth(): SystemHealthStatus {
    return this.systemHealth;
  }

  getSystemConfig(): SystemConfig {
    return this.systemConfig;
  }

  logAuditAction(action: string, module: string, details: string) {
    const user = this.getCurrentUser();
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action,
      module,
      ipAddress: '192.168.1.10',
      details,
    };
    this.auditLogs.unshift(newLog);
  }

  sendNotification(userId: string, channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH', message: string) {
    const user = this.profiles.find((p) => p.id === userId) || this.profiles[0];
    const newLog: NotificationLog = {
      id: `notif_${Date.now()}`,
      userId,
      channel,
      recipient: user.phone || user.email,
      message,
      status: 'DELIVERED',
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.notificationLogs.unshift(newLog);
    this.notify();
  }

  exportComplianceCSV() {
    this.logAuditAction('EXPORT_COMPLIANCE_CSV', 'Compliance', 'Exported compliance audit CSV data.');
    alert('Compliance Audit CSV Exported Successfully! (Logged in Audit Trail)');
  }

  makePayment(cntId: string) {
    this.contributions = this.contributions.map((c) =>
      c.id === cntId ? { ...c, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : c
    );
    const mem = this.memberships[0];
    mem.cyclesCompleted = Math.min(12, mem.cyclesCompleted + 1);
    mem.totalPaidInPaise += 100000;
    mem.currentStreak += 1;
    if (mem.cyclesCompleted === 12) {
      mem.status = 'MATURED';
    }
    this.logAuditAction('MAKE_PAYMENT', 'Payments', `Recorded monthly contribution cycle payment (${cntId})`);
    this.notify();
  }

  canAccessRoute(role: UserRole, path: string): boolean {
    if (path.startsWith('/employee') || path.startsWith('/admin') || path.startsWith('/mrm') || path.startsWith('/finance') || path.startsWith('/support')) {
      return role === 'employee';
    }
    return true;
  }
}

export const store = new StateStore();
