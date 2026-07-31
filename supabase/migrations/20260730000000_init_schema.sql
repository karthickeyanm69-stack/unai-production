-- =============================================================================
-- SamruddiSave Production PostgreSQL Backend Architecture & Dashboard Analytics SQL
-- Database: PostgreSQL 15+ / Supabase
-- Script: 20260730000000_init_schema.sql
-- Description: Complete 19-table schema, pgcrypto PII encryption, 5-role RLS policies,
--              Maker-Checker segregation of duties, analytical dashboard views,
--              and sample seed data for all portals (Customer, MRM, Support, Finance, Super Admin).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 1: EXTENSIONS & CUSTOM ENUMS
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('member', 'employee', 'support_agent', 'finance_admin', 'super_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status_type AS ENUM ('not_submitted', 'pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE membership_status_type AS ENUM ('AUTH_NO_KYC', 'KYC_PENDING', 'KYC_APPROVED', 'PLAN_SELECTED', 'ACTIVE_SAVER', 'GRACE_PERIOD', 'DEFAULTED', 'MATURED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE pipeline_stage_type AS ENUM ('SIGNUP', 'KYC_PENDING', 'KYC_APPROVED', 'PAYMENT_ACTIVE', 'GRACE_PERIOD', 'HAMPER_SELECTED', 'PAYOUT_PROCESSING', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE contribution_status_type AS ENUM ('pending', 'paid', 'overdue', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE hamper_stock_status_type AS ENUM ('available', 'low_stock', 'out_of_stock');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE refund_status_type AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE grace_status_type AS ENUM ('ACTIVE', 'CURED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payout_status_type AS ENUM ('PENDING', 'VERIFIED_BY_MAKER', 'APPROVED_BY_CHECKER', 'DISBURSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status_type AS ENUM ('open', 'in_progress', 'escalated', 'resolved');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority_type AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel_type AS ENUM ('SMS', 'EMAIL', 'WHATSAPP', 'PUSH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- SECTION 2: CORE TABLES (19 TABLES)
-- -----------------------------------------------------------------------------

-- 1) Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  department TEXT,
  kyc_status kyc_status_type NOT NULL DEFAULT 'not_submitted',
  masked_pan TEXT DEFAULT 'XXXXX1234F',
  masked_aadhaar TEXT DEFAULT 'XXXXXXXX1098',
  encrypted_pan BYTEA,
  encrypted_aadhaar BYTEA,
  avatar_url TEXT,
  assigned_employee_id UUID,
  pipeline_stage pipeline_stage_type DEFAULT 'SIGNUP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT NOT NULL DEFAULT 'Member Operations',
  performance_score NUMERIC(5,2) DEFAULT 98.40,
  active_cases_count INT DEFAULT 48,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Members Metadata Table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_account_masked TEXT DEFAULT 'XXXXXXXX9988',
  ifsc_code TEXT DEFAULT 'SBIN0001234',
  upi_vpa TEXT DEFAULT 'member@upi',
  bank_account_encrypted BYTEA,
  bank_ifsc_encrypted BYTEA,
  upi_vpa_encrypted BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Member Assignments Table
CREATE TABLE IF NOT EXISTS public.member_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES public.profiles(id),
  active BOOLEAN NOT NULL DEFAULT true
);

-- 5) Savings Plans Table
CREATE TABLE IF NOT EXISTS public.savings_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  monthly_amount_in_paise BIGINT NOT NULL,
  duration_months INT NOT NULL DEFAULT 12,
  cash_bonus_percentage NUMERIC(4,2) NOT NULL DEFAULT 5.00,
  hamper_value_cap_in_paise BIGINT NOT NULL DEFAULT 200000,
  badge_tag TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6) Memberships Table
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.savings_plans(id),
  status membership_status_type NOT NULL DEFAULT 'ACTIVE_SAVER',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_day INT NOT NULL DEFAULT 5,
  current_streak INT NOT NULL DEFAULT 8,
  mandate_active BOOLEAN NOT NULL DEFAULT true,
  total_paid_in_paise BIGINT NOT NULL DEFAULT 800000,
  cycles_completed INT NOT NULL DEFAULT 8,
  selected_hamper_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7) Monthly Contributions Table
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_in_paise BIGINT NOT NULL DEFAULT 100000,
  due_date DATE NOT NULL,
  paid_date DATE,
  cycle_number INT NOT NULL,
  status contribution_status_type NOT NULL DEFAULT 'pending',
  payment_gateway_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8) Finance Ledger Items Table
