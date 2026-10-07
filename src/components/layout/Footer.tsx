import { Split } from "@/components/Split";
import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/brand";
import { useReveal } from "@/lib/motion";

export function Footer() {
  const ref = useReveal<HTMLElement>();
  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border px-6 pb-6 pt-20 md:px-12">
      <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <p className="max-w-sm text-muted-foreground">{brand.tagline} Performance footwear engineered for the ones who refuse to slow down.</p>
        <nav className="flex flex-col gap-2 text-sm uppercase tracking-widest" aria-label="Footer">
          <Link to="/shop" className="hover:text-primary">Shop</Link><Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link><Link to="/wishlist" className="hover:text-primary">Wishlist</Link>
        </nav>
        <div className="flex flex-col gap-2 text-sm uppercase tracking-widest">
          {brand.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-primary">{s.label}</a>)}
        </div>
      </div>
      <p data-reveal="chars" className="mt-16 whitespace-nowrap font-display text-[17vw] leading-[0.8] text-primary lg:text-[15vw]"><Split text={brand.name} /></p>
      <p className="mt-4 text-xs text-muted-foreground">© 2026 {brand.name}. All rights reserved.</p>
    </footer>
  );
}
