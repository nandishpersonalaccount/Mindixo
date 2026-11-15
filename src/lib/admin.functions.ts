import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { productSchema } from "./admin-rules";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

async function verifyAdmin(db: SupabaseClient<Database>, userId: string) {
  const { data, error } = await db.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Admin access has not been granted to this account.");
}

export const getAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const [products, categories, settings, files, ordersRes] = await Promise.all([
      context.supabase.from("products").select("*").order("created_at", { ascending: false }),
      context.supabase.from("categories").select("*").order("position"),
      context.supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
      context.supabase.from("product_files").select("*"),
      context.supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    if (products.error || categories.error || settings.error || files.error) {
      throw new Error("Could not load store management");
    }
    const orders = ordersRes.error ? [] : (ordersRes.data ?? []);
    return {
      products: products.data ?? [],
      categories: categories.data ?? [],
      settings: settings.data,
      files: files.data ?? [],
      orders,
    };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    const payload = { ...rest, ...(id ? { id } : {}) };
    let res = await context.supabase
      .from("products")
      .upsert(payload as any)
      .select()
      .single();
    if (res.error && res.error.message.includes("'mrp' column")) {
      const { mrp: _omit, ...withoutMrp } = payload;
      res = await context.supabase
        .from("products")
        .upsert(withoutMrp as any)
        .select()
        .single();
    }
    if (res.error) throw new Error("Could not save ebook. Check that the URL name is unique.");
    return res.data;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete ebook");
    return { ok: true };
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().trim().min(1).max(100),
        description: z.string().max(1000),
        position: z.number().int(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("categories")
      .upsert((({ id, ...rest }) => ({ ...rest, ...(id ? { id } : {}) }))(data));
    if (error) throw new Error("Could not save category. Its name must be unique.");
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete category");
    return { ok: true };
  });

const settingsSchema = z.object({
  id: z.literal(1),
  announcement: z.string().max(500),
  intro: z.string().max(1000),
  email: z.union([z.literal(""), z.string().email()]),
  phone: z.string().max(100),
  address: z.string().max(1000),
  about: z.string().max(50000),
  privacy: z.string().max(50000),
  terms: z.string().max(50000),
  refund: z.string().max(50000),
  cookies: z.string().max(50000),
  dmca: z.string().max(50000),
  delivery: z.string().max(50000),
});

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("store_settings").upsert(data);
    if (error) throw new Error("Could not save store settings");
    return { ok: true };
  });

export const recordFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        product_id: z.string().uuid(),
        path: z.string().min(1).max(2000),
        filename: z.string().min(1).max(255),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("product_files").insert(data);
    if (error) throw new Error("Could not attach ebook file");
    return { ok: true };
  });

export const deleteFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { data: file, error } = await context.supabase
      .from("product_files")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !file) throw new Error("File unavailable");
    const removed = await context.supabase.storage.from("ebook-files").remove([file.path]);
    if (removed.error) throw new Error("Could not remove file");
    const deleted = await context.supabase.from("product_files").delete().eq("id", data.id);
    if (deleted.error) throw new Error("Could not remove file record");
    return { ok: true };
  });

export const fileLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        path: z.string().min(1),
        bucket: z.enum(["store-covers", "ebook-files"]),
        filename: z.string().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    await verifyAdmin(context.supabase, context.userId);
    const { data: s, error } = await context.supabase.storage
      .from(data.bucket)
      .createSignedUrl(data.path, 600, data.filename ? { download: data.filename } : undefined);
    if (error || !s) throw new Error("Could not open file");
    const url = process.env["SUPABASE_URL"]!;
    const browser = import.meta.env["VITE_SUPABASE_URL"];
    return { url: s.signedUrl.replace(url, browser || url) };
  });
