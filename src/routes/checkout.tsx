import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { useCartTotals } from "@/components/shop/CartSheet";
import { useShop, money } from "@/lib/store";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — VOLT STRIDE" },
      { name: "description", content: "Secure checkout for your VOLT STRIDE order." },
      { property: "og:title", content: "Checkout — VOLT STRIDE" },
      { property: "og:description", content: "Secure checkout for your VOLT STRIDE order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const shipping = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  address: z.string().trim().min(5, "Enter your street address").max(200),
  city: z.string().trim().min(2, "Enter a city").max(80),
  zip: z.string().trim().min(3, "Enter a postal code").max(12),
});
const payment = z.object({
  card: z.string().regex(/^[\d ]{16,19}$/, "16-digit card number"),
  exp: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "3–4 digits"),
});
type Ship = z.infer<typeof shipping>; type Pay = z.infer<typeof payment>;
const steps = ["Shipping", "Payment", "Review"];

function Checkout() {
  const [step, setStep] = useState(0);
  const [ship, setShip] = useState<Ship | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const { lines, subtotal } = useCartTotals();
  const clear = useShop((s) => s.clear);
  const shipCost = subtotal >= brand.freeShippingThreshold ? 0 : 12;
  const s1 = useForm<Ship>({ resolver: zodResolver(shipping) });
  const s2 = useForm<Pay>({ resolver: zodResolver(payment) });

  if (done) return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="relative h-40 w-56 animate-in zoom-in-50 duration-700">
        <div className="absolute inset-x-0 bottom-0 h-28 rounded bg-primary" />
        <div className="absolute inset-x-[-8px] bottom-24 h-8 origin-bottom-left rounded bg-primary/80 animate-in spin-in-12 duration-1000" />
        <span className="absolute inset-x-0 bottom-8 font-display text-3xl text-primary-foreground">{brand.short}</span>
      </div>
      <h1 className="mt-10 font-display text-giant">Order <span className="text-primary">locked in.</span></h1>
      <p className="mt-3 text-muted-foreground">Order #{done} · Confirmation sent to {ship?.email}.</p>
      <Button variant="volt" size="lg" className="mt-8" asChild><Link to="/shop">Keep shopping</Link></Button>
    </div>
  );

  if (!lines.length) return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-giant">Bag's <span className="text-outline">empty</span></h1>
      <Button variant="volt" size="lg" className="mt-8" asChild><Link to="/shop">Find your pair</Link></Button>
    </div>
  );

  const place = () => {
    const id = `VS${Math.floor(100000 + Math.random() * 900000)}`;
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: ["#C6FF00", "#FF3D00", "#F4F4F0"] });
    clear(); setDone(id);
  };

  return (
    <div className="grid gap-12 px-6 py-16 md:px-12 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <h1 className="font-display text-giant">Checkout</h1>
        <ol className="mt-8 flex gap-6">
          {steps.map((s, i) => (
            <li key={s} className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${i < step ? "bg-primary text-primary-foreground" : i === step ? "border-2 border-primary" : "border border-border"}`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</span>{s}
            </li>
          ))}
        </ol>
        <div key={step} className="mt-10 animate-in fade-in slide-in-from-right-8 duration-500">
          {step === 0 && (
            <form onSubmit={s1.handleSubmit((d) => { setShip(d); setStep(1); })} className="grid gap-5 sm:grid-cols-2">
              <F label="Full name" err={s1.formState.errors.name?.message} className="sm:col-span-2"><Input {...s1.register("name")} defaultValue={ship?.name} /></F>
              <F label="Email" err={s1.formState.errors.email?.message} className="sm:col-span-2"><Input type="email" {...s1.register("email")} /></F>
              <F label="Address" err={s1.formState.errors.address?.message} className="sm:col-span-2"><Input {...s1.register("address")} /></F>
              <F label="City" err={s1.formState.errors.city?.message}><Input {...s1.register("city")} /></F>
              <F label="Postal code" err={s1.formState.errors.zip?.message}><Input {...s1.register("zip")} /></F>
              <Button type="submit" variant="volt" size="lg" className="sm:col-span-2">Continue to payment</Button>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={s2.handleSubmit(() => setStep(2))} className="grid gap-5 sm:grid-cols-2">
              <p className="rounded border border-primary/40 bg-primary/10 p-3 text-sm sm:col-span-2">Demo store — no real charge. Try 4242 4242 4242 4242.</p>
              <F label="Card number" err={s2.formState.errors.card?.message} className="sm:col-span-2"><Input inputMode="numeric" placeholder="4242 4242 4242 4242" {...s2.register("card")} /></F>
              <F label="Expiry" err={s2.formState.errors.exp?.message}><Input placeholder="MM/YY" {...s2.register("exp")} /></F>
              <F label="CVC" err={s2.formState.errors.cvc?.message}><Input inputMode="numeric" {...s2.register("cvc")} /></F>
              <Button type="button" variant="ghostline" size="lg" onClick={() => setStep(0)}>Back</Button>
              <Button type="submit" variant="volt" size="lg">Review order</Button>
            </form>
          )}
          {step === 2 && ship && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Ship to</p>
                <p className="mt-2">{ship.name}<br />{ship.address}, {ship.city} {ship.zip}<br />{ship.email}</p></div>
              <div className="flex gap-3"><Button variant="ghostline" size="lg" onClick={() => setStep(1)}>Back</Button>
                <Button variant="volt" size="lg" className="flex-1" onClick={place}>Place order · {money(subtotal + shipCost)}</Button></div>
            </div>
          )}
        </div>
      </div>
      <aside className="h-fit rounded-lg border border-border bg-card p-6 lg:sticky lg:top-8">
        <h2 className="font-display text-3xl">Summary</h2>
        <div className="mt-6 space-y-4">
          {lines.map((l) => { const c = l.product.colorways[l.colorway]; return (
            <div key={l.key} className="flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 rounded" style={{ background: c.bg }}><img src={c.image} alt="" className="h-full w-full object-contain" style={{ filter: c.filter }} /></div>
              <div className="flex-1 text-sm"><p className="font-bold">{l.product.name} × {l.qty}</p><p className="text-muted-foreground">{c.name} · US {l.size}</p></div>
              <p className="text-sm font-bold">{money((l.product.salePrice ?? l.product.price) * l.qty)}</p>
            </div>); })}
        </div>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipCost ? money(shipCost) : "Free"}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{money(subtotal + shipCost)}</span></div>
        </div>
      </aside>
    </div>
  );
}

function F({ label, err, children, className = "" }: { label: string; err?: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-2 ${className}`}><Label className="text-xs uppercase tracking-widest">{label}</Label>{children}{err && <p className="text-xs text-hot">{err}</p>}</div>;
}
