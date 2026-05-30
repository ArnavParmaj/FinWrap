# Graph Report - .  (2026-05-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 186 nodes · 314 edges · 23 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e295bf5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Large Module 0|Large Module 0]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Large Module 2|Large Module 2]]
- [[_COMMUNITY_Budget Tracking|Budget Tracking]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]
- [[_COMMUNITY_Financial Goals|Financial Goals]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]
- [[_COMMUNITY_Singleton 8|Singleton 8]]
- [[_COMMUNITY_Singleton 9|Singleton 9]]
- [[_COMMUNITY_Singleton 10|Singleton 10]]

## God Nodes (most connected - your core abstractions)
1. `Transaction` - 22 edges
2. `DashboardStats` - 20 edges
3. `useUserStore` - 17 edges
4. `Features — Full Spec` - 12 edges
5. `formatINR()` - 11 edges
6. `Screens to Design` - 10 edges
7. `FinWrap — Product Requirements Document (Final)` - 10 edges
8. `Sprint Roadmap` - 9 edges
9. `Common Development Tasks` - 9 edges
10. `DashboardPage()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `TopNav()` --calls--> `useUserStore`  [EXTRACTED]
  web/src/components/TopNav.tsx → web/src/store/useUserStore.ts
- `useGoals()` --calls--> `useUserStore`  [EXTRACTED]
  web/src/hooks/useGoals.ts → web/src/store/useUserStore.ts
- `useGoals()` --calls--> `GoalsPage()`  [EXTRACTED]
  web/src/hooks/useGoals.ts → web/src/pages/Goals.tsx
- `useGoals()` --calls--> `DashboardPage()`  [EXTRACTED]
  web/src/hooks/useGoals.ts → web/src/pages/Dashboard.tsx
- `formatMonthLabel()` --calls--> `BudgetDetailsModal()`  [EXTRACTED]
  web/src/lib/dashboardStats.ts → web/src/pages/Budgets.tsx

## Communities (23 total, 0 thin omitted)

### Community 0 - "Large Module 0"
Cohesion: 0.15
Nodes (13): TopNav(), useAuth(), auth, firebaseConfig, storage, AuthPage(), RecurringPage(), SettingsPage() (+5 more)

### Community 1 - "Authentication"
Cohesion: 0.14
Nodes (18): calcStats(), computeDashboardStats(), formatMonthLabel(), getPrevMonth(), INVESTMENT_CATEGORIES, isInvestment(), pctChange(), BudgetDetailsModal() (+10 more)

### Community 2 - "Large Module 2"
Cohesion: 0.09
Nodes (21): code:block1 (users/{userId}), FinWrap — Product Requirements Document (Final), Firestore Data Architecture, Out of Scope (V1), Phase 1 — Web App (Build Now), Phase 2 — Mobile App, Phase 3 — Expand, Phase Overview (+13 more)

### Community 3 - "Budget Tracking"
Cohesion: 0.11
Nodes (17): Architecture, Backend Services, Code Quality, code:bash (npm run dev       # Start development server), code:bash (npm run lint      # Run ESLint), Common Development Tasks, Component Structure, Data Flow Patterns (+9 more)

### Community 4 - "Transaction Management"
Cohesion: 0.19
Nodes (15): 10. Monthly Wrapped (`/wrapped`), 11. Settings (`/settings`), 1. Authentication, 2. Dashboard (`/dashboard`), 3. Transactions (`/transactions`), 4. Budget Goals (`/budgets`), 5. Smart Savings Goals (`/goals`), 6. Recurring Payments (`/recurring`) (+7 more)

### Community 5 - "Transaction Management"
Cohesion: 0.22
Nodes (10): SplitsPage(), Account, Category, GoalContribution, SplitExpense, SplitGroup, SplitOwer, SplitPayer (+2 more)

### Community 6 - "Financial Goals"
Cohesion: 0.14
Nodes (13): code:js (// tailwind.config.js), code:html (<!-- In index.html -->), code:css (/* In index.css */), Color Tokens (for Tailwind config), Component Conventions, FinWrap — UI Design Requirements, Fonts, Layout Structure (+5 more)

### Community 7 - "Transaction Management"
Cohesion: 0.2
Nodes (10): DEFAULT_CATEGORIES, AddModalProps, AddTransactionModal(), CsvModalProps, DeleteConfirmModal(), emptyForm(), getCategoryInfo(), TransactionFormData (+2 more)

### Community 8 - "Singleton 8"
Cohesion: 0.24
Nodes (5): useGoals(), db, GOAL_TEMPLATES, GoalsPage(), Goal

### Community 9 - "Singleton 9"
Cohesion: 0.44
Nodes (5): generateDeepInsights(), generateWrappedNarrative(), InsightsPage(), formatINR(), WrappedPage()

### Community 10 - "Singleton 10"
Cohesion: 0.33
Nodes (5): code:js (export default defineConfig([), code:js (// eslint.config.js), Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **62 isolated node(s):** `Account`, `Category`, `GoalContribution`, `INVESTMENT_CATEGORIES`, `firebaseConfig` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Transaction` connect `Transaction Management` to `Large Module 0`, `Singleton 9`, `Transaction Management`, `Authentication`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `FinWrap — Product Requirements Document (Final)` connect `Large Module 2` to `Transaction Management`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Features — Full Spec` connect `Transaction Management` to `Large Module 2`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `Account`, `Category`, `GoalContribution` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Authentication` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Large Module 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Budget Tracking` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._