// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  try {
    const { data: pendingPayouts, error } = await supabase
      .from("payout_records")
      .select("*")
      .eq("status", "APPROVED_BY_CHECKER");

    if (error) throw error;

    const batchResults = [];
    for (const payout of pendingPayouts || []) {
      const bankRef = `ESCROW_TRANSFER_${Date.now().toString().slice(-6)}`;

      await supabase
        .from("payout_records")
        .update({
          status: "DISBURSED",
          bank_transfer_ref: bankRef,
          disbursed_at: new Date().toISOString(),
        })
        .eq("id", payout.id);

      await supabase.from("finance_ledger_items").insert({
        txn_ref: `PAYOUT_DISBURSED_${payout.id}`,
        user_id: payout.user_id,
        amount_in_paise: payout.amount_in_paise,
        type: "MATURITY_PAYOUT",
        gateway_state: "SETTLED",
        status: "SETTLED",
        bank_escrow_ref: bankRef,
      });

      batchResults.push({ id: payout.id, bank_ref: bankRef, status: "DISBURSED" });
    }

    return new Response(
      JSON.stringify({ status: "success", count: batchResults.length, batch: batchResults }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
