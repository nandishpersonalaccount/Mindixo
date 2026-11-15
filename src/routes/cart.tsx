import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/site";
import { PageHero } from "@/components/site/PageHero";
import { Summary } from "@/components/site/Summary";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Mindixo" },
      { name: "description", content: "Review the ebooks in your Mindixo cart before checkout." },
      { property: "og:title", content: "Your Cart | Mindixo" },
      { property: "og:description", content: "Review your ebooks before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, remove, getBook } = useStore();
  const [coupon, setCoupon] = useState("");
  return (
    <>
      <PageHero eyebrow="Cart" title="Your reading pile." />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link to="/store" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-primary-foreground">Find a book</Link>
            </div>
          )}
          {cart.map((l) => {
            const b = getBook(l.slug);
            if (!b) return null;
            return (
              <div key={l.slug} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <img src={b.cover} alt="" width={672} height={992} className="h-24 w-16 rounded object-cover" />
                <div className="flex-1">
                  <Link to="/book/$slug" params={{ slug: b.slug }} className="font-display text-2xl hover:text-primary">{b.title}</Link>
                  <p className="text-sm text-muted-foreground">{b.author} · {b.formats.join(", ")}</p>
                </div>
                <p className="font-semibold">{formatPrice(b.price)}</p>
                <button onClick={() => remove(l.slug)} aria-label="Remove" className="rounded-full p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
        {cart.length > 0 && (
          <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-3xl">Summary</h2>
            <Summary coupon={coupon} />
            <Link to="/checkout" search={{ coupon: coupon || undefined }} className="block rounded-full bg-primary py-3 text-center font-medium text-primary-foreground shadow-glow">Checkout</Link>
          </aside>
        )}
      </div>
    </>
  );
}
