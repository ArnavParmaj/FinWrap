# FinWrap — Product Requirements Document (Final)

> Your personal finance OS. Built for how Indians actually manage money.

---

## Product Vision

FinWrap is a personal finance manager built for India-first users. It gives you a complete picture of your money — spending, saving, splitting, and planning — across web and mobile. Designed around UPI and bank CSVs, with clean UI, smart AI insights, and enough depth to actually change how you think about your money.

**V1 Audience:** Personal use only
**V2 Audience:** Friends and family (if V1 is good)
**Monetization:** Free for now, freemium later if it grows
**Build philosophy:** Solid foundation, move fast

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web Framework | React + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State Management | Zustand |
| Backend & Auth | Firebase (Firestore + Firebase Auth + FCM + Storage) |
| AI Layer | Claude API (Anthropic) |
| CSV Parsing | PapaParse |
| Shareable Cards | html2canvas |
| Icons | Lucide React |
| Mobile (Phase 2) | Flutter (iOS + Android) |
| Web Hosting | Vercel |

---

## Platform Roadmap

| Platform | Phase | Timeline |
|---|---|---|
| Web app (React + Vite) | Phase 1 | Now |
| Flutter mobile (iOS + Android) | Phase 2 | After web is solid |
| PWA (installable, offline) | Phase 3 | Later |

---

## Phase Overview

### Phase 1 — Web App (Build Now)
Full-featured web app covering all core features: transactions, dashboard, budgets, savings goals, recurring payments, split expenses, AI insights, and Monthly Wrapped card.

### Phase 2 — Mobile App
Flutter app mirroring all web features. UPI SMS auto-parsing on Android. Bill reminders with FCM push notifications.

### Phase 3 — Expand
PWA support. Family finance mode (shared household, split goals). Freemium monetization if product grows beyond personal use.

---

## Firestore Data Architecture

```
users/{userId}
  name, email, avatar, createdAt
  settings: { theme, currency, notificationsEnabled }

users/{userId}/accounts/{accountId}
  name, type (bank | wallet | cash), openingBalance, createdAt

users/{userId}/transactions/{txId}
  amount, type (debit | credit), categoryId, merchant,
  note, date, isRecurring, accountId,
  source (manual | csv | sms), createdAt

users/{userId}/categories/{categoryId}
  name, icon, color, isDefault

users/{userId}/budgets/{budgetId}
  categoryId, month (YYYY-MM), amountLimit

users/{userId}/savingsGoals/{goalId}
  title, targetAmount, savedAmount,
  mode (deadline | monthly_capacity),
  deadline (ISO date, for Mode A),
  monthlyCapacity (number, for Mode B),
  contributions: [{ month: YYYY-MM, amount }],
  createdAt, updatedAt

users/{userId}/recurringPayments/{id}
  merchant, amount, frequency (monthly | weekly | yearly),
  nextDueDate, isAutoDetected, isActive

users/{userId}/bills/{billId}
  name, amount, dueDate, frequency (monthly | yearly | one-time),
  isPaid, paidOn, category, reminderDaysBefore

groups/{groupId}
  name, createdBy, members (userId[]), createdAt
  /expenses/{expenseId}
    paidBy, amount, description, splitBetween[], date
  /settlements/{settlementId}
    fromUser, toUser, amount, settledAt
```

---

## Features — Full Spec

---

### 1. Authentication

- Email + password signup and login
- Google OAuth (one-click)
- Persistent login session via Firebase Auth
- User profile: name, avatar upload, currency (default ₹ INR), theme preference
- All preferences persisted to Firestore

---

### 2. Dashboard (`/dashboard`)

The home screen. A full financial snapshot for the currently selected month.

**Stats Row (top):**
- Opening Balance
- Total Credited (money in)
- Total Debited (money out)
- Closing Balance
- Net Saved (credited − debited)
- Savings Rate % (net saved ÷ credited × 100)

**Charts Section:**
- Daily spend bar chart — x: day of month, y: ₹ amount spent
- Category donut chart — % breakdown of spend per category
- Month-over-month line chart — last 6 months, debit vs credit trend

**Lists:**
- Top 5 merchants this month (by cumulative spend)
- Recent 10 transactions with quick edit and delete

**Alert Banners (top of page):**
- Budget warnings: yellow at 80%, red at 100%+ per category
- Anomaly flags: "Unusual ₹8,200 at unknown merchant on Tuesday — review?"
- Missing recurring payment: "Netflix not detected this month"

**Controls:**
- Month selector to navigate between past months
- Account selector to filter by a specific bank/wallet or view all

---

### 3. Transactions (`/transactions`)

**Manual Entry:**
- Amount (₹)
- Type: Debit / Credit
- Category (searchable dropdown with color + icon)
- Merchant name (autocomplete from past merchants)
- Date (date picker, defaults to today)
- Account (which bank or wallet)
- Note (optional)
- Mark as recurring (toggle)

