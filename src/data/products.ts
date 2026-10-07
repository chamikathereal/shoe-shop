import volt from "@/assets/shoe-volt.png";
import blaze from "@/assets/shoe-blaze.png";
import cream from "@/assets/shoe-cream.png";
import cobalt from "@/assets/shoe-cobalt.png";

/**
 * Product catalogue. To use real photography, drop transparent PNGs in src/assets/
 * and swap the imports above (expected: side profile, facing right, ~1280x896).
 */
export type Category = "Running" | "Basketball" | "Lifestyle" | "Training";
export type Colorway = { name: string; hex: string; image: string; bg: string; filter?: string };
export type Product = {
  id: string; slug: string; name: string; line: string; category: Category;
  gender: "Men" | "Women" | "Unisex"; price: number; salePrice?: number;
  colorways: Colorway[]; sizes: { size: number; inStock: boolean }[];
  description: string; features: string[]; materials: string;
  rating: number; reviews: number; tags: ("NEW" | "HOT" | "LIMITED")[]; popularity: number; releasedAt: string;
};

const sz = (out: number[] = []) =>
  [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13].map((size) => ({ size, inStock: !out.includes(size) }));

const IMG = { volt, blaze, cream, cobalt };
const cw = (name: string, hex: string, img: keyof typeof IMG, bg: string, filter?: string): Colorway =>
  ({ name, hex, image: IMG[img], bg, filter });

