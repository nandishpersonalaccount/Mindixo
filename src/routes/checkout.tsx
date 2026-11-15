import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, signOut } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { cartTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { GoogleSignInButton } from "@/components/site/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  CreditCard,
  Sparkles,
  Info,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): { coupon?: string | undefined } => ({
    coupon: typeof s["coupon"] === "string" ? s["coupon"] : undefined,
  }),
  head: () => pageMeta("Checkout", "Mindixo secure digital checkout."),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch();
  const user = useAuth();
  const { cart, getBook } = useStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");

  // Revalidate cart items against live catalog
  const items = cart
    .map((l) => ({ line: l, book: getBook(l.slug) }))
    .filter((entry): entry is { line: typeof entry.line; book: NonNullable<typeof entry.book> } => Boolean(entry.book));

  const totals = cartTotals(cart, search.coupon);

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Your reading cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          You don't have any ebooks in your cart yet. Explore our curated catalog to pick your next read.
        </p>
        <Link
          to="/store"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Store
        </Link>
      </div>
    );
  }

  // If not signed in: Prompt Google Sign-In
  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Main Auth Step */}
          <div className="space-y-6">
            <div>
              <p className="eyebrow">Checkout · Step 1 of 2</p>
              <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Sign in with Google to buy
              </h1>
              <p className="mt-3 text-muted-foreground">
                Sign in with your Google account to secure your purchase and receive instant digital delivery of your ebooks.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Fast 1-click Google authentication</span>
              </div>

              <div className="mt-6 space-y-4">
                <GoogleSignInButton redirectTo="/checkout">
                  Continue with Google to Buy
                </GoogleSignInButton>

                <p className="text-center text-xs text-muted-foreground">
                  Your purchased ebooks will be delivered to your Google account email.
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-start gap-3 text-xs text-muted-foreground">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    Your digital files (PDF, EPUB) and download receipts will be instantly accessible upon sign in and order completion.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Cart
              </Link>
            </div>
          </div>

          {/* Cart Sidebar Summary */}
          <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">
              Order Summary ({items.length} {items.length === 1 ? "ebook" : "ebooks"})
            </h2>
            <div className="divide-y divide-border/60">
              {items.map(({ book }) => (
                <div key={book.slug} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <img src={book.cover} alt="" className="h-16 w-11 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{book.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{book.formats.join(", ")}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(book.price)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>−{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totals.total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // When signed in: Ready to Buy!
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Reader";
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8">
        <p className="eyebrow">Checkout · Step 2 of 2</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          Review & Complete Purchase
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Account Card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userAvatar ? (
                  <img src={userAvatar} alt="" className="h-10 w-10 rounded-full border border-border object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {userName[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{userName}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      <CheckCircle2 className="h-3 w-3" /> Signed in
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Button>
            </div>

            <div className="mt-4 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>
                Your ebook files and download receipt will be delivered to <strong>{user.email}</strong>.
              </span>
            </div>
          </div>

          {/* Items Review */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Your Ebooks</h2>
            <div className="mt-4 divide-y divide-border/60">
              {items.map(({ book }) => (
                <div key={book.slug} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={book.cover} alt="" className="h-20 w-14 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-base">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <p className="mt-1 text-xs text-primary font-mono">{book.formats.join(" · ")}</p>
                  </div>
                  <p className="font-semibold text-base">{formatPrice(book.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Payment Method
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border hover:border-foreground/30 text-muted-foreground"
                }`}
              >
                <CreditCard className="h-5 w-5 mb-1" />
                <span className="text-xs">Cards / NetBanking</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border hover:border-foreground/30 text-muted-foreground"
                }`}
              >
                <Sparkles className="h-5 w-5 mb-1" />
                <span className="text-xs">UPI / QR Code</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2">
              <Lock className="h-3.5 w-3.5 text-primary" /> 256-bit encrypted checkout. Instant digital delivery.
            </p>
          </div>
        </div>

        {/* Aside Summary & Buy Button */}
        <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold">Summary</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Items ({items.length})</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Discount</span>
                <span>−{formatPrice(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Digital delivery</span>
              <span className="text-primary font-medium">Free</span>
            </div>
            <div className="flex justify-between border-t border-border pt-4 text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totals.total)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full text-base font-semibold shadow-glow h-12 cursor-pointer"
            onClick={() => setPaymentModalOpen(true)}
          >
            Pay {formatPrice(totals.total)} & Buy
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By purchasing, you agree to Mindixo's Terms of Service and Refund Policy.
          </p>
        </aside>
      </div>

      {/* Payment Gateway Modal / Status */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Order & Payment Confirmation</DialogTitle>
            <DialogDescription>
              Authenticated customer: <strong className="text-foreground">{user.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/90 space-y-2">
              <div className="flex items-center gap-2 font-medium text-primary">
                <Info className="h-4 w-4" /> Ready for Live Payment Gateway
              </div>
              <p>
                Your Google authentication is verified and your order for <strong>{items.length} {items.length === 1 ? "ebook" : "ebooks"} ({formatPrice(totals.total)})</strong> is confirmed.
              </p>
              <p className="text-muted-foreground">
                To process live credit card/UPI transactions and automatic file delivery, connect your preferred merchant gateway (e.g. <strong>Razorpay</strong> or <strong>Stripe</strong>).
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