**CSV Import:**
- Upload bank statement CSV
- Parsed entirely client-side via PapaParse (no data leaves the browser)
- Auto-categorize merchants via keyword matching:

| Keywords (partial match) | Category |
|---|---|
| zomato, swiggy, blinkit, dunzo, eatsure | 🍔 Food & Dining |
| netflix, spotify, prime, hotstar, zee5 | 🎬 Entertainment |
| amazon, flipkart, myntra, meesho, nykaa | 🛍️ Shopping |
| ola, uber, rapido, irctc, redbus, metro | 🚗 Transport |
| airtel, jio, vi, bsnl, electricity, bescom, tata power | ⚡ Utilities |
| hospital, pharmacy, apollo, medplus, 1mg | 🏥 Health |
| byju, udemy, coursera, unacademy | 📚 Education |
| anything unmatched | 📦 Uncategorized |

- Preview parsed transactions in a table before confirming
- Duplicate detection: same amount + merchant + date = flagged, skipped by default
- Phase 1 CSV support: HDFC and SBI formats
- Phase 2: extend to ICICI, Axis, Kotak

**Transaction List:**
- Filter by: month, category, type (debit/credit), account, merchant
- Search by merchant name or note
- Sort by: date (default), amount
- Edit transaction inline
- Delete single or bulk select + delete

---

### 4. Budget Goals (`/budgets`)

- Set a monthly spending limit per category (e.g., Food: ₹3,000/month)
- Live progress bar per category:
  - 0–79% used → Green
  - 80–99% used → Amber
  - 100%+ used → Red (over budget)
- Rollover toggle: carry unused budget to next month
- Add, edit, delete budget goals anytime
- Dashboard alert banner automatically appears when a category hits 80% or 100%
- Month-level view: see all budgets for any past month

---

### 5. Smart Savings Goals (`/goals`)

Every goal supports two creation modes:

**Mode A — I have a deadline:**
- Inputs: Goal title, target amount (₹), deadline date
- Output: Required savings per month and per week calculated from today
- Example: "Save ₹15,000 by March 31 → ₹3,750/month or ₹937/week"

**Mode B — I have a fixed monthly capacity:**
- Inputs: Goal title, target amount (₹), how much you can save per month (₹)
- Output: Projected completion date
- Example: "₹15,000 at ₹3,000/month → Completed by June 14, 2025"

**Dynamic Recalculation:**
- Every month, log actual contribution toward goal
- System recalculates pace based on actual progress
- If behind: "You're ₹800 short — save ₹4,550 this month to stay on track"
- If ahead: "You're 2 weeks ahead of schedule 🎉"

**Goal Card UI:**
- Title + target amount
- Progress bar (saved ÷ target)
- Mode A: countdown to deadline + required monthly amount
- Mode B: projected completion date
- Monthly contribution log (list of past contributions)
- Quick-add contribution button
- Mark as complete (archives goal with completion date)

---

### 6. Recurring Payments (`/recurring`)

- Auto-detected from transaction history: same merchant + similar amount, 2+ occurrences → flagged as recurring
- Manual add option
- Fields: merchant name, amount, frequency (monthly / weekly / yearly), next due date
- Monthly recurring total shown at top of page
- Status indicators:
  - ✅ Detected this month
  - ⚠️ Expected but not found this month
  - ⏭️ Upcoming (due within 7 days)
- Toggle active / inactive (pause tracking without deleting)

---

### 7. Bill Reminders (`/bills`) *(Phase 2 — Flutter + FCM)*

- Add bills: electricity, rent, credit card, subscriptions, EMIs
- Fields: bill name, amount (estimated or fixed), due date, frequency, reminder lead time (e.g., 3 days before)
- Mark as paid (logs actual amount paid)
- Payment history per bill
- Dashboard widget: "3 bills due this week — ₹4,200 total"
- Push notifications via Firebase Cloud Messaging (Flutter Phase 2)

---

### 8. Split Expenses (`/splits`)

- Create a group (e.g., "Goa Trip", "Flat 4B", "Dinner April 12")
- Add members by name (Phase 1: name only, no account linking required)
- Log shared expenses:
  - Who paid
  - Total amount
  - Description
  - Split between whom (equal or custom amounts)
- Auto-calculate net balances: who owes whom exactly how much
- Simplify debts: reduces multiple IOUs to minimum transactions
- Settle up: mark a debt as resolved
- Shareable summary: one-tap copy of balances for WhatsApp

---

### 9. AI Insights (`/insights`)

Powered by Claude API. User's transaction data is passed as structured context per request — no raw data stored externally.

**Weekly Digest:**
- Auto-generated every Monday
- Natural language summary of last week's spending
- Week-over-week comparison
- One actionable tip based on patterns

**Monthly Report:**
- Generated on month close or on-demand
- Full spending narrative
- Category-level analysis ("You spent 43% more on Food than last month, mostly via Zomato")
- Savings performance vs goal
- Highlighted anomalies

