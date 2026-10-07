import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { useShop } from "@/lib/store";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — VOLT STRIDE" },
      { name: "description", content: "The pairs you've saved for later." },
      { property: "og:title", content: "Wishlist — VOLT STRIDE" },
      { property: "og:description", content: "The pairs you've saved for later." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const wish = useShop((s) => s.wishlist);
  const items = products.filter((p) => wish.includes(p.slug));
  return (
    <div className="min-h-screen px-6 py-16 md:px-12">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{items.length} saved</p>
      <h1 className="font-display text-mega">Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-20"><p className="text-muted-foreground">Nothing saved yet. Tap the heart on any pair to stash it here.</p>
          <Button variant="volt" size="lg" className="mt-6" asChild><Link to="/shop">Browse the shop</Link></Button></div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}
