import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { products, finalPrice } from "@/data/products";
import { useShop, money } from "@/lib/store";

export function SearchDialog() {
  const open = useShop((s) => s.searchOpen);
  const setOpen = useShop((s) => s.setSearchOpen);
  const navigate = useNavigate();
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(!useShop.getState().searchOpen); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search kicks, lines, sports…" />
      <CommandList data-lenis-prevent>
        <CommandEmpty>Nothing on the shelf for that.</CommandEmpty>
        <CommandGroup heading="Products">
          {products.map((p) => (
            <CommandItem key={p.id} value={`${p.name} ${p.category} ${p.line}`} onSelect={() => { setOpen(false); navigate({ to: "/shop/$slug", params: { slug: p.slug } }); }} className="gap-3">
              <span className="flex h-10 w-12 items-center justify-center rounded" style={{ background: p.colorways[0].bg }}>
                <img src={p.colorways[0].image} alt="" className="w-full" style={{ filter: p.colorways[0].filter }} />
              </span>
              <span className="flex-1">{p.name}<span className="ml-2 text-xs text-muted-foreground">{p.category}</span></span>
              <span>{money(finalPrice(p))}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
