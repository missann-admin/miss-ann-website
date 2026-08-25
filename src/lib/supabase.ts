const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are configured. */
export const supabaseConfigured = Boolean(url && anonKey);

export type SupabaseInsertError = { code?: string; message: string };

/**
 * Inserts a single row via the Supabase PostgREST API directly. The site's
 * only two writes (contact form, email signup) don't need the full
 * @supabase/supabase-js SDK — that pulls in auth, realtime, storage, and
 * functions clients this site never uses, more than doubling the JS bundle.
 */
export async function supabaseInsert(
  table: string,
  row: Record<string, unknown>,
): Promise<{ error: SupabaseInsertError | null }> {
  if (!url || !anonKey) {
    return { error: { message: "Supabase is not configured" } };
  }
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(row),
  });
  if (response.ok) {
    return { error: null };
  }
  const body = await response.json().catch(() => ({}) as Record<string, unknown>);
  return {
    error: {
      code: typeof body.code === "string" ? body.code : undefined,
      message: typeof body.message === "string" ? body.message : response.statusText,
    },
  };
}
