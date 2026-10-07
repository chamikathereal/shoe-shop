import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { SmoothScroll, Cursor, Preloader, PageTransition } from "@/components/layout/Effects";
import { CartSheet } from "@/components/shop/CartSheet";
import { SearchDialog } from "@/components/shop/SearchDialog";
import { Toaster } from "@/components/ui/sonner";
import { useShop } from "@/lib/store";
import shoe from "@/assets/shoe-volt.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <img src={shoe} alt="A running shoe sprinting off the page" className="w-72 animate-float" />
      <h1 className="mt-6 font-display text-giant">You ran out <span className="text-primary">of road.</span></h1>
      <p className="mt-4 text-muted-foreground">404 — this page doesn't exist. Turn around, the track is this way.</p>
      <Link to="/" className="mt-8 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground">Back to start</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-big">Tripped up.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Try again</button>
          <a href="/" className="rounded-full border border-border px-6 py-3 text-sm font-bold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VOLT STRIDE — Move different." },
      { name: "description", content: "Performance sneakers for running, basketball, training and the street." },
      { name: "theme-color", content: "#070709" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body className="grain">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { useShop.persist.rehydrate(); }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:p-3 focus:text-primary-foreground">Skip to content</a>
      <Preloader />
      <PageTransition />
      <SmoothScroll />
      <Cursor />
      <Sidebar />
      <MobileNav />
      <main id="main" className="pl-rail pt-16 lg:pt-0">
        <Outlet />
      </main>
      <CartSheet />
      <SearchDialog />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
