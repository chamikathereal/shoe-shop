import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveals every [data-reveal] child of the scope on scroll. data-reveal="chars" splits text by characters. */
export function useReveal<T extends HTMLElement>(deps: unknown[] = []): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return;
    const { gsap } = ensureGsap();
    const ctx = gsap.context(() => {
      ref.current!.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const mode = el.dataset.reveal;
        if (reducedMotion()) { gsap.from(el, { opacity: 0, duration: 0.6 }); return; }
        if (mode === "chars") {
          gsap.from(el.querySelectorAll(".ch"), { yPercent: 110, rotate: 8, duration: 0.9, ease: "expo.out", stagger: 0.025,
            scrollTrigger: { trigger: el, start: "top 88%" } });
        } else if (mode === "clip") {
          gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 85%" } });
        } else {
          gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: "expo.out", delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 90%" } });
        }
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/** Magnetic pull towards the cursor. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return ref;
}
