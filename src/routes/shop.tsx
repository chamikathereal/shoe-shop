import { Split } from "@/components/Split";
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { categories, products, finalPrice, type Category } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ensureGsap, useReveal } from "@/lib/motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/shop")({
  validateSearch: z.object({ cat: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Shop all sneakers — VOLT STRIDE" },
      { name: "description", content: "Running, basketball, lifestyle and training shoes. Filter by size, color, price and more." },
      { property: "og:title", content: "Shop all sneakers — VOLT STRIDE" },
      { property: "og:description", content: "Running, basketball, lifestyle and training shoes." },
    ],
  }),
  component: ShopLayout,
});

function ShopLayout() {
  const isChild = useMatches({ select: (m) => m.some((x) => x.routeId === "/shop/$slug") });
  return isChild ? <Outlet /> : <ShopPage />;
}

const sizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13];
const swatches = [
  { name: "Volt", hex: "#C6FF00" }, { name: "Orange", hex: "#ff3d00" }, { name: "Blue", hex: "#2b5bff" },
  { name: "Neutral", hex: "#efe6d2" }, { name: "Dark", hex: "#4b4b4b" },
];
const colorMatch = (hex: string, sw: string) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.replace("#", "").padEnd(6, s.slice(-1)).slice(i - 1, i + 1), 16));
  const [a, b] = [h(hex), h(sw)];
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 150;
};

function ShopPage() {
  const { cat } = Route.useSearch();
  const [cats, setCats] = useState<Category[]>(cat && categories.includes(cat as Category) ? [cat as Category] : []);
  const [genders, setGenders] = useState<string[]>([]);
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [price, setPrice] = useState([0, 250]);
  const [sale, setSale] = useState(false);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(9);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const header = useReveal<HTMLElement>();

  useEffect(() => { if (cat && categories.includes(cat as Category)) setCats([cat as Category]); }, [cat]);

  const filtered = useMemo(() => {
    const r = products.filter((p) =>
      (!cats.length || cats.includes(p.category)) &&
      (!genders.length || genders.includes(p.gender)) &&
      (size === null || p.sizes.some((s) => s.size === size && s.inStock)) &&
      (!color || p.colorways.some((c) => colorMatch(c.hex, color))) &&
      finalPrice(p) >= price[0] && finalPrice(p) <= price[1] &&
      (!sale || !!p.salePrice));
    return r.sort((a, b) => sort === "low" ? finalPrice(a) - finalPrice(b) : sort === "high" ? finalPrice(b) - finalPrice(a)
      : sort === "popular" ? b.popularity - a.popularity : b.releasedAt.localeCompare(a.releasedAt));
  }, [cats, genders, size, color, price, sale, sort]);
  const shown = filtered.slice(0, limit);

  // Capture positions before every state change, then animate in layout effect.
  const capture = () => { ensureGsap().gsap.registerPlugin(Flip); if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll(".flip-card")); };
  const wrap = <A extends unknown[]>(fn: (...a: A) => void) => (...a: A) => { capture(); fn(...a); };
  useLayoutEffect(() => {
    if (!flipState.current || !grid.current) return;
    Flip.from(flipState.current, { duration: 0.6, ease: "expo.inOut", absolute: true, stagger: 0.02, scale: true,
      onEnter: (els) => ensureGsap().gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => ensureGsap().gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }) });
    flipState.current = null;
  }, [shown.map((p) => p.id).join(), view]);

  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = wrap(() => { setCats([]); setGenders([]); setSize(null); setColor(null); setPrice([0, 250]); setSale(false); });

  const filters = (
    <div className="space-y-8">
      <Group label="Category">
        {categories.map((c) => <Check key={c} label={c} checked={cats.includes(c)} onChange={wrap(() => setCats(toggle(cats, c)))} />)}
      </Group>
      <Group label="Gender">
        {["Men", "Women", "Unisex"].map((g) => <Check key={g} label={g} checked={genders.includes(g)} onChange={wrap(() => setGenders(toggle(genders, g)))} />)}
      </Group>
      <Group label="Size (US)">
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((s) => <button key={s} onClick={wrap(() => setSize(size === s ? null : s))} className={`rounded border py-2 text-xs font-semibold transition-colors ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>{s}</button>)}
        </div>
      </Group>
      <Group label="Color">
        <div className="flex gap-2">
          {swatches.map((s) => <button key={s.name} aria-label={s.name} onClick={wrap(() => setColor(color === s.hex ? null : s.hex))} className={`h-8 w-8 rounded-full border-2 transition-transform ${color === s.hex ? "scale-110 border-foreground" : "border-transparent"}`} style={{ background: s.hex }} />)}
        </div>
      </Group>
      <Group label={`Price · $${price[0]}–$${price[1]}`}>
        <Slider min={0} max={250} step={5} value={price} onValueChange={setPrice} onValueCommit={() => capture()} className="[&_[role=slider]]:border-primary [&>span>span]:bg-primary" />
      </Group>
      <Check label="On sale" checked={sale} onChange={wrap(() => setSale(!sale))} />
      <Button variant="ghostline" className="w-full" onClick={reset}>Reset filters</Button>
    </div>
  );

  return (
    <>
      <header ref={header} className="relative overflow-hidden px-6 pb-10 pt-16 md:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{filtered.length} styles</p>
        <h1 data-reveal="chars" className="mt-2 font-display text-mega"><Split text="Shop all" /></h1>
      </header>
      <div className="flex gap-10 px-6 pb-24 md:px-12">
        <aside className="hidden w-60 shrink-0 lg:block"><div className="sticky top-8">{filters}</div></aside>
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button variant="ghostline" className="lg:hidden" onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> Filters</Button>
            <div className="ml-auto flex items-center gap-2">
              <Select value={sort} onValueChange={wrap(setSort)}>
                <SelectTrigger className="w-44 rounded-full" aria-label="Sort"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem><SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="low">Price: low to high</SelectItem><SelectItem value="high">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
              <button aria-label="Grid view" onClick={wrap(() => setView("grid"))} className={`rounded-full p-2.5 ${view === "grid" ? "bg-primary text-primary-foreground" : "bg-muted"}`}><LayoutGrid className="h-4 w-4" /></button>
              <button aria-label="List view" onClick={wrap(() => setView("list"))} className={`rounded-full p-2.5 ${view === "list" ? "bg-primary text-primary-foreground" : "bg-muted"}`}><List className="h-4 w-4" /></button>
            </div>
          </div>
          {shown.length === 0 ? (
            <div className="py-24 text-center animate-in fade-in zoom-in-95">
              <p className="font-display text-giant text-outline">No match</p>
              <p className="mt-3 text-muted-foreground">Nothing fits that combo. Loosen up a filter.</p>
              <Button variant="volt" className="mt-6" onClick={reset}>Reset filters</Button>
            </div>
          ) : (
            <div ref={grid} className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}>
              {shown.map((p) => <ProductCard key={p.id} p={p} list={view === "list"} />)}
            </div>
          )}
          {filtered.length > limit && (
            <div className="mt-12 text-center"><Button variant="ghostline" size="lg" onClick={wrap(() => setLimit(limit + 6))}>Load more</Button></div>
          )}
        </div>
      </div>
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="overflow-y-auto bg-background" data-lenis-prevent>
          <SheetTitle className="mb-6 font-display text-3xl">Filters</SheetTitle>{filters}
        </SheetContent>
      </Sheet>
      <Footer />
    </>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p><div className="space-y-2">{children}</div></div>;
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <Checkbox checked={checked} onCheckedChange={onChange} className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />{label}
    </label>
  );
}
