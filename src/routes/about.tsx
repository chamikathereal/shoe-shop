import { Split } from "@/components/Split";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Flame, Leaf, Rocket, Users } from "lucide-react";
import { ensureGsap, reducedMotion, useReveal } from "@/lib/motion";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import runImg from "@/assets/athlete-run.jpg";
import hoopImg from "@/assets/athlete-hoop.jpg";
import shoe from "@/assets/shoe-volt.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — VOLT STRIDE" },
      { name: "description", content: "Born on a midnight track in 2014. The story, values and people behind VOLT STRIDE." },
      { property: "og:title", content: "About us — VOLT STRIDE" },
      { property: "og:description", content: "Born on a midnight track. The story behind VOLT STRIDE." },
    ],
  }),
  component: About,
});

const statement = "We don't make shoes for people who wait for the right moment. We make them for people who sprint at it.";
const timeline = [
  { y: "2014", t: "Midnight track", d: "Two ex-sprinters glue a carbon shank into a thrift-store racer. It works." },
  { y: "2017", t: "First drop", d: "500 pairs of the VoltRise 1. Gone in 11 minutes." },
  { y: "2020", t: "Court entry", d: "Blaze Court launches on the playgrounds of Queens before any store." },
  { y: "2023", t: "Zero-waste lab", d: "Our Portland lab cuts factory waste by 62% with knit-to-shape uppers." },
  { y: "2026", t: "VoltRise X", d: "Our fastest shoe yet. 41 records and counting." },
];

function About() {
  const root = useRef<HTMLDivElement>(null);
  const reveal = useReveal<HTMLDivElement>();
  useEffect(() => {
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      if (reducedMotion()) return;
      gsap.to(".hl-word", { opacity: 1, color: "var(--primary)", stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".hl", start: "top 70%", end: "bottom 30%", scrub: true } });
      gsap.fromTo(".tl-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl", start: "top 60%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) =>
        gsap.from(el, { clipPath: "inset(0 100% 0 0)", x: -30, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 75%" } }));
      gsap.utils.toArray<HTMLElement>(".px").forEach((el, i) =>
        gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * 15, ease: "none", scrollTrigger: { trigger: el, scrub: true } }));
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <section className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden px-6 pb-16 md:px-12">
        <img src={shoe} alt="" className="absolute -right-20 top-10 w-[60%] -rotate-12 opacity-30" />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About us</p>
        <h1 className="font-display text-mega">Born <span className="text-outline">at</span><br /><span className="text-primary">midnight.</span></h1>
      </section>

      <section className="hl px-6 py-32 md:px-12">
        <p className="max-w-6xl font-display text-big leading-[1.05]">
          {statement.split(" ").map((w, i) => <span key={i} className="hl-word opacity-20">{w} </span>)}
        </p>
      </section>

      <section className="tl relative px-6 py-24 md:px-12">
        <h2 className="mb-16 font-display text-giant">The run so far</h2>
        <div className="relative pl-10 md:pl-16">
          <div className="tl-line absolute left-2 top-0 h-full w-0.5 origin-top bg-primary md:left-4" />
          {timeline.map((t) => (
            <div key={t.y} className="tl-item relative mb-16">
              <span className="absolute -left-[2.35rem] top-3 h-4 w-4 rounded-full bg-primary shadow-volt md:-left-[3.35rem]" />
              <p className="font-display text-giant text-outline-volt">{t.y}</p>
              <h3 className="font-display text-3xl">{t.t}</h3><p className="mt-1 max-w-lg text-muted-foreground">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div ref={reveal}>
        <section className="px-6 py-24 md:px-12">
          <h2 data-reveal="chars" className="font-display text-giant"><Split text="What we run on" /></h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[{ i: Rocket, t: "Speed first", d: "If it doesn't make you faster, it doesn't ship." }, { i: Flame, t: "Built loud", d: "Design that refuses to blend into the start line." },
              { i: Leaf, t: "Lighter footprint", d: "62% less waste. 30% recycled rubber in every sole." }, { i: Users, t: "Squad over solo", d: "Run clubs in 40 cities. Free. Always." }].map((v, n) => (
              <SpotCard key={v.t} delay={n * 0.08}><v.i className="h-8 w-8 text-primary" /><h3 className="mt-6 font-display text-3xl">{v.t}</h3><p className="mt-2 text-muted-foreground">{v.d}</p></SpotCard>
            ))}
          </div>
        </section>
        <section className="grid gap-5 overflow-hidden px-6 py-24 md:grid-cols-3 md:px-12">
          <img src={runImg} alt="Night training session" loading="lazy" className="px aspect-[3/4] w-full rounded-lg object-cover" />
          <img src={hoopImg} alt="Court testing" loading="lazy" className="px mt-16 aspect-[3/4] w-full rounded-lg object-cover" />
          <div className="px flex aspect-[3/4] items-center justify-center rounded-lg bg-primary"><img src={shoe} alt="Prototype in the lab" loading="lazy" className="w-[90%] -rotate-12" /></div>
        </section>
        <section className="px-6 py-24 text-center md:px-12">
          <h2 data-reveal="chars" className="font-display text-giant"><Split text="Your move." /></h2>
          <Button variant="volt" size="lg" className="mt-8" asChild><Link to="/shop">Shop the collection</Link></Button>
        </section>
      </div>
      <Footer />
    </div>
  );
}

function SpotCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} data-reveal data-delay={delay}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`); ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`); }}
      className="relative overflow-hidden rounded-lg border border-border bg-card p-8 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(300px_circle_at_var(--mx)_var(--my),color-mix(in_oklab,var(--primary)_18%,transparent),transparent_60%)] before:opacity-0 before:transition-opacity hover:before:opacity-100">
      {children}
    </div>
  );
}
