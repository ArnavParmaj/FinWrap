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
  icon: string; // Lucide icon name
  color: string; // hex code
  isDefault: boolean;
};