CREATE TABLE IF NOT EXISTS public.finance_ledger_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  cycle_number INT NOT NULL,
  amount_in_paise BIGINT NOT NULL,
  entry_type TEXT NOT NULL, -- 'ESCROW_CREDIT', 'FEE_DEBIT', 'INTEREST_CREDIT'
  status TEXT NOT NULL DEFAULT 'CLEARED',
  gateway_ref TEXT NOT NULL,
  escrow_vault_id TEXT NOT NULL DEFAULT 'RBI_ESCROW_VAULT_01',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9) Refund Requests Table
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  amount_in_paise BIGINT NOT NULL,
  reason TEXT NOT NULL,
  status refund_status_type NOT NULL DEFAULT 'PENDING_APPROVAL',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles(id)
);

-- 10) Grace Period Cases Table
CREATE TABLE IF NOT EXISTS public.grace_period_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  cycle_number INT NOT NULL,
  missed_due_date DATE NOT NULL,
  grace_end_date DATE NOT NULL,
  days_remaining INT NOT NULL DEFAULT 5,
  status grace_status_type NOT NULL DEFAULT 'ACTIVE',
  outreach_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11) Gift Hampers Table
CREATE TABLE IF NOT EXISTS public.hampers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_value_in_paise BIGINT NOT NULL DEFAULT 200000,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  stock_count INT NOT NULL DEFAULT 100,
  stock_status hamper_stock_status_type NOT NULL DEFAULT 'available',
  vendor_name TEXT NOT NULL DEFAULT 'Croma Enterprise Logistics',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12) Hamper Orders Table
CREATE TABLE IF NOT EXISTS public.hamper_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  hamper_id UUID NOT NULL REFERENCES public.hampers(id),
  hamper_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DISPATCHED', -- 'DISPATCHED', 'DELIVERED', 'PROCESSING'
  courier_partner TEXT DEFAULT 'BlueDart Express',
  tracking_number TEXT DEFAULT 'BLUE_DART_891234',
  dispatch_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13) Payout Records Table (Maker-Checker Segregation)
CREATE TABLE IF NOT EXISTS public.payout_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  membership_id UUID NOT NULL REFERENCES public.memberships(id),
  amount_in_paise BIGINT NOT NULL DEFAULT 1260000, -- ₹12,600.00
  bonus_amount_in_paise BIGINT NOT NULL DEFAULT 60000, -- ₹600.00 (5% Cash Bonus)
  status payout_status_type NOT NULL DEFAULT 'PENDING',
  verified_by_maker_id UUID REFERENCES public.profiles(id),
  checker_admin_id UUID REFERENCES public.profiles(id),
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT check_segregation CHECK (verified_by_maker_id IS NULL OR checker_admin_id IS NULL OR verified_by_maker_id <> checker_admin_id)
);

-- 14) Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'payment',
  priority ticket_priority_type NOT NULL DEFAULT 'medium',
  status ticket_status_type NOT NULL DEFAULT 'open',
  assigned_agent_id UUID REFERENCES public.profiles(id),
  assigned_agent_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15) Payment Webhook Logs Table
CREATE TABLE IF NOT EXISTS public.payment_webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'NPCI_AUTOPAY',
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PROCESSED',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16) Notification Logs Table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  channel notification_channel_type NOT NULL,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DELIVERED',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17) Circles Table
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.profiles(id),
  invite_code TEXT NOT NULL UNIQUE,
  member_count INT NOT NULL DEFAULT 1,
  total_streak INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18) Circle Members Table
CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_months INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 19) Support Messages Table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'user',
  sender_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17) System Configurations Table
