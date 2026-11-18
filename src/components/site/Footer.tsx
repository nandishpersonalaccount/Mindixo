import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/store", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Us" },
  { to: "/delivery", label: "Digital Delivery" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund", label: "Refund Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/cookies", label: "Cookies" },
  { to: "/dmca", label: "Copyright" },
] as const;

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-10 text-center">
        <p className="font-display text-2xl font-semibold sm:text-4xl">M I N D I X O</p>
        <nav className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs text-muted-foreground sm:gap-x-10 sm:text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="uppercase transition-colors hover:text-foreground"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground underline underline-offset-8" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {(settings?.email || settings?.phone) && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="transition-colors hover:text-primary">
                {settings.email}
              </a>
            )}
            {settings.email && settings.phone && <span aria-hidden="true">·</span>}
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="transition-colors hover:text-primary"
              >
                {settings.phone}
              </a>
            )}
          </div>
        )}

        <p className="mt-8 text-sm text-muted-foreground">© 2026 - Mindixo</p>
      </div>
    </footer>
  );
}
