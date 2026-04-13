# LIFT Quiz Funnel — Project Agent Directive

> **Version:** 1.0  
> **Last Updated:** April 2026  
> **Owner:** AFI Group / wealthvids.com  
> **Repository:** `https://github.com/bxeinc-900/Lift-Quiz-test`  
> **Live URL:** Cloudflare Pages — `lift-quiz-test.pages.dev`

---

## 1. Project Overview

The LIFT Quiz Funnel is a high-conversion educational retirement analysis tool designed for Facebook ad traffic. It is built as a single-page application (SPA) that guides a prospect from awareness → quiz engagement → personalized results → booked strategy call.

### Primary Goal
Convert cold ad traffic into booked strategy session calls with AFI Group advisors by demonstrating a clear, data-driven gap in the prospect's existing retirement strategy.

### Brand Voice
- **Investigative, not salesy.** Uses "forensic analysis" and "risk assessment" framing.
- **Educational, not promotional.** All claims are framed as illustrative and hypothetical.
- **Urgent, not alarmist.** Urgency is grounded in real tax and market risk concepts.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + TypeScript (SPA, no React) |
| Styling | Vanilla CSS with glassmorphism design system |
| Video | Wistia embed (`23c4x4wrb1`) via E-v1.js SDK |
| Booking | GoHighLevel calendar embed (`links.wealthvids.com`) |
| Fonts | Google Fonts: `Outfit` (headings), `Inter` (body) |
| Deployment | Cloudflare Pages (auto-deploys on `git push main`) |
| Version Control | GitHub — `bxeinc-900/Lift-Quiz-test` |

### Build Commands
```bash
npm run dev       # Local development server (localhost:5174)
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
```

### Deployment
Every push to the `main` branch triggers an automatic Cloudflare Pages build:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA routing:** `public/_redirects` → `/* /index.html 200`

---

## 3. File Structure

```
LIFT Quiz Funnel/
├── index.html              # Entry point — SEO meta, font imports, Wistia/GHL scripts
├── AGENT.md                # This file — project directive
├── DEPLOY.md               # Cloudflare Pages deployment reference
├── package.json            # Vite + TypeScript dependencies
├── tsconfig.json           # TypeScript config (strict mode)
├── public/
│   ├── _redirects          # Cloudflare SPA routing rule
│   ├── favicon.svg         # Site favicon
│   └── icons.svg           # Icon assets
└── src/
    ├── main.ts             # Core application logic (all UI, state, calculators)
    ├── quiz.ts             # Quiz questions, options, and scoring logic
    └── style.css           # Full design system — glassmorphism theme
```

---

## 4. Application Architecture

### State Machine
The app runs a simple three-state machine with no external router:

```
hero → quiz → results
```

State is managed via module-level `let` variables in `main.ts`. The `render()` function wipes and rebuilds the `#app` div on every state transition.

### Global Window Handlers
Because `innerHTML` template strings execute in the global browser scope, all interactive handlers are exposed via `window.*`:

| Handler | Purpose |
|---|---|
| `window.startQuiz()` | Transitions from `hero` → `quiz`, resets scores |
| `window.openBookingModal()` | Opens the GHL calendar modal |
| `window.openMethodModal()` | Opens the LIFT Method briefing modal |
| `window.closeModal(id)` | Closes a modal by element ID |
| `window.setActiveTab(tab)` | Switches the active calculator tab |
| `window.calcData` | Shared calculator state object (mutable) |
| `window.render` | Global reference to the render function |

### Modal System
Both modals (`#booking-modal`, `#method-modal`) are initialized **once** via `initModals()` on page load and appended directly to `document.body` — **outside** the `#app` div. This prevents them from being destroyed and recreated during re-renders, and ensures they cannot block clicks on the main content.

Modal state: `display: none` (inactive) → `display: flex` (active via `.active` class).

---

## 5. Quiz System (`quiz.ts`)

### Questions
5 questions designed to surface retirement tax and sequence-of-returns risk:

1. Percentage of savings in tax-deferred accounts
2. Preparedness for higher tax rates in retirement
3. Downside protection strategy (sequence of returns)
4. Awareness of indexed interest + loan strategies
5. Primary retirement goal (balance vs. cash flow vs. legacy)

