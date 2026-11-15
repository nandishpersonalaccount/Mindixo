import { Link } from "@tanstack/react-router";
import { Heart, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/data/books";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/site";
export function BookCover({book,className="",eager=false}:{book:Book;className?:string;eager?:boolean}) {
  return <div className={`relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ${className}`}>
    {book.cover ? <img src={book.cover} alt={`${book.title} cover`} width={672} height={992} loading={eager?"eager":"lazy"} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center"><BookOpen className="h-12 w-12 text-muted-foreground"/></div>}
  </div>;
}
export function BookCard({book}:{book:Book}) {
  const {add,toggleWish,wishlist}=useStore();const wished=wishlist.includes(book.slug);
  return <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
    <div className="relative aspect-square overflow-hidden bg-muted"><Link to="/book/$slug" params={{slug:book.slug}} className="block h-full p-5"><BookCover book={book} className="mx-auto h-full w-auto max-w-full transition-transform duration-700 group-hover:scale-105"/></Link>
      <Button variant="ghost" size="icon" onClick={()=>toggleWish(book.slug)} aria-label={`Save ${book.title}`} className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/75"><Heart className={`h-4 w-4 ${wished?"fill-primary text-primary":""}`}/></Button>
      <Button size="icon" onClick={()=>add(book.slug)} aria-label={`Add ${book.title} to cart`} className="absolute bottom-3 right-3 h-8 w-8 rounded-full"><Plus className="h-4 w-4"/></Button>
    </div><div className="p-5"><Link to="/book/$slug" params={{slug:book.slug}} className="font-display text-lg font-semibold hover:text-primary">{book.title}</Link><p className="mt-1 text-sm text-muted-foreground">{book.author}</p><p className="mt-3 font-semibold">{formatPrice(book.price)}</p></div>
  </div>;
}
