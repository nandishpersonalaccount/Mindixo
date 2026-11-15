import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-4">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title}>
        <p>Last updated: November 9, 2026</p>
      </PageHero>
      <article className="prose-legal mx-auto max-w-3xl px-5 py-12">{children}</article>
    </>
  );
}
