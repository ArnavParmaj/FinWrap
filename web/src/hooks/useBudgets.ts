import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUserStore } from '../store/useUserStore';
import type { Budget } from '../types';

export function useBudgets(month: string) {
  const { user } = useUserStore();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // Use queueMicrotask to avoid calling setState synchronously within an effect
      queueMicrotask(() => {
        setBudgets([]);
        setLoading(false);
      });
      return;
    }

    const ref = collection(db, 'users', user.uid, 'budgets');
    const q = query(ref, where('month', '==', month));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Budget[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Budget, 'id'>),
      }));
      setBudgets(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, month]);

  const addBudget = useCallback(
    async (budget: Omit<Budget, 'id' | 'createdAt' | 'spent'>) => {
      if (!user) return;
      const ref = collection(db, 'users', user.uid, 'budgets');
      await addDoc(ref, {
        ...budget,
        spent: 0,
        userId: user.uid,
        createdAt: Timestamp.now().toDate().toISOString(),
      });
    },
    [user]
  );

  const updateBudget = useCallback(
    async (id: string, changes: Partial<Budget>) => {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid, 'budgets', id), changes);
    },
    [user]
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'budgets', id));
    },
    [user]
  );

  return { budgets, loading, addBudget, updateBudget, deleteBudget };
}
