# TODO - Bloom Scrunchies Premium Redesign (apps/web)

## Step 1: Design tokens / CSS variables
- [x] Create base TODO file
- [ ] Update `apps/web/src/index.css` to add required Bloom palette tokens and map existing theme variables (`--cream`, `--rouge`, etc.) to them.
- [ ] Add subtle luxury gradients/shadow helpers in `apps/web/src/index.css`.

## Step 2: Component color pass
- [ ] Inspect and update any components that hardcode color styles (CTAs, buttons, borders, backgrounds, inputs).
- [ ] Ensure hover states + focus rings use derived Palm Leaf shades.

## Step 3: Section coverage
- [ ] Verify styling for: announcement bar, navigation (desktop+mobile), hero, product cards/grids, collection pages, product pages, cart drawer, testimonials/reviews, newsletter, footer, forms/inputs, modals/popups.

## Step 4: Accessibility + polish
- [ ] Validate contrast for primary CTAs and text.
- [ ] Ensure reduced-motion preferences keep animations accessible.

## Step 5: Build/test
- [ ] Run `npm run build` (and `npm run dev` smoke test if available).
- [ ] Smoke test checkout/cart flows.