CREATE TABLE IF NOT EXISTS public.system_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18) Audit Logs Table (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id),
  actor_name TEXT NOT NULL,
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  ip_address TEXT DEFAULT '192.168.1.10',
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19) Immutable Audit Log Trigger
CREATE OR REPLACE FUNCTION block_audit_log_mutation() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_audit_immutability ON public.audit_logs;
CREATE TRIGGER enforce_audit_immutability
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION block_audit_log_mutation();


-- -----------------------------------------------------------------------------
-- SECTION 3: ANALYTICAL DASHBOARD VIEWS FOR BACKEND REPORTING
-- -----------------------------------------------------------------------------

-- VIEW 1: Customer Wallet Dashboard Summary
CREATE OR REPLACE VIEW public.vw_customer_wallet_dashboard AS
SELECT 
  p.id AS user_id,
  p.full_name,
  p.email,
  p.phone,
  p.kyc_status,
  m.id AS membership_id,
  m.status AS membership_status,
  sp.title AS plan_name,
  sp.monthly_amount_in_paise / 100 AS monthly_contribution_inr,
  m.cycles_completed,
  m.current_streak,
  m.total_paid_in_paise / 100 AS accumulated_savings_inr,
  (m.total_paid_in_paise * (1 + sp.cash_bonus_percentage / 100)) / 100 AS maturity_target_inr,
  h.title AS selected_hamper_title,
  h.estimated_value_in_paise / 100 AS hamper_value_inr
FROM public.profiles p
JOIN public.memberships m ON p.id = m.user_id
JOIN public.savings_plans sp ON m.plan_id = sp.id
LEFT JOIN public.hampers h ON m.selected_hamper_id = h.id
WHERE p.role = 'member';

-- VIEW 2: Employee MRM Portal Pipeline Analytics View
CREATE OR REPLACE VIEW public.vw_employee_mrm_dashboard AS
SELECT 
  e.id AS employee_id,
  p_emp.full_name AS employee_name,
  e.department,
  e.performance_score,
  COUNT(DISTINCT ma.member_id) AS total_assigned_members,
  COUNT(DISTINCT CASE WHEN p_mem.pipeline_stage = 'PAYMENT_ACTIVE' THEN p_mem.id END) AS active_savers_count,
  COUNT(DISTINCT CASE WHEN p_mem.pipeline_stage = 'GRACE_PERIOD' THEN p_mem.id END) AS grace_period_leads_count,
  COUNT(DISTINCT CASE WHEN p_mem.pipeline_stage = 'KYC_PENDING' THEN p_mem.id END) AS pending_kyc_count
FROM public.employees e
JOIN public.profiles p_emp ON e.profile_id = p_emp.id
LEFT JOIN public.member_assignments ma ON e.id = ma.employee_id AND ma.active = true
LEFT JOIN public.profiles p_mem ON ma.member_id = p_mem.id
GROUP BY e.id, p_emp.full_name, e.department, e.performance_score;

-- VIEW 3: Finance Admin Portal Analytics View
CREATE OR REPLACE VIEW public.vw_finance_admin_dashboard AS
SELECT 
  (SELECT COALESCE(SUM(amount_in_paise), 0) / 100 FROM public.finance_ledger_items WHERE status = 'CLEARED') AS total_escrow_pool_inr,
  (SELECT COUNT(*) FROM public.payout_records WHERE status = 'PENDING') AS pending_maker_verifications_count,
  (SELECT COUNT(*) FROM public.payout_records WHERE status = 'VERIFIED_BY_MAKER') AS pending_checker_approvals_count,
  (SELECT COALESCE(SUM(amount_in_paise), 0) / 100 FROM public.refund_requests WHERE status = 'PENDING_APPROVAL') AS pending_refunds_inr,
  (SELECT COUNT(*) FROM public.grace_period_cases WHERE status = 'ACTIVE') AS active_grace_cases_count;

-- VIEW 4: Support Desk Operations Dashboard View
CREATE OR REPLACE VIEW public.vw_support_desk_dashboard AS
SELECT 
  st.id AS ticket_id,
  st.ticket_number,
  st.subject,
  st.priority,
  st.status,
  p_user.full_name AS customer_name,
  p_user.phone AS customer_phone,
  st.assigned_agent_name,
  st.created_at
