import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Null until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are configured. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
