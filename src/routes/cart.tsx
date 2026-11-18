import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Smartphone,
  Lock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { cartTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import { CheckoutSteps } from "@/components/site/CheckoutSteps";
import { Button } from "@/components/ui/button";

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
  const user = useAuth();
  const navigate = useNavigate();
  const [coupon] = useState("");

  // Revalidate cart items against live catalog
  const items = cart
    .map((l) => ({ line: l, book: getBook(l.slug) }))
    .filter((entry): entry is { line: typeof entry.line; book: NonNullable<typeof entry.book> } => Boolean(entry.book));

  const totals = cartTotals(cart, coupon);

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      {/* Systematic 3-Step Flow Indicator */}
      {items.length > 0 && (
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 px-4 py-4 sm:px-6">
          <CheckoutSteps current={1} />
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Step 1 · Shopping Cart</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Your reading bag
            {items.length > 0 && (
              <span className="ml-2.5 text-xl font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? "ebook" : "ebooks"})
              </span>
            )}
          </h1>
        </div>

        {items.length > 0 && (
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore Mindixo's collection and add an ebook to begin checkout.
          </p>
          <Button asChild size="lg" className="mt-6 h-12 rounded-xl px-7 font-semibold shadow-glow">
            <Link to="/store" className="inline-flex items-center gap-2">
              Browse Ebooks <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Cart Item List */}
          <div className="space-y-4">
            {items.map(({ book }) => (
              <article
                key={book.slug}
                className="flex gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-border sm:p-5"
              >
                <Link
                  to="/book/$slug"
                  params={{ slug: book.slug }}
                  className="shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={`${book.title} cover`}
                      width={672}
                      height={992}
                      className="h-24 w-16 object-cover sm:h-28 sm:w-20"
                    />
                  ) : (
                    <div className="grid h-24 w-16 place-items-center sm:h-28 sm:w-20">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/book/$slug"
                        params={{ slug: book.slug }}
                        className="block truncate font-display text-lg font-semibold leading-snug hover:text-primary sm:text-xl"
                      >
                        {book.title}
                      </Link>
                      {book.author?.trim() && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">{book.author}</p>
                      )}
                    </div>
                    <p className="shrink-0 font-display text-lg font-bold text-foreground sm:text-xl">
                      {formatPrice(book.price)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {book.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground/80"
                        >
                          {fmt}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        <Zap className="h-3 w-3" /> Instant download
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(book.slug)}
                      aria-label={`Remove ${book.title}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Systematic Order Summary Sidebar */}
          <aside className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Ebooks ({totals.count})
                </span>
                <span className="font-medium text-foreground">{formatPrice(totals.subtotal)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>−{formatPrice(totals.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Digital delivery</span>
                <span className="font-medium text-primary">Instant · Free</span>
              </div>

              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-base font-semibold">Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                size="lg"
                onClick={() => navigate({ to: "/checkout", search: { coupon: coupon || undefined } })}
                className="h-12 w-full cursor-pointer rounded-xl text-base font-semibold shadow-glow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              {user ? (
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Signed in as {user.email}</span>
                </p>
              ) : (
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Next step: Sign in with Google for instant delivery</span>
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2.5 border-t border-border/70 pt-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 shrink-0 text-primary" />
                <span>Instant PDF/EPUB access right after checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-primary" />
                <span>Read smoothly on mobile, tablet, or desktop</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span>Secure checkout & email copy to your account</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
