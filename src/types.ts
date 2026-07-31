export type UserRole = 'member' | 'employee' | 'support_agent' | 'finance_admin' | 'super_admin';

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

export type HamperStockStatus = 'available' | 'low_stock' | 'out_of_stock';

export type PaymentGatewayState = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'SETTLED' | 'FAILED' | 'RETRYING' | 'REFUNDED';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string; // Synthetic masked e.g. +91 XXXXX 43210
  role: UserRole;
  department?: string;
  kycStatus: KYCStatus;
  maskedPan?: string; // Synthetic masked e.g. XXXXX1234F
  maskedAadhaar?: string; // Synthetic masked e.g. XXXXXXXX1098
  avatar: string;
  createdAt: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  pipelineStage?: PipelineStage;
  allocatedHamperId?: string;
  allocatedHamperTitle?: string;
  allocatedByAdminName?: string;
  allocatedAt?: string;
}

export interface Employee {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: 'employee';
  performanceScore: number; // e.g. 98.4%
  activeCasesCount: number;
  assignedMemberIds: string[];
  status: 'active' | 'on_leave' | 'inactive';
}

export interface MemberAssignment {
  id: string;
  memberId: string;
  employeeId: string;
  employeeName: string;
  assignedAt: string;
  assignedBy: string;
  unassignedAt?: string;
  active: boolean;
}

export interface Plan {
  id: string;
  title: string;
  monthlyAmount: number; // In Rupees for display
  monthlyAmountInPaise: number; // In integer Paise e.g. 100000
  durationMonths: number;
  cashBonusPercentage: number;
  hamperValueCap: number;
  badgeTag: string;
  description: string;
  features?: string[];
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
  totalPaidInPaise: number;
  cyclesCompleted: number;
}

export interface Contribution {
  id: string;
  membershipId: string;
  userId: string;
  amountInPaise: number;
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
  stockStatus: HamperStockStatus;
  items?: { name: string; approxValue: number }[];
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

export interface Vendor {
  id: string;
  name: string;
  categoryName: string;
  contactPerson: string;
  phone: string;
  email: string;
  stockSupplied: number;
  activeOrders: number;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  itemsDescription: string;
  quantity: number;
  totalAmountInPaise: number;
  status: 'DRAFT' | 'ISSUED' | 'DELIVERED' | 'CLOSED';
  createdDate: string;
  expectedDeliveryDate: string;
}

export interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  amountInPaise: number;
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedByFinanceAdminId?: string;
  approvedByFinanceAdminName?: string;
}

export interface GracePeriodCase {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  triggeredAt: string;
  expiresAt: string; // Day 5 cutoff
  daysRemaining: number;
  status: 'ACTIVE' | 'CURED' | 'EXPIRED';
  curePaymentRef?: string;
}

export interface PayoutRecord {
  id: string;
  userId: string;
  userName: string;
  amountInPaise: number;
  verifiedByMakerId?: string; // Employee MAKER Step
  verifiedByMakerName?: string;
  checkerAdminId?: string; // Finance Admin CHECKER Step (Must be <> verifiedByMakerId)
  checkerAdminName?: string;
  status: 'PENDING' | 'VERIFIED_BY_MAKER' | 'APPROVED_BY_CHECKER' | 'DISBURSED';
  bankTransferRef?: string;
  requestedAt: string;
  disbursedAt?: string;
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
  userName: string;
  subject: string;
  category: 'kyc' | 'payment' | 'hamper' | 'payout' | 'general';
  status: 'open' | 'in_progress' | 'escalated' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  internalNotes?: string[];
  messages: {
    sender: 'user' | 'agent';
    senderName?: string;
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

export interface NotificationQueue {
  id: string;
  userId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH';
  recipient: string;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'RETRY' | 'DELIVERED' | 'FAILED' | 'DLQ';
  attempts: number;
  nextRetryAt?: string;
}

export interface NotificationLog {
  id: string;
  userId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH';
  recipient: string;
  message: string;
  status: 'DELIVERED' | 'FAILED';
  sentAt: string;
}

export interface FinanceLedgerItem {
  id: string;
  txnRef: string;
  userId: string;
  userName: string;
  amountInPaise: number;
  type: 'MONTHLY_DEBIT' | 'ESCROW_RECEIPT' | 'MATURITY_PAYOUT' | 'FAILED_DEBIT' | 'REFUND_REQUEST';
  gatewayState: PaymentGatewayState;
  status: 'SETTLED' | 'PENDING' | 'FAILED' | 'PENDING_APPROVAL';
  bankEscrowRef: string;
  timestamp: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'payment' | 'kyc' | 'hamper' | 'payout' | 'general';
  summary: string;
  content: string;
  views: number;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
}

export interface SystemHealthStatus {
  apiStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  emailQueueCount: number;
  smsQueueCount: number;
  storageUsagePct: number;
  cronWorkerStatus: 'RUNNING' | 'STOPPED';
  lastReconciliationTime: string;
}

export interface SystemConfig {
  gracePeriodDays: number;
  cashBonusPercentage: number;
  reminderFrequencyDays: number;
  paymentRetryMaxCount: number;
  smsWhatsappTemplates: {
    graceWarning: string;
    paymentReminder: string;
    payoutDisbursed: string;
  };
}
