import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { getCatalog } from "@/lib/catalog.functions";
import { pageMeta } from "@/lib/meta";
import { BookCover } from "@/components/site/BookCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/site";
import { useState } from "react";

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
  const { add } = useStore();
  const navigate = useNavigate();
  const [sample, setSample] = useState(false);

  const handleBuyNow = () => {
    add(book.slug);
    navigate({ to: "/checkout" });
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[320px_1fr]">
      <div className="mx-auto w-full max-w-xs">
        <BookCover book={book} eager />
      </div>
      <div>
        <Link to="/store" search={{ genre: book.genre }} className="eyebrow">
          {book.genre}
        </Link>
        <h1 className="mt-5 text-4xl font-semibold">{book.title}</h1>
        <p className="mt-3 text-muted-foreground">{book.author}</p>
        <p className="mt-8 whitespace-pre-wrap leading-relaxed">{book.description}</p>
        <p className="mt-5 text-sm text-muted-foreground">
          {book.formats.join(" · ")}
          {book.pages > 0 ? ` / ${book.pages} pages` : ""}
        </p>
        <p className="mt-8 text-3xl">{formatPrice(book.price)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => add(book.slug)}>
            Add to cart
          </Button>
          <Button className="shadow-glow" onClick={handleBuyNow}>
            Buy now
          </Button>
          {book.sample && (
            <Button variant="ghost" onClick={() => setSample(!sample)}>
              {sample ? "Close sample" : "Read sample"}
            </Button>
          )}
        </div>
        {sample && (
          <p className="mt-8 whitespace-pre-wrap border-t border-border pt-6 leading-relaxed">
            {book.sample}
          </p>
        )}
      </div>
    </section>
  );
}
