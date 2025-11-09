#vercel link
[Vercel Deployment](https://axiom-trade-table.vercel.app/)

# png
<img width="399" height="758" alt="Screenshot 2025-11-09 140421" src="https://github.com/user-attachments/assets/90e7bfb0-2c67-4705-b269-10614f0fda8e" />



# Axiom Trade — Token Discovery (Pixel-Perfect Replica)

This repository contains a performance-focused, reusable implementation of Axiom Trade's Pulse token discovery table.

## Tech
- **Next.js 14 App Router** + **TypeScript (strict)**
- **Tailwind CSS**
- **Redux Toolkit** (UI/interaction state)
- **React Query** (data fetching/cache)
- **Radix UI** (Tooltip, Popover, Dialog)
- **Atomic/componentized architecture** with reusable hooks and utilities

## Highlights
- Tabs: **New pairs / Final Stretch / Migrated**
- **Sorting** (stable toggle by column)
- **Hover** effects, **click** actions, **tooltip**, **popover**, **modal**
- **Real-time** mock price updates via EventTarget bus (websocket-like)
- **Smooth color transitions** on price updates
- **Loading skeleton + shimmer**, **progressive loading**, **error boundary**
- Responsive down to **320px**

## Getting Started
```bash
pnpm install 
pnpm dev     
```

Open http://localhost:3000

## Pixel-Perfect (≤ 2px diff)
Run the simple visual regression script after starting dev server (and ensure the real site is reachable):
```bash
# 1) Start this app locally: pnpm dev
# 2) In another terminal
node scripts/visual-regression.js
```
Artifacts will be stored in `./vrt-artifacts/` (baseline and diffs).

> Note: External site styling and fonts may change. Adjust thresholds or update selectors in `scripts/visual-regression.js` if needed.

## Deploy (Vercel)
- Push to GitHub
- Import on Vercel, framework: Next.js
- Set `NODE_ENV=production`
- No additional build steps required

## Lighthouse ≥ 90 (mobile & desktop)
Tips already applied:
- React strict mode
- Avoid layout shifts (stable dimensions, borders)
- Memoized rows (`React.memo`) and derived lists (`useMemo`)
- Cached queries with sane `staleTime`
- Minimized client JS in critical path
- No blocking webfonts or external CSS

For best scores:
- Run production build locally: `pnpm build && pnpm start`
- Use Lighthouse in incognito with no extensions

## Auto-layout snapshots
Use devtools responsive mode. Suggested breakpoints:
- 320 px
- 480 px
- 768 px
- 1024 px
- 1280 px

Attach screenshots to README for submission.

## Structure
```
app/
  error.tsx           # Error boundary
  loading.tsx         # Progressive loading
  layout.tsx
  page.tsx
components/
  providers.tsx
  token-discovery.tsx # Table + interactions
  useStore.ts
lib/
  mock-data.ts        # Mock API + WebSocket-like stream
  store.ts            # Redux store
  ui-slice.ts         # UI state (tabs, sort, modal)
  utils.ts            # helpers
styles via tailwind config
scripts/
  visual-regression.js
```

## License
MIT
