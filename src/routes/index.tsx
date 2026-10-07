import { Split } from "@/components/Split";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ensureGsap, reducedMotion, useMagnetic, useReveal } from "@/lib/motion";
import { products, finalPrice } from "@/data/products";
import { useShop, money } from "@/lib/store";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { flyToCart } from "@/components/shop/ProductCard";
import heroShoe from "@/assets/shoe-volt.png";
import runImg from "@/assets/athlete-run.jpg";
import hoopImg from "@/assets/athlete-hoop.jpg";
import cream from "@/assets/shoe-cream.png";
import cobalt from "@/assets/shoe-cobalt.png";
import blaze from "@/assets/shoe-blaze.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VOLT STRIDE — Run. Jump. Dominate." },
      { name: "description", content: "Carbon-plated racers, court killers and street icons. Shop the latest VOLT STRIDE drops." },
      { property: "og:title", content: "VOLT STRIDE — Run. Jump. Dominate." },
      { property: "og:description", content: "Carbon-plated racers, court killers and street icons. Shop the latest drops." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedDrops />
      <TechSection />
      <Categories />
      <ShopByColor />
      <Stats />
      <Athletes />
      <Drop />
      <Newsletter />
      <Footer />
    </>
  );
}

function Hero() {
  const root = useRef<HTMLElement>(null);
  const shoe = useRef<HTMLImageElement>(null);
  const shop = useMagnetic<HTMLAnchorElement>();
  const film = useMagnetic<HTMLButtonElement>();
  const [filmOpen, setFilmOpen] = useState(false);

  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      if (!reducedMotion()) {
        gsap.from(".hero-ch", { yPercent: 120, rotate: 10, duration: 1.1, ease: "expo.out", stagger: 0.03, delay: 0.2 });
        gsap.from(shoe.current, { x: 300, rotate: 30, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.5 });
        gsap.from(".hero-fade", { y: 30, opacity: 0, duration: 1, stagger: 0.1, delay: 0.9 });
        gsap.to(shoe.current, { rotate: 20, scale: 1.25, yPercent: 40, xPercent: -20, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero-line", { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      }
    }, root);
    const move = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      gsap.to(".hero-layer", { x: (i) => x * (i + 1) * 25, y: (i) => y * (i + 1) * 20, duration: 1 });
      gsap.to(".hero-shoe-wrap", { rotateY: x * 20, rotateX: -y * 15, duration: 1 });
    };
    window.addEventListener("mousemove", move);
    return () => { ctx.revert(); window.removeEventListener("mousemove", move); };
  }, []);

  const lines = ["RUN.", "JUMP.", "DOMINATE."];
  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden speed-lines">
      <div className="hero-layer absolute -right-40 top-10 h-[70vw] w-[70vw] rounded-full glow-volt opacity-70" />
      <div className="hero-layer absolute -left-40 bottom-0 h-[40vw] w-[40vw] rounded-full glow-hot opacity-40" />
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-10 md:px-12">
        <div className="hero-fade flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>FW26 · Velocity Collection</span><span className="hidden md:block">Drop 07 / 12</span>
        </div>
        <h1 className="font-display text-mega leading-[0.82]">
          {lines.map((l, li) => (
            <span key={l} className={`block overflow-hidden ${li === 1 ? "text-outline" : li === 2 ? "text-primary" : ""}`}>
              {[...l].map((c, i) => <span key={i} className="hero-ch inline-block">{c}</span>)}
            </span>
          ))}
        </h1>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-sm text-muted-foreground">VoltRise X. Full-length carbon. Supercritical foam. The fastest shoe we've ever built — and it looks like it.</p>
          <div className="hero-fade flex flex-wrap gap-3">
            <Button variant="volt" size="lg" asChild><Link ref={shop} to="/shop">Shop now <ArrowRight /></Link></Button>
            <Button ref={film} variant="ghostline" size="lg" onClick={() => setFilmOpen(true)}><Play /> Watch film</Button>
          </div>
        </div>
      </div>
      <div className="hero-shoe-wrap pointer-events-none absolute inset-y-0 right-[-10%] z-20 flex w-[95%] items-center md:right-[-4%] md:w-[62%] [perspective:1200px]">
        <img ref={shoe} src={heroShoe} alt="VoltRise X running shoe in Volt Shock" width={1280} height={896} className="hero-layer w-full animate-float drop-shadow-[0_60px_50px_rgba(0,0,0,0.6)]" />
      </div>
      <p className="hero-line pointer-events-none absolute bottom-[18%] left-0 z-0 whitespace-nowrap font-display text-[22vw] leading-none text-outline opacity-10">VOLTRISE X · VOLTRISE X</p>
      <Dialog open={filmOpen} onOpenChange={setFilmOpen}>
        <DialogContent className="max-w-4xl overflow-hidden border-border bg-background p-0">
          <DialogTitle className="sr-only">Brand film</DialogTitle>
          <div className="relative aspect-video">
            <img src={runImg} alt="Athlete sprinting at night" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background p-8"><p className="font-display text-big">Move different.<br /><span className="text-primary">Film drops Friday.</span></p></div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    if (reducedMotion()) return;
    const tween = gsap.to(track.current, { xPercent: -50, repeat: -1, duration: 20, ease: "none" });
    const st = ScrollTrigger.create({ onUpdate: (s) => {
      const v = Math.min(Math.abs(s.getVelocity()) / 300, 6);
      gsap.to(tween, { timeScale: (s.direction) * (1 + v), duration: 0.2, overwrite: true });
      gsap.to(tween, { timeScale: s.direction, duration: 1, delay: 0.3 });
    } });
    return () => { tween.kill(); st.kill(); };
  }, []);
  const words = ["Move different", "Carbon plated", "Built to break records", "Street certified", "Zero chill"];
  return (
    <div className="relative z-30 -rotate-2 overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground">
      <div ref={track} className="flex w-max gap-10 whitespace-nowrap font-display text-5xl md:text-7xl">
        {[...words, ...words, ...words, ...words].map((w, i) => <span key={i} className="flex items-center gap-10">{w}<span className="text-hot">✦</span></span>)}
      </div>
    </div>
  );
}

