import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Logo() {
  return <Link to="/" aria-label="Mindixo home" className="shrink-0 whitespace-nowrap font-display text-sm font-semibold sm:text-lg">M I N D I X O</Link>;
}
export function Header() {
  const { cart, settings } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const home = useLocation({select: location => location.pathname === "/"});
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, {passive:true});
    return () => window.removeEventListener("scroll", update);
  }, []);
  const links = [{to:"/",label:"Home"},{to:"/store",label:"Shop"},{to:"/wishlist",label:"Wishlist"},{to:"/contact",label:"Contact Us"}] as const;
  return <header data-scrolled={scrolled} className={`${home?"fixed inset-x-0":"sticky"} top-0 z-40 border-b transition-colors duration-300 ${home && !scrolled?"border-transparent bg-transparent text-foreground": "store-header-solid border-border"}`}>
    {settings?.announcement && <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">{settings.announcement}</div>}
    <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5"><Logo/><nav className="flex items-center gap-4 text-sm">
      <Button asChild variant="ghost" size="icon" className="relative h-9 w-9 text-current"><Link to="/cart" aria-label="Cart"><ShoppingBag className="h-5 w-5"/>{cart.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">{cart.length}</span>}</Link></Button>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu" className="text-current"><Menu className="h-6 w-6"/></Button></SheetTrigger><SheetContent side="right" aria-describedby={undefined} className="overflow-y-auto"><SheetTitle className="mt-6 whitespace-nowrap font-display text-base">M I N D I X O</SheetTitle><nav aria-label="Main menu" className="mt-10 flex flex-col">{links.map(link=><Button key={link.to} asChild variant="ghost" className="h-auto justify-between rounded-none border-b border-border py-5 text-xl"><Link to={link.to} onClick={()=>setMenuOpen(false)}>{link.label}<ArrowUpRight className="h-4 w-4"/></Link></Button>)}</nav></SheetContent></Sheet>
    </nav></div>
  </header>;
}
