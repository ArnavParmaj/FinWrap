export type User = {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  settings: {
    theme: 'dark' | 'light';
    currency: string;
    notificationsEnabled: boolean;
  };
};

export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'cash';
  openingBalance: number;
  createdAt: string;
};

export type Transaction = {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  categoryId: string;
  merchant: string;
  note?: string;
  date: string; // ISO string YYYY-MM-DD
  isRecurring: boolean;
  accountId: string;
  source: 'manual' | 'csv' | 'sms';
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
};

export type Budget = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number; // monthly limit
  spent: number; // calculated
  month: string; // YYYY-MM
  rollover: boolean;
  userId: string;
  createdAt: string;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  icon: string;
  color: string;
  targetDate: string;
  userId: string;
  createdAt: string;
};

export type DailySpend = {
  date: string; // YYYY-MM-DD
  amount: number;
};

export type CategorySpend = {
  name: string;
  value: number;
  color: string;
};

export type DashboardStats = {
  openingBalance: number;
  totalCredited: number;
  totalDebited: number;
  netSavings: number;
  investments: number;
  closingBalance: number;
  prevOpeningBalance: number;
  prevTotalCredited: number;
  prevTotalDebited: number;
  prevNetSavings: number;
  prevInvestments: number;
  prevClosingBalance: number;
  dailySpend: DailySpend[];
  categoryBreakdown: CategorySpend[];
  topBudgetAlert: { categoryName: string; percent: number } | null;
};
