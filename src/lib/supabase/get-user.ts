import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Deduplicated per request when layout and pages both need the session user. */
export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
