import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { BookCard } from "@/components/site/BookCard";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | Mindixo" },
      { name: "description", content: "Ebooks you've saved for later on Mindixo." },
      { property: "og:title", content: "Wishlist | Mindixo" },
      { property: "og:description", content: "Your saved ebooks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, books: catalog } = useStore();
  const books = catalog.filter((b) => wishlist.includes(b.slug));
  return (
    <>
      <PageHero eyebrow="Wishlist" title="Saved for later." />
      <div className="mx-auto max-w-7xl px-5 py-12">
        {books.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">{books.map((b) => <BookCard key={b.slug} book={b} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Tap the heart on any book to save it here.</p>
            <Link to="/store" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-primary-foreground">Browse ebooks</Link>
          </div>
        )}
      </div>
    </>
  );
}
