# CAPTRIX FUNDED — Structured Frontend

This is the generated Captrix prototype split out of the original single-file build.

## Structure
- `index.html` — document shell
- `styles.css` — global styles + responsive/theme fixes
- `js/app.jsx` — React application/components
- `js/tailwind.config.js` — Tailwind runtime configuration

## Changes in this pass
- Split the generated single-file app into separate HTML/CSS/JSX files.
- Preserved the existing public site, dashboard, challenge data and Spin & Win implementation.
- Fixed dashboard top-bar overflow/cutoff on mobile and very small widths.
- Added safer responsive account selector behavior.
- Added a dashboard theme control cycling Dark → Light → System.
- Added light-theme overrides while preserving Captrix cyan/blue branding.
- Added phone safe-area viewport handling.

Run through HTTP(S), not `file://`, because React/Babel external assets are loaded by the page.

## v2 update
- Palette: brand tokens (obsidian #0b0c10, cyan #11D6FF, blue #1478FF) now drive BOTH themes; light theme uses AA-safe cyan/blue text shades.
- Liquid glass layer (styles.css, bottom): translucent surfaces, specular edges, sheen, cut-corner "Lambo" radii and HUD corner brackets. Real `backdrop-filter` only on overlays/header, never on panels (it traps `position:fixed` children).
- Spin & Win rebuilt as an SVG wheel (crisp on every screen, GPU rotation). Prize board shows $1K / $5K / $10K / $25K ACCOUNT + TRY AGAIN. Cost 100 credits. Removed from the homepage; lives only in the dashboard under Spin & Win.
- Fixes: old wheel overflowed at 320px (conflicting h-[] classes), used alert(), dashboard spin never sent notifications, FAQ made unsupported claims (95% split, retake tokens).
- TO CONFIRM with Captrix: spin odds/terms, winners-feed source, real prize rules. The spin outcome must be decided server-side in production.

## v3 update
- Real Captrix logo added (`assets/logo-dark.png`, `assets/logo-light.png`, favicon). The `<CaptrixLogo/>` component swaps the variant with the theme; used in the public header, footer, dashboard sidebar and mobile drawer, login modal and the Spin wheel hub.
- Removed every "Trader OS" label and the "Explore Trader App" button. No public button enters the dashboard without logging in (the showcase CTA now opens Login).
- Homepage header is now: logo, Login, menu button. The menu opens a right-hand glass drawer (Corridor, Challenges, How It Works, FAQ, Get Funded, Login). Desktop keeps the inline links.

## v4 update
- Fixed invisible/blurred gradient text ("FUNDED", "Target & Floor.") in light mode: the glossy-button styling was leaking onto gradient text.
- Light-mode contrast pass: darker slate/profit/loss/warning text, readable hover states, light hero grid, chart gridlines and scrollbars.
- Floating back-to-top arrow on the public homepage (appears after scrolling, smooth scroll, respects reduced motion).

## v5 update
- Gradient brand text (FUNDED, "Target & Floor.") restored and made readable: light mode uses a deeper cyan-to-blue gradient; dark mode is unchanged.


## v6 update
- Preserved the v4 floating back-to-top arrow and its reduced-motion behavior.
- Restored reliable gradient/liquid text rendering for `FUNDED` and other gradient text in both Dark and Light themes.
- Isolated gradient text from liquid-glass panel/button rules so theme changes cannot make the text transparent or invisible.
- Added a subtle animated gradient pass that stops automatically when reduced motion is enabled.
