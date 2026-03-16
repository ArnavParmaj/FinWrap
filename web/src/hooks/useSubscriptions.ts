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
import type { Subscription } from '../types';

export function useSubscriptions() {
  const { user } = useUserStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setSubscriptions([]);
        setLoading(false);
      });
      return;
    }

    const ref = collection(db, 'users', user.uid, 'subscriptions');
    const q = query(ref, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Subscription[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Subscription, 'id'>),
      }));
      setSubscriptions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addSubscription = useCallback(
    async (sub: Omit<Subscription, 'id' | 'createdAt'>) => {
      if (!user) return;
      const ref = collection(db, 'users', user.uid, 'subscriptions');
      await addDoc(ref, {
        ...sub,
        userId: user.uid,
        createdAt: Timestamp.now().toDate().toISOString(),
      });
    },
    [user]
  );

  const updateSubscription = useCallback(
    async (id: string, changes: Partial<Subscription>) => {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid, 'subscriptions', id), changes);
    },
    [user]
  );

  const deleteSubscription = useCallback(
    async (id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', id));
    },
    [user]
  );

  return { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription };
}
