import type { Tables } from "@/integrations/supabase/types";
export type Book = Tables<"products"> & { genre: string; blurb: string };
export type Category = Tables<"categories">;
export type Settings = Tables<"store_settings">;
