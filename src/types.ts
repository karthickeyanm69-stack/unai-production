export type UserRole = 'member' | 'admin' | 'support' | 'employee';

export type MembershipStatus =
  | 'AUTH_NO_KYC'
  | 'KYC_PENDING'
  | 'KYC_APPROVED'
  | 'PLAN_SELECTED'
  | 'ACTIVE_SAVER'
  | 'GRACE_PERIOD'
  | 'DEFAULTED'
  | 'MATURED';

export type PipelineStage =
  | 'SIGNUP'
  | 'KYC_PENDING'
  | 'KYC_APPROVED'
  | 'PAYMENT_ACTIVE'
  | 'GRACE_PERIOD'
  | 'HAMPER_SELECTED'
  | 'PAYOUT_PROCESSING'
  | 'COMPLETED';

export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export type ContributionStatus = 'pending' | 'paid' | 'overdue' | 'failed';

export type HamperCategoryName = 'Electronics' | 'Home & Kitchen' | 'Wellness' | 'Fashion';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  kycStatus: KYCStatus;
  avatar: string;
  createdAt: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  pipelineStage?: PipelineStage;
}

export interface Plan {
  id: string;
  title: string;
  monthlyAmount: number;
  durationMonths: number;
  cashBonusPercentage: number;
  hamperValueCap: number;
  badgeTag: string;
  description: string;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  status: MembershipStatus;
  startDate: string;
  dueDay: number;
  currentStreak: number;
  mandateActive: boolean;
  totalPaid: number;
  cyclesCompleted: number;
}

export interface Contribution {
  id: string;
  membershipId: string;
  userId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  cycleNumber: number;
  status: ContributionStatus;
  paymentGatewayRef?: string;
}

export interface HamperItem {
  id: string;
  categoryName: HamperCategoryName;
  title: string;
  description: string;
  estimatedValue: number;
  imageUrl: string;
  inStock: boolean;
  vendorName?: string;
  stockCount?: number;
}

export interface HamperOrder {
  id: string;
  userId: string;
  userName: string;
  hamperId: string;
  hamperTitle: string;
  status: 'PENDING_SELECTION' | 'SELECTION_LOCKED' | 'DISPATCHED' | 'DELIVERED' | 'RETURNED';
  courierPartner?: string;
  trackingNumber?: string;
  dispatchDate?: string;
  deliveryDate?: string;
}

export interface Circle {
  id: string;
  name: string;
  creatorId: string;
  inviteCode: string;
  memberCount: number;
  totalStreak: number;
}

export interface CircleMember {
  circleId: string;
  userId: string;
  fullName: string;
  avatar: string;
  handle: string;
  streak: number;
  status: 'active' | 'grace' | 'matured';
  amount: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: 'kyc' | 'payment' | 'hamper' | 'general';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: {
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
  }[];
}

export interface MemberActivityTimelineItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'kyc' | 'payment' | 'hamper' | 'support' | 'system';
  badgeColor?: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH';
  recipient: string;
  message: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  sentAt: string;
}

export interface FinanceLedgerItem {
  id: string;
  txnRef: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'MONTHLY_DEBIT' | 'ESCROW_RECEIPT' | 'MATURITY_PAYOUT' | 'FAILED_DEBIT';
  status: 'SETTLED' | 'PENDING' | 'FAILED';
  bankEscrowRef: string;
  timestamp: string;
}
