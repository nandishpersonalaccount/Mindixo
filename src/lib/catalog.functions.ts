import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { books: [], categories: [], settings: null };
  const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key); return fetch(input, { ...init, headers });
  } } });
  const [products, categories, settings] = await Promise.all([db.from("products").select("*").eq("published", true).order("created_at", { ascending: false }), db.from("categories").select("*").order("position"), db.from("store_settings").select("*").eq("id", 1).maybeSingle()]);
  if (products.error || categories.error || settings.error) return { books: [], categories: [], settings: null };
  const books = await Promise.all((products.data ?? []).map(async (p) => {
    let cover = p.cover;
    if (cover && !cover.startsWith("https://")) {
      const signed = await db.storage.from("store-covers").createSignedUrl(cover, 3600);
      const browserUrl = import.meta.env["VITE_SUPABASE_URL"];
      cover = signed.data?.signedUrl.replace(url, browserUrl || url) ?? "";
    }
    return { ...p, cover, genre: categories.data?.find(c => c.id === p.category_id)?.name ?? "Uncategorised", blurb: p.description };
  }));
  return { books, categories: categories.data ?? [], settings: settings.data };
});
