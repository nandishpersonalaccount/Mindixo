import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta } from "@/lib/meta";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/faq")({
  head: () => pageMeta("FAQ", "Frequently asked questions about Mindixo digital ebooks."),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Are these physical books or digital ebooks?",
    a: "Mindixo is a 100% digital-only ebook store. We do not ship physical printed books — every title is delivered electronically with zero shipping charges.",
  },
  {
    q: "What file formats are provided?",
    a: "Each ebook lists its available formats (such as PDF or EPUB) on its product page. Files can be read comfortably on Android, iOS, Windows, macOS, tablets, and compatible e-readers.",
  },
  {
    q: "Why do I sign in with Google at checkout?",
    a: "Signing in with Google takes one click, requires no new password, and safely ties your order receipt and ebook download access to your verified email address.",
  },
  {
    q: "Are live payments open right now?",
    a: "You can browse ebooks, add them to your cart, and sign in with Google right now. Live payment processing (UPI, Cards, NetBanking) will activate as soon as our payment gateway is connected.",
  },
  {
    q: "What is your refund policy?",
    a: "Because ebooks are instant digital downloads, completed orders are generally non-refundable once delivered. However, we provide full refunds or replacements for duplicate charges, delivery failures, or corrupted files. See our Refund Policy for details.",
  },
];

function FaqPage() {
  const { settings } = useStore();

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">Help Center</p>
      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Frequently Asked Questions</h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Quick answers about buying and reading digital ebooks on Mindixo.
      </p>

      <div className="mt-10 space-y-4">
        {FAQS.map((item) => (
          <div key={item.q} className="rounded-2xl border border-border/70 bg-card/70 p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">{item.q}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/70 bg-card/50 p-6 text-sm text-muted-foreground">
        <p className="font-display text-base font-semibold text-foreground">Still have a question?</p>
        <p className="mt-1.5">
          Contact us anytime at{" "}
          {settings?.email ? (
            <a href={`mailto:${settings.email}`} className="font-medium text-primary hover:underline">
              {settings.email}
            </a>
          ) : (
            <Link to="/contact" className="font-medium text-primary hover:underline">
              our Contact page
            </Link>
          )}
          {settings?.phone && (
            <>
              {" "}
              or call{" "}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="font-medium text-primary hover:underline"
              >
                {settings.phone}
              </a>
            </>
          )}
          .
        </p>
      </div>
    </section>
  );
}
