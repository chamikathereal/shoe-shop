<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Catalogue/brand data lives in typed local modules (src/data, src/lib/brand.ts); cart+wishlist in a persisted zustand store rehydrated on mount — avoids SSR hydration mismatch.
- All GSAP effects run inside effects with gsap.context/matchMedia cleanup; Lenis drives ScrollTrigger via gsap.ticker.