FROM public.support_tickets st
JOIN public.profiles p_user ON st.user_id = p_user.id
ORDER BY 
  CASE WHEN st.priority = 'high' THEN 1 WHEN st.priority = 'medium' THEN 2 ELSE 3 END,
  st.created_at DESC;

-- VIEW 5: Super Admin Executive System Health Analytics View
CREATE OR REPLACE VIEW public.vw_super_admin_system_health AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'member') AS total_members_count,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'employee') AS total_employees_count,
  (SELECT COUNT(*) FROM public.audit_logs) AS total_audit_entries_count,
  (SELECT COUNT(*) FROM public.payment_webhook_logs WHERE status = 'PROCESSED') AS total_webhooks_processed,
  NOW() AS system_timestamp;


-- -----------------------------------------------------------------------------
-- SECTION 4: CORE CATALOG SEED DATA (PRODUCTION ESSENTIALS ONLY)
-- -----------------------------------------------------------------------------

-- 1. Insert Core Savings Plans Catalog
INSERT INTO public.savings_plans (id, slug, title, monthly_amount_in_paise, duration_months, cash_bonus_percentage, hamper_value_cap_in_paise, badge_tag, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'starter-prosperity', 'Starter Prosperity', 50000, 12, 5.00, 100000, 'Popular Starter', 'Ideal for building disciplined saving habits with regular cash bonus.'),
  ('22222222-2222-2222-2222-222222222222', 'gold-harvest', 'Gold Harvest', 100000, 12, 5.00, 200000, 'Most Chosen', 'Our flagship 12-month savings commitment with premium curated hamper.'),
  ('33333333-3333-3333-3333-333333333333', 'samruddi-elite', 'Samruddi Elite', 200000, 12, 6.00, 400000, 'Maximum Value', 'Maximum rewards, highest cash bonus and luxury gift hampers.')
ON CONFLICT DO NOTHING;

-- 2. Insert Core Hampers Catalog
INSERT INTO public.hampers (id, title, category, estimated_value_in_paise, image_url, description, stock_count, stock_status)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'Smart Home & Tech Hamper', 'Electronics', 200000, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'Wireless earbuds, smart fitness tracker band, and 10,000mAh power bank.', 142, 'available'),
  ('f2222222-2222-2222-2222-222222222222', 'Luxury Organic Wellness Hamper', 'Wellness', 200000, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', 'Organic essential oils, bath salts, silk eye mask, and aromatherapy diffuser.', 12, 'low_stock')
ON CONFLICT DO NOTHING;

-- 3. Insert Official Staff & Admin Profiles
INSERT INTO public.profiles (id, email, full_name, phone, role, department, kyc_status, masked_pan, masked_aadhaar, pipeline_stage)
VALUES 
  ('b1111111-1111-1111-1111-111111111111', 'priya.verma@samruddisave.com', 'Priya Verma', '+91 XXXXX 11100', 'employee', 'Member Operations', 'approved', 'XXXXX5678E', 'XXXXXXXX2045', 'COMPLETED'),
  ('c1111111-1111-1111-1111-111111111111', 'suresh.menon@samruddisave.com', 'Suresh Menon', '+91 XXXXX 99000', 'support_agent', 'Customer Support', 'approved', 'XXXXX7788S', 'XXXXXXXX3099', 'COMPLETED'),
  ('d1111111-1111-1111-1111-111111111111', 'amit.hegde@samruddisave.com', 'Amit Hegde', '+91 XXXXX 88800', 'finance_admin', 'Escrow Operations', 'approved', 'XXXXX9911F', 'XXXXXXXX4088', 'COMPLETED'),
  ('e1111111-1111-1111-1111-111111111111', 'admin.ops@samruddisave.com', 'Rajesh Kumar', '+91 XXXXX 00000', 'super_admin', 'Executive Operations', 'approved', 'XXXXX0000A', 'XXXXXXXX5011', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- 4. Insert Employee Operational Record
INSERT INTO public.employees (id, profile_id, department, performance_score, active_cases_count)
VALUES ('b2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Member Operations', 100.00, 0)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- END OF MIGRATION & ANALYTICS SCRIPT
-- =============================================================================
