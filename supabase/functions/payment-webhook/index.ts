// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const WEBHOOK_SECRET = Deno.env.get("PAYMENT_WEBHOOK_SECRET") || "test_secret_key";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const signature = req.headers.get("x-razorpay-signature") || req.headers.get("x-phonepe-signature");
    const bodyText = await req.text();

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature && signature !== computedSignature && Deno.env.get("DENO_ENV") === "production") {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;

    const { data: existingLog } = await supabase
      .from("payment_webhook_logs")
      .select("id, status")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingLog) {
      return new Response(
        JSON.stringify({ message: "Webhook event already processed (Idempotent bypass)", event_id: eventId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const payloadHash = computedSignature;
    await supabase.from("payment_webhook_logs").insert({
      event_id: eventId,
      status: "PROCESSING",
      payload_hash: payloadHash,
    });

    const txnRef = payload.payload?.payment?.entity?.id || `GATEWAY_${Date.now()}`;
    const amountInPaise = payload.payload?.payment?.entity?.amount || 100000;
    const userId = payload.payload?.payment?.entity?.notes?.user_id;

    if (userId) {
      await supabase.from("contributions").insert({
        membership_id: payload.payload?.payment?.entity?.notes?.membership_id,
        user_id: userId,
        amount_in_paise: amountInPaise,
        due_date: new Date().toISOString().split("T")[0],
        paid_date: new Date().toISOString().split("T")[0],
        cycle_number: payload.payload?.payment?.entity?.notes?.cycle_number || 1,
        status: "paid",
        payment_gateway_ref: txnRef,
      });

      await supabase.from("finance_ledger_items").insert({
        txn_ref: txnRef,
        user_id: userId,
        amount_in_paise: amountInPaise,
        type: "MONTHLY_DEBIT",
        gateway_state: "SETTLED",
        status: "SETTLED",
        bank_escrow_ref: `ESCROW_AXIS_${Date.now().toString().slice(-6)}`,
      });
    }

    await supabase
      .from("payment_webhook_logs")
      .update({ status: "PROCESSED", processed_at: new Date().toISOString() })
      .eq("event_id", eventId);

    return new Response(
      JSON.stringify({ status: "success", event_id: eventId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
