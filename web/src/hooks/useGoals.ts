import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUserStore } from '../store/useUserStore';
import type { Goal } from '../types';

export function useGoals() {
  const { user } = useUserStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setGoals([]);
        setLoading(false);
      });
      return;
    }

    const ref = collection(db, 'users', user.uid, 'goals');
    const q = query(ref, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Goal[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Goal, 'id'>),
      }));
      setGoals(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addGoal = useCallback(
    async (goal: Omit<Goal, 'id' | 'createdAt' | 'savedAmount'> & { savedAmount?: number }) => {
      if (!user) return;
      const ref = collection(db, 'users', user.uid, 'goals');
      await addDoc(ref, {
        ...goal,
        savedAmount: goal.savedAmount || 0,
        userId: user.uid,
        createdAt: Timestamp.now().toDate().toISOString(),
      });
    },
    [user]
  );

  const updateGoal = useCallback(
    async (id: string, changes: Partial<Goal>) => {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid, 'goals', id), changes);
    },
    [user]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    },
    [user]
  );

  return { goals, loading, addGoal, updateGoal, deleteGoal };
}
