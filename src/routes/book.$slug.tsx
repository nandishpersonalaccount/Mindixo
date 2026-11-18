import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { getCatalog } from "@/lib/catalog.functions";
import { pageMeta } from "@/lib/meta";
import { BookCover } from "@/components/site/BookCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/site";
import { useState } from "react";
import { ShoppingBag, Check, Zap, Smartphone, ShieldCheck, ArrowRight, BookOpen } from "lucide-react";
import type { Book } from "@/data/books";

export const Route = createFileRoute("/book/$slug")({
  loader: async ({ params }) => {
    const data = await getCatalog();
    const book = data.books.find((b) => b.slug === params.slug);
    if (!book) throw notFound();
    return book;
  },
  head: ({ loaderData }) =>
    pageMeta(loaderData?.title ?? "Book unavailable", loaderData?.description ?? "This ebook is unavailable."),
  component: BookPage,
});

function BookPage() {
  const book = Route.useLoaderData();
  const { add, cart } = useStore();
  const navigate = useNavigate();
  const [sample, setSample] = useState(false);

  const inCart = cart.some((l) => l.slug === book.slug);
  const mrp = (book as Book & { mrp?: number | null }).mrp;
  const hasDiscount = typeof mrp === "number" && mrp > book.price;

  const handleBuyNow = () => {
    if (!inCart) add(book.slug);
    navigate({ to: "/checkout" });
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[340px_1fr] md:gap-14 md:py-16">
      <div className="mx-auto w-full max-w-xs">
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-book">
          <BookCover book={book} eager />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/store" search={{ genre: book.genre }} className="eyebrow">
            {book.genre}
          </Link>
          {book.formats.map((fmt) => (
            <span
              key={fmt}
              className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {fmt}
            </span>
          ))}
          {book.pages > 0 && (
            <span className="text-xs text-muted-foreground">· {book.pages} pages</span>
          )}
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{book.title}</h1>
        {book.author?.trim() && (
          <p className="mt-2 text-base text-muted-foreground">by {book.author}</p>
        )}

        <div className="mt-6 flex items-baseline gap-3">
          <p className="font-display text-3xl font-bold text-foreground">{formatPrice(book.price)}</p>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(mrp)}</span>
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
                Save {Math.round(((mrp - book.price) / mrp) * 100)}%
              </span>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            size="lg"
            className="h-12 cursor-pointer rounded-xl px-7 text-base font-semibold shadow-glow"
            onClick={handleBuyNow}
          >
            <Zap className="h-4 w-4" />
            <span>Buy Now</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          {inCart ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-primary/50 bg-primary/10 px-6 text-base font-semibold text-primary hover:bg-primary/20 hover:text-primary"
            >
              <Link to="/cart" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>In Cart · View Cart</span>
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="h-12 cursor-pointer rounded-xl px-6 text-base font-semibold"
              onClick={() => add(book.slug)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          )}

          {book.sample && (
            <Button
              size="lg"
              variant="ghost"
              className="h-12 cursor-pointer rounded-xl px-5"
              onClick={() => setSample(!sample)}
            >
              <BookOpen className="h-4 w-4" />
              <span>{sample ? "Close Sample" : "Read Sample"}</span>
            </Button>
          )}
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 text-center sm:text-left">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-start sm:gap-2.5">
            <Zap className="h-4 w-4 shrink-0 text-primary sm:mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">Instant Access</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Download right away</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-start sm:gap-2.5">
            <Smartphone className="h-4 w-4 shrink-0 text-primary sm:mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">Any Device</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Phone, tablet & PC</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:items-start sm:gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary sm:mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground">Email Copy</p>
              <p className="hidden text-[11px] text-muted-foreground sm:block">Sent to your Google email</p>
            </div>
          </div>
        </div>

        {book.description && (
          <div className="mt-8 border-t border-border/60 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About this ebook</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-foreground/90">{book.description}</p>
          </div>
        )}

        {sample && (
          <div className="mt-8 rounded-2xl border border-primary/25 bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Sample Excerpt</h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/90">{book.sample}</p>
          </div>
        )}
      </div>
    </section>
  );
}
