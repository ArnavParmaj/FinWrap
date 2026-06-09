import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from './firebase';
import type { UserSettings, SettingsAccount, SettingsCategory } from '../types';

// ─── Default categories seeded on first load ─────────────────────────────────
export const DEFAULT_CATEGORIES: Omit<SettingsCategory, 'id'>[] = [
  { name: 'Food & Dining',    color: '#f59e0b', isCustom: false },
  { name: 'Transport',        color: '#3b82f6', isCustom: false },
  { name: 'Entertainment',    color: '#8b5cf6', isCustom: false },
  { name: 'Shopping',         color: '#ec4899', isCustom: false },
  { name: 'Health',           color: '#10b981', isCustom: false },
  { name: 'Utilities',        color: '#06b6d4', isCustom: false },
  { name: 'Rent / Housing',   color: '#f43f5e', isCustom: false },
  { name: 'Investments',      color: '#6467f2', isCustom: false },
  { name: 'Groceries',        color: '#84cc16', isCustom: false },
  { name: 'Other',            color: '#94a3b8', isCustom: false },
];

// ─── Fetch complete user settings from Firestore ──────────────────────────────
export async function fetchUserSettings(uid: string): Promise<UserSettings> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  let displayName = '';
  let avatarURL = '';
  let theme: 'dark' | 'light' = 'dark';
  let currency = 'INR';

  if (userSnap.exists()) {
    const data = userSnap.data();
    displayName = data.displayName || data.name || '';
    avatarURL   = data.avatarURL   || '';
    theme       = data.theme       || 'dark';
    currency    = data.currency    || 'INR';
  }

  // Fetch accounts subcollection
  const accountsSnap = await getDocs(collection(db, 'users', uid, 'accounts'));
  const accounts: SettingsAccount[] = accountsSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SettingsAccount, 'id'>),
  }));

  // Fetch categories subcollection
  const categoriesSnap = await getDocs(collection(db, 'users', uid, 'categories'));
  let categories: SettingsCategory[] = categoriesSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<SettingsCategory, 'id'>),
  }));

  // Seed defaults if empty
  if (categories.length === 0) {
    const catRef = collection(db, 'users', uid, 'categories');
    const added = await Promise.all(
      DEFAULT_CATEGORIES.map((c) => addDoc(catRef, c))
    );
    categories = added.map((ref, i) => ({
      id: ref.id,
      ...DEFAULT_CATEGORIES[i],
    }));
  }

  return { displayName, avatarURL, theme, currency, accounts, categories };
}

// ─── Update a top-level field on the user doc ─────────────────────────────────
export async function updateUserSetting(
  uid: string,
  field: string,
  value: unknown
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    await updateDoc(userRef, { [field]: value });
  } else {
    await setDoc(userRef, { [field]: value }, { merge: true });
  }
}

// ─── Upload avatar to Firebase Storage, return public URL ─────────────────────
export async function uploadAvatar(uid: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `avatars/${uid}/avatar.${ext}`;
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  // Persist URL in user doc
  await updateUserSetting(uid, 'avatarURL', url);
  return url;
}

// ─── Account helpers ──────────────────────────────────────────────────────────
export async function addAccount(
  uid: string,
  account: Omit<SettingsAccount, 'id'>
): Promise<SettingsAccount> {
  const ref = collection(db, 'users', uid, 'accounts');
  const docRef = await addDoc(ref, { ...account, createdAt: serverTimestamp() });
  return { id: docRef.id, ...account };
}

export async function updateAccount(
  uid: string,
  accountId: string,
  changes: Partial<Omit<SettingsAccount, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'accounts', accountId), changes);
}

export async function deleteAccount(uid: string, accountId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'accounts', accountId));
}

// ─── Category helpers ─────────────────────────────────────────────────────────
export async function addCategory(
  uid: string,
  category: Omit<SettingsCategory, 'id'>
): Promise<SettingsCategory> {
  const ref = collection(db, 'users', uid, 'categories');
  const docRef = await addDoc(ref, category);
  return { id: docRef.id, ...category };
}

export async function updateCategory(
  uid: string,
  categoryId: string,
  changes: Partial<Omit<SettingsCategory, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'categories', categoryId), changes);
}

export async function deleteCategory(uid: string, categoryId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'categories', categoryId));
}
