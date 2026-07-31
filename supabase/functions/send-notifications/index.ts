// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (_req: Request) => {
  try {
    const { data: queueItems } = await supabase
      .from("notification_queue")
      .select("*")
      .in("status", ["PENDING", "RETRY"])
      .lte("attempts", 3);

    const processed = [];

    for (const item of queueItems || []) {
      const newAttempts = item.attempts + 1;

      if (newAttempts > 3) {
        await supabase
          .from("notification_queue")
          .update({ status: "DLQ", attempts: newAttempts })
          .eq("id", item.id);

        processed.push({ id: item.id, status: "DLQ" });
      } else {
        await supabase.from("notification_logs").insert({
          user_id: item.user_id,
          channel: item.channel,
          recipient: item.recipient,
          message: item.message,
          status: "DELIVERED",
          sent_at: new Date().toISOString(),
        });

        await supabase.from("notification_queue").delete().eq("id", item.id);
        processed.push({ id: item.id, status: "DELIVERED" });
      }
    }

    return new Response(
      JSON.stringify({ status: "success", count: processed.length, items: processed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
