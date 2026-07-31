-- =============================================================================
-- SamruddiSave Production Supabase PostgreSQL Self-Contained Seed Script
-- Paste and Run in Supabase SQL Editor (https://app.supabase.com -> SQL Editor)
-- Guarantees schema compatibility & inserts clean mock data
-- =============================================================================

-- 0. Enable UUID Extensions & Ensure All Optional Tables / Columns Exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure category column exists in support_tickets table
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'support_tickets') THEN
    ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'payment';
  END IF;
END $$;

-- Ensure Circles Table Exists
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.profiles(id),
  invite_code TEXT NOT NULL UNIQUE,
  member_count INT NOT NULL DEFAULT 1,
  total_streak INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure Circle Members Table Exists
CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak_months INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active'
);

-- Ensure Support Messages Table Exists
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'user',
  sender_name TEXT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Insert Core Savings Plans Catalog
INSERT INTO public.savings_plans (id, slug, title, monthly_amount_in_paise, duration_months, cash_bonus_percentage, hamper_value_cap_in_paise, badge_tag, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'starter-prosperity', 'Starter Prosperity', 50000, 12, 5.00, 100000, 'Popular Starter', 'Ideal for building disciplined saving habits with regular cash bonus.'),
  ('22222222-2222-2222-2222-222222222222', 'gold-harvest', 'Gold Harvest', 100000, 12, 5.00, 200000, 'Most Chosen', 'Our flagship 12-month savings commitment with premium curated hamper.'),
  ('33333333-3333-3333-3333-333333333333', 'samruddi-elite', 'Samruddi Elite', 200000, 12, 6.00, 400000, 'Maximum Value', 'Maximum rewards, highest cash bonus and luxury gift hampers.')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Curated Gift Hampers Catalog
