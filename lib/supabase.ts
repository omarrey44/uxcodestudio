import { createClient } from "@supabase/supabase-js";

export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}