function FeaturedDrops() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drops = products.filter((p) => p.tags.length).slice(0, 6);
  const add = useShop((s) => s.add);
  useEffect(() => {
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => track.current!.scrollWidth - window.innerWidth + 200;
      gsap.to(track.current, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: section.current, pin: true, scrub: 1, end: () => `+=${dist()}`, invalidateOnRefresh: true,
          onUpdate: (s) => {
            const i = Math.min(drops.length - 1, Math.floor(s.progress * drops.length));
            gsap.to(section.current, { backgroundColor: drops[i].colorways[0].bg, duration: 0.6 });
          } } });
    });
    return () => mm.revert();
  }, [drops]);
  return (
    <div>
    <section ref={section} className="relative overflow-hidden py-24 transition-colors md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center">
        <div className="mb-10 flex items-end justify-between px-6 md:px-12">
          <h2 className="font-display text-giant">Featured <span className="text-outline-volt">drops</span></h2>
          <Link to="/shop" className="hidden text-sm font-bold uppercase tracking-widest hover:text-primary md:block">View all →</Link>
        </div>
        <div ref={track} className="flex gap-6 overflow-x-auto px-6 md:overflow-visible md:px-12">
          {drops.map((p) => {
            const c = p.colorways[0];
            return (
              <article key={p.id} className="group relative w-[80vw] shrink-0 overflow-hidden rounded-lg border border-border glass md:w-[38vw]">
                <Link to="/shop/$slug" params={{ slug: p.slug }} data-cursor="VIEW" className="relative block aspect-[4/3]">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 60%, ${c.hex}55, transparent 65%)` }} />
                  <img src={c.image} alt={p.name} loading="lazy" className="drop-img absolute inset-x-[6%] top-[12%] w-[88%] -rotate-12 transition-transform duration-700 group-hover:-rotate-3 group-hover:scale-110" style={{ filter: c.filter }} />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${p.tags[0] === "HOT" ? "bg-hot text-hot-foreground" : "bg-primary text-primary-foreground"}`}>{p.tags[0]}</span>
                </Link>
                <div className="flex items-center justify-between p-5">
                  <div><p className="font-display text-3xl">{p.name}</p><p className="text-sm text-muted-foreground">{p.category} · {money(finalPrice(p))}</p></div>
                  <Button variant="volt" data-cursor="ADD" onClick={(e) => { add({ slug: p.slug, colorway: 0, size: 10 }); flyToCart(e.currentTarget.closest("article")!.querySelector(".drop-img")); toast.success(`${p.name} added`); }}>Add</Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
    </div>
  );
}

function TechSection() {
  const root = useRef<HTMLElement>(null);
  const callouts = [
    { t: "PulseFoam", d: "Supercritical foam. 87% energy return.", pos: "left-[4%] top-[18%]" },
    { t: "Carbon plate", d: "Full-length. Snaps you forward.", pos: "right-[4%] top-[28%]" },
    { t: "AeroKnit mesh", d: "Weighs less than your phone case.", pos: "left-[6%] bottom-[18%]" },
    { t: "GripLock pods", d: "Wet road? Still planted.", pos: "right-[6%] bottom-[12%]" },
  ];
  useEffect(() => {
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, pin: true, scrub: 1, start: "top top", end: "+=2200" } });
      tl.to(".x-upper", { y: -110, rotate: -6, ease: "none" }, 0)
        .to(".x-sole", { y: 110, rotate: 3, ease: "none" }, 0)
        .to(".x-plate", { scaleX: 1, opacity: 1, ease: "none" }, 0.2);
      callouts.forEach((_, i) => tl.from(`.x-call-${i}`, { opacity: 0, y: 40, duration: 0.3 }, 0.2 + i * 0.25));
    });
    return () => mm.revert();
  }, []);
  return (
    <div>
    <section ref={root} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <h2 className="absolute top-12 z-10 text-center font-display text-big">Tech that <span className="shine-text">moves you</span></h2>
      <div className="relative w-[80%] max-w-4xl">
        <div className="absolute inset-0 glow-volt opacity-60" />
        <div className="x-upper relative" style={{ clipPath: "inset(0 0 42% 0)" }}><img src={heroShoe} alt="" className="w-full" /></div>
        <div className="x-plate absolute left-[8%] right-[8%] top-[57%] h-2 origin-left scale-x-0 rounded-full bg-primary opacity-0 shadow-volt" />
        <div className="x-sole absolute inset-0" style={{ clipPath: "inset(58% 0 0 0)" }}><img src={heroShoe} alt="Exploded view of the VoltRise X" className="w-full" /></div>
      </div>
      {callouts.map((c, i) => (
        <div key={c.t} className={`x-call-${i} absolute ${c.pos} hidden max-w-[220px] border-l-2 border-primary pl-4 md:block`}>
          <p className="font-display text-2xl text-primary">0{i + 1} {c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p>
        </div>
      ))}
    </section>
    </div>
  );
}

