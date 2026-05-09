# Graph Report - .  (2026-05-09)

## Corpus Check
- 60 files · ~214,114 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 177 nodes · 271 edges · 69 communities (68 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Large Module 0|Large Module 0]]
- [[_COMMUNITY_Authentication|Authentication]]
- [[_COMMUNITY_Large Module 2|Large Module 2]]
- [[_COMMUNITY_Budget Tracking|Budget Tracking]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]
- [[_COMMUNITY_Financial Goals|Financial Goals]]
- [[_COMMUNITY_Transaction Management|Transaction Management]]

## God Nodes (most connected - your core abstractions)
1. `useUserStore` - 21 edges
2. `useTransactions()` - 14 edges
3. `formatMonthLabel()` - 8 edges
4. `DashboardPage()` - 8 edges
5. `formatINR()` - 7 edges
6. `useAppStore` - 7 edges
7. `Transaction` - 6 edges
8. `useSubscriptions()` - 6 edges
9. `useBudgets()` - 6 edges
10. `useGoals()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `TopNav()` --calls--> `useUserStore`  [EXTRACTED]
  src/components/TopNav.tsx → src/store/useUserStore.ts
- `useTransactions()` --calls--> `useUserStore`  [EXTRACTED]
  src/hooks/useTransactions.ts → src/store/useUserStore.ts
- `DashboardPage()` --calls--> `useTransactions()`  [EXTRACTED]
  src/pages/Dashboard.tsx → src/hooks/useTransactions.ts
- `TransactionsPage()` --calls--> `useTransactions()`  [EXTRACTED]
  src/pages/Transactions.tsx → src/hooks/useTransactions.ts
- `BudgetsPage()` --calls--> `useTransactions()`  [EXTRACTED]
  src/pages/Budgets.tsx → src/hooks/useTransactions.ts

## Communities (69 total, 1 thin omitted)

### Community 0 - "Large Module 0"
Cohesion: 0.16
Nodes (15): useSubscriptions(), calcStats(), computeDashboardStats(), formatINR(), getPrevMonth(), INVESTMENT_CATEGORIES, isInvestment(), pctChange() (+7 more)

### Community 1 - "Authentication"
Cohesion: 0.23
Nodes (10): TopNav(), app, auth, db, firebaseConfig, storage, AuthPage(), SettingsPage() (+2 more)

### Community 2 - "Large Module 2"
Cohesion: 0.18
Nodes (13): useSplits(), SplitsPage(), Account, Category, CategorySpend, DashboardStats, GoalContribution, SplitExpense (+5 more)

### Community 3 - "Budget Tracking"
Cohesion: 0.17
Nodes (11): useBudgets(), formatMonthLabel(), AddBudgetModalProps, BudgetDetailsModal(), BudgetsPage(), DEFAULT_CATEGORIES, MONTHS, TransactionsPage() (+3 more)

### Community 4 - "Transaction Management"
Cohesion: 0.16
Nodes (11): AddModalProps, AddTransactionModal(), CsvModalProps, DEFAULT_CATEGORIES, DeleteConfirmModal(), DeleteConfirmModalProps, emptyForm(), getCategoryInfo() (+3 more)

### Community 5 - "Transaction Management"
Cohesion: 0.32
Nodes (8): useTransactions(), generateDeepInsights(), generateWrappedNarrative(), formatINR(), InsightsPage(), formatINR(), WrappedPage(), Transaction

### Community 6 - "Financial Goals"
Cohesion: 0.25
Nodes (4): useGoals(), GOAL_TEMPLATES, GoalsPage(), Goal

## Knowledge Gaps
- **22 isolated node(s):** `Account`, `Category`, `GoalContribution`, `INVESTMENT_CATEGORIES`, `firebaseConfig` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useUserStore` connect `Authentication` to `Large Module 0`, `Large Module 2`, `Budget Tracking`, `Transaction Management`, `Financial Goals`, `Transaction Management`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `useTransactions()` connect `Transaction Management` to `Large Module 0`, `Authentication`, `Large Module 2`, `Budget Tracking`, `Transaction Management`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `formatINR()` connect `Large Module 0` to `Large Module 2`, `Budget Tracking`, `Transaction Management`, `Financial Goals`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `Account`, `Category`, `GoalContribution` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._