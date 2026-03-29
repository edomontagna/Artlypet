import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REQUIRED_ENV_VARS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "CLEANUP_SECRET"];
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !Deno.env.get(v));
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const BATCH_LIMIT = 100;

serve(async (req) => {
  if (missingEnvVars.length > 0) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Authenticate via shared secret (cron or manual trigger)
  const cleanupSecret = req.headers.get("x-cleanup-secret");
  if (cleanupSecret !== Deno.env.get("CLEANUP_SECRET")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Step 1: Find expired image_originals (limit per run to avoid timeouts)
    const { data: expiredOriginals, error: fetchErr } = await supabase
      .from("image_originals")
      .select("id, storage_path")
      .lt("expires_at", new Date().toISOString())
      .limit(BATCH_LIMIT);

    if (fetchErr) {
      console.error("Error fetching expired originals:", fetchErr.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch expired originals" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!expiredOriginals || expiredOriginals.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expired images to clean up", deleted: { originals: 0, generated: 0, files: 0 } }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    const originalIds = expiredOriginals.map((o) => o.id);
    const originalPaths = expiredOriginals
      .map((o) => o.storage_path)
      .filter(Boolean) as string[];

    // Step 2: Find generated_images linked to expired originals
    const { data: linkedGenerated, error: genFetchErr } = await supabase
      .from("generated_images")
      .select("id, storage_path, watermarked_path")
      .in("original_id", originalIds);

    if (genFetchErr) {
      console.error("Error fetching linked generated images:", genFetchErr.message);
    }

    const generatedPaths = (linkedGenerated || [])
      .map((g) => g.storage_path)
      .filter(Boolean) as string[];
    const watermarkedPaths = (linkedGenerated || [])
      .map((g) => g.watermarked_path)
      .filter(Boolean) as string[];
    const generatedIds = (linkedGenerated || []).map((g) => g.id);

    // Step 3: Delete files from storage buckets (continue on individual failures)
    let filesDeleted = 0;

    if (originalPaths.length > 0) {
      const { error: storageErr } = await supabase.storage
        .from("pet-originals")
        .remove(originalPaths);
      if (storageErr) {
        console.error("Error deleting pet-originals files:", storageErr.message);
      } else {
        filesDeleted += originalPaths.length;
      }
    }

    if (generatedPaths.length > 0) {
      const { error: storageErr } = await supabase.storage
        .from("generated-images")
        .remove(generatedPaths);
      if (storageErr) {
        console.error("Error deleting generated-images files:", storageErr.message);
      } else {
        filesDeleted += generatedPaths.length;
      }
    }

    if (watermarkedPaths.length > 0) {
      const { error: storageErr } = await supabase.storage
        .from("watermarked-images")
        .remove(watermarkedPaths);
      if (storageErr) {
        console.error("Error deleting watermarked-images files:", storageErr.message);
      } else {
        filesDeleted += watermarkedPaths.length;
      }
    }

    // Step 4: Delete generated_images records
    let generatedDeleted = 0;
    if (generatedIds.length > 0) {
      const { error: genDelErr } = await supabase
        .from("generated_images")
        .delete()
        .in("id", generatedIds);
      if (genDelErr) {
        console.error("Error deleting generated_images records:", genDelErr.message);
      } else {
        generatedDeleted = generatedIds.length;
      }
    }

    // Step 5: Delete image_originals records
    const { error: origDelErr } = await supabase
      .from("image_originals")
      .delete()
      .in("id", originalIds);
    if (origDelErr) {
      console.error("Error deleting image_originals records:", origDelErr.message);
    }
    const originalsDeleted = origDelErr ? 0 : originalIds.length;

    // Step 6: Log cleanup stats to audit_log
    const stats = {
      originals_deleted: originalsDeleted,
      generated_deleted: generatedDeleted,
      files_deleted: filesDeleted,
      original_paths: originalPaths.length,
      generated_paths: generatedPaths.length,
      watermarked_paths: watermarkedPaths.length,
    };

    const { error: auditErr } = await supabase
      .from("audit_log")
      .insert({
        user_id: null,
        event_type: "expired_images_cleanup",
        metadata: {
          ...stats,
          cleaned_at: new Date().toISOString(),
        },
      });
    if (auditErr) console.error("Error writing audit log:", auditErr.message);

    console.log("Cleanup completed:", stats);

    return new Response(
      JSON.stringify({
        success: true,
        deleted: {
          originals: originalsDeleted,
          generated: generatedDeleted,
          files: filesDeleted,
        },
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("cleanup-expired error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
