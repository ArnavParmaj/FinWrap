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
  isArchived?: boolean;
  userId: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  category: string;
  cycle: 'monthly' | 'yearly' | 'weekly';
  nextPaymentDate: string; // YYYY-MM-DD
  status: 'active' | 'missing' | 'cancelled';
  isActive: boolean;
  iconUrl?: string;
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

export type SplitGroup = {
  id: string;
  name: string;
  description?: string;
  members: { name: string; avatarUrl?: string }[];
  userId: string;
  createdAt: string;
};

export type SplitExpense = {
  id: string;
  groupId: string;
  description: string;
  totalAmount: number;
  paidBy: string; // name of the member, or 'You'
  splitEqually: boolean;
  date: string;
  userId: string;
  createdAt: string;
};

export type SplitSettlement = {
  id: string;
  groupId: string;
  from: string; // name
  to: string; // name
  amount: number;
  date: string;
  userId: string;
  createdAt: string;
};
