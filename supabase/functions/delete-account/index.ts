import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ALLOWED_ORIGIN"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGIN") || "http://localhost:8080").split(",").map(o => o.trim()).filter(Boolean);

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (missingEnvVars.length > 0) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    // Authenticate the user via JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const userId = user.id;

    // Service role client for privileged operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Delete print_orders
    const { error: printErr } = await supabase
      .from("print_orders")
      .delete()
      .eq("user_id", userId);
    if (printErr) console.error("Error deleting print_orders:", printErr.message);

    // 2. Delete credit_transactions
    const { error: creditErr } = await supabase
      .from("credit_transactions")
      .delete()
      .eq("user_id", userId);
    if (creditErr) console.error("Error deleting credit_transactions:", creditErr.message);

    // 3. Collect storage paths from generated_images before deleting rows
    const { data: generatedImages } = await supabase
      .from("generated_images")
      .select("storage_path, watermarked_path")
      .eq("user_id", userId);

    // 4. Delete generated_images rows
    const { error: genErr } = await supabase
      .from("generated_images")
      .delete()
      .eq("user_id", userId);
    if (genErr) console.error("Error deleting generated_images:", genErr.message);

    // 5. Collect storage paths from image_originals before deleting rows
    const { data: originals } = await supabase
      .from("image_originals")
      .select("storage_path")
      .eq("user_id", userId);

    // 6. Delete image_originals rows
    const { error: origErr } = await supabase
      .from("image_originals")
      .delete()
      .eq("user_id", userId);
    if (origErr) console.error("Error deleting image_originals:", origErr.message);

    // 7. Delete profile
    const { error: profileErr } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (profileErr) console.error("Error deleting profile:", profileErr.message);

    // 8. Delete storage files
    const generatedPaths = (generatedImages || [])
      .map((g) => g.storage_path)
      .filter(Boolean) as string[];
    const watermarkedPaths = (generatedImages || [])
      .map((g) => g.watermarked_path)
      .filter(Boolean) as string[];
    const originalPaths = (originals || [])
      .map((o) => o.storage_path)
      .filter(Boolean) as string[];

    if (generatedPaths.length > 0) {
      const { error: storageErr } = await supabase.storage.from("generated-images").remove(generatedPaths);
      if (storageErr) console.error("Error deleting generated-images files:", storageErr.message);
    }
    if (watermarkedPaths.length > 0) {
      const { error: storageErr } = await supabase.storage.from("watermarked-images").remove(watermarkedPaths);
      if (storageErr) console.error("Error deleting watermarked-images files:", storageErr.message);
    }
    if (originalPaths.length > 0) {
      const { error: storageErr } = await supabase.storage.from("pet-originals").remove(originalPaths);
      if (storageErr) console.error("Error deleting pet-originals files:", storageErr.message);
    }

    // 9. Delete auth user
    const { error: deleteUserErr } = await supabase.auth.admin.deleteUser(userId);
    if (deleteUserErr) {
      console.error("Error deleting auth user:", deleteUserErr.message);
      return new Response(
        JSON.stringify({ error: "Failed to delete auth user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 10. Log to audit_log (after user deletion, using service role)
    const { error: auditErr } = await supabase
      .from("audit_log")
      .insert({
        user_id: userId,
        event_type: "account_deleted",
        metadata: {
          deleted_at: new Date().toISOString(),
          deleted_records: {
            generated_images: generatedPaths.length,
            watermarked_images: watermarkedPaths.length,
            originals: originalPaths.length,
          },
        },
      });
    if (auditErr) console.error("Error writing audit log:", auditErr.message);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("delete-account error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
