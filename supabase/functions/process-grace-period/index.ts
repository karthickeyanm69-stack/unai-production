// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (_req: Request) => {
  try {
    const todayISO = new Date().toISOString();

    const { data: expiredCases } = await supabase
      .from("grace_period_cases")
      .select("*")
      .eq("status", "ACTIVE")
      .lt("expires_at", todayISO);

    const expiredResults = [];

    for (const graceCase of expiredCases || []) {
      await supabase
        .from("grace_period_cases")
        .update({ status: "EXPIRED" })
        .eq("id", graceCase.id);

      await supabase
        .from("memberships")
        .update({ current_streak: 0, status: "DEFAULTED" })
        .eq("user_id", graceCase.user_id);

      await supabase.from("notification_queue").insert({
        user_id: graceCase.user_id,
        channel: "WHATSAPP",
        recipient: "+91 XXXXX 22233",
        message: "Grace period expired. Your monthly savings streak has been reset to 0.",
        status: "PENDING",
      });

      expiredResults.push({ case_id: graceCase.id, user_id: graceCase.user_id, status: "EXPIRED" });
    }

    return new Response(
      JSON.stringify({ status: "success", count: expiredResults.length, cases: expiredResults }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
