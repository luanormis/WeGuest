// WeGuest media publication endpoint.
// Deploy with Supabase CLI. Never expose SUPABASE_SERVICE_ROLE_KEY in browser code.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

async function copyBetweenBuckets(
  adminClient: ReturnType<typeof createClient>,
  sourceBucket: string,
  destinationBucket: string,
  path: string,
) {
  const { data: blob, error: downloadError } = await adminClient.storage
    .from(sourceBucket)
    .download(path);
  if (downloadError || !blob) {
    return { error: downloadError ?? new Error("source_object_not_found") };
  }

  const { error: uploadError } = await adminClient.storage
    .from(destinationBucket)
    .upload(path, blob, {
      contentType: blob.type || "application/octet-stream",
      upsert: false,
    });
  return { error: uploadError };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return response(405, { error: "method_not_allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
    return response(500, { error: "server_configuration_or_authorization_missing" });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) {
    return response(401, { error: "invalid_session" });
  }

  let body: { coupleId?: unknown; mediaId?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return response(400, { error: "invalid_json" });
  }

  const coupleId = typeof body.coupleId === "string" ? body.coupleId : "";
  const mediaId = typeof body.mediaId === "string" ? body.mediaId : "";
  const action = body.action;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(coupleId) || !uuidPattern.test(mediaId) ||
      (action !== "publish" && action !== "unpublish")) {
    return response(400, { error: "invalid_parameters" });
  }

  // This user-scoped query applies wg_media RLS and validates ownership/staff access.
  const { data: media, error: mediaError } = await userClient
    .from("wg_media")
    .select("id,couple_id,storage_bucket,storage_path,is_published,published_at")
    .eq("id", mediaId)
    .eq("couple_id", coupleId)
    .maybeSingle();

  if (mediaError || !media) {
    return response(404, { error: "media_not_found_or_not_authorized" });
  }

  // Storage paths must use <couple UUID>/<filename>.
  if (typeof media.storage_path !== "string" ||
      !media.storage_path.startsWith(coupleId + "/") ||
      media.storage_path.includes("..")) {
    return response(400, { error: "invalid_storage_path" });
  }

  const { data: couple, error: coupleError } = await userClient
    .from("wg_couples")
    .select("id,status")
    .eq("id", coupleId)
    .maybeSingle();

  if (coupleError || !couple) {
    return response(404, { error: "couple_not_found_or_not_authorized" });
  }

  const path = media.storage_path as string;

  if (action === "publish") {
    if (couple.status !== "published") {
      return response(409, { error: "publish_site_before_publishing_media" });
    }
    if (media.is_published === true && media.storage_bucket === "weguest-public") {
      return response(200, { ok: true, status: "already_published" });
    }
    if (media.storage_bucket !== "weguest-private" || media.is_published === true) {
      return response(409, { error: "media_state_conflict" });
    }

    const { error: copyError } = await copyBetweenBuckets(
      adminClient, "weguest-private", "weguest-public", path,
    );
    if (copyError) {
      return response(502, { error: "public_copy_failed", detail: copyError.message });
    }

    const { error: updateError } = await userClient
      .from("wg_media")
      .update({
        storage_bucket: "weguest-public",
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", mediaId)
      .eq("couple_id", coupleId);

    if (updateError) {
      await adminClient.storage.from("weguest-public").remove([path]);
      return response(500, { error: "publication_metadata_update_failed" });
    }
    return response(200, { ok: true, status: "published" });
  }

  if (media.is_published !== true || media.storage_bucket !== "weguest-public") {
    return response(200, { ok: true, status: "already_private" });
  }

  // Remove public copy first; the original private object is retained.
  const { error: removeError } = await adminClient.storage
    .from("weguest-public")
    .remove([path]);
  if (removeError) {
    return response(502, { error: "public_object_removal_failed", detail: removeError.message });
  }

  const { error: updateError } = await userClient
    .from("wg_media")
    .update({
      storage_bucket: "weguest-private",
      is_published: false,
      published_at: null,
    })
    .eq("id", mediaId)
    .eq("couple_id", coupleId);

  if (updateError) {
    // Best-effort compensation; metadata remains published if the update failed.
    await copyBetweenBuckets(adminClient, "weguest-private", "weguest-public", path);
    return response(500, { error: "unpublish_metadata_update_failed" });
  }

  return response(200, { ok: true, status: "unpublished" });
});
