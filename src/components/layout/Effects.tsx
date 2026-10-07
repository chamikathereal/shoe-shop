import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import { ensureGsap, reducedMotion } from "@/lib/motion";
import { brand } from "@/lib/brand";

/** Lenis smooth scroll synced to GSAP ScrollTrigger. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const { ScrollTrigger } = ensureGsap();
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, [pathname]);
  return null;
}

/** Dot + ring cursor with labels from [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const { gsap } = ensureGsap();
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e: MouseEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>("a,button,[data-cursor],input,select,textarea,[role=button]");
      const l = t?.dataset.cursor ?? "";
      setLabel(l);
      gsap.to(ring.current, { scale: l ? 2.6 : t ? 1.7 : 1, duration: 0.3 });
    };
    window.addEventListener("mousemove", move);
    return () => { window.removeEventListener("mousemove", move); document.body.classList.remove("has-cursor"); };
  }, []);
  if (!enabled) return <><div ref={dot} hidden /><div ref={ring} hidden /></>;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-primary mix-blend-difference" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[100] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-foreground mix-blend-difference">
        <span className="text-[5px] font-bold tracking-widest text-foreground">{label}</span>
      </div>
    </>
  );
}

/** First-visit preloader: counter 0–100 then clip-path reveal. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (sessionStorage.getItem("vs-loaded") || reducedMotion()) { setDone(true); return; }
    const { gsap } = ensureGsap();
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { sessionStorage.setItem("vs-loaded", "1"); setDone(true); } });
    tl.to(o, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0"); } })
      .to(".pl-word", { yPercent: -110, duration: 0.5, ease: "expo.in" })
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" });
    return () => { tl.kill(); };
  }, []);
  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[90] flex flex-col justify-between bg-primary p-6 text-primary-foreground md:p-10" style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="overflow-hidden"><p className="pl-word font-display text-2xl">{brand.name}</p></div>
      <div className="flex items-end justify-between overflow-hidden">
        <p className="pl-word font-display text-big">{brand.tagline}</p>
        <span ref={num} className="pl-word font-display text-mega">000</span>
      </div>
    </div>
  );
}

/** Colored wipe with brand mark on every route change. */
export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const el = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reducedMotion()) return;
    const { gsap } = ensureGsap();
    const tl = gsap.timeline();
    tl.set(el.current, { display: "flex", clipPath: "inset(0 0 0 0)" })
      .fromTo(".pt-mark", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 })
      .to(el.current, { clipPath: "inset(0 0 0 100%)", duration: 0.7, ease: "expo.inOut" }, "+=0.1")
      .set(el.current, { display: "none" });
    return () => { tl.kill(); };
  }, [pathname]);
  return (
    <div ref={el} aria-hidden className="fixed inset-0 z-[80] hidden items-center justify-center bg-primary">
      <span className="pt-mark font-display text-giant text-primary-foreground">{brand.short}</span>
    </div>
  );
}
