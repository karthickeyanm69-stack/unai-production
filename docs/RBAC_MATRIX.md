# 👥 SamruddiSave — Role-Based Access Control (RBAC) Matrix

> **Security Level**: Enterprise / RBI Escrow Trustee Compliant  
> **Enforcement**: Frontend `RoleGuard.tsx` + Backend Supabase RLS Policies  

---

## 🔒 Detailed Permission Breakdown

### 1. Member / Customer (`role: 'member'`)
- **Access Routes**: `/`, `/plans`, `/kyc`, `/dashboard`, `/pay`, `/payment-setup`, `/ledger`, `/hampers`, `/circles`, `/profile`
- **Capabilities**:
  - Register account with name, mobile, email, and 4-digit PIN.
  - Upload PAN / Aadhaar documents for AI OCR processing.
  - Set up monthly UPI AutoPay mandates.
  - View real-time savings ledger, streak count, and cash bonus calculation.
  - Browse gift hampers catalogue and view item breakdowns.
  - Join peer Savings Circles.
- **Restrictions**:
  - Cannot access `/employee`, `/support`, `/finance`, or `/admin`.
  - Cannot make deposits or setup AutoPay until officer approves KYC.

---

### 2. Employee (MRM Officer) (`role: 'employee'`)
- **Access Routes**: `/employee`, `/support`
- **Capabilities**:
  - Audit pending KYC applications and AI OCR confidence scores.
  - Approve or request resubmission for member applications.
  - Assign maturity gift hampers to member wallets.
  - Execute **MAKER** step verification for Month 12 maturity payouts.
  - Manage 5-day grace window payment reminders.

---

### 3. Customer Support Agent (`role: 'support_agent'`)
- **Access Routes**: `/support`
- **Capabilities**:
  - View customer support ticket queues.
  - Reply to customer inquiries regarding payments, AutoPay, and hampers.
  - Mark tickets as `IN_PROGRESS`, `RESOLVED`, or `CLOSED`.

---

### 4. Finance Escrow Admin (`role: 'finance_admin'`)
- **Access Routes**: `/finance`
- **Capabilities**:
  - Audit tripartite escrow trustee bank account balances.
  - Inspect MAKER-verified payout records.
  - Execute **CHECKER** final bank transfer disbursals (NEFT/RTGS).
  - Log bank transaction reference numbers.

---

### 5. Super Admin (`role: 'super_admin'`)
- **Access Routes**: `/admin`, `/employee`, `/finance`, `/support`
- **Capabilities**:
  - Executive platform governance & system override controls.
  - Manage staff accounts & department assignments.
  - Inspect full 256-bit encrypted system audit logs.
  - Configure saving plan rules and bonus percentages.
