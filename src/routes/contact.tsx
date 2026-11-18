import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Clock, FileText, ShieldCheck, Truck, HelpCircle, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { pageMeta } from "@/lib/meta";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact Us", "Get in touch with Mindixo support for ebook orders, delivery, or questions."),
  component: Contact,
});

function Contact() {
  const { settings: s } = useStore();
  const hasContact = Boolean(s?.email || s?.phone || s?.address);

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">Get in touch</p>
      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Contact Mindixo</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Have a question about an ebook, digital delivery, refunds, or your account? Reach out directly by email or phone — we respond promptly during support hours.
      </p>

      {hasContact ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {s?.email && (
            <a
              href={`mailto:${s.email}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow"
            >
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Support</p>
                <p className="mt-1.5 break-all font-display text-lg font-semibold text-foreground group-hover:text-primary">
                  {s.email}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Best for order assistance, refund requests, and copyright inquiries.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Send an email <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          )}

          {s?.phone && (
            <a
              href={`tel:${s.phone.replace(/\s+/g, "")}`}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow"
            >
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone Support</p>
                <p className="mt-1.5 font-display text-lg font-semibold text-foreground group-hover:text-primary">
                  {s.phone}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Call or message us during business hours for quick help with your order.
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Call now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          )}

          {s?.address && (
            <div className="rounded-2xl border border-border/70 bg-card/70 p-6 sm:col-span-2">
              <div className="flex items-start gap-3.5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Store & Support Hours
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {s.address}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">Contact details have not been published yet.</p>
      )}

      <div className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="font-display text-lg font-semibold">Helpful Policies & Info</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            to="/delivery"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2.5">
              <Truck className="h-4 w-4 text-primary" /> Digital Delivery Policy
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            to="/refund"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-primary" /> Refund & Cancellation Policy
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            to="/privacy"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Privacy Policy
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            to="/faq"
            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span className="inline-flex items-center gap-2.5">
              <HelpCircle className="h-4 w-4 text-primary" /> Frequently Asked Questions
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </section>
  );
}
