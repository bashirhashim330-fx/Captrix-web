# CAPTRIX FUNDED — Vite + React + Tailwind

Prototype front end for Captrix Funded. It covers the public site, the challenge marketplace, the trader dashboard and Spin & Win.
`noindex,nofollow`: this is a prototype and must not be indexed.

## Just want to look at it?
Open **`index.html`** in Chrome, Edge, Safari or Firefox (double-click is fine). It is one self-contained file with all JS, CSS and logos inlined, so it needs no server and no install. Rebuild it with `npm run build:standalone`.

> Opening the project's `index.html` directly shows a blank page. That file is the Vite *source* entry (`/src/main.jsx`) and only runs under `npm run dev`. Previewers that block JavaScript can't run the prototype at all; they show a "Loading…" notice instead.

## Run it
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve dist/ locally
npm run build:standalone   # -> index.html (single file, opens from disk)
```
`vite.config.js` uses `base: './'`, so `dist/` also works from a sub-folder.

## Structure
```
index.html                 document shell: theme bootstrap, robots meta, module entry
tailwind.config.js         brand tokens (same values as the original runtime config)
postcss.config.js          tailwindcss + autoprefixer
src/main.jsx               entry: CSS imports + <App/>
src/App.jsx                public site + routing between public / dashboard, modals, toasts
src/components/            one component per file (names and props unchanged from js/app.jsx)
src/data/                  challenges, dashboard sample data, Spin & Win config, rule definitions
src/lib/                   audio, motion helpers (reduced motion, scroll), number/date formatting
src/styles/tailwind.css    @tailwind base/components/utilities
src/styles/base.css        foundations + theme patches carried over from styles.css
src/styles/glass.css       elevation tier system (T0–T3), chips, brackets, toasts, meters
src/styles/responsive.css  responsive hardening carried over from styles.css
src/assets/                logos (imported, hashed at build)
public/favicon.png
```

---

## Earlier history (from the CDN build README)
This is the generated Captrix prototype split out of the original single-file build.

### Structure
- `index.html` — document shell
- `styles.css` — global styles + responsive/theme fixes
- `js/app.jsx` — React application/components
- `js/tailwind.config.js` — Tailwind runtime configuration

### Changes in this pass
- Split the generated single-file app into separate HTML/CSS/JSX files.
- Preserved the existing public site, dashboard, challenge data and Spin & Win implementation.
- Fixed dashboard top-bar overflow/cutoff on mobile and very small widths.
- Added safer responsive account selector behavior.
- Added a dashboard theme control cycling Dark → Light → System.
- Added light-theme overrides while preserving Captrix cyan/blue branding.
- Added phone safe-area viewport handling.

Run through HTTP(S), not `file://`, because React/Babel external assets are loaded by the page.

