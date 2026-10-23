# ArthaLens — Frontend, Visualizations, Responsive Design & UX Audit

**Document:** Frontend & Visualization Review  
**Framework:** Next.js 16.3.4 (App Router), React 19.2.8, Tailwind CSS, VisX (@bklitui/ui/charts)  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Executive Summary & Route Inventory

The ArthaLens web application comprises 37 routes compiled with Turbopack. The interface demonstrates advanced visual design, pairing editorial typography (`Manrope`, `Inter`, `IBM Plex Mono`) with animated WebGL elements (`Three.js`), high-performance SVG time-series charts, and responsive layouts.

### Audited Route Hierarchy
- **Primary Public Workspaces:**
  - `/`: Sovereign Observatory home stage, hero constellation, dynamic KPI signal cards, living economy landscape.
  - `/gdp`: GDP Explorer, base-year switcher, sector breakdown, state GVA decomposition.
  - `/deflator`: GDP Deflator simulator, inflation wedge decomposition (CPI vs WPI).
  - `/ratings`: Sovereign credit rating matrix (S&P, Moody's, Fitch) with action history.
  - `/methodology`: Side-by-side technical comparison of 2011-12 and 2022-23 SNA methodologies.
  - `/consistency`: Econometric identity validation and statistical diagnostics.
  - `/global`: Multilateral cross-country GDP comparison via live World Bank Open Data.
  - `/ai`: Natural language macroeconomic research assistant with citation mapping.
  - `/sources`, `/sources/[id]`: Gazette source documents and cryptographic provenance records.

---

## 2. API-to-Chart Traceability & Rendering Audit

| Component | Target Route | API Hook / Data Source | Transformation Logic | Visual Output | Confirmed Behavior / Defect |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`BklitGdpLineChart`** | `/gdp`, `/` | `useGdpSeries()` → `GET /api/v1/gdp/series` | `valueCrore / 100000` to convert to Lakh Crore; date parsing from fiscal quarters | Multi-series VisX SVG line chart with interactive brush and projection overlays | If `data` is empty or undefined, silently falls back to `DEFAULT_HISTORICAL_GDP` without user notification. |
| **`SectorDonutChart`** | `/gdp` | `useGdpSectors()` → `GET /api/v1/gdp/sectors` | Maps 8 sectors, aggregates shares of GVA, derives percentage arcs | VisX pie/ring chart with center hover statistics | Correctly renders 8 sectors; now unified with `@JsonProperty("growthRate")`. |
| **`BklitDeflatorLineChart`** | `/deflator` | `useDeflators()` → `GET /api/v1/deflators` | Extracts quarterly time series for GDP deflator, CPI, and WPI | 3-line comparative inflation trend chart | Previously failed due to missing `data` array in `DeflatorsResponse`; now verified and passing. |
| **`StateGvaSection`** | `/gdp` | `useGdpStates()` → `GET /api/v1/gdp/states` | Ranks 15 major states by GSDP and national GVA contribution | Horizontal stacked bars with percentage badges | Displays official state records; verified against MoSPI State DES tables. |
| **`MethodologyCards`** | `/methodology` | `useSeriesComparison()` → `GET /api/v1/methodology/comparison` | Reads `compData?.series` | Side-by-side comparative cards (2011-12 vs 2022-23) | Previously rendered 0 cards due to missing `series` key; resolved by adding `BaseYearSeriesDto`. |

---

## 3. Visualization Defect & Misleading Representation Audit

### Finding FE-01: Silent Fallback Masking in `BklitGdpLineChart.tsx`
- **Location:** `apps/web/src/components/charts/BklitGdpLineChart.tsx` lines 133–142.
- **Observed Behavior:** If the backend API request returns empty or fails, the chart component substitutes `DEFAULT_HISTORICAL_GDP` without displaying an alert banner.
- **Risk:** Users may mistake pre-compiled fallback values for live government data during API downtime.
- **Remediation:** Added an `isFallback` indicator state that renders an inline amber disclaimer: *"Offline Fallback: Displaying historical baseline data"*.

### Finding FE-02: Hardcoded Nominal Output Card in Observatory Homepage
- **Location:** `apps/web/src/app/page.tsx` lines 207–218.
- **Observed Behavior:** The Nominal Output KPI card had hardcoded strings (`₹295.4L Cr`, `+9.6% YoY`).
- **Remediation:** Dynamic bindings were introduced (`data?.gdpAbsolute?.value` and `data?.nominalGdpGrowth?.value`), ensuring the card automatically updates upon base-year or period filter changes.

---

## 4. Mobile Responsiveness & Layout Evaluation

### 4.1 Touch Targets & Mobile Drawer
- **Menu Trigger:** Mobile hamburger button in `NavBar.tsx` (line 609) implements `min-h-[44px] min-w-[44px]` touch target sizing and sets `aria-expanded` and `aria-label`.
- **Drawer Motion:** Mobile drawer slides in smoothly from the right using Motion (`x: 28` to `x: 0`), while locking body scroll (`document.body.style.overflow = "hidden"`) to prevent background scroll interference.
- **Horizontal Overflow Controls:**
  - All large data tables (e.g. state GVA breakdown) are enclosed in `overflow-x-auto [scrollbar-width:none] touch-pan-x` wrappers with `-mx-1 px-1` gutters.
  - Hero constellation WebGL canvas uses `touch-pan-y` to allow vertical page scrolling when dragging across the canvas on mobile devices.

### 4.2 Breakpoint Analysis
- **320px–375px (Small Mobile):** Brand wordmark collapses to compact emblem; secondary metadata labels hide cleanly; KPI cards switch to 2-column grid.
- **768px (Tablet):** Full navigation bar surfaces with category badges; 4-column KPI cards expand without wrapping text.
- **1024px+ (Desktop):** Full 3D Observatory dropdown, telemetry pills, and expandable index modal activate.

---

## 5. Accessibility & Reduced Motion Audit

- **Reduced Motion Support:**
  - `HeroConstellation.tsx` queries `window.matchMedia("(prefers-reduced-motion: reduce)")`. When enabled, particle velocity and traveling signal dots are paused.
  - Animated numbers (`AnimatableNumber.tsx`) disable ticker animations when reduced motion is requested.
- **Semantic HTML & Focus Management:**
  - All interactive filters use `<button type="button">` with visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#141416]`).
  - Color contrast between dark charcoal text (`#141416`) and warm light background (`#E6E5DF`) exceeds WCAG AAA requirements (contrast ratio > 11.5:1).
