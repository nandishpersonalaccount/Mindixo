import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

type StepNumber = 1 | 2 | 3;

const STEPS = [
  { num: 1 as const, label: "Cart", sub: "Review ebooks" },
  { num: 2 as const, label: "Sign in", sub: "Google account" },
  { num: 3 as const, label: "Payment", sub: "Instant download" },
];

export function CheckoutSteps({ current }: { current: StepNumber }) {
  return (
    <nav aria-label="Checkout progress" className="mx-auto max-w-2xl">
      <ol className="grid grid-cols-3 items-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const done = step.num < current;
          const active = step.num === current;

          const circle = (
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-8 sm:w-8 ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "border-2 border-primary bg-primary/15 text-primary shadow-[0_0_18px_-4px_rgba(96,242,198,0.6)]"
                    : "border border-border bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : step.num}
            </span>
          );

          const labelContent = (
            <div className="min-w-0">
              <p
                className={`truncate text-xs font-semibold sm:text-sm ${
                  active || done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              <p className="hidden truncate text-[11px] text-muted-foreground sm:block">{step.sub}</p>
            </div>
          );

          return (
            <li key={step.num} className="relative flex items-center gap-2 sm:gap-3">
              {done && step.num === 1 ? (
                <Link to="/cart" className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3">
                  {circle}
                  {labelContent}
                </Link>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  {circle}
                  {labelContent}
                </div>
              )}

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`ml-auto h-[2px] flex-1 rounded-full transition-colors ${
                    done ? "bg-primary/70" : "bg-border"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
