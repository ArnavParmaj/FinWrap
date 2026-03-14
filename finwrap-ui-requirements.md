# FinWrap — UI Design Requirements

> Reference this file for all UI decisions. Do not deviate from these specs.
> All visual design should be generated via the connected Stitch MCP — do not invent UI from scratch.

---

## Stitch Prompt

Use the following prompt with the connected Stitch MCP to generate all screens before building components:

---

Design a personal finance web app called **FinWrap**. This is not a generic SaaS dashboard — it should feel bold, modern, and opinionated. Think the visual energy of Linear or Vercel's dashboard meets a finance app. Dark mode first. Every screen should feel like it was designed by someone who actually cares about craft.

---

### Visual Direction

- **Mood:** Bold, dense but breathable, data-forward. Not minimal to the point of boring. Not cluttered. Confident.
- **Dark background:** Very dark navy-black (`#0F1117`), not pure black, not grey
- **Cards/surfaces:** Slightly lifted from background (`#1A1D27`), subtle borders
- **Primary accent:** Indigo/violet (`#6366F1`) — used for CTAs, active states, highlights
- **Positive/money in:** Emerald green (`#10B981`)
- **Negative/money out:** Rose red (`#F43F5E`)
- **Warning:** Amber (`#F59E0B`)
- **Typography:** Inter font. Large bold numbers for financial figures. Hierarchy matters — big stats should feel BIG.
- **Charts:** Dark-themed, accent colored, clean gridlines, no chart junk
- **Borders:** Subtle, `1px`, low opacity — cards should feel elevated not boxed-in
- **Spacing:** Generous internal padding on cards. Content should breathe.
- **No generic blue SaaS vibes. No light grey backgrounds. No rounded-everything softness.**

---

### Layout Structure

**Sidebar navigation (desktop, fixed left):**
- App logo + name "FinWrap" at top
- Nav items with icons: Dashboard, Transactions, Budgets, Goals, Recurring, Splits, Insights, Wrapped
- User avatar + name at bottom with settings gear icon
- Active state: indigo left border + indigo tinted background on nav item

**Main content area:** Full width right of sidebar. Top bar with month selector (prev/next arrows + "March 2025") and account selector dropdown.

---

### Screens to Design

#### 1. Dashboard (`/dashboard`)

**Top stats row — 6 cards in a grid:**
- Opening Balance
- Total Credited (green tinted, upward arrow icon)
- Total Debited (red tinted, downward arrow icon)
- Closing Balance
- Net Saved (large, prominent — green if positive, red if negative)
- Savings Rate % (shown as a bold percentage with a thin circular progress ring around it)

**Alert banners (below stats, above charts):**
- Amber banner: "⚠️ Food budget at 87% — ₹390 remaining"
- Red banner: "🔴 Unusual transaction: ₹8,200 at unknown merchant on Tuesday"
- Sleek inline notification strips, not popup modals

**Charts row (two columns):**
- Left (wider): Daily spend bar chart — dark background, indigo bars, subtle gridlines, x-axis shows dates
- Right: Category donut chart — multi-colored segments, legend with category name + % + amount below

**Bottom row (two columns):**
- Left: Month-over-month line chart — last 6 months, two lines (credited in green, debited in red/rose)
- Right: Top 5 merchants list — ranked list with merchant name, category icon, and total spend. Bold amounts, subtle rank numbers.

**Recent transactions strip (full width at bottom):**
- Compact table: date, merchant, category chip, amount (green for credit, red for debit), account tag
- "View all" link at the end

---

#### 2. Transactions (`/transactions`)

**Top bar:**
- "Add Transaction" primary button (indigo, right aligned)
- "Import CSV" secondary button next to it
- Filter row below: month picker, category dropdown, type toggle (All / Debit / Credit), search input

**Transaction table (full width):**
- Columns: Date, Merchant, Category (colored chip with icon), Account, Amount, Type, Actions
- Debit amounts in rose red, credit amounts in emerald green
- Row hover: subtle highlight
- Bulk select checkboxes on left

**CSV Import modal:**
- Drag and drop zone with dashed border
- After upload: preview table of parsed transactions with "Confirm Import" button
- Duplicate rows flagged in amber

---

#### 3. Budget Goals (`/budgets`)

**Page header:** "March 2025 Budgets" + "Add Budget" button

**Budget cards grid (2–3 columns):**
Each card shows:
- Category icon + name
- Progress bar (green → amber → red based on % used)
- "₹2,100 of ₹3,000 spent" label
- % used bold on the right
- Small rollover badge if rollover is enabled

Over-budget cards: red tinted background + red border — visually pop as warnings.

---

#### 4. Smart Savings Goals (`/goals`)

**Goal cards (2 columns):**
Each card shows:
- Goal title (bold, large)
- Target amount
- Thick progress bar with saved amount / target below it
- Mode A: "📅 Deadline: March 31 — Save ₹3,750/month to hit your goal"
- Mode B: "📆 At ₹3,000/month — Completed by June 14"
- Pace indicator chip: "On Track ✅" / "Behind ⚠️" / "Ahead 🚀"
- "Add Contribution" button at bottom of card

