import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthState, signOut } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { cartTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { GoogleSignInButton } from "@/components/site/GoogleSignInButton";
import { CheckoutSteps } from "@/components/site/CheckoutSteps";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Check,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Landmark,
  Zap,
  Info,
  LogOut,
  BookOpen,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): { coupon?: string | undefined } => ({
    coupon: typeof s["coupon"] === "string" ? s["coupon"] : undefined,
  }),
  head: () => pageMeta("Checkout", "Mindixo secure digital ebook checkout."),
  component: CheckoutPage,
});

type PaymentMethod = "upi" | "card" | "netbanking";

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  badge?: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "upi",
    title: "UPI / QR Code",
    subtitle: "Google Pay, PhonePe, Paytm, BHIM",
    badge: "Recommended",
    icon: Smartphone,
  },
  {
    id: "card",
    title: "Credit or Debit Card",
    subtitle: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    title: "NetBanking & Wallets",
    subtitle: "All major banks supported",
    icon: Landmark,
  },
];

function CheckoutPage() {
  const search = Route.useSearch();
  const { user, loading: authLoading } = useAuthState();
  const { cart, getBook } = useStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  // Revalidate cart items against live catalog
  const items = cart
    .map((l) => ({ line: l, book: getBook(l.slug) }))
    .filter((entry): entry is { line: typeof entry.line; book: NonNullable<typeof entry.book> } => Boolean(entry.book));

  const totals = cartTotals(cart, search.coupon);

  // Empty cart state
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <BookOpen className="h-7 w-7" />
          </div>
          <p className="eyebrow mt-5">Checkout</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Add an ebook from the store first, then come back here for instant digital checkout.
          </p>
          <Button asChild size="lg" className="mt-7 h-12 rounded-xl px-7 font-semibold shadow-glow">
            <Link to="/store" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Explore Ebooks
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const activeStep = user ? 3 : 2;
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Reader";
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const selectedPayment = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod) ?? PAYMENT_OPTIONS[0];

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      {/* Systematic 3-Step Flow Indicator */}
      <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 px-4 py-4 sm:px-6">
        <CheckoutSteps current={activeStep} />
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            {user ? "Step 3 · Complete Purchase" : "Step 2 · Sign In to Continue"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {user ? "Confirm & unlock your ebook" : "Sign in to buy your ebook"}
          </h1>
        </div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Edit cart
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Left Column: Systematic Guided Steps */}
        <div className="space-y-4">
          {/* STEP 1: Completed Cart Summary Strip */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">1. Ebooks Selected</p>
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "ebook" : "ebooks"} · {formatPrice(totals.total)}
                </p>
              </div>
            </div>
            <Link
              to="/cart"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Change
            </Link>
          </div>

          {/* STEP 2: Account / Google Sign-In */}
          {authLoading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Checking your account session…</span>
            </div>
          ) : !user ? (
            <div className="rounded-2xl border-2 border-primary/50 bg-card p-6 shadow-glow sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/50">
                  2
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Sign in with Google</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your ebook download link and receipt will be tied safely to your Google account.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <GoogleSignInButton redirectTo="/checkout">
                  Continue with Google
                </GoogleSignInButton>
              </div>

              <div className="mt-5 grid gap-2.5 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Sent straight to Gmail</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>1-click, no password</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Verified buyer account</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {userName[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="h-8 cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" /> Switch account
                </Button>
              </div>

              <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">
                  Ebook delivery & receipt email: <strong className="text-foreground">{user.email}</strong>
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Instant Download */}
          {!user ? (
            <div className="rounded-2xl border border-border/50 bg-card/30 px-5 py-4 opacity-60">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-muted-foreground">
                  3
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">3. Payment & Instant Download</p>
                  <p className="text-xs text-muted-foreground">
                    Sign in with Google above to unlock UPI, Cards, and NetBanking.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-primary/50 bg-card p-6 shadow-glow sm:p-7">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/50">
                  3
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Choose Payment Method</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select how you'd like to pay. Your ebook unlocks immediately after payment.
                  </p>
                </div>
              </div>

              <div role="radiogroup" aria-label="Payment method" className="mt-5 space-y-2.5">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background/40 hover:border-foreground/25"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{opt.title}</span>
                            {opt.badge && (
                              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{opt.subtitle}</p>
                        </div>
                      </div>

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {selected && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  size="lg"
                  className="h-13 w-full cursor-pointer rounded-xl text-base font-semibold shadow-glow"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    Pay {formatPrice(totals.total)} & Unlock {items.length === 1 ? "Ebook" : "Ebooks"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>256-bit SSL encrypted · Instant PDF/EPUB download</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="rounded-2xl border border-border/80 bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">
            Order Summary ({items.length} {items.length === 1 ? "ebook" : "ebooks"})
          </h2>

          <div className="mt-4 divide-y divide-border/60">
            {items.map(({ book }) => (
              <div key={book.slug} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                <div className="shrink-0 overflow-hidden rounded-md bg-muted">
                  {book.cover ? (
                    <img src={book.cover} alt="" className="h-16 w-11 object-cover" />
                  ) : (
                    <div className="grid h-16 w-11 place-items-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{book.title}</p>
                  {book.author?.trim() && (
                    <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1">
                    {book.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">{formatPrice(book.price)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
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
            <div className="flex items-baseline justify-between border-t border-border pt-3.5">
              <span className="text-base font-semibold">Total payable</span>
              <span className="font-display text-2xl font-bold text-primary">
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-border/60 bg-background/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">What you'll receive:</p>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Direct download in {Array.from(new Set(items.flatMap((i) => i.book.formats))).join(", ")} format</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Backup copy sent to your Google email</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>Read on phone, tablet, Kindle & laptop</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Payment Gateway Notice Dialog (honest, never simulates checkout success) */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Payment Gateway Not Connected Yet</DialogTitle>
            <DialogDescription>
              Signed in as <strong className="text-foreground">{user?.email}</strong> · {selectedPayment.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs text-foreground/90">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Info className="h-4 w-4 shrink-0" /> Ready for Live Payments ({formatPrice(totals.total)})
              </div>
              <p>
                Your account is verified and your order for{" "}
                <strong>
                  {items.length} {items.length === 1 ? "ebook" : "ebooks"}
                </strong>{" "}
                is ready, but live payment processing has not been connected yet. <strong>No payment was taken.</strong>
              </p>
              <p className="text-muted-foreground">
                Connect a payment gateway (such as <strong>Razorpay</strong> for UPI/Cards or <strong>Stripe</strong>)
                to process real transactions and unlock automatic ebook downloads.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
