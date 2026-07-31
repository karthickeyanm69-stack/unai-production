# 🏗️ SamruddiSave — Technical System Architecture

> **Stack**: React 18, TypeScript, TailwindCSS, Supabase PostgreSQL, Vite  
> **State Engine**: Centralized Reactive `StateStore` with `localStorage` persistence  

---

## 💻 Tech Stack Summary

- **Frontend Core**: React 18 with TypeScript strict typing (`tsc -b`).
- **Styling & Aesthetics**: Vanilla CSS design system + TailwindCSS + Sora & Inter Google Fonts.
- **Database & Auth**: Supabase PostgreSQL + RLS + NPCI AutoPay Webhook edge functions.
- **State Management**: Centralized `StateStore` (`store.ts`) with pub-sub pattern and continuous `localStorage` persistence.

---

## 🗄️ Database Schema & Entities

```
+-------------------+       +-------------------+       +-----------------------+
|     profiles      |       |    memberships    |       |  contribution_records |
+-------------------+       +-------------------+       +-----------------------+
| id (UUID)         |<----->| id (UUID)         |<----->| id (UUID)             |
| full_name         |       | user_id (UUID)    |       | user_id (UUID)        |
| email             |       | plan_id           |       | amount                |
| role              |       | monthly_amount    |       | status (PAID/MISSING) |
| kyc_status        |       | current_streak    |       | cycle_number (1..12)  |
| pipeline_stage    |       | bonus_amount      |       | transaction_ref       |
+-------------------+       +-------------------+       +-----------------------+
```

---

## 🔒 Security & Compliance Safeguards

1. **KYC Compliance Lock Guard**: Members cannot access deposit or AutoPay screens until an MRM Officer approves their PAN/Aadhaar OCR submission.
2. **Maker-Checker Disbursal Control**: Prevents single-operator disbursal fraud. Payouts require both MRM Officer (MAKER) verification and Finance Escrow Admin (CHECKER) disbursal.
3. **256-Bit Encrypted Audit Trails**: Every state mutation (logins, persona switches, KYC approvals, disbursals) is logged with timestamps and user IDs.
