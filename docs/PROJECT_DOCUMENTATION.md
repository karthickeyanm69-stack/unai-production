# 🛡️ SamruddiSave Platform — Full Architecture & Operational Documentation

> **Version**: 2.6 (Production Real-Time & HD Resolution Architecture)  
> **Target Platform**: RBI Escrow Certified Fixed Savings & Maturity Perks Platform  
> **Last Updated**: August 1, 2026  

---

## 📋 Executive Overview

**SamruddiSave** is a digital micro-savings and gold harvest platform designed to foster disciplined 12-month savings habits for retail customers across India. Members commit to fixed monthly contributions (e.g., ₹1,000, ₹2,000, or ₹4,000/month), earning a **5%–6% year-end cash bonus** plus a **curated luxury gift hamper** delivered at Month 12 maturity.

All customer funds are held under a **Tripartite Bank Escrow Custody Account** in full compliance with RBI escrow trustee regulations.

---

## 🏗️ 1. Technical Stack Summary

| Layer | Technology / Tools | Details & Responsibilities |
| :--- | :--- | :--- |
| **Frontend Core** | React 19 + TypeScript 6 + Vite 8 | Single Page Application (SPA), strict typing (`tsc -b`), fast HMR |
| **Styling & Aesthetics** | Vanilla CSS + Tailwind CSS 4 + Google Fonts (Sora, Inter) | Sleek modern aesthetics, curated HSL color palettes, dynamic glassmorphism & micro-animations |
| **Data & Analytics** | `lucide-react` + `recharts` + `canvas-confetti` | Real-time financial dashboards, streak counters, ledger graphs, celebratory feedback |
| **Routing & Protection**| `react-router-dom` v7 + `RoleGuard.tsx` | Declarative routing with client-side role permission protection |
| **State Engine** | Centralized `StateStore` ([store.ts](file:///d:/SamruddiSave/src/store.ts)) | Reactive pub-sub listener pattern with synchronous `localStorage` persistence |
| **Backend & Database** | PostgreSQL 15+ (Supabase) | 19 relational tables, `pgcrypto` PII encryption, Row-Level Security (RLS) policies |
| **Edge Compute** | Deno Edge Functions ([supabase/functions](file:///d:/SamruddiSave/supabase/functions)) | Payment webhooks, automated grace period audits, Maker-Checker payout batching, compliance exports |

---

## 🗄️ 2. Backend Database Architecture & Schema

The backend schema ([20260730000000_init_schema.sql](file:///d:/SamruddiSave/supabase/migrations/20260730000000_init_schema.sql)) consists of **19 core relational tables**:

```
+-------------------+       +-------------------+       +-----------------------+
|     profiles      |       |    memberships    |       |     contributions     |
+-------------------+       +-------------------+       +-----------------------+
| id (UUID)         |<----->| id (UUID)         |<----->| id (UUID)             |
| full_name         |       | user_id (UUID)    |       | membership_id         |
| email             |       | plan_id           |       | user_id (UUID)        |
| role (enum)       |       | current_streak    |       | amount_in_paise       |
| kyc_status (enum) |       | total_paid_paise  |       | due_date / paid_date  |
| encrypted_pan     |       | cycles_completed  |       | status (paid/overdue) |
+-------------------+       +-------------------+       +-----------------------+
```

### Table Inventory & Key Specifications

1. **`profiles`**: User identities, role (`member`, `employee`, `support_agent`, `finance_admin`, `super_admin`), KYC status (`not_submitted`, `pending`, `approved`, `rejected`), pipeline stage, and encrypted PII (PAN/Aadhaar via `pgcrypto`).
2. **`employees`**: Staff metadata, department (`Member Operations`), performance score, active case workload.
3. **`members`**: Member financial credentials (encrypted bank account numbers, IFSC codes, UPI VPAs).
4. **`member_assignments`**: Assignment mapping connecting members to assigned MRM officers for dedicated support and KYC audits.
5. **`savings_plans`**: Available plan tiers (e.g. ₹1,000/mo, ₹2,000/mo, ₹4,000/mo) with duration (12 months), cash bonus rate (5%), and gift hamper value caps.
6. **`memberships`**: Active customer savings contract, streak counter, payment due day (5th of each month), total paid amount, completed cycles (1–12), and status (`ACTIVE_SAVER`, `GRACE_PERIOD`, `DEFAULTED`, `MATURED`).
7. **`contributions`**: Detailed ledger of 12 monthly deposit payments per user.
8. **`hampers` & `hamper_items`**: Gift hamper catalogue (*Smart Home & Tech, Luxury Wellness, Festive Fashion, Home Decor*) & item pricing.
9. **`hamper_orders`**: Hamper allocation records, fulfillment status, tracking IDs.
10. **`vendors` & `purchase_orders`**: Vendor inventory procurement tracking for hamper fulfillment.
11. **`refund_requests`**: Member pre-maturity account withdrawal and refund workflow.
12. **`grace_period_cases`**: 5-day grace window tracking for missed payment dates.
13. **`payout_records`**: Month 12 maturity payouts enforced with **Maker-Checker segregation of duties**.
14. **`circles` & `circle_members`**: Social peer savings circles and group goal progress.
15. **`support_tickets`**: Ticket queue system (`open`, `in_progress`, `escalated`, `resolved`) with priority levels (`low`, `medium`, `high`).
16. **`member_activity_timeline`**: Audit log of key customer actions and status transitions.
17. **`notification_queue` & `notification_logs`**: Multi-channel user notifications (SMS, WhatsApp, Email, Push).
18. **`finance_ledger_items`**: Double-entry escrow ledger tracking debits, credits, and bank settlement refs (`SETTLED`, `PENDING`).
19. **`audit_logs`**: 256-bit encrypted audit trails capturing actor, role, module, action, IP address, and payload timestamp.

---

## ⚡ 3. Backend Edge Functions (Deno Runtime)

Located in [supabase/functions/](file:///d:/SamruddiSave/supabase/functions):

- **`payment-webhook`**: Receives Razorpay / PhonePe payment events, validates HMAC SHA-256 signatures, applies idempotency checks (`payment_webhook_logs`), inserts paid contributions, and logs settled escrow ledger items.
- **`create-payout-batch`**: Processes `APPROVED_BY_CHECKER` maturity payouts, generates bank transfer references (`ESCROW_TRANSFER_xxxxx`), updates status to `DISBURSED`, and logs ledger transactions.
- **`process-grace-period`**: Cron service that checks overdue monthly deposits, manages the 5-day grace period, and dispatches automated WhatsApp/SMS warning alerts.
- **`send-notifications`**: Dispatches multi-channel member notifications.
- **`ledger-reconcile`**: Reconciles escrow bank balances with gateway collections.
- **`export-compliance`**: Generates RBI compliance audit export files.
- **`health`**: Platform health check ping service.

---

## 👥 4. Role-Based Access Control (RBAC) & Portals

The platform enforces RBAC through client-side routing guards ([RoleGuard.tsx](file:///d:/SamruddiSave/src/components/RoleGuard.tsx)) and database Row-Level Security (RLS) policies:

| User Persona | Accessible Routes | Primary Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **Member / Customer** (`role: 'member'`) | `/`, `/plans`, `/kyc`, `/dashboard`, `/pay`, `/payment-setup`, `/ledger`, `/hampers`, `/circles`, `/profile` | Register, submit PAN/Aadhaar OCR, set up monthly AutoPay, make deposits, track streak, view gift hampers catalogue, join peer savings circles. |
| **MRM Employee** (`role: 'employee'`) | `/employee` | Review pending KYC submissions, verify AI OCR confidence scores, approve/reject accounts, assign gift hampers to member wallets, execute **MAKER** step payout verification. |
| **Support Agent** (`role: 'support_agent'`) | `/support` | Manage customer support tickets, answer payment/KYC inquiries, update ticket resolution statuses and internal notes. |
| **Finance Escrow Admin** (`role: 'finance_admin'`) | `/finance` | Monitor escrow bank balances, audit contribution ledgers, review MAKER-verified payouts, execute **CHECKER** final bank transfer disbursals (NEFT/RTGS). |
| **Super Admin** (`role: 'super_admin'`) | `/admin`, `/employee`, `/finance`, `/support` | Full platform governance, manage staff accounts, inspect 256-bit encrypted audit logs, configure savings plans, override system controls. |

---

## 🔄 5. Core Operational Workflows

### 📍 Workflow 1: Customer Onboarding & KYC Verification Lock
1. Customer registers on `/kyc` with name, mobile, email, and 4-digit PIN.
2. Customer uploads PAN / Aadhaar image or PDF for AI OCR extraction.
3. System logs profile state as `kycStatus: 'pending'` and pipeline stage `KYC_PENDING`.
4. **Compliance Lock Guard**: Customer is redirected to `/dashboard`. Payment screens (`/pay`, `/payment-setup`) are **strictly locked** until officer approval.
5. MRM Officer logs into `/employee`, reviews OCR confidence, and clicks **Approve Account & KYC**.
6. Status updates to `kycStatus: 'approved'`, unlocking deposit and AutoPay screens in real-time.

---

### 📍 Workflow 2: Monthly Deposit & 5-Day Grace Window Lifecycle
1. Member makes monthly deposit via UPI/AutoPay on `/pay`.
2. If payment is missed on the due date (e.g. 5th of month), account enters a **5-Day Grace Window** (Days 1–5).
3. No penalty is charged during the grace window; automated WhatsApp reminders are sent.
4. If paid within 5 days, streak is preserved (`currentStreak` +1).
5. If unpaid after Day 5 (Day 6+), status transitions to `DEFAULTED` and flags the account on `/employee` for staff intervention.

---

### 📍 Workflow 3: Gift Hamper Catalogue & Allocation
1. Members browse curated luxury hampers on `/hampers` (*Smart Home & Tech, Luxury Wellness, Festive Fashion, Home Decor*).
2. Members **cannot select hampers directly** (view-only mode with gift breakdown modals).
3. Staff/Admin selects a member on `/employee` and assigns a hamper from the allocation dropdown.
4. Member’s `/hampers` page updates to display: **`✓ Included Gift / Assigned to Your Maturity Payout`**.

---

### 📍 Workflow 4: Maker-Checker Disbursal Workflow
1. At Month 12 maturity, payout record enters the queue on `/employee`.
2. **MAKER Step**: MRM Officer audits 12 monthly payments and KYC compliance, then clicks **Verify MAKER Step** (`VERIFIED_BY_MAKER`).
3. **CHECKER Step**: Finance Escrow Admin logs into `/finance`, verifies escrow account funds, executes bank wire transfer (Principal + 5% Bonus), enters Bank Transfer Reference ID (e.g., `HDFC99281726`), and clicks **Approve & Disburse** (`DISBURSED`).

---

## 📁 6. Complete File Architecture

```
SamruddiSave/
├── package.json               # Dependencies: React 19, Vite 8, Recharts, Lucide-React, Tailwind 4
├── WORKFLOW.md                # Detailed operational workflow documentation
├── docs/
│   ├── ARCHITECTURE.md        # System architecture overview
│   ├── RBAC_MATRIX.md         # Detailed permission rules per role
│   └── PROJECT_DOCUMENTATION.md # Full project technical documentation
├── supabase/
│   ├── migrations/
│   │   └── 20260730000000_init_schema.sql # 19-table DB schema, RLS policies & trigger functions
│   └── functions/             # 7 Deno Edge Functions (payment-webhook, create-payout-batch, etc.)
└── src/
    ├── App.tsx                # Central router, layout, role protection & global modals
    ├── store.ts               # Centralized StateStore, pub-sub system & localStorage engine
    ├── types.ts               # TypeScript data interfaces for all entities
    ├── lib/
    │   └── supabase.ts        # Supabase API client integration
    ├── components/
    │   ├── TopHeader.tsx      # Top bar with branding & account switch dropdown
    │   ├── BottomNavDock.tsx  # Mobile navigation dock
    │   ├── RoleGuard.tsx      # Authentication & RBAC protection wrapper
    │   └── LoginModal.tsx     # Persona login modal (Member, MRM, Support, Finance, Super Admin)
    └── pages/
        ├── LandingPage.tsx           # Public homepage
        ├── KYCPage.tsx               # Onboarding & AI OCR document upload
        ├── DashboardPage.tsx         # Customer savings portal & compliance lock banner
        ├── MakePaymentPage.tsx       # Monthly deposit gateway page
        ├── PaymentSetupPage.tsx      # AutoPay mandate configuration
        ├── LedgerPage.tsx            # Deposit history ledger & cash bonus calculations
        ├── HamperSelectionPage.tsx   # Gift hamper catalogue viewer
        ├── SavingsCirclesPage.tsx    # Peer savings group dashboard
        ├── employee/
        │   └── EmployeeDashboard.tsx # MRM Officer dashboard (KYC review, hampers, Maker step)
        ├── finance/
        │   └── FinanceAdminPortalPage.tsx # Escrow admin portal (Checker step, ledger audit)
        ├── support/
        │   └── SupportPortalPage.tsx  # Customer support ticket desk
        └── AdminPanelPage.tsx        # Super Admin executive panel & system audit logs
```
