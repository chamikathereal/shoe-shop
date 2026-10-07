import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Info, Mail, Search, Heart, Menu, X, Zap } from "lucide-react";
import { ensureGsap } from "@/lib/motion";
import { useShop } from "@/lib/store";
import { brand } from "@/lib/brand";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/contact", label: "Contact Us", icon: Mail },
] as const;

function useActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
}

function CartButton({ className = "" }: { className?: string }) {
  const count = useShop((s) => s.cart.reduce((a, c) => a + c.qty, 0));
  const bump = useShop((s) => s.bump);
  const open = useShop((s) => s.setCartOpen);
  const badge = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!bump || !badge.current) return;
    ensureGsap().gsap.fromTo(badge.current, { scale: 1.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.35)" });
  }, [bump]);
  return (
    <button id="cart-target" onClick={() => open(true)} aria-label={`Open bag, ${count} items`} className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 ${className}`}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && <span ref={badge} className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-hot px-1 text-[10px] font-bold text-hot-foreground">{count}</span>}
    </button>
  );
}

export function Sidebar() {
  const isActive = useActive();
  const wish = useShop((s) => s.wishlist.length);
  const setSearch = useShop((s) => s.setSearchOpen);
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const activeIdx = nav.findIndex((n) => isActive(n.to));

  useEffect(() => {
    const items = list.current?.querySelectorAll("li");
    const el = items?.[activeIdx] as HTMLElement | undefined;
    if (!el || !pill.current) return;
    ensureGsap().gsap.to(pill.current, { y: el.offsetTop, opacity: 1, duration: 0.6, ease: "expo.out" });
  }, [activeIdx]);

  return (
    <aside className="group/side fixed inset-y-0 left-0 z-50 hidden w-[var(--rail)] flex-col justify-between overflow-hidden border-r border-sidebar-border bg-sidebar py-5 transition-[width] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:w-60 focus-within:w-60 lg:flex">
      <div>
        <Link to="/" className="mx-3 flex h-12 items-center gap-3" aria-label={`${brand.name} home`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Zap className="h-6 w-6" fill="currentColor" /></span>
          <span className="whitespace-nowrap font-display text-xl opacity-0 transition-opacity duration-300 group-hover/side:opacity-100 group-focus-within/side:opacity-100">{brand.name}</span>
        </Link>
        <nav aria-label="Main" className="mt-10">
          <ul ref={list} className="relative space-y-1 px-3">
            <span ref={pill} className="absolute left-3 right-3 top-0 h-12 rounded-full bg-sidebar-accent opacity-0">
              <span className="absolute left-0 top-3 h-6 w-1 rounded-full bg-primary" />
            </span>
            {nav.map((n, i) => (
              <li key={n.to}>
                <Link to={n.to} className={`relative flex h-12 items-center gap-4 rounded-full px-[0.85rem] transition-colors ${isActive(n.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <n.icon className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest opacity-0 transition-all duration-300 group-hover/side:translate-x-0 group-hover/side:opacity-100 group-focus-within/side:opacity-100 -translate-x-2" style={{ transitionDelay: `${i * 40}ms` }}>{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="space-y-2 px-3">
        <button onClick={() => setSearch(true)} aria-label="Search" className="flex h-12 w-full items-center gap-4 rounded-full px-[0.85rem] text-muted-foreground hover:text-foreground">
          <Search className="h-5 w-5 shrink-0" /><span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest opacity-0 group-hover/side:opacity-100">Search</span>
        </button>
        <Link to="/wishlist" aria-label={`Wishlist, ${wish} items`} className="relative flex h-12 items-center gap-4 rounded-full px-[0.85rem] text-muted-foreground hover:text-foreground">
          <Heart className="h-5 w-5 shrink-0" />
          {wish > 0 && <span className="absolute left-7 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-hot px-1 text-[9px] font-bold text-hot-foreground">{wish}</span>}
          <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest opacity-0 group-hover/side:opacity-100">Wishlist</span>
        </Link>
        <div className="flex items-center gap-4 pl-[0.1rem]"><CartButton /><span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest opacity-0 group-hover/side:opacity-100">Bag</span></div>
        <div className="flex gap-3 whitespace-nowrap pt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 group-hover/side:opacity-100">
          {brand.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-primary">{s.label}</a>)}
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const isActive = useActive();
  const setSearch = useShop((s) => s.setSearchOpen);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border glass px-4 lg:hidden">
      <button aria-label="Open menu" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center"><Menu /></button>
      <Link to="/" className="font-display text-xl">{brand.name}</Link>
      <div className="flex items-center gap-1">
        <button aria-label="Search" onClick={() => setSearch(true)} className="flex h-11 w-11 items-center justify-center"><Search className="h-5 w-5" /></button>
        <CartButton className="h-10 w-10" />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-full border-none bg-background p-6 sm:max-w-full [&>button]:hidden">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex items-center justify-between"><span className="font-display text-xl">{brand.name}</span>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center"><X /></button></div>
          <nav className="mt-14 flex flex-col gap-2">
            {[...nav, { to: "/wishlist", label: "Wishlist" } as const].map((n, i) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`font-display text-big animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${isActive(n.to) ? "text-primary" : ""}`} style={{ animationDelay: `${i * 70}ms`, animationDuration: "600ms" }}>{n.label}</Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