function Categories() {
  const ref = useReveal<HTMLElement>();
  const cats = [
    { name: "Running", img: runImg, shoe: heroShoe },
    { name: "Basketball", img: hoopImg, shoe: blaze },
    { name: "Lifestyle", img: null, shoe: cream },
    { name: "Training", img: null, shoe: cobalt },
    { name: "Kids", img: null, shoe: cobalt },
  ];
  return (
    <section ref={ref} className="px-6 py-28 md:px-12">
      <h2 data-reveal="chars" className="font-display text-giant"><Split text="Pick your game" /></h2>
      <div className="mt-12 grid gap-4 md:grid-cols-5">
        {cats.map((c, i) => (
          <Link key={c.name} to="/shop" search={{ cat: c.name === "Kids" ? undefined : c.name }} data-reveal data-delay={i * 0.08} data-cursor="SHOP"
            className={`group relative flex aspect-[3/4] items-end overflow-hidden rounded-lg border border-border bg-card p-5 ${i < 2 ? "md:col-span-1" : ""}`}>
            {c.img && <img src={c.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-700 [clip-path:circle(30%_at_50%_40%)] group-hover:opacity-80 group-hover:[clip-path:circle(100%_at_50%_50%)]" />}
            <img src={c.shoe} alt="" loading="lazy" className="absolute left-1/2 top-[30%] w-[110%] -translate-x-1/2 -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3" />
            <div className="relative flex w-full items-center justify-between"><span className="font-display text-3xl">{c.name}</span><ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:text-primary" /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShopByColor() {
  const p = products[0];
  const [i, setI] = useState(0);
  const sec = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const pick = (n: number) => {
    const { gsap } = ensureGsap();
    gsap.to(img.current, { x: -60, opacity: 0, rotate: -25, duration: 0.25, onComplete: () => {
      setI(n); gsap.fromTo(img.current, { x: 60, rotate: 0 }, { x: 0, opacity: 1, rotate: -12, duration: 0.6, ease: "expo.out" });
    } });
    gsap.to(sec.current, { backgroundColor: p.colorways[n].bg, duration: 0.8 });
  };
  const c = p.colorways[i];
  return (
    <section ref={sec} className="relative overflow-hidden px-6 py-28 md:px-12" style={{ backgroundColor: p.colorways[0].bg }}>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Shop by color</p>
          <h2 className="mt-3 font-display text-giant">{c.name}</h2>
          <div className="mt-8 flex gap-3">
            {p.colorways.map((cw, n) => (
              <button key={cw.name} aria-label={cw.name} onClick={() => pick(n)} className={`h-12 w-12 rounded-full border-4 transition-transform ${n === i ? "scale-110 border-foreground" : "border-transparent"}`} style={{ background: cw.hex }} />
            ))}
          </div>
          <Button variant="volt" size="lg" className="mt-10" asChild><Link to="/shop/$slug" params={{ slug: p.slug }}>Shop {p.name}</Link></Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${c.hex}77, transparent 60%)` }} />
          <img ref={img} src={c.image} alt={`${p.name} in ${c.name}`} loading="lazy" className="relative w-full -rotate-12 drop-shadow-[0_40px_40px_rgba(0,0,0,0.5)]" style={{ filter: c.filter }} />
        </div>
      </div>
    </section>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const { gsap } = ensureGsap();
    const o = { v: 0 };
    const t = gsap.to(o, { v: to, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el.current, start: "top 90%" },
      onUpdate: () => { if (el.current) el.current.textContent = Math.round(o.v).toLocaleString() + suffix; } });
    return () => { t.kill(); };
  }, [to, suffix]);
  return <span ref={el}>0{suffix}</span>;
}

function Stats() {
  const s = [{ n: 87, s: "%", l: "Energy return" }, { n: 212, s: "g", l: "VoltRise X weight" }, { n: 41, s: "", l: "Records broken in VS" }, { n: 2400000, s: "+", l: "Squad members" }];
  return (
    <section className="grid grid-cols-2 border-y border-border md:grid-cols-4">
      {s.map((x) => (
        <div key={x.l} className="border-border p-8 odd:border-r md:border-r md:p-12">
          <p className="font-display text-big text-primary"><CountUp to={x.n} suffix={x.s} /></p>
          <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{x.l}</p>
        </div>
      ))}
    </section>
  );
}

function Athletes() {
  const ref = useReveal<HTMLElement>();
  const a = [
    { name: "Kai Moreno", role: "800m · Olympian", img: runImg, q: "The plate doesn't push you. It dares you." },
    { name: "Dre Holloway", role: "Streetball · NYC", img: hoopImg, q: "Every court is home court in these." },
  ];
  return (
    <section ref={ref} className="px-6 py-28 md:px-12">
      <h2 data-reveal="chars" className="font-display text-giant"><Split text="The" /> <Split text="squad" className="text-hot" /></h2>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {a.map((x) => (
          <figure key={x.name} className="group relative overflow-hidden rounded-lg">
            <img data-reveal="clip" src={x.img} alt={`${x.name}, ${x.role}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-8">
              <p className="font-display text-big">{x.name}</p><p className="text-xs uppercase tracking-widest text-primary">{x.role}</p>
              <blockquote className="mt-3 max-w-sm text-muted-foreground">"{x.q}"</blockquote>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">#VoltStrideSquad</p>
      <div className="mt-6 columns-2 gap-4 md:columns-4">
        {[heroShoe, cream, blaze, cobalt, runImg, hoopImg, cream, heroShoe].map((src, i) => (
          <div key={i} className={`mb-4 break-inside-avoid overflow-hidden rounded-lg ${i % 3 === 0 ? "bg-primary/20" : i % 3 === 1 ? "bg-hot/20" : "bg-card"}`}>
            <img src={src} alt="Community post" loading="lazy" className={`w-full transition-transform duration-700 hover:scale-110 ${i % 2 ? "aspect-square object-cover" : "p-6"}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Drop() {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.now() + 1000 * 60 * 60 * 52 + 1000 * 60 * 17;
    const tick = () => setT(Math.max(0, target - Date.now()));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  const parts = t === null ? ["--", "--", "--", "--"] : [Math.floor(t / 864e5), Math.floor(t / 36e5) % 24, Math.floor(t / 6e4) % 60, Math.floor(t / 1e3) % 60].map((n) => String(n).padStart(2, "0"));
  return (
    <section className="relative overflow-hidden bg-hot px-6 py-24 text-hot-foreground md:px-12 skew-cut">
      <p className="text-xs font-bold uppercase tracking-[0.3em]">Limited drop · 500 pairs</p>
      <h2 className="mt-2 font-display text-giant">Terrace Hi Suede</h2>
      <div className="mt-8 flex gap-4 md:gap-8">
        {parts.map((p, i) => (
          <div key={i}><p className="font-display text-giant tabular-nums">{p}</p><p className="text-xs font-bold uppercase tracking-widest">{["Days", "Hrs", "Min", "Sec"][i]}</p></div>
        ))}
      </div>
      <img src={cream} alt="" loading="lazy" className="pointer-events-none absolute -right-20 bottom-0 hidden w-[45%] -rotate-12 md:block" style={{ filter: "sepia(0.6) saturate(1.3)" }} />
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="px-6 py-28 text-center md:px-12">
      <h2 className="font-display text-giant">First on <span className="text-primary">the line.</span></h2>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">Early access to drops, athlete stories and zero spam. Ever.</p>
      <form className="mx-auto mt-8 flex max-w-md gap-2" onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("That email looks off."); return; }
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.8 }, colors: ["#C6FF00", "#FF3D00", "#F4F4F0"] });
        toast.success("You're in. Welcome to the squad."); setEmail("");
      }}>
        <Input type="email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@fast.com" className="h-14 rounded-full px-6" />
        <Button type="submit" variant="volt" size="lg">Join</Button>
      </form>
    </section>
  );
}
