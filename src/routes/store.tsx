import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ListFilter, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Book } from "@/data/books";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/site/BookCard";
import { UpcomingBooks } from "@/components/site/UpcomingBooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { matchesPrice, type PriceBand } from "@/lib/shop-filters";

type StoreSearch = { q?: string | undefined; genre?: string | undefined };

export const Route = createFileRoute("/store")({
  validateSearch: (s: Record<string, unknown>): StoreSearch => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    genre: typeof s["genre"] === "string" ? s["genre"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Ebook Store — Browse all ebooks | Mindixo" },
      { name: "description", content: "Browse Mindixo ebooks by collection and price, and find your next read." },
      { property: "og:title", content: "Ebook Store | Mindixo" },
      { property: "og:description", content: "Search and filter every ebook on Mindixo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { books: catalog, categories } = useStore();
  const { q = "", genre } = Route.useSearch();
  const navigate = useNavigate({ from: "/store" });
   const [priceBand, setPriceBand] = useState<PriceBand>("any");
   const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("popular");

  const books = useMemo(() => {
    const t = q.toLowerCase();
    const list = catalog.filter((b) =>
      (!t || b.title.toLowerCase().includes(t) || b.author.toLowerCase().includes(t)) &&
       (!genre || b.genre === genre) && matchesPrice(b.price, priceBand));
    const sorters: Record<string, (a: Book, b: Book) => number> = {
       popular: () => 0,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      new: (a, b) => b.created_at.localeCompare(a.created_at),
    };
     return [...list].sort(sorters[sort] ?? sorters["popular"]);
   }, [q, genre, priceBand, sort, catalog]);

   const prices: { value: PriceBand; label: string }[] = [
     {value:"any",label:"Any price"}, {value:"under300",label:"Under ₹300"},
     {value:"300to500",label:"₹300 – ₹500"}, {value:"500to1000",label:"₹500 – ₹1000"},
     {value:"above1000",label:"Above ₹1000"},
   ];
   const sorting = [{value:"popular",label:"Featured"},{value:"low",label:"Price: Low to High"},{value:"high",label:"Price: High to Low"},{value:"new",label:"Newest"}];
   const optionClass = (active: boolean) => `h-10 w-full justify-between rounded-lg px-3 text-sm font-normal ${active ? "bg-primary/15 text-primary hover:bg-primary/20" : "text-muted-foreground hover:text-foreground"}`;

  const chip = (active: boolean) => `shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`;

   return <section className="mx-auto max-w-6xl px-5 pt-5 sm:pt-8">
     <h1 className="sr-only">{genre || "All ebooks"}</h1>
     <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
      <Button variant="outline" className={chip(!genre)} onClick={() => navigate({search:p=>({...p,genre:undefined})})}>All</Button>
      {categories.map(c=><Button key={c.id} variant="outline" className={chip(genre===c.name)} onClick={()=>navigate({search:p=>({...p,genre:c.name})})}>{c.name}</Button>)}
    </div>
    <div className="mt-4 flex items-center justify-between gap-3">
       <Popover open={filtersOpen} onOpenChange={setFiltersOpen}><PopoverTrigger asChild><Button variant="outline" className={chip(priceBand!=="any" || sort!=="popular")}><ListFilter className="h-4 w-4"/>Filters</Button></PopoverTrigger>
         <PopoverContent align="start" sideOffset={8} collisionPadding={20} className="w-80 max-w-[calc(100vw-40px)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-lg border-border bg-card p-4">
           <div><p className="mb-2 text-xs uppercase text-muted-foreground">Price</p><div className="space-y-1">{prices.map(p=><Button key={p.value} variant="ghost" aria-pressed={priceBand===p.value} className={optionClass(priceBand===p.value)} onClick={()=>setPriceBand(p.value)}>{p.label}{priceBand===p.value && <Check className="h-4 w-4"/>}</Button>)}</div></div>
           <div className="mt-5"><p className="mb-2 text-xs uppercase text-muted-foreground">Sort by</p><div className="space-y-1">{sorting.map(s=><Button key={s.value} variant="ghost" aria-pressed={sort===s.value} className={optionClass(sort===s.value)} onClick={()=>setSort(s.value)}>{s.label}{sort===s.value && <Check className="h-4 w-4"/>}</Button>)}</div></div>
           <div className="mt-4 flex items-center justify-between border-t border-border pt-3"><Button variant="ghost" className="px-0 text-muted-foreground" onClick={()=>{setPriceBand("any");setSort("popular");navigate({search:p=>({...p,q:undefined})});}}>Clear all</Button><Button className="rounded-full px-6" onClick={()=>setFiltersOpen(false)}>Done</Button></div>
        </PopoverContent>
      </Popover>
      <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">{books.length} items</span>
    </div>
     <div className="mt-5 flex max-w-md items-center gap-2 border-b border-border pb-2"><Search className="h-4 w-4 text-muted-foreground"/><input value={q} onChange={e=>navigate({search:p=>({...p,q:e.target.value || undefined})})} placeholder="Search books" aria-label="Search books" className="w-full min-w-0 bg-transparent text-sm outline-none"/></div>
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">{books.map(b=><BookCard key={b.slug} book={b}/>)}</div>
     {catalog.length===0 && !q && !genre && priceBand==="any" ? <UpcomingBooks/> : books.length===0 && <p className="py-16 text-center text-muted-foreground">No ebooks match these filters.</p>}
  </section>;
}
