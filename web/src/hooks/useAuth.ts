import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchUserSettings } from '../lib/settingsHelpers';

export function useAuth() {
  const { user, setUser, isLoading, setLoading, setFullSettings } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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
        
        try {
          const settings = await fetchUserSettings(firebaseUser.uid);
          setFullSettings(settings);
          // Override name and theme based on fullSettings
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: settings.displayName || firebaseUser.displayName || 'FinWrap User',
            createdAt: new Date().toISOString(),
            settings: {
              theme: settings.theme || 'dark',
              currency: settings.currency || 'INR',
              notificationsEnabled: true
            }
          });
        } catch (e) {
          console.error("Failed to fetch full settings", e);
        }
        
      } else {
        setUser(null);
        setFullSettings(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setFullSettings]);

  return { user, isLoading };
}