### Scoring
Each option carries a `score` of 1–4. Higher score = higher risk exposure.

```
Total score < 30% of max  → "Low Exposure"
Total score < 60% of max  → "Moderate Exposure"
Total score ≥ 60% of max  → "Critical Tax & Market Exposure"
```

The exposure label drives the color and framing of the results page header.

---

## 6. Calculator System (`main.ts` → `renderActiveCalculator()`)

All calculators share a single state object:

```typescript
let calcData = {
  balance: 500000,    // Retirement account balance ($)
  withdrawal: 40000,  // Annual withdrawal amount ($)
  bracket: 22         // Federal income tax bracket (%)
}
```

### Tab 1: Tax Exposure
- **Annual taxes:** `withdrawal × (bracket / 100)`
- **Net income:** `withdrawal − annual taxes`
- **25-year total:** `annual taxes × 25`
- Shows 2026 federal bracket thresholds in dropdown labels

### Tab 2: Income Gap
- **Inflation multiplier:** `1.03²⁰ ≈ 1.806` (3% over 20 years, compounded)
- **Gross withdrawal needed in year 20:** `(withdrawal × 1.806) ÷ (1 − bracket%)`
- **Inflation gap:** `withdrawal × (1.806 − 1)` — additional income just to match inflation
- **Tax drag today:** `withdrawal × bracket%`

### Tab 3: Side-by-Side
Qualitative comparison table. No user inputs. Shows:
- Traditional 401(k)/IRA: Tax exposure, RMDs, market risk, no death benefit
- LIFT Strategy (Properly Structured): Potential tax-free loan income, no RMDs, 0% floor*, legacy

### Tab 4: Risk Scenario
- **Crash value:** `balance × 0.8` (20% decline)
- **Recovery time:** `Math.ceil(log(balance / crashValue) / log(1.07))` (at 7%/yr avg)
- **Effective loss:** `crashLoss + (withdrawal × yearsToRecover)`
- **Annual tax drag:** `withdrawal × (bracket / 100)`
- Accepts balance and bracket inputs directly in-tab

### Number Formatting
All displayed values use `fmt(n)` → `Math.round(n).toLocaleString('en-US')` to prevent floating-point display artifacts.

---

## 7. Design System

### Color Palette (CSS Custom Properties)
| Token | Value | Use |
|---|---|---|
| `--accent` | HSL 45 100% 58% | Gold — primary CTA, highlights |
| `--primary` | HSL 217 91% 60% | Blue — secondary elements |
| Background | `#020C1B` | Very deep navy |
| Text primary | `#E6F1FF` | Near-white |
| Text muted | `#8892B0` | Gray blue |
| Text dim | `#495670` | Disclaimer text |
| Value red | `#F44336` | Negative figures |
| Value green | `#4CAF50` | Positive figures |
| Teal accent | `#64FFDA` | LIFT-specific highlights |

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.glass` | Glassmorphism card background with backdrop blur |
| `.glass-pill` | Teal status badge / category label |
| `.btn-primary` | Gold filled CTA button |
| `.btn-outline` | Gold outlined secondary button |
| `.animate-fade-in` | Fade + slide-up entrance animation |
| `.calc-tab` / `.calc-tab.active` | Calculator tab navigation |
| `.modal-overlay` / `.modal-overlay.active` | Full-screen modal system |
| `.footer-disclaimer` | Styled multi-paragraph legal footer |

---

## 8. Conversion Flow

```
Facebook Ad
    ↓
Landing Page (Hero)
  • "START FREE ASSESSMENT" → quiz
  • "LEARN THE METHOD" → method modal
  • "SCHEDULE CONSULTATION" (header) → booking modal
    ↓
Quiz (5 Questions)
  • Self-qualifying — higher risk = stronger urgency on results
    ↓
Results Page
  • Risk profile badge (Low / Moderate / Critical)
  • Wistia briefing video
  • 4 interactive calculators
  • Final CTA banner → booking modal
    ↓
Booking Modal
  • GoHighLevel embedded calendar
  • "SCHEDULE YOUR COMPLIMENTARY CALL"
