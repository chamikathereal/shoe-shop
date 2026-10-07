import { Split } from "@/components/Split";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Minus, Plus, Star, Truck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products, finalPrice, reviews } from "@/data/products";
import { useShop, money } from "@/lib/store";
import { ensureGsap, useReveal } from "@/lib/motion";
import { ProductCard, flyToCart } from "@/components/shop/ProductCard";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Sneaker not found — VOLT STRIDE" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return { meta: [
      { title: `${p.name} — ${p.category} — VOLT STRIDE` },
      { name: "description", content: p.description },
      { property: "og:title", content: `${p.name} — VOLT STRIDE` },
      { property: "og:description", content: p.description },
      { property: "og:type", content: "product" },
    ] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [cw, setCw] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [angle, setAngle] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const addBtn = useRef<HTMLButtonElement>(null);
  const wished = useShop((s) => s.wishlist.includes(p.slug));
  const { add, toggleWish, setCartOpen } = useShop();
  const story = useReveal<HTMLDivElement>([p.slug]);
  const c = p.colorways[cw];
  const views = [-12, 0, 12, 180];

  useEffect(() => { setCw(0); setSize(null); setQty(1); setAngle(0); }, [p.slug]);
  useEffect(() => {
    const el = addBtn.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el); return () => io.disconnect();
  }, []);

  const switchColor = (i: number) => {
    const { gsap } = ensureGsap();
    gsap.to(img.current, { opacity: 0, scale: 0.9, duration: 0.2, onComplete: () => { setCw(i); gsap.to(img.current, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" }); } });
  };
  const addToBag = (buyNow = false) => {
    if (!size) { toast.error("Pick a size first."); return; }
    add({ slug: p.slug, colorway: cw, size }, qty);
    flyToCart(img.current);
    toast.success(`${p.name} · US ${size} added to bag`);
    if (buyNow) setTimeout(() => setCartOpen(true), 700);
  };
  const drag = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setAngle((a) => a + e.movementX * 0.6);
  };
  const related = products.filter((x) => x.slug !== p.slug && x.category === p.category).concat(products.filter((x) => x.category !== p.category)).slice(0, 3);

  return (
    <>
      <div className="px-6 pt-8 md:px-12">
        <Breadcrumb><BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/shop">Shop</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{p.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList></Breadcrumb>
      </div>
      <section className="grid gap-10 px-6 py-8 md:px-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div onPointerMove={drag} data-cursor="DRAG" className="group relative flex aspect-[4/3] touch-pan-y select-none items-center justify-center overflow-hidden rounded-lg transition-colors duration-700" style={{ background: c.bg }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${c.hex}66, transparent 60%)` }} />
            <span className="absolute font-display text-[18vw] text-outline opacity-10 lg:text-[11vw]">{p.line}</span>
            <img ref={img} src={c.image} alt={`${p.name} in ${c.name}`} width={1280} height={896} draggable={false}
              className="relative w-[85%] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_50px_40px_rgba(0,0,0,0.55)]"
              style={{ filter: c.filter, transform: `perspective(1200px) rotateY(${angle}deg) rotate(${views[0] === -12 && angle === 0 ? -12 : 0}deg)` }} />
            <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-muted-foreground">Drag to rotate</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {views.map((v, i) => (
              <button key={i} aria-label={`View ${i + 1}`} onClick={() => setAngle(v === -12 ? 0 : v)} className="flex aspect-square items-center justify-center rounded border border-border transition-colors hover:border-primary" style={{ background: c.bg }}>
                <img src={c.image} alt="" className="w-[85%]" style={{ filter: c.filter, transform: `rotateY(${v === 180 ? 180 : 0}deg) rotate(${v === 180 ? 0 : v}deg)` }} />
              </button>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="flex gap-2">{p.tags.map((t) => <span key={t} className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">{t}</span>)}</div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.category} · {p.gender}</p>
          <h1 className="mt-1 font-display text-giant">{p.name}</h1>
          <div className="mt-3 flex items-center gap-4">
            <p className="text-2xl font-bold">{money(finalPrice(p))}</p>
            {p.salePrice && <p className="text-muted-foreground line-through">{money(p.price)}</p>}
            <span className="flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-primary text-primary" />{p.rating} · {p.reviews} reviews</span>
          </div>
          <p className="mt-6 text-muted-foreground">{p.description}</p>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest">Colorway · <span className="text-muted-foreground">{c.name}</span></p>
          <div className="mt-3 flex gap-3">
            {p.colorways.map((col, i) => <button key={col.name} aria-label={col.name} onClick={() => switchColor(i)} className={`h-11 w-11 rounded-full border-4 transition-transform ${i === cw ? "scale-110 border-foreground" : "border-transparent"}`} style={{ background: col.hex }} />)}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest">Size (US)</p>
            <Dialog><DialogTrigger className="text-xs uppercase tracking-widest text-muted-foreground underline">Size guide</DialogTrigger>
              <DialogContent className="bg-background"><DialogTitle className="font-display text-3xl">Size guide</DialogTitle>
                <table className="w-full text-sm"><thead><tr className="text-left text-muted-foreground"><th className="py-2">US</th><th>UK</th><th>EU</th><th>CM</th></tr></thead>
                  <tbody>{[7, 8, 9, 10, 11, 12].map((s) => <tr key={s} className="border-t border-border"><td className="py-2">{s}</td><td>{s - 1}</td><td>{s + 33}</td><td>{(s + 18) .toFixed(0)}</td></tr>)}</tbody></table>
                <p className="text-sm text-muted-foreground">Between sizes? Go half up for racers, true to size for lifestyle.</p>
              </DialogContent></Dialog>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {p.sizes.map((s) => (
              <button key={s.size} disabled={!s.inStock} onClick={() => setSize(s.size)} aria-pressed={size === s.size}
                className={`rounded border py-3 text-sm font-semibold transition-all ${!s.inStock ? "cursor-not-allowed text-muted-foreground line-through opacity-40" : size === s.size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>{s.size}</button>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button aria-label="Decrease quantity" className="p-4" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center">{qty}</span>
              <button aria-label="Increase quantity" className="p-4" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>
            <Button ref={addBtn} variant="volt" size="lg" className="flex-1" data-cursor="ADD" onClick={() => addToBag()}>Add to bag</Button>
            <button aria-label="Wishlist" onClick={() => toggleWish(p.slug)} className="flex h-14 w-14 items-center justify-center rounded-full border border-border"><Heart className={wished ? "fill-hot text-hot" : ""} /></button>
          </div>
          <Button variant="ghostline" size="lg" className="mt-3 w-full" onClick={() => addToBag(true)}>Buy now</Button>
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free shipping over $150</p>
            <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" /> 60-day test runs</p>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="d"><AccordionTrigger>Details</AccordionTrigger><AccordionContent><ul className="list-disc space-y-1 pl-5">{p.features.map((f) => <li key={f}>{f}</li>)}</ul></AccordionContent></AccordionItem>
            <AccordionItem value="m"><AccordionTrigger>Materials</AccordionTrigger><AccordionContent>{p.materials}</AccordionContent></AccordionItem>
            <AccordionItem value="c"><AccordionTrigger>Care</AccordionTrigger><AccordionContent>Spot clean with cold water and a soft brush. Air dry away from heat. Never machine wash.</AccordionContent></AccordionItem>
            <AccordionItem value="s"><AccordionTrigger>Shipping</AccordionTrigger><AccordionContent>Ships in 24h. Standard 3–5 days, express next-day. Returns free within 60 days.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      <div ref={story} className="space-y-4 px-6 py-24 md:px-12">
        {p.features.slice(0, 3).map((f, i) => (
          <div key={f} className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div><p className="text-xs uppercase tracking-[0.3em] text-primary">0{i + 1}</p><h2 data-reveal="chars" className="font-display text-giant"><Split text={f} /></h2></div>
            <div data-reveal="clip" className="flex aspect-video items-center justify-center overflow-hidden rounded-lg" style={{ background: c.bg }}>
              <img src={c.image} alt="" loading="lazy" className="w-[140%] max-w-none" style={{ filter: c.filter, transform: `translateX(${(i - 1) * 20}%) scale(1.4)` }} />
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-10 border-t border-border px-6 py-24 md:grid-cols-[1fr_2fr] md:px-12">
        <div>
          <h2 className="font-display text-big">Reviews</h2>
          <p className="mt-2 font-display text-giant text-primary">{p.rating}</p>
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div key={s} className="mt-2 flex items-center gap-3 text-sm"><span className="w-3">{s}</span>
              <div className="h-1.5 flex-1 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${[78, 15, 4, 2, 1][i]}%` }} /></div></div>
          ))}
        </div>
        <div className="space-y-6">
          {reviews.map((r) => (
            <article key={r.name} className="border-b border-border pb-6">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`} />)}</div>
              <h3 className="mt-2 font-bold">{r.title}</h3><p className="mt-1 text-muted-foreground">{r.body}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{r.name} · Verified buyer</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12">
        <h2 className="mb-8 font-display text-big">You may also <span className="text-primary">like</span></h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </section>

      <div className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border glass p-3 transition-transform duration-500 lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex-1"><p className="font-display text-lg">{p.name}</p><p className="text-sm">{money(finalPrice(p))}{size ? ` · US ${size}` : ""}</p></div>
        <Button variant="volt" onClick={() => addToBag()}>Add to bag</Button>
      </div>
      <Footer />
    </>
  );
}
