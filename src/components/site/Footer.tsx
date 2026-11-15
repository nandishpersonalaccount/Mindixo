import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
const links = [{to:"/",label:"Home"},{to:"/store",label:"Shop"},{to:"/contact",label:"Contact Us"},{to:"/delivery",label:"Digital Delivery"},{to:"/privacy",label:"Privacy Policy"},{to:"/refund",label:"Refund Policy"},{to:"/terms",label:"Terms of Service"},{to:"/cookies",label:"Cookies"},{to:"/dmca",label:"Copyright"}] as const;
export function Footer() {
  const {settings} = useStore();
  return <footer className="border-t border-border/60 bg-background"><div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-8 text-center">
    <p className="font-display text-2xl font-semibold sm:text-4xl">M I N D I X O</p><nav className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-6 text-sm text-muted-foreground">{links.map(l=><Link key={l.to} to={l.to} className="uppercase transition-colors hover:text-foreground" activeOptions={{exact:true}} activeProps={{className:"text-foreground underline underline-offset-8"}}>{l.label}</Link>)}</nav>
    {settings?.email && <a href={`mailto:${settings.email}`} className="mt-6 text-sm text-muted-foreground hover:text-primary">{settings.email}</a>}
    <p className="mt-10 text-sm text-muted-foreground">© 2026 - Mindixo</p><Link to="/admin" className="mt-4 text-xs text-muted-foreground hover:text-foreground">Store management ↗</Link>
  </div></footer>;
}