```

---

## 9. Embedded Integrations

### Wistia Video
- **Media ID:** `23c4x4wrb1`
- **Embed type:** Responsive async embed with Wistia swatch preloader
- **Script:** `https://fast.wistia.com/assets/external/E-v1.js` (loaded in `index.html`)
- **Location:** Results page, full-width above calculators

### GoHighLevel Booking Calendar
- **Widget ID:** `LwAMMZIaCleIBD0dAVLC`
- **Script:** `https://links.wealthvids.com/js/form_embed.js` (loaded in `index.html`)
- **Location:** `#booking-modal` — triggered from header CTA + results page CTA

---

## 10. Compliance & Disclosure Standards

### Language Guidelines
- **Do not** name specific financial products (e.g., avoid "IUL" in prominent copy)
- Use **"properly structured financial products"** or **"properly structured strategy"** instead
- All calculator outputs must be labeled as **"hypothetical"** or **"illustrative only"**
- Never imply guaranteed returns or tax-free outcomes without a qualifying asterisk and footnote

### Required Disclosures (currently in footer + modals)
1. **Educational Content Disclaimer** — not financial/tax/legal advice
2. **Product Disclosure** — fees, charges, loan risks, lapse consequences
3. **Facebook Ad Disclaimer** — not affiliated with or endorsed by Facebook, Inc.
4. **No Guarantee of Results** — projections are illustrative only

### Calculator Disclaimer (shown under calculator section)
> ⚠️ Calculator results are hypothetical illustrations only. They assume constant tax rates and do not account for investment fees, inflation, state taxes, required minimum distributions, or other factors that affect actual retirement income.

---

## 11. Roadmap & Future Enhancements

### Conversion Tracking (Priority: High)
- [ ] Add Facebook Pixel with `Lead` event on quiz start and `Schedule` event on booking modal open
- [ ] Add Google Analytics 4 (GA4) with custom events for quiz completion rate

### Lead Capture (Optional)
- [ ] Consider adding an optional email capture between quiz and results ("Email your report")
- [ ] Integrate with GoHighLevel CRM webhook to auto-tag leads by exposure level

### Personalization (Priority: Medium)
- [ ] Pass quiz `exposure` result into booking modal as a URL param for pre-qualified booking flows
- [ ] Show different CTA urgency levels based on quiz score (Moderate vs. Critical)

### Performance
- [ ] Add `loading="lazy"` to Wistia swatch image
- [ ] Consider preloading the GHL booking iframe on quiz final question to reduce modal load time

### Content Expansion
- [ ] Add a "FAQ" accordion section on the results page
- [ ] Add social proof (advisor credentials, client story stat) above the CTA banner

### Custom Domain
- [ ] Connect a custom domain in Cloudflare Pages (e.g., `quiz.wealthvids.com` or `lift.afigroup.com`)
- [ ] Ensure SSL propagates fully before sharing the URL in ad campaigns

---

## 12. Development Guidelines for AI Agents

When working on this project, follow these rules:

1. **Always run `npm run build` before pushing.** TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) will catch errors that the dev server ignores.

2. **Never use bare `calcData` or `render` in inline `onchange` handlers** inside `innerHTML` strings. Always use `window.calcData` and `window.render()` — they execute in global scope.

3. **Never re-render modals inside the `render()` function.** Modals are initialized once in `initModals()` and live on `document.body`. Re-rendering them inside `#app` would cause z-index blocking and click interception.

4. **Preserve all disclaimer language.** Do not remove or soften compliance disclosures. When in doubt, add more specificity rather than less.

5. **Do not use specific product names** (e.g., "IUL", "Indexed Universal Life") in prominent UI copy. Use "properly structured financial products" or similar neutral language. Product-specific language is reserved for the consultation call.

6. **All numbers displayed to users must be formatted with `fmt()`** — `Math.round(n).toLocaleString('en-US')`. Do not use raw `.toLocaleString()` without rounding.

7. **Push cadence:** After every session with meaningful changes, commit with a descriptive message and push to `main`. Cloudflare Pages auto-deploys within ~60 seconds.

8. **Keep this file updated** whenever new features are added, integrations change, or compliance guidelines evolve.
