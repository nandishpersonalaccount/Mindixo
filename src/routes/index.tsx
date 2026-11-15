import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/mindixo-mint-ereader.jpg";
import { UpcomingBooks } from "@/components/site/UpcomingBooks";
import { Categories } from "@/components/site/Categories";
import { BookCard } from "@/components/site/BookCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { pageMeta } from "@/lib/meta";
export const Route=createFileRoute("/")({head:()=>pageMeta("Mindixo — Digital Book Store","Explore books and collections at the Mindixo digital bookstore."),component:Index});
function Index() {
  const {books,settings}=useStore();
  return <>
    <section className="store-cover relative overflow-hidden" aria-label="Mindixo book collection"><h1 className="sr-only">Mindixo digital book store</h1><img src={hero} alt="E-reader glowing with neon mint light beside charcoal and white hardcover books on a dark slate desk" width={1600} height={1008} fetchPriority="high" className="store-cover-image absolute inset-0 h-full w-full object-cover"/><div className="store-cover-shade absolute inset-0"/><div className="relative mx-auto flex h-full max-w-6xl items-end justify-center px-5 pb-16 sm:pb-20"><Button asChild className="h-14 rounded-lg bg-foreground px-9 text-base font-semibold uppercase text-background hover:bg-primary hover:text-primary-foreground sm:h-16 sm:px-12"><Link to="/store">Shop now <ArrowRight className="ml-2 h-5 w-5"/></Link></Button></div></section>
    <Categories/>
    <section className="mx-auto max-w-6xl px-5 pt-20"><div className="flex items-end justify-between"><div><p className="eyebrow">The collection</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Find your next read</h2></div><Link to="/store" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">View all →</Link></div>{books.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{books.slice(0,3).map(b=><BookCard key={b.slug} book={b}/>)}</div> : <UpcomingBooks/>}</section>
    <section className="collection-callout mx-auto mt-24 max-w-6xl border-y border-primary/20 px-5 py-16 text-center"><h2 className="font-display text-3xl font-bold sm:text-4xl">Read what you love</h2><p className="mx-auto mt-4 max-w-lg text-muted-foreground">{settings?.intro || "A little less noise. A little more reading."}</p><Button asChild className="mt-8 h-auto rounded-full px-7 py-3.5 font-medium"><Link to="/store">Explore the collection <ArrowRight className="h-4 w-4"/></Link></Button></section>
  </>;
}