**Create Goal modal:**
- Two large toggle tabs: "I have a deadline" vs "I can save X/month"
- Fields animate/swap based on selected mode
- Live preview calculation updates as user types

---

#### 5. Recurring Payments (`/recurring`)

**Top stat:** "Monthly recurring total: ₹4,850" — large and prominent

**Recurring list (full width cards):**
Each row/card:
- Merchant name + category icon
- Amount + frequency badge (Monthly / Weekly / Yearly)
- Next due date
- Status chip: green "Detected ✅" / amber "Missing ⚠️" / blue "Upcoming ⏭️"
- Auto-detected badge vs manually added
- Toggle to pause/activate

---

#### 6. Split Expenses (`/splits`)

**Two-panel layout: groups list (left) + group detail (right)**

**Group card (left):**
- Group name + member avatars (initials circles)
- Total group spend
- Net balance (green if owed, red if you owe)

**Group detail (right):**
- Expense list: who paid, what for, amount, split between
- Net balances summary
- "Settle Up" button per balance
- "Add Expense" button at top right

---

#### 7. AI Insights (`/insights`)

**Layout:** Editorial feel — more like a smart newsletter than a dashboard

**Weekly digest card:**
- Large card with subtle indigo gradient border
- AI-generated text, readable
- Key figures highlighted inline (bold + colored)
- "Refresh" icon to regenerate

**Anomaly flags section:**
- Cards with red/amber left border accent
- "Looks valid" / "Flag it" action buttons

**On-demand chat:**
- Simple input bar at bottom: "Ask anything about your finances..."
- Response appears as clean text block above — smart search feel, not chatbot UI

---

#### 8. Monthly Wrapped (`/wrapped`)

**This screen should feel completely different — celebratory, bold, poster-like**

**Month selector at top:** "View Wrapped for: March 2025 ▼"

**The Wrapped card (center, shareable):**
- Dark gradient background (deep indigo to near-black)
- "FinWrap — March 2025" at top in small caps
- Large bold stat: "You spent ₹28,400 this month"
- "You saved ₹6,200 (18% savings rate)" in green
- Biggest category: large icon + "🍔 Food & Dining — ₹8,200"
- Biggest splurge: "💸 ₹4,500 at Zomato on March 14"
- Savings streak: "🔥 3 months in a row with positive savings"
- AI roast line at bottom in italic
- FinWrap logo watermark at bottom

**Below card:** "Download as Image" + "Share" buttons

---

#### 9. Auth Screens (Login / Signup)

- Full screen dark background
- Centered card (~420px wide)
- "FinWrap" logo + tagline: "Your money, finally making sense."
- Email + password fields, Google OAuth button
- Subtle indigo glow on focused inputs

---

### Overall Vibe

If Linear and Monzo had a baby that grew up in India and used UPI — that's FinWrap. Bold numbers, purposeful color, dark and confident. Every rupee should feel accounted for and every screen should feel like it was worth opening.

---

## Color Tokens (for Tailwind config)

```js
// tailwind.config.js
colors: {
  background: '#0F1117',
  surface: '#1A1D27',
  border: '#2A2D3A',
  accent: '#6366F1',
  positive: '#10B981',
  negative: '#F43F5E',
  warning: '#F59E0B',
  'text-primary': '#F1F5F9',
  'text-secondary': '#94A3B8',
}
```

---

## Component Conventions

- All monetary amounts: `font-bold text-xl+`, right-aligned in tables
- Debit amounts: always `text-negative`
- Credit amounts: always `text-positive`
- Category chips: colored background (10% opacity of category color) + colored text + icon
- Status chips: same pattern — color-coded background + text
- Cards: `bg-surface border border-border rounded-xl p-5`
- Primary button: `bg-accent text-white font-semibold rounded-lg px-4 py-2 hover:opacity-90`
- Secondary button: `border border-border text-text-primary rounded-lg px-4 py-2 hover:bg-surface`
- Input focus ring: `ring-2 ring-accent`
- Sidebar width: `240px` fixed
- Top bar height: `56px` fixed

---

## Light Mode

Light mode is a toggle — dark is default. When implementing light mode, invert surface/background tokens only. Accent, positive, negative, and warning colors stay the same across both modes.

---

## Fonts

```html
<!-- In index.html -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
/* In index.css */
body {
  font-family: 'Inter', sans-serif;
}
```

---

## Notes for Antigravity

- Always generate Stitch designs before building a new page or component
- Match component structure exactly to Stitch output
- Use color tokens from tailwind.config.js — never hardcode hex values in components
- Recharts components should use `text-secondary` color for axis labels and `border` color for gridlines
- All chart containers: `bg-surface rounded-xl p-5`
- Empty states: centered illustration (use a simple SVG or Lucide icon) + short message + CTA button
- Loading states: skeleton shimmer using `animate-pulse bg-border rounded`
