// Supabase Client Integration Script (Phase 2 Backend Interface)

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => ({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key',
});

export type SupabaseDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string;
          role: 'member' | 'employee' | 'support_agent' | 'finance_admin' | 'super_admin';
          department: string | null;
          kyc_status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
      };
      payout_records: {
        Row: {
          id: string;
          user_id: string;
          amount_in_paise: number;
          verified_by_maker_id: string | null;
          checker_admin_id: string | null;
          status: 'PENDING' | 'VERIFIED_BY_MAKER' | 'APPROVED_BY_CHECKER' | 'DISBURSED';
          bank_transfer_ref: string | null;
          requested_at: string;
          disbursed_at: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          timestamp: string;
          actor_id: string;
          actor_name: string;
          actor_role: string;
          action: string;
          module: string;
          ip_address: string;
          details: string;
        };
      };
    };
  };
};
