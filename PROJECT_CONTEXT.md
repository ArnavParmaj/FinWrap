# FinWrap — Project Context & Implementation Roadmap

This document serves as the comprehensive context dump and implementation roadmap for **FinWrap** — a personal finance manager designed for India-first users. It describes the project vision, existing tech stack, the architecture of what has been completed, a detailed analysis of missing features/bugs, and a concrete plan of action.

---

## 1. Project Overview & Vision

FinWrap is a "Personal Finance OS" built for India-first users. It aims to integrate transaction tracking, budget management, dynamic savings goals, recurring subscriptions, peer-to-peer expense splitting, and AI-driven spending insights (powered by Gemini API) into a unified, visually stunning dark-mode web application.

*   **Audience:** V1 is for personal use; V2 is for friends & family (shared accounts/balances).
*   **Design Philosophy:** Dark-first, premium glassmorphism surfaces (`#1A1D27` elevated cards on `#0F1117` background), bold typography for financials, and high-contrast color highlights (positive green `#10B981`, negative rose `#F43F5E`, warning amber `#F59E0B`).

---

## 2. Tech Stack & Architecture

### Frontend
*   **React 19 + Vite** (TypeScript)
*   **Tailwind CSS v4** (with custom theme variables and utility classes in `src/index.css`)
*   **Zustand** (for global application state)
*   **React Router v7** (for client-side routing)
*   **Recharts v3** (for animated financial dashboards)
*   **React Markdown** (for rendering AI digests)
*   **html-to-image** (installed for canvas export, currently unused)
*   **PapaParse** (for client-side CSV statement parsing)

### Backend (Serverless Firebase)
*   **Firebase Authentication** (Email + password signup/login and Google OAuth)
*   **Cloud Firestore** (NoSQL realtime database)
*   **Firebase Storage** (Configured for future avatar uploads, currently unused)

### AI Core
*   **Google GenAI SDK (`@google/genai`)** using `gemini-2.5-flash` for stateless on-demand roasts and financial insights.

---

## 3. Directory Structure & Files Done So Far

