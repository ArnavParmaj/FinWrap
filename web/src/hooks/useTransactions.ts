import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUserStore } from '../store/useUserStore';
import type { Transaction } from '../types';

export function useTransactions(month?: string) {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = collection(db, 'users', user.uid, 'transactions');

    let q;
    if (month) {
      // Filter by month prefix e.g. "2024-01"
      const startDate = `${month}-01`;
      // Calculate end date
      const [year, mon] = month.split('-').map(Number);
      const end = new Date(year, mon, 0); // last day of month
      const endDate = `${month}-${String(end.getDate()).padStart(2, '0')}`;
      q = query(
        ref,
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc')
      );
    } else {
      q = query(ref, orderBy('date', 'desc'));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Transaction[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Transaction, 'id'>),
        }));
        setTransactions(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useTransactions error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, month]);

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
      if (!user) return;
      const ref = collection(db, 'users', user.uid, 'transactions');
      await addDoc(ref, {
        ...tx,
        createdAt: Timestamp.now().toDate().toISOString(),
      });
    },
    [user]
  );

  const removeTransaction = useCallback(
    async (txId: string) => {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', txId));
    },
    [user]
  );

  return { transactions, loading, error, addTransaction, removeTransaction };
}
