import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useShop, money } from "@/lib/store";
import { getProduct, finalPrice } from "@/data/products";
import { brand } from "@/lib/brand";
import { toast } from "sonner";

export function useCartTotals() {
  const cart = useShop((s) => s.cart);
  const lines = cart.map((c) => ({ ...c, product: getProduct(c.slug)! })).filter((l) => l.product);
  const subtotal = lines.reduce((a, l) => a + finalPrice(l.product) * l.qty, 0);
  return { lines, subtotal };
}

export function CartSheet() {
  const open = useShop((s) => s.cartOpen);
  const setOpen = useShop((s) => s.setCartOpen);
  const { setQty, remove } = useShop();
  const { lines, subtotal } = useCartTotals();
  const [removing, setRemoving] = useState<string | null>(null);
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();
  const left = Math.max(0, brand.freeShippingThreshold - subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-md">
        <div className="border-b border-border p-6">
          <SheetTitle className="font-display text-4xl">Your Bag</SheetTitle>
          <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            {left > 0 ? <>Add <span className="text-primary">{money(left)}</span> for free shipping</> : <span className="text-primary">You unlocked free shipping ⚡</span>}
          </p>
          <Progress value={Math.min(100, (subtotal / brand.freeShippingThreshold) * 100)} className="mt-2 h-1.5 bg-muted [&>div]:bg-primary" />
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6" data-lenis-prevent>
          {lines.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-display text-big text-outline">Empty</p>
              <p className="mt-2 text-muted-foreground">Your bag is waiting for its first pair.</p>
              <Button variant="volt" className="mt-6" onClick={() => setOpen(false)} asChild><Link to="/shop">Shop now</Link></Button>
            </div>
          )}
          {lines.map((l) => {
            const c = l.product.colorways[l.colorway];
            return (
              <div key={l.key} className={`flex gap-4 transition-all duration-300 ${removing === l.key ? "translate-x-full opacity-0" : ""}`}>
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded" style={{ background: c.bg }}>
                  <img src={c.image} alt={l.product.name} className="w-full -rotate-12" style={{ filter: c.filter }} loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <p className="font-display text-xl">{l.product.name}</p>
                    <button aria-label="Remove item" onClick={() => { setRemoving(l.key); setTimeout(() => remove(l.key), 300); }} className="text-muted-foreground hover:text-hot"><X className="h-4 w-4" /></button>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.name} · US {l.size}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button aria-label="Decrease" className="p-2" onClick={() => setQty(l.key, l.qty - 1)}><Minus className="h-3 w-3" /></button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button aria-label="Increase" className="p-2" onClick={() => setQty(l.key, l.qty + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="font-bold">{money(finalPrice(l.product) * l.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {lines.length > 0 && (
          <div className="space-y-4 border-t border-border p-6">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); toast(promo.toUpperCase() === "MOVE10" ? "Code MOVE10 applied at checkout" : "That code didn't stick. Try MOVE10."); }}>
              <Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" aria-label="Promo code" />
              <Button type="submit" variant="outline">Apply</Button>
            </form>
            <div className="flex justify-between text-lg"><span>Subtotal</span><span className="font-bold">{money(subtotal)}</span></div>
            <Button variant="volt" size="lg" className="w-full" onClick={() => { setOpen(false); navigate({ to: "/checkout" }); }}>Checkout</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