**Anomaly Detection:**
- Flags transactions significantly above the user's category average
- Example: "₹8,200 at an unknown merchant — 4× your usual spend in this category"
- User actions: "Yes, it's valid" (clears flag) or "Mark as suspicious" (tags transaction)

**On-Demand Chat:**
- Simple text input on the Insights page
- Ask anything: "How much did I spend on food last month?", "Am I on track to hit my savings goal?"
- Claude answers using the user's data passed as context in the API call
- Not a persistent chat — stateless per query

---

### 10. Monthly Wrapped (`/wrapped`)

Available on-demand for any completed month.

**Shareable Summary Card (screenshot via html2canvas):**
- Month + year header
- Total spent vs total saved
- #1 spending category with icon + amount
- Biggest single transaction ("Splurge of the month")
- Most visited merchant
- Savings streak: how many consecutive months with positive savings
- AI-generated one-liner roast of spending habits (Claude API)
  - Example: *"₹4,200 on Zomato. ₹0 on groceries. Bold strategy."*
  - Example: *"You saved 34% this month. Your future self is proud. Your current self is hungry."*

**Share Button:**
- Captures card as PNG image
- Downloads to device or opens native share sheet (Flutter)

---

### 11. Settings (`/settings`)

- Edit display name and avatar
- Currency selector (default: ₹ INR)
- Dark / light theme toggle (persisted to Firestore)
- Manage accounts: add, rename, update opening balance
- Manage categories: add custom, rename, recolor, delete
- CSV format preference (HDFC / SBI / auto-detect)
- Export all data as CSV (transactions + goals + budgets)
- Delete account (wipes all Firestore data)

---

## Sprint Roadmap

### Sprint 1 — Foundation (Week 1)
- [ ] Vite + React + Tailwind + Zustand setup
- [ ] Firebase project: Auth, Firestore rules, Storage
- [ ] Auth flow: email/password + Google OAuth
- [ ] Firestore hooks: useTransactions, useCategories, useBudgets, useGoals
- [ ] Account management (add/edit bank accounts + opening balance)
- [ ] Dark/light theme toggle

### Sprint 2 — Transactions (Week 1–2)
- [ ] Manual transaction entry form
- [ ] Transaction list with filters + search
- [ ] Category system (defaults + custom)
- [ ] CSV import: PapaParse + merchant categorization
- [ ] Duplicate detection on import
- [ ] Edit and delete transactions

### Sprint 3 — Dashboard (Week 2)
- [ ] Stats row (opening/closing balance, net saved, savings rate)
- [ ] Daily spend bar chart (Recharts)
- [ ] Category donut chart (Recharts)
- [ ] Month-over-month line chart
- [ ] Top 5 merchants list
- [ ] Month selector
- [ ] Alert banners (budget + anomaly)

### Sprint 4 — Goals & Budgets (Week 3)
- [ ] Budget goals: create, progress bars, rollover toggle
- [ ] Savings goals: Mode A (deadline) + Mode B (capacity)
- [ ] Dynamic recalculation logic
- [ ] Monthly contribution logging
- [ ] Goal completion flow

### Sprint 5 — Recurring + Splits (Week 3–4)
- [ ] Recurring payment auto-detection algorithm
- [ ] Manual recurring add/edit
- [ ] Missing payment detection
- [ ] Split groups: create, add members
- [ ] Log shared expenses, auto-calculate balances
- [ ] Settle up flow + WhatsApp copy

### Sprint 6 — AI + Wrapped (Week 4)
- [ ] Claude API integration (weekly digest, monthly report)
- [ ] Anomaly detection + flagging UI
- [ ] On-demand chat on Insights page
- [ ] Monthly Wrapped card UI
- [ ] AI roast generation
- [ ] html2canvas screenshot + download

### Sprint 7 — Polish + Deploy (Week 4–5)
- [ ] Settings page (full)
- [ ] Data export (CSV)
- [ ] Responsive QA across breakpoints
- [ ] Loading states, empty states, error handling
- [ ] Deploy to Vercel

### Sprint 8 — Flutter App (Month 2)
- [ ] Flutter project setup
- [ ] Firebase Auth + Firestore integration
- [ ] Mirror all Phase 1 features
- [ ] UPI SMS parsing (Android background service)
- [ ] Bill reminders + FCM push notifications
- [ ] App Store + Play Store prep

---

## Out of Scope (V1)

- Investment tracking (stocks, MFs, FDs, crypto)
- Real bank API integration (Setu Account Aggregator)
- Family finance / household mode
- Multi-currency
- Freemium / payments
- Public launch

---

## Resume Description

> *"Built FinWrap, a full-stack personal finance manager with AI-powered spend insights and anomaly detection, smart savings goal engine with dynamic recalculation, CSV bank import with merchant auto-categorization, recurring payment tracking, split expense groups, and a monthly Wrapped-style shareable summary card. Stack: React + Vite, Tailwind CSS, Firebase (Auth + Firestore), Recharts, Zustand, Claude API. Flutter mobile app with UPI SMS auto-sync in progress."*
