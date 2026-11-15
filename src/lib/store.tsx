import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Book, Category, Settings } from "@/data/books";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogOptions } from "./catalog";
import type { CartLine } from "./cart";

interface StoreCtx {
  books: Book[];
  categories: Category[];
  settings: Settings | null;
  getBook: (slug: string) => Book | undefined;
  cart: CartLine[];
  wishlist: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: { books, categories, settings } } = useSuspenseQuery(catalogOptions);
  const getBook = (slug: string) => books.find(b => b.slug === slug);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart((JSON.parse(localStorage.getItem("mx-cart-v2") || "[]") as CartLine[]).filter(l => books.some(b => b.slug === l.slug)));
      setWishlist(JSON.parse(localStorage.getItem("mx-wish-v2") || "[]"));
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("mx-cart-v2", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("mx-wish-v2", JSON.stringify(wishlist)); }, [wishlist, ready]);

  const add = (slug: string) => {
    const b = getBook(slug);
    if (!b) return;
    if (cart.some((l) => l.slug === slug)) { toast("Already in your cart"); return; }
    setCart((c) => [...c, { slug, price: b.price, qty: 1 }]);
    toast.success(`${b.title} added to cart`);
  };
  const remove = (slug: string) => setCart((c) => c.filter((l) => l.slug !== slug));
  const clear = () => setCart([]);
  const toggleWish = (slug: string) => {
    const has = wishlist.includes(slug);
    setWishlist((w) => (has ? w.filter((s) => s !== slug) : [...w, slug]));
    toast(has ? "Removed from wishlist" : "Saved to wishlist");
  };

  return <Ctx.Provider value={{ books, categories, settings, getBook, cart, wishlist, add, remove, clear, toggleWish }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
