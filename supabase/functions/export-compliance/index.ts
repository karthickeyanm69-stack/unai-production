// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req: Request) => {
  try {
    const actorId = req.headers.get("x-user-id") || "00000000-0000-0000-0000-000000000000";

    const { data: logs } = await supabase.from("audit_logs").select("*").limit(500);

    let csvContent = "Timestamp,ActorID,ActorName,ActorRole,Action,Module,IPAddress,Details\n";

    for (const log of logs || []) {
      const row = `"${log.timestamp}","${log.actor_id}","${log.actor_name}","${log.actor_role}","${log.action}","${log.module}","${log.ip_address}","${log.details.replace(/"/g, '""')}"\n`;
      csvContent += row;
    }

    await supabase.from("audit_logs").insert({
      timestamp: new Date().toISOString(),
      actor_id: actorId,
      actor_name: "Compliance Audit Exporter",
      actor_role: "super_admin",
      action: "EXPORT_COMPLIANCE_CSV",
      module: "Compliance",
      ip_address: "127.0.0.1",
      details: `Generated compliance audit CSV export containing ${(logs || []).length} rows.`,
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="samruddisave_compliance_audit.csv"',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
