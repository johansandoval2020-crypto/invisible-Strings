import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Client Components. Usa las claves públicas
 * (anon key) — nunca importar este archivo en un contexto server-only
 * que requiera la service role key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
