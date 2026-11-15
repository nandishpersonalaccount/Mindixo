import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import collection from "@/assets/mindixo-book-collection.jpg";
export function Categories() {
  const {categories, books} = useStore();
  return <section className="mx-auto max-w-6xl px-5 pt-16"><p className="eyebrow">Categories</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Shop by collection</h2>
    {categories.length ? <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{categories.map(c=>{
      const cover=books.find(b=>b.category_id===c.id && b.cover)?.cover;
      return <Link key={c.id} to="/store" search={{genre:c.name}} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
        <img src={cover || collection} alt={c.name} loading="lazy" width={600} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-4"><h3 className="font-display text-base font-semibold leading-tight">{c.name}</h3><p className="mt-1 text-xs text-primary">Shop now →</p></div>
      </Link>;
    })}</div> : <p className="mt-10 border-y border-border/60 py-10 text-sm text-muted-foreground">No collections published yet.</p>}
  </section>;
}
