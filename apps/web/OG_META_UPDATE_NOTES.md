# OG meta update notes

## Change made
Updated `apps/web/dist/index.html` to reference **meta.png** (user intent correction) for share previews.

## Current state to verify
1. `meta.png` must be available at the deployed site root URL `/meta.png`.
2. If hosting is not copying `apps/web/public/meta.png` to the root, adjust build/public placement.

## Relevant tags (should exist in built HTML)
- `og:image` / `twitter:image` should point to `/meta.png`
- `og:image:width` and `og:image:height` should match the image aspect (commonly 1200x630).

