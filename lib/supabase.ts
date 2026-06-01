import { createClient } from "@supabase/supabase-js";

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");

/** Full access — only use for admin operations that require bypassing RLS */
export function createSupabaseServer() {
  return createClient(url(), process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** Anon access — respects RLS policies */
export function createSupabaseAnon() {
  return createClient(url(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
