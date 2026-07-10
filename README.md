# TurfNext — Coming Soon (Next.js App Router)

A production-ready conversion of the original static HTML/CSS/JS "coming soon"
page into a Next.js 16 application using the App Router, plain JavaScript
(no TypeScript), and Tailwind CSS.

## Stack

- Next.js **16.2.6** (App Router)
- React 19
- Tailwind CSS 3
- Plain JavaScript / JSX only — no `.ts` / `.tsx` files anywhere

## Folder structure

```
turfnext/
├─ app/
│  ├─ layout.jsx          # Root layout: fonts, metadata, JSON-LD, background FX
│  ├─ page.jsx             # Home ("coming soon") route  →  /
│  ├─ globals.css          # Tailwind directives + tiny non-utility CSS
│  ├─ robots.js            # Dynamic robots.txt
│  ├─ sitemap.js           # Dynamic sitemap.xml
│  ├─ player/
│  │  └─ page.jsx          # Player registration route  →  /player
│  └─ owner/
│     └─ page.jsx          # Turf owner listing route    →  /owner
├─ components/
│  ├─ Logo.jsx              # Brand mark (inline SVG + wordmark)
│  ├─ Header.jsx             # Top nav — "launching soon" tag or back link
│  ├─ BackgroundFX.jsx       # Parallax blobs / grid / vignette (client)
│  ├─ Hero.jsx               # Home hero: headline, countdown, CTAs, sports
│  ├─ CountdownTimer.jsx     # Live countdown (client)
│  ├─ Features.jsx           # "What's coming" 3-card grid
│  ├─ Footer.jsx              # Site footer (home page only)
│  ├─ PlayerForm.jsx          # Player registration form (client)
│  ├─ OwnerForm.jsx           # Turf owner form incl. map + geolocation (client)
│  ├─ ChipGroup.jsx           # Reusable multi-select chip control (client)
│  ├─ RadioChipGroup.jsx      # Reusable single-select chip control (client)
│  └─ SuccessView.jsx         # Shared "submitted" success state
├─ public/
│  ├─ images/                 # (empty — design uses inline SVG + emoji only)
│  └─ icons/
├─ lib/                        # Reserved for shared utilities/helpers
├─ package.json
├─ next.config.mjs
├─ tailwind.config.js
├─ postcss.config.js
└─ jsconfig.json               # "@/*" path alias, JS-only project
```

## Getting started

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

### Production build

```bash
npm run build
npm run start
```

## Routes

| Route      | Purpose                                             |
|------------|------------------------------------------------------|
| `/`        | Coming-soon landing page (hero, countdown, features)  |
| `/player`  | Player registration form                              |
| `/owner`   | Turf owner / venue listing form (map + geolocation)   |

The original single-file SPA used `showPage()` + `history.pushState` to swap
`.page` divs and a `#hash`. That's replaced here with real Next.js routes
(`next/link`, `next/navigation`), which gives you working back/forward
buttons, shareable URLs, per-page `<title>`/meta tags, and better SEO —
while preserving the exact same visual transitions and behavior.

## Notable implementation notes

- **Countdown**: `CountdownTimer` is a client component. It starts at `--`
  during server render / first paint (avoids hydration mismatches) and then
  computes a 30-days-from-now target on mount, ticking every second — same
  behavior as the original inline `<script>`.
- **Chips & radio-chips**: converted into reusable, accessible
  (`role="group"`/`role="radiogroup"`, `aria-pressed`/`aria-checked`) client
  components, with hidden inputs so selections are included in native form
  submission.
- **Map + geolocation**: `OwnerForm` debounces the "Location / Area" text
  input (700ms, same as original) to update a Google Maps embed (no API key
  required), and offers a "Use My Current Location" button backed by the
  browser Geolocation API.
- **Background FX**: blobs, dotted grid, and vignette are rendered once in
  the root layout so they persist and stay smooth across route changes; the
  scroll-linked parallax updates DOM styles directly via refs (not React
  state) to avoid re-renders on every scroll frame.
- **Styling**: converted almost entirely to Tailwind utility classes,
  including arbitrary-value utilities for `clamp()`-based fluid spacing/type
  and the CSS variable-driven colors from the original design (mapped to
  `tailwind.config.js` theme extensions: `bg`, `card`, `accent`, `muted`,
  etc.). No CSS Modules were needed — the only non-utility CSS left in
  `globals.css` is the Google-Maps-iframe filter and scrollbar hiding, which
  Tailwind can't express natively.
- **SEO**: per-route `metadata` exports (title template, description,
  canonical), Open Graph + Twitter card data in the root layout,
  `Organization` / `WebSite` / `SoftwareApplication` JSON-LD, plus dynamic
  `app/robots.js` and `app/sitemap.js`.
- **Forms are currently front-end only.** Submitting either form flips to a
  success view, matching the original's behavior — hook `handleSubmit` in
  `PlayerForm.jsx` / `OwnerForm.jsx` up to your backend (API route, Google
  Sheets, Airtable, etc.) to actually persist submissions.

## Environment variables

None required. The app runs with zero configuration — no API keys are
needed (the map uses the keyless Google Maps embed URL, exactly as in the
original HTML).

## Before deploying to production

Update the placeholder `siteUrl` (`https://turfnext.com`) in `app/layout.jsx`,
`app/robots.js`, and `app/sitemap.js`, and the social links in
`components/Footer.jsx`, to your real domain and accounts.