```
web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout shell with Sidebar navigation
│   │   └── TopNav.tsx          # Top nav bar with page titles, search bar, and profile dropdown
│   ├── hooks/                  # Firebase data snapshot hooks
│   │   ├── useAuth.ts          # Authentication listener
│   │   ├── useBudgets.ts       # Firestore budgets sync (filtered by month YYYY-MM)
│   │   ├── useGoals.ts         # Firestore savings goals sync
│   │   ├── useSplits.ts        # Firestore splits (groups, expenses, settlements) sync
│   │   ├── useSubscriptions.ts # Firestore subscriptions sync
│   │   └── useTransactions.ts  # Firestore transactions sync (filtered by month YYYY-MM)
│   ├── layouts/
│   ├── lib/
│   │   ├── firebase.ts         # Firebase App initialization
│   │   ├── dashboardStats.ts   # Core math utilities for computing cashflow, trends, and percents
│   │   └── gemini.ts           # Gemini API integrations for insights andWrapped roasts
│   ├── pages/                  # Route view components
│   │   ├── Auth.tsx            # Login and sign-up card with Google sign-in
│   │   ├── Budgets.tsx         # Category spending budgets creation and progress bars
│   │   ├── Dashboard.tsx       # Main analytics page with Recharts and alert banners
│   │   ├── Goals.tsx           # Mode A (deadline) & Mode B (fixed capacity) savings tracker
│   │   ├── Insights.tsx        # Weekly digest and high-value anomaly flags page
│   │   ├── Recurring.tsx       # Active/archived subscription list and monthly total calculator
│   │   ├── Settings.tsx        # User profile configuration page (currently barebones placeholder)
│   │   ├── Splits.tsx          # Split group directories, ledger activity, and settle-up forms
│   │   ├── Transactions.tsx    # List, manual add/edit forms, filters, and PapaParse CSV uploader
│   │   └── Wrapped.tsx         # Year/month closing stats uploader and AI summary roast card
│   ├── store/
│   │   ├── useAppStore.ts      # Active month (YYYY-MM) and sidebar toggle state
│   │   └── useUserStore.ts     # Logged-in user profile state
│   ├── types.ts                # Shared TypeScript models and interfaces
│   ├── App.css
│   ├── App.tsx                 # Client routes setup
│   ├── index.css               # Styling system overrides and custom glassmorphism components
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 4. Work Done So Far (Detailed Checklist)

*   [x] **Authentication Flow**: Working email/password sign-up, sign-in, and Google OAuth via Firebase. Protected routes wrapping pages.
*   [x] **State Management**: State-bound month picker (`useAppStore`) and global authentication persistence (`useUserStore`).
*   [x] **Dashboard Layout**: Top stats card rows, daily spending bar charts, and category spending donut breakdowns using Recharts.
*   [x] **Transaction Logs**: Inline edit and delete, server pagination (20 items/page), and category/type/month filtering.
*   [x] **CSV Upload (PapaParse)**: Basic statement parsing mapping date, description, amount, type, and category columns.
*   [x] **Category Budgets**: Limit setting per category per month, warning indicator bars (green $\to$ yellow at 80% $\to$ red at 100%).
*   [x] **Savings Goals**: Math models calculating weekly/monthly requirements (Mode A) and projected target completion dates (Mode B). Logged monthly contributions.
*   [x] **Group Splits**: Creating groups, adding custom members (names only), logging group expenses with split distribution configurations (equal, exact, percentage, shares), and recording group settlements.
*   [x] **Insights Engine**: Basic monthly deep scan using `gemini-2.5-flash` passing last 30 days of transactions as context.
*   [x] **Monthly Wrapped Card**: Celebration card layout compiling monthly totals, top spend categories, biggest splurge, and loading AI-generated roasts.

---

## 5. Critical Issues, Gaps, and Bugs (Backlog)

The codebase has several incomplete integrations, dummy states, and bugs that need to be resolved.

### 5.1. TopNav Global Search ([TopNav.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/components/TopNav.tsx#L61-L70) & [Transactions.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Transactions.tsx#L582))
*   **Issue:** The Search input in `TopNav.tsx` has no bound state or `onChange` listener. In `Transactions.tsx`, the local search state is commented out on the assumption that `TopNav` handles it.
*   **Impact:** Transaction searching is completely broken/non-functional.
*   **Fix Required:** Connect `TopNav.tsx` search state to a global Zustand variable or coordinate it via custom hooks so that typing in the search bar dynamically filters the Transaction list.

### 5.2. Split Expenses: Balances & Debt Simplification ([Splits.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Splits.tsx#L24-L53))
*   **Issue 1 (Math Error):** The group ledger computes member balances purely as: `Individual Paid - Individual Owed`. It displays "Owes you X" if a member has a net negative balance, and "You owe them X" if a member is net positive. This is logically incorrect: a member with a net negative balance owes money *to the group*, not necessarily to *You*.
*   **Issue 2 (No Debt Simplification):** The PRD requires a **Debt Simplification Algorithm** (Splitwise-style minimization of transactions) to compute exactly who owes how much to whom.
*   **Fix Required:** 
    1. Implement a greedy flow network or heap-based debt simplification algorithm in the client.
    2. Display a list of simplified peer-to-peer debts (e.g., *"Sarah owes Mark ₹450"*, *"You owe Mark ₹200"*).
    3. Ensure the "Settle Up" action records payments against these specific paths.

### 5.3. Settings Page is a Blank Shell ([Settings.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Settings.tsx))
*   **Issue:** The settings page displays user name and email read-only.
*   **Fix Required:** Build out the full PRD settings specification:
    *   **Profile Editor**: Form to update user display name and upload/link an avatar image.
    *   **Currency Selector**: Dropdown to select currency symbols (defaulting to ₹ INR), updating values app-wide.
    *   **Theme Toggle**: Dark/Light mode theme updates persisted to Firestore/local storage.
    *   **Accounts Manager**: Interface to add, rename, and set opening balances for accounts (`bank`, `wallet`, `cash`).
    *   **Custom Categories Editor**: recolor, add, rename, and delete custom expense categories.
    *   **Data Export**: Trigger to download all of a user's transaction records, budgets, and savings goals as a consolidated CSV.
    *   **Account Deletion**: Safety lock to wipe all Firestore collections belonging to the user and delete their Firebase Auth user record.

### 5.4. CSV Statements: Duplicate Check & Auto-Categorisation ([Transactions.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Transactions.tsx#L268-L330))
*   **Issue 1 (No Auto-Categorisation):** The CSV importer currently assigns categories directly based on the CSV's raw strings.
*   **Issue 2 (No Duplicate Checking):** Statement imports write all rows directly, leading to duplicate entries if the user uploads overlapping files.
*   **Fix Required:**
    *   Implement keyword merchant parsing during PapaParse compilation. Map merchants (e.g., `Zomato`, `Swiggy`, `Uber`, `Netflix`) to their respective category IDs (`food`, `transport`, `entertainment`) using regex or string matches.
    *   Run a duplicate check before saving: flag any row matching an existing transaction's `date` + `amount` + `merchant` in the DB. Show a checkbox uploader list highlighting these duplicates, defaulting to "skip on import".

### 5.5. AI Insights: Stateless Chat Console ([Insights.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Insights.tsx))
*   **Issue:** The on-demand chatbot interface described in the PRD is entirely missing.
*   **Fix Required:**
    *   Add a message history window and a bottom chat input bar ("Ask anything about your finances...").
    *   Implement a stateless query handler passing the last 30–90 days of transaction data as structured JSON context in the prompt to `gemini-2.5-flash`.
    *   Render answers cleanly in ReactMarkdown.

### 5.6. Insights Page: Dynamic Anomaly Detection ([Insights.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Insights.tsx#L34-L35))
*   **Issue:** Anomalies are hardcoded to flag any debit > ₹5,000.
*   **Fix Required:** Update the anomaly extraction logic to compute average category spend for the user and flag debits that represent a significant deviation (e.g., $>3.5\times$ the category standard deviation or average monthly category amount).

### 5.7. Wrapped: Export Shareable Image ([Wrapped.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Wrapped.tsx))
*   **Issue:** The "Download as Image" and "Share" buttons are missing from the Wrapped view.
*   **Fix Required:** Import `html-to-image` and write a script to capture the `#wrapped-card` DOM element, render it to a blob, and trigger a browser download action for a `wrapped-month-year.png` image.

### 5.8. Dashboard: Opening Balance Ledger ([Dashboard.tsx](file:///Users/arnavparmaj/Projects/FinWrap/web/src/pages/Dashboard.tsx#L138-L139))
*   **Issue:** Opening balance calculations are hardcoded to `0`.
*   **Fix Required:** Implement a query in the database that sums all historical net transactions (credits minus debits) prior to the active month's start date to calculate a genuine opening ledger balance.

---

## 6. Project Setup & Dev Guide

### Local Environment Variables (`web/.env.local`)
Create this file in the `web/` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Dev Commands
Run commands in the `/web` directory:
```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Run linting check
npm run lint

# Build for production validation
npm run build
```
