import { Split } from "@/components/Split";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Mail, Phone } from "lucide-react";
import { stores } from "@/data/products";
import { brand } from "@/lib/brand";
import { useReveal } from "@/lib/motion";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — VOLT STRIDE" },
      { name: "description", content: "Questions about orders, sizing or collabs? Reach the VOLT STRIDE crew or visit a flagship store." },
      { property: "og:title", content: "Contact us — VOLT STRIDE" },
      { property: "og:description", content: "Reach the VOLT STRIDE crew or visit a flagship store." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().min(1, "Pick a subject"),
  message: z.string().trim().min(10, "At least 10 characters").max(1000),
});
type Form = z.infer<typeof schema>;

const faqs = [
  ["How do your shoes fit?", "Racers run snug — go half a size up. Lifestyle fits true to size."],
  ["What's the return policy?", "60-day test runs. Worn or not, if they're not for you, send them back free."],
  ["How fast is shipping?", "Orders ship within 24 hours. Standard 3–5 days, express next day."],
  ["Do you ship internationally?", "Yes — to 48 countries. Duties are calculated at checkout."],
];

function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const [sent, setSent] = useState(false);
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { subject: "" } });

  return (
    <div ref={ref}>
      <section className="grid gap-16 px-6 py-16 md:px-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact us</p>
          <h1 data-reveal="chars" className="font-display text-mega"><Split text="Talk fast." /></h1>
          <p data-reveal className="mt-6 max-w-md text-muted-foreground">Orders, sizing, collabs, or you just want to tell us about your PR. We answer within a day.</p>
          <div data-reveal className="mt-10 space-y-3">
            <a href={`mailto:${brand.email}`} className="flex items-center gap-3 hover:text-primary"><Mail className="h-5 w-5 text-primary" />{brand.email}</a>
            <a href={`tel:${brand.phone}`} className="flex items-center gap-3 hover:text-primary"><Phone className="h-5 w-5 text-primary" />{brand.phone}</a>
          </div>
        </div>
        <div data-reveal className="relative rounded-lg border border-border bg-card p-6 md:p-10">
          {sent ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center animate-in zoom-in-90 fade-in duration-500">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-4xl text-primary-foreground">✓</span>
              <h2 className="mt-6 font-display text-big">Message sent.</h2>
              <p className="mt-2 text-muted-foreground">We'll be back in your inbox within 24h.</p>
              <Button variant="ghostline" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form className="grid gap-5" onSubmit={handleSubmit(() => { toast.success("Message received. Talk soon."); reset(); setSent(true); })}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" err={errors.name?.message}><Input {...register("name")} /></Field>
                <Field label="Email" err={errors.email?.message}><Input type="email" {...register("email")} /></Field>
              </div>
              <Field label="Subject" err={errors.subject?.message}>
                <Controller control={control} name="subject" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Subject"><SelectValue placeholder="What's up?" /></SelectTrigger>
                    <SelectContent><SelectItem value="order">Order help</SelectItem><SelectItem value="sizing">Sizing</SelectItem><SelectItem value="collab">Collab / press</SelectItem><SelectItem value="other">Something else</SelectItem></SelectContent>
                  </Select>)} />
              </Field>
              <Field label="Message" err={errors.message?.message}><Textarea rows={5} {...register("message")} /></Field>
              <Button type="submit" variant="volt" size="lg">Send message</Button>
            </form>
          )}
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <h2 data-reveal="chars" className="font-display text-giant"><Split text="Flagships" /></h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            {stores.map((s) => {
              const open = hour !== null && hour >= s.hours[0] && hour < s.hours[1];
              return (
                <div key={s.city} data-reveal className="flex items-center justify-between rounded-lg border border-border p-5">
                  <div><p className="font-display text-2xl">{s.city}</p><p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{s.address} · {s.hours[0]}:00–{s.hours[1]}:00</p></div>
                  {hour !== null && <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${open ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{open ? "Open" : "Closed"}</span>}
                </div>
              );
            })}
          </div>
          <div data-reveal="clip" className="relative min-h-80 overflow-hidden rounded-lg border border-border bg-card speed-lines">
            {stores.map((s, i) => (
              <span key={s.city} className="absolute flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ left: `${[15, 30, 52, 82][i]}%`, top: `${[45, 35, 28, 42][i]}%` }}>
                <span className="relative flex h-3 w-3"><span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-70" /><span className="h-3 w-3 rounded-full bg-primary" /></span>{s.city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12">
        <h2 data-reveal="chars" className="font-display text-giant"><Split text="FAQ" /></h2>
        <Accordion type="single" collapsible className="mt-8 max-w-3xl">
          {faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger className="text-left text-lg">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-xs uppercase tracking-widest">{label}</Label>{children}{err && <p className="text-xs text-hot">{err}</p>}</div>;
}
