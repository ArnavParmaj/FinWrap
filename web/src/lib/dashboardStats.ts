import type { Transaction, Budget, DashboardStats, DailySpend, CategorySpend } from '../types';

const INVESTMENT_CATEGORIES = ['investment', 'mutual fund', 'stocks', 'sip', 'fd', 'rd'];

function isInvestment(tx: Transaction, categoryName?: string): boolean {
  const name = (categoryName || tx.categoryId || '').toLowerCase();
  return INVESTMENT_CATEGORIES.some((kw) => name.includes(kw));
}

function calcStats(
  transactions: Transaction[],
  openingBalance: number,
  categoryMap: Record<string, { name: string; color: string }>
) {
  let totalCredited = 0;
  let totalDebited = 0;
  let investments = 0;

  const dailyMap: Record<string, number> = {};
  const catMap: Record<string, { value: number; color: string }> = {};

  for (const tx of transactions) {
    const catInfo = categoryMap[tx.categoryId] || { name: tx.categoryId, color: '#6366f1' };

    if (tx.type === 'credit') {
      totalCredited += tx.amount;
    } else {
      totalDebited += tx.amount;
      if (isInvestment(tx, catInfo.name)) {
        investments += tx.amount;
      }
      // Daily spend tracking (debits only)
      dailyMap[tx.date] = (dailyMap[tx.date] || 0) + tx.amount;
      // Category breakdown
      const label = catInfo.name;
      if (!catMap[label]) catMap[label] = { value: 0, color: catInfo.color };
      catMap[label].value += tx.amount;
    }
  }

  const netSavings = totalCredited - totalDebited;
  const closingBalance = openingBalance + netSavings;

  const dailySpend: DailySpend[] = Object.entries(dailyMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const categoryBreakdown: CategorySpend[] = Object.entries(catMap)
    .map(([name, { value, color }]) => ({ name, value, color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7); // top 7 categories

  return { totalCredited, totalDebited, investments, netSavings, closingBalance, dailySpend, categoryBreakdown };
}

export function computeDashboardStats(
  currentTransactions: Transaction[],
  prevTransactions: Transaction[],
  openingBalance: number,
  prevOpeningBalance: number,
  budgets: Budget[],
  categoryMap: Record<string, { name: string; color: string }>
): DashboardStats {
  const current = calcStats(currentTransactions, openingBalance, categoryMap);
  const prev = calcStats(prevTransactions, prevOpeningBalance, categoryMap);

  // Find the budget most over-limit
  let topBudgetAlert: DashboardStats['topBudgetAlert'] = null;
  for (const budget of budgets) {
    const percent = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
    if (percent >= 80) {
      if (!topBudgetAlert || percent > topBudgetAlert.percent) {
        topBudgetAlert = { categoryName: budget.categoryName, percent };
      }
    }
  }

  return {
    openingBalance,
    totalCredited: current.totalCredited,
    totalDebited: current.totalDebited,
    netSavings: current.netSavings,
    investments: current.investments,
    closingBalance: current.closingBalance,
    prevOpeningBalance,
    prevTotalCredited: prev.totalCredited,
    prevTotalDebited: prev.totalDebited,
    prevNetSavings: prev.netSavings,
    prevInvestments: prev.investments,
    prevClosingBalance: prev.closingBalance,
    dailySpend: current.dailySpend,
    categoryBreakdown: current.categoryBreakdown,
    topBudgetAlert,
  };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPrevMonth(month: string): string {
  const [year, mon] = month.split('-').map(Number);
  if (mon === 1) return `${year - 1}-12`;
  return `${year}-${String(mon - 1).padStart(2, '0')}`;
}

export function formatMonthLabel(month: string): string {
  const [year, mon] = month.split('-').map(Number);
  const date = new Date(year, mon - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}
