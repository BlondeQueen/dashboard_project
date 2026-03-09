import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

/**
 * React cache() deduplicates calls within the same request.
 * Both the layout and any page can call these without triggering
 * extra Supabase round-trips — the result is shared per request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
});
