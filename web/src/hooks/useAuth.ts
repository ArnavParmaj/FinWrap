import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const { user, setUser, isLoading, setLoading } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Here you would typically fetch additional user profile data from Firestore
        // For now, we'll populate the store with the basic auth data
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'FinWrap User',
          createdAt: new Date().toISOString(),
          settings: {
            theme: 'dark',
            currency: 'INR',
            notificationsEnabled: true
          }
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return { user, isLoading };
}
