import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useShop, money } from "@/lib/store";
import { ensureGsap } from "@/lib/motion";

/** Fly a clone of the image to the bag icon. */
export function flyToCart(img: HTMLImageElement | null) {
  const target = [...document.querySelectorAll<HTMLElement>("#cart-target")].find((t) => t.offsetParent !== null);
  if (!img || !target) return;
  const { gsap } = ensureGsap();
  const a = img.getBoundingClientRect(), b = target.getBoundingClientRect();
  const clone = img.cloneNode() as HTMLImageElement;
  Object.assign(clone.style, { position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, zIndex: "95", pointerEvents: "none" });
  document.body.appendChild(clone);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  gsap.timeline({ onComplete: () => clone.remove() })
    .to(clone, { x: dx * 0.5, y: dy - 160, scale: 0.6, rotate: -25, duration: 0.4, ease: "power2.out" })
    .to(clone, { x: dx, y: dy, scale: 0.08, rotate: -60, opacity: 0.6, duration: 0.45, ease: "power2.in" });
}

export function ProductCard({ p, list = false }: { p: Product; list?: boolean }) {
  const [cw, setCw] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const { toggleWish, add } = useShop();
  const c = p.colorways[cw];
  const size = p.sizes.find((s) => s.inStock && s.size >= 9)?.size ?? p.sizes[0].size;

  const onMove = (e: React.MouseEvent) => {
    const r = card.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    const { gsap } = ensureGsap();
    gsap.to(card.current, { rotateY: x * 10, rotateX: -y * 10, duration: 0.5 });
    gsap.to(img.current, { x: x * 30, y: y * 20, rotate: -14 + x * 10, duration: 0.5 });
  };
  const onLeave = () => {
    const { gsap } = ensureGsap();
    gsap.to(card.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
    gsap.to(img.current, { x: 0, y: 0, rotate: -12, duration: 0.8 });
  };
  const heart = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleWish(p.slug);
    ensureGsap().gsap.fromTo(e.currentTarget, { scale: 0.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.3)" });
  };

  return (
    <div data-flip-id={p.id} className="flip-card [perspective:1000px]">
      <div ref={card} onMouseMove={onMove} onMouseLeave={onLeave} className={`group relative overflow-hidden rounded-lg border border-border bg-card [transform-style:preserve-3d] ${list ? "flex" : ""}`}>
        <Link to="/shop/$slug" params={{ slug: p.slug }} data-cursor="VIEW" className={`relative block overflow-hidden transition-colors duration-500 ${list ? "w-2/5 shrink-0" : "aspect-[4/3.4]"}`} style={{ background: c.bg }}>
          <div className="absolute inset-0 glow-volt opacity-0 transition-opacity duration-500 group-hover:opacity-60" style={{ background: `radial-gradient(circle, ${c.hex}66, transparent 60%)` }} />
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[7rem] leading-none text-outline opacity-20">{p.category}</span>
          <img ref={img} src={c.image} alt={`${p.name} in ${c.name}`} loading="lazy" width={1280} height={896} className="relative z-10 mx-auto mt-[10%] w-[88%] -rotate-12 drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]" style={{ filter: c.filter }} />
          <div className="absolute left-3 top-3 z-20 flex gap-1.5">
            {p.salePrice && <span className="rounded-full bg-hot px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-hot-foreground">Sale</span>}
            {p.tags.map((t) => <span key={t} className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${t === "HOT" ? "bg-hot text-hot-foreground" : "bg-primary text-primary-foreground"}`}>{t}</span>)}
          </div>
        </Link>
        <button aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} onClick={heart} className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full glass">
          <Heart className={`h-4 w-4 ${wished ? "fill-hot text-hot" : ""}`} />
        </button>
        <div className="relative flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.category} · {p.gender}</p>
              <Link to="/shop/$slug" params={{ slug: p.slug }} className="font-display text-2xl">{p.name}</Link>
            </div>
            <div className="text-right">
              <p className="font-bold">{money(p.salePrice ?? p.price)}</p>
              {p.salePrice && <p className="text-xs text-muted-foreground line-through">{money(p.price)}</p>}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              {p.colorways.map((col, i) => (
                <button key={col.name} aria-label={col.name} onClick={() => setCw(i)} className={`h-4 w-4 rounded-full border-2 transition-transform ${i === cw ? "scale-125 border-foreground" : "border-transparent"}`} style={{ background: col.hex }} />
              ))}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-primary text-primary" />{p.rating} ({p.reviews})</span>
          </div>
          <button data-cursor="ADD" onClick={() => { add({ slug: p.slug, colorway: cw, size }); flyToCart(img.current); toast.success(`${p.name} · US ${size} added to bag`); }}
            className="mt-4 w-full rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all duration-300 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100">
            Quick add · US {size}
          </button>
        </div>
      </div>
    </div>
  );
}
