import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { key: string; slug: string; colorway: number; size: number; qty: number };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  bump: number;
  add: (i: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  setCartOpen: (o: boolean) => void;
  setSearchOpen: (o: boolean) => void;
};

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [], wishlist: [], cartOpen: false, searchOpen: false, bump: 0,
      add: (i, qty = 1) => set((s) => {
        const key = `${i.slug}-${i.colorway}-${i.size}`;
        const ex = s.cart.find((c) => c.key === key);
        const cart = ex ? s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c)) : [...s.cart, { ...i, key, qty }];
        return { cart, bump: s.bump + 1 };
      }),
      setQty: (key, qty) => set((s) => ({ cart: s.cart.map((c) => (c.key === key ? { ...c, qty: Math.max(1, qty) } : c)) })),
      remove: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
      clear: () => set({ cart: [] }),
      toggleWish: (slug) => set((s) => ({ wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug] })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    { name: "volt-stride", skipHydration: true, partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }) },
  ),
);

export const money = (n: number) => `$${n.toFixed(0)}`;