export const products: Product[] = [
  { id: "p1", slug: "voltrise-x", name: "VoltRise X", line: "Velocity", category: "Running", gender: "Unisex", price: 220,
    colorways: [cw("Volt Shock", "#C6FF00", "volt", "#1a2400"), cw("Ice Volt", "#7cf2ff", "volt", "#062227", "hue-rotate(70deg)"), cw("Magma", "#ff3d00", "volt", "#2a0a00", "hue-rotate(-60deg)")],
    sizes: sz([6, 13]), description: "Our fastest racer. A full-length carbon plate sandwiched in supercritical foam that snaps back harder the harder you push.",
    features: ["Carbon propulsion plate", "PulseFoam supercritical midsole", "Engineered knit upper", "Rubber traction pods"],
    materials: "Recycled polyester knit, PEBA foam, carbon fibre plate, 30% recycled rubber.", rating: 4.9, reviews: 1284, tags: ["NEW", "HOT"], popularity: 99, releasedAt: "2026-09-12" },
  { id: "p2", slug: "blaze-court-hi", name: "Blaze Court Hi", line: "Court", category: "Basketball", gender: "Men", price: 185, salePrice: 149,
    colorways: [cw("Inferno", "#ff3d00", "blaze", "#2a0b00"), cw("Royal", "#2b5bff", "blaze", "#06102a", "hue-rotate(200deg)"), cw("Toxic", "#9dff00", "blaze", "#142400", "hue-rotate(90deg)")],
    sizes: sz([7, 12]), description: "Built for the drive and the dunk. Locked-in ankle collar, wide base, and a responsive forefoot pod for explosive first steps.",
    features: ["Padded high collar", "Forefoot Zoom pod", "Herringbone outsole", "Full-grain leather overlays"],
    materials: "Full-grain leather, TPU heel counter, solid rubber outsole.", rating: 4.7, reviews: 642, tags: ["HOT"], popularity: 92, releasedAt: "2026-06-01" },
  { id: "p3", slug: "terrace-og", name: "Terrace OG", line: "Heritage", category: "Lifestyle", gender: "Unisex", price: 120,
    colorways: [cw("Bone / Gum", "#efe6d2", "cream", "#2a2620"), cw("Sage", "#a7c4a0", "cream", "#18221a", "hue-rotate(60deg) saturate(1.4)"), cw("Rose", "#e7a7a7", "cream", "#2a1818", "hue-rotate(-30deg) saturate(1.6)")],
    sizes: sz(), description: "A '78 terrace icon, rebuilt. Buttery leather, suede T-bar and a gum cupsole that only gets better with miles.",
    features: ["Suede T-toe overlay", "Natural gum cupsole", "Leather lining", "OrthoLite insole"],
    materials: "Premium leather, cow suede, natural gum rubber.", rating: 4.8, reviews: 2210, tags: [], popularity: 95, releasedAt: "2025-11-20" },
  { id: "p4", slug: "grindframe-tr", name: "GrindFrame TR", line: "Forge", category: "Training", gender: "Men", price: 140,
    colorways: [cw("Cobalt", "#2b5bff", "cobalt", "#06102a"), cw("Crimson", "#ff2a4d", "cobalt", "#2a0610", "hue-rotate(130deg)"), cw("Emerald", "#00c46a", "cobalt", "#00200f", "hue-rotate(-90deg)")],
    sizes: sz([6.5]), description: "Lift heavy, jump high, sprint between. A flat, wide, stable platform with a rope-climb wrap for everything the WOD throws at you.",
    features: ["Flat stable heel", "Rope-guard midfoot wrap", "Breathable mesh", "Multi-directional lugs"],
    materials: "Abrasion-resistant mesh, EVA midsole, sticky rubber.", rating: 4.6, reviews: 418, tags: ["NEW"], popularity: 80, releasedAt: "2026-08-02" },
  { id: "p5", slug: "voltrise-trail", name: "VoltRise Trail", line: "Velocity", category: "Running", gender: "Women", price: 190, salePrice: 159,
    colorways: [cw("Moss", "#8bc34a", "volt", "#101c06", "saturate(0.7)"), cw("Dusk", "#b06cff", "volt", "#1a0a2a", "hue-rotate(160deg)")],
    sizes: sz([9, 9.5]), description: "VoltRise DNA, trail-ready. Rock plate, 4mm lugs and a weatherproof knit for when the road ends.",
    features: ["Rock-shield plate", "4mm lug outsole", "Water-repellent knit", "Gusseted tongue"],
    materials: "Coated knit, PulseFoam, Vibram-style rubber.", rating: 4.7, reviews: 301, tags: [], popularity: 74, releasedAt: "2026-03-14" },
  { id: "p6", slug: "blaze-low-street", name: "Blaze Low Street", line: "Court", category: "Lifestyle", gender: "Unisex", price: 135,
    colorways: [cw("Ember", "#ff3d00", "blaze", "#2a0b00", "saturate(0.8)"), cw("Ultra", "#6c3bff", "blaze", "#120a2a", "hue-rotate(240deg)")],
    sizes: sz([8]), description: "The court silhouette, cut low for the street. All attitude, all day.",
    features: ["Low-cut collar", "Cupsole construction", "Perforated toe box", "Padded tongue"],
    materials: "Tumbled leather, rubber cupsole.", rating: 4.5, reviews: 512, tags: ["LIMITED"], popularity: 88, releasedAt: "2026-07-21" },
  { id: "p7", slug: "terrace-runner", name: "Terrace Runner", line: "Heritage", category: "Running", gender: "Women", price: 110, salePrice: 89,
    colorways: [cw("Fog", "#c9c9c9", "cream", "#1f1f1f", "grayscale(0.7)"), cw("Sky", "#8ec9ff", "cream", "#0b1a2a", "hue-rotate(170deg) saturate(1.5)")],
    sizes: sz([12, 13]), description: "Vintage runner lines with modern comfort foam. Easy miles, easier style.",
    features: ["Retro nylon panels", "Comfort foam", "Waffle outsole", "Reflective heel tab"],
    materials: "Nylon, suede, EVA.", rating: 4.4, reviews: 198, tags: [], popularity: 60, releasedAt: "2025-09-10" },
  { id: "p8", slug: "grindframe-max", name: "GrindFrame Max", line: "Forge", category: "Training", gender: "Women", price: 160,
    colorways: [cw("Volt Blue", "#2bd4ff", "cobalt", "#03202a", "hue-rotate(-30deg)"), cw("Onyx", "#555", "cobalt", "#111", "grayscale(1)")],
    sizes: sz([6]), description: "Max stability for max loads. A dual-density heel and a TPU cage keep you planted.",
    features: ["Dual-density heel", "TPU lateral cage", "Wide toe box", "Lockdown laces"],
    materials: "Mesh, TPU, dual-density EVA.", rating: 4.8, reviews: 233, tags: ["NEW"], popularity: 77, releasedAt: "2026-09-01" },
  { id: "p9", slug: "skyline-hoop", name: "Skyline Hoop", line: "Court", category: "Basketball", gender: "Women", price: 170,
    colorways: [cw("Solar", "#ffb300", "blaze", "#2a1a00", "hue-rotate(25deg)"), cw("Mint", "#40ffc0", "blaze", "#00241a", "hue-rotate(140deg)")],
    sizes: sz([10, 10.5]), description: "Lighter, lower, quicker. Built for guards who live in the passing lane.",
    features: ["Featherweight upper", "Split-pod cushioning", "Data-driven traction", "Internal heel clip"],
    materials: "Synthetic leather, mesh, rubber.", rating: 4.6, reviews: 154, tags: ["HOT"], popularity: 83, releasedAt: "2026-05-11" },
  { id: "p10", slug: "pulse-daily", name: "Pulse Daily", line: "Velocity", category: "Running", gender: "Men", price: 130,
    colorways: [cw("Acid", "#e5ff00", "volt", "#1c1f00", "hue-rotate(-15deg)"), cw("Night", "#4b4b4b", "volt", "#0e0e0e", "grayscale(1) brightness(0.8)")],
    sizes: sz(), description: "Your everyday mileage machine. Soft landings, smooth toe-offs, zero drama.",
    features: ["Max-cushion foam", "Rocker geometry", "Plush heel collar", "Durable outsole"],
    materials: "Mesh, EVA blend, rubber.", rating: 4.5, reviews: 876, tags: [], popularity: 86, releasedAt: "2026-01-20" },
  { id: "p11", slug: "terrace-hi-suede", name: "Terrace Hi Suede", line: "Heritage", category: "Lifestyle", gender: "Men", price: 145,
    colorways: [cw("Mocha", "#a07858", "cream", "#22180f", "sepia(0.6) saturate(1.3)"), cw("Navy", "#2f3f7a", "cream", "#0a0f22", "hue-rotate(200deg) saturate(2) brightness(0.8)")],
    sizes: sz([11]), description: "A heritage high in full suede. Archive energy for the modern rotation.",
    features: ["Full suede upper", "Padded hi collar", "Gum cupsole", "Waxed laces"],
    materials: "Cow suede, gum rubber.", rating: 4.7, reviews: 97, tags: ["LIMITED"], popularity: 70, releasedAt: "2026-08-28" },
  { id: "p12", slug: "grindframe-kids", name: "GrindFrame Jr", line: "Forge", category: "Training", gender: "Unisex", price: 75,
    colorways: [cw("Cobalt", "#2b5bff", "cobalt", "#06102a"), cw("Volt", "#c6ff00", "cobalt", "#1a2400", "hue-rotate(160deg) saturate(1.5)")],
    sizes: sz([12, 13]), description: "Big-kid performance, playground-proof. Easy on, hard to wear out.",
    features: ["Bungee lace option", "Reinforced toe", "Lightweight EVA", "Non-marking outsole"],
    materials: "Mesh, EVA, rubber.", rating: 4.9, reviews: 61, tags: [], popularity: 55, releasedAt: "2026-04-04" },
];

export const categories: Category[] = ["Running", "Basketball", "Lifestyle", "Training"];
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const finalPrice = (p: Product) => p.salePrice ?? p.price;

export const athletes = [
  { name: "Kai Moreno", sport: "800m · Olympian", image: "run" },
  { name: "Dre Holloway", sport: "Streetball · NYC", image: "hoop" },
];

export const reviews = [
  { name: "Maya R.", rating: 5, title: "Felt like cheating", body: "PR'd my 10K by 90 seconds first week. The plate is no joke." },
  { name: "Jordan T.", rating: 5, title: "Instant rotation staple", body: "Fits true to size, looks unreal in person. Got stopped twice on the subway." },
  { name: "Sam K.", rating: 4, title: "Fast but firm", body: "Takes a few runs to break in. After that, pure speed." },
];

export const stores = [
  { city: "Los Angeles", address: "8420 Melrose Ave", hours: [10, 21] as const },
  { city: "New York", address: "112 Mercer St, SoHo", hours: [9, 22] as const },
  { city: "London", address: "34 Carnaby St", hours: [10, 20] as const },
  { city: "Tokyo", address: "6-12 Jingumae, Shibuya", hours: [11, 21] as const },
];