INSERT INTO public.hampers (id, title, category, estimated_value_in_paise, image_url, description, stock_count, stock_status)
VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'Smart Home & Tech Hamper', 'Electronics', 200000, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', 'Wireless earbuds, smart fitness tracker band, and 10,000mAh power bank.', 142, 'available'),
  ('f2222222-2222-2222-2222-222222222222', 'Luxury Organic Wellness Hamper', 'Wellness', 200000, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600', 'Organic essential oils, bath salts, silk eye mask, and aromatherapy diffuser.', 12, 'low_stock'),
  ('f3333333-3333-3333-3333-333333333333', 'Artisan Festive Fashion Box', 'Fashion', 200000, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600', 'Handcrafted silk stole, luxury wrist watch, and designer leather accessory set.', 65, 'available')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Profiles (Members & Staff Team)
INSERT INTO public.profiles (id, email, full_name, phone, role, department, kyc_status, masked_pan, masked_aadhaar, pipeline_stage)
VALUES 
  ('a0000000-0000-0000-0000-000000000000', 'karthik@example.com', 'Karthik (karthicMK123)', '+91 90422 85132', 'member', NULL, 'approved', 'KARTH1234K', '904228513200', 'PAYMENT_ACTIVE'),
  ('a1111111-1111-1111-1111-111111111111', 'ananya.sharma@example.com', 'Ananya Sharma', '+91 98765 43210', 'member', NULL, 'approved', 'ABCDE1234F', '987654321098', 'PAYMENT_ACTIVE'),
  ('a2222222-2222-2222-2222-222222222222', 'rohit.kulkarni@example.com', 'Rohit Kulkarni', '+91 98123 99887', 'member', NULL, 'pending', 'FGHIJ5678K', '876543210987', 'KYC_PENDING'),
  ('a3333333-3333-3333-3333-333333333333', 'meera.nair@example.com', 'Meera Nair', '+91 97654 33211', 'member', NULL, 'approved', 'LMNOP9012Q', '765432109876', 'PAYMENT_ACTIVE'),
  ('b1111111-1111-1111-1111-111111111111', 'priya.verma@samruddisave.com', 'Priya Verma', '+91 98765 11100', 'employee', 'Member Operations', 'approved', 'XXXXX5678E', 'XXXXXXXX2045', 'COMPLETED'),
  ('c1111111-1111-1111-1111-111111111111', 'support.agent@samruddisave.com', 'Amit Hegde', '+91 98765 22200', 'support_agent', 'Customer Support', 'approved', 'XXXXX7788S', 'XXXXXXXX3099', 'COMPLETED'),
  ('d1111111-1111-1111-1111-111111111111', 'finance.admin@samruddisave.com', 'Vikram Joshi', '+91 98765 33300', 'finance_admin', 'Escrow Operations', 'approved', 'XXXXX9911F', 'XXXXXXXX4088', 'COMPLETED'),
  ('e1111111-1111-1111-1111-111111111111', 'rajesh.admin@samruddisave.com', 'Rajesh Sharma', '+91 98765 44400', 'super_admin', 'Executive Operations', 'approved', 'XXXXX0000A', 'XXXXXXXX5011', 'COMPLETED')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Active Customer Savings Memberships
INSERT INTO public.memberships (id, user_id, plan_id, status, selected_hamper_id, total_paid_in_paise, cycles_completed, current_streak, start_date)
VALUES 
  ('d1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'ACTIVE_SAVER', 'f1111111-1111-1111-1111-111111111111', 200000, 2, 8, '2026-01-05'),
  ('d2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'ACTIVE_SAVER', 'f1111111-1111-1111-1111-111111111111', 200000, 2, 7, '2026-01-05')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Monthly Contributions Ledger Records
INSERT INTO public.contributions (id, membership_id, user_id, cycle_number, due_date, paid_date, amount_in_paise, status, payment_gateway_ref)
VALUES 
  ('c1111111-0001-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000000', 1, '2026-01-05', '2026-01-05', 100000, 'paid', 'NPCI_UPI_8922'),
  ('c1111111-0002-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000000', 2, '2026-02-05', '2026-02-05', 100000, 'paid', 'NPCI_UPI_8944'),
  ('c1111111-0003-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000000', 3, '2026-03-05', NULL, 100000, 'pending', NULL)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Savings Circles & Group Members
INSERT INTO public.circles (id, name, creator_id, invite_code, member_count, total_streak)
VALUES 
  ('e0000000-0000-0000-0000-000000000001', 'Diwali Gold Savings Goal 2026', 'a0000000-0000-0000-0000-000000000000', 'SAVEDIWALI26', 4, 23)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.circle_members (id, circle_id, user_id, streak_months, status)
VALUES 
  ('e0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000000', 8, 'active'),
  ('e0000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 7, 'active'),
  ('e0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000001', 'a2222222-2222-2222-2222-222222222222', 6, 'active')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Support Desk Tickets & Messages
INSERT INTO public.support_tickets (id, ticket_number, user_id, user_name, subject, category, priority, status, assigned_agent_name)
VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'TCK-8901', 'a0000000-0000-0000-0000-000000000000', 'Karthik', 'UPI AutoPay Mandate Failed - 5 Day Grace Period Query', 'payment', 'high', 'in_progress', 'Amit Hegde')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.support_messages (id, ticket_id, sender_type, sender_name, message_text)
VALUES 
  ('e2222222-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'user', 'Karthik', 'Hi Support, my Google Pay AutoPay mandate failed this morning due to bank server downtime. Will I lose my savings streak or pay any penalty?'),
  ('e2222222-1111-1111-1111-111111111112', 'e1111111-1111-1111-1111-111111111111', 'agent', 'Amit Hegde', 'Hello Karthik! Do not worry. SamruddiSave provides a zero-penalty 5-Day Grace Window. You can retry payment via manual UPI before Aug 4 without breaking your streak.')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Notification Logs
INSERT INTO public.notification_logs (id, user_id, channel, recipient, message, status)
VALUES 
  ('e3333333-1111-1111-1111-111111111111', 'a0000000-0000-0000-0000-000000000000', 'WHATSAPP', '+91 90422 85132', 'SamruddiSave Support Ticket #TCK-8901 Reply from Amit Hegde: "Hello Karthik! Do not worry. SamruddiSave provides a zero-penalty 5-Day Grace Window."', 'DELIVERED')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Immutable Audit Logs
INSERT INTO public.audit_logs (id, actor_name, actor_role, action, module, details)
VALUES 
  ('e4444444-1111-1111-1111-111111111111', 'Karthik', 'member', 'USER_REGISTRATION', 'Auth', 'Registered new wallet account with phone +91 90422 85132'),
  ('e4444444-1111-1111-1111-111111111112', 'Amit Hegde', 'support_agent', 'SUPPORT_AGENT_REPLY', 'Support Desk', 'Agent Amit Hegde replied to ticket TCK-8901 and dispatched WhatsApp notification to +91 90422 85132')
ON CONFLICT (id) DO NOTHING;

-- Verification Query to check full dataset count across tables
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS profiles_count,
  (SELECT COUNT(*) FROM public.savings_plans) AS plans_count,
  (SELECT COUNT(*) FROM public.hampers) AS hampers_count,
  (SELECT COUNT(*) FROM public.memberships) AS memberships_count,
  (SELECT COUNT(*) FROM public.contributions) AS contributions_count,
  (SELECT COUNT(*) FROM public.circles) AS circles_count,
  (SELECT COUNT(*) FROM public.support_tickets) AS support_tickets_count,
  (SELECT COUNT(*) FROM public.notification_logs) AS notification_logs_count,
  (SELECT COUNT(*) FROM public.audit_logs) AS audit_logs_count;
