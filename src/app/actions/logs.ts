"use server";

import { createClient } from "@/utils/supabase/server";
import { ActivityAction } from "@/types";

export async function addActivityLog(
  projectId: string,
  action: ActivityAction,
  detail?: string
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("activity_logs").insert({
    project_id: projectId,
    user_id: user?.id ?? null,
    action,
    detail: detail ?? null,
  });
}
