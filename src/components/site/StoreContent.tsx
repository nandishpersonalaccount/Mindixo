import { Link } from "@tanstack/react-router";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

type PolicyField = "about" | "privacy" | "terms" | "refund" | "cookies" | "dmca" | "delivery";

function renderFormattedText(raw: string) {
  const blocks = raw.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return blocks.map((block, idx) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    // Metadata block at the top (e.g. "Last Updated: ...")
    if (idx === 0 && lines.every((l) => /^(Last Updated|Effective Date|Website):/i.test(l))) {
      return (
        <div
          key={idx}
          className="mb-8 flex flex-wrap gap-x-6 gap-y-1 rounded-xl border border-border/70 bg-card/60 px-4 py-3 text-xs text-muted-foreground"
        >
          {lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      );
    }

    const firstLine = lines[0];
    const isNumberedSection = /^\d+\.\s+/.test(firstLine);

    if (isNumberedSection) {
      const bodyLines = lines.slice(1);
      const bulletLines = bodyLines.filter((l) => l.startsWith("•"));
      const textLines = bodyLines.filter((l) => !l.startsWith("•"));
      const firstBulletIdx = bodyLines.findIndex((l) => l.startsWith("•"));
      const beforeBullets = firstBulletIdx >= 0 ? bodyLines.slice(0, firstBulletIdx) : textLines;
      const afterBullets =
        firstBulletIdx >= 0
          ? bodyLines.slice(firstBulletIdx).filter((l) => !l.startsWith("•"))
          : [];

      return (
        <div key={idx} className="mt-8 first:mt-0">
          <h2 className="font-display text-lg font-semibold text-foreground sm:text-xl">
            {firstLine}
          </h2>
          {beforeBullets.map((line, i) => (
            <p key={`pre-${i}`} className="mt-2.5 leading-relaxed text-muted-foreground">
              {line}
            </p>
          ))}
          {bulletLines.length > 0 && (
            <ul className="mt-3 space-y-2 pl-1">
              {bulletLines.map((line, i) => (
                <li key={`bul-${i}`} className="flex items-start gap-2.5 leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{line.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          )}
          {afterBullets.map((line, i) => (
            <p key={`post-${i}`} className="mt-2.5 leading-relaxed text-muted-foreground">
              {line}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div key={idx} className="mt-5 space-y-2 first:mt-0">
        {lines.map((line, i) =>
          line.startsWith("•") ? (
            <div key={i} className="flex items-start gap-2.5 leading-relaxed text-muted-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line.replace(/^•\s*/, "")}</span>
            </div>
          ) : (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {line}
            </p>
          ),
        )}
      </div>
    );
  });
}

export function StoreContent({ field, title }: { field: PolicyField; title: string }) {
  const { settings } = useStore();
  const content = settings?.[field]?.trim();

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="eyebrow">Mindixo</p>
      <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>

      <div className="mt-8 text-sm sm:text-base">
        {content ? (
          renderFormattedText(content)
        ) : (
          <p className="text-muted-foreground">Details have not been published yet.</p>
        )}
      </div>

      {(settings?.email || settings?.phone) && (
        <div className="mt-12 rounded-2xl border border-border/70 bg-card/70 p-6">
          <p className="font-display text-base font-semibold text-foreground">Questions or need support?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach out to the Mindixo team directly and we will be glad to help.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{settings.email}</span>
              </a>
            )}
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>{settings.phone}</span>
              </a>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <span>Contact page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
