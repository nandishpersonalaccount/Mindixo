import { Link } from "@tanstack/react-router";
import { Heart, BookOpen, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/data/books";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/site";

export function BookCover({
  book,
  className = "",
  eager = false,
}: {
  book: Book;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ${className}`}>
      {book.cover ? (
        <img
          src={book.cover}
          alt={`${book.title} cover`}
          width={672}
          height={992}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  const { add, toggleWish, wishlist, cart } = useStore();
  const wished = wishlist.includes(book.slug);
  const inCart = cart.some((l) => l.slug === book.slug);
  const mrp = (book as Book & { mrp?: number | null }).mrp;
  const hasDiscount = typeof mrp === "number" && mrp > book.price;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/book/$slug" params={{ slug: book.slug }} className="block h-full p-5">
          <BookCover
            book={book}
            className="mx-auto h-full w-auto max-w-full shadow-book transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {book.formats.length > 0 && (
          <span className="absolute left-3 top-3 rounded-full border border-border/80 bg-background/85 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
            {book.formats.join(" · ")}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleWish(book.slug)}
          aria-label={wished ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
        </Button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <Link
          to="/book/$slug"
          params={{ slug: book.slug }}
          className="line-clamp-2 font-display text-base font-semibold leading-snug hover:text-primary sm:text-lg"
        >
          {book.title}
        </Link>

        {book.author?.trim() && (
          <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">{book.author}</p>
        )}

        <div className="mt-2.5 flex flex-wrap items-baseline gap-1.5 sm:mt-3 sm:gap-2">
          <p className="font-display text-lg font-semibold text-foreground sm:text-xl">{formatPrice(book.price)}</p>
          {hasDiscount && (
            <>
              <span className="text-xs text-muted-foreground line-through sm:text-sm">{formatPrice(mrp)}</span>
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary sm:px-2 sm:text-[11px]">
                {Math.round(((mrp - book.price) / mrp) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        <div className="mt-auto pt-3.5 sm:pt-4">
          {inCart ? (
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-xl border-primary/50 bg-primary/10 px-2.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:text-primary sm:h-11 sm:px-4 sm:text-sm"
            >
              <Link to="/cart" className="flex items-center justify-center gap-1.5 whitespace-nowrap sm:gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>Go to Cart</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => add(book.slug)}
              className="h-10 w-full cursor-pointer rounded-xl px-2.5 text-xs font-semibold whitespace-nowrap sm:h-11 sm:px-4 sm:text-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <span>Add to Cart</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