### v2 update
- Palette: brand tokens (obsidian #0b0c10, cyan #11D6FF, blue #1478FF) now drive BOTH themes; light theme uses AA-safe cyan/blue text shades.
- Liquid glass layer (styles.css, bottom): translucent surfaces, specular edges, sheen, cut-corner "Lambo" radii and HUD corner brackets. Real `backdrop-filter` only on overlays/header, never on panels (it traps `position:fixed` children).
- Spin & Win rebuilt as an SVG wheel (crisp on every screen, GPU rotation). Prize board shows $1K / $5K / $10K / $25K ACCOUNT + TRY AGAIN. Cost 100 credits. Removed from the homepage; lives only in the dashboard under Spin & Win.
- Fixes: old wheel overflowed at 320px (conflicting h-[] classes), used alert(), dashboard spin never sent notifications, FAQ made unsupported claims (95% split, retake tokens).
- TO CONFIRM with Captrix: spin odds/terms, winners-feed source, real prize rules. The spin outcome must be decided server-side in production.

### v3 update
- Real Captrix logo added (`assets/logo-dark.png`, `assets/logo-light.png`, favicon). The `<CaptrixLogo/>` component swaps the variant with the theme; used in the public header, footer, dashboard sidebar and mobile drawer, login modal and the Spin wheel hub.
- Removed every "Trader OS" label and the "Explore Trader App" button. No public button enters the dashboard without logging in (the showcase CTA now opens Login).
- Homepage header is now: logo, Login, menu button. The menu opens a right-hand glass drawer (Corridor, Challenges, How It Works, FAQ, Get Funded, Login). Desktop keeps the inline links.

### v4 update
- Fixed invisible/blurred gradient text ("FUNDED", "Target & Floor.") in light mode: the glossy-button styling was leaking onto gradient text.
- Light-mode contrast pass: darker slate/profit/loss/warning text, readable hover states, light hero grid, chart gridlines and scrollbars.
- Floating back-to-top arrow on the public homepage (appears after scrolling, smooth scroll, respects reduced motion).

### v5 update
- Gradient brand text (FUNDED, "Target & Floor.") restored and made readable: light mode uses a deeper cyan-to-blue gradient; dark mode is unchanged.


### v6 update
- Preserved the v4 floating back-to-top arrow and its reduced-motion behavior.
- Restored reliable gradient/liquid text rendering for `FUNDED` and other gradient text in both Dark and Light themes.
- Isolated gradient text from liquid-glass panel/button rules so theme changes cannot make the text transparent or invisible.
- Added a subtle animated gradient pass that stops automatically when reduced motion is enabled.

---

## Upgrade pass — Lamborghini v1

### 0. Things found in the code before changing anything
1. **The Tailwind theme was never applied in the CDN build.** `js/tailwind.config.js` loaded *before* the Tailwind CDN script, so `tailwind.config = …` threw `ReferenceError: tailwind is not defined`. As a result every brand utility (`bg-surface*`, `text-brand-cyan`, `fin-profit/loss/warning`, custom shadows, the `lg: 900px` breakpoint) silently did not exist. The old look came only from `styles.css` overrides. The Vite build compiles the config, so brand colours now render as designed. This is the biggest visible difference, and it is a bug fix, not a redesign.
2. **`<meta name="robots" content="noindex,nofollow">` was missing** from `index.html`. Added.
3. The Overview had no active-account hero, only 4 equal KPI tiles. `+$6,450 (+6.45%)` and `64.5%` were hard-coded, and the Corridor always showed `CHALLENGE_DATA[5]` ($100K), even when the 25K account was selected.
4. The equity chart ("Equity & Watermark Progression") is on **Overview**, not Analytics. Analytics only has 3 stat tiles. The chart was upgraded **where it already lives**.
5. "Total Profit" / "Available Balance" KPI labels did not exist (the tiles were Total Net Equity, Today's P/L, Target Milestone, Account Tier Status).
6. The Spin result dialog had Escape and initial focus but **no focus trap and no focus return**.
7. Feedback used `alert()` in 7 places: Copy Link, Save Profile, Open New Ticket, Payout request, Certificate download, Rewards redeem and Checkout success.
8. There is **no "Change Password" control** and **no mobile sticky bar** in the prototype. Neither was invented. "Submit Ticket" did not exist (see 4.6).
9. The old global CSS gave *every* surface the same treatment: blanket glass and drop shadow on every `bg-surface*`, cut corners on every `rounded-xl/2xl`, HUD brackets on every card, and `backdrop-filter: 18px` forced onto every blur. That flatness is what this pass replaces.

### 1. File-by-file
| Before (CDN) | After (Vite) | Notes |
|---|---|---|
| `index.html` (CDN React/Babel/Tailwind) | `index.html` | Theme bootstrap IIFE kept verbatim; robots meta added; single module entry. |
| `js/tailwind.config.js` | `tailwind.config.js` | Same tokens; `content` globs added; now actually compiled. |
| — | `postcss.config.js`, `package.json`, `vite.config.js`, `.gitignore` | Build tooling. |
| `js/app.jsx` (2,725 lines) | `src/App.jsx` + `src/components/*.jsx` | Same 14 component names and props, one per file: Icon, CaptrixLogo, CaptrixCorridor, SpinAndWinEngine, BackToTop, PublicDrawer, ChallengeMarketplace, HowItWorksSection, DashboardShowcase, FAQSection, Footer, TraderDashboardApp, AuthModal, CheckoutModal. |
| inline data in `app.jsx` | `src/data/challenges.js`, `spin.js`, `siteMenu.js`, `dashboard.js`, `ruleDefinitions.js` | `CHALLENGE_DATA` unchanged; dashboard sample figures now per account. |
| inline helpers | `src/lib/audio.js`, `motion.js`, `format.js` | `playFinAudio` unchanged; reduced-motion + scroll helpers; `usd/pct/formatStamp`. |
| `styles.css` | `src/styles/base.css`, `responsive.css`, **`glass.css` (new)** | Old blanket glass/blur/bracket rules removed; replaced by opt-in tiers. |
| `assets/*.png` | `src/assets/*.png`, `public/favicon.png` | Logos imported (hashed). |
| — | **New:** `Toast.jsx`, `RuleInfo.jsx`, `Sparkline.jsx`, `KpiTile.jsx`, `ActiveAccountModule.jsx`, `RiskAtAGlance.jsx`, `EquityChart.jsx`, `CompareChallenges.jsx` | See §4. |

Git history: commit 1 = straight split with no visual intent; commit 2 = this upgrade pass.

### 2. Elevation system (`src/styles/glass.css`)
One light source for everything: specular gradients at `--cx-light: 160deg` plus an inset top rim. Blur scale: chip 6 · small card 10 · panel 14 · hero 20 · header bar 18 · small float 16 · modal/drawer 28.

| Tier | Class | Look | Used by |
|---|---|---|---|
| **T0 — Page** | body / `.cx-t0` | Obsidian (light: cool off-white) with a faint grid/glow, no glass | Page backgrounds, section titles (e.g. Spin & Win heading) |
| **T1 — Base glass** | `.cx-t1`, `.cx-well` | Low-opacity fill, 1px hairline, no shadow, no blur | KPI tiles, HowItWorks cards, FAQ rows, Showcase tiles, Analytics/Payout stat tiles, unselected marketplace tier cards, Corridor metric cards, sidebar rail, Spin placeholder row |
| **T2 — Raised glass** | `.cx-t2` (+ `--primary`, `--quiet`) | Blur 10–20, specular rim, soft two-layer shadow. `--primary` = brighter rim + cyan glow; `--quiet` = lower contrast | Active Account module, Corridor, Equity chart, configurator, Spin wheel panel, prize board, both winners modules, data tables, Certificates, Affiliate, Rewards, Profile/KYC/Security, Support |
| **T3 — Floating** | `.cx-t3` (+ `--sm`) | Strongest blur (16/28), deepest shadow, highest opacity | Sticky headers once scrolled (`.cx-header.is-scrolled`), Login & Checkout modals, Spin result dialog, drawers (public right / dashboard left), theme menu, RuleInfo popovers, toasts, back-to-top |

**HUD brackets (`.cx-lambo`) are opt-in, one per screen or group:** the hero Corridor, the selected marketplace tier (small) plus the configurator, the Spin wheel panel, the Accounts header Corridor, Certificates, the selected Challenges card, modals, the result dialog and toasts (small). Plain cards have no brackets.

### 3. Hierarchy: one primary per group
| Group | Primary (heaviest) | Secondary | Quiet |
|---|---|---|---|
| Public hero | Corridor (T2 primary + brackets), "Start Evaluation" gradient CTA | "Compare All 7 Tiers" (outline) | stats strip |
| Marketplace | Selected tier card (T2 primary, scale 1.02, small brackets) + configurator CTA | other tier cards (T1) | rule card (T2 quiet) |
| Overview | **Active Account module** (T2 primary, 8/12 cols) | KPI row (T1 ×4) | Risk at a glance, Corridor, Recent Executions (T2 quiet) |
| Spin & Win | Wheel panel + "Spin Now" (T2 primary + brackets) | Prize board (T2) | Module A / Module B (T2 quiet) |
| Challenges | Card for the selected account (T2 primary + brackets) | — | other cards (T2 quiet) |
| Dashboard chrome | "+ New Challenge" | nav items | sidebar rail (T1) |
| Modals | submit button (gradient) | cancel/close (ghost) | — |

### 4. New trader features (each placed next to what it explains)
1. **Compare all 7 tiers** (`CompareChallenges.jsx`): public site, directly under the Marketplace (`#compare-tiers`). Sticky first column, horizontal scroll on mobile. Each row's **Select** loads that tier into the configurator and scrolls to it. The hero "Compare All 7 Tiers" button now jumps here.
2. **Rule explainers** (`RuleInfo.jsx`): ⓘ popovers on Profit Target, Daily Drawdown, Max Drawdown and Profit Split, in the Corridor metric cards, the configurator, the compare table header and the Risk meters. They open on hover, focus or tap, close on Escape or outside click, and stay inside the viewport at 320px. The wording lives in `src/data/ruleDefinitions.js` (**TO CONFIRM**).
3. **Risk at a glance** (`RiskAtAGlance.jsx`): Overview, next to the account hero. Mini corridor (target / equity / start / floor) plus daily and max drawdown "used vs headroom" meters.
4. **Active Account module + KPI sparklines** (`ActiveAccountModule.jsx`, `KpiTile.jsx`, `Sparkline.jsx`): Overview. Figures now follow the account selector, and the Corridor uses the selected account's tier.
5. **Equity chart upgrade** (`EquityChart.jsx`): Overview, same place as before. 1D/1W/1M/ALL now switch data. Target, start and floor reference lines have labels. Crosshair with pointer **and** arrow keys.
6. **Support ticket composer**: Support Desk. "+ Open New Ticket" opens an inline form; **Submit Ticket** adds an OPEN ticket to the list and shows a toast.
7. **Toasts** (`Toast.jsx`, global, `aria-live`): replace every `alert()` listed in §0.7.

### 5. Spin & Win (upgraded in place: still Dashboard → Community → Spin & Win)
- Wheel, segments, cost (100 credits), prize board and the credits rule are unchanged.
- Layout: page title on T0 → wheel panel (T2 primary + brackets) beside the prize board (T2) → two feed modules side by side (stacked below `lg`):
  - **Module A — "My Recently Won Accounts"**: prize, account ID `CAP-xxxxxx`, timestamp, status chip (ACTIVE / PENDING). A winning spin prepends a new PENDING row. A dashed placeholder row reads "Your next winning spin will appear here."
  - **Module B — "All Users Recently Won"**: COMMUNITY chip plus a "Sample activity" badge. Footnote: "Sample names and results for layout only — not verified winnings."
- Result dialog: portalled, T3, focus trap, Escape, focus returns to Spin (or to the wheel section while Spin is disabled).
- Reduced motion: the wheel resolves in about 0.8s without the long spin.

### 6. Accessibility, motion, theme
- Reduced motion: wheel, sparkline draw-in, gradient text pass, toasts, smooth scroll and header transitions all respect `prefers-reduced-motion`.
- axe-core colour contrast: **0 violations** in dark and light on the public site, Overview, Spin & Win, Challenges and Payouts. Light fixes include darker `fin-*` text, cyan-on-cyan-tint chips at `#006a91`, and `.text-surface-border` readable on white.
- Dialogs: `role="dialog"`, `aria-modal`, labelled, Escape and click-outside close. FAQ rows have `aria-expanded`.
- Responsive: checked at **320 / 375 / 390 / 430 / 768 / 1024 / 1440**, dark and light, across all 16 screens (public plus every dashboard view): 224 checks, no horizontal page overflow, no element escaping the viewport. Wide tables and the Corridor graph scroll inside their own containers; the Corridor gets a right-edge fade below 600px.

### 7. TO CONFIRM with Captrix
- [ ] Rule definition wording in `src/data/ruleDefinitions.js` (profit target, daily drawdown, max drawdown, profit split).
- [ ] Max drawdown: trailing or static, and how "used" is measured (balance vs equity). The existing Corridor card says "Dynamic trailing floor" and the FAQ says "fixed or trailing according to your tier", but the Risk meters and Corridor draw a static floor (start − max DD). Pick one.
- [ ] Daily reset time (the prototype copy says 00:00 UTC) and whether daily DD is measured from start-of-day balance or equity.
- [ ] All dashboard sample figures (`src/data/dashboard.js`): today's P/L, win rate, wins/losses, sparklines, and the 25K account numbers.
- [ ] Spin & Win: odds, terms, prize rules, credit cost. The **outcome must be decided server-side** in production.
- [ ] Won-account ID format (`CAP-xxxxxx`) and lifecycle (PENDING → ACTIVE, and what happens after).
- [ ] Winners feed source (Module B): real data, opt-in/anonymisation policy, or keep it labelled as sample.
- [ ] Payout schedule wording, affiliate commission rate, certificate export format.
- [ ] Backends for clipboard referral links, profile save, ticket submit and payout requests (currently local state + toast).
- [ ] Pre-existing FAQ/marketing claims (copy was not changed in this pass).
- [ ] Partner entity name in the footer disclaimer ("[Captrix to supply partner entity details]").

### 8. Final re-check
**Tiers:** each screen has exactly one T2-primary group. T3 is used only for things floating above the page (scrolled headers, modals, drawers, popovers, menus, toasts, back-to-top). T1 is used for repeated small tiles. Brackets are opt-in on the elements listed in §2, never global.

**Nothing moved.** Every section, nav item and feature is where it was:
public order Hero → Marketplace → How It Works → Showcase → FAQ → CTA → Footer (Compare table added *inside* the Marketplace section).
Dashboard nav groups and order are unchanged: Trading (Overview, Challenges, Trading Desk, Accounts), Performance (Analytics, Payouts, Order Log, Certificates), Community (Affiliate Portal, Rewards Hub, Spin & Win), Account (Trader Profile, KYC, Security & 2FA), Support (Support Desk).
The equity chart stays on Overview. Spin & Win stays only in the dashboard. No copy was replaced, except labels on new elements and alert() → toast text.

---

## Layout pass v2 — dashboard shell (reference-inspired)

The **layout patterns** come from a screen recording of another prop-firm dashboard. Nothing was copied: no code, copy, assets, colours or icons. Everything uses Captrix's own brand (cyan/blue on obsidian), components, nav labels and glass tiers.

### What was adopted, and where
| Pattern | Captrix implementation | File |
|---|---|---|
| Compact top bar | Mobile: logo mark (→ Overview) · account pill · **New Challenge** accent circle · search (≥360px) · credits pill · bell with **unread count**. Desktop keeps the full account select, Public Portal and theme menu, and gains a Search pill (`Ctrl K`). | `TraderDashboardApp.jsx`, `styles/shell.css` |
| Bottom tab bar (< 900px) | **Home · Accounts · Stats · Payouts · More**. Active tab has a cyan pill; the More tab lights up for any view not in the bar. Safe-area aware. | `shell/BottomTabBar.jsx` |
| "More" bottom sheet | Grab handle (**drag down to close**), THEME switch (System / Light / Dark), close button, Captrix wordmark, search entry, the **full grouped nav** (Trading / Performance / Community / Account / Support), Public Portal, a big **New Challenge** button, and the user card with sign-out. Focus trap, Escape and scrim tap close it; focus returns to More. | `shell/MoreSheet.jsx` |
| Welcome header | "Welcome back, Alex" plus "Your trading hub at a glance." above the Active Account module. The equity figure gets a **left accent bar**. | `TraderDashboardApp.jsx`, `ActiveAccountModule.jsx` |
| Notifications popover | Mark all as read · **All / Unread** filter · type icon, title, time, description · unread dot (tap to mark read) · "You're all caught up" empty state. Outside tap and Escape close it. | `shell/NotificationsPopover.jsx` |
| Search | Palette with every dashboard page plus actions (New Challenge, Public Portal). Opens with `Ctrl/⌘ K` or `/`; arrow keys and Enter work. | `shell/SearchPalette.jsx` |
| Support FAB | Floating chat button. Opens Support Desk with the ticket composer open. Hidden on Support Desk and while the sheet is open. | `shell/SupportFab.jsx` |
| Loading skeleton | Overview skeleton that mirrors the real layout on first load. No shimmer under reduced motion. | `shell/Skeleton.jsx` |
| User card | Initials avatar, name, email, sign-out, in the desktop sidebar footer and the More sheet. | `shell/UserCard.jsx` |

Shared behaviour: `src/lib/useDialog.js` (Escape, focus trap, focus return, scroll lock).

### What moved (this pass deliberately changes layout, as requested)
- **Mobile navigation:** the hamburger + left drawer became the bottom tab bar + More sheet. The same nav items, groups and order are all still there, plus Public Portal and New Challenge.
- **Mobile theme control:** moved from the top bar into the More sheet. Desktop is unchanged.
- **Public Portal at 768–899px:** moved from the top bar into the More sheet. Unchanged at ≥ 900px.
- **Mobile account switcher:** same place (top bar), now a compact pill over the native select.
- **Sidebar footer:** "Captrix Verified / trader@captrix.com" became the user card using the same sample trader as Trader Profile (Alex Mercer), with sign-out.
- Unchanged: all dashboard views and their content, the desktop sidebar, Spin & Win, and the public site.

### Fixes found during this pass
- In light mode, `hover:bg-surface*` utilities (sidebar items, table rows) flashed an obsidian background on hover. Now mapped to light tints.
- Horizontal scrollers (Corridor graph, dashboard tables) were not reachable by keyboard. They are now focusable labelled regions.

### Verification
- Responsive: 7 widths (320–1440) × 16 screens × dark/light = **224 checks, no overflow**. Content clears the tab bar and FAB at the end of every page.
- axe-core WCAG 2 A/AA: **0 violations** on Overview (390 and 1440), the More sheet, the notifications popover, search, Payouts, Order Log, Spin & Win and the public site, in dark and light.
- Interaction tests: tab bar, sheet (Escape, focus trap and return, drag-to-close, theme, navigation), notifications (mark one, mark all, Unread empty state, outside tap), search (filter, Enter, `Ctrl K`), FAB → composer, account pill, sign-out → public + toast. The earlier v1 suite still passes.

### TO CONFIRM with Captrix (v2 additions)
- [ ] Trader name/email source: the sample is "Alex Mercer", matching Trader Profile.
- [ ] Notifications: real event types, retention, and whether a full notifications page or settings is wanted (not built).
- [ ] Support FAB: live chat provider, or keep it opening the ticket composer.
- [ ] Sign-out behaviour: currently returns to the public site with a toast.
- [ ] Which four destinations belong in the tab bar (currently Home, Accounts, Stats, Payouts). Swapping one for Spin & Win or Trading Desk is a one-line change in `TAB_BAR` (`src/data/dashboard.js`).

## Homepage v3 — premium, restrained palette (reference-inspired)

Scope: **public homepage only.** Dashboard, checkout and auth are unchanged (dashboard regression sweep: 16 views × 4 widths × 2 themes, all OK).

References: fundingpips.com (live site at 1440px) and the supplied screen recording. Ideas were taken as *patterns*, nothing was copied (no copy, assets, layout measurements or claims).

**Adopted patterns**
- Floating header (transparent → frosted bar on scroll) with text links, Log in and one primary CTA.
- Left-aligned hero: headline + two CTAs + a quiet stats strip; the Corridor sits beside it at ≥1100px.
- Fact-chip row under the hero.
- Stepped pricing: ① Challenge model → ② Account size → Plan details / Compare all 7 toggle → one plan card.
- "How it works" cards with small product-style visuals instead of big numbers.
- Split product showcase (browser mock of the Trader Dashboard + one floating stat card).
- Two-column FAQ, a single closing CTA band, clean footer with the disclaimer.

**Not adopted:** ratings/Trustpilot badges, testimonials, payout-total counters, Discord/community blocks, video embeds, countdowns/promo banners — none of these are supported by Captrix data.

**Palette rules (`src/styles/home.css`, scoped to `.cx-home`)**
- Neutrals do the work: obsidian `#08090c` / white surfaces, ink + slate text.
- One accent (cyan `#11d6ff` dark / `#0a74b0` light) used only for small marks: eyebrow dots, check marks, the H1 phrase "Target & Floor.", the wordmark, focus rings.
- Primary buttons are inverse neutrals (white on dark, ink on light). No glows, HUD brackets or gradient-filled cards.
- Profit / loss / warning colours appear only inside data (Corridor, plan card, dashboard mock), and are muted.
- Type: Inter for UI/body, Sora for headings, JetBrains Mono for numbers only.

**What changed / moved**
- Header: links now include **Platform**; adds a light/dark toggle (≥640px, and in the menu on mobile) and a **Get funded** button that scrolls to pricing. "Login" → "Log in".
- Hero: left-aligned, Corridor redrawn in the new palette; the old full-width facts strip is now the hero's stats row.
- Pricing: Compare is now a **toggle view** inside the pricing section (deep link `#compare-tiers` still works from hero, footer and menu). Selecting a tier anywhere keeps the hero Corridor and the plan card in sync.
- Final CTA "Choose your challenge" now **scrolls to pricing** instead of opening $100K checkout directly; the mobile menu's "Get funded" does the same.
- Mobile menu restyled to the homepage palette, adds Platform and an Appearance (Dark/Light) switch.
- Segmented controls use `aria-pressed` buttons; FAQ uses `aria-expanded`/`aria-controls` with labelled regions.

**Checks:** no horizontal overflow at 320/375/390/430/768/1024/1440 (dark + light); axe WCAG 2.1 A/AA — 0 violations on the homepage (both themes, plan + compare views, open menu) and dashboard overview.

**To confirm with Captrix:** payout-method and bi-weekly schedule wording in the fact chips and step 04; "Up to 1:100" leverage; "Platform" as the nav label for the dashboard showcase; dashboard mock figures are illustrative.
