import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUserStore } from '../store/useUserStore';
import type { SplitGroup, SplitExpense, SplitSettlement } from '../types';

export function useSplits() {
  const { user } = useUserStore();
  const [groups, setGroups] = useState<SplitGroup[]>([]);
  const [expenses, setExpenses] = useState<SplitExpense[]>([]);
  const [settlements, setSettlements] = useState<SplitSettlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setGroups([]);
        setExpenses([]);
        setSettlements([]);
        setLoading(false);
      });
      return;
    }

    const groupsRef = collection(db, 'users', user.uid, 'splitGroups');
    const expensesRef = collection(db, 'users', user.uid, 'splitExpenses');
    const settlementsRef = collection(db, 'users', user.uid, 'splitSettlements');

    const unsubs: (() => void)[] = [];

    unsubs.push(
      onSnapshot(query(groupsRef, orderBy('createdAt', 'desc')), (snapshot) => {
        setGroups(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SplitGroup)));
      })
    );

    unsubs.push(
      onSnapshot(query(expensesRef, orderBy('createdAt', 'desc')), (snapshot) => {
        setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SplitExpense)));
      })
    );

    unsubs.push(
      onSnapshot(query(settlementsRef, orderBy('createdAt', 'desc')), (snapshot) => {
        setSettlements(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SplitSettlement)));
        setLoading(false);
      })
    );

    return () => unsubs.forEach(fn => fn());
  }, [user]);

  const addGroup = useCallback(async (data: Omit<SplitGroup, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'splitGroups'), {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.now().toDate().toISOString(),
    });
  }, [user]);

  const addExpense = useCallback(async (data: Omit<SplitExpense, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'splitExpenses'), {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.now().toDate().toISOString(),
    });
  }, [user]);

  const addSettlement = useCallback(async (data: Omit<SplitSettlement, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'splitSettlements'), {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.now().toDate().toISOString(),
    });
  }, [user]);

  const removeGroup = useCallback(async (id: string) => {
     if (!user) return;
     await deleteDoc(doc(db, 'users', user.uid, 'splitGroups', id));
     // Optional: cleanup cascading
  }, [user]);

  return {
    groups,
    expenses,
    settlements,
    loading,
    addGroup,
    addExpense,
    addSettlement,
    removeGroup
  };
}
